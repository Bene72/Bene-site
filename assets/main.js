(() => {
  'use strict';

  /* -------------------------------------------------------------
     Anti-clickjacking : on sort d'une éventuelle iframe.
     (présent dans la base, absent du zip — restauré)
     ------------------------------------------------------------- */
  if (window.self !== window.top) {
    try { window.top.location = window.self.location; } catch (_) { /* cross-origin, ignore */ }
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  /* -------------------------------------------------------------
     Navigation mobile
     ------------------------------------------------------------- */
  function initNavigation() {
    const burger = $('.nav-burger');
    const drawer = $('#mobile-menu');
    if (!burger || !drawer) return;

    const close = () => {
      drawer.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Ouvrir le menu');
    };

    burger.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });

    $$('a', drawer).forEach(link => link.addEventListener('click', close));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && drawer.classList.contains('open')) {
        close();
        burger.focus();
      }
    });
  }

  /* -------------------------------------------------------------
     Reveal au scroll — fallback léger, complémentaire à premium.js.
     IMPORTANT : ne cible QUE les éléments dont premium.js (GSAP)
     n'est pas déjà responsable, pour éviter tout conflit d'anim
     (double moteur sur les mêmes propriétés opacity/transform).
     Les scripts GSAP/ScrollTrigger sont chargés en `defer` juste
     après ce fichier dans le <head>, donc au moment où
     DOMContentLoaded se déclenche ici, window.gsap est déjà défini
     s'il a chargé correctement — d'où le test ci-dessous.
     ------------------------------------------------------------- */
  function initReveals() {
    // Sections sans aucune animation d'entrée côté premium.js.
    $$('.contact-info, .contact-form').forEach(el => el.classList.add('fade-up'));

    const elements = $$('.fade-up');
    if (!elements.length) return;

    if (reduceMotion.matches) {
      elements.forEach(el => el.classList.add('visible'));
      return;
    }

    if (!('IntersectionObserver' in window)) {
      elements.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    elements.forEach(el => observer.observe(el));
  }

  /* -------------------------------------------------------------
     Halo réactif au curseur sur les cards — desktop uniquement.
     Nouveauté sans équivalent dans premium.js, aucun conflit
     (agit sur --mx/--my, une couche visuelle séparée du
     transform/opacity que GSAP anime sur ces mêmes cards).
     ------------------------------------------------------------- */
  function initCardLight() {
    if (reduceMotion.matches || !window.matchMedia('(pointer: fine)').matches) return;

    $$('.disc-card, .service-card, .testi-card').forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mx', `${x}%`);
        card.style.setProperty('--my', `${y}%`);
      });
    });
  }

  /* -------------------------------------------------------------
     Formulaire de contact — flux mailto, honeypot, rate-limit
     ET vérification comportementale anti-bot (restaurée : absente
     du zip, qui ne gardait que honeypot + rate-limit).
     ------------------------------------------------------------- */
  function initContactForm() {
    const form = $('#contact-form');
    const success = $('#form-success');
    const button = $('#submit-btn');
    if (!form || !button) return;

    const email = String.fromCharCode(...[98,101,110,101,100,101,116,116,111,46,97,108,108,101,110]) +
      '@' + String.fromCharCode(...[103,109,97,105,108,46,99,111,109]);
    const emailRx = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

    // Rate limit : 3 tentatives / 10 min
    let attempts = 0;
    let resetAt = Date.now() + 600000;
    const allowed = () => {
      const now = Date.now();
      if (now > resetAt) { attempts = 0; resetAt = now + 600000; }
      if (attempts >= 3) return false;
      attempts += 1;
      return true;
    };

    // Vérification comportementale : un vrai humain bouge la souris /
    // touche l'écran avant de soumettre, et ne remplit pas le
    // formulaire en moins de 2.5s (bot qui remplit instantanément).
    let interacted = false;
    let focusTime = 0;
    document.addEventListener('mousemove', () => { interacted = true; }, { once: true, passive: true });
    document.addEventListener('touchstart', () => { interacted = true; }, { once: true, passive: true });
    form.addEventListener('focusin', () => {
      if (!focusTime) focusTime = Date.now();
    }, { once: true });

    const isHuman = () => {
      if (!interacted) return false;
      if (focusTime && (Date.now() - focusTime) < 2500) return false;
      return true;
    };

    const clean = (value, max = 500) => String(value || '').replace(/[<>"']/g, '').slice(0, max);

    form.addEventListener('submit', event => {
      event.preventDefault();

      const honeypot = form.querySelector('[name="hp_field"]');
      if (honeypot?.value) return;

      if (!allowed()) {
        alert('Trop de tentatives. Merci de réessayer dans quelques minutes.');
        return;
      }

      if (!isHuman()) {
        // On ne dit rien au bot : on affiche juste le message de succès
        // sans envoyer le mail, comme dans la version de base.
        if (success) success.style.display = 'block';
        return;
      }

      const data = new FormData(form);
      const firstName = clean(data.get('prenom'), 60).trim();
      const mail = clean(data.get('email'), 120).trim();

      if (!firstName) {
        $('#prenom')?.focus();
        return;
      }
      if (!emailRx.test(mail)) {
        $('#email')?.focus();
        return;
      }

      const subject = encodeURIComponent('Demande de coaching Ben&Fit');
      const body = encodeURIComponent([
        `Prénom: ${firstName}`,
        `Nom: ${clean(data.get('nom'), 80)}`,
        `Email: ${mail}`,
        `Tél: ${clean(data.get('telephone'), 20)}`,
        `Objectif: ${clean(data.get('objectif'), 100)}`,
        '',
        clean(data.get('message'), 1000),
        '',
        '---',
        `Envoyé: ${new Date().toISOString()}`
      ].join('\n'));

      button.disabled = true;
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;

      setTimeout(() => {
        if (success) {
          success.style.display = 'block';
          success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        button.disabled = false;
      }, 400);
    });
  }

  /* -------------------------------------------------------------
     Prefetch — une seule implémentation (le fichier de base la
     dupliquait 3 fois, dont une fois dans du code mort après un
     `return`).
     ------------------------------------------------------------- */
  function initPrefetch() {
    let done = false;
    const run = () => {
      if (done) return;
      done = true;
      [
        '/assets/fonts/barlow-latin-300-normal.woff2',
        '/assets/fonts/barlow-condensed-latin-900-normal.woff2',
        '/images/gallery-main.webp',
        '/images/gallery-lemans.webp',
        '/images/gallery-throwdown.webp'
      ].forEach(href => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        link.as = href.endsWith('.woff2') ? 'font' : 'image';
        if (href.endsWith('.woff2')) link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
    };
    window.addEventListener('scroll', run, { once: true, passive: true });
    setTimeout(run, 3000);
  }

  /* -------------------------------------------------------------
     Boot
     Note : pas de nav-progress ni de parallaxe hero ici — déjà
     gérés par premium.js (ScrollTrigger). Les dupliquer ferait
     tourner deux boucles de scroll pour le même résultat.
     ------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initReveals();
    initCardLight();
    initContactForm();
    initPrefetch();
  });
})();

/**
 * Ben&Fit — Motion Layer v4 (Luxury Edition)
 * Stack: GSAP 3 + ScrollTrigger + Lenis
 *
 * GARDÉ   : Lenis · Text Reveal · Parallaxe hero · ScrollTrigger · Aurora · Reflet · Orbital
 * SUPPRIMÉ: Curseur custom · Tilt 3D cartes · Magnet boutons · Glow border tournant
 */
(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  function init() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof Lenis === 'undefined') {
      setTimeout(init, 50);
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    /* ══ 1. LENIS SMOOTH SCROLL ═══════════════════════════════ */
    const lenis = new Lenis({
      duration: 1.4,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 2,
      wheelMultiplier: 1,
      infinite: false,
      autoResize: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    function rafLoop(time) {
      lenis.raf(time);
      requestAnimationFrame(rafLoop);
    }
    requestAnimationFrame(rafLoop);
    gsap.ticker.lagSmoothing(0);

    /* Ancres nav via Lenis */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -73, duration: 1.8 });
      });
    });

    /* ══ 2. PAGE LOADER ═══════════════════════════════════════ */
    const pageLoader = document.querySelector('.page-loader');
    if (pageLoader) {
      gsap.to(pageLoader, {
        scaleX: 0, transformOrigin: 'right center',
        duration: 1.2, ease: 'expo.inOut', delay: 0.1,
        onComplete: () => pageLoader.remove()
      });
    }

    /* ══ 3. TEXT REVEAL ═══════════════════════════════════════ */
    function wrapLinesInMask(el) {
      const html = el.innerHTML;
      const parts = html.split(/<br\s*\/?>/gi);
      el.innerHTML = parts.map(p =>
        `<span class="reveal-mask"><span class="reveal-inner">${p}</span></span>`
      ).join('');
      return el.querySelectorAll('.reveal-inner');
    }

    /* Hero */
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      const lines = wrapLinesInMask(heroTitle);
      gsap.set(lines, { yPercent: 110, opacity: 0 });
      gsap.to(lines, {
        yPercent: 0, opacity: 1,
        duration: 1.2, ease: 'power4.out',
        stagger: 0.13, delay: 0.4
      });
    }

    gsap.from('.hero-tag',  { opacity: 0, x: -24, duration: 1.0, ease: 'power3.out', delay: 0.2 });
    gsap.from('.hero-signature', { opacity: 0, x: -16, duration: 1.0, ease: 'power3.out', delay: 0.65 });
    gsap.from('.hero-desc', { opacity: 0, y: 20,  duration: 1.0, ease: 'power3.out', delay: 0.85 });
    gsap.from('.hero-btns', { opacity: 0, y: 16,  duration: 0.9, ease: 'power3.out', delay: 1.05 });
    gsap.from('.hero-stats',{ opacity: 0,          duration: 0.9,                    delay: 1.1  });
    gsap.from('nav',        { y: -70, opacity: 0,  duration: 1.1, ease: 'power3.out', delay: 0.05 });
    gsap.from('.hero-right picture img', {
      scale: 1.06, opacity: 0, duration: 1.6, ease: 'power2.out', delay: 0.1
    });

    /* Section titles */
    document.querySelectorAll('.section-title').forEach(el => {
      if (el.closest('.hero')) return;
      const lines = wrapLinesInMask(el);
      gsap.set(lines, { yPercent: 105, opacity: 0 });
      ScrollTrigger.create({
        trigger: el, start: 'top 85%', once: true,
        onEnter: () => gsap.to(lines, {
          yPercent: 0, opacity: 1,
          duration: 1.0, ease: 'power4.out', stagger: 0.1
        })
      });
    });


    /* Signature section — reveal séquentiel */
    const sigSection = document.querySelector('.signature-section');
    if (sigSection) {
      ScrollTrigger.create({
        trigger: sigSection, start: 'top 75%', once: true,
        onEnter: () => {
          gsap.from('.sig-number', { opacity: 0, scale: 0.85, duration: 1.0, ease: 'power3.out' });
          gsap.from('.sig-divider', { scaleY: 0, duration: 0.9, ease: 'power3.out', transformOrigin: 'center', delay: 0.15 });
          gsap.from('.sig-lead, .sig-sub', { opacity: 0, y: 24, duration: 0.85, ease: 'power3.out', stagger: 0.12, delay: 0.25 });
          gsap.from('.sig-manifesto', { opacity: 0, x: 24, duration: 0.9, ease: 'power3.out', delay: 0.4 });
        }
      });
    }

    document.querySelectorAll('.section-tag').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        opacity: 0, x: -18, duration: 0.8, ease: 'power3.out'
      });
    });

    /* ══ 4. SCROLL-DRIVEN ANIMATIONS ══════════════════════════ */
    document.querySelectorAll('.fade-up').forEach(el => el.classList.add('gsap-ready'));

    const staggerGroups = [
      ['.disc-card',    0.10, 50, 0.75],
      ['.service-card', 0.13, 55, 0.85],
      ['.testi-card',   0.13, 35, 0.75],
    ];
    staggerGroups.forEach(([sel, stg, y, dur]) => {
      gsap.utils.toArray(sel).forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          opacity: 0, y, duration: dur, ease: 'power3.out', delay: (i % 3) * stg
        });
      });
    });

    gsap.utils.toArray('.gallery-item').forEach((item, i) => {
      gsap.from(item, {
        scrollTrigger: { trigger: item, start: 'top 90%', once: true },
        opacity: 0, scale: 1.03, duration: 1.1, ease: 'power2.out', delay: i * 0.07
      });
    });

    gsap.utils.toArray('.about-text').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 89%', once: true },
        opacity: 0, y: 24, duration: 0.8, ease: 'power3.out'
      });
    });

    /* Compteurs stats */
    document.querySelectorAll('.stat-num').forEach(el => {
      const raw    = el.textContent.replace('+', '').trim();
      const target = parseInt(raw, 10);
      if (isNaN(target)) return;
      el.textContent = '0';
      ScrollTrigger.create({
        trigger: el, start: 'top 90%', once: true,
        onEnter: () => gsap.to({ val: 0 }, {
          val: target, duration: 2.2, ease: 'power2.out',
          onUpdate: function () {
            el.textContent = Math.round(this.targets()[0].val) + (raw !== String(target) ? '+' : '');
          }
        })
      });
    });

    /* Compteurs prix */
    document.querySelectorAll('.service-price').forEach(el => {
      const raw    = el.textContent.replace(/[^\d]/g, '');
      const target = parseInt(raw, 10);
      if (isNaN(target)) return;
      ScrollTrigger.create({
        trigger: el, start: 'top 85%', once: true,
        onEnter: () => gsap.to({ val: 0 }, {
          val: target, duration: 1.6, ease: 'power2.out',
          onUpdate: function () {
            el.textContent = Math.round(this.targets()[0].val) + ' €';
          }
        })
      });
    });

    /* Parallaxe scrub sections */
    gsap.to('.about-img-wrap img', {
      scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: 2 },
      yPercent: -10, ease: 'none'
    });
    gsap.to('.gallery-item.span-col img', {
      scrollTrigger: { trigger: '.gallery', start: 'top bottom', end: 'bottom top', scrub: 2 },
      yPercent: -7, ease: 'none'
    });
    gsap.to('.cta-strip-title', {
      scrollTrigger: { trigger: '.cta-strip', start: 'top bottom', end: 'bottom top', scrub: 1.5 },
      x: -35, ease: 'none'
    });

    /* ══ 5. PARALLAXE SOURIS HERO — léger, pas de tilt ════════ */
    const isTouchDevice = window.matchMedia('(hover: none)').matches;
    if (!isTouchDevice) {
      const heroSection = document.querySelector('.hero');
      const heroImg     = document.querySelector('.hero-right');
      const heroOverlay = document.querySelector('.hero-overlay-logo');

      if (heroSection && heroImg) {
        let ticking = false;
        heroSection.addEventListener('mousemove', e => {
          if (ticking) return;
          ticking = true;
          requestAnimationFrame(() => {
            const r  = heroSection.getBoundingClientRect();
            const nx = (e.clientX - r.left) / r.width  - 0.5;
            const ny = (e.clientY - r.top)  / r.height - 0.5;
            /* Translation douce uniquement — pas de tilt/rotateY */
            gsap.to(heroImg, { x: nx * -14, y: ny * -8, duration: 1.4, ease: 'power2.out' });
            if (heroOverlay) {
              gsap.to(heroOverlay, { x: nx * 22, y: ny * 14, duration: 1.6, ease: 'power2.out' });
            }
            ticking = false;
          });
        });
        heroSection.addEventListener('mouseleave', () => {
          gsap.to([heroImg, heroOverlay], {
            x: 0, y: 0, duration: 1.8, ease: 'power2.out'
          });
        });
      }
    }

    /* ══ 6. NAV PROGRESS + SCROLLED STATE ════════════════════ */
    const navEl      = document.querySelector('nav');
    const progressBar = document.querySelector('.nav-progress');

    ScrollTrigger.create({
      trigger: document.body, start: 'top top', end: 'bottom bottom',
      onUpdate: self => {
        if (progressBar) gsap.set(progressBar, { scaleX: self.progress, transformOrigin: 'left center' });
        navEl.classList.toggle('nav--scrolled', self.scroll() > 80);
      }
    });

    /* ══ 7. PREFETCH SCROLL ═══════════════════════════════════ */
    let _pf = false;
    const _doPrefetch = () => {
      if (_pf) return; _pf = true;
      ['/assets/fonts/barlow-latin-300-normal.woff2',
       '/assets/fonts/barlow-condensed-latin-900-normal.woff2',
       '/images/gallery-main.webp',
       '/images/gallery-lemans.webp',
       '/images/gallery-throwdown.webp'
      ].forEach(href => {
        const l = document.createElement('link');
        l.rel = 'prefetch'; l.href = href;
        l.as  = href.endsWith('.woff2') ? 'font' : 'image';
        if (href.endsWith('.woff2')) l.crossOrigin = 'anonymous';
        document.head.appendChild(l);
      });
    };
    window.addEventListener('scroll', _doPrefetch, { once: true, passive: true });
    setTimeout(_doPrefetch, 3000);

  } /* end init() */

  document.addEventListener('DOMContentLoaded', init);
})();

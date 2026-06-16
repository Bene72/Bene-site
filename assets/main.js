(function () {
'use strict';
if (window.self !== window.top) {
try { window.top.location = window.self.location; } catch (_) { }
}
const _buildEmail = (function () {
const a = [98,101,110,101,100,101,116,116,111,46,97,108,108,101,110];
const b = [103,109,97,105,108,46,99,111,109];
return a.map(c => String.fromCharCode(c)).join('') +
'\u0040' +
b.map(c => String.fromCharCode(c)).join('');
document.addEventListener('DOMContentLoaded',()=>{
let _pf=false;
const _doPrefetch=()=>{
if(_pf)return;_pf=true;
['/assets/fonts/barlow-latin-300-normal.woff2','/assets/fonts/barlow-condensed-latin-900-normal.woff2','/images/gallery-main.webp','/images/gallery-lemans.webp','/images/gallery-throwdown.webp'].forEach(href=>{
const l=document.createElement('link');
l.rel='prefetch';l.href=href;
l.as=href.endsWith('.woff2')?'font':'image';
if(href.endsWith('.woff2'))l.crossOrigin='anonymous';
document.head.appendChild(l);
});
};
window.addEventListener('scroll',_doPrefetch,{once:true,passive:true});
setTimeout(_doPrefetch,3000);
});
})();
const _rl = { count: 0, reset: Date.now() + 600_000 };
function _checkRate() {
const now = Date.now();
if (now > _rl.reset) { _rl.count = 0; _rl.reset = now + 600_000; }
if (_rl.count >= 3) return false;
_rl.count++;
return true;
}
let _interacted = false;
let _focusTime = 0;
document.addEventListener('mousemove', () => { _interacted = true; }, { once: true, passive: true });
document.addEventListener('touchstart', () => { _interacted = true; }, { once: true, passive: true });
document.addEventListener('DOMContentLoaded', () => {
const form = document.getElementById('contact-form');
if (form) {
form.addEventListener('focusin', () => {
if (!_focusTime) _focusTime = Date.now();
}, { once: true });
}
});
function _isHuman() {
if (!_interacted) return false;
if (_focusTime && (Date.now() - _focusTime) < 2500) return false;
return true;
}
function _san(s, maxLen) {
return String(s || '').replace(/[<>"']/g, '').substring(0, maxLen || 500);
}
document.addEventListener('DOMContentLoaded', () => {
const form = document.getElementById('contact-form');
const success = document.getElementById('form-success');
const btn = document.getElementById('submit-btn');
if (!form) return;
form.addEventListener('submit', function (e) {
e.preventDefault();
const hp = form.querySelector('[name="hp_field"]');
if (hp && hp.value.length > 0) return;
if (!_checkRate()) {
alert('Trop de tentatives. Merci de réessayer dans quelques minutes.');
return;
}
if (!_isHuman()) {
success.style.display = 'block';
return;
}
const data = new FormData(form);
const email = (data.get('email') || '').trim();
const prenom = (data.get('prenom') || '').trim();
const emailRx = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
if (!prenom || prenom.length > 60) {
document.getElementById('prenom').focus();
return;
}
if (!emailRx.test(email) || email.length > 120) {
document.getElementById('email').focus();
return;
}
const subject = encodeURIComponent('Demande de coaching Ben\u0026Fit');
const body = encodeURIComponent(
'Pr\u00e9nom: ' + _san(data.get('prenom'), 60) + '\n' +
'Nom: ' + _san(data.get('nom'), 80) + '\n' +
'Email: ' + _san(data.get('email'), 120) + '\n' +
'T\u00e9l: ' + _san(data.get('telephone'), 20) + '\n' +
'Objectif: ' + _san(data.get('objectif'), 100) + '\n\n' +
_san(data.get('message'), 1000) +
'\n\n---\nEnvoy\u00e9: ' + new Date().toISOString()
);
btn.disabled = true;
window.location.href = 'mailto:' + _buildEmail + '?subject=' + subject + '&body=' + body;
setTimeout(() => {
success.style.display = 'block';
success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
btn.disabled = false;
}, 400);
});
});
document.addEventListener('DOMContentLoaded', () => {
const burger = document.querySelector('.nav-burger');
const drawer = document.getElementById('mobile-menu');
if (!burger || !drawer) return;
burger.addEventListener('click', () => {
const isOpen = drawer.classList.toggle('open');
burger.setAttribute('aria-expanded', String(isOpen));
burger.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
});
drawer.querySelectorAll('a').forEach(link => {
link.addEventListener('click', () => {
drawer.classList.remove('open');
burger.setAttribute('aria-expanded', 'false');
burger.setAttribute('aria-label', 'Ouvrir le menu');
});
});
document.addEventListener('keydown', e => {
if (e.key === 'Escape' && drawer.classList.contains('open')) {
drawer.classList.remove('open');
burger.setAttribute('aria-expanded', 'false');
burger.setAttribute('aria-label', 'Ouvrir le menu');
burger.focus();
}
});
});
document.addEventListener('DOMContentLoaded', () => {
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReduced) {
document.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
return;
}
const obs = new IntersectionObserver((entries) => {
entries.forEach((entry, i) => {
if (entry.isIntersecting) {
setTimeout(() => entry.target.classList.add('visible'), i * 80);
obs.unobserve(entry.target);
}
});
}, { threshold: 0.12 });
document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
});
document.addEventListener('DOMContentLoaded',()=>{
let _pf=false;
const _doPrefetch=()=>{
if(_pf)return;_pf=true;
['/assets/fonts/barlow-latin-300-normal.woff2','/assets/fonts/barlow-condensed-latin-900-normal.woff2','/images/gallery-main.webp','/images/gallery-lemans.webp','/images/gallery-throwdown.webp'].forEach(href=>{
const l=document.createElement('link');
l.rel='prefetch';l.href=href;
l.as=href.endsWith('.woff2')?'font':'image';
if(href.endsWith('.woff2'))l.crossOrigin='anonymous';
document.head.appendChild(l);
});
};
window.addEventListener('scroll',_doPrefetch,{once:true,passive:true});
setTimeout(_doPrefetch,3000);
});
})();
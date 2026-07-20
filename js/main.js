import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LANG_KEY = 'hub-lang';
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- i18n ---------- */
function applyLang(lang) {
  const dict = window.I18N[lang] || window.I18N.en;
  document.documentElement.setAttribute('lang', lang);

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) el.textContent = dict[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key] !== undefined) el.setAttribute('placeholder', dict[key]);
  });

  if (dict['meta.title.current']) document.title = dict['meta.title.current'];
  const titleKey = document.body.getAttribute('data-title-key');
  if (titleKey && dict[titleKey]) document.title = dict[titleKey];
  const descKey = document.body.getAttribute('data-desc-key');
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && descKey && dict[descKey]) metaDesc.setAttribute('content', dict[descKey]);

  document.querySelectorAll('.lang-switch button').forEach((btn) => {
    btn.classList.toggle('is-active', btn.getAttribute('data-lang') === lang);
  });

  localStorage.setItem(LANG_KEY, lang);
  window.dispatchEvent(new CustomEvent('hub:langchange', { detail: { lang } }));
}

function initLangSwitch() {
  const saved = localStorage.getItem(LANG_KEY) || 'en';
  applyLang(saved);
  document.querySelectorAll('[data-lang]').forEach((btn) => {
    btn.addEventListener('click', () => applyLang(btn.getAttribute('data-lang')));
  });
}

/* ---------- Lenis smooth scroll + GSAP sync ---------- */
function initSmoothScroll() {
  if (prefersReducedMotion) return null;
  const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

/* ---------- Header ---------- */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initMobileNav() {
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.mobile-nav');
  if (!burger || !nav) return;
  const close = () => {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('nav-open', open);
  });
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
}

/* ---------- Reveal on scroll (safe-by-default, see css/global.css) ---------- */
function initReveal() {
  document.documentElement.classList.add('js-ready');
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in-view'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => observer.observe(el));

  // Safety net — never leave content permanently hidden.
  setTimeout(() => items.forEach((el) => el.classList.add('in-view')), 2500);
}

/* ---------- Contact form (client-only, mailto: fallback) ---------- */
function initForms() {
  document.querySelectorAll('form[data-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const name = form.querySelector('[name="name"]')?.value ?? '';
      const email = form.querySelector('[name="email"]')?.value ?? '';
      const message = form.querySelector('[name="message"]')?.value ?? '';
      const subject = encodeURIComponent(`Project inquiry from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:clarify.plan@mail.ru?subject=${subject}&body=${body}`;

      const success = form.querySelector('.form-success');
      if (success) success.classList.add('is-visible');
      form.reset();
    });
  });
}

/* ---------- Magnetic buttons ---------- */
function initMagneticButtons() {
  if (prefersReducedMotion) return;
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * 0.25, y: y * 0.35, duration: 0.4, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

/* ---------- Hero headline: orchestrated load-in ---------- */
function initHeroReveal() {
  const heading = document.querySelector('.hero h1');
  if (!heading) return;
  const words = heading.textContent.trim().split(/\s+/);
  heading.innerHTML = words
    .map((w) => `<span class="word" style="display:inline-block; overflow:hidden; vertical-align:top;"><span style="display:inline-block;">${w}</span></span>`)
    .join(' ');
  const spans = heading.querySelectorAll('.word > span');
  if (prefersReducedMotion) {
    gsap.set(spans, { y: 0 });
    return;
  }
  gsap.set(spans, { y: '110%' });
  gsap.to(spans, {
    y: '0%',
    duration: 0.9,
    stagger: 0.045,
    ease: 'power4.out',
    delay: 0.15,
  });
}

/* ---------- Hero ambient star field ---------- */
function initStarField() {
  const canvas = document.querySelector('.hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  let raf = null;

  function resize() {
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;
    const count = Math.floor((canvas.clientWidth * canvas.clientHeight) / 9000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3,
      speed: Math.random() * 0.15 + 0.03,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function drawStatic() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(236,234,228,0.5)';
    stars.forEach((s) => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function tick(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach((s) => {
      const twinkle = 0.35 + Math.abs(Math.sin(t * 0.001 * s.speed + s.phase)) * 0.5;
      ctx.fillStyle = `rgba(236,234,228,${twinkle})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    raf = requestAnimationFrame(tick);
  }

  resize();
  window.addEventListener('resize', () => {
    cancelAnimationFrame(raf);
    resize();
    if (prefersReducedMotion) drawStatic();
    else raf = requestAnimationFrame(tick);
  });

  if (prefersReducedMotion) drawStatic();
  else raf = requestAnimationFrame(tick);
}

document.addEventListener('DOMContentLoaded', () => {
  initLangSwitch();
  const lenis = initSmoothScroll();
  initStickyHeader();
  initMobileNav();
  initReveal();
  initForms();
  initMagneticButtons();
  initHeroReveal();
  initStarField();
  window.__hubLenis = lenis;
});

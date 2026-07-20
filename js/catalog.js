/* ==========================================================================
   Featured Work — "catalog" page-flip mechanic
   Desktop (>=1024px, motion allowed): pinned scroll-scrubbed page turns.
   Mobile / reduced-motion / single-page catalog: plain vertical stack.
   ========================================================================== */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setupCatalog(catalog) {
  const pages = Array.from(catalog.querySelectorAll('.catalog-page'));
  const progressCount = catalog.querySelector('[data-progress-count]');
  const N = pages.length;
  if (N === 0) return;

  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
  if (prefersReducedMotion || !isDesktop || N === 1) {
    catalog.classList.add('catalog--mobile');
    pages.forEach((p) => p.classList.add('reveal'));
    return;
  }

  gsap.set(pages, { opacity: 0, pointerEvents: 'none', zIndex: 1 });
  gsap.set(pages[0], { opacity: 1, pointerEvents: 'auto', rotateY: 0, x: '0%', zIndex: 2 });

  function renderAt(floatIndex) {
    const clamped = Math.max(0, Math.min(N - 1, floatIndex));
    const base = Math.floor(clamped);
    const frac = clamped - base;

    pages.forEach((page, i) => {
      if (i === base) {
        gsap.set(page, {
          opacity: 1 - frac * 0.85,
          rotateY: -frac * 14,
          x: `${-frac * 32}%`,
          pointerEvents: frac < 0.5 ? 'auto' : 'none',
          zIndex: 2,
        });
      } else if (i === base + 1) {
        gsap.set(page, {
          opacity: Math.min(1, frac * 1.4),
          rotateY: 0,
          x: `${(1 - frac) * 6}%`,
          pointerEvents: frac >= 0.5 ? 'auto' : 'none',
          zIndex: 3,
        });
      } else {
        gsap.set(page, { opacity: 0, pointerEvents: 'none', zIndex: 1 });
      }
    });

    const displayIndex = Math.round(clamped);
    if (progressCount) {
      progressCount.textContent = `${String(displayIndex + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}`;
    }
    catalog.style.setProperty('--catalog-progress', String(displayIndex / (N - 1)));
  }

  renderAt(0);

  const trigger = ScrollTrigger.create({
    trigger: catalog,
    start: 'top top',
    end: `+=${(N - 1) * 900}`,
    pin: true,
    scrub: 0.4,
    snap: { snapTo: 1 / (N - 1), duration: { min: 0.2, max: 0.4 }, ease: 'power1.inOut' },
    onUpdate: (self) => renderAt(self.progress * (N - 1)),
  });

  // Keyboard navigation — ArrowLeft/ArrowRight step one page while the
  // catalog is focused, in addition to plain scroll/wheel.
  catalog.setAttribute('tabindex', '0');
  catalog.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const current = Math.round(trigger.progress * (N - 1));
    const next = e.key === 'ArrowRight' ? Math.min(N - 1, current + 1) : Math.max(0, current - 1);
    const targetProgress = next / (N - 1);
    const targetScroll = trigger.start + (trigger.end - trigger.start) * targetProgress;
    if (window.__hubLenis) window.__hubLenis.scrollTo(targetScroll);
    else window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.catalog').forEach(setupCatalog);
});

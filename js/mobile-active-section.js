// Resalta dinámicamente la sección visible en la navegación inferior móvil
(function(){
  'use strict';

  const MOBILE_MAX_WIDTH = 800;

  function isMobile(){
    return window.innerWidth <= MOBILE_MAX_WIDTH || ('ontouchstart' in window && navigator.maxTouchPoints > 0);
  }

  function ready(fn){
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function initMobileActiveNav(){
    if (!isMobile()) return;

    const bottomNav = document.querySelector('.bottom-nav');
    if (!bottomNav) return;

    const buttons = Array.from(bottomNav.querySelectorAll('.bottom-nav__btn'));
    if (!buttons.length) return;

    const sections = Array.from(document.querySelectorAll('section.seccion[id]'));
    const sectionById = new Map(sections.map(s => [s.id, s]));

    // Mapa botón -> sección por data-seccion
    const buttonBySectionId = new Map();
    buttons.forEach(btn => {
      const sid = btn.getAttribute('data-seccion');
      if (sid && sectionById.has(sid)) buttonBySectionId.set(sid, btn);
    });

    if (!buttonBySectionId.size) return;

    let currentId = null;
    let clickLockUntil = 0;

    function setActive(id){
      if (!id || !buttonBySectionId.has(id)) return;
      currentId = id;
      buttons.forEach(b => {
        b.classList.toggle('activo', b.getAttribute('data-seccion') === id);
        if (b.classList.contains('activo')){
          b.setAttribute('aria-current','page');
        } else {
          b.removeAttribute('aria-current');
        }
      });
    }

    // Observador de intersección para detectar sección visible
    const io = ('IntersectionObserver' in window) ? new IntersectionObserver((entries)=>{
      // Ignorar cambios si estamos inmediatamente después de un click (para evitar parpadeos)
      if (Date.now() < clickLockUntil) return;

      // Elegir la entrada con mayor intersección
      let best = null;
      for (const e of entries){
        if (!best || e.intersectionRatio > best.intersectionRatio){
          best = e;
        }
      }
      if (best && best.isIntersecting && best.intersectionRatio >= 0.5){
        setActive(best.target.id);
      }
    }, { root: null, threshold: [0.25, 0.5, 0.75, 0.9], rootMargin: '0px 0px -20% 0px' }) : null;

    // Fallback por scroll si IntersectionObserver no está disponible
    function updateActiveByScroll(){
      if (io) return; // si hay IO activo no hace falta
      if (Date.now() < clickLockUntil) return;
      const vh = window.innerHeight;
      let bestId = null, bestScore = -1;
      sections.forEach(sec => {
        const r = sec.getBoundingClientRect();
        const visible = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
        const score = visible / Math.max(1, r.height);
        if (score > bestScore){ bestScore = score; bestId = sec.id; }
      });
      if (bestId && bestScore >= 0.5){ setActive(bestId); }
    }

    // Suscribir secciones al observador
    if (io){ sections.forEach(sec => io.observe(sec)); }
    else { window.addEventListener('scroll', updateActiveByScroll, { passive: true }); }

    // Al cargar, establecer el activo inicial (por .seccion.activa o visibilidad)
    const initial = document.querySelector('section.seccion.activa[id]');
    if (initial && buttonBySectionId.has(initial.id)) setActive(initial.id);
    else updateActiveByScroll();

    // Click en botones: scroll suave y bloqueo temporal de IO para evitar parpadeos
    buttons.forEach(btn => {
      btn.addEventListener('click', (e)=>{
        const id = btn.getAttribute('data-seccion');
        const target = sectionById.get(id);
        if (!target) return;
        e.preventDefault();
        clickLockUntil = Date.now() + 600; // 600ms de gracia para transición y posicionamiento
        setActive(id);
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // Recalcular en resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!isMobile()) return;
        updateActiveByScroll();
      }, 200);
    });
  }

  ready(initMobileActiveNav);
})();
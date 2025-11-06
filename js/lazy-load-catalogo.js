// Lazy loading mejorado para el catálogo
(function() {
    'use strict';

    // Configuración de Intersection Observer para lazy loading
    const config = {
        root: null,
        rootMargin: '50px',
        threshold: 0.01
    };

    // Observer para imágenes
    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                if (src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                }
                observer.unobserve(img);
            }
        });
    }, config);

    // Observer para tarjetas (animaciones)
    const cardObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, config);

    function initLazyLoading() {
        // Lazy load de imágenes
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(function(img) {
            imageObserver.observe(img);
        });

        // Animaciones de tarjetas
        const cards = document.querySelectorAll('.catalogo-card');
        cards.forEach(function(card) {
            cardObserver.observe(card);
        });
    }

    // Optimización de rendimiento: defer no crítico
    function deferNonCritical() {
        // Cargar scripts no críticos después del contenido principal
        if ('requestIdleCallback' in window) {
            requestIdleCallback(function() {
                initLazyLoading();
            });
        } else {
            setTimeout(initLazyLoading, 1);
        }
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', deferNonCritical);
    } else {
        deferNonCritical();
    }
})();



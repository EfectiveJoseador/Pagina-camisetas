/**
 * tiktok-banner.js
 *
 * La lógica de control del banner y del modal de migración a TikTok vive aquí.
 * Muestra una barra superior (sticky banner) verde y un modal emergente (popup)
 * con toda la información de la mudanza y la promoción de inauguración en TikTok.
 */
window.TikTokBanner = {

    STORAGE_KEY: 'tiktokBannerDismissed_v2', // Nueva clave para forzar la visualización a todos
    MODAL_STORAGE_KEY: 'tiktokModalDismissed_v2', // Clave para el modal emergente
    DISMISS_HOURS: 72,
    MODAL_DISMISS_HOURS: 24,
    TIKTOK_URL: 'https://www.tiktok.com/@camisetazo',

    isDismissed() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (!raw) return false;
            return (Date.now() - parseInt(raw, 10)) / 3600000 < this.DISMISS_HOURS;
        } catch (e) {
            return false;
        }
    },

    saveDismiss() {
        try {
            localStorage.setItem(this.STORAGE_KEY, Date.now().toString());
        } catch (e) {}
    },

    isModalDismissed() {
        try {
            const raw = localStorage.getItem(this.MODAL_STORAGE_KEY);
            if (!raw) return false;
            return (Date.now() - parseInt(raw, 10)) / 3600000 < this.MODAL_DISMISS_HOURS;
        } catch (e) {
            return false;
        }
    },

    saveModalDismiss() {
        try {
            localStorage.setItem(this.MODAL_STORAGE_KEY, Date.now().toString());
        } catch (e) {}
    },

    trackClick() {
        try {
            // GA4 event
            if (typeof gtag === 'function') {
                gtag('event', 'tiktok_migration_click', {
                    event_category: 'social',
                    event_label: 'tiktok_banner_cta'
                });
            }
            // Analytics module (si está disponible)
            if (window.Analytics && typeof window.Analytics.trackEvent === 'function') {
                window.Analytics.trackEvent('tiktok_migration_click');
            }
        } catch (e) {}
    },

    injectStyles() {
        // Estilos del Banner Sticky
        if (!document.getElementById('tiktokBannerStyles')) {
            const isInPages = window.location.pathname.includes('/pages/');
            const cssPath = (isInPages ? '../css/tiktok-banner.css' : '/css/tiktok-banner.css') + '?v=2';
            const link = document.createElement('link');
            link.id = 'tiktokBannerStyles';
            link.rel = 'stylesheet';
            link.href = cssPath;
            document.head.appendChild(link);
        }

        // Estilos del Modal Emergente
        if (!document.getElementById('tiktokModalStyles')) {
            const isInPages = window.location.pathname.includes('/pages/');
            const cssPath = (isInPages ? '../css/instagram-alert.css' : '/css/instagram-alert.css') + '?v=4';
            const link = document.createElement('link');
            link.id = 'tiktokModalStyles';
            link.rel = 'stylesheet';
            link.href = cssPath;
            document.head.appendChild(link);
        }
    },

    modalHTML: `
        <div class="ig-modal-overlay" id="igModalOverlay" role="dialog" aria-modal="true" aria-labelledby="igModalTitle">
            <div class="ig-modal" id="igModal">
                <button class="ig-modal-close" id="igModalClose" aria-label="Cerrar aviso" title="Cerrar">
                    <i class="fas fa-times"></i>
                </button>

                <div class="ig-modal-icon">
                    <i class="fab fa-tiktok"></i>
                </div>

                <div class="ig-modal-badge">
                    <i class="fas fa-circle"></i>
                    Migración Oficial
                </div>

                <h2 class="ig-modal-title" id="igModalTitle">
                    ¡Nos mudamos a<br><span>TikTok! 🚀</span>
                </h2>

                <div class="ig-modal-divider"></div>

                <p class="ig-modal-body">
                    Nuestra cuenta de Instagram ha sido suspendida. Para seguir brindándote la mejor atención y novedades, <strong>nos trasladamos oficialmente a TikTok</strong>.<br><br>
                    ¡Y lo celebramos a lo grande! Los primeros 100 seguidores en nuestra nueva cuenta <strong>@camisetazo</strong> obtienen un <strong>código de descuento del 15%</strong>.<br><br>
                    ¡Síguenos y envíanos la palabra <strong>'codigo'</strong> por privado en TikTok para reclamarlo!
                </p>

                <a href="https://www.tiktok.com/@camisetazo" target="_blank" rel="noopener" class="ig-modal-cta" id="igModalCTA">
                    <i class="fab fa-tiktok"></i>
                    Seguir en TikTok
                </a>

                <button class="ig-modal-dismiss" id="igModalDismiss">
                    Entendido, cerrar aviso
                </button>
            </div>
        </div>
    `,

    injectModal() {
        if (this.isModalDismissed()) return;
        if (document.getElementById('igModalOverlay')) return;

        document.body.insertAdjacentHTML('beforeend', this.modalHTML);
        const overlay = document.getElementById('igModalOverlay');
        if (!overlay) return;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => overlay.classList.add('ig-modal-visible'));
        });

        const close = () => {
            overlay.classList.remove('ig-modal-visible');
            this.saveModalDismiss();
            setTimeout(() => overlay.remove(), 400);
        };

        const closeBtn = document.getElementById('igModalClose');
        const dismissBtn = document.getElementById('igModalDismiss');
        const ctaBtn = document.getElementById('igModalCTA');

        if (closeBtn) closeBtn.addEventListener('click', close);
        if (dismissBtn) dismissBtn.addEventListener('click', close);
        if (ctaBtn) {
            ctaBtn.addEventListener('click', () => {
                this.trackClick();
            });
        }

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });

        const onEsc = (e) => {
            if (e.key === 'Escape') {
                close();
                document.removeEventListener('keydown', onEsc);
            }
        };
        document.addEventListener('keydown', onEsc);
    },

    init() {
        this.injectStyles();
        
        const run = () => {
            setTimeout(() => this.injectModal(), 800);
        };

        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            run();
        } else {
            document.addEventListener('DOMContentLoaded', run);
        }
    }
};

window.TikTokBanner.init();


window.InstagramAlert = {

    STORAGE_KEY: 'igAlertDismissed',
    DISMISS_HOURS: 24,

    modalHTML: `
        <div class="ig-modal-overlay" id="igModalOverlay" role="dialog" aria-modal="true" aria-labelledby="igModalTitle">
            <div class="ig-modal" id="igModal">
                <button class="ig-modal-close" id="igModalClose" aria-label="Cerrar aviso">
                    <i class="fas fa-times"></i>
                </button>

                <div class="ig-modal-icon">
                    <i class="fab fa-instagram" style="color: #ff3b30;"></i>
                </div>

                <div class="ig-modal-badge">
                    <i class="fas fa-circle"></i>
                    Aviso urgente
                </div>

                <h2 class="ig-modal-title" id="igModalTitle">
                    Cuenta de Instagram<br><span>Suspendida</span>
                </h2>

                <div class="ig-modal-divider"></div>

                <p class="ig-modal-body">
                    Nuestra cuenta de Instagram <strong>@camisetazo._</strong> ha sido suspendida temporalmente.<br><br>
                    Cualquier pedido, consulta o contacto debe realizarse <strong>exclusivamente a través de esta web</strong>.
                    No hagas pedidos ni pagos a través de otras cuentas no verificadas.
                </p>

                <a href="/pages/contacto.html" class="ig-modal-cta">
                    <i class="fas fa-envelope"></i>
                    Contactar por la Web
                </a>

                <button class="ig-modal-dismiss" id="igModalDismiss">
                    Entendido, cerrar este aviso
                </button>
            </div>
        </div>
    `,

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

    injectModal() {
        if (this.isDismissed()) return;
        if (document.getElementById('igModalOverlay')) return;

        document.body.insertAdjacentHTML('beforeend', this.modalHTML);
        const overlay = document.getElementById('igModalOverlay');
        if (!overlay) return;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => overlay.classList.add('ig-modal-visible'));
        });

        const close = () => {
            overlay.classList.remove('ig-modal-visible');
            this.saveDismiss();
            setTimeout(() => overlay.remove(), 400);
        };

        document.getElementById('igModalClose').addEventListener('click', close);
        document.getElementById('igModalDismiss').addEventListener('click', close);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
        document.addEventListener('keydown', function onEsc(e) {
            if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onEsc); }
        });
    },

    injectStyles() {
        if (document.getElementById('igAlertStyles')) return;
        const isInPages = window.location.pathname.includes('/pages/');
        const cssPath = (isInPages ? '../css/instagram-alert.css' : '/css/instagram-alert.css') + '?v=3';
        const link = document.createElement('link');
        link.id = 'igAlertStyles';
        link.rel = 'stylesheet';
        link.href = cssPath;
        document.head.appendChild(link);
    },

    init() {
        this.injectStyles();
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => this.injectModal(), 800);
        });
    }
};

window.InstagramAlert.init();

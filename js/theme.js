
(function () {
    const SW_VERSION = 'v4';
    const CLEANUP_KEY = 'sw_cleanup_' + SW_VERSION;

    if (!('serviceWorker' in navigator)) return;

    // ── Limpiar registros y cachés anteriores una sola vez por versión ──────
    if (!localStorage.getItem(CLEANUP_KEY)) {
        navigator.serviceWorker.getRegistrations().then(function (registrations) {
            registrations.forEach(function (reg) { reg.unregister(); });
        });
        if ('caches' in window) {
            caches.keys().then(function (names) {
                names.forEach(function (name) { caches.delete(name); });
            });
        }
        localStorage.setItem(CLEANUP_KEY, Date.now().toString());
    }

    // ── Registrar el nuevo SW ────────────────────────────────────────────────
    navigator.serviceWorker.register('/service-worker.js?v=4').then(function (registration) {
        // Si ya hay un SW esperando, activarlo de inmediato
        if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }

        // Detectar cuando se descarga un nuevo SW e instalarlo automáticamente
        registration.addEventListener('updatefound', function () {
            const newWorker = registration.installing;
            if (!newWorker) return;

            newWorker.addEventListener('statechange', function () {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // Hay una actualización lista → activarla sin esperar al cierre de tabs
                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                }
            });
        });
    }).catch(function () {});

    // ── Al tomar el control el nuevo SW, recargar suavemente ────────────────
    // Solo recarga si el usuario no está en medio de un formulario/checkout.
    var refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
        if (refreshing) return;
        refreshing = true;
        // No recargar en checkout para no interrumpir el flujo de pago
        var path = window.location.pathname;
        var isCheckout = path.includes('checkout') || path.includes('carrito');
        if (!isCheckout) {
            window.location.reload();
        }
    });
})();




window.ThemeManager = {
    init() {
        this.themeToggleBtn = document.getElementById('theme-toggle');
        
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
        } else {
            this.currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        this.applyTheme(this.currentTheme);

        if (this.themeToggleBtn) {
            const newBtn = this.themeToggleBtn.cloneNode(true);
            this.themeToggleBtn.parentNode.replaceChild(newBtn, this.themeToggleBtn);
            this.themeToggleBtn = newBtn;

            this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
            this.updateIcon();
        }
    },

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        this.updateIcon();
    },

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
            document.documentElement.classList.add('dark-theme');
            document.documentElement.classList.remove('light-theme');
        } else {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
            document.documentElement.classList.add('light-theme');
            document.documentElement.classList.remove('dark-theme');
        }
        localStorage.setItem('theme', theme);
    },

    updateIcon() {
        if (!this.themeToggleBtn) return;
        const icon = this.themeToggleBtn.querySelector('i');
        if (icon) {
            icon.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.ThemeManager.init();
});

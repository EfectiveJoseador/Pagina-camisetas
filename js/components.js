

const Components = {
    header: `
        <header class="main-header">
            <div class="container header-container">
                <a href="/index.html" class="logo-link">
                    <img src="/assets/logo/logo.png" alt="Camisetazo" class="logo-img">
                    <span>CAMISETAZO</span>
                </a>

                <nav class="nav-menu" id="navMenu">
                    <a href="/index.html" class="nav-link">Inicio</a>
                    <a href="/pages/catalogo.html" class="nav-link">Catálogo</a>
                    <a href="/pages/tienda.html" class="nav-link">Tienda</a>
                    <a href="/pages/quienes-somos.html" class="nav-link">Quiénes Somos</a>
                </nav>

                <div class="header-actions">
                    <a href="/pages/carrito.html" class="icon-btn" aria-label="Carrito">
                        <i class="fas fa-shopping-cart"></i>
                        <span class="cart-badge" id="cart-count">0</span>
                    </a>
                    <a href="/pages/login.html" class="icon-btn" aria-label="Usuario"><i class="fas fa-user"></i></a>
                    <button class="icon-btn" id="theme-toggle" aria-label="Cambiar tema"><i class="fas fa-moon"></i></button>
                    <button class="icon-btn mobile-menu-btn" id="mobile-menu-toggle" aria-label="Menú"><i class="fas fa-bars"></i></button>
                </div>
            </div>
        </header>
    `,

    footer: `
        <footer class="main-footer">
            <div class="container footer-grid">
                <div class="footer-col">
                    <h4>Camisetazo</h4>
                    <p class="text-muted">Tu tienda de confianza para camisetas de fútbol y ropa deportiva premium.</p>
                </div>
                <div class="footer-col">
                    <h4>Enlaces Rápidos</h4>
                    <ul class="footer-links">
                        <li><a href="/pages/catalogo.html">Catálogo</a></li>
                        <li><a href="/pages/quienes-somos.html">Sobre Nosotros</a></li>
                        <li><a href="/pages/contacto.html">Contacto</a></li>
                        <li><a href="/pages/faq.html">Preguntas Frecuentes</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Legal</h4>
                    <ul class="footer-links">
                        <li><a href="/pages/privacidad.html">Política de Privacidad</a></li>
                        <li><a href="/pages/cookies.html">Política de Cookies</a></li>
                        <li><a href="/pages/terminos.html">Términos y Condiciones</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Contacto</h4>
                    <ul class="footer-links">
                        <li><a href="mailto:camisetazocontacto@gmail.com"><i class="fas fa-envelope"></i> camisetazocontacto@gmail.com</a></li>
                    </ul>
                    <h4 style="margin-top: 1rem;">Síguenos</h4>
                    <div class="social-links">
                        <a href="https://www.instagram.com/camisetazo._/" target="_blank" rel="noopener" class="social-link" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 Camisetazo. Todos los derechos reservados.</p>
            </div>
        </footer>
    `,

    load() {
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            headerPlaceholder.outerHTML = this.header;
        } else {
            document.body.insertAdjacentHTML('afterbegin', this.header);
        }
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.outerHTML = this.footer;
        } else {
            document.body.insertAdjacentHTML('beforeend', this.footer);
        }
        const menuBtn = document.getElementById('mobile-menu-toggle');
        const navMenu = document.getElementById('navMenu');
        if (menuBtn && navMenu) {
            menuBtn.addEventListener('click', () => {
                navMenu.classList.toggle('open');
                const icon = menuBtn.querySelector('i');
                if (navMenu.classList.contains('open')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        }
        if (window.ThemeManager) {
            window.ThemeManager.init();
        }
        window.dispatchEvent(new CustomEvent('components:ready'));
        CookieConsent.init();
    }
};


const CookieConsent = {
    banner: `
        <div id="cookie-consent" class="cookie-consent" role="dialog">
            <div id="cookie-main-view" class="cookie-consent-content">
                <div class="cookie-text">
                    <h3><i class="fas fa-cookie-bite"></i> Experiencia Personalizada</h3>
                    <p>Utilizamos cookies para optimizar tu navegación y mostrarte las mejores camisetas de fútbol según tus gustos. <a href="/pages/cookies.html">Ver política</a></p>
                </div>
                <div class="cookie-buttons">
                    <button id="cookie-accept-all" class="cookie-btn cookie-btn-primary">ACEPTAR Y CONTINUAR</button>
                    <button id="cookie-show-settings" class="cookie-link">Configuración mínima</button>
                </div>
            </div>
            
            <div id="cookie-settings-view" class="cookie-settings-content" style="display: none;">
                <div class="cookie-text">
                    <h3>Configuración de Privacidad</h3>
                    <p>Selecciona qué cookies deseas permitir. Las cookies técnicas son obligatorias para el funcionamiento de la tienda.</p>
                </div>
                
                <div class="cookie-options-list">
                    <div class="cookie-option-item">
                        <div class="option-info">
                            <span>Técnicas y Necesarias</span>
                            <p>Obligatorias para el carrito y el inicio de sesión.</p>
                        </div>
                        <input type="checkbox" checked disabled>
                    </div>
                    <div class="cookie-option-item">
                        <div class="option-info">
                            <span>Estadísticas y Análisis</span>
                            <p>Nos ayudan a saber qué camisetas son las más populares.</p>
                        </div>
                        <input type="checkbox" id="check-analytics">
                    </div>
                    <div class="cookie-option-item">
                        <div class="option-info">
                            <span>Marketing Personalizado</span>
                            <p>Para ofrecerte ofertas exclusivas en tus equipos favoritos.</p>
                        </div>
                        <input type="checkbox" id="check-marketing">
                    </div>
                </div>

                <div class="cookie-buttons">
                    <button id="cookie-accept-all-2" class="cookie-btn cookie-btn-primary">ACEPTAR TODAS LAS COOKIES</button>
                    <button id="cookie-save-selected" class="cookie-link">Guardar configuración seleccionada</button>
                </div>
            </div>
        </div>
    `,

    styles: `
        <style id="cookie-consent-styles">
            .cookie-consent {
                position: fixed;
                bottom: 2rem;
                left: 50%;
                transform: translateX(-50%) translateY(120%);
                width: 90%;
                max-width: 450px;
                background: rgba(10, 10, 15, 0.98);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(168, 85, 247, 0.3);
                border-radius: 24px;
                padding: 1.75rem;
                z-index: 99999;
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
                opacity: 0;
                transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .cookie-consent.show {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
            .cookie-consent.expanded {
                max-width: 600px;
                bottom: 50%;
                transform: translateX(-50%) translateY(50%);
            }
            .cookie-consent-content, .cookie-settings-content {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
                text-align: center;
            }
            .cookie-text h3 {
                font-size: 1.3rem;
                font-weight: 800;
                color: #fff;
                margin-bottom: 0.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.75rem;
            }
            .cookie-text h3 i { color: #a855f7; }
            .cookie-text p {
                font-size: 0.95rem;
                color: rgba(255, 255, 255, 0.6);
                line-height: 1.6;
            }
            .cookie-options-list {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                text-align: left;
                margin: 1rem 0;
            }
            .cookie-option-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(255,255,255,0.05);
                padding: 1rem;
                border-radius: 12px;
                border: 1px solid rgba(255,255,255,0.05);
            }
            .option-info span {
                display: block;
                font-weight: 600;
                font-size: 0.9rem;
                color: #fff;
            }
            .option-info p {
                font-size: 0.75rem !important;
                margin: 0 !important;
            }
            .cookie-btn-primary {
                background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
                color: #fff;
                border: none;
                padding: 1.1rem;
                border-radius: 14px;
                font-size: 1rem;
                font-weight: 800;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(168, 85, 247, 0.4);
            }
            .cookie-btn-primary:hover {
                transform: scale(1.02);
                box-shadow: 0 8px 25px rgba(168, 85, 247, 0.6);
            }
            .cookie-link {
                background: transparent;
                border: none;
                color: rgba(255, 255, 255, 0.3);
                font-size: 0.8rem;
                cursor: pointer;
                text-decoration: underline;
                transition: color 0.2s;
            }
            .cookie-link:hover { color: #fff; }
            
            input[type="checkbox"] {
                width: 20px;
                height: 20px;
                accent-color: #a855f7;
                cursor: pointer;
            }
        </style>
    `,

    init() {
        const consent = localStorage.getItem('cookieConsent');
        if (consent === 'accepted') this.updateGoogleConsent(true);
        else if (consent === 'rejected') this.updateGoogleConsent(false);
        if (consent) return;

        document.head.insertAdjacentHTML('beforeend', this.styles);
        document.body.insertAdjacentHTML('beforeend', this.banner);
        const banner = document.getElementById('cookie-consent');
        const mainView = document.getElementById('cookie-main-view');
        const settingsView = document.getElementById('cookie-settings-view');

        setTimeout(() => banner.classList.add('show'), 100);

        // Botón Configuración (Abre el panel grande)
        document.getElementById('cookie-show-settings').addEventListener('click', () => {
            banner.classList.add('expanded');
            mainView.style.display = 'none';
            settingsView.style.display = 'flex';
        });

        // Botones de "Aceptar Todo" (El camino fácil)
        const acceptAll = () => {
            this.setConsent('accepted');
            this.updateGoogleConsent(true);
            this.hideBanner();
        };
        document.getElementById('cookie-accept-all').addEventListener('click', acceptAll);
        document.getElementById('cookie-accept-all-2').addEventListener('click', acceptAll);

        // Botón "Guardar selección" (El camino difícil)
        document.getElementById('cookie-save-selected').addEventListener('click', () => {
            const isAnalytics = document.getElementById('check-analytics').checked;
            const isMarketing = document.getElementById('check-marketing').checked;
            
            this.setConsent(isAnalytics && isMarketing ? 'accepted' : 'partial');
            this.updateGoogleConsent(isAnalytics); 
            this.hideBanner();
        });
    },

    updateGoogleConsent(isAccepted) {
        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                'analytics_storage': isAccepted ? 'granted' : 'denied',
                'ad_storage': isAccepted ? 'granted' : 'denied',
                'ad_user_data': isAccepted ? 'granted' : 'denied',
                'ad_personalization': isAccepted ? 'granted' : 'denied'
            });
        }
    },

    setConsent(value) {
        localStorage.setItem('cookieConsent', value);
        localStorage.setItem('cookieConsentDate', new Date().toISOString());
    },

    hideBanner() {
        const banner = document.getElementById('cookie-consent');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => banner.remove(), 600);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Components.load();
});

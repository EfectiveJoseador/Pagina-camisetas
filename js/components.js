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

                <!-- Mejora 1: Búsqueda Predictiva Global -->
                <div class="header-search-container" id="headerSearchContainer">
                    <input id="global-search" class="header-search-input" type="text" placeholder="Buscar camiseta, equipo o liga...">
                    <i class="fas fa-search header-search-icon"></i>
                    <div id="search-predictive-results" class="search-predictive-results hidden"></div>
                </div>

                <div class="header-actions">
                    <button class="icon-btn mobile-search-toggle" id="mobileSearchToggle" aria-label="Buscar" style="background: transparent; border: none; cursor: pointer;"><i class="fas fa-search"></i></button>
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
                    <h4 style="margin-top: 1rem;">Síguenos en TikTok</h4>
                    <div class="social-links">
                        <a href="https://www.tiktok.com/@camisetazo" target="_blank" rel="noopener" class="social-link" aria-label="TikTok">
                            <i class="fab fa-tiktok"></i>
                        </a>
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

        // Toggle Mobile Search (Mejora 1 / 8)
        const mobileSearchBtn = document.getElementById('mobileSearchToggle');
        const searchContainer = document.getElementById('headerSearchContainer');
        if (mobileSearchBtn && searchContainer) {
            mobileSearchBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                searchContainer.classList.toggle('active');
                if (searchContainer.classList.contains('active')) {
                    document.getElementById('global-search')?.focus();
                }
            });
            // Hide on outside click
            document.addEventListener('click', (e) => {
                if (!e.target.closest('#headerSearchContainer') && !e.target.closest('#mobileSearchToggle')) {
                    searchContainer.classList.remove('active');
                }
            });
        }

        // --- Dynamic import of products-data.js & features hook up ---
        const inPagesDir = window.location.pathname.includes('/pages/');
        // Usamos URL absoluta para evitar ambigüedades de resolución en scripts clásicos vs módulos
        const productsPath = `${window.location.origin}/js/products-data.js`;

        // ─── Global Search Submit Handler (funciona en TODAS las páginas) ───
        const searchInput = document.getElementById('global-search');
        const searchIcon = document.querySelector('.header-search-icon');
        if (searchInput) {
            const handleGlobalSearch = () => {
                const q = searchInput.value.trim();
                if (!q) return;
                const isList = window.location.pathname.includes('tienda') || window.location.pathname.includes('catalogo');
                if (isList) {
                    // Ya estamos en tienda/catálogo: actualizar el filtro local
                    const pageSearchInput = document.getElementById('search-input');
                    if (pageSearchInput) {
                        pageSearchInput.value = q;
                        pageSearchInput.dispatchEvent(new Event('input', { bubbles: true }));
                        const target = document.getElementById('product-grid') || document.querySelector('.catalog-container');
                        if (target) target.scrollIntoView({ behavior: 'smooth' });
                    }
                } else {
                    // Otra página: redirigir a tienda con el parámetro de búsqueda
                    const tiendaPath = inPagesDir ? 'tienda.html' : 'pages/tienda.html';
                    window.location.href = `${tiendaPath}?search=${encodeURIComponent(q)}`;
                }
                const resultsBox = document.getElementById('search-predictive-results');
                if (resultsBox) resultsBox.classList.add('hidden');
            };

            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleGlobalSearch();
                }
            });

            if (searchIcon) {
                searchIcon.addEventListener('click', handleGlobalSearch);
                searchIcon.style.cursor = 'pointer';
            }
        }

        import(productsPath).then((module) => {
            const productsList = module.default;

            // Helper to get prices
            function getProductPrice(prod) {
                const nameLower = prod.name.toLowerCase();
                const imageLower = (prod.image || '').toLowerCase();
                const isKids = prod.kids === true || nameLower.includes('kids') || nameLower.includes('niño') || nameLower.includes('niños') || imageLower.includes('kids');
                const isRetro = prod.retro === true || nameLower.includes('retro') || prod.league === 'retro';
                const isNBA = prod.category === 'nba' || prod.league === 'nba';
                if (isNBA || isRetro) return 24.90;
                if (isKids) return 21.90;
                return 19.90;
            }

            function buildResultItem(p) {
                const prices = getProductPrice(p);
                const miniImg = p.image.replace(/\/(\d+)\.(webp|jpg|png|jpeg)$/i, '/$1_mini.$2');
                const skuHtml = p.sku ? ` <span class="search-sku-label" style="font-family: monospace; font-size: 0.75rem; background: rgba(168, 85, 247, 0.15); color: #a855f7; padding: 2px 6px; border-radius: 4px; margin-left: 6px;">${p.sku}</span>` : '';
                return `
                    <a href="#" class="search-result-item" data-id="${p.id}" data-name="${encodeURIComponent(p.name)}">
                        <img src="${miniImg}" alt="${p.name}" class="search-result-img" loading="lazy">
                        <div class="search-result-info">
                            <span class="search-result-title">${p.name}${skuHtml}</span>
                            <span class="search-result-category">${p.league ? p.league.toUpperCase() : ''}</span>
                        </div>
                        <span class="search-result-price">€${prices.toFixed(2)}</span>
                    </a>
                `;
            }

            function attachItemClicks(container) {
                container.querySelectorAll('.search-result-item:not([data-bound])').forEach(item => {
                    item.dataset.bound = '1';
                    item.addEventListener('click', (ev) => {
                        ev.preventDefault();
                        const pId = parseInt(item.dataset.id);

                        container.classList.add('hidden');
                        const si = document.getElementById('global-search');
                        if (si) si.value = '';

                        // Comportamiento idéntico en TODAS las páginas: navegar al producto
                        window.location.href = inPagesDir ? `producto.html?id=${pId}` : `pages/producto.html?id=${pId}`;
                    });
                });
            }

            // 1. Predictive Search Setup – carga de 6 en 6 con scroll (Mejora 1)
            const searchInputEl = document.getElementById('global-search');
            const resultsBox = document.getElementById('search-predictive-results');

            if (searchInputEl && resultsBox) {
                const BATCH = 6;
                let allMatches = [];
                let loadedCount = 0;

                function renderBatch() {
                    const batch = allMatches.slice(loadedCount, loadedCount + BATCH);
                    if (batch.length === 0) return;
                    const html = batch.map(buildResultItem).join('');
                    // Remove existing load-more sentinel if present
                    const oldSentinel = resultsBox.querySelector('.search-load-more');
                    if (oldSentinel) oldSentinel.remove();

                    resultsBox.insertAdjacentHTML('beforeend', html);
                    loadedCount += batch.length;
                    attachItemClicks(resultsBox);

                    if (loadedCount < allMatches.length) {
                        // Add a sentinel div for intersection observer
                        resultsBox.insertAdjacentHTML('beforeend',
                            `<div class="search-load-more" style="height:1px;"></div>`
                        );
                        observeSentinel();
                    }
                }

                let sentinelObserver = null;
                function observeSentinel() {
                    if (sentinelObserver) sentinelObserver.disconnect();
                    const sentinel = resultsBox.querySelector('.search-load-more');
                    if (!sentinel) return;
                    sentinelObserver = new IntersectionObserver((entries) => {
                        if (entries[0].isIntersecting) {
                            sentinelObserver.disconnect();
                            renderBatch();
                        }
                    }, { root: resultsBox, threshold: 0.1 });
                    sentinelObserver.observe(sentinel);
                }

                let debounceTimer;
                searchInputEl.addEventListener('input', (e) => {
                    clearTimeout(debounceTimer);
                    const q = e.target.value.trim();
                    const qLower = q.toLowerCase();
                    if (q.length < 2) {
                        resultsBox.innerHTML = '';
                        resultsBox.classList.add('hidden');
                        allMatches = [];
                        loadedCount = 0;
                        if (sentinelObserver) sentinelObserver.disconnect();
                        return;
                    }
                    debounceTimer = setTimeout(() => {
                        const isSkuSearch = /^\d{4}$/.test(q);
                        if (isSkuSearch) {
                            allMatches = productsList.filter(p => p.sku === q);
                        } else {
                            allMatches = productsList.filter(p =>
                                p.name.toLowerCase().includes(qLower) ||
                                (p.league && p.league.toLowerCase().includes(qLower))
                            );
                        }
                        loadedCount = 0;
                        resultsBox.innerHTML = '';

                        if (allMatches.length === 0) {
                            resultsBox.innerHTML = '<div style="padding:0.75rem; text-align:center; font-size:0.85rem; color:var(--text-muted);">No se encontraron camisetas</div>';
                        } else {
                            renderBatch();
                        }
                        resultsBox.classList.remove('hidden');
                    }, 150);
                });

                // Hide results box when clicking outside
                document.addEventListener('click', (e) => {
                    if (!e.target.closest('.header-search-container')) {
                        resultsBox.classList.add('hidden');
                    }
                });
            }

        }).catch(err => {
            console.error('Error preloading products in components:', err);
        });

        // 3. Share URL Cart Import Check (Mejora 5)
        const urlParams = new URLSearchParams(window.location.search);
        const cartParam = urlParams.get('cart');
        if (cartParam) {
            try {
                const cartStr = decodeURIComponent(escape(atob(cartParam)));
                const importedItems = JSON.parse(cartStr);
                if (Array.isArray(importedItems)) {
                    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
                    importedItems.forEach(item => {
                        const matchIndex = cart.findIndex(i =>
                            i.id === item.id &&
                            i.size === item.size &&
                            i.version === item.version &&
                            JSON.stringify(i.customization) === JSON.stringify(item.customization)
                        );
                        if (matchIndex > -1) {
                            cart[matchIndex].qty = (cart[matchIndex].qty || 1) + (item.qty || item.quantity || 1);
                            cart[matchIndex].quantity = cart[matchIndex].qty;
                        } else {
                            cart.push(item);
                        }
                    });
                    localStorage.setItem('cart', JSON.stringify(cart));

                    // Dispatch updates
                    window.dispatchEvent(new CustomEvent('cart:updated'));

                    // Update count in header
                    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || item.qty || 1), 0);
                    const cartBadge = document.getElementById('cart-count');
                    if (cartBadge) {
                        cartBadge.textContent = totalItems;
                    }

                    setTimeout(() => {
                        if (window.Toast) {
                            window.Toast.success('¡Carrito importado y fusionado con éxito!');
                        } else {
                            alert('¡Carrito importado y fusionado con éxito!');
                        }
                    }, 500);
                }

                // Clean URL params
                urlParams.delete('cart');
                const newSearch = urlParams.toString();
                const newUrl = newSearch ? `${window.location.pathname}?${newSearch}` : window.location.pathname;
                window.history.replaceState({}, '', newUrl);
            } catch (e) {
                console.error('Failed to import cart from URL:', e);
            }
        }

        window.dispatchEvent(new CustomEvent('components:ready'));
        CookieConsent.init();
    }
};


const CookieConsent = {
    banner: `
        <div id="cookie-consent" class="cookie-consent" role="dialog" aria-labelledby="cookie-title">
            <div id="cookie-main-view" class="cookie-consent-content">
                <div class="cookie-header">
                    <i class="fas fa-cookie-bite cookie-main-icon" aria-hidden="true"></i>
                    <h3 id="cookie-title">Preferencias de Cookies</h3>
                </div>
                <p class="cookie-text">
                    Utilizamos cookies para optimizar tu navegación y mostrarte las mejores camisetas de fútbol según tus gustos. Puedes configurar tus preferencias o aceptar todas las cookies. <a href="/pages/cookies.html" class="cookie-policy-link">Ver política de cookies</a>.
                </p>
                <div class="cookie-actions">
                    <button id="cookie-show-settings" class="cookie-btn cookie-btn-secondary">CONFIGURAR</button>
                    <button id="cookie-accept-all" class="cookie-btn cookie-btn-primary">ACEPTAR TODAS</button>
                </div>
            </div>
            
            <div id="cookie-settings-view" class="cookie-settings-content" style="display: none;">
                <div class="cookie-header">
                    <h3 id="cookie-settings-title">Configuración de Cookies</h3>
                </div>
                <p class="cookie-text-settings">
                    Selecciona qué categorías de cookies deseas activar. Las cookies técnicas son obligatorias para el funcionamiento básico de la tienda y el carrito.
                </p>
                
                <div class="cookie-options-list">
                    <div class="cookie-option-item">
                        <div class="option-info">
                            <span class="option-title">Técnicas y Obligatorias</span>
                            <span class="option-desc">Esenciales para el carrito de compras y sesiones seguras.</span>
                        </div>
                        <label class="cookie-switch">
                            <input type="checkbox" checked disabled>
                            <span class="switch-slider disabled"></span>
                        </label>
                    </div>
                    <div class="cookie-option-item">
                        <div class="option-info">
                            <span class="option-title">Estadísticas y Analíticas</span>
                            <span class="option-desc">Nos permiten medir el rendimiento del sitio y mejorar tu experiencia.</span>
                        </div>
                        <label class="cookie-switch">
                            <input type="checkbox" id="check-analytics">
                            <span class="switch-slider"></span>
                        </label>
                    </div>
                    <div class="cookie-option-item">
                        <div class="option-info">
                            <span class="option-title">Marketing y Ofertas</span>
                            <span class="option-desc">Usadas para mostrarte ofertas relevantes de tus equipos favoritos.</span>
                        </div>
                        <label class="cookie-switch">
                            <input type="checkbox" id="check-marketing">
                            <span class="switch-slider"></span>
                        </label>
                    </div>
                </div>

                <div class="cookie-actions settings-actions">
                    <button id="cookie-save-selected" class="cookie-btn cookie-btn-secondary">GUARDAR</button>
                    <button id="cookie-accept-all-2" class="cookie-btn cookie-btn-primary">ACEPTAR TODAS</button>
                </div>
            </div>
        </div>
    `,

    styles: `
        <style id="cookie-consent-styles">
            .cookie-consent {
                position: fixed;
                bottom: 2rem;
                left: 2rem;
                width: calc(100% - 4rem);
                max-width: 420px;
                background: rgba(13, 13, 18, 0.96);
                backdrop-filter: blur(24px);
                -webkit-backdrop-filter: blur(24px);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 20px;
                padding: 1.5rem;
                z-index: 99999;
                box-shadow: 
                    0 20px 40px rgba(0, 0, 0, 0.4),
                    0 0 0 1px rgba(255, 255, 255, 0.04),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1);
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), max-width 0.4s ease;
            }
            .cookie-consent.show {
                opacity: 1;
                transform: translateY(0);
            }
            .cookie-consent.expanded {
                max-width: 480px;
            }
            .cookie-consent-content, .cookie-settings-content {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            .cookie-header {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                color: #fff;
            }
            .cookie-main-icon {
                font-size: 1.25rem;
                color: #a855f7;
                animation: cookieSpin 4s ease-in-out infinite;
            }
            @keyframes cookieSpin {
                0%, 100% { transform: rotate(0); }
                50% { transform: rotate(12deg); }
            }
            .cookie-header h3 {
                font-family: 'Outfit', 'Inter', sans-serif;
                font-size: 1.15rem;
                font-weight: 700;
                margin: 0;
                letter-spacing: -0.01em;
            }
            .cookie-text, .cookie-text-settings {
                font-family: 'Inter', sans-serif;
                font-size: 0.88rem;
                color: rgba(255, 255, 255, 0.7);
                line-height: 1.5;
                margin: 0;
                text-align: left;
            }
            .cookie-policy-link {
                color: #a855f7;
                text-decoration: none;
                font-weight: 600;
                transition: color 0.2s;
            }
            .cookie-policy-link:hover {
                color: #c084fc;
                text-decoration: underline;
            }
            .cookie-actions {
                display: flex;
                gap: 0.75rem;
                width: 100%;
                margin-top: 0.5rem;
            }
            .cookie-btn {
                flex: 1;
                font-family: 'Inter', sans-serif;
                font-size: 0.85rem;
                font-weight: 700;
                padding: 0.75rem 1rem;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
                text-align: center;
                border: none;
                text-transform: uppercase;
                letter-spacing: 0.03em;
            }
            .cookie-btn-primary {
                background: #ffffff;
                color: #0b0b0e;
            }
            .cookie-btn-primary:hover {
                background: rgba(255, 255, 255, 0.9);
                transform: translateY(-1px);
            }
            .cookie-btn-secondary {
                background: rgba(255, 255, 255, 0.08);
                color: #ffffff;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            .cookie-btn-secondary:hover {
                background: rgba(255, 255, 255, 0.12);
                border-color: rgba(255, 255, 255, 0.2);
                transform: translateY(-1px);
            }
            
            .cookie-options-list {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                margin: 0.5rem 0;
            }
            .cookie-option-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(255, 255, 255, 0.03);
                padding: 0.75rem 1rem;
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.04);
            }
            .option-info {
                display: flex;
                flex-direction: column;
                gap: 0.15rem;
                text-align: left;
                padding-right: 1rem;
            }
            .option-title {
                font-size: 0.85rem;
                font-weight: 600;
                color: #ffffff;
            }
            .option-desc {
                font-size: 0.72rem;
                color: rgba(255, 255, 255, 0.45);
                line-height: 1.3;
            }
            
            .cookie-switch {
                position: relative;
                display: inline-block;
                width: 40px;
                height: 22px;
                flex-shrink: 0;
            }
            .cookie-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            .switch-slider {
                position: absolute;
                cursor: pointer;
                top: 0; left: 0; right: 0; bottom: 0;
                background-color: rgba(255, 255, 255, 0.15);
                transition: .3s;
                border-radius: 34px;
            }
            .switch-slider:before {
                position: absolute;
                content: "";
                height: 16px;
                width: 16px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: .3s;
                border-radius: 50%;
            }
            .cookie-switch input:checked + .switch-slider {
                background-color: #a855f7;
            }
            .cookie-switch input:checked + .switch-slider:before {
                transform: translateX(18px);
            }
            .switch-slider.disabled {
                background-color: rgba(255, 255, 255, 0.05);
                cursor: not-allowed;
            }
            .switch-slider.disabled:before {
                background-color: rgba(255, 255, 255, 0.3);
            }
            
            @media (max-width: 480px) {
                .cookie-consent {
                    bottom: 1rem;
                    left: 1rem;
                    width: calc(100% - 2rem);
                    padding: 1.25rem;
                    border-radius: 16px;
                }
                .cookie-consent.expanded {
                    max-width: 100%;
                }
                .cookie-header h3 {
                    font-size: 1.05rem;
                }
                .cookie-text {
                    font-size: 0.8rem;
                }
                .cookie-actions {
                    flex-direction: column-reverse;
                    gap: 0.5rem;
                }
                .cookie-btn {
                    width: 100%;
                    padding: 0.7rem;
                }
                .option-title {
                    font-size: 0.8rem;
                }
                .option-desc {
                    font-size: 0.68rem;
                }
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

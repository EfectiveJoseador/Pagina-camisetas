import products from './products-data.js';

// Normalise league names or similar if needed
const LEAGUE_NORMALIZATION_MAP = {
    'eredivise': 'eredivisie',
    'eredivisie': 'eredivisie',
    'ligaportugal': 'ligaportugal',
    'primeira liga': 'ligaportugal',
    'primeira_liga': 'ligaportugal',
    'mls': 'mls',
    'liga mx': 'ligamx',
    'ligamx': 'ligamx'
};

function getTeamBase(name) {
    return name
        .replace(/\d{2}\/\d{2}/, '')
        .replace(/(Local|Visitante|Tercera|Retro|Icon|estilo)/gi, '')
        .replace(/\(Kids\)/gi, '')
        .replace(/\(Niño\)/gi, '')
        .replace(/\(Niños\)/gi, '')
        .trim();
}

function getMiniImagePath(imagePath) {
    if (!imagePath) return '';
    return imagePath.replace(/\/(\d+)\.(webp|jpg|png|jpeg)$/i, '/$1_mini.$2');
}

function getProductType(product) {
    const nameLower = product.name.toLowerCase();
    const imageLower = (product.image || '').toLowerCase();
    const isKids = product.kids === true || nameLower.includes('kids') || nameLower.includes('niño') || nameLower.includes('niños') || imageLower.includes('kids');
    const isRetro = product.retro === true || nameLower.includes('retro') || product.league === 'retro';
    const isNBA = product.category === 'nba' || product.league === 'nba';

    if (isKids) return 'kids';
    if (isRetro) return 'retro';
    if (isNBA) return 'nba';
    return 'normal';
}


const SIZE_CONFIGS = {
    kids: ['16', '18', '20', '22', '24', '26', '28'],
    retro: ['S', 'M', 'L', 'XL', '2XL'],
    normal: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    nba: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']
};

const SIZE_SURCHARGES = { '2XL': 1, '3XL': 2, '4XL': 2 };

function getProductPrices(product) {
    const nameLower = product.name.toLowerCase();
    const imageLower = (product.image || '').toLowerCase();
    const isKids = product.kids === true || nameLower.includes('kids') || nameLower.includes('niño') || nameLower.includes('niños') || imageLower.includes('kids');
    const isRetro = product.retro === true || nameLower.includes('retro') || product.league === 'retro';
    const isNBA = product.category === 'nba' || product.league === 'nba';
    let oldPrice = 25.00;
    let price = 19.90;

    if (isNBA) {
        oldPrice = 30.00;
        price = 24.90;
    } else if (isRetro) {
        oldPrice = 30.00;
        price = 24.90;
    } else if (isKids) {
        oldPrice = 27.00;
        price = 21.90;
    }
    return { price, oldPrice };
}

function getRecommendations(addedProduct, allProducts) {
    const currentTeam = getTeamBase(addedProduct.name);

    const sameTeam = allProducts.filter(p =>
        p.id !== addedProduct.id && getTeamBase(p.name) === currentTeam
    );
    const sameLeague = allProducts.filter(p =>
        p.id !== addedProduct.id &&
        p.league === addedProduct.league &&
        getTeamBase(p.name) !== currentTeam
    );
    const sameCategory = allProducts.filter(p =>
        p.id !== addedProduct.id &&
        p.category === addedProduct.category &&
        p.league !== addedProduct.league &&
        getTeamBase(p.name) !== currentTeam
    );

    const shuffledLeague = sameLeague.sort(() => Math.random() - 0.5);
    const shuffledCategory = sameCategory.sort(() => Math.random() - 0.5);

    return [...sameTeam, ...shuffledLeague, ...shuffledCategory];
}

// ---------------------------------------------------------------------------
// Pack promo logic
// ---------------------------------------------------------------------------
export function formatPrice(price) {
    return price.toFixed(2).replace('.', ',');
}

function getPackPromoHTML() {
    // 1. Lectura Directa y Única en Tiempo Real
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) return '';

    const totalQty = cart.reduce((sum, item) => sum + (item.quantity || item.qty || 1), 0);
    
    // 2. Homogeneización del Conteo (Solución Temporal del Core)
    const normalQty = totalQty;

    // 1. Envío Gratis (Prioridad Máxima)
    if (totalQty === 1) {
        return `
            <div class="pack-promo-card promo-entering">
                <div class="pack-promo-icon">🎁</div>
                <div class="pack-promo-text">
                    <span class="pack-promo-title">¡Envío Gratis!</span>
                    <span class="pack-promo-desc">Añade <strong>1 camiseta más</strong> para conseguir envío gratuito.</span>
                </div>
            </div>
        `;
    }

    // 2. Megapack (Bloques de 5) - Prioridad Alta
    if (normalQty % 5 === 3 || normalQty % 5 === 4) {
        const m = Math.floor((normalQty + 2) / 5);
        const faltan = 5 - (normalQty % 5);
        const textoCamisetas = faltan === 1 ? "1 camiseta más" : "2 camisetas más";
        const precioTotal = formatPrice(m * 85.90);
        const ahorro = m * 15;
        
        return `
            <div class="pack-promo-card mega promo-entering">
                <div class="pack-promo-icon">⚡</div>
                <div class="pack-promo-text">
                    <span class="pack-promo-title">¡Ahorro Megapack!</span>
                    <span class="pack-promo-desc">Con <strong>${textoCamisetas}</strong>, consigues el <strong>${m}x Megapack 5 por ${precioTotal}€</strong> (¡Ahorrarás ${ahorro}€!).</span>
                </div>
            </div>
        `;
    }

    // 3. Pack Popular (Bloques de 3) - Prioridad Baja
    if (normalQty % 3 === 2) {
        const n = Math.floor((normalQty + 1) / 3);
        const precioTotal = formatPrice(n * 56.90);
        const ahorro = n * 5;
        
        return `
            <div class="pack-promo-card popular promo-entering">
                <div class="pack-promo-icon">🔥</div>
                <div class="pack-promo-text">
                    <span class="pack-promo-title">¡Ahorro Pack Popular!</span>
                    <span class="pack-promo-desc">Con <strong>1 camiseta más</strong>, consigues el <strong>${n}x Pack 3 por ${precioTotal}€</strong> (¡Ahorrarás un ${ahorro}%!).</span>
                </div>
            </div>
        `;
    }

    return '';
}

// ---------------------------------------------------------------------------
// updatePackPromoMessage — update of the promo banner
// ---------------------------------------------------------------------------
export function updatePackPromoMessage() {
    const promoContainer = document.getElementById('upsell-pack-promo');
    if (!promoContainer) return;

    // Inyección de forma síncrona con el estado actual del carrito
    promoContainer.innerHTML = getPackPromoHTML();
}

// ---------------------------------------------------------------------------
// addToCartDirectly — adds a recommended product and refreshes the modal
// ---------------------------------------------------------------------------
function addToCartDirectly(product, size, btnElement) {
    const prices = getProductPrices(product);
    const sizeSurcharge = SIZE_SURCHARGES[size] || 0;

    const customization = {
        size: size,
        version: 'aficionado',
        name: '',
        number: '',
        patch: '',
        extras: []
    };

    const cartItem = {
        id: product.id,
        name: product.name,
        image: product.image,
        basePrice: prices.price,
        price: prices.price + sizeSurcharge,
        quantity: 1,
        customization: customization
    };

    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIndex = cart.findIndex(item =>
        item.id === cartItem.id &&
        JSON.stringify(item.customization) === JSON.stringify(cartItem.customization)
    );

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    // Update count in header
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const cartBadge = document.getElementById('cart-count');
    if (cartBadge) {
        cartBadge.textContent = totalItems;
    }

    // Animate cart badge
    if (window.CartBadge && typeof window.CartBadge.animate === 'function') {
        window.CartBadge.animate();
    }

    // Success feedback
    if (window.Toast && typeof window.Toast.success === 'function') {
        window.Toast.success(`${product.name} (${size}) añadido`);
    } else if (window.showToast) {
        window.showToast(`${product.name} (${size}) añadido`);
    }

    // Update pack promo with animation
    updatePackPromoMessage();

    // Simple temporary animation on the "+" button
    if (btnElement) {
        const originalHTML = btnElement.innerHTML;
        btnElement.innerHTML = '<i class="fas fa-check"></i>';
        btnElement.style.backgroundColor = '#10b981';
        setTimeout(() => {
            btnElement.innerHTML = originalHTML;
            btnElement.style.backgroundColor = '';
        }, 1500);
    }
}

// ---------------------------------------------------------------------------
// Recommendation item rendering
// ---------------------------------------------------------------------------
function renderProductItemHTML(prod) {
    const prices = getProductPrices(prod);
    const type = getProductType(prod);
    const sizes = SIZE_CONFIGS[type] || SIZE_CONFIGS.normal;
    const defaultRecSize = type === 'kids' ? '24' : 'M';

    const sizeOptionsHTML = sizes.map(sz => {
        const isSel = sz === defaultRecSize ? 'selected' : '';
        return `<option value="${sz}" ${isSel}>${sz}</option>`;
    }).join('');

    return `
        <div class="upsell-rec-item" data-id="${prod.id}">
            <img src="${getMiniImagePath(prod.image)}" alt="${prod.name}" class="upsell-rec-img">
            <div class="upsell-rec-info">
                <span class="upsell-rec-title">${prod.name}</span>
                <div class="upsell-rec-prices">
                    <span class="upsell-rec-price">€${prices.price.toFixed(2)}</span>
                    <span class="upsell-rec-old-price">€${prices.oldPrice.toFixed(2)}</span>
                </div>
            </div>
            <div class="upsell-rec-actions">
                <select class="upsell-rec-size-select" aria-label="Seleccionar talla">
                    ${sizeOptionsHTML}
                </select>
                <button class="btn-upsell-rec-add" data-id="${prod.id}" title="Añadir al carrito">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>
    `;
}

function attachRecItemListeners(parentElement) {
    parentElement.querySelectorAll('.btn-upsell-rec-add').forEach(btn => {
        if (btn.getAttribute('data-listener-attached')) return;
        btn.setAttribute('data-listener-attached', 'true');
        btn.addEventListener('click', () => {
            const prodId = parseInt(btn.getAttribute('data-id'));
            const recProduct = products.find(p => p.id === prodId);
            if (!recProduct) return;

            const recItem = btn.closest('.upsell-rec-item');
            const sizeSelect = recItem.querySelector('.upsell-rec-size-select');
            const size = sizeSelect ? sizeSelect.value : 'M';

            addToCartDirectly(recProduct, size, btn);
        });
    });
}

// ---------------------------------------------------------------------------
// showUpsellModal — main export
// ---------------------------------------------------------------------------
export function showUpsellModal(addedProduct, selectedSize = 'M', addedProductPrice = null) {
    // If addedProductPrice is not passed, calculate it
    if (addedProductPrice === null) {
        const prices = getProductPrices(addedProduct);
        addedProductPrice = prices.price + (SIZE_SURCHARGES[selectedSize] || 0);
    }

    // Exclude the added product and get all recommendations (un-sliced list)
    const allRecs = getRecommendations(addedProduct, products);

    // Create modal DOM structure
    let modalOverlay = document.getElementById('upsell-modal');
    if (!modalOverlay) {
        modalOverlay = document.createElement('div');
        modalOverlay.id = 'upsell-modal';
        modalOverlay.className = 'upsell-modal-overlay';
        document.body.appendChild(modalOverlay);
    }

    modalOverlay.innerHTML = `
        <div class="upsell-modal-container" role="dialog" aria-modal="true" aria-labelledby="upsell-title">
            <button class="upsell-modal-close" aria-label="Cerrar modal">&times;</button>
            
            <div class="upsell-header">
                <div class="upsell-success-icon">
                    <i class="fas fa-check"></i>
                </div>
                <h3 id="upsell-title">¡Añadido al carrito!</h3>
            </div>
            
            <div class="upsell-added-product">
                <img src="${getMiniImagePath(addedProduct.image)}" alt="${addedProduct.name}" class="upsell-added-img">
                <div class="upsell-added-info">
                    <span class="upsell-added-title">${addedProduct.name}</span>
                    <span class="upsell-added-details">Talla: ${selectedSize}</span>
                    <span class="upsell-added-price">€${addedProductPrice.toFixed(2)}</span>
                </div>
            </div>

            <div class="upsell-pack-promo" id="upsell-pack-promo">
                ${getPackPromoHTML()}
            </div>

            <div class="upsell-recommendations">
                <h4>También te puede gustar...</h4>
                <div class="upsell-recommendations-grid" id="upsell-recs-grid">
                    <!-- Recommendations loaded dynamically -->
                </div>
            </div>

            <div class="upsell-actions">
                <button class="btn-upsell-secondary btn-upsell-close">Seguir comprando</button>
                <a href="/pages/carrito.html" class="btn-upsell-primary">Ver mi carrito</a>
            </div>
        </div>
    `;

    const recsGrid = modalOverlay.querySelector('#upsell-recs-grid');

    // ── Create loader and sentinel programmatically (correct DOM order) ──────
    // Order inside recsGrid: [items...] → loader → sentinel
    const loaderIndicator = document.createElement('div');
    loaderIndicator.className = 'upsell-loader hidden';
    loaderIndicator.id = 'upsell-loader-indicator';
    loaderIndicator.innerHTML = '<div class="upsell-loader-spinner"></div><span>Cargando más productos...</span>';
    recsGrid.appendChild(loaderIndicator);

    const sentinel = document.createElement('div');
    sentinel.className = 'upsell-sentinel';
    sentinel.style.cssText = 'height:1px;width:100%;flex-shrink:0;';
    recsGrid.appendChild(sentinel); // always last

    const BATCH_SIZE = 6;
    let loadedCount = 0;
    let isLoading = false;
    let loadTimeout = null;
    let observer = null;
    let scrollTimeout = null;

    function loadMoreRecs() {
        if (isLoading || loadedCount >= allRecs.length) return;
        isLoading = true;
        loaderIndicator.classList.remove('hidden');

        loadTimeout = setTimeout(() => {
            const batch = allRecs.slice(loadedCount, loadedCount + BATCH_SIZE);
            const batchHTML = batch.map(prod => renderProductItemHTML(prod)).join('');

            // Insert items before the loader (loader stays above sentinel)
            loaderIndicator.insertAdjacentHTML('beforebegin', batchHTML);
            attachRecItemListeners(recsGrid);

            loadedCount += batch.length;
            isLoading = false;
            loaderIndicator.classList.add('hidden');

            // Reconnect observer to sentinel after DOM change so it re-evaluates
            if (observer) {
                observer.unobserve(sentinel);
                observer.observe(sentinel);
            }
        }, 400);
    }

    // ── Scroll fallback — always active as belt-and-suspenders ──────────────
    const handleScrollFallback = () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (isLoading || loadedCount >= allRecs.length) return;
            const { scrollTop, scrollHeight, clientHeight } = recsGrid;
            if (scrollHeight - scrollTop - clientHeight < 150) {
                loadMoreRecs();
            }
        }, 80);
    };
    recsGrid.addEventListener('scroll', handleScrollFallback);

    // ── IntersectionObserver — fires when sentinel enters the scrollable area ─
    if (typeof IntersectionObserver !== 'undefined') {
        observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isLoading && loadedCount < allRecs.length) {
                loadMoreRecs();
            }
        }, {
            root: recsGrid,          // the scrollable container is the viewport
            rootMargin: '0px 0px 100px 0px',
            threshold: 0
        });
        observer.observe(sentinel);
    }

    // Load the first batch immediately on open
    loadMoreRecs();

    // Event listeners
    const closeModal = () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEsc);

        // Disconnect observer & clear timers to avoid leaks or state residues
        if (observer) {
            observer.disconnect();
        }
        if (loadTimeout) {
            clearTimeout(loadTimeout);
        }
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        recsGrid.removeEventListener('scroll', handleScrollFallback);
    };

    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    };

    // Close buttons
    modalOverlay.querySelectorAll('.upsell-modal-close, .btn-upsell-close').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Backdrop click
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Keydown ESC
    document.addEventListener('keydown', handleEsc);

    // Show modal
    document.body.style.overflow = 'hidden';
    // Small delay to trigger animation
    setTimeout(() => {
        modalOverlay.classList.add('active');
    }, 10);
}

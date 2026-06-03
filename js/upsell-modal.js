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

    // Shuffle sameLeague and sameCategory for variety
    const shuffledLeague = sameLeague.sort(() => Math.random() - 0.5);
    const shuffledCategory = sameCategory.sort(() => Math.random() - 0.5);

    const combined = [...sameTeam, ...shuffledLeague, ...shuffledCategory];
    return combined;
}

function getPackPromoHTML() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) return '';

    const totalQty = cart.reduce((sum, item) => sum + (item.quantity || item.qty || 1), 0);

    // Filtramos las camisetas normales (de €19.90) para el cálculo de los packs
    const normalItems = cart.filter(item => {
        const bp = item.basePrice;
        return !bp || Math.abs(bp - 19.90) < 0.01;
    });
    const normalQty = normalItems.reduce((sum, item) => sum + (item.quantity || item.qty || 1), 0);

    // 1. Envío gratis si la cantidad total de artículos es 1 (independientemente del tipo de camiseta)
    if (totalQty === 1) {
        return `
            <div class="pack-promo-card">
                <div class="pack-promo-icon">🎁</div>
                <div class="pack-promo-text">
                    <span class="pack-promo-title">¡Envío Gratis!</span>
                    <span class="pack-promo-desc">Añade <strong>1 camiseta más</strong> para conseguir envío gratuito.</span>
                </div>
            </div>
        `;
    }

    // 2. Promociones de pack — basadas en normalQty EXACTO (igual que totalQty===1 arriba)
    //    normalQty === 2 → falta 1 para el Pack 3  → mostrar
    //    normalQty === 3 → Pack 3 ya conseguido    → ocultar (return '')
    //    normalQty === 4 → falta 1 para Megapack 5 → mostrar
    //    cualquier otro  → sin mensaje
    if (normalQty === 2) {
        return `
            <div class="pack-promo-card popular">
                <div class="pack-promo-icon">🔥</div>
                <div class="pack-promo-text">
                    <span class="pack-promo-title">¡Ahorro Pack Popular!</span>
                    <span class="pack-promo-desc">Con <strong>1 camiseta más</strong>, consigues el <strong>Pack 3 por €56.90</strong> (¡Ahorras 5%!).</span>
                </div>
            </div>
        `;
    }

    if (normalQty === 4) {
        return `
            <div class="pack-promo-card mega">
                <div class="pack-promo-icon">⚡</div>
                <div class="pack-promo-text">
                    <span class="pack-promo-title">¡Ahorro Megapack!</span>
                    <span class="pack-promo-desc">Con <strong>1 camiseta más</strong>, consigues el <strong>Megapack 5 por €85.90</strong> (¡Ahorras 15%!).</span>
                </div>
            </div>
        `;
    }

    return '';
}

function addToCartDirectly(product, size, btnElement) {
    const prices = getProductPrices(product);
    const SIZE_SURCHARGES = { '2XL': 1, '3XL': 2, '4XL': 2 };
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

    // Update the pack promotion text dynamically
    const promoContainer = document.getElementById('upsell-pack-promo');
    if (promoContainer) {
        promoContainer.innerHTML = getPackPromoHTML();
    }

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

export function showUpsellModal(addedProduct, selectedSize = 'M', addedProductPrice = null) {
    // If addedProductPrice is not passed, calculate it
    if (addedProductPrice === null) {
        const prices = getProductPrices(addedProduct);
        const SIZE_SURCHARGES = { '2XL': 1, '3XL': 2, '4XL': 2 };
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

    const packPromoHTML = getPackPromoHTML();

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
                ${packPromoHTML}
            </div>

            <div class="upsell-recommendations">
                <h4>También te puede gustar...</h4>
                <div class="upsell-recommendations-grid" id="upsell-recs-grid">
                    <!-- Recommendations will be loaded dynamically here -->
                    <div class="upsell-loader hidden" id="upsell-loader-indicator">
                        <div class="upsell-loader-spinner"></div>
                        <span>Cargando más productos...</span>
                    </div>
                </div>
            </div>

            <div class="upsell-actions">
                <button class="btn-upsell-secondary btn-upsell-close">Seguir comprando</button>
                <a href="/pages/carrito.html" class="btn-upsell-primary">Ver mi carrito</a>
            </div>
        </div>
    `;

    const recsGrid = modalOverlay.querySelector('#upsell-recs-grid');
    const loaderIndicator = modalOverlay.querySelector('#upsell-loader-indicator');

    const BATCH_SIZE = 6;
    let loadedCount = 0;
    let isLoading = false;
    let loadTimeout = null;
    let observer = null;
    let scrollTimeout = null;

    // Create a sentinel element at the absolute bottom of the grid
    const sentinel = document.createElement('div');
    sentinel.className = 'upsell-sentinel';
    sentinel.style.height = '1px';
    sentinel.style.width = '100%';
    recsGrid.appendChild(sentinel);

    function loadMoreRecs() {
        if (isLoading || loadedCount >= allRecs.length) return;
        isLoading = true;

        // Show loader indicator
        loaderIndicator.classList.remove('hidden');

        // Simulate a minor network loading state (600ms) for professional visual transition
        loadTimeout = setTimeout(() => {
            const batch = allRecs.slice(loadedCount, loadedCount + BATCH_SIZE);
            const batchHTML = batch.map(prod => renderProductItemHTML(prod)).join('');

            // Insert newly loaded elements before the loader
            loaderIndicator.insertAdjacentHTML('beforebegin', batchHTML);

            // Attach event listeners to the new button elements
            attachRecItemListeners(recsGrid);

            loadedCount += batch.length;
            isLoading = false;

            // Hide loader
            loaderIndicator.classList.add('hidden');
        }, 600);
    }

    // Load initial batch of recommendations
    loadMoreRecs();

    // Scroll fallback handler (with 50ms debounce)
    const handleScrollFallback = () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (isLoading || loadedCount >= allRecs.length) return;
            const scrollTop = recsGrid.scrollTop;
            const scrollHeight = recsGrid.scrollHeight;
            const clientHeight = recsGrid.clientHeight;
            if (scrollHeight - scrollTop - clientHeight < 200) {
                loadMoreRecs();
            }
        }, 50);
    };

    // Setup progressive loading behavior
    if (typeof IntersectionObserver !== 'undefined') {
        observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isLoading && loadedCount < allRecs.length) {
                loadMoreRecs();
            }
        }, {
            root: recsGrid,
            rootMargin: '0px 0px 200px 0px'
        });
        observer.observe(sentinel);
    } else {
        recsGrid.addEventListener('scroll', handleScrollFallback);
    }

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

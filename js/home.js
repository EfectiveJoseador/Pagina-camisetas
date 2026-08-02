import products from './products-data.js';
import { db, ref, get } from './firebase-config.js';

const FEATURED_CONFIG = {
    PRODUCT_COUNT: 6,
    ROTATION_DAYS: 7
};
const LABEL_TYPES = {
    NUEVO: { text: 'NUEVO', class: 'badge-nuevo', color: '#10b981' },
    TENDENCIA: { text: 'TENDENCIA', class: 'badge-trending', color: '#8b5cf6' },
    POPULAR: { text: 'POPULAR', class: 'badge-popular', color: '#f59e0b' },
    TOP_PICKS: { text: 'TOP PICKS', class: 'badge-top', color: '#3b82f6' }
};
const CURRENT_SEASON = '25/26';

function getProductLabel(product, index) {
    const name = product.name || '';
    const isRetro = product.retro || product.league === 'retro' || name.toLowerCase().includes('retro');
    const isCurrentSeason = name.includes(CURRENT_SEASON) || name.includes('24/25');
    if (isRetro) {
        const retroLabels = [LABEL_TYPES.TENDENCIA, LABEL_TYPES.POPULAR, LABEL_TYPES.TOP_PICKS];
        return retroLabels[index % retroLabels.length];
    }
    if (isCurrentSeason && product.new !== false) {
        return LABEL_TYPES.NUEVO;
    }
    const labels = [LABEL_TYPES.TENDENCIA, LABEL_TYPES.POPULAR, LABEL_TYPES.TOP_PICKS];
    return labels[index % labels.length];
}
function detectLowPerformance() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return true;
    }
    if (navigator.deviceMemory && navigator.deviceMemory < 4) {
        return true;
    }
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        return true;
    }
    if ('ontouchstart' in window && window.innerWidth < 768) {
        return true;
    }
    return false;
}
document.addEventListener('DOMContentLoaded', () => {
    if (detectLowPerformance()) {
        document.body.classList.add('low-performance');
    }
    if (sessionStorage.getItem('homeAnimationSeen')) {
        document.body.classList.add('animation-seen');
    } else {
        setTimeout(() => {
            sessionStorage.setItem('homeAnimationSeen', 'true');
        }, 3500);
    }

    initHome();
});

async function initHome() {
    applySpecialPricing();
    await renderBestSellers();
}

function applySpecialPricing() {
    products.forEach(product => {
        if (product.fixedPrice === true) return;
        const nameLower = product.name.toLowerCase();
        const imageLower = (product.image || '').toLowerCase();
        const isKids = product.kids === true || nameLower.includes('kids') || nameLower.includes('niño') || nameLower.includes('niños') || imageLower.includes('kids');
        const isRetro = product.retro === true || product.name.toLowerCase().includes('retro') || product.league === 'retro';

        let oldPrice = 30.00;
        let newPrice = 22.90;

        if (isRetro) {
            oldPrice = 35.00;
            newPrice = 27.90;
        } else if (isKids) {
            oldPrice = 33.00;
            newPrice = 25.90;
        }

        product.oldPrice = oldPrice;
        product.price = newPrice;
        product.sale = true;
    });
}

function getMiniImagePath(imagePath) {
    return imagePath.replace(/\/(\d+)\.(webp|jpg|png|jpeg)$/i, '/$1_mini.$2');
}


function getSecondaryMiniImage(product) {

    if (product.images && product.images.length > 0) {
        return getMiniImagePath(product.images[0]);
    }


    if (product.image) {
        const secondaryPath = product.image.replace(/\/1\.(webp|jpg|png|jpeg)$/i, '/2.$1');
        return getMiniImagePath(secondaryPath);
    }
    return null;
}

async function renderBestSellers() {
    const grid = document.querySelector('.products-grid');
    if (!grid) return;
    grid.innerHTML = '<div class="loading-placeholder" style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-muted);">Cargando productos...</div>';

    try {
        const bestSellerIds = await getGlobalFeaturedProducts();
        const bestSellers = bestSellerIds.map(id => products.find(p => p.id === id)).filter(Boolean);

        if (bestSellers.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No hay productos destacados disponibles.</p>';
            return;
        }

        grid.innerHTML = bestSellers.map((product, index) => {
            const secondaryImg = getSecondaryMiniImage(product);
            return `
            <article class="product-card">
                <div class="product-image">
                    <a href="/pages/producto.html?id=${product.id}">
                        <img src="${getMiniImagePath(product.image)}" alt="${product.name}" class="primary-image" loading="lazy">
                        ${secondaryImg ? `<img src="${secondaryImg}" alt="${product.name} - Vista 2" class="secondary-image" loading="lazy">` : ''}
                    </a>
                    <button class="btn-quick-add" data-id="${product.id}" title="Añadir rápido"><i class="fas fa-shopping-basket"></i></button>
                    <button class="btn-quick-view"><i class="fas fa-eye"></i></button>
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">
                        <span class="price-old">€${product.oldPrice.toFixed(2)}</span>
                        <span class="price">€${product.price.toFixed(2)}</span>
                    </div>
                </div>
            </article>
        `}).join('');

    } catch (error) {
        console.error('Error loading featured products:', error);
        const fallbackProducts = products.slice(0, FEATURED_CONFIG.PRODUCT_COUNT);
        grid.innerHTML = fallbackProducts.map((product, index) => {
            const secondaryImg = getSecondaryMiniImage(product);
            return `
            <article class="product-card">
                <div class="product-image">
                    <a href="/pages/producto.html?id=${product.id}">
                        <img src="${getMiniImagePath(product.image)}" alt="${product.name}" class="primary-image" loading="lazy">
                        ${secondaryImg ? `<img src="${secondaryImg}" alt="${product.name} - Vista 2" class="secondary-image" loading="lazy">` : ''}
                    </a>
                    <button class="btn-quick-add" data-id="${product.id}" title="Añadir rápido"><i class="fas fa-shopping-basket"></i></button>
                    <button class="btn-quick-view"><i class="fas fa-eye"></i></button>
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">
                        <span class="price-old">€${product.oldPrice.toFixed(2)}</span>
                        <span class="price">€${product.price.toFixed(2)}</span>
                    </div>
                </div>
            </article>
        `}).join('');
    }

    // Attach delegated event listener for the quick-add buttons
    grid.addEventListener('click', e => {
        const btn = e.target.closest('.btn-quick-add');
        if (!btn) return;
        const productId = parseInt(btn.dataset.id, 10);
        const product = products.find(p => p.id === productId);
        if (product) _openDrawer(product);
    });
}
async function getGlobalFeaturedProducts() {
    let pinnedIds = [];
    try {
        const snap = await get(ref(db, 'pinnedProducts'));
        if (snap.exists()) {
            const data = snap.val();
            if (data && typeof data.ids === 'string') {
                pinnedIds = JSON.parse(data.ids).map(Number);
            } else if (Array.isArray(data)) {
                pinnedIds = data.map(Number);
            }
            localStorage.setItem('camisetazo_pinned_products', JSON.stringify(pinnedIds));
        } else {
            // Fallback to local storage if not in Firebase yet
            const raw = localStorage.getItem('camisetazo_pinned_products');
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) pinnedIds = parsed.map(Number);
            }
        }
    } catch (e) {
        console.warn("Failed to fetch pinned products from Firebase, using cache.", e);
        const raw = localStorage.getItem('camisetazo_pinned_products');
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) pinnedIds = parsed.map(Number);
            } catch (err) {}
        }
    }

    // Filter to ensure pinned IDs actually exist in products data
    const mandatoryTop = [500002, 500001];
    const mandatorySet = new Set(mandatoryTop);
    const restPinned = pinnedIds.filter(id => !mandatorySet.has(id));
    pinnedIds = [...mandatoryTop, ...restPinned];

    const validPinned = pinnedIds.filter(id => products.some(p => p.id === id));
    
    // If we have enough pinned products to fill the section, return them
    if (validPinned.length >= FEATURED_CONFIG.PRODUCT_COUNT) {
        return validPinned.slice(0, FEATURED_CONFIG.PRODUCT_COUNT);
    }

    // Try to load cached randoms from session
    let randoms = [];
    const sessionCached = sessionStorage.getItem('featuredProductsSession');
    if (sessionCached) {
        try {
            const cached = JSON.parse(sessionCached);
            if (cached.products) randoms = cached.products;
        } catch (e) { }
    }

    // If no cache or invalid, generate new randoms
    if (randoms.length === 0) {
        randoms = getRandomFeaturedProducts();
        saveToSessionStorage(randoms);
    }

    // Combine pinned and randoms, ensuring no duplicates, up to the count limit
    const combined = [...validPinned];
    for (const id of randoms) {
        if (!combined.includes(id)) {
            combined.push(id);
        }
        if (combined.length >= FEATURED_CONFIG.PRODUCT_COUNT) break;
    }

    // If we still don't have enough, grab any remaining from the main product list
    if (combined.length < FEATURED_CONFIG.PRODUCT_COUNT) {
        for (const p of products) {
            if (!combined.includes(p.id)) {
                combined.push(p.id);
            }
            if (combined.length >= FEATURED_CONFIG.PRODUCT_COUNT) break;
        }
    }

    return combined;
}

function saveToSessionStorage(productIds) {
    try {
        sessionStorage.setItem('featuredProductsSession', JSON.stringify({
            products: productIds,
            timestamp: Date.now()
        }));
    } catch (e) { }
}

function getRandomFeaturedProducts() {
    const shuffled = [...products].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, FEATURED_CONFIG.PRODUCT_COUNT).map(p => p.id);
}

// ─── GLOBAL QUICK-ADD DRAWER FOR HOME ─────────────────────────────────────────

let _qdProduct   = null;
let _qdBackdrop  = null;
let _qdDrawer    = null;
let _qdInited    = false;

const SIZE_SURCHARGES_QAD = { '2XL': 1, '3XL': 2, '4XL': 2 };

const SIZE_CONFIGS = {
    kids: ['16', '18', '20', '22', '24', '26', '28'],
    retro: ['S', 'M', 'L', 'XL', '2XL'],
    normal: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    nba: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    champions: ['S', 'M', 'L', 'XL', '2XL', '3XL']
};

const PATCH_DEFINITIONS = {
    ucl: 'Champions League',
    laliga: 'LaLiga',
    premier: 'Premier League',
    serie_a: 'Serie A',
    ligue1: 'Ligue 1',
    bundesliga: 'Bundesliga',
    worldcup: 'World Cup'
};

function getProductType(p) {
    const nameLower = p.name.toLowerCase();
    const imageLower = (p.image || '').toLowerCase();
    if (nameLower.includes('campeones')) return 'champions';
    if (p.kids === true || nameLower.includes('kids') || nameLower.includes('niño') || nameLower.includes('niños') || imageLower.includes('kids')) return 'kids';
    if (p.category === 'nba' || p.league === 'nba') return 'nba';
    if (p.retro === true || nameLower.includes('retro') || p.league === 'retro') return 'retro';
    return 'normal';
}

function getAllowedPatches(p) {
    if (getProductType(p) === 'nba') return [];
    if (p.league === 'laliga') return ['laliga', 'ucl'];
    if (p.league === 'premier') return ['premier', 'ucl'];
    if (p.league === 'serie_a') return ['serie_a', 'ucl'];
    if (p.league === 'ligue1') return ['ligue1', 'ucl'];
    if (p.league === 'bundesliga') return ['bundesliga', 'ucl'];
    if (p.league === 'retro') return ['ucl', 'worldcup'];
    return ['ucl'];
}

function _buildDrawer() {
    if (_qdInited) return;
    _qdInited = true;

    _qdBackdrop = document.createElement('div');
    _qdBackdrop.className = 'qad-backdrop';
    document.body.appendChild(_qdBackdrop);

    _qdDrawer = document.createElement('div');
    _qdDrawer.className = 'qad-drawer';
    _qdDrawer.innerHTML = `
        <div class="qad-handle"></div>
        <div class="qad-body">
            <div class="qad-header">
                <img class="qad-thumb" src="" alt="">
                <div class="qad-header-info">
                    <div class="qad-product-name"></div>
                    <div class="qad-base-price">Desde <strong></strong></div>
                </div>
                <button class="qad-close" title="Cerrar"><i class="fas fa-times"></i></button>
            </div>

            <div class="qad-section-label"><i class="fas fa-ruler"></i> Talla <span style="color:#ef4444;margin-left:2px">*</span></div>
            <div class="qad-field" style="margin-bottom:1rem">
                <select id="qad-size">
                    <option value="">Seleccionar talla…</option>
                </select>
            </div>

            <div class="qad-section-label"><i class="fas fa-tshirt"></i> Personalización <span style="color:var(--text-muted);font-weight:400;text-transform:none;font-size:0.6rem;margin-left:4px">(+€3 si rellenas algún campo)</span></div>
            <div class="qad-custom-grid">
                <div class="qad-field">
                    <label>Nombre</label>
                    <input id="qad-name" type="text" placeholder="Ej: MESSI" maxlength="15" autocomplete="off">
                </div>
                <div class="qad-field">
                    <label>Dorsal</label>
                    <input id="qad-number" type="text" placeholder="Ej: 10" maxlength="3" inputmode="numeric">
                </div>
            </div>

            <div class="qad-patch-wrap" style="display:none">
                <div class="qad-section-label"><i class="fas fa-shield-alt"></i> Parche <span style="color:var(--text-muted);font-weight:400;text-transform:none;font-size:0.6rem;margin-left:4px">(+€2 si rellenas)</span></div>
                <div class="qad-field">
                    <input id="qad-patch" type="text" placeholder="Ej: Champions League" maxlength="30" autocomplete="off">
                </div>
            </div>
            
            <div class="qad-custom-patches-wrap" style="display:none">
                <div class="qad-section-label"><i class="fas fa-shield-alt"></i> Parches Especiales 2026 <span style="color:var(--text-muted);font-weight:400;text-transform:none;font-size:0.6rem;margin-left:4px">(+€1.25 c/u)</span></div>
                <div class="qad-field" id="qad-custom-patches-list" style="display: flex; flex-direction: column; gap: 0.6rem;">
                    <!-- JS injected -->
                </div>
            </div>

            <div class="qad-footer">
                <div class="qad-total">
                    <span class="qad-total-label">Total</span>
                    <span class="qad-total-price">€0.00</span>
                </div>
                <button class="qad-submit" id="qad-submit-btn">
                    <i class="fas fa-cart-plus"></i> Añadir al carrito
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(_qdDrawer);

    _qdBackdrop.addEventListener('click', _closeDrawer);
    _qdDrawer.querySelector('.qad-close').addEventListener('click', _closeDrawer);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') _closeDrawer(); });

    _qdDrawer.querySelector('#qad-size').addEventListener('change', _updateTotal);

    _qdDrawer.querySelector('#qad-name').addEventListener('input', e => {
        let v = e.target.value.replace(/[^A-Za-zÀ-ÿ\s\.]/g, '');
        if (v.length > 15) v = v.slice(0, 15);
        e.target.value = v;
        _updateTotal();
    });
    _qdDrawer.querySelector('#qad-number').addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 3) v = v.slice(0, 3);
        if (v !== '' && parseInt(v) > 999) v = '999';
        e.target.value = v;
        _updateTotal();
    });
    _qdDrawer.querySelector('#qad-patch').addEventListener('input', _updateTotal);

    _qdDrawer.querySelector('#qad-submit-btn').addEventListener('click', _handleDrawerSubmit);

    let touchStartY = 0;
    _qdDrawer.querySelector('.qad-handle').addEventListener('touchstart', e => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    _qdDrawer.querySelector('.qad-handle').addEventListener('touchmove', e => {
        const delta = e.touches[0].clientY - touchStartY;
        if (delta > 60) _closeDrawer();
    }, { passive: true });
}

function _openDrawer(product) {
    _buildDrawer();
    _qdProduct = product;

    const body       = _qdDrawer.querySelector('.qad-body');
    const thumb      = _qdDrawer.querySelector('.qad-thumb');
    const nameEl     = _qdDrawer.querySelector('.qad-product-name');
    const priceEl    = _qdDrawer.querySelector('.qad-base-price strong');
    const sizeSel    = _qdDrawer.querySelector('#qad-size');
    const patchWrap  = _qdDrawer.querySelector('.qad-patch-wrap');
    const patchInput = _qdDrawer.querySelector('#qad-patch');
    const nameInput  = _qdDrawer.querySelector('#qad-name');
    const numInput   = _qdDrawer.querySelector('#qad-number');

    nameInput.value  = '';
    numInput.value   = '';
    patchInput.value = '';
    
    const isChampions = product.name.toLowerCase().includes('campeones');
    const qadCustomGrid = _qdDrawer.querySelector('.qad-custom-grid');
    if (qadCustomGrid) {
        qadCustomGrid.style.display = isChampions ? 'none' : '';
        const prevLabel = qadCustomGrid.previousElementSibling;
        if (prevLabel && prevLabel.classList.contains('qad-section-label')) {
            prevLabel.style.display = isChampions ? 'none' : '';
        }
    }
    body.scrollTop   = 0;

    thumb.src = getMiniImagePath(product.image);
    thumb.alt = product.name;
    nameEl.textContent  = product.name;
    priceEl.textContent = `€${product.price.toFixed(2)}`;

    const productType = getProductType(product);
    const sizes = SIZE_CONFIGS[productType] || SIZE_CONFIGS.normal;
    sizeSel.innerHTML = '<option value="">Seleccionar talla…</option>' +
        sizes.map(sz => {
            const surcharge = SIZE_SURCHARGES_QAD[sz];
            const label = sz + (surcharge ? ` (+€${surcharge})` : '');
            return `<option value="${sz}">${label}</option>`;
        }).join('');

    const allowedPatches = getAllowedPatches(product);
    const customPatchesWrap = _qdDrawer.querySelector('.qad-custom-patches-wrap');
    const customPatchesList = _qdDrawer.querySelector('#qad-custom-patches-list');
    
    if (product.customPatches === 'espana26') {
        patchWrap.style.display = 'none';
        if (customPatchesWrap && customPatchesList) {
            customPatchesWrap.style.display = '';
            const patches = [
                { id: 'qad_cp_doradocentral', label: 'Parche dorado central (Campeones de mundo 2026)', short: 'Campeones', img: '/assets/images/patches/dorado-central.webp' },
                { id: 'qad_cp_mangaderecha', label: 'Parche manga derecha mundial 2026 dorado', short: '26 dorado', img: '/assets/images/patches/manga-derecha.webp' },
                { id: 'qad_cp_mangaizquierda', label: 'Parche Football unites the world manga izquierda', short: 'fifa', img: '/assets/images/patches/manga-izquierda.webp' }
            ];
            if (product.tipo === 'local') {
                patches.push({ id: 'qad_cp_letrasfinal', label: 'Letras debajo de escudo de final', short: 'letras', img: '/assets/images/patches/letras-final.webp' });
            }
            customPatchesList.innerHTML = patches.map(p => `
                <label class="custom-patch-item" style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer; padding: 0.6rem 0.75rem; border: 1px solid var(--border); border-radius: 8px; background: var(--bg-card);">
                    <input type="checkbox" class="qad-custom-patch-cb" value="${p.short}" style="width: 18px; height: 18px; cursor: pointer; accent-color: var(--accent, #6366f1);">
                    <img src="${p.img}" style="width: 30px; height: 30px; object-fit: contain; border-radius: 4px;">
                    <span style="font-size: 0.85rem; color: var(--text-main); flex: 1;">${p.label}</span>
                </label>
            `).join('');
            
            customPatchesList.querySelectorAll('.qad-custom-patch-cb').forEach(cb => {
                cb.addEventListener('change', _updateTotal);
            });
        }
    } else {
        if (customPatchesWrap) customPatchesWrap.style.display = 'none';
        patchWrap.style.display = (allowedPatches.length > 0 && !product.noPatches && !isChampions) ? '' : 'none';
    }
    patchInput.placeholder = allowedPatches.length > 0
        ? 'Ej: ' + (PATCH_DEFINITIONS[allowedPatches[0]] || allowedPatches[0])
        : '';

    _updateTotal();

    _qdBackdrop.classList.add('active');
    _qdDrawer.classList.add('active');
    document.body.style.overflow = 'hidden';

    document.querySelectorAll('.btn-quick-add').forEach(b => b.classList.remove('active'));
    const activeBtn = document.querySelector(`.btn-quick-add[data-id="${product.id}"]`);
    if (activeBtn) activeBtn.classList.add('active');
}

function _closeDrawer() {
    if (!_qdDrawer) return;
    _qdBackdrop.classList.remove('active');
    _qdDrawer.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
        document.querySelectorAll('.btn-quick-add').forEach(b => b.classList.remove('active'));
    }, 300);
}

function _updateTotal() {
    if (!_qdProduct || !_qdDrawer) return;
    const size          = _qdDrawer.querySelector('#qad-size').value;
    const sizeSurcharge = SIZE_SURCHARGES_QAD[size] || 0;
    const name   = _qdDrawer.querySelector('#qad-name').value.trim();
    const number = _qdDrawer.querySelector('#qad-number').value.trim();
    const patch  = _qdDrawer.querySelector('#qad-patch').value.trim();

    let totalPrice      = _qdProduct.price + sizeSurcharge;
    if (name || number) totalPrice += 3;
    
    if (_qdProduct && _qdProduct.customPatches === 'espana26') {
        const customCbs = _qdDrawer.querySelectorAll('#qad-custom-patches-list .qad-custom-patch-cb:checked');
        if (customCbs.length > 0) {
            totalPrice += (customCbs.length * 1.25);
        }
    } else {
        if (patch) totalPrice += 2;
    }

    _qdDrawer.querySelector('.qad-total-price').textContent = `€${totalPrice.toFixed(2)}`;
}

function _handleDrawerSubmit() {
    if (!_qdProduct) return;

    const size = _qdDrawer.querySelector('#qad-size').value;
    if (!size) {
        const sizeField = _qdDrawer.querySelector('#qad-size');
        sizeField.style.borderColor = '#ef4444';
        sizeField.style.boxShadow   = '0 0 0 3px rgba(239,68,68,0.2)';
        setTimeout(() => {
            sizeField.style.borderColor = '';
            sizeField.style.boxShadow   = '';
        }, 1200);
        if (window.Toast) window.Toast.error('Por favor, selecciona una talla');
        return;
    }

    const name   = _qdDrawer.querySelector('#qad-name').value.trim().toUpperCase();
    const number = _qdDrawer.querySelector('#qad-number').value.trim();
    let patch  = _qdDrawer.querySelector('#qad-patch').value.trim();

    const sizeSurcharge = SIZE_SURCHARGES_QAD[size] || 0;
    let totalPrice      = _qdProduct.price + sizeSurcharge;
    if (name || number) totalPrice += 3;
    
    if (_qdProduct && _qdProduct.customPatches === 'espana26') {
        const customCbs = _qdDrawer.querySelectorAll('#qad-custom-patches-list .qad-custom-patch-cb:checked');
        if (customCbs.length > 0) {
            totalPrice += (customCbs.length * 1.25);
            patch = Array.from(customCbs).map(cb => cb.value).join(', ');
        } else {
            patch = '';
        }
    } else {
        if (patch) totalPrice += 2;
    }

    const customization = { size, version: 'aficionado', name, number, patch, extras: [] };
    const cartItem = {
        id:        _qdProduct.id,
        name:      _qdProduct.name,
        image:     _qdProduct.image,
        basePrice: _qdProduct.price,
        price:     totalPrice,
        quantity:  1,
        customization
    };

    const btn = _qdDrawer.querySelector('#qad-submit-btn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    btn.disabled  = true;

    // animate fly to cart
    const card = document.querySelector(`.product-card[data-id="${_qdProduct.id}"]`);
    if (card) animateFlyToCart(card);

    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> ¡Añadido!';
        addToCart(cartItem);

        const productSnapshot = { ..._qdProduct };
        setTimeout(() => {
            _closeDrawer();
            if (typeof showUpsellModal === 'function') {
                showUpsellModal(productSnapshot, size, totalPrice);
            } else if (window.Toast) {
                window.Toast.success('Producto añadido al carrito');
            }
        }, 300);

        setTimeout(() => {
            if (btn) {
                btn.innerHTML = '<i class="fas fa-cart-plus"></i> Añadir al carrito';
                btn.disabled  = false;
            }
        }, 800);
    }, 200);
}

function addToCart(item) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIndex = cart.findIndex(cartItem =>
        cartItem.id === item.id &&
        JSON.stringify(cartItem.customization) === JSON.stringify(item.customization)
    );

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push(item);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartBadge = document.getElementById('cart-count');
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        cartBadge.classList.remove('pulse-animation');
        void cartBadge.offsetWidth;
        cartBadge.classList.add('pulse-animation');
    }
}

function animateFlyToCart(cardElement) {
    const img = cardElement.querySelector('img');
    const cartIcon = document.querySelector('.fa-shopping-cart');
    if (!img || !cartIcon) return;

    const imgRect = img.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    const clone = img.cloneNode(true);
    Object.assign(clone.style, {
        position: 'fixed',
        left: imgRect.left + 'px',
        top: imgRect.top + 'px',
        width: imgRect.width + 'px',
        height: imgRect.height + 'px',
        objectFit: 'cover',
        borderRadius: '50%',
        zIndex: '9999',
        transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
        pointerEvents: 'none',
        boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
    });
    document.body.appendChild(clone);

    requestAnimationFrame(() => {
        Object.assign(clone.style, {
            left: cartRect.left + 'px',
            top: cartRect.top + 'px',
            width: '20px',
            height: '20px',
            opacity: '0.2',
            transform: 'scale(0.1)'
        });
    });

    setTimeout(() => {
        clone.remove();
    }, 800);
}

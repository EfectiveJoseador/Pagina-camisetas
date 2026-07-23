

import products from './products-data.js';
import Analytics from './analytics.js';
import { showUpsellModal } from './upsell-modal.js';

function getBypassImageUrl(url) {
    if (!url || !url.includes('photo.yupoo.com')) return url;
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}

const CONFIG = {
    PRODUCTS_PER_PAGE: 20,
    LAZY_LOAD_THRESHOLD: '200px',
    PLACEHOLDER_COLOR: '#e0e0e0'
};
let allProducts = [];
let filteredProducts = [];
let currentProduct = null;
let selectedLeague = '';
let selectedTeam = '';
let selectedKids = false;
let selectedRetro = false;
let selectedNewSeason = false;
let currentPage = 1;
let totalPages = 1;
let imageObserver = null;

import { db, ref, onValue, get } from './firebase-config.js';

// ── Pinned products (Sync from Firebase) ──────────────────────────────────
let globalPinnedIds = [];
let initialPinnedLoaded = false;

function getPinnedProductIds() {
    return globalPinnedIds;
}

async function loadPinnedProducts() {
    try {
        const snapshot = await get(ref(db, 'pinnedProducts'));
        if (snapshot.exists()) {
            const data = snapshot.val();
            if (data && typeof data.ids === 'string') {
                globalPinnedIds = JSON.parse(data.ids).map(Number);
            } else if (Array.isArray(data)) {
                globalPinnedIds = data.map(Number);
            }
        }
    } catch (e) {
        console.error('Error fetching pinned ids:', e);
    }
    initialPinnedLoaded = true;
}

onValue(ref(db, 'pinnedProducts'), (snapshot) => {
    if (!initialPinnedLoaded) return; // Ignore first trigger, handled by get() in init()
    if (snapshot.exists()) {
        const data = snapshot.val();
        let newPinned = [];
        
        if (data && typeof data.ids === 'string') {
            try {
                newPinned = JSON.parse(data.ids).map(Number);
            } catch (e) { }
        } else if (Array.isArray(data)) {
            newPinned = data.map(Number);
        }
        
        // Re-render if changed
        if (JSON.stringify(newPinned) !== JSON.stringify(globalPinnedIds)) {
            globalPinnedIds = newPinned;
            if (typeof allProducts !== 'undefined' && allProducts.length > 0) {
                if (typeof applyFilters === 'function') applyFilters(false);
            }
        }
    } else {
        if (globalPinnedIds.length > 0) {
            globalPinnedIds = [];
            if (typeof allProducts !== 'undefined' && allProducts.length > 0) {
                if (typeof applyFilters === 'function') applyFilters(false);
            }
        }
    }
});

/**
 * Extracts [startYear, endYear] from a season string embedded anywhere in text.
 * Handles formats like: 25/26, 2025/26, 2025/2026, 2025-26, 2025-2026,
 * "Temporada 26/27", "26/27", etc.
 * Returns null if no season pattern is found.
 */
function extractSeasonYears(text) {
    if (!text) return null;
    // Match patterns: optionally 4-digit year + separator (/ or -) + 2 or 4-digit year
    // Also match standalone short years like "25/26" or "2025/2026"
    const match = text.match(/\b((?:20)?\d{2})[\/-]((?:20)?\d{2})\b/);
    if (!match) return null;

    let start = parseInt(match[1], 10);
    let end   = parseInt(match[2], 10);

    // Expand 2-digit years to 4-digit (assume 2000s)
    if (start < 100) start += (start >= 90 ? 1900 : 2000);
    if (end   < 100) end   += (end   >= 90 ? 1900 : 2000);

    return [start, end];
}
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

const LEAGUE_DISPLAY_MAP = {
    'laliga': 'La Liga',
    'premier': 'Premier League',
    'seriea': 'Serie A',
    'bundesliga': 'Bundesliga',
    'ligue1': 'Ligue 1',
    'retro': 'Retro',
    'selecciones': 'Selecciones',
    'brasileirao': 'Brasileirao',
    'ligaarabe': 'Liga Arabe',
    'saf': 'SAF (Argentina)',
    'nba': 'NBA',
    'eredivisie': 'Eredivisie',
    'ligaportugal': 'Liga Portugal',
    'mls': 'MLS',
    'ligamx': 'Liga MX'
};
const patchPrices = {
    none: 0,
    liga: 2,
    champions: 2,
    europa: 2,
    premier: 2,
    seriea: 2,
    mundial: 2,
    copamundo: 2,
    conmemorativo: 2
};
const SIZE_CONFIGS = {
    kids: ['16', '18', '20', '22', '24', '26', '28'],
    retro: ['S', 'M', 'L', 'XL', '2XL'],
    normal: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    nba: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    champions: ['S', 'M', 'L', 'XL', '2XL', '3XL']
};

const extraPrices = {
    embolso: 2,
    envio: 5,
    caja: 8,
    manga: 4,
    oficial: 10
};


const PATCH_DEFINITIONS = {
    liga: "La Liga",
    premier: "Premier",
    seriea: "Serie A",
    bundesliga: "Bundesliga",
    ligue1: "Ligue 1",
    champions: "Champions",
    europa: "Europa League",
    mundial_clubes: "Mundial Clubes",
    copamundo: "Copa del Mundo",
    eurocopa: "Eurocopa",
    copa_america: "Copa América"
};


function getAllowedPatches(product) {
    if (!product) return [];

    const allowed = [];
    const league = product.league;
    const isNBA = product.category === 'nba' || product.league === 'nba';
    if (isNBA) return [];
    if (product.name.toLowerCase().includes('campeones')) return [];

    
    if (league === 'selecciones' || product.category === 'selecciones') {
        allowed.push('copamundo');
        allowed.push('eurocopa');
        allowed.push('copa_america');
        return allowed;
    }

    
    allowed.push('champions');
    allowed.push('europa');
    allowed.push('mundial_clubes');

    
    switch (league) {
        case 'laliga':
            allowed.push('liga');
            break;
        case 'premier':
            allowed.push('premier');
            break;
        case 'seriea':
            allowed.push('seriea');
            break;
        case 'bundesliga':
            allowed.push('bundesliga');
            break;
        case 'ligue1':
            allowed.push('ligue1');
            break;
    }

    return allowed;
}


function generatePatchOptionsHTML(product) {
    const allowedPatches = getAllowedPatches(product);

    if (allowedPatches.length === 0) {
        return ''; 
    }

    return `
        <div class="form-group">
            <label>Parche (+€2.00)</label>
            <input type="text" class="quick-patch-input" placeholder="Ej: Champions League" maxlength="30">
        </div>
    `;
}
import * as imageLoader from './imageLoader.js';
function initLazyLoading() {
    imageLoader.init();
}

function observeLazyImages() {
    imageLoader.observeNewImages();
}
function calculatePagination() {
    totalPages = Math.ceil(filteredProducts.length / CONFIG.PRODUCTS_PER_PAGE);
    if (currentPage > totalPages) currentPage = totalPages || 1;
}

function getProductsForCurrentPage() {
    const start = (currentPage - 1) * CONFIG.PRODUCTS_PER_PAGE;
    const end = start + CONFIG.PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, end);
}

function goToPage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    
    // Reset skeleton flag so skeletons show for the new page
    const grid = document.getElementById('product-grid');
    if (grid) {
        delete grid.dataset.loadingSkeletons;
    }

    renderProducts();
    const targetElement = document.querySelector('#product-grid .product-card') || document.getElementById('product-grid');
    if (targetElement) {
        const headerHeight = document.querySelector('.main-header')?.offsetHeight || 70;
        const top = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
        window.scrollTo({ top, behavior: 'smooth' });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function renderPagination() {
    const container = document.getElementById('pagination-container');
    if (!container) return;
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let paginationHTML = '<div class="pagination">';
    paginationHTML += `
        <button class="pagination-btn pagination-prev" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }
    if (startPage > 1) {
        paginationHTML += `<button class="pagination-btn" data-page="1">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="pagination-ellipsis">...</span>`;
        }
    }
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>
        `;
    }
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="pagination-ellipsis">...</span>`;
        }
        paginationHTML += `<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`;
    }
    paginationHTML += `
        <button class="pagination-btn pagination-next" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;

    paginationHTML += '</div>';
    const start = (currentPage - 1) * CONFIG.PRODUCTS_PER_PAGE + 1;
    const end = Math.min(currentPage * CONFIG.PRODUCTS_PER_PAGE, filteredProducts.length);
    paginationHTML += `
        <div class="pagination-info">
            Mostrando ${start}-${end} de ${filteredProducts.length} productos
        </div>
    `;

    container.innerHTML = paginationHTML;
    container.querySelectorAll('.pagination-btn[data-page]').forEach(btn => {
        btn.addEventListener('click', () => {
            const page = parseInt(btn.dataset.page);
            goToPage(page);
        });
    });

    // Prefetching inteligente en paginación (Mejora 7)
    const nextBtn = container.querySelector('.pagination-next');
    if (nextBtn && currentPage < totalPages) {
        nextBtn.addEventListener('mouseenter', () => {
            const nextPage = currentPage + 1;
            const start = (nextPage - 1) * CONFIG.PRODUCTS_PER_PAGE;
            const end = start + CONFIG.PRODUCTS_PER_PAGE;
            const nextProducts = filteredProducts.slice(start, end);
            nextProducts.forEach(p => {
                if (p.image) {
                    const img1 = new Image();
                    img1.src = getMiniImagePath(p.image);
                }
                const secImg = getSecondaryMiniImagePath(p);
                if (secImg) {
                    const img2 = new Image();
                    img2.src = secImg;
                }
            });
        }, { once: true });
    }
}

function getMiniImagePath(imagePath) {
    return getBypassImageUrl(imagePath.replace(/\/(\d+)\.(webp|jpg|png|jpeg)$/i, '/$1_mini.$2'));
}

function getSecondaryMiniImagePath(product) {
    if (product.images && product.images.length > 0) {
        return getMiniImagePath(product.images[0]);
    }
    return getBypassImageUrl(product.image.replace(/\/1\.(webp|jpg|png|jpeg)$/i, '/2_mini.$1'));
}

function renderProducts() {
    const grid = document.getElementById('product-grid');
    const noResults = document.getElementById('no-results');

    calculatePagination();

    if (filteredProducts.length === 0) {
        grid.innerHTML = '';
        noResults.classList.remove('hidden');
        renderPagination();
        return;
    }

    noResults.classList.add('hidden');

    // Muestra tarjetas esqueleto para simular la carga (Mejora 4)
    if (grid && grid.dataset.loadingSkeletons !== 'loaded' && grid.dataset.loadingSkeletons !== 'loading') {
        grid.dataset.loadingSkeletons = 'loading';
        grid.innerHTML = Array(8).fill(0).map(() => `
            <div class="skeleton-card">
                <div class="skeleton-image"></div>
                <div class="skeleton-text skeleton-title"></div>
                <div class="skeleton-text skeleton-price"></div>
            </div>
        `).join('');
        setTimeout(() => {
            grid.dataset.loadingSkeletons = 'loaded';
            renderProducts();
        }, 300);
        return;
    }

    const productsToShow = getProductsForCurrentPage();
    const fragment = document.createDocumentFragment();
    const tempDiv = document.createElement('div');

    tempDiv.innerHTML = productsToShow.map(product => {
        const productType = getProductType(product);
        const sizes = SIZE_CONFIGS[productType];
        const sizeOptions = sizes.map(size => {
            const sizeLabel = (size === '2XL') ? `${size} (+€1)` : (size === '3XL' || size === '4XL') ? `${size} (+€2)` : size;
            return `<option value="${size}">${sizeLabel}</option>`;
        }).join('');
        return `
        <article class="product-card" data-id="${product.id}">
            <div class="product-image">
                <span class="badge-sale">OFERTA</span>
                <a href="/pages/producto.html?id=${product.id}">
                    <img 
                        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect fill='%23e5e7eb' width='1' height='1'/%3E%3C/svg%3E"
                        data-src="${getMiniImagePath(product.image)}"
                        alt="${product.name}"
                        class="primary-image lazy-image"
                        width="300"
                        height="300"
                        loading="lazy"
                        onerror="console.error('Image load failed statically:', this.src);"
                    >
                    <img 
                        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect fill='%23e5e7eb' width='1' height='1'/%3E%3C/svg%3E"
                        data-src="${getSecondaryMiniImagePath(product)}"
                        alt="${product.name} - Vista 2"
                        class="secondary-image lazy-image"
                        width="300"
                        height="300"
                        loading="lazy"
                        onerror="console.error('Image load failed statically:', this.src);"
                    >
                </a>
                <button class="btn-quick-add" data-id="${product.id}" title="Añadir al carrito">
                    <i class="fas fa-shopping-basket"></i>
                </button>
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
    `;
    }).join('');
    grid.innerHTML = '';
    while (tempDiv.firstChild) {
        fragment.appendChild(tempDiv.firstChild);
    }
    grid.appendChild(fragment);
    observeLazyImages();
    renderPagination();
    setupQuickAddListeners();
    updateItemListSchema(productsToShow);
}

function updateItemListSchema(productsToShow) {
    let schemaEl = document.getElementById('itemlist-schema');
    if (!schemaEl) {
        schemaEl = document.createElement('script');
        schemaEl.id = 'itemlist-schema';
        schemaEl.type = 'application/ld+json';
        document.head.appendChild(schemaEl);
    }

    const schema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": productsToShow.map((p, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "url": `https://camisetazo.shop/pages/producto.html?id=${p.id}`,
            "name": p.name,
            "image": p.image
        }))
    };

    schemaEl.textContent = JSON.stringify(schema, null, 2);
}


// ─── GLOBAL QUICK-ADD DRAWER ─────────────────────────────────────────────────
let _qdProduct   = null;   // product currently shown in drawer
let _qdBackdrop  = null;
let _qdDrawer    = null;
let _qdInited    = false;

const SIZE_SURCHARGES_QAD = { '2XL': 1, '3XL': 2, '4XL': 2 };

function _buildDrawer() {
    if (_qdInited) return;
    _qdInited = true;

    // backdrop
    _qdBackdrop = document.createElement('div');
    _qdBackdrop.className = 'qad-backdrop';
    document.body.appendChild(_qdBackdrop);

    // drawer shell
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

            <div class="qad-version-wrap" style="display:none">
                <div class="qad-section-label"><i class="fas fa-star"></i> Versión <span style="color:var(--text-muted);font-weight:400;text-transform:none;font-size:0.6rem;margin-left:4px">(+€5 Jugador)</span></div>
                <div class="qad-field" style="margin-bottom:1rem">
                    <select id="qad-version">
                        <option value="aficionado">Versión Fan</option>
                        <option value="jugador">Versión Jugador (+€5)</option>
                    </select>
                </div>
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

    // ── close handlers ─────────────────────────────────────────────────────────────────────
    _qdBackdrop.addEventListener('click', _closeDrawer);
    _qdDrawer.querySelector('.qad-close').addEventListener('click', _closeDrawer);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') _closeDrawer(); });

    // ── size select ────────────────────────────────────────────────────────────────────
    _qdDrawer.querySelector('#qad-size').addEventListener('change', _updateTotal);

    // ── personalisation live sanitize + price ───────────────────────────────────────────
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

    // ── version change: restrict 3XL/4XL for Jugador ─────────────────────────
    _qdDrawer.querySelector('#qad-version').addEventListener('change', _qdApplyVersionSize);

    // ── submit ────────────────────────────────────────────────────────────────────────
    _qdDrawer.querySelector('#qad-submit-btn').addEventListener('click', _handleDrawerSubmit);

    // ── mobile swipe-down to close ───────────────────────────────────────────────────
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

    const body          = _qdDrawer.querySelector('.qad-body');
    const thumb         = _qdDrawer.querySelector('.qad-thumb');
    const nameEl        = _qdDrawer.querySelector('.qad-product-name');
    const priceEl       = _qdDrawer.querySelector('.qad-base-price strong');
    const sizeSel       = _qdDrawer.querySelector('#qad-size');
    const versionWrap   = _qdDrawer.querySelector('.qad-version-wrap');
    const versionSel    = _qdDrawer.querySelector('#qad-version');
    const patchWrap     = _qdDrawer.querySelector('.qad-patch-wrap');
    const patchInput    = _qdDrawer.querySelector('#qad-patch');
    const nameInput     = _qdDrawer.querySelector('#qad-name');
    const numInput      = _qdDrawer.querySelector('#qad-number');

    // reset inputs
    nameInput.value   = '';
    numInput.value    = '';
    patchInput.value  = '';
    // Ocultar personalizacion si es somos campeones
    const isChampions = product.name.toLowerCase().includes('campeones');
    const qadCustomGrid = _qdDrawer.querySelector('.qad-custom-grid');
    if (qadCustomGrid) {
        qadCustomGrid.style.display = isChampions ? 'none' : '';
        const prevLabel = qadCustomGrid.previousElementSibling;
        if (prevLabel && prevLabel.classList.contains('qad-section-label')) {
            prevLabel.style.display = isChampions ? 'none' : '';
        }
    }
    
    if (versionSel) versionSel.value = 'aficionado';
    body.scrollTop    = 0;

    // product info
    thumb.src = getMiniImagePath(product.image);
    thumb.alt = product.name;
    nameEl.textContent  = product.name;
    priceEl.textContent = `€${product.price.toFixed(2)}`;

    // size select options
    const productType = getProductType(product);
    const sizes = SIZE_CONFIGS[productType] || SIZE_CONFIGS.normal;
    sizeSel.innerHTML = '<option value="">Seleccionar talla…</option>' +
        sizes.map(sz => {
            const surcharge = SIZE_SURCHARGES_QAD[sz];
            const label = sz + (surcharge ? ` (+€${surcharge})` : '');
            return `<option value="${sz}">${label}</option>`;
        }).join('');

    // version: mostrar para productos normales (no kids, no retro, no NBA)
    const isRestricted = (productType === 'kids' || productType === 'retro' || productType === 'nba');
    if (versionWrap) {
        versionWrap.style.display = isRestricted ? 'none' : '';
        // registrar listener solo la primera vez (usando flag en el elemento)
        if (!versionSel.dataset.listenerAdded) {
            versionSel.addEventListener('change', _updateTotal);
            versionSel.dataset.listenerAdded = '1';
        }
    }

    // patch: show for non-NBA products
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

    // noPatches: ocultar parches y mostrar banner informativo verde
    const existingBanner = _qdDrawer.querySelector('#qad-patches-banner');
    if (existingBanner) existingBanner.remove();
    if (product.noPatches === true) {
        if (customPatchesWrap) customPatchesWrap.style.display = 'none';
        patchWrap.style.display = 'none';
        patchInput.value = '';
        const banner = document.createElement('div');
        banner.id = 'qad-patches-banner';
        banner.style.cssText = [
            'display:flex', 'align-items:flex-start', 'gap:0.65rem',
            'background:linear-gradient(135deg,rgba(34,197,94,.12),rgba(16,185,129,.08))',
            'border:1.5px solid rgba(34,197,94,.35)', 'border-radius:10px',
            'padding:0.85rem 1rem', 'margin-bottom:1rem',
            'font-size:0.88rem', 'line-height:1.5', 'color:var(--text-main,#fff)'
        ].join(';');
        banner.innerHTML = `<i class="fas fa-tag" style="color:#22c55e;font-size:1rem;margin-top:0.1rem;flex-shrink:0;"></i><div><strong style="display:block;margin-bottom:0.2rem;color:#22c55e;">Precio todo incluido</strong>€${product.price.toFixed(2)} incluye todos los parches de la imagen. No se añaden parches extra.</div>`;
        patchWrap.insertAdjacentElement('beforebegin', banner);
    }

    _updateTotal();
    _qdApplyVersionSize();  // aplicar restricción de talla inicial

    // open
    _qdBackdrop.classList.add('active');
    _qdDrawer.classList.add('active');
    document.body.style.overflow = 'hidden';

    // mark active btn
    document.querySelectorAll('.btn-quick-add').forEach(b => b.classList.remove('active'));
    const activeBtn = document.querySelector(`.btn-quick-add[data-id="${product.id}"]`);
    if (activeBtn) activeBtn.classList.add('active');
}

function _qdApplyVersionSize() {
    if (!_qdDrawer) return;
    const versionSel = _qdDrawer.querySelector('#qad-version');
    const sizeSel    = _qdDrawer.querySelector('#qad-size');
    if (!versionSel || !sizeSel) return;
    if (versionSel.value === 'jugador' && _qdProduct && _qdProduct.customPatches === 'espana26') {
        if (window.Toast) {
            window.Toast.error('La versión jugador para este modelo estará disponible muy pronto.');
        } else {
            alert('La versión jugador para este modelo estará disponible muy pronto.');
        }
        versionSel.value = 'aficionado';
    }
    const isJugador = versionSel.value === 'jugador';
    ['3XL', '4XL'].forEach(sz => {
        const opt = sizeSel.querySelector(`option[value="${sz}"]`);
        if (!opt) return;
        opt.disabled = isJugador;
        opt.hidden   = isJugador;
    });
    if (isJugador && ['3XL', '4XL'].includes(sizeSel.value)) {
        sizeSel.value = 'XL';
        if (window.Toast) window.Toast.error('La talla 3XL/4XL no está disponible en Versión Jugador');
    }
    _updateTotal();
}

function _closeDrawer() {
    if (!_qdDrawer) return;
    _qdBackdrop.classList.remove('active');
    _qdDrawer.classList.remove('active');
    document.body.style.overflow = '';
    document.querySelectorAll('.btn-quick-add').forEach(b => b.classList.remove('active'));
    _qdProduct = null;
}

function _updateTotal() {
    if (!_qdProduct || !_qdDrawer) return;
    const size          = _qdDrawer.querySelector('#qad-size').value;
    const sizeSurcharge = SIZE_SURCHARGES_QAD[size] || 0;
    const version       = _qdDrawer.querySelector('#qad-version')?.value || 'aficionado';
    const name          = _qdDrawer.querySelector('#qad-name').value.trim();
    const number        = _qdDrawer.querySelector('#qad-number').value.trim();
    const patch         = _qdDrawer.querySelector('#qad-patch').value.trim();

    let totalPrice = _qdProduct.price + sizeSurcharge;
    if (version === 'jugador') totalPrice += 5;
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
        // shake the size select as validation feedback
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

    const version = _qdDrawer.querySelector('#qad-version')?.value || 'aficionado';
    const name    = _qdDrawer.querySelector('#qad-name').value.trim().toUpperCase();
    const number  = _qdDrawer.querySelector('#qad-number').value.trim();
    let patch   = _qdDrawer.querySelector('#qad-patch').value.trim();

    const SIZE_SURCHARGES = { '2XL': 1, '3XL': 2, '4XL': 2 };
    const sizeSurcharge   = SIZE_SURCHARGES[size] || 0;
    let totalPrice        = _qdProduct.price + sizeSurcharge;
    if (version === 'jugador') totalPrice += 5;
    if (name || number) totalPrice += 3;

    let patchArr = [];
    if (_qdProduct && _qdProduct.customPatches === 'espana26') {
        const customCbs = _qdDrawer.querySelectorAll('#qad-custom-patches-list .qad-custom-patch-cb:checked');
        if (customCbs.length > 0) {
            totalPrice += (customCbs.length * 1.25);
            patch = Array.from(customCbs).map(cb => cb.value).join(', ');
            patchArr = Array.from(customCbs).map(cb => cb.value);
        } else {
            patch = '';
        }
    } else {
        if (patch) {
            totalPrice += 2;
            patchArr = [patch];
        }
    }

    const customization = { size, version, name, number, patch, patches: patchArr, extras: [] };
    const cartItem = {
        id:        _qdProduct.id,
        name:      _qdProduct.name,
        image:     _qdProduct.image,
        basePrice: _qdProduct.price,
        price:     totalPrice,
        quantity:  1,
        customization
    };

    // button feedback
    const btn = _qdDrawer.querySelector('#qad-submit-btn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    btn.disabled  = true;

    // fly animation from card image
    const card = document.querySelector(`.product-card[data-id="${_qdProduct.id}"]`);
    if (card) animateFlyToCart(card);

    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> ¡Añadido!';
        addToCart(cartItem);

        const productSnapshot = { ..._qdProduct };
        setTimeout(() => {
            _closeDrawer();
            showUpsellModal(productSnapshot, size, totalPrice);
        }, 300);

        setTimeout(() => {
            if (btn) {
                btn.innerHTML = '<i class="fas fa-cart-plus"></i> Añadir al carrito';
                btn.disabled  = false;
            }
        }, 800);
    }, 200);
}

function animateFlyToCart(cardElement) {
    const img = cardElement.querySelector('.primary-image');
    const cartIcon = document.querySelector('.fa-shopping-cart') || document.getElementById('cart-count');
    if (!img || !cartIcon) return;

    const startRect = img.getBoundingClientRect();
    const endRect   = cartIcon.getBoundingClientRect();

    const flyer = document.createElement('img');
    flyer.src = img.src;
    flyer.className = 'cart-fly-item';
    flyer.style.left   = `${startRect.left}px`;
    flyer.style.top    = `${startRect.top}px`;
    flyer.style.width  = `${startRect.width}px`;
    flyer.style.height = `${startRect.height}px`;
    document.body.appendChild(flyer);

    setTimeout(() => {
        flyer.style.left    = `${endRect.left + endRect.width / 2 - 15}px`;
        flyer.style.top     = `${endRect.top  + endRect.height / 2 - 15}px`;
        flyer.style.width   = '30px';
        flyer.style.height  = '30px';
        flyer.style.opacity = '0.2';
    }, 50);

    setTimeout(() => flyer.remove(), 700);
}

function setupQuickAddListeners() {
    document.querySelectorAll('.btn-quick-add').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const productId = parseInt(btn.dataset.id);
            const product   = allProducts.find(p => p.id === productId);
            if (!product) return;
            // toggle: if same product is already open, close
            if (_qdProduct?.id === productId && _qdDrawer?.classList.contains('active')) {
                _closeDrawer();
            } else {
                _openDrawer(product);
            }
        });
    });
}

function toggleQuickAddPanel() {}   // kept for compatibility, no-op
function closeQuickAddPanel()  {}
function closeAllQuickAddPanels() { _closeDrawer(); }


async function init() {
    
    const cachedOrder = getProductOrderFromSession();

    if (cachedOrder && cachedOrder.length === products.length) {
        
        allProducts = cachedOrder.map(id => products.find(p => p.id === id)).filter(Boolean);
        console.log('Using session-cached product order');
    } else {
        
        allProducts = shuffleArray([...products]);
        saveProductOrderToSession(allProducts.map(p => p.id));
        console.log('Generated and cached new product order');
    }

    allProducts = allProducts.map(product => ({
        ...product,
        league: normalizeLeagueKey(product.league)
    }));

    applySpecialPricing();

    filteredProducts = allProducts;
    initLazyLoading();

    populateLeagueFilter();
    attachEventListeners();
    setupModal();

    const grid = document.getElementById('product-grid');
    if (grid) {
        grid.dataset.loadingSkeletons = 'loading';
        grid.innerHTML = Array(8).fill(0).map(() => `
            <div class="skeleton-card">
                <div class="skeleton-image"></div>
                <div class="skeleton-text skeleton-title"></div>
                <div class="skeleton-text skeleton-price"></div>
            </div>
        `).join('');
    }

    applyURLFilters();
    await loadPinnedProducts();

    if (grid) {
        grid.dataset.loadingSkeletons = 'loaded';
    }
    applyFilters(false);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


function getProductOrderFromSession() {
    try {
        const cached = sessionStorage.getItem('tiendaProductOrder');
        if (cached) {
            const data = JSON.parse(cached);
            
            if (Array.isArray(data.order)) {
                return data.order;
            }
        }
    } catch (e) {  }
    return null;
}

function saveProductOrderToSession(orderIds) {
    try {
        sessionStorage.setItem('tiendaProductOrder', JSON.stringify({
            order: orderIds,
            timestamp: Date.now()
        }));
    } catch (e) {  }
}
function applySpecialPricing() {
    allProducts.forEach(product => {
        if (product.fixedPrice === true) return;
        const nameLower = product.name.toLowerCase();
        const imageLower = (product.image || '').toLowerCase();
        const isKids = product.kids === true || nameLower.includes('kids') || nameLower.includes('niño') || nameLower.includes('niños') || imageLower.includes('kids');
        const isRetro = product.retro === true || product.name.toLowerCase().includes('retro') || product.league === 'retro';
        const isNBA = product.category === 'nba' || product.league === 'nba';
        let oldPrice = 25.00;
        let newPrice = 19.90;

        if (isNBA) {
            oldPrice = 30.00;
            newPrice = 24.90;
        } else if (isRetro) {
            oldPrice = 30.00;
            newPrice = 24.90;
        } else if (product.customPatches === 'espana26' && isKids) {
            oldPrice = 29.00;
            newPrice = 23.90;
        } else if (isKids) {
            oldPrice = 27.00;
            newPrice = 21.90;
        } else if (product.customPatches === 'espana26') {
            oldPrice = 27.00;
            newPrice = 21.90;
        }
        product.oldPrice = oldPrice;
        product.price = newPrice;
        product.sale = true;
    });
}
function populateLeagueFilter() {
    const leagues = [...new Set(allProducts.map(p => p.league))].sort();
    const leagueSelect = document.getElementById('filter-league');

    if (leagueSelect) {
        leagueSelect.innerHTML = '<option value="">Todas las Ligas</option>';
        leagues.forEach(league => {
            const option = document.createElement('option');
            option.value = league;
            option.textContent = formatLeagueName(league);
            leagueSelect.appendChild(option);
        });
    }
}
function normalizeLeagueKey(league) {
    if (!league) return league;

    const raw = String(league).trim();
    const normalized = raw
        .toLowerCase()
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    return LEAGUE_NORMALIZATION_MAP[normalized] || normalized.replace(/\s+/g, '');
}

function toTitleCaseLeague(text) {
    return text
        .split(' ')
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
function populateTeamFilter(league) {
    const teamSelect = document.getElementById('filter-team');
    const teamStep = document.getElementById('team-step');

    if (!league) {
        teamStep.classList.add('hidden');
        selectedTeam = '';
        return;
    }

    const leagueProducts = allProducts.filter(p => p.league === league);

    // Dynamic common artifacts/suffixes to clean from team names
    const variants = [
        'Local', 'Visitante', 'Tercera', 'Cuarta', 'Fourth', 'Home', 'Away', 'Third',
        'Portero', 'Goalkeeper', 'GK',
        'Retro', 'Icon', 'Classic', 'Vintage',
        'Especial', 'Special', 'Edici[oó]n.*', 'Limited', 'Commemorative', 'Conmemorativ[ao]',
        'estilo', 'Style',
        'Black', 'Gold', 'Golden', 'White', 'Pink', 'Blue', 'Red', 'Green', 'Golde', 'cyan', 'Negra',
        'Training', 'Entrenamiento', 'Pre-match', 'Pre-partido', 'Warm-up',
        'Anniversary', 'Aniversario', 'Centemary', 'Centenario', '100 Años', '125',
        'Player', 'Fan', 'Vapor', 'Authentic',
        'Stadium', 'Women', 'Edition', 'Polo', 'Dorada', 'Juese'
    ];
    const variantRegex = new RegExp(`\\b(${variants.join('|')})\\b`, 'gi');

    // Mappings for proper display names
    const canonicalNames = {
        'ac milan': 'AC Milan',
        'ajax': 'Ajax',
        'al ahli': 'Al Ahli',
        'al-hilal': 'Al-Hilal',
        'al-nassr': 'Al-Nassr',
        'alaves': 'Alavés',
        'albacete': 'Albacete',
        'alemania': 'Alemania',
        'argelia': 'Argelia',
        'argentina': 'Argentina',
        'arsenal': 'Arsenal',
        'as roma': 'AS Roma',
        'aston villa': 'Aston Villa',
        'athletic club': 'Athletic Club',
        'atletico madrid': 'Atlético Madrid',
        'atletico mineiro': 'Atlético Mineiro',
        'bayern munich': 'Bayern Munich',
        'belgica': 'Bélgica',
        'benfica': 'Benfica',
        'boca juniors': 'Boca Juniors',
        'brasil': 'Brasil',
        'chelsea': 'Chelsea',
        'chile': 'Chile',
        'chivas': 'Chivas',
        'colombia': 'Colombia',
        'corea del sur': 'Corea del Sur',
        'costa rica': 'Costa Rica',
        'croacia': 'Croacia',
        'deportivo la coruna': 'Deportivo La Coruña',
        'dortmund': 'Dortmund',
        'ecuador': 'Ecuador',
        'elche': 'Elche',
        'escocia': 'Escocia',
        'espana': 'España',
        'espanyol': 'Espanyol',
        'estados unidos': 'Estados Unidos',
        'everton': 'Everton',
        'fc barcelona': 'FC Barcelona',
        'feyenoord': 'Feyenoord',
        'finlandia': 'Finlandia',
        'fiorentina': 'Fiorentina',
        'flamengo': 'Flamengo',
        'fluminense': 'Fluminense',
        'francia': 'Francia',
        'gales': 'Gales',
        'getafe': 'Getafe',
        'girona': 'Girona',
        'granada': 'Granada',
        'holanda': 'Holanda',
        'inglaterra': 'Inglaterra',
        'inter miami': 'Inter Miami',
        'inter milan': 'Inter Milan',
        'internacional': 'Internacional',
        'italia': 'Italia',
        'jamaica': 'Jamaica',
        'japon': 'Japón',
        'las palmas': 'Las Palmas',
        'lazio': 'Lazio',
        'leeds united': 'Leeds United',
        'leganes': 'Leganés',
        'leicester city': 'Leicester City',
        'levante': 'Levante',
        'malaga cf': 'Málaga CF',
        'mallorca': 'Mallorca',
        'manchester city': 'Manchester City',
        'manchester united': 'Manchester United',
        'marruecos': 'Marruecos',
        'marseille': 'Marseille',
        'mexico': 'México',
        'monaco': 'Monaco',
        'monterrey': 'Monterrey',
        'napoli': 'Napoli',
        'newcastle united': 'Newcastle United',
        'nigeria': 'Nigeria',
        'noruega': 'Noruega',
        'osasuna': 'Osasuna',
        'palmeiras': 'Palmeiras',
        'peru': 'Perú',
        'polonia': 'Polonia',
        'porto': 'Porto',
        'portugal': 'Portugal',
        'psg': 'PSG',
        'real betis': 'Real Betis',
        'real madrid': 'Real Madrid',
        'real sociedad': 'Real Sociedad',
        'river plate': 'River Plate',
        'rumania': 'Rumania',
        'santos': 'Santos',
        'sao paulo': 'São Paulo',
        'sevilla': 'Sevilla',
        'sporting de lisboa': 'Sporting de Lisboa',
        'sporting gijon': 'Sporting de Gijón',
        'valencia': 'Valencia',
        'valladolid': 'Valladolid',
        'venezuela': 'Venezuela',
        'villarreal': 'Villarreal'
    };

    // Index mappings to group variations into a single key
    const canonicalKeys = {
        'barcelona': 'fc barcelona',
        'milan': 'ac milan',
        'ac milan': 'ac milan',
        'newcastle': 'newcastle united',
        'sporting lisboa': 'sporting de lisboa',
        'sporting lisbon': 'sporting de lisboa',
        'miami': 'inter miami',
        'mexico': 'mexico',
        'man utd': 'manchester united',
        'man united': 'manchester united',
        'boca juniors stadium': 'boca juniors',
        'celta': 'celta de vigo',
        'athletic': 'athletic club',
        'athletic bilbao': 'athletic club',
        'brazil': 'brasil',
        'deportivo la coruna': 'deportivo la coruna',
        'depor': 'deportivo la coruna',
        'deportivo': 'deportivo la coruna',
        'portugal': 'portugal',
        'norway': 'noruega',
        'sweden': 'suecia',
        'brazil juese': 'brasil',
        'finland': 'finlandia',
        'vicenza': 'victoria',
        'vitoria': 'victoria',
        'espana \'somos campeones\'': 'espana',
        'espana mundial 2 estrellas': 'espana'
    };

    const teamMap = new Map();

    leagueProducts.forEach(p => {
        let name = p.name;
        
        name = name.replace(/&amp;/g, '&').replace(/&[a-z]+;/gi, ' ');
        
        // 1. Remove year ranges (e.g., 2025/26, 99/00, /01)
        name = name.replace(/\b\d{2,4}\/\d{2,4}\b/g, '');
        name = name.replace(/\/\d{2,4}\b/g, ''); 
        
        // 2. Remove 4-digit years (e.g., 2024, 1998)
        name = name.replace(/\b(19|20)\d{2}\b/g, ''); 
        
        // 3. Remove standalone 2-digit "years" appearing as suffixes (e.g., "Alaves 19")
        // Protect Schalke 04, Mainz 05, etc.
        name = name.replace(/(?<!Schalke|Mainz|Pumas|CA)\s+\b(19|20|21|22|23|24|25|26|7\d|8\d|9\d)\b/gi, '');

        // 4. Clean up leftovers
        name = name.replace(/\(.*\)/g, ''); 
        name = name.replace(variantRegex, '');
        name = name.replace(/\bS-[X\d]+L?\b/gi, ''); // Size patterns
        name = name.replace(/\s+/g, ' ').trim();

        if (name) {
            let key = normalizeString(name);
            
            // Apply canonical key mapping
            key = canonicalKeys[key] || key;
            
            // Get final display name
            const displayName = canonicalNames[key] || canonicalNames[normalizeString(name)] || name;

            if (key && key.length > 1 && displayName && displayName.trim().length > 1) {
                if (!teamMap.has(key)) {
                    teamMap.set(key, displayName);
                }
            }
        }
    });

    const teams = [...teamMap.values()].sort();

    if (teamSelect) {
        teamSelect.innerHTML = '<option value="">Todos los Equipos</option>';
        teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team;
            option.textContent = team;
            teamSelect.appendChild(option);
        });

        
        if (typeof DropdownDedup !== 'undefined') {
            DropdownDedup.applyMapToDropdown(teamSelect);
        }

        teamStep.classList.remove('hidden');
    }
}
function formatLeagueName(league) {
    const normalizedLeague = normalizeLeagueKey(league);
    if (LEAGUE_DISPLAY_MAP[normalizedLeague]) {
        return LEAGUE_DISPLAY_MAP[normalizedLeague];
    }

    const pretty = String(league || '')
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    return toTitleCaseLeague(pretty);
}
function applyURLFilters() {
    const params = new URLSearchParams(window.location.search);
    const search = params.get('search');
    const league = params.get('league');
    const team = params.get('team');
    const kids = params.get('kids');
    const sort = params.get('sort');
    const utmCampaign = params.get('utm_campaign');

    // Campaign Logic: If utm_campaign is retro, auto-filter
    if (utmCampaign && utmCampaign.toLowerCase().includes('retro')) {
        selectedRetro = true;
        const retroCheckbox = document.getElementById('filter-retro');
        if (retroCheckbox) retroCheckbox.checked = true;
    }

    if (search) {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = decodeURIComponent(search);
        }
    }

    if (league) {
        selectedLeague = normalizeLeagueKey(league);
        const leagueSelect = document.getElementById('filter-league');
        if (leagueSelect) {
            leagueSelect.value = selectedLeague;
            populateTeamFilter(selectedLeague);
        }
    }

    if (team) {
        const decodedTeam = decodeURIComponent(team.replace(/\+/g, ' '));
        selectedTeam = decodedTeam;

        const teamSelect = document.getElementById('filter-team');
        if (teamSelect) {
            teamSelect.value = decodedTeam;
        }
    }

    if (kids) {
        selectedKids = kids === 'true' || kids === 'kids';
        const kidsCheckbox = document.getElementById('filter-kids');
        if (kidsCheckbox) {
            kidsCheckbox.checked = selectedKids;
        }
    }

    if (sort) {
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.value = sort;
        }
    }
}

function updateURLWithFilters(searchTerm, sortBy) {
    const params = new URLSearchParams();

    if (searchTerm) {
        params.set('search', searchTerm);
    }
    if (selectedLeague) {
        params.set('league', selectedLeague);
    }
    if (selectedTeam) {
        params.set('team', selectedTeam);
    }
    if (selectedKids) {
        params.set('kids', selectedKids);
    }
    if (sortBy && sortBy !== 'default') {
        params.set('sort', sortBy);
    }

    const newURL = params.toString()
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;

    history.pushState({}, '', newURL);
}
function attachEventListeners() {
    document.getElementById('search-input').addEventListener('input', (e) => {
        applyFilters();
    });
    document.getElementById('filter-league').addEventListener('change', (e) => {
        selectedLeague = e.target.value;
        selectedTeam = '';
        populateTeamFilter(selectedLeague);
        applyFilters();
    });
    document.getElementById('filter-team').addEventListener('change', (e) => {
        selectedTeam = e.target.value;
        applyFilters();
    });
    
    const kidsCheckbox = document.getElementById('filter-kids');
    if (kidsCheckbox) {
        kidsCheckbox.addEventListener('change', (e) => {
            selectedKids = e.target.checked;
            applyFilters();
        });
    }
    
    const retroCheckbox = document.getElementById('filter-retro');
    if (retroCheckbox) {
        retroCheckbox.addEventListener('change', (e) => {
            selectedRetro = e.target.checked;
            applyFilters();
        });
    }

    const newSeasonCheckbox = document.getElementById('filter-new-season');
    if (newSeasonCheckbox) {
        newSeasonCheckbox.addEventListener('change', (e) => {
            selectedNewSeason = e.target.checked;
            applyFilters();
        });
    }
    document.getElementById('sort-select').addEventListener('change', applyFilters);
    document.getElementById('close-filters').addEventListener('click', () => {
        const container = document.querySelector('.catalog-container');
        container.classList.remove('sidebar-open');
        document.body.style.overflow = '';
    });
    document.getElementById('show-filters').addEventListener('click', () => {
        const container = document.querySelector('.catalog-container');
        container.classList.add('sidebar-open');
        document.body.style.overflow = 'hidden';
    });
    const backdrop = document.querySelector('.filters-backdrop');
    if (backdrop) {
        backdrop.addEventListener('click', () => {
            const container = document.querySelector('.catalog-container');
            container.classList.remove('sidebar-open');
            document.body.style.overflow = '';
        });
    }
    document.getElementById('clear-filters').addEventListener('click', () => {
        document.getElementById('filter-league').value = '';
        selectedLeague = '';
        selectedTeam = '';
        selectedKids = false;
        selectedRetro = false;
        selectedNewSeason = false;
        document.getElementById('team-step').classList.add('hidden');
        
        const kidsCb = document.getElementById('filter-kids');
        if (kidsCb) kidsCb.checked = false;
        
        const retroCb = document.getElementById('filter-retro');
        if (retroCb) retroCb.checked = false;

        const newSeasonCb = document.getElementById('filter-new-season');
        if (newSeasonCb) newSeasonCb.checked = false;

        document.getElementById('search-input').value = '';
        document.getElementById('sort-select').value = 'default';
        applyFilters();
    });
}

function normalizeString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function applyFilters(updateURL = true) {
    const searchInput = document.getElementById('search-input');
    const rawSearch = searchInput ? searchInput.value.trim() : '';
    const searchTerm = normalizeString(rawSearch);
    const sortBy = document.getElementById('sort-select').value;
    currentPage = 1;

    let pageTitleText = 'Catálogo de Camisetas - Camisetazo';
    let h1Text = 'Catálogo Completo';
    if (selectedLeague) {
        const leagueName = LEAGUE_DISPLAY_MAP[selectedLeague] || selectedLeague;
        pageTitleText = `Camisetas de la ${leagueName} Baratas - Réplicas 2026`;
        h1Text = `Camisetas de la ${leagueName} Baratas - Réplicas 2026`;
    }
    if (selectedTeam) {
        const teamName = selectedTeam.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        pageTitleText = `Camisetas del ${teamName} Baratas - Calidad Tailandesa`;
        h1Text = `Camisetas del ${teamName} Baratas - Calidad Tailandesa`;
    }
    document.title = pageTitleText;
    const h1El = document.querySelector('h1');
    if (h1El) h1El.textContent = h1Text;

    // ── Búsqueda exacta por SKU de 4 dígitos ────────────────────────────────
    // Si el usuario escribe exactamente 4 dígitos, mostramos solo ese producto
    const isSkuSearch = /^\d{4}$/.test(rawSearch);
    if (isSkuSearch) {
        filteredProducts = allProducts.filter(product => product.sku === rawSearch);
        if (updateURL) updateURLWithFilters(rawSearch, sortBy);
        renderProducts();
        return;
    }

    // Split search into words for multi-word matching
    const searchWords = searchTerm.split(/\s+/).filter(word => word.length > 0);

    const teamSearchAliases = {
        'sporting de lisboa': ['sporting lisboa', 'sporting lisbon', 'sporting de lisboa'],
        'fc barcelona': ['fc barcelona', 'barcelona'],
        'newcastle united': ['newcastle united', 'newcastle'],
        'méxico': ['mexico', 'méxico'],
        'inter miami': ['inter miami', 'miami'],
        'boca juniors': ['boca juniors', 'boca juniors stadium', 'boca'],
        'manchester united': ['manchester united', 'man utd', 'man united'],
        'alavés': ['alaves', 'alavés'],
        'atlético madrid': ['atletico madrid', 'atlético madrid'],
        'atlético mineiro': ['atletico mineiro', 'atlético mineiro'],
        'são paulo': ['sao paulo', 'são paulo'],
        'celta de vigo': ['celta', 'celta de vigo'],
        'athletic club': ['athletic', 'athletic club', 'athletic bilbao'],
        'brasil': ['brasil', 'brazil']
    };

    filteredProducts = allProducts.filter(product => {
        const productName = normalizeString(product.name);
        const productLeague = normalizeString(formatLeagueName(product.league));
        const productCategory = normalizeString(product.category || '');
        
        // Full searchable text for this product
        const searchableText = `${productName} ${productLeague} ${productCategory}`;

        // Multi-word match: ALL search words must be present in searchableText
        const matchesSearch = searchWords.every(word => searchableText.includes(word));
        
        const matchesLeague = selectedLeague === '' || product.league === selectedLeague;
        
        let matchesTeam = true;
        if (selectedTeam !== '') {
            const teamKey = normalizeString(selectedTeam);
            const aliases = teamSearchAliases[teamKey] || [teamKey];
            matchesTeam = aliases.some(alias => productName.includes(normalizeString(alias)));
        }

        const nameLower = product.name.toLowerCase();
        const imageLower = (product.image || '').toLowerCase();
        const isKidsProduct = product.kids === true || nameLower.includes('kids') || nameLower.includes('niño') || nameLower.includes('niños') || imageLower.includes('kids');

        let matchesKids = true;
        if (selectedKids) {
            matchesKids = isKidsProduct;
        }

        let matchesRetro = true;
        if (selectedRetro) {
            matchesRetro = nameLower.includes('retro');
        }

        return matchesSearch && matchesLeague && matchesTeam && matchesKids && matchesRetro;
    });

    // ── Nueva Temporada filter ────────────────────────────────────────────────
    if (selectedNewSeason) {
        // Cap: any 2-digit year < 30 expands to 2000s correctly (e.g. 26→2026),
        // but years like 88, 91 would expand to 2088, 2091 — clearly retro.
        // We ignore any year above this ceiling to avoid retro shirts winning.
        const MAX_SEASON_YEAR = new Date().getFullYear() + 10; // e.g. 2036

        // Helper to extract the highest VALID (non-retro) year from a single product
        const getMaxYearForProduct = (p) => {
            let y = 0;
            const season = extractSeasonYears(p.name);
            if (season) {
                if (season[0] <= MAX_SEASON_YEAR && season[0] > y) y = season[0];
                if (season[1] <= MAX_SEASON_YEAR && season[1] > y) y = season[1];
            }
            if (p.temporada) {
                const tSeason = extractSeasonYears(String(p.temporada));
                if (tSeason) {
                    if (tSeason[0] <= MAX_SEASON_YEAR && tSeason[0] > y) y = tSeason[0];
                    if (tSeason[1] <= MAX_SEASON_YEAR && tSeason[1] > y) y = tSeason[1];
                } else {
                    const plain = parseInt(p.temporada, 10);
                    if (!isNaN(plain) && plain > 2000 && plain <= MAX_SEASON_YEAR && plain > y) y = plain;
                }
            }
            return y;
        };

        // Find the most recent VALID year within the already-filtered set
        // (respects league/team/search filters, so "España" finds its own max)
        let maxYear = 0;
        filteredProducts.forEach(p => {
            const y = getMaxYearForProduct(p);
            if (y > maxYear) maxYear = y;
        });

        // Keep only products whose season contains that maximum year
        if (maxYear > 0) {
            filteredProducts = filteredProducts.filter(p => getMaxYearForProduct(p) === maxYear);
        }
    }

    // Sorting logic
    function getProductTypeOrder(name) {
        const nameLower = name.toLowerCase();
        const isKids = nameLower.includes('kids') || nameLower.includes('niño') || nameLower.includes('niños');
        if (isKids) return 4;
        if (nameLower.includes('tercera')) return 3;
        if (nameLower.includes('visitante') || name.includes(' F')) return 2;
        if (nameLower.includes('local') || name.includes(' L')) return 1;
        return 5;
    }

    filteredProducts.sort((a, b) => getProductTypeOrder(a.name) - getProductTypeOrder(b.name));
    
    if (sortBy === 'price-asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    // ── Pinned products: float to the top (in pinned order) ──────────────────
    const pinnedIds = getPinnedProductIds();
    if (pinnedIds.length > 0) {
        const pinnedSet = new Set(pinnedIds);
        const pinned = [];
        const rest   = [];
        filteredProducts.forEach(p => {
            if (pinnedSet.has(p.id)) pinned.push(p);
            else rest.push(p);
        });
        // Sort pinned by their admin-defined order
        pinned.sort((a, b) => pinnedIds.indexOf(a.id) - pinnedIds.indexOf(b.id));
        filteredProducts = [...pinned, ...rest];
    }

    // CRITICAL: Update URL and Render UI BEFORE optional Analytics
    // This prevents any analytics error from breaking the core site functionality
    if (updateURL) {
        updateURLWithFilters(rawSearch, sortBy);
    }

    renderProducts();

    // Optional Analytics
    if (window.Analytics) {
        try {
            if (searchTerm && searchTerm.length >= 2) {
                window.Analytics.trackSearch(searchTerm, filteredProducts.length);
            }
            if (selectedLeague) {
                window.Analytics.trackFilterUse('league', selectedLeague);
            }
            if (selectedTeam) {
                window.Analytics.trackFilterUse('team', selectedTeam);
            }
            if (selectedKids) {
                window.Analytics.trackFilterUse('kids', selectedKids);
            }
            if (sortBy !== 'default') {
                window.Analytics.trackFilterUse('sort', sortBy);
            }
        } catch (e) {
            console.warn('[Analytics Error]', e);
        }
    }
}
function setupModal() {
    const modal = document.getElementById('customization-modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    const form = document.getElementById('customization-form');

    if (!modal || !form) return;

    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    form.addEventListener('submit', handleFormSubmit);
    const inputs = ['modal-size', 'modal-version', 'modal-name', 'modal-number', 'modal-patch'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', updatePreview);
            element.addEventListener('input', updatePreview);
        }
    });
}
function openCustomizationModal(productId) {
    currentProduct = allProducts.find(p => p.id === productId);
    if (!currentProduct) return;
    document.getElementById('customization-form').reset();
    document.getElementById('modal-product-id').value = productId;
    populateSizeOptions();

    // noPatches: ocultar solo parches, mostrar banner verde (versión jugador sigue disponible)
    const patchGroup = document.getElementById('modal-patch')?.closest('.form-group');
    const versionGroup = document.getElementById('modal-version')?.closest('.form-group');
    const existingModalBanner = document.getElementById('modal-patches-banner');
    if (existingModalBanner) existingModalBanner.remove();

    if (currentProduct.noPatches === true) {
        if (patchGroup) patchGroup.style.display = 'none';
        const patchSelect = document.getElementById('modal-patch');
        if (patchSelect) patchSelect.value = 'none';
        // Insertar banner verde antes del campo de talla
        const sizeGroup = document.getElementById('modal-size')?.closest('.form-group');
        if (sizeGroup) {
            const banner = document.createElement('div');
            banner.id = 'modal-patches-banner';
            banner.style.cssText = [
                'display:flex', 'align-items:flex-start', 'gap:0.65rem',
                'background:linear-gradient(135deg,rgba(34,197,94,.12),rgba(16,185,129,.08))',
                'border:1.5px solid rgba(34,197,94,.35)', 'border-radius:10px',
                'padding:0.85rem 1rem', 'margin-bottom:1rem',
                'font-size:0.88rem', 'line-height:1.5', 'color:var(--text-main,#1a1a2e)'
            ].join(';');
            banner.innerHTML = `<i class="fas fa-tag" style="color:#22c55e;font-size:1rem;margin-top:0.1rem;flex-shrink:0;"></i><div><strong style="display:block;margin-bottom:0.2rem;color:#22c55e;">Precio todo incluido</strong>€${currentProduct.price.toFixed(2)} incluye todos los parches de la imagen. No se añaden parches extra.</div>`;
            sizeGroup.insertAdjacentElement('beforebegin', banner);
        }
    } else {
        const customPatchesContainer = document.getElementById('custom-patches-modal-container');
        const customPatchesList = document.getElementById('custom-patches-modal-list');
        
        if (currentProduct.customPatches === 'espana26') {
            if (patchGroup) patchGroup.style.display = 'none';
            if (customPatchesContainer && customPatchesList) {
                customPatchesContainer.style.display = 'block';
                const patches = [
                    { id: 'cpm_doradocentral', label: 'Parche dorado central (Campeones de mundo 2026)', short: 'Campeones', img: '/assets/images/patches/dorado-central.webp' },
                    { id: 'cpm_mangaderecha', label: 'Parche manga derecha mundial 2026 dorado', short: '26 dorado', img: '/assets/images/patches/manga-derecha.webp' },
                    { id: 'cpm_mangaizquierda', label: 'Parche Football unites the world manga izquierda', short: 'fifa', img: '/assets/images/patches/manga-izquierda.webp' }
                ];
                if (currentProduct.tipo === 'local') {
                    patches.push({ id: 'cpm_letrasfinal', label: 'Letras debajo de escudo de final', short: 'letras', img: '/assets/images/patches/letras-final.webp' });
                }
                customPatchesList.innerHTML = patches.map(p => `
                    <label class="custom-patch-item" style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer; padding: 0.6rem 0.75rem; border: 1px solid var(--border); border-radius: 8px; background: var(--bg-card);">
                        <input type="checkbox" class="custom-patch-cb" value="${p.short}" style="width: 18px; height: 18px; cursor: pointer; accent-color: var(--accent, #6366f1);">
                        <img src="${p.img}" style="width: 30px; height: 30px; object-fit: contain; border-radius: 4px;">
                        <span style="font-size: 0.85rem; color: var(--text-main); flex: 1;">${p.label}</span>
                    </label>
                `).join('');
                
                customPatchesList.querySelectorAll('.custom-patch-cb').forEach(cb => {
                    cb.addEventListener('change', updatePreview);
                });
            }
        } else {
            if (patchGroup) patchGroup.style.display = '';
            if (customPatchesContainer) customPatchesContainer.style.display = 'none';
        }
        
        if (versionGroup) versionGroup.style.display = '';
    }

    updatePreview();
    document.getElementById('customization-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}
function getProductType(product) {
    const nameLower = product.name.toLowerCase();
    const imageLower = (product.image || '').toLowerCase();
    if (nameLower.includes('campeones')) return 'champions';
    if (product.kids === true || nameLower.includes('kids') || nameLower.includes('niño') || nameLower.includes('niños') || imageLower.includes('kids')) return 'kids';
    if (product.category === 'nba' || product.league === 'nba') return 'nba';
    if (product.retro === true || product.name.toLowerCase().includes('retro') || product.league === 'retro') return 'retro';
    return 'normal';
}
function populateSizeOptions() {
    if (!currentProduct) return;

    const productType = getProductType(currentProduct);
    const sizes = SIZE_CONFIGS[productType];
    const sizeSelect = document.getElementById('modal-size');
    sizeSelect.innerHTML = '<option value="">Seleccionar Talla</option>';
    sizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        const sizeLabel = (size === '2XL') ? `${size} (+€1)` : (size === '3XL' || size === '4XL') ? `${size} (+€2)` : size;
        option.textContent = sizeLabel;
        sizeSelect.appendChild(option);
    });
}
function closeModal() {
    document.getElementById('customization-modal').classList.remove('active');
    document.body.style.overflow = '';
    currentProduct = null;
}
function updatePreview() {
    if (!currentProduct) return;

    const sizeSelect = document.getElementById('modal-size');
    const versionSelect = document.getElementById('modal-version');
    if (versionSelect && versionSelect.value === 'jugador' && currentProduct && currentProduct.customPatches === 'espana26') {
        alert('La versión jugador para este modelo estará disponible muy pronto.');
        versionSelect.value = 'aficionado';
    }
    const nameInput = document.getElementById('modal-name');
    const numberInput = document.getElementById('modal-number');
    const patchSelect = document.getElementById('modal-patch');

    const size = sizeSelect ? sizeSelect.value : '';
    const version = versionSelect ? versionSelect.value : 'aficionado';
    const name = nameInput ? nameInput.value.trim().toUpperCase() : '';
    const number = numberInput ? numberInput.value : '';
    const patch = patchSelect ? patchSelect.value : 'none';

    // Precio base
    const basePrice = currentProduct.price;
    let total = basePrice;

    // Recargos
    const SIZE_SURCHARGES = { '2XL': 1, '3XL': 2, '4XL': 2 };
    const sizeSurcharge = SIZE_SURCHARGES[size] || 0;
    total += sizeSurcharge;

    if (version === 'jugador') total += 5;

    let patchStr = '';
    if (currentProduct && currentProduct.customPatches === 'espana26') {
        const customCbs = document.querySelectorAll('#custom-patches-modal-list .custom-patch-cb:checked');
        if (customCbs.length > 0) {
            total += (customCbs.length * 1.25);
            patchStr = Array.from(customCbs).map(cb => 'Especial').join(', ');
        }
    } else {
        if (patch && patch !== 'none') {
            total += 2;
            patchStr = PATCH_DEFINITIONS[patch] || patch;
        }
    }

    if (name || number) total += 3;

    // Actualizar elementos HTML en el modal
    const basePriceEl = document.getElementById('preview-base-price');
    const totalPriceEl = document.getElementById('preview-total-price');
    const detailsEl = document.getElementById('preview-details');

    if (basePriceEl) basePriceEl.textContent = basePrice.toFixed(2);
    if (totalPriceEl) totalPriceEl.textContent = total.toFixed(2);

    if (detailsEl) {
        let detailsText = '';
        if (size) detailsText += `Talla: ${size}`;
        if (version) detailsText += ` | Versión: ${version === 'jugador' ? 'Jugador' : 'Aficionado'}`;
        if (name && number) detailsText += ` | Personalización: ${name} (${number})`;
        if (patchStr) detailsText += ` | Parche: ${patchStr}`;
        detailsEl.textContent = detailsText;
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    if (!currentProduct) return;

    const sizeSelect = document.getElementById('modal-size');
    const versionSelect = document.getElementById('modal-version');
    const nameInput = document.getElementById('modal-name');
    const numberInput = document.getElementById('modal-number');
    const patchSelect = document.getElementById('modal-patch');

    const size = sizeSelect ? sizeSelect.value : '';
    if (!size) {
        alert('Por favor, selecciona una talla');
        return;
    }

    const version = versionSelect ? versionSelect.value : 'aficionado';
    const name = nameInput ? nameInput.value.trim().toUpperCase() : '';
    const number = numberInput ? numberInput.value : '';
    const patch = patchSelect ? patchSelect.value : 'none';



    if (name && !/^[A-Za-zÀ-ÿ\s\.]+$/.test(name)) {
        alert('El nombre solo puede contener letras, espacios y puntos');
        return;
    }

    if (number && (number < 0 || number > 999)) {
        alert('El dorsal debe estar entre 0 y 999');
        return;
    }

    const SIZE_SURCHARGES = { '2XL': 1, '3XL': 2, '4XL': 2 };
    const sizeSurcharge = SIZE_SURCHARGES[size] || 0;
    let totalPrice = currentProduct.price + sizeSurcharge;
    if (version === 'jugador') totalPrice += 5;
    
    let finalPatchStr = '';
    let finalPatchesArr = [];
    if (currentProduct && currentProduct.customPatches === 'espana26') {
        const customCbs = document.querySelectorAll('#custom-patches-modal-list .custom-patch-cb:checked');
        if (customCbs.length > 0) {
            totalPrice += (customCbs.length * 1.25);
            finalPatchStr = Array.from(customCbs).map(cb => cb.value).join(', ');
            finalPatchesArr = Array.from(customCbs).map(cb => cb.value);
        }
    } else {
        if (patch && patch !== 'none') {
            totalPrice += 2;
            finalPatchStr = patch;
            finalPatchesArr = [patch];
        }
    }
    
    if (name || number) totalPrice += 3;

    const customization = {
        size: size,
        version: version,
        name: name,
        number: number,
        patch: finalPatchStr,
        patches: finalPatchesArr,
        extras: []
    };

    const cartItem = {
        id: currentProduct.id,
        name: currentProduct.name,
        image: currentProduct.image,
        basePrice: currentProduct.price,
        price: totalPrice,
        quantity: 1,
        customization: customization
    };

    // Microinteracción del botón (Spinner + Checkmark + Vuelo) (Mejora 4)
    const submitBtn = document.querySelector('#customization-form .btn-submit');
    const originalHTML = submitBtn ? submitBtn.innerHTML : 'Añadir al Carrito';
    
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
    }

    // Encontrar tarjeta del producto para animar
    const productCard = document.querySelector(`.product-card[data-id="${currentProduct.id}"]`);
    if (productCard) {
        animateFlyToCart(productCard);
    }

    setTimeout(() => {
        if (submitBtn) submitBtn.innerHTML = '<i class="fas fa-check"></i>';
        
        // Agregar al carrito real
        addToCart(cartItem);
        if (Analytics) Analytics.trackAddToCart(cartItem);

        setTimeout(() => {
            if (submitBtn) {
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
            }
            closeModal();
            showUpsellModal(currentProduct, size, totalPrice);
        }, 150);
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
    }
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
updateCartCount();

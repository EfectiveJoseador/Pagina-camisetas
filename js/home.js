import products from './products-data.js';

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
        } else if (isKids) {
            oldPrice = 27.00;
            newPrice = 21.90;
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
}
async function getGlobalFeaturedProducts() {

    const sessionCached = sessionStorage.getItem('featuredProductsSession');
    if (sessionCached) {
        try {
            const cached = JSON.parse(sessionCached);
            if (cached.products && cached.products.length === FEATURED_CONFIG.PRODUCT_COUNT) {
                return cached.products;
            }
        } catch (e) { }
    }

    const randomProducts = getRandomFeaturedProducts();
    saveToSessionStorage(randomProducts);
    return randomProducts;
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

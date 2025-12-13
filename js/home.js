import products from './products-data.js';
import { db, ref, get, set } from './firebase-config.js';
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
        }, 1500);
    }

    initHome();
});

async function initHome() {
    applySpecialPricing();
    initCatalogoCarousel();
    initCatalogoCards();
    await renderBestSellers();
}
function initCatalogoCarousel() {
    const carousel = document.getElementById('catalogo-carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const prevBtn = document.getElementById('catalogo-prev');
    const nextBtn = document.getElementById('catalogo-next');
    const carouselContainer = carousel.querySelector('.carousel-container');

    if (!track || !prevBtn || !nextBtn) return;

    const originalCards = Array.from(track.querySelectorAll('.catalogo-card'));
    if (originalCards.length === 0) return;

    const cardWidth = 220 + 24;
    const totalCards = originalCards.length;


    // Fix cloning to ensure order [1,2,3... 1,2,3 ... 1,2,3]
    // Fix cloning with eager loading for images to prevent stutter
    originalCards.forEach(card => {
        const cloneEnd = card.cloneNode(true);
        cloneEnd.classList.add('carousel-clone');
        // Ensure images load immediately to avoid stutter
        const img = cloneEnd.querySelector('img');
        if (img) img.loading = 'eager';
        track.appendChild(cloneEnd);
    });

    // Prepend clones in correct order
    [...originalCards].reverse().forEach(card => {
        const cloneStart = card.cloneNode(true);
        cloneStart.classList.add('carousel-clone');
        // Ensure images load immediately
        const img = cloneStart.querySelector('img');
        if (img) img.loading = 'eager';
        track.insertBefore(cloneStart, track.firstChild);
    });

    let currentPosition = totalCards * cardWidth; // Start at Originals
    let isJumping = false;
    let animationId = null;
    let isPaused = false;

    const SCROLL_SPEED = 0.3;
    const PAUSE_DURATION = 3000; // Reduced to 3 seconds as requested (+2s faster than 5s)

    function setPosition(position, animate = true) {
        if (animate) {
            track.style.transition = 'transform 150ms ease-out';
        } else {
            track.style.transition = 'none';
        }
        track.style.transform = `translateX(${-position}px)`;
    }

    function checkBoundary(e) {
        // Only trigger if it's the track moving, not a child element transition
        if (e && e.target !== track) return;

        // Forward limit (End of Originals -> Jump to Start of Originals)
        if (currentPosition >= totalCards * 2 * cardWidth) {
            isJumping = true;
            track.style.transition = 'none';
            currentPosition -= totalCards * cardWidth;
            track.style.transform = `translateX(${-currentPosition}px)`;
            void track.offsetHeight;
            isJumping = false;
        }
        // Backward limit (Start of Originals -> Jump to End of Originals)
        if (currentPosition < totalCards * cardWidth) {
            isJumping = true;
            track.style.transition = 'none';
            currentPosition += totalCards * cardWidth;
            track.style.transform = `translateX(${-currentPosition}px)`;
            void track.offsetHeight;
            isJumping = false;
        }
    }

    // Continuous smooth scroll animation
    function smoothScroll() {
        if (isPaused || isJumping) {
            animationId = requestAnimationFrame(smoothScroll);
            return;
        }

        currentPosition += SCROLL_SPEED;

        // Auto-scroll boundary check
        if (currentPosition >= totalCards * 2 * cardWidth) {
            currentPosition -= totalCards * cardWidth;
            track.style.transition = 'none';
            track.style.transform = `translateX(${-currentPosition}px)`;
        } else {
            track.style.transition = 'none';
            track.style.transform = `translateX(${-currentPosition}px)`;
        }

        animationId = requestAnimationFrame(smoothScroll);
    }

    function startAutoScroll() {
        if (animationId) return;
        isPaused = false;
        animationId = requestAnimationFrame(smoothScroll);
    }

    function stopAutoScroll() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }

    function pauseAutoScroll() {
        isPaused = true;
    }

    function resumeAutoScroll() {
        isPaused = false;
    }

    let resumeTimeout = null;
    function handleUserInteraction() {
        pauseAutoScroll();
        if (resumeTimeout) clearTimeout(resumeTimeout);
        resumeTimeout = setTimeout(resumeAutoScroll, PAUSE_DURATION);
    }

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (isJumping) return;
        handleUserInteraction();
        currentPosition -= cardWidth;
        setPosition(currentPosition, true);
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (isJumping) return;
        handleUserInteraction();
        currentPosition += cardWidth;
        setPosition(currentPosition, true);
    });

    track.addEventListener('transitionend', checkBoundary);

    // Only pause when hovering over actual cards (track), not arrows or empty space
    carouselContainer.addEventListener('mouseenter', pauseAutoScroll);
    carouselContainer.addEventListener('mouseleave', () => {
        if (resumeTimeout) clearTimeout(resumeTimeout);
        resumeAutoScroll();
    });

    // Initial position
    setPosition(currentPosition, false);
    track.offsetHeight;

    // Start continuous scroll
    startAutoScroll();

    // Touch swipe support with inertia
    let isDragging = false;
    let startPos = 0;
    let lastPos = 0;
    let lastTime = 0;
    let velocity = 0;
    let inertiaId = null;

    // Set touch-action to allow vertical scroll but capture horizontal
    track.style.touchAction = 'pan-y';
    track.style.userSelect = 'none';
    track.style.webkitUserSelect = 'none';

    function touchStart(event) {
        // Stop any ongoing inertia
        if (inertiaId) {
            cancelAnimationFrame(inertiaId);
            inertiaId = null;
        }
        // Also stop auto-scroll animation completely during touch
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }

        isDragging = true;
        track.classList.add('dragging');
        startPos = event.touches[0].clientX;
        lastPos = startPos;
        lastTime = performance.now();
        velocity = 0;
        isPaused = true;
        if (resumeTimeout) clearTimeout(resumeTimeout);
    }

    function touchMove(event) {
        if (!isDragging) return;

        // Prevent browser from scrolling - this eliminates the delay
        event.preventDefault();

        const currentX = event.touches[0].clientX;
        const diff = currentX - lastPos;
        const now = performance.now();
        const dt = now - lastTime;

        // Direct velocity calculation
        if (dt > 0) {
            velocity = diff / dt * 16;
        }

        currentPosition -= diff;
        lastPos = currentX;
        lastTime = now;

        // Apply position immediately with translate3d for GPU
        track.style.transform = `translate3d(${-currentPosition}px, 0, 0)`;

        // Inline boundary check
        if (currentPosition >= totalCards * 2 * cardWidth) {
            currentPosition -= totalCards * cardWidth;
            track.style.transform = `translate3d(${-currentPosition}px, 0, 0)`;
        } else if (currentPosition < totalCards * cardWidth) {
            currentPosition += totalCards * cardWidth;
            track.style.transform = `translate3d(${-currentPosition}px, 0, 0)`;
        }
    }

    function touchEnd() {
        if (!isDragging) return;
        isDragging = false;
        track.classList.remove('dragging');

        // Apply inertia if velocity is significant
        if (Math.abs(velocity) > 0.5) {
            applyInertia();
        } else {
            // Restart auto-scroll after delay
            if (resumeTimeout) clearTimeout(resumeTimeout);
            resumeTimeout = setTimeout(() => {
                isPaused = false;
                if (!animationId) {
                    animationId = requestAnimationFrame(smoothScroll);
                }
            }, PAUSE_DURATION);
        }
    }

    function applyInertia() {
        const friction = 0.94;

        function inertiaStep() {
            if (Math.abs(velocity) < 0.1) {
                inertiaId = null;
                // Restart auto-scroll after delay
                if (resumeTimeout) clearTimeout(resumeTimeout);
                resumeTimeout = setTimeout(() => {
                    isPaused = false;
                    if (!animationId) {
                        animationId = requestAnimationFrame(smoothScroll);
                    }
                }, PAUSE_DURATION);
                return;
            }

            currentPosition -= velocity;
            velocity *= friction;

            // Inline boundary check
            if (currentPosition >= totalCards * 2 * cardWidth) {
                currentPosition -= totalCards * cardWidth;
            } else if (currentPosition < totalCards * cardWidth) {
                currentPosition += totalCards * cardWidth;
            }

            track.style.transform = `translate3d(${-currentPosition}px, 0, 0)`;

            inertiaId = requestAnimationFrame(inertiaStep);
        }

        inertiaId = requestAnimationFrame(inertiaStep);
    }

    track.addEventListener('touchstart', touchStart, { passive: true });
    track.addEventListener('touchmove', touchMove, { passive: false });
    track.addEventListener('touchend', touchEnd, { passive: true });

    // Add Scrolled class on any movement
    const addScrolledClass = () => {
        carouselContainer.classList.add('scrolled');
        carousel.classList.add('scrolled');
    };

    track.addEventListener('touchstart', addScrolledClass, { once: true, passive: true });
    carouselContainer.addEventListener('scroll', addScrolledClass, { once: true }); // Fallback

    if (carouselContainer) {
        carouselContainer.addEventListener('scroll', () => {
            handleUserInteraction();
        }, { passive: true });
    }

}
let catalogoCardsInitialized = false;

function initCatalogoCards() {
    if (catalogoCardsInitialized) return;
    catalogoCardsInitialized = true;
    document.addEventListener('click', (e) => {
        const dropdownBtn = e.target.closest('.dropdown-btn');
        if (dropdownBtn) {
            e.stopPropagation();
            e.preventDefault();
            const card = dropdownBtn.closest('.catalogo-card');
            document.querySelectorAll('.catalogo-card.dropdown-open').forEach(openCard => {
                if (openCard !== card) openCard.classList.remove('dropdown-open');
            });
            card.classList.toggle('dropdown-open');
            return;
        }
        const dropdownLink = e.target.closest('.dropdown-menu a');
        if (dropdownLink) {
            e.stopPropagation();
            return;
        }
        const catalogoBtn = e.target.closest('.catalogo-btn:not(.dropdown-btn)');
        if (catalogoBtn) {
            e.stopPropagation();
            return;
        }
        const clickableCard = e.target.closest('.catalogo-card-clickable');
        if (clickableCard) {
            if (e.target.closest('.dropdown-menu') || e.target.closest('.dropdown-btn') || e.target.closest('.catalogo-btn')) {
                return;
            }

            const link = clickableCard.dataset.link;
            if (link) window.location.href = link;
            return;
        }
        if (!e.target.closest('.catalogo-card')) {
            document.querySelectorAll('.catalogo-card.dropdown-open').forEach(card => {
                card.classList.remove('dropdown-open');
            });
        }
    });
}
function applySpecialPricing() {
    products.forEach(product => {
        const nameLower = product.name.toLowerCase();
        const isKids = nameLower.includes('kids') || nameLower.includes('niño');
        const isRetro = product.name.trim().endsWith('R') || product.league === 'retro';
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
// Helper function to convert image path to mini version
function getMiniImagePath(imagePath) {
    return imagePath.replace(/\/(\d+)\.(webp|jpg|png|jpeg)$/i, '/$1_mini.$2');
}

// Helper function to get secondary image path (mini version)
function getSecondaryMiniImage(product) {
    // If product has explicit images array (Yupoo imports), use first one
    if (product.images && product.images.length > 0) {
        return getMiniImagePath(product.images[0]);
    }
    // For local products without images array, derive secondary from primary
    // e.g., /assets/productos/La Liga/Alaves2526L/1.webp -> /assets/productos/La Liga/Alaves2526L/2_mini.webp
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
    // First check sessionStorage for current session persistence
    const sessionCached = sessionStorage.getItem('featuredProductsSession');
    if (sessionCached) {
        try {
            const cached = JSON.parse(sessionCached);
            if (cached.products && cached.products.length === FEATURED_CONFIG.PRODUCT_COUNT) {
                console.log('Using session-cached featured products');
                return cached.products;
            }
        } catch (e) { /* ignore parse errors */ }
    }

    // Timeout wrapper to handle blocked Firebase
    const TIMEOUT_MS = 5000;

    try {
        const result = await Promise.race([
            getGlobalFeaturedProductsFromFirebase(),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Firebase timeout')), TIMEOUT_MS)
            )
        ]);
        // Save to sessionStorage for session persistence
        saveToSessionStorage(result);
        return result;
    } catch (error) {
        console.warn('Firebase unavailable, using local fallback:', error.message);
        const fallback = getLocalFallbackProducts();
        // Save fallback to sessionStorage too
        saveToSessionStorage(fallback);
        return fallback;
    }
}

function saveToSessionStorage(productIds) {
    try {
        sessionStorage.setItem('featuredProductsSession', JSON.stringify({
            products: productIds,
            timestamp: Date.now()
        }));
    } catch (e) { /* ignore storage errors */ }
}

async function getGlobalFeaturedProductsFromFirebase() {
    const configRef = ref(db, 'config/featured_products');
    const snapshot = await get(configRef);
    const now = Date.now();

    if (snapshot.exists()) {
        const data = snapshot.val();
        if (data.week_end > now &&
            data.products &&
            data.products.length === FEATURED_CONFIG.PRODUCT_COUNT) {
            console.log('Using existing featured products from Firebase');
            // Cache to localStorage for fallback
            cacheFeaturedProducts(data.products, data.week_end);
            return data.products;
        }
    }
    console.log('Generating new featured products rotation');
    const newProducts = await generateNewFeaturedProducts(configRef, now);
    // Cache new products
    cacheFeaturedProducts(newProducts, now + FEATURED_CONFIG.ROTATION_DAYS * 24 * 60 * 60 * 1000);
    return newProducts;
}

function cacheFeaturedProducts(productIds, expires) {
    try {
        localStorage.setItem('featuredProductsCache', JSON.stringify({
            products: productIds,
            expires: expires
        }));
    } catch (e) { /* ignore storage errors */ }
}

function getLocalFallbackProducts() {
    // Use localStorage cache if available
    const cached = localStorage.getItem('featuredProductsCache');
    if (cached) {
        try {
            const data = JSON.parse(cached);
            if (data.products && Date.now() < data.expires) {
                console.log('Using cached featured products');
                return data.products;
            }
        } catch (e) { /* ignore parse errors */ }
    }

    // Fallback: shuffle local products and pick PRODUCT_COUNT
    const shuffled = [...products].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, FEATURED_CONFIG.PRODUCT_COUNT).map(p => p.id);
}
async function generateNewFeaturedProducts(configRef, now) {
    const shuffled = [...products];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const selected = shuffled.slice(0, FEATURED_CONFIG.PRODUCT_COUNT).map(p => p.id);

    const rotationMs = FEATURED_CONFIG.ROTATION_DAYS * 24 * 60 * 60 * 1000;

    const newData = {
        products: selected,
        week_start: now,
        week_end: now + rotationMs,
        product_count: FEATURED_CONFIG.PRODUCT_COUNT,
        rotation_days: FEATURED_CONFIG.ROTATION_DAYS,
        updated_at: new Date().toISOString()
    };

    try {
        await set(configRef, newData);
        console.log('New featured products saved to Firebase:', selected);
    } catch (error) {
        console.error('Failed to save to Firebase:', error);
    }

    return selected;
}

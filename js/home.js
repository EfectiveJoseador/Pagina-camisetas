import products from './products-data.js';
import { db } from './firebase-config.js';
import { ref, get, set } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
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

    // Unified Touch Support for Swipe
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;
    let startTime = 0;

    track.addEventListener('touchstart', touchStart);
    track.addEventListener('touchend', touchEnd);
    track.addEventListener('touchmove', touchMove);

    function touchStart(index) {
        return function (event) {
            isDragging = true;
            startPos = getPositionX(event);
            pauseAutoScroll(); // Pause auto scroll on touch
            if (resumeTimeout) clearTimeout(resumeTimeout); // Clear resume timeout
            animationID = requestAnimationFrame(animation);
        }
    }

    function touchEnd() {
        isDragging = false;
        cancelAnimationFrame(animationID);
        handleUserInteraction(); // Restart auto scroll after delay
    }

    function touchMove(event) {
        if (isDragging) {
            const currentPositionX = getPositionX(event);
            const diff = currentPositionX - startPos;
            currentPosition -= diff; // Invert diff because transform is negative
            startPos = currentPositionX; // Update start for delta calculation
            setPosition(currentPosition, false); // Move immediately without transition
        }
    }

    function getPositionX(event) {
        return event.touches[0].clientX;
    }

    function animation() {
        if (isDragging) requestAnimationFrame(animation);
    }

    // Add Scrolled class on any movement
    const addScrolledClass = () => {
        carouselContainer.classList.add('scrolled');
        carousel.classList.add('scrolled');
    };

    track.addEventListener('touchstart', addScrolledClass, { once: true });
    carouselContainer.addEventListener('scroll', addScrolledClass, { once: true }); // Fallback

    if (carouselContainer) {
        carouselContainer.addEventListener('scroll', () => {
            // Keep listener for desktop or other interactions
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
    if (product.images && product.images.length > 0) {
        return getMiniImagePath(product.images[0]);
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
    const configRef = ref(db, 'config/featured_products');
    const snapshot = await get(configRef);
    const now = Date.now();

    if (snapshot.exists()) {
        const data = snapshot.val();
        if (data.week_end > now &&
            data.products &&
            data.products.length === FEATURED_CONFIG.PRODUCT_COUNT) {
            console.log('Using existing featured products from Firebase');
            return data.products;
        }
    }
    console.log('Generating new featured products rotation');
    return await generateNewFeaturedProducts(configRef, now);
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

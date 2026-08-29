const CONFIG = {
    ROOT_MARGIN: '250px',
    PRODUCT_CARD_SELECTOR: '.product-card',
    PRIMARY_IMAGE_SELECTOR: '.primary-image[data-src]',
    SECONDARY_IMAGE_SELECTOR: '.secondary-image[data-src]'
};

let observer = null;

export function init() {
    if (!('IntersectionObserver' in window)) {
        fallbackLoadAll();
        return;
    }
    createObserver();
}

export function observeNewImages() {
    if (!observer) {
        fallbackLoadAll();
        return;
    }

    document.querySelectorAll(CONFIG.PRODUCT_CARD_SELECTOR).forEach((card) => {
        observer.observe(card);
    });
}

export function destroy() {
    if (observer) {
        observer.disconnect();
        observer = null;
    }
}

function createObserver() {
    if (observer) observer.disconnect();
    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadCardImages(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: CONFIG.ROOT_MARGIN,
        threshold: 0.01
    });
}

function loadCardImages(card) {
    const primaryImg = card.querySelector(CONFIG.PRIMARY_IMAGE_SELECTOR);
    const secondaryImg = card.querySelector(CONFIG.SECONDARY_IMAGE_SELECTOR);

    if (primaryImg && primaryImg.dataset.src) {
        primaryImg.src = primaryImg.dataset.src;
        primaryImg.removeAttribute('data-src');
        primaryImg.classList.add('loaded');
    }
    if (secondaryImg && secondaryImg.dataset.src) {
        secondaryImg.src = secondaryImg.dataset.src;
        secondaryImg.removeAttribute('data-src');
        secondaryImg.classList.add('loaded');
    }
    card.classList.add('images-loaded');
}

function fallbackLoadAll() {
    document.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
    });
}

export default {
    init,
    observeNewImages,
    destroy
};


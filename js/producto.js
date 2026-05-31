import products from './products-data.js';
import Analytics from './analytics.js';
import Health from './health-check.js';
const patchPrices = {
    none: 0,
    liga: 1.5,
    premier: 1.5,
    seriea: 1.5,
    bundesliga: 1.5,
    ligue1: 1.5,
    champions: 1.5,
    europa: 1.5,
    mundial_clubes: 1.5,
    copamundo: 1.5,
    eurocopa: 1.5,
    copa_america: 1.5
};

const PATCH_DEFINITIONS = {
    liga: "La Liga",
    premier: "Premier League",
    seriea: "Serie A",
    bundesliga: "Bundesliga",
    ligue1: "Ligue 1",
    champions: "Champions League",
    europa: "Europa League",
    mundial_clubes: "Mundial de Clubes",
    copamundo: "Copa del Mundo",
    eurocopa: "Eurocopa",
    copa_america: "Copa América"
};

let product = null;
let selectedSize = '';
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

function normalizeLeagueKey(league) {
    if (!league) return league;
    return LEAGUE_NORMALIZATION_MAP[String(league).toLowerCase().trim()] || String(league).toLowerCase().trim();
}

// Suplemento de precio por talla oversize
const SIZE_SURCHARGES = {
    'S':   0,
    'M':   0,
    'L':   0,
    'XL':  0,
    '2XL': 1,
    '3XL': 2,
    '4XL': 2
};

/** Devuelve el suplemento (€) para la talla indicada */
function getSizeSurcharge(size) {
    return SIZE_SURCHARGES[size] || 0;
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    product = products.find(p => p.id === productId);

    if (!product) {
        window.location.href = '/pages/catalogo.html';
        return;
    }
    applySpecialPricing(product);
    products.forEach(p => applySpecialPricing(p));
    document.title = `${product.name} - Camisetazo`;
    if (Analytics) Analytics.trackViewItem(product);
    initPlayerVersionListener();

    
    const leagueNames = {
        'laliga': 'La Liga',
        'premier': 'Premier League',
        'seriea': 'Serie A',
        'bundesliga': 'Bundesliga',
        'ligue1': 'Ligue 1',
        'retro': 'Retro',
        'selecciones': 'Selecciones',
        'brasileirao': 'Brasileirão',
        'ligaarabe': 'Liga Árabe',
        'saf': 'SAF (Argentina)',
        'nba': 'NBA',
        'eredivisie': 'Eredivisie',
        'ligaportugal': 'Liga Portugal',
        'mls': 'MLS',
        'ligamx': 'Liga MX'
    };
    const normalizedLeague = normalizeLeagueKey(product.league);
    const leagueName = leagueNames[normalizedLeague] || product.league;
    const breadcrumbLeague = document.getElementById('breadcrumb-league');
    if (breadcrumbLeague) {
        breadcrumbLeague.textContent = leagueName;
        breadcrumbLeague.href = `/pages/tienda.html?league=${normalizedLeague}`;
    }

    
    
    const teamName = product.name
        .replace(/\s*\d{2}\/?\d{2}.*$/, '')  
        .replace(/\s*\(Niño\).*$/i, '')      
        .replace(/\s*(Local|Visitante|Tercera|Cuarta|Especial|Retro|Entrenamiento|Portero|estilo).*$/i, '')
        .trim();

    const breadcrumbTeam = document.getElementById('breadcrumb-team');
    if (breadcrumbTeam && teamName) {
        breadcrumbTeam.textContent = teamName;
        
        breadcrumbTeam.href = `/pages/tienda.html?league=${normalizedLeague}&team=${encodeURIComponent(teamName)}`;
    }

    document.getElementById('breadcrumb-name').textContent = product.name;
    document.getElementById('product-category').textContent = product.category;
    document.getElementById('product-name').textContent = product.name;
    // Eliminar skeleton del precio antes de mostrar el valor real (CLS fix)
    const priceEl = document.getElementById('product-price');
    priceEl.classList.remove('skeleton');
    priceEl.textContent = `€${product.price.toFixed(2)}`;


    if (product.oldPrice) {
        const oldPriceEl = document.getElementById('product-old-price');
        oldPriceEl.textContent = `€${product.oldPrice.toFixed(2)}`;
        oldPriceEl.classList.remove('hidden');
    }

    const mainImg = document.getElementById('main-img');
    mainImg.src = product.image;
    mainImg.alt = product.imageAlt || product.name;

    // Eliminar skeleton de imagen cuando cargue (CLS fix)
    const mainImageContainer = document.querySelector('.main-image');
    const removeSkeleton = () => {
        mainImageContainer?.classList.remove('skeleton-wrap');
        mainImg.style.opacity = '1';
        mainImg.style.transition = 'opacity 0.25s ease';
    };
    if (mainImg.complete && mainImg.naturalWidth > 0) {
        removeSkeleton();
    } else {
        mainImg.addEventListener('load', removeSkeleton, { once: true });
        mainImg.addEventListener('error', removeSkeleton, { once: true });
    }
    mainImg.onerror = function () {
        this.onerror = null;
        this.src = '/assets/images/placeholder-jersey.webp';
        console.warn('Failed to load product image:', product.image);
    };

    const thumbnailsContainer = document.querySelector('.thumbnails');
    let availableImages = [];
    let currentImageIndex = 0;

    
    async function loadProductImages() {
        
        if (product.images && Array.isArray(product.images) && product.images.length > 0) {
            // ─── Regla de Galería Simétrica (2×2 Mobile-First) ──────────────────
            // Si hay 5 o más imágenes secundarias la cuadrícula queda desequilibrada
            // (una imagen "huérfana" al final). Para garantizar siempre un grid perfecto
            // de 2x2 en móvil, limitamos las secundarias a un máximo de 4.
            const secondaryImages = product.images.length >= 5
                ? product.images.slice(0, 4)
                : product.images;

            const allImages = [product.image, ...secondaryImages];

            
            const imagePromises = allImages.map((imgUrl, index) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => resolve({ index: index + 1, path: imgUrl, exists: true });
                    img.onerror = () => resolve({ index: index + 1, path: imgUrl, exists: false });
                    img.src = imgUrl;
                    
                    setTimeout(() => resolve({ index: index + 1, path: imgUrl, exists: false }), 5000);
                });
            });

            const results = await Promise.all(imagePromises);
            availableImages = results.filter(r => r.exists);

        } else {
            
            const basePath = product.image.replace('/1.webp', '');
            const imagePromises = [];

            for (let i = 1; i <= 4; i++) {
                const imagePath = `${basePath}/${i}.webp`;
                imagePromises.push(
                    new Promise((resolve) => {
                        const img = new Image();
                        img.onload = () => resolve({ index: i, path: imagePath, exists: true });
                        img.onerror = () => resolve({ index: i, path: imagePath, exists: false });
                        img.src = imagePath;
                    })
                );
            }

            const results = await Promise.all(imagePromises);
            availableImages = results.filter(r => r.exists);
        }

        
        if (availableImages.length === 0 && product.image) {
            availableImages = [{ index: 1, path: product.image, exists: true }];
        }

        
        availableImages.forEach((img, idx) => {
            const thumb = document.createElement('div');
            thumb.className = `thumb ${idx === 0 ? 'active' : ''}`;
            thumb.innerHTML = `<img src="${img.path}" alt="Vista ${img.index}" onerror="this.style.display='none'">`;
            thumb.addEventListener('click', () => {
                currentImageIndex = idx;
                updateMainImage();
            });
            thumbnailsContainer.appendChild(thumb);
        });

        
        const prevBtn = document.getElementById('prev-image');
        const nextBtn = document.getElementById('next-image');

        prevBtn.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + availableImages.length) % availableImages.length;
            updateMainImage();
        });

        nextBtn.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % availableImages.length;
            updateMainImage();
        });
    }

    function updateMainImage() {
        if (availableImages[currentImageIndex]) {
            mainImg.src = availableImages[currentImageIndex].path;
            document.querySelectorAll('.thumb').forEach((t, i) => {
                t.classList.toggle('active', i === currentImageIndex);
            });
        }
    }

    
    loadProductImages();

    // Selector de talla (dropdown)
    const sizeSelect = document.getElementById('size-select');
    if (sizeSelect) {
        // Si es producto de niño, sustituir las tallas de adulto por tallas infantiles (16-28)
        const _nameLower = (product.name || '').toLowerCase();
        const _imgLower  = (product.image || '').toLowerCase();
        const _isKids = product.kids === true
            || _nameLower.includes('niño')
            || _nameLower.includes('niños')
            || _nameLower.includes('kids')
            || _imgLower.includes('kids');

        if (_isKids) {
            sizeSelect.innerHTML = '<option value="" disabled selected>— Elige la talla —</option>';
            for (let t = 16; t <= 28; t += 2) {
                const opt = document.createElement('option');
                opt.value = String(t);
                opt.textContent = String(t);
                sizeSelect.appendChild(opt);
            }
        }

        sizeSelect.addEventListener('change', () => {
            selectedSize = sizeSelect.value;
            updatePreview();
        });
    }

    // --- Dead code: size-btn (botones físicos). No se usan en producción
    // (el selector activo es #size-select). Se mantiene por compatibilidad.
    // document.querySelectorAll('.size-btn').forEach(btn => { ... });

    const qtyInput = document.getElementById('qty-input');
    document.getElementById('qty-minus').addEventListener('click', () => {
        const currentValue = parseInt(qtyInput.value);
        if (currentValue > 1) {
            qtyInput.value = currentValue - 1;
        }
    });

    document.getElementById('qty-plus').addEventListener('click', () => {
        const currentValue = parseInt(qtyInput.value);
        if (currentValue < 10) {
            qtyInput.value = currentValue + 1;
        }
    });
    document.getElementById('version-select').addEventListener('change', () => {
        applyPlayerVersionSizeRestriction();
        updatePreview();
    });
    document.getElementById('name-input').addEventListener('input', handleNameInput);
    document.getElementById('number-input').addEventListener('input', handleDorsalInput);
    document.getElementById('patch-input').addEventListener('input', updatePreview);
    document.getElementById('add-to-cart-btn').addEventListener('click', addToCart);
    loadRelatedProducts();
    applyProductRestrictions();
    updatePreview();
    updateProductSchema();
});

function updateProductSchema() {
    const schemaEl = document.getElementById('product-schema');
    if (!schemaEl || !product) return;

    const schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": product.image,
        "description": `${product.name} - Camiseta de fútbol de alta calidad. Categoría: ${product.category}. Disponible en varias tallas y personalizable.`,
        "sku": `JER-${product.id}`,
        "brand": {
            "@type": "Brand",
            "name": "Camisetazo"
        },
        "offers": {
            "@type": "Offer",
            "url": window.location.href,
            "priceCurrency": "EUR",
            "price": product.price.toFixed(2),
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition",
            "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            "shippingDetails": {
                "@type": "OfferShippingDetails",
                "shippingRate": {
                    "@type": "MonetaryAmount",
                    "value": "0",
                    "currency": "EUR"
                },
                "deliveryTime": {
                    "@type": "ShippingDeliveryTime",
                    "handlingTime": {
                        "@type": "QuantitativeValue",
                        "minValue": 1,
                        "maxValue": 2,
                        "unitCode": "DAY"
                    },
                    "transitTime": {
                        "@type": "QuantitativeValue",
                        "minValue": 7,
                        "maxValue": 12,
                        "unitCode": "DAY"
                    }
                }
            },
            "seller": {
                "@type": "Organization",
                "name": "Camisetazo"
            }
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "320"
        }
    };

    schemaEl.textContent = JSON.stringify(schema, null, 2);
}
function applySpecialPricing(p) {
    const nameLower = p.name.toLowerCase();
    const imageLower = (p.image || '').toLowerCase();
    const isKids = p.kids === true || nameLower.includes('kids') || nameLower.includes('niño') || nameLower.includes('niños') || imageLower.includes('kids');
    const isRetro = p.retro === true || p.name.toLowerCase().includes('retro') || p.league === 'retro';
    const isNBA = p.category === 'nba' || p.league === 'nba';
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
    p.oldPrice = oldPrice;
    p.price = newPrice;
    p.sale = true;
}

function isRestrictedCategory() {
    if (!product) return { isRestricted: false, isNBA: false };
    const nameLower = product.name.toLowerCase();
    const imageLower = (product.image || '').toLowerCase();
    const isKids = product.kids === true || nameLower.includes('kids') || nameLower.includes('niño') || nameLower.includes('niños') || imageLower.includes('kids');
    const isRetro = product.retro === true || product.name.toLowerCase().includes('retro') || product.league === 'retro';
    const isNBA = product.category === 'nba' || product.league === 'nba';

    return {
        isRestricted: isKids || isNBA || isRetro,
        isNBA: isNBA,
        isKids: isKids,
        isRetro: isRetro
    };
}

function getAllowedPatches(product) {
    if (!product) return [];

    const allowed = [];
    const league = product.league;

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

// Removido renderPatchOptions ya que ahora se usa un input de texto libre

function applyProductRestrictions() {
    const { isRestricted, isNBA, isKids } = isRestrictedCategory();

    const versionSelect = document.getElementById('version-select');
    const versionGroup = versionSelect?.closest('.option-group');
    const patchInput = document.getElementById('patch-input');
    const patchGroup = patchInput?.closest('.option-group');
    const numberInput = document.getElementById('number-input');
    const numberLabel = numberInput?.previousElementSibling;
    const nameInput = document.getElementById('name-input');
    const nameLabel = nameInput?.previousElementSibling;

    // Tallas infantiles: sustituir el desplegable cuando el producto es de niño
    const sizeSelect = document.getElementById('size-select');
    if (isKids && sizeSelect) {
        sizeSelect.innerHTML = '<option value="" disabled selected>— Elige la talla —</option>';
        for (let t = 16; t <= 28; t += 2) {
            const opt = document.createElement('option');
            opt.value = String(t);
            opt.textContent = String(t);
            sizeSelect.appendChild(opt);
        }
    }

    if (isRestricted && versionGroup) {
        versionGroup.style.display = 'none';
        if (versionSelect) {
            versionSelect.value = 'aficionado';
        }
    }
    if (isNBA) {
        if (patchGroup) {
            patchGroup.style.display = 'none';
        }
        if (patchInput) {
            patchInput.value = '';
        }
    }
}
function handleNameInput(e) {
    let value = e.target.value;
    value = value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
    if (value.length > 15) {
        value = value.slice(0, 15);
    }

    e.target.value = value;
    updatePreview();
}
function handleDorsalInput(e) {
    let value = e.target.value;
    value = value.replace(/\D/g, '');
    if (value.length > 2) {
        value = value.slice(0, 2);
    }
    if (value !== '') {
        const numValue = parseInt(value);
        if (numValue > 99) {
            value = '99';
        }
    }

    e.target.value = value;
    updatePreview();
}

function updatePreview() {
    if (!product) return;

    const basePrice = product.price;
    let totalPrice = basePrice;
    const details = [];

    // --- Suplemento por talla oversize ---
    const sizeSurcharge = getSizeSurcharge(selectedSize);
    if (selectedSize) {
        if (sizeSurcharge > 0) {
            totalPrice += sizeSurcharge;
            details.push(`Talla: ${selectedSize} (+€${sizeSurcharge})`);
        } else {
            details.push(`Talla: ${selectedSize}`);
        }
    }

    // --- Versión ---
    const version = document.getElementById('version-select').value;
    if (version === 'jugador') {
        totalPrice += 5;
        details.push('Versión Jugador: +€5');
    }

    // --- Parche ---
    const patch = document.getElementById('patch-input').value.trim();
    if (patch) {
        const patchCost = 1.5;
        totalPrice += patchCost;
        details.push(`Parche ${patch}: +€${patchCost.toFixed(2)}`);
    }

    // --- Personalización ---
    const name = document.getElementById('name-input').value.trim();
    const number = document.getElementById('number-input').value;
    if (name && number) {
        totalPrice += 2;
        details.push(`Nombre: ${name.toUpperCase()}`);
        details.push(`Dorsal: ${number}`);
        details.push('Personalización: +€2');
    } else if (name) {
        details.push(`Nombre: ${name.toUpperCase()}`);
    } else if (number) {
        details.push(`Dorsal: ${number}`);
    }

    // --- Actualizar precio principal mostrado en pantalla ---
    const productPriceEl = document.getElementById('product-price');
    if (productPriceEl) {
        productPriceEl.textContent = `€${totalPrice.toFixed(2)}`;
    }

    // --- Resumen de personalización ---
    document.getElementById('preview-base').textContent = `€${basePrice.toFixed(2)}`;
    document.getElementById('preview-list').innerHTML = details.length > 0
        ? details.map(d => `<span>• ${d}</span>`).join('')
        : '<span style="color: var(--text-muted); font-style: italic;">Sin personalizaciones</span>';
    document.getElementById('preview-total').textContent = `€${totalPrice.toFixed(2)}`;
}

// ── Lógica de Alerta Versión Jugador ─────────────────────────────────────
function showPlayerVersionModal() {
    const modal = document.getElementById('pv-modal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
    }
}

function closePlayerVersionModal() {
    const modal = document.getElementById('pv-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
    }
}

/**
 * Oculta/muestra las opciones 3XL y 4XL del selector de talla
 * dependiendo de si la versión jugador está activa.
 * Si la talla seleccionada queda inválida, resetea al placeholder.
 */
function applyPlayerVersionSizeRestriction() {
    const versionSelect = document.getElementById('version-select');
    const sizeSelect   = document.getElementById('size-select');
    if (!versionSelect || !sizeSelect) return;

    const isJugador = versionSelect.value === 'jugador';
    const RESTRICTED = ['3XL', '4XL'];

    RESTRICTED.forEach(size => {
        const opt = sizeSelect.querySelector(`option[value="${size}"]`);
        if (!opt) return;
        if (isJugador) {
            opt.disabled = true;
            opt.hidden   = true;
        } else {
            opt.disabled = false;
            opt.hidden   = false;
        }
    });

    // Si la talla actualmente seleccionada ya no está disponible, resetear
    if (isJugador && RESTRICTED.includes(sizeSelect.value)) {
        sizeSelect.value = '';
        selectedSize = '';
        if (window.Toast) {
            window.Toast.error('La talla 3XL/4XL no está disponible en Versión Jugador');
        }
    }
}

function initPlayerVersionListener() {
    const versionSelect = document.getElementById('version-select');
    const closeBtn = document.getElementById('pv-close-btn');
    const overlay = document.querySelector('.pv-overlay');

    if (versionSelect) {
        versionSelect.addEventListener('change', (e) => {
            if (e.target.value === 'jugador') {
                showPlayerVersionModal();
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closePlayerVersionModal);
    }

    if (overlay) {
        overlay.addEventListener('click', closePlayerVersionModal);
    }
}

function addToCart() {
    // Validar talla seleccionada
    if (!selectedSize) {
        const sizeSelect = document.getElementById('size-select');
        if (sizeSelect) {
            sizeSelect.focus();
            sizeSelect.style.borderColor = '#ef4444';
            sizeSelect.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.2)';
            setTimeout(() => {
                sizeSelect.style.borderColor = '';
                sizeSelect.style.boxShadow = '';
            }, 2500);
        }
        if (window.Toast) {
            window.Toast.error('Por favor, selecciona una talla antes de continuar');
        } else {
            alert('Por favor, selecciona una talla antes de continuar');
        }
        return;
    }

    // Feedback inmediato: bloquear doble-tap y dar respuesta visual (INP fix)
    const cartBtn = document.getElementById('add-to-cart-btn');
    if (cartBtn) {
        cartBtn.classList.add('adding');
        setTimeout(() => cartBtn.classList.remove('adding'), 600);
    }

    const name = document.getElementById('name-input').value.trim();
    const number = document.getElementById('number-input').value;
    const hasName = name.length > 0;
    const hasNumber = number.length > 0;

    if (hasName !== hasNumber) {
        alert('Debes completar tanto el nombre como el dorsal, o dejar ambos vacíos');
        return;
    }
    if (name && !/^[A-Za-zÀ-ÿ\s]+$/.test(name)) {
        alert('El nombre solo puede contener letras y espacios');
        return;
    }
    if (number) {
        const numValue = parseInt(number);
        if (number.length > 2 || numValue < 0 || numValue > 99 || isNaN(numValue)) {
            alert('El dorsal debe ser un número entre 0 y 99 (máximo 2 dígitos)');
            return;
        }
    }
    const sizeSurcharge = getSizeSurcharge(selectedSize);
    const customization = {
        size: selectedSize,
        sizeSurcharge: sizeSurcharge,
        version: document.getElementById('version-select').value,
        name: name ? name.toUpperCase() : '',
        number: number || '',
        patch: document.getElementById('patch-input').value.trim()
    };
    let totalPrice = product.price;
    totalPrice += sizeSurcharge;                                          // suplemento talla
    if (customization.version === 'jugador') totalPrice += 5;
    if (customization.patch) {
        totalPrice += 1.5;
    }
    if (customization.name && customization.number) {
        totalPrice += 2;
    }
    const quantity = parseInt(document.getElementById('qty-input').value) || 1;
    const cartItem = {
        id: product.id,
        name: product.name,
        image: product.image,
        basePrice: product.price,
        price: totalPrice,
        quantity: quantity,
        customization: customization
    };
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');

    const existingIndex = cart.findIndex(item =>
        item.id === cartItem.id &&
        JSON.stringify(item.customization) === JSON.stringify(cartItem.customization)
    );

    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push(cartItem);
    }

    if (Analytics) Analytics.trackAddToCart(cartItem);
    
    // El closeModal() disparaba error si no existía, lo quitamos o rodeamos
    // en este contexto no hay modal de "añadir", hay toast.
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    if (window.Toast) {
        window.Toast.success(`${product.name} añadido al carrito`);
    } else {
        showToast(`${product.name} añadido al carrito`);
    }

    if (window.CartBadge) {
        window.CartBadge.animate();
    }

    if (window.Analytics) {
        window.Analytics.trackAddToCart(product, quantity, customization);
    }
}
function showToast(message) {
    const existingToast = document.querySelector('.cart-toast');
    if (existingToast) existingToast.remove();
    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    if (!document.getElementById('toast-styles')) {
        const styles = document.createElement('style');
        styles.id = 'toast-styles';
        styles.textContent = `
            .cart-toast {
                position: fixed;
                bottom: 2rem;
                left: 50%;
                transform: translateX(-50%) translateY(100px);
                background: var(--bg-card, #1a1a2e);
                color: var(--text-main, #fff);
                padding: 1rem 1.5rem;
                border-radius: 12px;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                font-size: 0.95rem;
                font-weight: 500;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                animation: toastSlideUp 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                border: 1px solid var(--border, rgba(255,255,255,0.1));
            }
            .cart-toast i {
                color: #22c55e;
                font-size: 1.25rem;
            }
            @keyframes toastSlideUp {
                from {
                    transform: translateX(-50%) translateY(100px);
                    opacity: 0;
                }
                to {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
            }
            @keyframes toastSlideDown {
                from {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(-50%) translateY(100px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'toastSlideDown 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartBadge = document.getElementById('cart-count');
    if (cartBadge) {
        cartBadge.textContent = totalItems;
    }
}

function loadRelatedProducts() {
    const getTeamBase = (name) => {
        return name
            .replace(/\d{2}\/\d{2}/, '')
            .replace(/(Local|Visitante|Tercera|Retro|Icon|estilo)/gi, '')
            .replace(/\(Kids\)/gi, '')
            .trim();
    };

    const currentTeam = getTeamBase(product.name);
    const sameTeam = products.filter(p =>
        p.id !== product.id && getTeamBase(p.name) === currentTeam
    );
    const sameLeague = products.filter(p =>
        p.id !== product.id &&
        p.league === product.league &&
        getTeamBase(p.name) !== currentTeam
    );
    const sameCategory = products.filter(p =>
        p.id !== product.id &&
        p.category === product.category &&
        p.league !== product.league &&
        getTeamBase(p.name) !== currentTeam
    );
    const shuffledLeague = sameLeague.sort(() => Math.random() - 0.5);
    const shuffledCategory = sameCategory.sort(() => Math.random() - 0.5);

    const combined = [...sameTeam, ...shuffledLeague, ...shuffledCategory];
    const finalRelated = combined.slice(0, 8);

    const grid = document.getElementById('related-grid');

    
    const getSecondaryImage = (p) => {
        if (p.images && p.images.length > 0) return p.images[0];
        return p.image; 
    };

    const getWebp = (url) => url ? url.replace(/\.(png|jpe?g)$/i, '.webp') : url;

    const cardsHtml = finalRelated.map((p, index) => {
        // Carga Inteligente (Smart Loading)
        // Las 2 primeras tarjetas son visibles en viewport casi de inmediato. Las priorizamos.
        const isPriority = index < 2;
        const loadAttr = isPriority ? '' : 'loading="lazy"';
        const decodeAttr = isPriority ? 'decoding="sync"' : 'decoding="async"';
        const priorityAttr = isPriority ? 'fetchpriority="high"' : '';
        
        return `
        <article class="product-card">
            <!-- Skeleton genérico durante la carga para evitar vacío (LCP fix) -->
            <div class="product-image skeleton-wrap">
                <span class="badge-sale">OFERTA</span>
                <a href="/pages/producto.html?id=${p.id}" class="related-link">
                    <picture>
                        <!-- Forzamos thumbnail de 400px para drástica mejora de network -->
                        <source srcset="${getWebp(p.image)}?w=400 400w" sizes="(max-width: 768px) 58vw, 200px" type="image/webp">
                        <img class="primary-image" src="${p.image}?w=400" alt="${p.name}" ${loadAttr} ${decodeAttr} ${priorityAttr} onload="this.closest('.product-image').classList.remove('skeleton-wrap')" onerror="this.closest('.product-image').classList.remove('skeleton-wrap')">
                    </picture>
                    <picture>
                        <!-- La imagen secundaria siempre es lazy porque requiere hover manual del usuario -->
                        <source srcset="${getWebp(getSecondaryImage(p))}?w=400 400w" sizes="(max-width: 768px) 58vw, 200px" type="image/webp">
                        <img class="secondary-image" src="${getSecondaryImage(p)}?w=400" alt="${p.name}" loading="lazy" decoding="async">
                    </picture>
                </a>
            </div>
            <div class="product-info">
                <span class="product-category">${p.category}</span>
                <h3 class="product-title">${p.name}</h3>
                <div class="product-price">
                    <span class="price">€${p.price.toFixed(2)}</span>
                    <span class="price-old">€${p.oldPrice.toFixed(2)}</span>
                </div>
            </div>
        </article>
        `;
    }).join('');

    grid.innerHTML = `
        <div class="carousel-container">
            <div class="carousel-track">
                ${cardsHtml}
            </div>
        </div>
        <div class="carousel-arrows">
            <button class="carousel-arrow carousel-arrow-left" id="related-prev">
                <i class="fas fa-chevron-left"></i>
            </button>
            <button class="carousel-arrow carousel-arrow-right" id="related-next">
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    `;
    if (isMobileCarousel()) {
        // En móvil: scroll nativo CSS (cero JS lag)
        initHoverPrefetch();
        return;
    }
    initRelatedCarousel();
    initHoverPrefetch();
}

function initHoverPrefetch() {
    // Evitar precargar más de una vez usando un Set
    let prefetchMap = new Set();

    document.querySelectorAll('.related-products .product-card').forEach(card => {
        let hoverTimer;
        const linkEl = card.querySelector('.related-link');
        if (!linkEl) return;
        const link = linkEl.href;

        // Escritorio: prefetch si el usuario hace hover por más de 60ms
        card.addEventListener('mouseenter', () => {
            if (prefetchMap.has(link)) return;
            hoverTimer = setTimeout(() => {
                prefetchMap.add(link);
                const tag = document.createElement('link');
                tag.rel = 'prefetch';
                tag.href = link;
                tag.as = 'document';
                document.head.appendChild(tag);
            }, 60); // Intencionalidad umbral (hover intent)
        }, { passive: true });

        card.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimer);
        }, { passive: true });

        // Móvil: prefetch inmediato al detectar un toque (antes del click action)
        card.addEventListener('touchstart', () => {
            if (prefetchMap.has(link)) return;
            prefetchMap.add(link);
            const tag = document.createElement('link');
            tag.rel = 'prefetch';
            tag.href = link;
            tag.as = 'document';
            document.head.appendChild(tag);
        }, { passive: true });
    });
}

function isMobileCarousel() {
    return window.matchMedia('(max-width: 768px)').matches;
}

function initRelatedCarousel() {
    const grid = document.getElementById('related-grid');
    const track = grid?.querySelector('.carousel-track');
    const prevBtn = document.getElementById('related-prev');
    const nextBtn = document.getElementById('related-next');

    if (!track || !prevBtn || !nextBtn) return;

    const originalCards = Array.from(track.querySelectorAll('.product-card'));
    if (originalCards.length === 0) return;

    // Ancho de tarjeta actualizado: 200px card + 16px gap (1rem)
    const cardWidth = 200 + 16;
    const totalCards = originalCards.length;

    
    originalCards.forEach(card => {
        const cloneEnd = card.cloneNode(true);
        cloneEnd.classList.add('carousel-clone');
        
        const img = cloneEnd.querySelector('img');
        if (img) img.loading = 'eager';
        track.appendChild(cloneEnd);
    });

    
    [...originalCards].reverse().forEach(card => {
        const cloneStart = card.cloneNode(true);
        cloneStart.classList.add('carousel-clone');
        
        const img = cloneStart.querySelector('img');
        if (img) img.loading = 'eager';
        track.insertBefore(cloneStart, track.firstChild);
    });

    let currentPosition = totalCards * cardWidth; 
    let isJumping = false;
    let animationId = null;
    let isPaused = false;

    const SCROLL_SPEED = 0.3;
    const PAUSE_DURATION = 3000;

    function setPosition(position, animate = true) {
        if (animate) {
            track.style.transition = 'transform 150ms ease-out';
        } else {
            track.style.transition = 'none';
        }
        
        track.style.transform = `translate3d(${-position}px, 0, 0)`;
    }

    function checkBoundary(e) {
        
        if (e && e.target !== track) return;

        
        if (currentPosition >= totalCards * 2 * cardWidth) {
            isJumping = true;
            track.style.transition = 'none';
            currentPosition -= totalCards * cardWidth;
            track.style.transform = `translate3d(${-currentPosition}px, 0, 0)`;
            void track.offsetHeight;
            isJumping = false;
        }
        
        if (currentPosition < totalCards * cardWidth) {
            isJumping = true;
            track.style.transition = 'none';
            currentPosition += totalCards * cardWidth;
            track.style.transform = `translate3d(${-currentPosition}px, 0, 0)`;
            void track.offsetHeight;
            isJumping = false;
        }
    }

    
    function smoothScroll() {
        if (isPaused || isJumping) {
            animationId = requestAnimationFrame(smoothScroll);
            return;
        }

        currentPosition += SCROLL_SPEED;

        
        if (currentPosition >= totalCards * 2 * cardWidth) {
            currentPosition -= totalCards * cardWidth;
        }

        
        track.style.transform = `translate3d(${-currentPosition}px, 0, 0)`;

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

    
    const carouselContainer = grid?.querySelector('.carousel-container');

    
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', pauseAutoScroll);
        carouselContainer.addEventListener('mouseleave', () => {
            if (resumeTimeout) clearTimeout(resumeTimeout);
            resumeAutoScroll();
        });
    }

    
    setPosition(currentPosition, false);
    track.offsetHeight;

    
    startAutoScroll();

    
    let isDragging = false;
    let startPos = 0;
    let lastPos = 0;
    let lastTime = 0;
    let velocity = 0;
    let inertiaId = null;

    
    track.style.touchAction = 'pan-y';
    track.style.userSelect = 'none';
    track.style.webkitUserSelect = 'none';

    
    function setTrackPosition(pos) {
        track.style.transform = `translate3d(${-pos}px, 0, 0)`;
    }

    
    function checkAndWrapBoundaries() {
        if (currentPosition >= totalCards * 2 * cardWidth) {
            currentPosition -= totalCards * cardWidth;
            setTrackPosition(currentPosition);
        } else if (currentPosition < totalCards * cardWidth) {
            currentPosition += totalCards * cardWidth;
            setTrackPosition(currentPosition);
        }
    }

    function touchStart(event) {
        
        if (inertiaId) {
            cancelAnimationFrame(inertiaId);
            inertiaId = null;
        }
        
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

        
        event.preventDefault();

        const currentX = event.touches[0].clientX;
        const diff = currentX - lastPos;
        const now = performance.now();
        const dt = now - lastTime;

        
        if (dt > 0) {
            velocity = diff / dt * 16;
        }

        currentPosition -= diff;
        lastPos = currentX;
        lastTime = now;

        
        track.style.transform = `translate3d(${-currentPosition}px, 0, 0)`;

        
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

        
        if (Math.abs(velocity) > 0.5) {
            applyInertia();
        } else {
            
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
    track.addEventListener('touchcancel', touchEnd, { passive: true });

    
    const addScrolledClass = () => {
        carouselContainer.classList.add('scrolled');
        grid.closest('.related-products')?.classList.add('scrolled');
    };

    track.addEventListener('touchstart', addScrolledClass, { once: true, passive: true });
    carouselContainer.addEventListener('scroll', addScrolledClass, { once: true }); 

    if (carouselContainer) {
        carouselContainer.addEventListener('scroll', () => {
            handleUserInteraction();
        }, { passive: true });
    }
}
updateCartCount();
const SIZE_GUIDE_IMAGES = {
    kids: '/assets/images/guia tallas niños_resultado.webp',
    nba: '/assets/images/guias tallas nba_resultado.webp',
    normal: '/assets/images/guia tallas camisetas futbol_resultado.webp'
};

function getProductType() {
    if (!product) return 'normal';
    const nameLower = product.name.toLowerCase();
    const imageLower = (product.image || '').toLowerCase();
    if (product.kids === true || nameLower.includes('kids') || nameLower.includes('niño') || nameLower.includes('niños') || imageLower.includes('kids')) return 'kids';
    if (product.category === 'nba' || product.league === 'nba') return 'nba';
    return 'normal';
}

function openSizeGuide() {
    const productType = getProductType();
    const imageSrc = SIZE_GUIDE_IMAGES[productType] || SIZE_GUIDE_IMAGES.normal;

    const modal = document.getElementById('size-guide-modal');
    const img = document.getElementById('size-guide-image');

    if (img) img.src = imageSrc;
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeSizeGuide() {
    const modal = document.getElementById('size-guide-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const sizeGuideBtn = document.getElementById('size-guide-btn');
    const sizeGuideClose = document.getElementById('size-guide-close');
    const sizeGuideOverlay = document.querySelector('.size-guide-overlay');

    if (sizeGuideBtn) sizeGuideBtn.addEventListener('click', openSizeGuide);
    if (sizeGuideClose) sizeGuideClose.addEventListener('click', closeSizeGuide);
    if (sizeGuideOverlay) sizeGuideOverlay.addEventListener('click', closeSizeGuide);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSizeGuide();
    });
});
let lightboxImages = [];
let currentLightboxIndex = 0;
let zoomLevel = 1;
let isDragging = false;
let startX = 0, startY = 0;
let translateX = 0, translateY = 0;
let lastTouchDistance = 0;

function initLightbox() {
    const lightbox = document.getElementById('image-lightbox');
    if (!lightbox) return;

    const wrapper = document.getElementById('lightbox-wrapper');
    const mainImageContainer = document.querySelector('.main-image');
    const zoomSlider = document.getElementById('zoom-slider');
    if (mainImageContainer) {
        mainImageContainer.addEventListener('click', (e) => {
            if (e.target.closest('.gallery-arrow')) return;
            openLightbox();
        });
    }
    document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
    document.getElementById('lightbox-overlay')?.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });
    document.getElementById('lightbox-prev')?.addEventListener('click', () => navigateLightbox(-1));
    document.getElementById('lightbox-next')?.addEventListener('click', () => navigateLightbox(1));
    if (zoomSlider) {
        zoomSlider.addEventListener('input', (e) => {
            zoomLevel = parseInt(e.target.value) / 100;
            updateZoomDisplay();
            clampTranslation();
            applyTransform();
        });
    }
    document.getElementById('zoom-in-btn')?.addEventListener('click', () => {
        setZoomLevel(Math.min(3, zoomLevel + 0.25));
    });

    document.getElementById('zoom-out-btn')?.addEventListener('click', () => {
        setZoomLevel(Math.max(1, zoomLevel - 0.25));
    });
    if (wrapper) {
        wrapper.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.15 : 0.15;
            setZoomLevel(Math.min(3, Math.max(1, zoomLevel + delta)));
        }, { passive: false });
        wrapper.addEventListener('dblclick', () => {
            setZoomLevel(zoomLevel > 1 ? 1 : 2);
        });
        wrapper.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            wrapper.classList.add('dragging');
        });

        wrapper.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const deltaX = (e.clientX - startX);
            const deltaY = (e.clientY - startY);

            translateX += deltaX;
            translateY += deltaY;

            startX = e.clientX;
            startY = e.clientY;

            clampTranslation();
            applyTransform();
        });

        wrapper.addEventListener('mouseleave', () => {
            isDragging = false;
            wrapper.classList.remove('dragging');
        });
    }

    document.addEventListener('mouseup', () => {
        isDragging = false;
        const w = document.getElementById('lightbox-wrapper');
        if (w) w.classList.remove('dragging');
    });
    if (wrapper) {
        wrapper.addEventListener('touchstart', handleTouchStart, { passive: false });
        wrapper.addEventListener('touchmove', handleTouchMove, { passive: false });
        wrapper.addEventListener('touchend', handleTouchEnd);
    }
}

function handleTouchStart(e) {
    if (e.touches.length === 2) {
        lastTouchDistance = getTouchDistance(e.touches);
    } else if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }
}

function handleTouchMove(e) {
    e.preventDefault();
    if (e.touches.length === 2) {
        const currentDistance = getTouchDistance(e.touches);
        const delta = (currentDistance - lastTouchDistance) * 0.01;
        lastTouchDistance = currentDistance;
        setZoomLevel(Math.min(3, Math.max(1, zoomLevel + delta)));
    } else if (e.touches.length === 1 && isDragging) {
        const deltaX = (e.touches[0].clientX - startX);
        const deltaY = (e.touches[0].clientY - startY);
        translateX += deltaX;
        translateY += deltaY;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        clampTranslation();
        applyTransform();
    }
}

function handleTouchEnd() {
    isDragging = false;
    lastTouchDistance = 0;
}

function getTouchDistance(touches) {
    return Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY
    );
}

function setZoomLevel(level) {
    zoomLevel = level;
    const slider = document.getElementById('zoom-slider');
    if (slider) slider.value = Math.round(zoomLevel * 100);
    updateZoomDisplay();

    if (zoomLevel === 1) {
        translateX = 0;
        translateY = 0;
    }

    clampTranslation();
    const wrapper = document.getElementById('lightbox-wrapper');
    if (wrapper) wrapper.classList.toggle('zoomed', zoomLevel > 1);
    applyTransform();
}

function updateZoomDisplay() {
    const display = document.getElementById('zoom-level-display');
    if (display) display.textContent = Math.round(zoomLevel * 100) + '%';
}

function clampTranslation() {
    const image = document.getElementById('lightbox-image');
    if (!image || zoomLevel <= 1) {
        translateX = 0;
        translateY = 0;
        return;
    }
    const rect = image.getBoundingClientRect();
    const maxX = (rect.width * (zoomLevel - 1)) / (2 * zoomLevel);
    const maxY = (rect.height * (zoomLevel - 1)) / (2 * zoomLevel);

    translateX = Math.max(-maxX, Math.min(maxX, translateX));
    translateY = Math.max(-maxY, Math.min(maxY, translateY));
}

function resetZoom() {
    zoomLevel = 1;
    translateX = 0;
    translateY = 0;
    const slider = document.getElementById('zoom-slider');
    if (slider) slider.value = 100;
    updateZoomDisplay();
    const wrapper = document.getElementById('lightbox-wrapper');
    if (wrapper) wrapper.classList.remove('zoomed');
    applyTransform();
}

function applyTransform() {
    const image = document.getElementById('lightbox-image');
    if (image) {
        const factor = 1 + (zoomLevel - 1) * 0.5;
        const tx = translateX / factor;
        const ty = translateY / factor;
        image.style.transform = `scale(${zoomLevel}) translate(${tx}px, ${ty}px)`;
    }
}

function openLightbox() {
    if (Analytics && product) Analytics.trackImageInteraction(product.name, 'open_lightbox');
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const thumbsContainer = document.getElementById('lightbox-thumbnails');
    if (!lightbox || !lightboxImage) return;

    const thumbs = document.querySelectorAll('.thumbnails .thumb img');
    lightboxImages = Array.from(thumbs).map(img => img.src);

    if (lightboxImages.length === 0) {
        const mainImg = document.getElementById('main-img');
        if (mainImg) lightboxImages = [mainImg.src];
    }

    const currentMainSrc = document.getElementById('main-img')?.src;
    currentLightboxIndex = lightboxImages.findIndex(src => src === currentMainSrc);
    if (currentLightboxIndex === -1) currentLightboxIndex = 0;

    if (thumbsContainer) {
        thumbsContainer.innerHTML = lightboxImages.map((src, i) => `
            <div class="lightbox-thumb ${i === currentLightboxIndex ? 'active' : ''}" data-index="${i}">
                <img src="${src}" alt="Miniatura ${i + 1}">
            </div>
        `).join('');

        thumbsContainer.querySelectorAll('.lightbox-thumb').forEach(thumb => {
            thumb.addEventListener('click', () => {
                currentLightboxIndex = parseInt(thumb.dataset.index);
                updateLightboxImage();
            });
        });
    }

    resetZoom();
    lightboxImage.src = lightboxImages[currentLightboxIndex];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('image-lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        resetZoom();
    }
}

function navigateLightbox(direction) {
    currentLightboxIndex = (currentLightboxIndex + direction + lightboxImages.length) % lightboxImages.length;
    updateLightboxImage();
    resetZoom();
}

function updateLightboxImage() {
    const lightboxImage = document.getElementById('lightbox-image');
    if (lightboxImage) {
        lightboxImage.src = lightboxImages[currentLightboxIndex];
    }
    document.querySelectorAll('.lightbox-thumb').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === currentLightboxIndex);
    });
    resetZoom();
}
function initStickyCTA() {
    const stickyBar = document.getElementById('sticky-cta');
    const mainAddBtn = document.querySelector('.btn-add-cart-lg');
    const stickyAddBtn = document.getElementById('sticky-add-btn');
    
    if (!stickyBar || !mainAddBtn) return;

    // Sincronizar datos básicos
    const sImg = document.getElementById('sticky-img');
    const sTitle = document.getElementById('sticky-title');
    const sPrice = document.getElementById('sticky-price');
    
    if (sImg) sImg.src = product.image;
    if (sTitle) sTitle.textContent = product.name;
    if (sPrice) sPrice.textContent = `€${product.price.toFixed(2)}`;

    // Observer para mostrar/ocultar
    const observer = new IntersectionObserver((entries) => {
        const [entry] = entries;
        if (!entry.isIntersecting) {
            stickyBar.classList.add('active');
        } else {
            stickyBar.classList.remove('active');
        }
    }, {
        threshold: 0,
        rootMargin: '-50px 0px 0px 0px'
    });

    observer.observe(mainAddBtn);

    // Acción del botón sticky
    stickyAddBtn.addEventListener('click', () => {
        if (Analytics) Analytics.trackStickyCTAClick(product.name);
        
        if (!selectedSize) {
            const optionsSection = document.querySelector('.options-block');
            if (optionsSection) {
                optionsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                optionsSection.classList.add('highlight-error');
                setTimeout(() => optionsSection.classList.remove('highlight-error'), 1000);
            }
        } else {
            mainAddBtn.click();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initLightbox();
    // Delay sticky init to ensure product data is rendered
    setTimeout(() => {
        initStickyCTA();
        if (Health && product) Health.verifyJsonLd(product.id);
    }, 100);
});

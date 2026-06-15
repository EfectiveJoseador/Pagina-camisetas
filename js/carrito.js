import products from './products-data.js';
import { sanitizeHTML } from './security.js';
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
applySpecialPricing();

// ---------------------------------------------------------------------------
// Helper: calcula el precio original (sin oferta) de un ítem del carrito.
// Usa product.oldPrice como base y añade los mismos extras fijos.
// Los extras (parche, dorsal) se mantienen idénticos en ambos precios.
// ---------------------------------------------------------------------------
function getItemOldPrice(item, product, sizeSurcharge, versionSurcharge, patchSurcharge, personSurcharge) {
    if (item.isAccessory) return null;     // Accesorios: sin precio tachado
    const oldBasePrice = product?.oldPrice || null;
    if (!oldBasePrice) return null;        // Si no hay oldPrice definido, no mostrar
    return oldBasePrice + sizeSurcharge + versionSurcharge + patchSurcharge + personSurcharge;
}
const Cart = {
    items: [],

    init() {
        this.load();
        this.render();
        this.updateHeaderCount();
    },

    load() {
        const stored = localStorage.getItem('cart');
        if (stored) {
            this.items = JSON.parse(stored);
        } else {
            this.items = [];
        }
    },

    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateHeaderCount();
        window.dispatchEvent(new CustomEvent('cart:updated'));
    },

    add(id, qty = 1, size = 'M', version = 'aficionado', customizations = {}) {
        const product = products.find(p => p.id === id);
        const SIZE_SURCHARGES = { '2XL': 1, '3XL': 2, '4XL': 2 };
        const sizeSurcharge = SIZE_SURCHARGES[size] || 0;
        const basePrice = product ? product.price : 0;
        const itemPrice = basePrice + sizeSurcharge + (version === 'jugador' ? 5 : 0);

        const existing = this.items.find(i => i.id === id && i.size === size && i.version === version);
        if (existing) {
            existing.qty += qty;
        } else {
            this.items.push({
                id, qty, size, version,
                basePrice,
                price: itemPrice,
                customization: { size, version, ...customizations }
            });
        }
        this.save();
        this.render();
        if (product && window.Toast) {
            window.Toast.success(`${product.name} añadido al carrito`);
        }
        if (window.CartBadge) {
            window.CartBadge.animate();
        }
        if (product && window.Analytics) {
            window.Analytics.trackAddToCart(product, qty, { size, version, ...customizations });
        }
    },

    remove(index) {
        const item = this.items[index];
        const product = item ? products.find(p => p.id === item.id) : null;

        if (item && window.Analytics && product) {
            window.Analytics.trackRemoveFromCart(product, item.qty || 1);
        }

        this.items.splice(index, 1);
        this.save();
        this.render();
        if (window.Toast) {
            window.Toast.info('Producto eliminado del carrito');
        }
    },

    updateQty(index, newQty) {
        if (newQty < 1) return;
        this.items[index].quantity = newQty;
        this.items[index].qty = newQty;
        this.save();
        this.render();
    },

    updateHeaderCount() {
        const count = this.items.reduce((acc, item) => acc + (item.quantity || item.qty || 1), 0);
        const badge = document.getElementById('cart-count');
        if (badge) badge.textContent = count;
    },

    calculateTotal() {
        let totalQty = 0;
        let totalShirtQty = 0;
        let surcharges = 0;
        let accessorySubtotal = 0;
        const SIZE_SURCHARGES = { 'S': 0, 'M': 0, 'L': 0, 'XL': 0, '2XL': 1, '3XL': 2, '4XL': 2 };
        const NORMAL_PRICE = 19.90;

        this.items.forEach(item => {
            const qty = item.quantity || item.qty || 1;
            totalQty += qty;

            if (item.isAccessory) {
                const price = item.price || 0;
                accessorySubtotal += price * qty;
            } else {
                totalShirtQty += qty;
                const custom = item.customization || {};
                const size = custom.size || item.size || '';
                const sizeSurcharge = SIZE_SURCHARGES[size] || 0;
                const version = custom.version || item.version || 'aficionado';
                const versionSurcharge = version === 'jugador' ? 5 : 0;
                const patch = custom.patch || '';
                const patchSurcharge = patch ? 2 : 0;
                const hasName = !!(custom.name || '');
                const hasNumber = !!(custom.number || '');
                const personSurcharge = (hasName || hasNumber) ? 3 : 0;
                const surcharge = sizeSurcharge + versionSurcharge + patchSurcharge + personSurcharge;
                surcharges += surcharge * qty;
            }
        });

        if (totalQty === 0) return { subtotal: 0, originalSubtotal: 0, shipping: 0, total: 0, packSaving: 0 };

        // Precio sin descuento: suma real de basePrice × qty de cada camiseta + surcharges + accesorios
        let originalSubtotal = 0;
        this.items.forEach(item => {
            const qty = item.quantity || item.qty || 1;
            if (item.isAccessory) {
                const price = item.price || 0;
                originalSubtotal += price * qty;
            } else {
                const product = products.find(p => p.id === item.id);
                const basePrice = item.basePrice || product?.price || NORMAL_PRICE;
                originalSubtotal += basePrice * qty;
            }
        });
        originalSubtotal += surcharges;

        // Calcular precio de pack para las camisetas: 5 camisetas por 85.90, 3 por 56.90, resto a 19.90
        const fullCycles = Math.floor(totalShirtQty / 5);
        const remainder = totalShirtQty % 5;
        let packBasePrice = fullCycles * 85.90;
        if (remainder === 1) {
            packBasePrice += 19.90;
        } else if (remainder === 2) {
            packBasePrice += 19.90 * 2;
        } else if (remainder === 3) {
            packBasePrice += 56.90;
        } else if (remainder === 4) {
            packBasePrice += 56.90 + 19.90;
        }

        // Sumar la diferencia de cada camiseta respecto a los 19.90€
        let priceDifference = 0;
        this.items.forEach(item => {
            if (item.isAccessory) return;
            const qty = item.quantity || item.qty || 1;
            const product = products.find(p => p.id === item.id);
            const basePrice = item.basePrice || product?.price || NORMAL_PRICE;
            priceDifference += (basePrice - NORMAL_PRICE) * qty;
        });

        const subtotal = packBasePrice + priceDifference + surcharges + accessorySubtotal;
        const packSaving = Math.max(0, Math.round((originalSubtotal - subtotal) * 100) / 100);

        let shipping = 0;
        if (totalShirtQty === 1) {
            shipping = 1.90;
        }
        const total = subtotal + shipping;

        const shippingEl = document.getElementById('shipping-price');
        if (shippingEl) {
            shippingEl.textContent = shipping === 0 ? 'Gratis' : `€${shipping.toFixed(2)}`;
        }
        this.renderPackIndicators(totalShirtQty);

        return { subtotal, originalSubtotal, packSaving, shipping, total };
    },

    renderPackIndicators(totalQty) {
        const isCheckoutPage = window.location.pathname.includes('checkout');
        if (isCheckoutPage) {
            return;
        }
        const summaryCard = document.querySelector('.cart-summary');
        if (!summaryCard) return;
        const isMobile = window.innerWidth <= 900;
        let container = document.getElementById('pack-indicator-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'pack-indicator-container';
            container.className = 'pack-indicator-container';
            if (isMobile) {
                summaryCard.parentNode.insertBefore(container, summaryCard);
            } else {
                summaryCard.appendChild(container);
            }
        }
        if (isMobile && container.parentNode === summaryCard) {
            summaryCard.parentNode.insertBefore(container, summaryCard);
        } else if (!isMobile && container.parentNode !== summaryCard) {
            summaryCard.appendChild(container);
        }

        container.innerHTML = '';
        const isMult3 = totalQty % 3 === 0 && totalQty > 0;
        const isMult5 = totalQty % 5 === 0 && totalQty > 0;
        let packType = null;
        let multiplier = 0;

        if (isMult5) {
            packType = 'mega';
            multiplier = totalQty / 5;
        } else if (isMult3) {
            packType = 'popular';
            multiplier = totalQty / 3;
        }
        if (!packType) {
            container.classList.remove('visible');
            return;
        }
        const badge = document.createElement('div');
        const glowLevel = Math.min(multiplier, 4);

        if (packType === 'popular') {
            badge.className = `pack-badge pack-popular glow-x${glowLevel}`;
            badge.innerHTML = multiplier === 1 ? 'PACK POPULAR' : `PACK POPULAR ×${multiplier}`;
        } else {
            badge.className = `pack-badge pack-mega glow-x${glowLevel}`;
            badge.innerHTML = multiplier === 1 ? 'MEGAPACK' : `MEGAPACK ×${multiplier}`;
        }

        container.appendChild(badge);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                container.classList.add('visible');
            });
        });
    },

    render() {
        const cartList = document.getElementById('cart-items-list');
        if (cartList) {
            this.renderCartPage(cartList);
        }
        const checkoutList = document.getElementById('checkout-items');
        if (checkoutList) {
            this.renderCheckoutPage(checkoutList);
        }
    },

    renderCartPage(container) {
        container.innerHTML = '';
        const emptyMsg = document.querySelector('.empty-cart-msg');
        const checkoutBtn = document.getElementById('checkout-btn');

        if (this.items.length === 0) {
            if (emptyMsg) emptyMsg.classList.remove('hidden');
            if (checkoutBtn) checkoutBtn.classList.add('hidden');
            document.getElementById('subtotal-price').textContent = '€0.00';
            document.getElementById('total-price').textContent = '€0.00';
            document.getElementById('shipping-price').textContent = 'Gratis';
            this.renderPackIndicators(0);
            return;
        }

        if (emptyMsg) emptyMsg.classList.add('hidden');
        if (checkoutBtn) checkoutBtn.classList.remove('hidden');

        const SIZE_SURCHARGES = { 'S': 0, 'M': 0, 'L': 0, 'XL': 0, '2XL': 1, '3XL': 2, '4XL': 2 };

        this.items.forEach((item, index) => {
            const product = products.find(p => p.id === item.id);
            if (!product && !item.isAccessory) return;

            const qty = item.quantity || item.qty || 1;
            let displayName = '';
            let displayPrice = 0;
            let displayOldPrice = null;
            let displayDetails = '';
            let imgUrl = '';

            if (item.isAccessory) {
                displayName = item.name;
                displayPrice = item.price;
                displayOldPrice = null;
                displayDetails = 'Accesorio adicional';
                imgUrl = '/assets/logo/logo.png';
            } else {
                displayName = product.name;
                const custom = item.customization || {};
                const size = custom.size || item.size || '';
                const sizeSurcharge = SIZE_SURCHARGES[size] || 0;
                const version = custom.version || item.version || 'aficionado';
                const versionSurcharge = version === 'jugador' ? 5 : 0;
                const patch = custom.patch || '';
                const patchSurcharge = patch ? 2 : 0;
                const hasName = !!(custom.name || '');
                const hasNumber = !!(custom.number || '');
                const personSurcharge = (hasName || hasNumber) ? 3 : 0;
                const baseProductPrice = item.basePrice || product.price;
                displayPrice = baseProductPrice + sizeSurcharge + versionSurcharge + patchSurcharge + personSurcharge;
                displayOldPrice = getItemOldPrice(item, product, sizeSurcharge, versionSurcharge, patchSurcharge, personSurcharge);
                
                displayDetails = `Talla: ${size} / ${version === 'jugador' ? 'Jugador' : 'Aficionado'}`;
                if (custom.name) displayDetails += ` | Nombre: ${sanitizeHTML(custom.name)}`;
                if (custom.number) displayDetails += ` | Dorsal: ${sanitizeHTML(custom.number)}`;
                if (patch && patch !== 'none') displayDetails += ` | Parche: ${sanitizeHTML(patch)}`;
                imgUrl = product.image;
            }

            const el = document.createElement('div');
            el.className = 'cart-item';
            el.innerHTML = `
                <div class="cart-item-top">
                    ${item.isAccessory ? `
                        <div class="cart-item-img-wrapper">
                            <img src="${imgUrl}" alt="${sanitizeHTML(displayName)}" class="cart-item-img">
                        </div>
                    ` : `
                        <a href="/pages/producto.html?id=${product.id}" class="cart-item-img-link">
                            <div class="cart-item-img-wrapper">
                                <img src="${imgUrl}" alt="${sanitizeHTML(displayName)}" class="cart-item-img">
                            </div>
                        </a>
                    `}
                    <div class="cart-item-header">
                        ${item.isAccessory ? `
                            <h3 class="cart-item-title">${sanitizeHTML(displayName)}</h3>
                        ` : `
                            <a href="/pages/producto.html?id=${product.id}" class="cart-item-title-link">
                                <h3 class="cart-item-title">${sanitizeHTML(displayName)}</h3>
                            </a>
                        `}
                        <p class="cart-item-meta">${displayDetails}</p>
                    </div>
                </div>
                <div class="cart-item-footer">
                    <div class="cart-item-controls">
                        <div class="quantity-selector touch-optimized">
                            <button class="qty-btn-minus touch-target" data-index="${index}" aria-label="Disminuir"><i class="fas fa-minus"></i></button>
                            <input type="number" value="${qty}" class="qty-input" readonly>
                            <button class="qty-btn-plus touch-target" data-index="${index}" aria-label="Aumentar"><i class="fas fa-plus"></i></button>
                        </div>
                        <button class="btn-remove touch-target" data-index="${index}" aria-label="Eliminar"><i class="fas fa-trash-alt"></i></button>
                        <button class="btn-cart-edit" data-index="${index}" title="Editar producto" aria-label="Editar ${sanitizeHTML(displayName)}"><i class="fas fa-pen"></i></button>
                    </div>
                    <div class="cart-item-price-wrapper">
                        ${displayOldPrice && (displayOldPrice * qty) > (displayPrice * qty) ? `
                            <span class="cart-item-price-old">€${(displayOldPrice * qty).toFixed(2)}</span>
                        ` : ''}
                        <span class="cart-item-price-current">€${(displayPrice * qty).toFixed(2)}</span>
                    </div>
                </div>
            `;
            container.appendChild(el);
        });
        container.querySelectorAll('.qty-btn-minus').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = btn.dataset.index;
                const currentQty = this.items[index].quantity || this.items[index].qty || 1;
                this.updateQty(index, currentQty - 1);
            });
        });
        container.querySelectorAll('.qty-btn-plus').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = btn.dataset.index;
                const currentQty = this.items[index].quantity || this.items[index].qty || 1;
                this.updateQty(index, currentQty + 1);
            });
        });
        container.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', () => this.remove(btn.dataset.index));
        });
        container.querySelectorAll('.btn-cart-edit').forEach(btn => {
            btn.addEventListener('click', () => openCartItemEditModal(parseInt(btn.dataset.index), this));
        });
        const calculations = this.calculateTotal();
        const subtotalEl = document.getElementById('subtotal-price');
        if (subtotalEl) {
            if (calculations.packSaving > 0) {
                subtotalEl.innerHTML = `
                    <span style="text-decoration: line-through; color: var(--text-muted); font-size: 0.88em; margin-right: 0.4em;">€${calculations.originalSubtotal.toFixed(2)}</span>
                    <span style="color: var(--accent, #6366f1); font-weight: 700;">€${calculations.subtotal.toFixed(2)}</span>
                `;
            } else {
                subtotalEl.textContent = `€${calculations.subtotal.toFixed(2)}`;
            }
        }
        document.getElementById('total-price').textContent = `€${calculations.total.toFixed(2)}`;
    },

    renderCheckoutPage(container) {
        container.innerHTML = '';
        const SIZE_SURCHARGES = { 'S': 0, 'M': 0, 'L': 0, 'XL': 0, '2XL': 1, '3XL': 2, '4XL': 2 };
        this.items.forEach((item, index) => {
            const product = products.find(p => p.id === item.id);
            if (!product && !item.isAccessory) return;

            const qty = item.quantity || item.qty || 1;
            let displayName = '';
            let displayPrice = 0;
            let displayDetails = '';
            let imgUrl = '';

            if (item.isAccessory) {
                displayName = item.name;
                displayPrice = item.price;
                displayDetails = 'Accesorio adicional';
                imgUrl = '/assets/logo/logo.png';
            } else {
                displayName = product.name;
                const custom = item.customization || {};
                const size = custom.size || item.size || 'N/A';
                const version = custom.version || item.version || 'aficionado';
                const sizeSurcharge = SIZE_SURCHARGES[size] || 0;
                const versionSurcharge = version === 'jugador' ? 5 : 0;
                const patch = custom.patch || '';
                const patchSurcharge = patch ? 2 : 0;
                const hasName = !!(custom.name || '');
                const hasNumber = !!(custom.number || '');
                const personSurcharge = (hasName || hasNumber) ? 3 : 0;
                const baseProductPrice = item.basePrice || product.price;
                displayPrice = baseProductPrice + sizeSurcharge + versionSurcharge + patchSurcharge + personSurcharge;
                
                displayDetails = `Talla: ${size} / ${version === 'jugador' ? 'Jugador' : 'Aficionado'}`;
                if (custom.name) displayDetails += ` | Nombre: ${sanitizeHTML(custom.name)}`;
                if (custom.number) displayDetails += ` | Dorsal: ${sanitizeHTML(custom.number)}`;
                if (patch && patch !== 'none') displayDetails += ` | Parche: ${sanitizeHTML(patch)}`;
                imgUrl = product.image;
            }

            const el = document.createElement('div');
            el.className = 'checkout-item-mini';
            const isLast = index === this.items.length - 1;
            el.style.cssText = `display:flex; justify-content:space-between; align-items:center; gap:0.5rem; ${isLast ? 'margin-bottom:0.5rem;' : 'margin-bottom:1rem; padding-bottom:1rem; border-bottom:1px solid var(--border);'}`;
            el.innerHTML = `
                <div style="display:flex; align-items:center; gap:0.75rem; flex:1; min-width:0;">
                    <img src="${imgUrl}" alt="${sanitizeHTML(displayName)}" style="width:44px; height:44px; object-fit:contain; border:1px solid var(--border); border-radius:8px; padding:2px; background:#fff; flex-shrink:0;">
                    <div style="min-width:0; flex:1;">
                        <h4 style="font-size:0.85rem; font-weight:600; margin:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; text-align:left;">${sanitizeHTML(displayName)}</h4>
                        <p style="font-size:0.75rem; color:var(--text-muted); margin:2px 0 0 0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; text-align:left;">${displayDetails}</p>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:0.5rem; flex-shrink:0;">
                    <!-- Editable Controls in Checkout (Mejora 3) -->
                    <div class="quantity-selector touch-optimized" style="display:flex; align-items:center; border:1px solid var(--border); border-radius:6px; overflow:hidden; background:var(--bg-body); height:28px;">
                        <button class="qty-btn-minus-checkout touch-target" data-index="${index}" style="border:none; background:transparent; width:24px; height:24px; cursor:pointer; color:var(--text-main); display:flex; align-items:center; justify-content:center;"><i class="fas fa-minus" style="font-size:0.7rem;"></i></button>
                        <input type="number" value="${qty}" style="width:18px; border:none; text-align:center; background:transparent; font-size:0.8rem; font-weight:600; color:var(--text-main); pointer-events:none; padding:0;" readonly>
                        <button class="qty-btn-plus-checkout touch-target" data-index="${index}" style="border:none; background:transparent; width:24px; height:24px; cursor:pointer; color:var(--text-main); display:flex; align-items:center; justify-content:center;"><i class="fas fa-plus" style="font-size:0.7rem;"></i></button>
                    </div>
                    <button class="btn-remove-checkout" data-index="${index}" style="border:none; background:transparent; color:var(--text-muted); cursor:pointer; font-size:0.9rem; width:28px; height:28px; display:flex; align-items:center; justify-content:center; border-radius:6px; transition:all 0.2s;"><i class="fas fa-trash-alt"></i></button>
                    <span style="font-size:0.85rem; font-weight:700; min-width:55px; text-align:right;">€${(displayPrice * qty).toFixed(2)}</span>
                </div>
            `;
            container.appendChild(el);
        });

        // Event listeners for checkout controls
        container.querySelectorAll('.qty-btn-minus-checkout').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                const currentQty = this.items[index].quantity || this.items[index].qty || 1;
                this.updateQty(index, currentQty - 1);
            });
        });
        container.querySelectorAll('.qty-btn-plus-checkout').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                const currentQty = this.items[index].quantity || this.items[index].qty || 1;
                this.updateQty(index, currentQty + 1);
            });
        });
        container.querySelectorAll('.btn-remove-checkout').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                this.remove(index);
            });
        });

        const calculations = this.calculateTotal();
        const subtotalEl = document.getElementById('checkout-subtotal');
        const totalEl = document.getElementById('checkout-total');
        if (subtotalEl) {
            if (calculations.packSaving > 0) {
                subtotalEl.innerHTML = `
                    <span style="text-decoration: line-through; color: var(--text-muted); font-size: 0.88em; margin-right: 0.4em;">€${calculations.originalSubtotal.toFixed(2)}</span>
                    <span style="color: var(--accent, #6366f1); font-weight: 700;">€${calculations.subtotal.toFixed(2)}</span>
                `;
            } else {
                subtotalEl.textContent = `€${calculations.subtotal.toFixed(2)}`;
            }
        }
        if (totalEl) totalEl.textContent = `€${calculations.total.toFixed(2)}`;
    }
};

// ---------------------------------------------------------------------------
// Edit item modal — opens when clicking the pencil button on a cart item
// Mirrors the validation and pricing logic from producto.js exactly.
// ---------------------------------------------------------------------------
function getCartItemTypeName(item) {
    const n   = (item.name  || '').toLowerCase();
    const img = (item.image || '').toLowerCase();
    if (n.includes('kids') || n.includes('niño') || n.includes('niños') || img.includes('kids')) return 'kids';
    if (n.includes('retro')) return 'retro';
    if (n.includes('nba')   || img.includes('nba')) return 'nba';
    return 'normal';
}

const CART_SIZE_CONFIGS = {
    kids:   ['16', '18', '20', '22', '24', '26', '28'],
    retro:  ['S', 'M', 'L', 'XL', '2XL'],
    normal: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    nba:    ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']
};

const CART_SIZE_SURCHARGES = { '2XL': 1, '3XL': 2, '4XL': 2 };

function calcEditPrice(basePrice, custom) {
    let total = basePrice;
    total += CART_SIZE_SURCHARGES[custom.size] || 0;
    if (custom.version === 'jugador') total += 5;
    if (custom.patch) total += 2;
    // Nombre O dorsal = +€3 (no hace falta tener los dos)
    if (custom.name || custom.number) total += 3;
    return total;
}

function openCartItemEditModal(cartIndex, cartRef) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = cart[cartIndex];
    if (!item || item.isAccessory) return;

    const type      = getCartItemTypeName(item);
    const sizes     = CART_SIZE_CONFIGS[type] || CART_SIZE_CONFIGS.normal;
    const basePrice = item.basePrice || 19.90;
    const custom    = { ...(item.customization || {}) };

    // Same restrictions as isRestrictedCategory() in producto.js
    const isNBA        = type === 'nba';
    const isKids       = type === 'kids';
    const isRetro      = type === 'retro';
    const isRestricted = isNBA || isKids || isRetro;
    const showVersion  = !isRestricted;   // version hidden for kids / retro / NBA
    const showPatch    = !isNBA;           // patch hidden only for NBA

    const currentVersion = custom.version || 'aficionado';

    // Size options — 3XL/4XL will be hidden dynamically when Jugador
    const sizeOptions = sizes.map(sz => {
        const sel   = custom.size === sz ? 'selected' : '';
        const extra = CART_SIZE_SURCHARGES[sz] ? ` (+€${CART_SIZE_SURCHARGES[sz]})` : '';
        return `<option value="${sz}" ${sel}>${sz}${extra}</option>`;
    }).join('');

    const versionBlock = showVersion ? `
        <div class="upsell-edit-field" id="ce-version-group">
            <label>Versión <span style="color:#6b7280;text-transform:none;font-weight:400;">(+€5 Jugador)</span></label>
            <select id="ce-version">
                <option value="aficionado" ${currentVersion === 'aficionado' ? 'selected' : ''}>Aficionado</option>
                <option value="jugador"    ${currentVersion === 'jugador'    ? 'selected' : ''}>Jugador (+€5)</option>
            </select>
        </div>` : '';

    const patchBlock = showPatch ? `
        <div class="upsell-edit-field" id="ce-patch-group">
            <label>Parche <span style="color:#6b7280;text-transform:none;font-weight:400;">(+€2.00 si rellenas)</span></label>
            <input type="text" id="ce-patch" placeholder="Ej. Champions League" maxlength="30" autocomplete="off" value="${custom.patch || ''}">
        </div>` : '';

    const overlay = document.createElement('div');
    overlay.id = 'cart-edit-overlay';
    overlay.className = 'upsell-edit-overlay';
    overlay.innerHTML = `
        <div class="upsell-edit-panel" role="dialog" aria-modal="true" aria-labelledby="ce-title">
            <div class="upsell-edit-header">
                <h3 id="ce-title">Editar producto</h3>
                <button class="upsell-edit-close" aria-label="Cerrar">&times;</button>
            </div>

            <div class="upsell-edit-product-preview">
                <img src="${item.image}" alt="${item.name}">
                <span class="upsell-edit-product-preview-name">${item.name}</span>
            </div>

            <div class="upsell-edit-field">
                <label>Talla</label>
                <select id="ce-size">${sizeOptions}</select>
            </div>

            ${versionBlock}

            <div class="upsell-edit-field">
                <label>Nombre <span style="color:#6b7280;text-transform:none;font-weight:400;">(solo letras · máx 15 · +€3 con nombre o dorsal)</span></label>
                <input type="text" id="ce-name" placeholder="Ej. PEDRI" maxlength="15" autocomplete="off" value="${custom.name || ''}">
            </div>

            <div class="upsell-edit-field">
                <label>Dorsal <span style="color:#6b7280;text-transform:none;font-weight:400;">(0–99)</span></label>
                <input type="text" id="ce-number" placeholder="Ej. 10" maxlength="2" inputmode="numeric" autocomplete="off" value="${custom.number || ''}">
            </div>

            ${patchBlock}

            <div class="upsell-edit-price-summary">
                <span>Total por unidad</span>
                <span class="upsell-edit-price-total" id="ce-total">€${calcEditPrice(basePrice, custom).toFixed(2)}</span>
            </div>

            <div class="upsell-edit-actions">
                <button class="btn-upsell-edit-cancel">Cancelar</button>
                <button class="btn-upsell-edit-save" id="ce-save-btn">Guardar cambios</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('active')));

    // ── Field accessors ──────────────────────────────────────────────────────
    const getSize    = () => overlay.querySelector('#ce-size')?.value    || '';
    const getVersion = () => overlay.querySelector('#ce-version')?.value || 'aficionado';
    const getName    = () => overlay.querySelector('#ce-name')?.value    || '';
    const getNumber  = () => overlay.querySelector('#ce-number')?.value  || '';
    const getPatch   = () => overlay.querySelector('#ce-patch')?.value   || '';

    // ── Live price — mirrors updatePreview() in producto.js ─────────────────
    function updatePrice() {
        const el = overlay.querySelector('#ce-total');
        if (!el) return;
        const c = { size: getSize(), version: getVersion(), name: getName().trim(), number: getNumber().trim(), patch: getPatch() };
        el.textContent = `€${calcEditPrice(basePrice, c).toFixed(2)}`;
    }

    // ── Version → disable 3XL/4XL (mirrors applyPlayerVersionSizeRestriction) ──
    function applyVersionSizeRestriction() {
        if (!showVersion) return;
        const sizeSelect = overlay.querySelector('#ce-size');
        if (!sizeSelect) return;
        const isJugador = getVersion() === 'jugador';
        ['3XL', '4XL'].forEach(sz => {
            const opt = sizeSelect.querySelector(`option[value="${sz}"]`);
            if (!opt) return;
            opt.disabled = isJugador;
            opt.hidden   = isJugador;
        });
        if (isJugador && ['3XL', '4XL'].includes(sizeSelect.value)) {
            sizeSelect.value = 'XL';
            if (window.Toast) window.Toast.error('La talla 3XL/4XL no está disponible en Versión Jugador');
        }
        updatePrice();
    }

    // ── Name input: letters/spaces only, max 15 (mirrors handleNameInput) ───
    overlay.querySelector('#ce-name')?.addEventListener('input', e => {
        let v = e.target.value.replace(/[^A-Za-zÀ-ÿ\s\.]/g, '');
        if (v.length > 15) v = v.slice(0, 15);
        e.target.value = v;
        // Hide hint while typing
        const h = overlay.querySelector('#ce-name-hint');
        if (h) h.style.display = 'none';
        updatePrice();
    });

    // ── Number input: digits only, 0-99, max 2 (mirrors handleDorsalInput) ──
    overlay.querySelector('#ce-number')?.addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 2) v = v.slice(0, 2);
        if (v !== '' && parseInt(v) > 99) v = '99';
        e.target.value = v;
        updatePrice();
    });

    // ── Version change ───────────────────────────────────────────────────────
    overlay.querySelector('#ce-version')?.addEventListener('change', applyVersionSizeRestriction);

    // ── Size / patch change ──────────────────────────────────────────────────
    overlay.querySelector('#ce-size')?.addEventListener('change', updatePrice);
    overlay.querySelector('#ce-patch')?.addEventListener('input',  updatePrice);

    // Apply initial restriction (in case item was saved as jugador with 3XL/4XL)
    applyVersionSizeRestriction();

    // ── Close ────────────────────────────────────────────────────────────────
    function closeOverlay() {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 220);
    }
    overlay.querySelector('.upsell-edit-close').addEventListener('click', closeOverlay);
    overlay.querySelector('.btn-upsell-edit-cancel').addEventListener('click', closeOverlay);
    let _mdOnOverlay = false;
    overlay.addEventListener('mousedown', e => { _mdOnOverlay = e.target === overlay; });
    overlay.addEventListener('click', e => { if (e.target === overlay && _mdOnOverlay) closeOverlay(); });
    const escHandler = e => {
        if (e.key === 'Escape') { closeOverlay(); document.removeEventListener('keydown', escHandler); }
    };
    document.addEventListener('keydown', escHandler);

    overlay.querySelector('#ce-save-btn').addEventListener('click', () => {
        const nameVal    = getName().trim();
        const numberVal  = getNumber().trim();
        const sizeVal    = getSize();
        const patchVal   = getPatch();
        const versionVal = getVersion();

        const hasName   = nameVal.length > 0;
        const hasNumber = numberVal.length > 0;

        // Validation: name — letters, spaces and dots only
        if (hasName && !/^[A-Za-z\u00C0-\u00FF\s\.]+$/.test(nameVal)) {
            if (window.Toast) window.Toast.error('El nombre solo puede contener letras, espacios y puntos');
            else alert('El nombre solo puede contener letras, espacios y puntos');
            return;
        }

        // Validation: dorsal — numeric 0-99, max 2 digits
        if (hasNumber) {
            const numValue = parseInt(numberVal);
            if (numberVal.length > 2 || numValue < 0 || numValue > 99 || isNaN(numValue)) {
                if (window.Toast) window.Toast.error('El dorsal debe ser un número entre 0 y 99 (máximo 2 dígitos)');
                else alert('El dorsal debe ser un número entre 0 y 99 (máximo 2 dígitos)');
                return;
            }
        }

        const newCustom = {
            ...custom,
            size:          sizeVal,
            sizeSurcharge: CART_SIZE_SURCHARGES[sizeVal] || 0,
            version:       versionVal,
            name:          hasName   ? nameVal.toUpperCase() : '',
            number:        hasNumber ? numberVal             : '',
            patch:         patchVal,
        };
        const newPrice = calcEditPrice(basePrice, newCustom);

        const updatedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (updatedCart[cartIndex]) {
            updatedCart[cartIndex].customization = newCustom;
            updatedCart[cartIndex].price         = newPrice;
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        }

        if (cartRef) {
            cartRef.load();
            cartRef.render();
            cartRef.updateHeaderCount();
        }

        closeOverlay();

        if (window.Toast?.success) window.Toast.success('Producto actualizado');
    });

}

function showShareModal(shareUrl) {
    let overlay = document.getElementById('share-modal-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'share-modal-overlay';
        overlay.className = 'share-modal-overlay';
        document.body.appendChild(overlay);
    }
    
    
    overlay.innerHTML = `
        <div class="share-modal-content">
            <button class="share-modal-close">&times;</button>
            <h3 style="margin-top:0.5rem; font-family:var(--font-heading); font-weight:800; font-size:1.25rem; display:flex; align-items:center; justify-content:center; gap:0.5rem;"><i class="fas fa-share-alt" style="color:var(--accent);"></i>Compartir Carrito</h3>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.5rem;">Cualquiera con este enlace podrá abrir y fusionar tu carrito en otro dispositivo.</p>
            
            <div class="share-input-group">
                <input type="text" class="share-link-input" value="${shareUrl}" readonly>
                <button class="btn-share-copy">Copiar</button>
            </div>
        </div>
    `;
    
    overlay.classList.add('active');
    
    const closeBtn = overlay.querySelector('.share-modal-close');
    if (closeBtn) {
        closeBtn.onclick = () => {
            overlay.classList.remove('active');
        };
    }
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
        }
    };
    
    const copyBtn = overlay.querySelector('.btn-share-copy');
    const input = overlay.querySelector('.share-link-input');
    if (copyBtn && input) {
        copyBtn.onclick = () => {
            input.select();
            input.setSelectionRange(0, 99999);
            navigator.clipboard.writeText(input.value).then(() => {
                copyBtn.textContent = '¡Copiado!';
                copyBtn.style.background = '#10b981';
                setTimeout(() => {
                    copyBtn.textContent = 'Copiar';
                    copyBtn.style.background = '';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy link:', err);
            });
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    Cart.init();
    window.addEventListener('components:ready', () => {
        Cart.updateHeaderCount();
    });

    // Mejora 5: Compartir / Guardar Carrito
    const shareBtn = document.getElementById('share-cart-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            if (Cart.items.length === 0) {
                if (window.Toast) {
                    window.Toast.error('El carrito está vacío');
                } else {
                    alert('El carrito está vacío');
                }
                return;
            }

            const simplifiedCart = Cart.items.map(item => ({
                id: item.id,
                qty: item.quantity || item.qty || 1,
                size: item.customization?.size || item.size || 'M',
                version: item.customization?.version || item.version || 'aficionado',
                customization: item.customization || {}
            }));
            const cartJson = JSON.stringify(simplifiedCart);
            const base64Cart = btoa(unescape(encodeURIComponent(cartJson)));
            
            const randomId = Math.floor(1000 + Math.random() * 9000);
            localStorage.setItem('savedCart_' + randomId, cartJson);

            const shareUrl = window.location.href.split('pages/carrito.html')[0] + 'index.html?cart=' + base64Cart;
            
            showShareModal(shareUrl);
        });
    }
});

export default Cart;


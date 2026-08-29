import productsData from './products-data.js';
import { sanitizeHTML } from './security.js';
import { db, ref, onValue } from './firebase-config.js';

let products = [...productsData];

// Sincronización en tiempo real con Firebase
onValue(ref(db, 'products'), (snapshot) => {
    if (snapshot.exists()) {
        const liveData = snapshot.val();
        let hasChanges = false;

        let newAllProducts = productsData.map(p => {
            if (liveData[p.id]) {
                const live = liveData[p.id];
                if (p.price !== live.price || p.name !== live.name || p.image !== live.image || p.hidden !== live.hidden) {
                    hasChanges = true;
                }
                return { ...p, ...live };
            }
            return p;
        });
        
        Object.values(liveData).forEach(liveProduct => {
            if (!newAllProducts.find(p => p.id === liveProduct.id)) {
                hasChanges = true;
                newAllProducts.push(liveProduct);
            }
        });
        
        products = newAllProducts;
        applySpecialPricing();
        
        // Re-renderizar carrito solo si hay cambios reales en los productos del catálogo
        if (hasChanges && typeof Cart !== 'undefined' && Cart.items && Cart.items.length > 0) {
            Cart.render();
        }
    }
});
function applySpecialPricing() {
    products.forEach(product => {
        if (product.fixedPrice === true) return;
        const nameLower = (product.name || '').toLowerCase();
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
applySpecialPricing();

function getMiniImagePath(imagePath) {
    if (!imagePath) return '';
    return imagePath.replace(/\/(\d+)\.(webp|jpg|png|jpeg)$/i, '/$1_mini.$2');
}

function getItemOldPrice(item, product, sizeSurcharge = 0, versionSurcharge = 0, patchSurcharge = 0, personSurcharge = 0) {
    if (item.isAccessory) return null;     // Accesorios: sin precio tachado
    let oldBasePrice = product?.oldPrice || item.oldPrice;
    if (!oldBasePrice) {
        const nameLower = (item.name || product?.name || '').toLowerCase();
        const imageLower = (item.image || product?.image || '').toLowerCase();
        const isKids = item.kids === true || product?.kids === true || nameLower.includes('kids') || nameLower.includes('niño') || nameLower.includes('niños') || imageLower.includes('kids');
        const isRetro = item.retro === true || product?.retro === true || nameLower.includes('retro') || product?.league === 'retro';

        if (isRetro) {
            oldBasePrice = 35.00;
        } else if (isKids) {
            oldBasePrice = 33.00;
        } else {
            oldBasePrice = 30.00;
        }
    }
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
        const SIZE_SURCHARGES = { '2XL': 2, '3XL': 4, '4XL': 4 };
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
        const SIZE_SURCHARGES = { 'S': 0, 'M': 0, 'L': 0, 'XL': 0, '2XL': 2, '3XL': 4, '4XL': 4 };
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
                const product = products.find(p => p.id === item.id);
                const patch = custom.patch || '';
                let patchSurcharge = 0;
                if (custom.patchExtraPrice !== undefined) {
                    patchSurcharge = custom.patchExtraPrice;
                } else if (patch && patch !== 'none') {
                    if (product && product.customPatches === 'espana26') {
                        const count = patch.split(',').map(s => s.trim()).filter(Boolean).length;
                        patchSurcharge = count * 1.25;
                    } else {
                        patchSurcharge = 3;
                    }
                }
                const hasName = !!(custom.name || '');
                const hasNumber = !!(custom.number || '');
                const personSurcharge = (hasName || hasNumber) ? 4 : 0;
                const surcharge = sizeSurcharge + versionSurcharge + patchSurcharge + personSurcharge;
                surcharges += surcharge * qty;
            }
        });

        if (totalQty === 0) {
            const protectionFeeEl = document.getElementById('checkout-protection-fee');
            if (protectionFeeEl) {
                protectionFeeEl.parentElement.style.display = 'none';
            }
            return { subtotal: 0, originalSubtotal: 0, shipping: 0, protectionFee: 0, total: 0, packSaving: 0 };
        } else {
            const protectionFeeEl = document.getElementById('checkout-protection-fee');
            if (protectionFeeEl) {
                protectionFeeEl.parentElement.style.display = 'flex';
            }
        }

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
        
        const protectionFee = 3.00;
        const total = subtotal + shipping + protectionFee;

        const shippingEl = document.getElementById('shipping-price');
        if (shippingEl) {
            shippingEl.textContent = shipping === 0 ? 'Gratis' : `€${shipping.toFixed(2)}`;
        }
        
        const protectionFeeEl = document.getElementById('checkout-protection-fee');
        if (protectionFeeEl) {
            protectionFeeEl.textContent = `+€${protectionFee.toFixed(2)}`;
        }
        
        this.renderPackIndicators(totalShirtQty);

        return { subtotal, originalSubtotal, packSaving, shipping, protectionFee, total };
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

        const SIZE_SURCHARGES = { 'S': 0, 'M': 0, 'L': 0, 'XL': 0, '2XL': 2, '3XL': 4, '4XL': 4 };

        this.items.forEach((item, index) => {
            const product = products.find(p => p.id === item.id);
            if (!product && !item.isAccessory && !item.name) return;

            const qty = item.quantity || item.qty || 1;
            let displayName = '';
            let displayPrice = 0;
            let displayOldPrice = null;
            let displayDetails = '';
            let rawImgUrl = '';

            if (item.isAccessory) {
                displayName = item.name || 'Accesorio';
                displayPrice = item.price || 0;
                displayOldPrice = null;
                displayDetails = 'Accesorio adicional';
                rawImgUrl = item.image || '/assets/logo/logo.png';
            } else {
                displayName = item.name || product?.name || 'Camiseta';
                const custom = item.customization || {};
                const size = custom.size || item.size || '';
                const sizeSurcharge = SIZE_SURCHARGES[size] || 0;
                const version = custom.version || item.version || 'aficionado';
                const versionSurcharge = version === 'jugador' ? 5 : 0;
                const patch = custom.patch || '';
                let patchSurcharge = custom.patchExtraPrice !== undefined ? custom.patchExtraPrice : 0;
                if (custom.patchExtraPrice === undefined && patch && patch !== 'none') {
                    if (product && product.customPatches === 'espana26') {
                        const count = patch.split(',').map(s => s.trim()).filter(Boolean).length;
                        patchSurcharge = count * 1.25;
                    } else {
                        patchSurcharge = 3;
                    }
                }
                const hasName = !!(custom.name || '');
                const hasNumber = !!(custom.number || '');
                const personSurcharge = (hasName || hasNumber) ? 4 : 0;
                const baseProductPrice = item.basePrice || product?.price || 22.90;
                displayPrice = baseProductPrice + sizeSurcharge + versionSurcharge + patchSurcharge + personSurcharge;
                displayOldPrice = getItemOldPrice(item, product, sizeSurcharge, versionSurcharge, patchSurcharge, personSurcharge);
                
                displayDetails = `Talla: ${size} / ${version === 'jugador' ? 'Jugador' : 'Aficionado'}`;
                if (custom.name) displayDetails += ` | Nombre: ${sanitizeHTML(custom.name)}`;
                if (custom.number) displayDetails += ` | Dorsal: ${sanitizeHTML(custom.number)}`;
                if (patch && patch !== 'none') displayDetails += ` | Parche: ${sanitizeHTML(patch)}`;
                rawImgUrl = item.image || product?.image || '';
            }

            const miniImgUrl = getMiniImagePath(rawImgUrl) || rawImgUrl;

            const el = document.createElement('div');
            el.className = 'cart-item';
            el.innerHTML = `
                <div class="cart-item-top">
                    ${item.isAccessory ? `
                        <div class="cart-item-img-wrapper">
                            <img src="${miniImgUrl}" alt="${sanitizeHTML(displayName)}" class="cart-item-img" loading="eager" decoding="async" onerror="this.onerror=null;this.src='${rawImgUrl}';">
                        </div>
                    ` : `
                        <a href="/pages/producto.html?id=${item.id || product?.id}" class="cart-item-img-link">
                            <div class="cart-item-img-wrapper">
                                <img src="${miniImgUrl}" alt="${sanitizeHTML(displayName)}" class="cart-item-img" loading="eager" decoding="async" onerror="this.onerror=null;this.src='${rawImgUrl}';">
                            </div>
                        </a>
                    `}
                    <div class="cart-item-header">
                        ${item.isAccessory ? `
                            <h3 class="cart-item-title">${sanitizeHTML(displayName)}</h3>
                        ` : `
                            <a href="/pages/producto.html?id=${item.id || product?.id}" class="cart-item-title-link">
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
                        <span class="cart-item-price-current ${item.isAccessory ? 'is-accessory' : 'is-sale'}">€${(displayPrice * qty).toFixed(2)}</span>
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
        const SIZE_SURCHARGES = { 'S': 0, 'M': 0, 'L': 0, 'XL': 0, '2XL': 2, '3XL': 4, '4XL': 4 };
        this.items.forEach((item, index) => {
            const product = products.find(p => p.id === item.id);
            if (!product && !item.isAccessory && !item.name) return;

            const qty = item.quantity || item.qty || 1;
            let displayName = '';
            let displayPrice = 0;
            let displayDetails = '';
            let rawImgUrl = '';

            if (item.isAccessory) {
                displayName = item.name || 'Accesorio';
                displayPrice = item.price || 0;
                displayDetails = 'Accesorio adicional';
                rawImgUrl = item.image || '/assets/logo/logo.png';
            } else {
                displayName = item.name || product?.name || 'Camiseta';
                const custom = item.customization || {};
                const size = custom.size || item.size || 'N/A';
                const version = custom.version || item.version || 'aficionado';
                const sizeSurcharge = SIZE_SURCHARGES[size] || 0;
                const versionSurcharge = version === 'jugador' ? 5 : 0;
                const patch = custom.patch || '';
                let patchSurcharge = custom.patchExtraPrice !== undefined ? custom.patchExtraPrice : 0;
                if (custom.patchExtraPrice === undefined && patch && patch !== 'none') {
                    if (product && product.customPatches === 'espana26') {
                        const count = patch.split(',').map(s => s.trim()).filter(Boolean).length;
                        patchSurcharge = count * 1.25;
                    } else {
                        patchSurcharge = 3;
                    }
                }
                const hasName = !!(custom.name || '');
                const hasNumber = !!(custom.number || '');
                const personSurcharge = (hasName || hasNumber) ? 4 : 0;
                const baseProductPrice = item.basePrice || product?.price || 22.90;
                displayPrice = baseProductPrice + sizeSurcharge + versionSurcharge + patchSurcharge + personSurcharge;
                
                displayDetails = `Talla: ${size} / ${version === 'jugador' ? 'Jugador' : 'Aficionado'}`;
                if (custom.name) displayDetails += ` | Nombre: ${sanitizeHTML(custom.name)}`;
                if (custom.number) displayDetails += ` | Dorsal: ${sanitizeHTML(custom.number)}`;
                if (patch && patch !== 'none') displayDetails += ` | Parche: ${sanitizeHTML(patch)}`;
                rawImgUrl = item.image || product?.image || '';
            }

            const miniImgUrl = getMiniImagePath(rawImgUrl) || rawImgUrl;

            const el = document.createElement('div');
            el.className = 'checkout-item-mini';
            const isLast = index === this.items.length - 1;
            el.style.cssText = `display:flex; gap:0.75rem; align-items:flex-start; ${isLast ? 'margin-bottom:0.5rem;' : 'margin-bottom:1rem; padding-bottom:1rem; border-bottom:1px solid var(--border);'}`;
            el.innerHTML = `
                <img src="${miniImgUrl}" alt="${sanitizeHTML(displayName)}" loading="eager" decoding="async" onerror="this.onerror=null;this.src='${rawImgUrl}';" style="width:50px; height:50px; object-fit:contain; border:1px solid var(--border); border-radius:8px; padding:2px; background:#fff; flex-shrink:0;">
                <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:0.25rem;">
                    <h4 style="font-size:0.9rem; font-weight:700; margin:0; color:var(--text-main); line-height:1.3; overflow-wrap:break-word; text-align:left;">${sanitizeHTML(displayName)}</h4>
                    <p style="font-size:0.75rem; color:var(--text-muted); margin:0; line-height:1.3; overflow-wrap:break-word; text-align:left;">${displayDetails}</p>
                    
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-top:0.5rem; gap:0.5rem; flex-wrap:wrap;">
                        <div style="display:flex; align-items:center; gap:0.35rem;">
                            <!-- Quantity Selector in Checkout -->
                            <div class="quantity-selector" style="display:flex; align-items:center; border:1px solid var(--border); border-radius:6px; overflow:hidden; background:var(--bg-body); height:26px; flex-shrink:0; width:72px !important; min-width:72px !important; max-width:72px !important; justify-content:space-between !important;">
                                <button class="qty-btn-minus-checkout" data-index="${index}" style="border:none; background:transparent; width:24px !important; height:22px; min-width:24px !important; max-width:24px !important; flex:none !important; cursor:pointer; color:var(--text-main); display:flex; align-items:center; justify-content:center; padding:0;" aria-label="Disminuir"><i class="fas fa-minus" style="font-size:0.65rem;"></i></button>
                                <input type="number" value="${qty}" style="width:24px !important; flex:none !important; border:none; text-align:center; background:transparent; font-size:0.8rem; font-weight:600; color:var(--text-main); pointer-events:none; padding:0; margin:0;" readonly>
                                <button class="qty-btn-plus-checkout" data-index="${index}" style="border:none; background:transparent; width:24px !important; height:22px; min-width:24px !important; max-width:24px !important; flex:none !important; cursor:pointer; color:var(--text-main); display:flex; align-items:center; justify-content:center; padding:0;" aria-label="Aumentar"><i class="fas fa-plus" style="font-size:0.65rem;"></i></button>
                            </div>
                            <!-- Delete Button -->
                            <button class="btn-remove-checkout" data-index="${index}" style="border:none; background:transparent; color:var(--text-muted); cursor:pointer; font-size:0.85rem; width:26px; height:26px; display:flex; align-items:center; justify-content:center; border-radius:6px; transition:all 0.2s;" title="Eliminar"><i class="fas fa-trash-alt"></i></button>
                            <!-- Edit Button -->
                            <button class="btn-checkout-edit" data-index="${index}" style="border:none; background:transparent; color:var(--text-muted); cursor:pointer; font-size:0.85rem; width:26px; height:26px; display:flex; align-items:center; justify-content:center; border-radius:6px; transition:all 0.2s;" title="Editar producto" aria-label="Editar ${sanitizeHTML(displayName)}"><i class="fas fa-pen"></i></button>
                        </div>
                        
                        <span style="font-size:0.9rem; font-weight:800; color:var(--text-main);">€${(displayPrice * qty).toFixed(2)}</span>
                    </div>
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
        container.querySelectorAll('.btn-checkout-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                openCartItemEditModal(index, this);
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
    if (n.includes('campeones')) return 'champions';
    if (n.includes('kids') || n.includes('niño') || n.includes('niños') || img.includes('kids')) return 'kids';
    if (n.includes('retro')) return 'retro';
    if (n.includes('nba')   || img.includes('nba')) return 'nba';
    return 'normal';
}

const CART_SIZE_CONFIGS = {
    kids:   ['16', '18', '20', '22', '24', '26', '28'],
    retro:  ['S', 'M', 'L', 'XL', '2XL'],
    normal: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    nba:    ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    champions: ['S', 'M', 'L', 'XL', '2XL', '3XL']
};

const CART_SIZE_SURCHARGES = { '2XL': 2, '3XL': 4, '4XL': 4 };

function calcEditPrice(basePrice, custom, isEspana26 = false, hasDynamicPatches = false) {
    let total = basePrice;
    total += CART_SIZE_SURCHARGES[custom.size] || 0;
    if (custom.version === 'jugador') total += 5;
    
    if (custom.patchExtraPrice !== undefined) {
        total += custom.patchExtraPrice;
    } else if (custom.patch) {
        if (isEspana26) {
            const count = custom.patch.split(',').map(s => s.trim()).filter(Boolean).length;
            total += count * 1.25;
        } else {
            total += 3;
        }
    }
    // Nombre O dorsal = +€4 (no hace falta tener los dos)
    if (custom.name || custom.number) total += 4;
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
    const isChampions  = type === 'champions';
    const isRestricted = isNBA || isKids || isRetro;
    // Leer noPatches del producto original
    const productData  = products.find(p => p.id === item.id);
    const isNoPatches  = productData?.noPatches === true;
    const showVersion  = !isRestricted;           // version hidden for kids / retro / NBA
    const showPatch    = !isNBA && !isNoPatches && !isChampions;   // patch hidden for NBA and noPatches
    const showCustomization = !isChampions;

    const currentVersion = custom.version || 'aficionado';

    const isEspana26 = productData?.customPatches === 'espana26';
    const hasDynamicPatches = Array.isArray(productData?.customPatches) && productData.customPatches.length > 0;

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

    let patchBlock = '';
    if (hasDynamicPatches) {
        const activePatches = custom.patches || (custom.patch ? custom.patch.split(',').map(s => s.trim()) : []);
        const otroPatchName = activePatches.find(pName => !productData.customPatches.some(cp => cp.name === pName));
        const hasOtro = !!otroPatchName;

        patchBlock = `
            <div class="upsell-edit-field" id="ce-patch-group">
                <label>Parches</label>
                <div id="ce-custom-patches-list" style="display: flex; flex-direction: column; gap: 0.6rem; margin-top: 0.5rem;">
                    ${productData.customPatches.map((p, idx) => {
                        const checked = activePatches.includes(p.name) ? 'checked' : '';
                        return `
                            <label class="custom-patch-item" style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer; padding: 0.6rem 0.75rem; border: 1px solid var(--border); border-radius: 8px; background: var(--bg-card);">
                                <input type="checkbox" class="ce-custom-patch-cb" data-price="${p.price}" value="${p.name}" ${checked} style="width: 18px; height: 18px; cursor: pointer; accent-color: var(--accent, #6366f1);">
                                <img src="${p.image || '/assets/placeholder.webp'}" style="width: 30px; height: 30px; object-fit: contain; border-radius: 4px; background: #f8f9fa;">
                                <span style="font-size: 0.85rem; color: var(--text-main); flex: 1;">${p.name} (+€${p.price.toFixed(2)})</span>
                            </label>
                        `;
                    }).join('')}
                    <label class="custom-patch-item" style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer; padding: 0.6rem 0.75rem; border: 1px solid var(--border); border-radius: 8px; background: var(--bg-card);">
                        <input type="checkbox" id="ce-custom-patch-otro-cb" ${hasOtro ? 'checked' : ''} style="width: 18px; height: 18px; cursor: pointer; accent-color: var(--accent, #6366f1);">
                        <div style="width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; background: #f8f9fa; border-radius: 4px; font-weight: bold; font-size: 1.1rem; color: var(--text-muted);">?</div>
                        <span style="font-size: 0.85rem; color: var(--text-main); flex: 1;">Otro (+€3.00)</span>
                    </label>
                    <div id="ce-custom-patch-otro-input-container" style="display: ${hasOtro ? 'block' : 'none'}; padding-left: 0.5rem; margin-top: -0.25rem;">
                        <input type="text" id="ce-custom-patch-otro-input" placeholder="Ej: Champions, Liga, etc." maxlength="30" autocomplete="off" style="width: 100%; padding: 0.6rem; border: 1px solid var(--border); border-radius: 8px;" value="${hasOtro ? otroPatchName : ''}">
                    </div>
                </div>
            </div>
        `;
    } else if (isEspana26) {
        const patches = [
            { label: 'Parche dorado central (Campeones de mundo 2026)', short: 'Campeones', img: '/assets/images/patches/dorado-central.webp' },
            { label: 'Parche manga derecha mundial 2026 dorado', short: '26 dorado', img: '/assets/images/patches/manga-derecha.webp' },
            { label: 'Parche Football unites the world manga izquierda', short: 'fifa', img: '/assets/images/patches/manga-izquierda.webp' }
        ];
        if (productData?.tipo === 'local') {
            patches.push({ label: 'Letras debajo de escudo de final', short: 'letras', img: '/assets/images/patches/letras-final.webp' });
        }
        const activePatches = custom.patch ? custom.patch.split(',').map(s => s.trim()) : [];
        
        patchBlock = `
            <div class="upsell-edit-field" id="ce-patch-group">
                <label>Parches</label>
                <div id="ce-custom-patches-list" style="display: flex; flex-direction: column; gap: 0.6rem; margin-top: 0.5rem;">
                    ${patches.map(p => {
                        const checked = activePatches.includes(p.short) ? 'checked' : '';
                        return `
                            <label class="custom-patch-item" style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer; padding: 0.6rem 0.75rem; border: 1px solid var(--border); border-radius: 8px; background: var(--bg-card);">
                                <input type="checkbox" class="ce-custom-patch-cb" value="${p.short}" ${checked} style="width: 18px; height: 18px; cursor: pointer; accent-color: var(--accent, #6366f1);">
                                <img src="${p.img}" style="width: 30px; height: 30px; object-fit: contain; border-radius: 4px;">
                                <span style="font-size: 0.85rem; color: var(--text-main); flex: 1;">${p.label}</span>
                            </label>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    } else {
        patchBlock = showPatch ? `
            <div class="upsell-edit-field" id="ce-patch-group">
                <label>Parche <span style="color:#6b7280;text-transform:none;font-weight:400;">(+€3.00 si rellenas)</span></label>
                <input type="text" id="ce-patch" placeholder="Ej. Champions League" maxlength="30" autocomplete="off" value="${custom.patch || ''}">
            </div>` : (isNoPatches ? `
            <div style="display:flex;align-items:flex-start;gap:0.6rem;background:linear-gradient(135deg,rgba(34,197,94,.12),rgba(16,185,129,.08));border:1.5px solid rgba(34,197,94,.35);border-radius:10px;padding:0.8rem 0.9rem;margin-top:0.5rem;font-size:0.87rem;line-height:1.5;color:inherit;">
                <i class="fas fa-tag" style="color:#22c55e;font-size:0.95rem;margin-top:0.1rem;flex-shrink:0;"></i>
                <div><strong style="display:block;margin-bottom:0.2rem;color:#22c55e;">Precio todo incluido</strong>€${basePrice.toFixed(2)} incluye todos los parches de la imagen. No se añaden parches extra.</div>
            </div>` : '');
    }

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
            ${showCustomization ? `
            <div class="upsell-edit-field">
                <label>Nombre <span style="color:#6b7280;text-transform:none;font-weight:400;">(solo letras · máx 15 · +€4 con nombre o dorsal)</span></label>
                <input type="text" id="ce-name" placeholder="Ej. PEDRI" maxlength="15" autocomplete="off" value="${custom.name || ''}">
            </div>

            <div class="upsell-edit-field">
                <label>Dorsal <span style="color:#6b7280;text-transform:none;font-weight:400;">(0–999)</span></label>
                <input type="text" id="ce-number" placeholder="Ej. 10" maxlength="3" inputmode="numeric" pattern="[0-9]*" autocomplete="off" value="${custom.number || ''}">
            </div>` : ''}

            ${patchBlock}

            <div class="upsell-edit-price-summary">
                <span>Total por unidad</span>
                <span class="upsell-edit-price-total" id="ce-total">€${calcEditPrice(basePrice, { ...custom, patchExtraPrice: custom.patchExtraPrice }, isEspana26, hasDynamicPatches).toFixed(2)}</span>
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
    const getPatchState = () => {
        let patchExtraPrice = 0;
        let finalPatches = [];
        let finalPatchStr = '';

        if (hasDynamicPatches) {
            const cbs = overlay.querySelectorAll('.ce-custom-patch-cb:checked');
            cbs.forEach(cb => {
                patchExtraPrice += parseFloat(cb.getAttribute('data-price')) || 0;
                finalPatches.push(cb.value);
            });
            const otroCb = overlay.querySelector('#ce-custom-patch-otro-cb');
            const otroInput = overlay.querySelector('#ce-custom-patch-otro-input');
            if (otroCb && otroCb.checked) {
                const txt = otroInput ? otroInput.value.trim() : '';
                if (txt) {
                    finalPatches.push(txt);
                    patchExtraPrice += 3;
                }
            }
            finalPatchStr = finalPatches.join(', ');
        } else if (isEspana26) {
            const cbs = overlay.querySelectorAll('.ce-custom-patch-cb:checked');
            finalPatches = Array.from(cbs).map(cb => cb.value);
            finalPatchStr = finalPatches.join(', ');
            patchExtraPrice = finalPatches.length * 1.25;
        } else {
            finalPatchStr = overlay.querySelector('#ce-patch')?.value.trim() || '';
            if (finalPatchStr) {
                finalPatches = [finalPatchStr];
                patchExtraPrice = 3;
            }
        }
        return { patch: finalPatchStr, patches: finalPatches, patchExtraPrice };
    };

    // ── Live price — mirrors updatePreview() in producto.js ─────────────────
    function updatePrice() {
        const el = overlay.querySelector('#ce-total');
        if (!el) return;
        const pState = getPatchState();
        const c = { size: getSize(), version: getVersion(), name: getName().trim(), number: getNumber().trim(), patch: pState.patch, patchExtraPrice: pState.patchExtraPrice };
        el.textContent = `€${calcEditPrice(basePrice, c, isEspana26, hasDynamicPatches).toFixed(2)}`;
    }

    // ── Version → disable 3XL/4XL (mirrors applyPlayerVersionSizeRestriction) ──
    function applyVersionSizeRestriction() {
        if (!showVersion) return;
        const sizeSelect = overlay.querySelector('#ce-size');
        const versionSelect = overlay.querySelector('#ce-version');
        if (!sizeSelect || !versionSelect) return;


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

    // ── Number input: digits only, 0-999, max 3 (mirrors handleDorsalInput) ──
    overlay.querySelector('#ce-number')?.addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 3) v = v.slice(0, 3);
        if (v !== '' && parseInt(v) > 999) v = '999';
        e.target.value = v;
        updatePrice();
    });

    // ── Version change ───────────────────────────────────────────────────────
    overlay.querySelector('#ce-version')?.addEventListener('change', applyVersionSizeRestriction);

    // ── Size / patch change ──────────────────────────────────────────────────
    overlay.querySelector('#ce-size')?.addEventListener('change', updatePrice);
    if (hasDynamicPatches) {
        overlay.querySelectorAll('.ce-custom-patch-cb').forEach(cb => {
            cb.addEventListener('change', updatePrice);
        });
        const otroCb = overlay.querySelector('#ce-custom-patch-otro-cb');
        const otroInput = overlay.querySelector('#ce-custom-patch-otro-input');
        const otroContainer = overlay.querySelector('#ce-custom-patch-otro-input-container');
        if (otroCb && otroInput && otroContainer) {
            otroCb.addEventListener('change', () => {
                otroContainer.style.display = otroCb.checked ? 'block' : 'none';
                if (!otroCb.checked) otroInput.value = '';
                updatePrice();
            });
            otroInput.addEventListener('input', updatePrice);
        }
    } else if (isEspana26) {
        overlay.querySelectorAll('.ce-custom-patch-cb').forEach(cb => {
            cb.addEventListener('change', updatePrice);
        });
    } else {
        const patchInput = overlay.querySelector('#ce-patch');
        if (patchInput) patchInput.addEventListener('input', updatePrice);
    }

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
        const hasName   = nameVal.length > 0;
        const hasNumber = numberVal.length > 0;

        // Validation: name — letters, spaces and dots only
        if (hasName && !/^[A-Za-z\u00C0-\u00FF\s\.]+$/.test(nameVal)) {
            if (window.Toast) window.Toast.error('El nombre solo puede contener letras, espacios y puntos');
            else alert('El nombre solo puede contener letras, espacios y puntos');
            return;
        }

        // Validation: dorsal — numeric 0-999, max 3 digits
        if (hasNumber) {
            const numValue = parseInt(numberVal);
            if (numberVal.length > 3 || numValue < 0 || numValue > 999 || isNaN(numValue)) {
                if (window.Toast) window.Toast.error('El dorsal debe ser un número entre 0 y 999 (máximo 3 dígitos)');
                else alert('El dorsal debe ser un número entre 0 y 999 (máximo 3 dígitos)');
                return;
            }
        }

        const pState = getPatchState();
        
        let newCustom = {
            size:    getSize(),
            version: getVersion(),
            name:    hasName ? nameVal.toUpperCase() : '',
            number:  numberVal,
            patch:   pState.patch,
            patches: pState.patches,
            patchExtraPrice: pState.patchExtraPrice,
            extras:  []
        };

        const newPrice = calcEditPrice(basePrice, newCustom, isEspana26, hasDynamicPatches);

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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCartPage);
} else {
    initCartPage();
}

function initCartPage() {
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
}

export default Cart;


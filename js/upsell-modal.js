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

    if (nameLower.includes('campeones')) return 'champions';
    if (isKids) return 'kids';
    if (isRetro) return 'retro';
    if (isNBA) return 'nba';
    return 'normal';
}


const SIZE_CONFIGS = {
    kids: ['16', '18', '20', '22', '24', '26', '28'],
    retro: ['S', 'M', 'L', 'XL', '2XL'],
    normal: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    nba: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    champions: ['S', 'M', 'L', 'XL', '2XL', '3XL']
};

const SIZE_SURCHARGES = { '2XL': 1, '3XL': 2, '4XL': 2 };

function getProductPrices(product) {
    // Productos con precio fijo (noPatches: true) — no sobrescribir
    if (product.fixedPrice === true) {
        return { price: product.price, oldPrice: product.oldPrice || product.price };
    }
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
    } else if (product.customPatches === 'espana26' && isKids) {
        oldPrice = 29.00;
        price = 23.90;
    } else if (isKids) {
        oldPrice = 27.00;
        price = 21.90;
    } else if (product.customPatches === 'espana26') {
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

    const shuffledLeague = sameLeague.sort(() => Math.random() - 0.5);
    const shuffledCategory = sameCategory.sort(() => Math.random() - 0.5);

    return [...sameTeam, ...shuffledLeague, ...shuffledCategory];
}

// ---------------------------------------------------------------------------
// Pack promo logic
// ---------------------------------------------------------------------------
export function formatPrice(price) {
    return price.toFixed(2).replace('.', ',');
}

function getPackPromoHTML() {
    // 1. Lectura Directa y Única en Tiempo Real
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) return '';

    const totalShirtQty = cart.reduce((sum, item) => sum + (item.isAccessory ? 0 : (item.quantity || item.qty || 1)), 0);
    
    const currentDiff = cart.reduce((sum, item) => {
        if (item.isAccessory) return sum;
        const qty = item.quantity || item.qty || 1;
        const basePrice = item.basePrice || 19.90;
        return sum + (basePrice - 19.90) * qty;
    }, 0);

    // 1. Envío Gratis (Prioridad Máxima)
    if (totalShirtQty === 1) {
        return `
            <div class="pack-promo-card promo-entering">
                <div class="pack-promo-icon">🎁</div>
                <div class="pack-promo-text">
                    <span class="pack-promo-title">¡Envío Gratis!</span>
                    <span class="pack-promo-desc">Añade <strong>1 camiseta más</strong> para conseguir envío gratuito.</span>
                </div>
            </div>
        `;
    }

    // 2. Megapack (Bloques de 5) - Prioridad Alta
    if (totalShirtQty % 5 === 3 || totalShirtQty % 5 === 4) {
        const m = Math.floor((totalShirtQty + 2) / 5);
        const faltan = 5 - (totalShirtQty % 5);
        const textoCamisetas = faltan === 1 ? "1 camiseta más" : "2 camisetas más";
        const precioTotal = formatPrice(m * 85.90 + currentDiff);
        const ahorro = formatPrice(m * 13.60);
        
        return `
            <div class="pack-promo-card mega promo-entering">
                <div class="pack-promo-icon">⚡</div>
                <div class="pack-promo-text">
                    <span class="pack-promo-title">¡Ahorro Megapack!</span>
                    <span class="pack-promo-desc">Con <strong>${textoCamisetas}</strong>, consigues el <strong>${m}x Megapack 5 por ${precioTotal}€</strong> (Ahorrarás ${ahorro}€!)</span>
                </div>
            </div>
        `;
    }

    // 3. Pack Popular (Bloques de 3) - Prioridad Baja
    if (totalShirtQty % 3 === 2) {
        const n = Math.floor((totalShirtQty + 1) / 3);
        const precioTotal = formatPrice(n * 56.90 + currentDiff);
        const ahorro = formatPrice(n * 2.80);
        
        return `
            <div class="pack-promo-card popular promo-entering">
                <div class="pack-promo-icon">🔥</div>
                <div class="pack-promo-text">
                    <span class="pack-promo-title">¡Ahorro Pack Popular!</span>
                    <span class="pack-promo-desc">Con <strong>1 camiseta más</strong>, consigues el <strong>${n}x Pack 3 por ${precioTotal}€</strong> (Ahorrarás ${ahorro}€!)</span>
                </div>
            </div>
        `;
    }

    return '';
}

// ---------------------------------------------------------------------------
// updatePackPromoMessage — update of the promo banner
// ---------------------------------------------------------------------------
export function updatePackPromoMessage() {
    const promoContainer = document.getElementById('upsell-pack-promo');
    if (!promoContainer) return;

    // Inyección de forma síncrona con el estado actual del carrito
    promoContainer.innerHTML = getPackPromoHTML();
}

// ---------------------------------------------------------------------------
// addToCartDirectly — adds a recommended product and refreshes the modal
// ---------------------------------------------------------------------------
function addToCartDirectly(product, size, btnElement, pendingCustom = null) {
    const prices = getProductPrices(product);
    const sizeSurcharge = UPSELL_SIZE_SURCHARGES[size] || 0;

    // Use pending customization if provided, otherwise default
    const customization = pendingCustom ? { ...pendingCustom, size } : {
        size: size,
        version: 'aficionado',
        name: '',
        number: '',
        patch: '',
        extras: []
    };

    // Recalculate price including any customization surcharges
    let totalPrice = prices.price + sizeSurcharge;
    if (customization.version === 'jugador') totalPrice += 5;
    if (customization.patch) {
        if (product.customPatches === 'espana26') {
            const count = customization.patch.split(',').map(s => s.trim()).filter(Boolean).length;
            totalPrice += count * 1.25;
        } else {
            totalPrice += 2;
        }
    }
    if (customization.name || customization.number) totalPrice += 3;

    const cartItem = {
        id: product.id,
        name: product.name,
        image: product.image,
        basePrice: prices.price,
        price: totalPrice,
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
    const customDesc = (customization.name || customization.number)
        ? ` · ${customization.name || ''} ${customization.number || ''}`.trim()
        : '';
    if (window.Toast && typeof window.Toast.success === 'function') {
        window.Toast.success(`${product.name} (${size}${customDesc}) añadido`);
    } else if (window.showToast) {
        window.showToast(`${product.name} (${size}) añadido`);
    }

    // Update pack promo with animation
    updatePackPromoMessage();

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

// ---------------------------------------------------------------------------
// Inline customization panel for upsell items (pencil button)
// ---------------------------------------------------------------------------
const UPSELL_SIZE_SURCHARGES = { '2XL': 1, '3XL': 2, '4XL': 2 };

function calcUpsellEditPrice(basePrice, custom, isEspana26 = false) {
    let total = basePrice;
    total += UPSELL_SIZE_SURCHARGES[custom.size] || 0;
    if (custom.version === 'jugador') total += 5;
    if (custom.patch) {
        if (isEspana26) {
            const count = custom.patch.split(',').map(s => s.trim()).filter(Boolean).length;
            total += count * 1.25;
        } else {
            total += 2;
        }
    }
    if (custom.name || custom.number) total += 3;
    return total;
}

function openUpsellItemEditPanel(prod, sizeSelect, pendingCustomRef) {
    const prices = getProductPrices(prod);
    const basePrice = prices.price;
    const type = getProductType(prod);
    const sizes = SIZE_CONFIGS[type] || SIZE_CONFIGS.normal;
    const currentSize = sizeSelect ? sizeSelect.value : (type === 'kids' ? '24' : 'M');
    const current = pendingCustomRef.custom || {};

    const isNBA     = type === 'nba';
    const isKids    = type === 'kids';
    const isRetro   = type === 'retro';
    const isChampions = type === 'champions';
    const isRestricted = isNBA || isKids || isRetro;
    const showVersion  = !isRestricted;
    const showPatch    = !isNBA && !prod.noPatches && !isChampions;
    const showCustomization = !isChampions;

    const isEspana26 = prod.customPatches === 'espana26';

    const sizeOptions = sizes.map(sz => {
        const sel   = sz === currentSize ? 'selected' : '';
        const extra = UPSELL_SIZE_SURCHARGES[sz] ? ` (+€${UPSELL_SIZE_SURCHARGES[sz]})` : '';
        return `<option value="${sz}" ${sel}>${sz}${extra}</option>`;
    }).join('');

    const versionBlock = showVersion ? `
        <div class="upsell-edit-field">
            <label>Versión <span style="color:#6b7280;text-transform:none;font-weight:400;">(+€5 Jugador)</span></label>
            <select id="ue-version">
                <option value="aficionado" ${(current.version||'aficionado')==='aficionado'?'selected':''}>Aficionado</option>
                <option value="jugador"    ${current.version==='jugador'?'selected':''}>Jugador (+€5)</option>
            </select>
        </div>` : '';

    let patchBlock = '';
    if (isEspana26) {
        const patches = [
            { label: 'Parche dorado central (Campeones de mundo 2026)', short: 'Campeones', img: '/assets/images/patches/dorado-central.webp' },
            { label: 'Parche manga derecha mundial 2026 dorado', short: '26 dorado', img: '/assets/images/patches/manga-derecha.webp' },
            { label: 'Parche Football unites the world manga izquierda', short: 'fifa', img: '/assets/images/patches/manga-izquierda.webp' }
        ];
        if (prod.tipo === 'local') {
            patches.push({ label: 'Letras debajo de escudo de final', short: 'letras', img: '/assets/images/patches/letras-final.webp' });
        }
        const activePatches = current.patch ? current.patch.split(',').map(s => s.trim()) : [];
        
        patchBlock = `
            <div class="upsell-edit-field">
                <label>Parches Especiales 2026 <span style="color:#6b7280;text-transform:none;font-weight:400;">(+€1.25 c/u)</span></label>
                <div id="ue-custom-patches-list" style="display: flex; flex-direction: column; gap: 0.6rem; margin-top: 0.5rem;">
                    ${patches.map(p => {
                        const checked = activePatches.includes(p.short) ? 'checked' : '';
                        return `
                            <label class="custom-patch-item" style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer; padding: 0.6rem 0.75rem; border: 1px solid var(--border); border-radius: 8px; background: var(--bg-card);">
                                <input type="checkbox" class="ue-custom-patch-cb" value="${p.short}" ${checked} style="width: 18px; height: 18px; cursor: pointer; accent-color: var(--accent, #6366f1);">
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
            <div class="upsell-edit-field">
                <label>Parche <span style="color:#6b7280;text-transform:none;font-weight:400;">(+€2.00)</span></label>
                <input type="text" id="ue-patch" placeholder="Ej. Champions League" maxlength="30" autocomplete="off" value="${current.patch || ''}">
            </div>` : (prod.noPatches ? `
            <div style="display:flex;align-items:flex-start;gap:0.6rem;background:linear-gradient(135deg,rgba(34,197,94,.12),rgba(16,185,129,.08));border:1.5px solid rgba(34,197,94,.35);border-radius:10px;padding:0.8rem 0.9rem;margin-top:0.5rem;font-size:0.87rem;line-height:1.5;color:inherit;">
                <i class="fas fa-tag" style="color:#22c55e;font-size:0.95rem;margin-top:0.1rem;flex-shrink:0;"></i>
                <div><strong style="display:block;margin-bottom:0.2rem;color:#22c55e;">Precio todo incluido</strong>€${basePrice.toFixed(2)} incluye todos los parches de la imagen. No se añaden parches extra.</div>
            </div>` : '');
    }

    const overlay = document.createElement('div');
    overlay.className = 'upsell-edit-overlay';
    overlay.innerHTML = `
        <div class="upsell-edit-panel" role="dialog" aria-modal="true">
            <div class="upsell-edit-header">
                <h3>Personalizar</h3>
                <button class="upsell-edit-close" aria-label="Cerrar">&times;</button>
            </div>
            <div class="upsell-edit-product-preview">
                <img src="${getMiniImagePath(prod.image)}" alt="${prod.name}">
                <span class="upsell-edit-product-preview-name">${prod.name}</span>
            </div>
            <div class="upsell-edit-field">
                <label>Talla</label>
                <select id="ue-size">${sizeOptions}</select>
            </div>
            ${versionBlock}
            ${showCustomization ? `
            <div class="upsell-edit-field">
                <label>Nombre <span style="color:#6b7280;text-transform:none;font-weight:400;">(solo letras · máx 15 · +€3 con nombre o dorsal)</span></label>
                <input type="text" id="ue-name" placeholder="Ej. PEDRI" maxlength="15" autocomplete="off" value="${current.name || ''}">
            </div>
            <div class="upsell-edit-field">
                <label>Dorsal <span style="color:#6b7280;text-transform:none;font-weight:400;">(0–999)</span></label>
                <input type="text" id="ue-number" placeholder="Ej. 10" maxlength="3" inputmode="numeric" pattern="[0-9]*" value="${current.number || ''}">
            </div>` : ''}
            ${patchBlock}
            <div class="upsell-edit-price-summary">
                <span>Total por unidad</span>
                <span class="upsell-edit-price-total" id="ue-total">€${calcUpsellEditPrice(basePrice, { size: currentSize, ...current }, isEspana26).toFixed(2)}</span>
            </div>
            <div class="upsell-edit-actions">
                <button class="btn-upsell-edit-cancel">Cancelar</button>
                <button class="btn-upsell-edit-save" id="ue-save-btn">Añadir al carrito</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('active')));

    const getSize    = () => overlay.querySelector('#ue-size')?.value    || currentSize;
    const getVersion = () => overlay.querySelector('#ue-version')?.value || 'aficionado';
    const getName    = () => overlay.querySelector('#ue-name')?.value    || '';
    const getNumber  = () => overlay.querySelector('#ue-number')?.value  || '';
    const getPatch   = () => {
        if (isEspana26) {
            const cbs = overlay.querySelectorAll('.ue-custom-patch-cb:checked');
            return Array.from(cbs).map(cb => cb.value).join(', ');
        }
        return overlay.querySelector('#ue-patch')?.value || '';
    };

    const getPatchesArray = () => {
        if (isEspana26) {
            const cbs = overlay.querySelectorAll('.ue-custom-patch-cb:checked');
            return Array.from(cbs).map(cb => cb.value);
        }
        const val = overlay.querySelector('#ue-patch')?.value.trim() || '';
        return val ? [val] : [];
    };

    function updatePrice() {
        const el = overlay.querySelector('#ue-total');
        if (!el) return;
        el.textContent = `€${calcUpsellEditPrice(basePrice, { size: getSize(), version: getVersion(), name: getName().trim(), number: getNumber().trim(), patch: getPatch() }, isEspana26).toFixed(2)}`;
    }

    // Version → deshabilitar 3XL/4XL para Jugador (mismo comportamiento que producto.js)
    function applyVersionSizeRestriction() {
        const sizeSelect = overlay.querySelector('#ue-size');
        const versionSelect = overlay.querySelector('#ue-version');
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

    // Live validation on name
    overlay.querySelector('#ue-name')?.addEventListener('input', e => {
        let v = e.target.value.replace(/[^A-Za-zÀ-ÿ\s\.]/g, '');
        if (v.length > 15) v = v.slice(0, 15);
        e.target.value = v;
        updatePrice();
    });
    // Live validation on number
    overlay.querySelector('#ue-number')?.addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 3) v = v.slice(0, 3);
        if (v !== '' && parseInt(v) > 999) v = '999';
        e.target.value = v;
        updatePrice();
    });
    overlay.querySelector('#ue-version')?.addEventListener('change', applyVersionSizeRestriction);
    overlay.querySelector('#ue-size')?.addEventListener('change', updatePrice);
    if (isEspana26) {
        overlay.querySelectorAll('.ue-custom-patch-cb').forEach(cb => {
            cb.addEventListener('change', updatePrice);
        });
    } else {
        overlay.querySelector('#ue-patch')?.addEventListener('input', updatePrice);
    }

    // Aplicar restricción inicial (por si el item ya estaba en Jugador)
    applyVersionSizeRestriction();


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

    overlay.querySelector('#ue-save-btn').addEventListener('click', () => {
        const nameVal    = getName().trim();
        const numberVal  = getNumber().trim();

        if (nameVal && !/^[A-Za-z\u00C0-\u00FF\s\.]+$/.test(nameVal)) {
            if (window.Toast) window.Toast.error('El nombre solo puede contener letras, espacios y puntos');
            return;
        }
        if (numberVal) {
            const n = parseInt(numberVal);
            if (numberVal.length > 3 || n < 0 || n > 999 || isNaN(n)) {
                if (window.Toast) window.Toast.error('El dorsal debe ser un número entre 0 y 999');
                return;
            }
        }

        const newSize = getSize();
        const customization = {
            size:    newSize,
            version: getVersion(),
            name:    nameVal ? nameVal.toUpperCase() : '',
            number:  numberVal,
            patch:   getPatch(),
            patches: getPatchesArray(),
            extras:  []
        };

        // Añadir directamente al carrito y cerrar el panel
        addToCartDirectly(prod, newSize, null, customization);
        closeOverlay();
    });
}

// ---------------------------------------------------------------------------
// Recommendation item rendering
// ---------------------------------------------------------------------------
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
        <div class="upsell-rec-item" data-id="${prod.id}" style="cursor:default;">
            <a href="/pages/producto.html?id=${prod.id}" class="upsell-rec-card-link" aria-label="Ver ${prod.name}" title="Ver ${prod.name}">
                <img src="${getMiniImagePath(prod.image)}" alt="${prod.name}" class="upsell-rec-img">
                <div class="upsell-rec-info">
                    <span class="upsell-rec-title">${prod.name}</span>
                    <div class="upsell-rec-prices">
                        <span class="upsell-rec-price">€${prices.price.toFixed(2)}</span>
                        <span class="upsell-rec-old-price">€${prices.oldPrice.toFixed(2)}</span>
                    </div>
                </div>
            </a>
            <div class="upsell-rec-actions">
                <select class="upsell-rec-size-select" aria-label="Seleccionar talla">
                    ${sizeOptionsHTML}
                </select>
                <button class="btn-upsell-rec-customize" data-id="${prod.id}" title="Personalizar" aria-label="Personalizar ${prod.name}">
                    <i class="fas fa-pen"></i>
                </button>
                <button class="btn-upsell-rec-add" data-id="${prod.id}" title="Añadir al carrito">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>
    `;
}

function attachRecItemListeners(parentElement) {
    // Each item gets its own pending-customization ref
    parentElement.querySelectorAll('.upsell-rec-item').forEach(recItem => {
        if (recItem.getAttribute('data-listeners-attached')) return;
        recItem.setAttribute('data-listeners-attached', 'true');

        const prodId = parseInt(recItem.getAttribute('data-id'));
        const recProduct = products.find(p => p.id === prodId);
        if (!recProduct) return;

        const sizeSelect = recItem.querySelector('.upsell-rec-size-select');
        const addBtn     = recItem.querySelector('.btn-upsell-rec-add');
        const editBtn    = recItem.querySelector('.btn-upsell-rec-customize');

        // Shared pending customization state per card
        const pendingCustomRef = { custom: null };

        // Pencil button → open customization panel
        if (editBtn) {
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openUpsellItemEditPanel(recProduct, sizeSelect, pendingCustomRef);
            });
        }

        // + button → add to cart (with pending customization if set)
        if (addBtn) {
            addBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const size = pendingCustomRef.custom?.size || (sizeSelect ? sizeSelect.value : 'M');
                addToCartDirectly(recProduct, size, addBtn, pendingCustomRef.custom);
                // Reset pending after adding
                pendingCustomRef.custom = null;
            });
        }
    });
}

// ---------------------------------------------------------------------------
// showUpsellModal — main export
// ---------------------------------------------------------------------------
export function showUpsellModal(addedProduct, selectedSize = 'M', addedProductPrice = null) {
    // If addedProductPrice is not passed, calculate it
    if (addedProductPrice === null) {
        const prices = getProductPrices(addedProduct);
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
                ${getPackPromoHTML()}
            </div>

            <div class="upsell-recommendations">
                <h4>También te puede gustar...</h4>
                <div class="upsell-recommendations-grid" id="upsell-recs-grid">
                    <!-- Recommendations loaded dynamically -->
                </div>
            </div>

            <div class="upsell-actions">
                <button class="btn-upsell-secondary btn-upsell-close">Seguir comprando</button>
                <a href="/pages/carrito.html" class="btn-upsell-primary">Ver mi carrito</a>
            </div>
        </div>
    `;

    const recsGrid = modalOverlay.querySelector('#upsell-recs-grid');

    // ── Create loader and sentinel programmatically (correct DOM order) ──────
    // Order inside recsGrid: [items...] → loader → sentinel
    const loaderIndicator = document.createElement('div');
    loaderIndicator.className = 'upsell-loader hidden';
    loaderIndicator.id = 'upsell-loader-indicator';
    loaderIndicator.innerHTML = '<div class="upsell-loader-spinner"></div><span>Cargando más productos...</span>';
    recsGrid.appendChild(loaderIndicator);

    const sentinel = document.createElement('div');
    sentinel.className = 'upsell-sentinel';
    sentinel.style.cssText = 'height:1px;width:100%;flex-shrink:0;';
    recsGrid.appendChild(sentinel); // always last

    const BATCH_SIZE = 6;
    let loadedCount = 0;
    let isLoading = false;
    let loadTimeout = null;
    let observer = null;
    let scrollTimeout = null;

    function loadMoreRecs() {
        if (isLoading || loadedCount >= allRecs.length) return;
        isLoading = true;
        loaderIndicator.classList.remove('hidden');

        loadTimeout = setTimeout(() => {
            const batch = allRecs.slice(loadedCount, loadedCount + BATCH_SIZE);
            const batchHTML = batch.map(prod => renderProductItemHTML(prod)).join('');

            // Insert items before the loader (loader stays above sentinel)
            loaderIndicator.insertAdjacentHTML('beforebegin', batchHTML);
            attachRecItemListeners(recsGrid);

            loadedCount += batch.length;
            isLoading = false;
            loaderIndicator.classList.add('hidden');

            // Reconnect observer to sentinel after DOM change so it re-evaluates
            if (observer) {
                observer.unobserve(sentinel);
                observer.observe(sentinel);
            }
        }, 400);
    }

    // ── Scroll fallback — always active as belt-and-suspenders ──────────────
    const handleScrollFallback = () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (isLoading || loadedCount >= allRecs.length) return;
            const { scrollTop, scrollHeight, clientHeight } = recsGrid;
            if (scrollHeight - scrollTop - clientHeight < 150) {
                loadMoreRecs();
            }
        }, 80);
    };
    recsGrid.addEventListener('scroll', handleScrollFallback);

    // ── IntersectionObserver — fires when sentinel enters the scrollable area ─
    if (typeof IntersectionObserver !== 'undefined') {
        observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isLoading && loadedCount < allRecs.length) {
                loadMoreRecs();
            }
        }, {
            root: recsGrid,          // the scrollable container is the viewport
            rootMargin: '0px 0px 100px 0px',
            threshold: 0
        });
        observer.observe(sentinel);
    }

    // Load the first batch immediately on open
    loadMoreRecs();

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

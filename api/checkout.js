import admin from './utils/firebase-admin.js';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS & HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const PROTECTION_FEE = 3.00;
const FREE_SHIPPING_THRESHOLD = 50.00;
const SHIPPING_COST = 4.99;
const ALLOWED_PAYMENT_METHODS = ['paypal', 'bizum', 'revolut'];
const PAYPAL_USERNAME = 'camisetazo';

function sanitizeString(value, maxLength = 500) {
    if (value === null || value === undefined) return '';
    const str = String(value).trim();
    return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .substring(0, maxLength);
}

function flattenProducts(obj, results = []) {
    if (!obj || typeof obj !== 'object') return results;
    
    // Check if current object looks like a product (has price and some ID)
    const hasPrice = obj.price !== undefined || obj.precio !== undefined || obj.priceEur !== undefined;
    const hasId = obj.id !== undefined || obj.sku !== undefined || obj.productId !== undefined || obj.code !== undefined;
    
    if (hasPrice && hasId && !Array.isArray(obj)) {
        results.push(obj);
        return results;
    }
    
    // Otherwise, recurse into its properties
    for (const key of Object.keys(obj)) {
        flattenProducts(obj[key], results);
    }
    return results;
}

async function writeAuditLog(uid, event, metadata = {}) {
    try {
        const db = admin.database();
        const logRef = db.ref('auditLog').push();
        await logRef.set({
            uid,
            event,
            timestamp: Date.now(),
            timestampISO: new Date().toISOString(),
            ...metadata
        });
    } catch (err) {
        console.error('[AuditLog] Failed to write:', err.message);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN HANDLER
// ─────────────────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ code: 'functions/invalid-argument', message: 'Method Not Allowed' });
    }

    const reqId = `co_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
    
    try {
        // ── 0. Auth ───────────────────────────────────────────────────────────
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ code: 'functions/unauthenticated', message: 'Debes estar autenticado para realizar esta acción.' });
        }
        
        const token = authHeader.split('Bearer ')[1];
        let decodedToken;
        try {
            decodedToken = await admin.auth().verifyIdToken(token);
        } catch (e) {
            return res.status(401).json({ code: 'functions/unauthenticated', message: 'Token inválido o expirado.' });
        }
        const uid = decodedToken.uid;
        console.log(`[${reqId}] processCheckoutTotal START — uid: ${uid}`);

        // ── 1. Input validation ───────────────────────────────────────────────
        const { cartItems, addressId, paymentMethod, couponId, promoCode } = req.body;

        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            return res.status(400).json({ code: 'functions/invalid-argument', message: 'El carrito está vacío.' });
        }
        if (cartItems.length > 50) {
            return res.status(400).json({ code: 'functions/invalid-argument', message: 'Demasiados artículos en el carrito.' });
        }
        if (!addressId || typeof addressId !== 'string') {
            return res.status(400).json({ code: 'functions/invalid-argument', message: 'Dirección de envío requerida.' });
        }
        if (!paymentMethod || !ALLOWED_PAYMENT_METHODS.includes(paymentMethod)) {
            return res.status(400).json({ code: 'functions/invalid-argument', message: `Método de pago no válido: ${paymentMethod}` });
        }

        const normalizedItems = [];
        for (const item of cartItems) {
            const rawId = item.productId || item.id || item.sku;
            const resolvedId = rawId ? String(rawId).trim() : null;

            if (!resolvedId) {
                console.log('[Checkout] Invalid product ID received:', item);
                return res.status(400).json({ code: 'functions/invalid-argument', message: `ID de producto inválido.` });
            }
            const qty = parseInt(item.qty, 10);
            if (isNaN(qty) || qty < 1 || qty > 20) {
                return res.status(400).json({ code: 'functions/invalid-argument', message: `Cantidad inválida para producto.` });
            }
            normalizedItems.push({ ...item, productId: resolvedId, qty });
        }

        const db = admin.database();

        // ── 2. Fetch user's address ────────────────────────
        const addrSnap = await db.ref(`users/${uid}/addresses/${sanitizeString(addressId, 100)}`).once('value');
        if (!addrSnap.exists()) {
            return res.status(404).json({ code: 'functions/not-found', message: 'Dirección no encontrada. Por favor, selecciona una dirección válida.' });
        }
        const shippingAddress = addrSnap.val();

        // ── 3. Fetch REAL prices from database ────────────────────────────────
        // Fetch ROOT of DB to see all available root nodes
        const rootSnap = await db.ref('/').once('value');
        const rootData = rootSnap.val() || {};
        const rootKeys = Object.keys(rootData);
        console.log(`[Checkout] ROOT DB Keys:`, rootKeys);

        const productsSnap = await db.ref('products').once('value');
        const dbProducts   = productsSnap.val() || {};
        
        // If /products is empty, try flattening the entire root to find the product anywhere!
        let productsList = [];
        if (productsSnap.exists()) {
            productsList = flattenProducts(dbProducts);
        } else {
            console.log(`[Checkout] /products is empty! Flattening entire DB to find products...`);
            productsList = flattenProducts(rootData);
        }

        if (productsList.length === 0) {
            return res.status(412).json({ code: 'functions/failed-precondition', message: 'El catálogo de productos no está disponible o no se encontraron productos válidos en la base de datos.' });
        }

        // ── 4. Calculate subtotal using SERVER prices only ────────────────────
        let originalSubtotal = 0;
        let totalShirtQty = 0;
        let accessorySubtotal = 0;
        let surchargesTotal = 0;
        let priceDifference = 0;
        const resolvedItems = [];

        for (const item of normalizedItems) {
            const searchTarget = String(item.productId).trim();

            const catalogProduct = productsList.find(p => {
                if (!p) return false;
                const pId   = p.id   !== undefined && p.id   !== null ? String(p.id).trim()   : '';
                const pSku  = p.sku  !== undefined && p.sku  !== null ? String(p.sku).trim()  : '';
                const pProd = p.productId !== undefined && p.productId !== null ? String(p.productId).trim() : '';
                const pCode = p.code !== undefined && p.code !== null ? String(p.code).trim() : '';

                return pId === searchTarget || pSku === searchTarget || pProd === searchTarget || pCode === searchTarget;
            });

            if (!catalogProduct) {
                console.log(`[Checkout] Producto no encontrado: ${searchTarget}`);
                return res.status(404).json({ 
                    code: 'functions/not-found', 
                    message: `Producto '${item.productId}' no encontrado. Nodos raíz en la base de datos: ${rootKeys.join(', ')}.` 
                });
            }

            const rawPrice = catalogProduct.price ?? catalogProduct.precio ?? catalogProduct.priceEur ?? 24.99;
            const basePrice = typeof rawPrice === 'number' ? rawPrice : parseFloat(rawPrice) || 24.99;
            
            // --- CÁLCULO DE RECARGOS (Talla, Versión, Personalización, Parches) ---
            let itemSurcharges = 0;
            const cust = item.customization || {};
            
            // 1. Recargo por Talla
            const size = (cust.size || '').toUpperCase();
            if (size === '3XL' || size === '4XL') {
                itemSurcharges += 4;
            } else if (size === '2XL') {
                itemSurcharges += 2;
            }

            // 2. Recargo por Versión
            if ((cust.version || '').toLowerCase() === 'jugador') {
                itemSurcharges += 5;
            }

            // 3. Recargo por Personalización (Nombre o Dorsal)
            if ((cust.name && cust.name.trim() !== '') || (cust.number && cust.number.trim() !== '')) {
                itemSurcharges += 4;
            }

            // 4. Recargo por Parches
            const patchesArr = Array.isArray(cust.patches) ? cust.patches : (cust.patch ? cust.patch.split(',').map(s => s.trim()) : []);
            const validPatches = patchesArr.filter(p => p && p !== 'none');
            
            if (validPatches.length > 0) {
                const espana26Keywords = ['Campeones', '26 dorado', 'fifa', 'letras'];
                const isEspana26 = validPatches.length > 1 || validPatches.some(p => espana26Keywords.includes(p)) || catalogProduct.customPatches === 'espana26';
                
                if (isEspana26) {
                    itemSurcharges += validPatches.length * 1.25;
                } else {
                    itemSurcharges += 3;
                }
            }

            const finalPrice = basePrice + itemSurcharges;
            const lineTotal = finalPrice * item.qty;
            originalSubtotal += lineTotal;

            if (item.isAccessory === true) {
                accessorySubtotal += basePrice * item.qty;
                surchargesTotal += itemSurcharges * item.qty;
            } else {
                totalShirtQty += item.qty;
                priceDifference += (basePrice - 19.90) * item.qty;
                surchargesTotal += itemSurcharges * item.qty;
            }

            resolvedItems.push({
                id:            item.productId,
                sku:           catalogProduct.sku || '',
                name:          catalogProduct.name || catalogProduct.title || item.productId,
                image:         catalogProduct.image || '',
                price:         finalPrice,
                quantity:      item.qty,
                size:          sanitizeString(item.customization?.size    || 'N/A', 10),
                version:       sanitizeString(item.customization?.version || 'aficionado', 20),
                customization: {
                    size:    sanitizeString(item.customization?.size    || 'N/A', 10),
                    version: sanitizeString(item.customization?.version || 'aficionado', 20),
                    name:    sanitizeString(item.customization?.name    || '', 50),
                    number:  sanitizeString(item.customization?.number  || '', 10),
                    patch:   sanitizeString(item.customization?.patch   || '', 150),
                    patches: Array.isArray(item.customization?.patches)
                        ? item.customization.patches.slice(0, 5).map(p => sanitizeString(p, 50))
                        : []
                }
            });
        }

        // --- CÁLCULO DE PACK AHORRO ---
        let packBasePrice = 0;
        if (totalShirtQty > 0) {
            const fullCycles = Math.floor(totalShirtQty / 5);
            const remainder = totalShirtQty % 5;
            packBasePrice = fullCycles * 85.90;
            if (remainder === 1) packBasePrice += 19.90;
            else if (remainder === 2) packBasePrice += 19.90 * 2;
            else if (remainder === 3) packBasePrice += 56.90;
            else if (remainder === 4) packBasePrice += 56.90 + 19.90;
        }

        // El subtotal es el precio del pack + la diferencia de precio (ej. si es Retro 24.90, aporta +5€) + recargos + accesorios
        let subtotal = packBasePrice + priceDifference + surchargesTotal + accessorySubtotal;
        if (totalShirtQty === 0) subtotal = originalSubtotal; // Fallback para carritos que solo tienen accesorios

        // ── 5. Shipping calculation ───────────────────────────────────────────
        const SINGLE_ITEM_SHIPPING_COST = 1.90;
        const totalQtyShipping = resolvedItems.reduce((s, i) => s + i.quantity, 0);
        const shipping = totalQtyShipping === 1 ? SINGLE_ITEM_SHIPPING_COST : 0;

        // ── 6. Apply promo code ──────────────────────
        let promoDiscount   = 0;
        let appliedPromoId  = null;

        if (promoCode && typeof promoCode === 'string') {
            const normalizedCode = promoCode.trim().toUpperCase().substring(0, 30);
            const promoSnap = await db.ref('promoCodes').orderByChild('code').equalTo(normalizedCode).once('value');

            if (promoSnap.exists()) {
                let promoId   = null;
                let promoData = null;
                promoSnap.forEach(child => { promoId = child.key; promoData = child.val(); });

                if (promoData && promoData.active === true) {
                    const totalUsed = promoData.usageCount || 0;
                    const maxUses   = promoData.maxUses;
                    if (maxUses === null || maxUses === undefined || totalUsed < maxUses) {
                        const userUsed    = (promoData.userUsages && promoData.userUsages[uid]) || 0;
                        const maxPerUser  = promoData.maxUsesPerUser || null;
                        if (maxPerUser === null || userUsed < maxPerUser) {
                            if (promoData.type === 'percentage') {
                                promoDiscount = (subtotal * promoData.value) / 100;
                            } else if (promoData.type === 'fixed') {
                                promoDiscount = Math.min(promoData.value, subtotal);
                            } else if (promoData.type === 'free_shipping') {
                                promoDiscount = shipping;
                            }
                            appliedPromoId = promoId;
                        }
                    }
                }
            }
        }

        // ── 7. Apply user coupon ─────────────────────
        let couponDiscount  = 0;
        let appliedCouponId = null;

        if (couponId && typeof couponId === 'string' && !appliedPromoId) {
            const couponSnap = await db.ref(`users/${uid}/coupons/${sanitizeString(couponId, 100)}`).once('value');

            if (couponSnap.exists()) {
                const coupon = couponSnap.val();

                if (coupon && coupon.used !== true) {
                    const totalQty    = resolvedItems.reduce((s, i) => s + i.quantity, 0);
                    const isFreeShirt = coupon.type === 'fixed' && Number(coupon.value) === 19.90;

                    if (!isFreeShirt || totalQty >= 2) {
                        if (coupon.type === 'percentage') {
                            couponDiscount = (subtotal * coupon.value) / 100;
                        } else if (coupon.type === 'fixed') {
                            couponDiscount = Math.min(coupon.value, subtotal);
                        }
                        appliedCouponId = couponId;
                    }
                }
            }
        }

        // ── 8. Final total calculation ────────────────────────────────────────
        const totalDiscount  = promoDiscount + couponDiscount;
        const protectionFee  = PROTECTION_FEE;
        const finalTotal     = Math.max(0, subtotal + shipping + protectionFee - totalDiscount);
        const roundedTotal   = Math.round(finalTotal * 100) / 100;

        // ── 9. Build and save order via Admin SDK ─────────────────────────────
        const orderId  = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
        const userSnap = await db.ref(`users/${uid}`).once('value');
        const userData = userSnap.val() || {};
        const totalQty = resolvedItems.reduce((s, i) => s + i.quantity, 0);

        const orderRecord = {
            orderId,
            userId:           uid,
            userEmail:        sanitizeString(decodedToken.email || '', 255),
            customerName:     sanitizeString(userData.username || 'Usuario', 100),
            customerEmail:    sanitizeString(decodedToken.email || '', 255),
            date:             new Date().toISOString(),
            dateFormatted:    new Date().toLocaleString('es-ES'),
            createdAt:        Date.now(),
            status:           'pendiente',
            trackingNumber:   null,
            items:            resolvedItems,
            subtotal:         Math.round(subtotal      * 100) / 100,
            shipping,
            protectionFee,
            promoCodeUsed:    appliedPromoId,
            promoCodeDiscount: Math.round(promoDiscount  * 100) / 100,
            couponUsed:       appliedCouponId,
            couponDiscount:   Math.round(couponDiscount * 100) / 100,
            discount:         Math.round(totalDiscount  * 100) / 100,
            total:            roundedTotal,
            shippingAddress:  shippingAddress,
            paymentMethod,
            pointsToEarn:     totalQty * 10,
            paypalLink:       paymentMethod === 'paypal'
                ? `https://www.paypal.com/paypalme/${PAYPAL_USERNAME}/${roundedTotal.toFixed(2)}`
                : null,
            _createdByServer: true
        };

        await db.ref(`ordersByUser/${uid}/${orderId}`).set(orderRecord);

        // ── 10. Increment promo usage counters ────────────────────────────────
        if (appliedPromoId) {
            const usageRef    = db.ref(`promoCodes/${appliedPromoId}/usageCount`);
            const userUseRef  = db.ref(`promoCodes/${appliedPromoId}/userUsages/${uid}`);
            const usageSnap   = await usageRef.once('value');
            await usageRef.set((usageSnap.val() || 0) + 1);
            const userUseSnap = await userUseRef.once('value');
            await userUseRef.set((userUseSnap.val() || 0) + 1);
        }

        // ── 11. Mark coupon as used ───────────────────────────────────────────
        if (appliedCouponId) {
            await db.ref(`users/${uid}/coupons/${appliedCouponId}`).update({
                used:        true,
                usedAt:      new Date().toISOString(),
                usedInOrder: orderId
            });
        }

        // ── 12. Write audit log ───────────────────────────────────────────────
        await writeAuditLog(uid, 'order_created', {
            orderId,
            total:        roundedTotal,
            paymentMethod,
            itemCount:    resolvedItems.length,
            couponUsed:   !!appliedCouponId,
            promoUsed:    !!appliedPromoId
        });

        // ── 13. Return to client ─────────────────────────────
        return res.status(200).json({
            data: {
                success:      true,
                orderId,
                orderRecord,
                total:        roundedTotal,
                paypalLink:   orderRecord.paypalLink,
                pointsToEarn: orderRecord.pointsToEarn
            }
        });

    } catch (error) {
        console.error(`[${reqId}] ERROR in checkout:`, error?.message);
        return res.status(500).json({
            code: 'functions/internal',
            message: `Error interno del servidor (Ref: ${reqId}).`
        });
    }
}

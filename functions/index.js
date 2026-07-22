/**
 * ════════════════════════════════════════════════════════════════════════════
 *  Camisetazo — Firebase Cloud Functions
 *  Security Architecture: Defense-in-Depth | Zero Trust | CISSP-grade
 * ════════════════════════════════════════════════════════════════════════════
 *
 *  HASHING: Argon2id (OWASP recommended, GPU/ASIC-resistant)
 *    - memoryCost: 65536 (64 MB) — forces GPU memory bottleneck
 *    - timeCost:   3            — 3 iterations
 *    - parallelism: 4           — 4 lanes
 *    - outputLen: 32            — 256-bit output
 *
 *  BCRYPT kept ONLY for verifying legacy hashes created before this migration.
 *  All new hashes use Argon2id exclusively.
 */

'use strict';

const functions = require('firebase-functions');
const admin     = require('firebase-admin');
const bcrypt    = require('bcryptjs');

// ─────────────────────────────────────────────────────────────────────────────
// LAZY ARGON2 LOADER
// ─────────────────────────────────────────────────────────────────────────────
// @node-rs/argon2 is a native Node addon. Loading it at the top level means
// that if it fails (wrong architecture, missing binding), ALL functions in
// this file will crash with 'internal' — including processCheckoutTotal, which
// doesn't use argon2 at all. Lazy-loading isolates the failure to password
// functions only.
let _argon2 = null;
function getArgon2() {
    if (!_argon2) {
        try {
            _argon2 = require('@node-rs/argon2');
            console.log('[Argon2] Loaded @node-rs/argon2 successfully');
        } catch (err) {
            console.error('[Argon2] FATAL: Failed to load @node-rs/argon2:', err.message);
            throw new functions.https.HttpsError(
                'internal',
                'El módulo de hashing no está disponible. Contacta al administrador.'
            );
        }
    }
    return _argon2;
}

admin.initializeApp();

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const SUPER_ADMIN_EMAIL = 'camisetazocontacto@gmail.com';

/** Argon2id parameters calibrated against GPU/ASIC attacks (OWASP 2024) */
const ARGON2_OPTIONS = {
    memoryCost:  65536, // 64 MB — kills GPU parallelism
    timeCost:    3,
    parallelism: 4,
    outputLen:   32
};

/** Strict password validation: 8+ chars, upper, lower, digit, symbol */
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>/?\\|[\]`~'"]).{8,128}$/;

/** Protection fee added to every order (tamper-proof) */
const PROTECTION_FEE = 3.00;

/** Shipping threshold — orders >= this value get free shipping */
const FREE_SHIPPING_THRESHOLD = 50.00;
const SHIPPING_COST = 4.99;

/** Allowed payment methods — server-side allowlist */
const ALLOWED_PAYMENT_METHODS = ['paypal', 'bizum', 'revolut'];

/** PayPal.me username */
const PAYPAL_USERNAME = 'camisetazo';

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Writes an immutable audit log entry using Admin SDK (bypasses RTDB rules).
 * The auditLog node has ".write: false" for clients — only the Admin SDK can write here.
 *
 * @param {string} uid      - Firebase UID (or 'anonymous')
 * @param {string} event    - Event name e.g. 'login_failed', 'order_created'
 * @param {Object} metadata - Additional context (never include raw passwords or PII)
 */
async function writeAuditLog(uid, event, metadata = {}) {
    try {
        const db     = admin.database();
        const logRef = db.ref('auditLog').push();
        await logRef.set({
            uid,
            event,
            timestamp:   Date.now(),
            timestampISO: new Date().toISOString(),
            ...metadata
        });
    } catch (err) {
        // Audit logging must never break the main flow
        console.error('[AuditLog] Failed to write:', err.message);
    }
}

/**
 * Validates that the caller has an active Firebase Auth session.
 * Throws HttpsError 'unauthenticated' if not.
 *
 * @param {Object} context - Cloud Function context
 * @returns {Object} context.auth
 */
function requireAuth(context) {
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'Debes estar autenticado para realizar esta acción.'
        );
    }
    return context.auth;
}

/**
 * Validates that the caller has admin custom claim.
 *
 * @param {Object} context - Cloud Function context
 */
function requireAdmin(context) {
    requireAuth(context);
    const callerEmail   = context.auth.token.email;
    const isCallerAdmin = context.auth.token.admin === true;
    const isSuperAdmin  = callerEmail === SUPER_ADMIN_EMAIL;
    if (!isCallerAdmin && !isSuperAdmin) {
        throw new functions.https.HttpsError(
            'permission-denied',
            'No tienes permisos de administrador.'
        );
    }
}

/**
 * Sanitizes a string input to prevent injection.
 * @param {*}      value     - Input value
 * @param {number} maxLength - Maximum allowed length
 * @returns {string}
 */
function sanitizeString(value, maxLength = 500) {
    if (value === null || value === undefined) return '';
    const str = String(value).trim();
    // Remove null bytes and control characters, escape HTML
    return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .substring(0, maxLength);
}


// ─────────────────────────────────────────────────────────────────────────────
// ██████╗ ██████╗  ██████╗ ██████╗ ██╗   ██╗ ██████╗████████╗███████╗
// ██╔══██╗██╔══██╗██╔═══██╗██╔══██╗██║   ██║██╔════╝╚══██╔══╝██╔════╝
// ██████╔╝██████╔╝██║   ██║██║  ██║██║   ██║██║        ██║   ███████╗
// ██╔═══╝ ██╔══██╗██║   ██║██║  ██║██║   ██║██║        ██║   ╚════██║
// ██║     ██║  ██║╚██████╔╝██████╔╝╚██████╔╝╚██████╗   ██║   ███████║
// ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═════╝  ╚═════╝  ╚═════╝   ╚═╝   ╚══════╝
// PRODUCTS — Admin-only RTDB writes via Admin SDK
// ─────────────────────────────────────────────────────────────────────────────

/**
 * processCheckoutTotal — THE CORE SECURITY FUNCTION
 * ──────────────────────────────────────────────────
 *
 * SECURITY MODEL (Zero Trust):
 *  1. Client sends ONLY: cartItems (productId + qty + customization), addressId, paymentMethod, couponId, promoCode
 *  2. This function fetches REAL prices from the database (never trusts client prices)
 *  3. Applies discounts server-side after validating coupons/promos
 *  4. Adds the tamper-proof protection fee
 *  5. Writes the order to RTDB using Admin SDK (bypasses client write restrictions)
 *  6. Returns orderId to client for redirect — client CANNOT modify the stored price
 *
 * PREVENTS:
 *  - C-9: Client-side price manipulation
 *  - Coupon stacking / replay attacks
 *  - Fake discount injection
 *
 * @param {Object} data
 *   @param {Array}  data.cartItems     - [{productId, qty, customization}]
 *   @param {string} data.addressId     - Selected address ID from user's profile
 *   @param {string} data.paymentMethod - 'paypal' | 'bizum' | 'revolut'
 *   @param {string} [data.couponId]    - Optional coupon ID
 *   @param {string} [data.promoCode]   - Optional promo code string
 */
exports.processCheckoutTotal = functions.https.onCall(async (data, context) => {
    // Unique request ID for log correlation
    const reqId = `co_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
    console.log(`[${reqId}] processCheckoutTotal START — uid: ${context.auth?.uid || 'UNAUTHENTICATED'}`);

    try {
        // ── 0. Auth ───────────────────────────────────────────────────────────
        const authCtx = requireAuth(context);
        const uid     = authCtx.uid;

        // ── 1. Input validation ───────────────────────────────────────────────
        const { cartItems, addressId, paymentMethod, couponId, promoCode } = data;

        console.log(`[${reqId}] Payload — items: ${Array.isArray(cartItems) ? cartItems.length : 'INVALID'}, addressId: ${addressId}, payment: ${paymentMethod}`);

        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            throw new functions.https.HttpsError('invalid-argument', 'El carrito está vacío.');
        }
        if (cartItems.length > 50) {
            throw new functions.https.HttpsError('invalid-argument', 'Demasiados artículos en el carrito.');
        }
        if (!addressId || typeof addressId !== 'string') {
            throw new functions.https.HttpsError('invalid-argument', 'Dirección de envío requerida.');
        }
        if (!paymentMethod || !ALLOWED_PAYMENT_METHODS.includes(paymentMethod)) {
            throw new functions.https.HttpsError('invalid-argument', `Método de pago no válido: ${paymentMethod}`);
        }

        // Validate and normalize each cart item
        const normalizedItems = [];
        for (const item of cartItems) {
            if (!item.productId || typeof item.productId !== 'string') {
                throw new functions.https.HttpsError('invalid-argument', `ID de producto inválido: ${JSON.stringify(item.productId)}`);
            }
            const qty = parseInt(item.qty, 10);
            if (isNaN(qty) || qty < 1 || qty > 20) {
                throw new functions.https.HttpsError('invalid-argument', `Cantidad inválida para producto ${item.productId}: ${item.qty}`);
            }
            normalizedItems.push({ ...item, qty });
        }

        const db = admin.database();

        // ── 2. Fetch user's address (verify ownership) ────────────────────────
        console.log(`[${reqId}] Fetching address: users/${uid}/addresses/${addressId}`);
        const addrSnap = await db.ref(`users/${uid}/addresses/${sanitizeString(addressId, 100)}`).once('value');
        if (!addrSnap.exists()) {
            throw new functions.https.HttpsError('not-found', 'Dirección no encontrada. Por favor, selecciona una dirección válida.');
        }
        const shippingAddress = addrSnap.val();
        console.log(`[${reqId}] Address OK`);

        // ── 3. Fetch REAL prices from database ────────────────────────────────
        console.log(`[${reqId}] Fetching products from RTDB...`);
        const productsSnap = await db.ref('products').once('value');
        const dbProducts   = productsSnap.val() || {};
        const productCount = Object.keys(dbProducts).length;
        console.log(`[${reqId}] Found ${productCount} products in RTDB`);

        if (productCount === 0) {
            console.error(`[${reqId}] CRITICAL: products node is EMPTY in RTDB. Upload products via admin panel first.`);
            throw new functions.https.HttpsError(
                'failed-precondition',
                'El catálogo de productos no está disponible. Por favor, inténtalo más tarde.'
            );
        }

        // Build a price map from DB data
        const priceMap = {};
        Object.entries(dbProducts).forEach(([id, product]) => {
            if (product && typeof product.price === 'number') {
                priceMap[id] = { price: product.price, name: product.name || id, sku: product.sku || '', image: product.image || '' };
            }
        });
        console.log(`[${reqId}] Price map built with ${Object.keys(priceMap).length} valid products`);

        // ── 4. Calculate subtotal using SERVER prices only ────────────────────
        let originalSubtotal = 0;
        let totalShirtQty = 0;
        let accessorySubtotal = 0;
        let surchargesTotal = 0;
        let priceDifference = 0;
        const resolvedItems = [];

        for (const item of normalizedItems) {
            const productData = priceMap[item.productId];
            if (!productData) {
                console.error(`[${reqId}] Product not found in RTDB: '${item.productId}'. Available keys sample: ${Object.keys(priceMap).slice(0, 5).join(', ')}`);
                throw new functions.https.HttpsError(
                    'not-found',
                    `Producto '${item.productId}' no encontrado en el catálogo. Por favor, actualiza la página.`
                );
            }

            const basePrice = typeof productData.price === 'number' ? productData.price : parseFloat(productData.price) || 24.99;
            
            // --- CÁLCULO DE RECARGOS (Talla, Versión, Personalización, Parches) ---
            let itemSurcharges = 0;
            const cust = item.customization || {};
            
            // 1. Recargo por Talla
            const size = (cust.size || '').toUpperCase();
            if (size === '3XL' || size === '4XL') {
                itemSurcharges += 2;
            } else if (size === '2XL') {
                itemSurcharges += 1;
            }

            // 2. Recargo por Versión
            if ((cust.version || '').toLowerCase() === 'jugador') {
                itemSurcharges += 5;
            }

            // 3. Recargo por Personalización (Nombre o Dorsal)
            if ((cust.name && cust.name.trim() !== '') || (cust.number && cust.number.trim() !== '')) {
                itemSurcharges += 3;
            }

            // 4. Recargo por Parches
            const patchesArr = Array.isArray(cust.patches) ? cust.patches : (cust.patch ? cust.patch.split(',').map(s => s.trim()) : []);
            const validPatches = patchesArr.filter(p => p && p !== 'none');
            
            if (validPatches.length > 0) {
                const espana26Keywords = ['Campeones', '26 dorado', 'fifa', 'letras'];
                const isEspana26 = validPatches.length > 1 || validPatches.some(p => espana26Keywords.includes(p)) || productData.customPatches === 'espana26';
                
                if (isEspana26) {
                    itemSurcharges += validPatches.length * 1.25;
                } else {
                    itemSurcharges += 2;
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
                sku:           productData.sku,
                name:          productData.name,
                image:         productData.image,
                price:         productData.price,
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

        let subtotal = packBasePrice + priceDifference + surchargesTotal + accessorySubtotal;
        if (totalShirtQty === 0) subtotal = originalSubtotal;

        console.log(`[${reqId}] Subtotal calculated: €${subtotal.toFixed(2)} (${resolvedItems.length} items)`);

        // ── 5. Shipping calculation ───────────────────────────────────────────
        const SINGLE_ITEM_SHIPPING_COST = 1.90;
        const totalQtyShipping = resolvedItems.reduce((s, i) => s + i.quantity, 0);
        const shipping = totalQtyShipping === 1 ? SINGLE_ITEM_SHIPPING_COST : 0;

        // ── 6. Apply promo code (server-side validation) ──────────────────────
        let promoDiscount   = 0;
        let appliedPromoId  = null;

        if (promoCode && typeof promoCode === 'string') {
            const normalizedCode = promoCode.trim().toUpperCase().substring(0, 30);
            console.log(`[${reqId}] Validating promo code: ${normalizedCode}`);

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
                            console.log(`[${reqId}] Promo applied: ${promoId}, discount: €${promoDiscount.toFixed(2)}`);
                        }
                    }
                }
            } else {
                console.log(`[${reqId}] Promo code not found: ${normalizedCode}`);
            }
        }

        // ── 7. Apply user coupon (server-side validation) ─────────────────────
        let couponDiscount  = 0;
        let appliedCouponId = null;

        if (couponId && typeof couponId === 'string' && !appliedPromoId) {
            const couponSnap = await db.ref(`users/${uid}/coupons/${sanitizeString(couponId, 100)}`).once('value');

            if (couponSnap.exists()) {
                const coupon = couponSnap.val();

                if (coupon && coupon.used !== true) {
                    const totalQty    = resolvedItems.reduce((s, i) => s + i.quantity, 0);
                    const isFreeShirt = coupon.type === 'fixed' && Number(coupon.value) === 19.90;

                    if (isFreeShirt && totalQty < 2) {
                        console.log(`[${reqId}] Free shirt coupon skipped: only ${totalQty} item(s)`);
                    } else {
                        if (coupon.type === 'percentage') {
                            couponDiscount = (subtotal * coupon.value) / 100;
                        } else if (coupon.type === 'fixed') {
                            couponDiscount = Math.min(coupon.value, subtotal);
                        }
                        appliedCouponId = couponId;
                        console.log(`[${reqId}] Coupon applied: ${couponId}, discount: €${couponDiscount.toFixed(2)}`);
                    }
                }
            }
        }

        // ── 8. Final total calculation ────────────────────────────────────────
        const totalDiscount  = promoDiscount + couponDiscount;
        const protectionFee  = PROTECTION_FEE;
        const finalTotal     = Math.max(0, subtotal + shipping + protectionFee - totalDiscount);
        const roundedTotal   = Math.round(finalTotal * 100) / 100;
        console.log(`[${reqId}] Total: €${roundedTotal} (subtotal: €${subtotal.toFixed(2)}, shipping: €${shipping}, fee: €${protectionFee}, discount: €${totalDiscount.toFixed(2)})`);

        // ── 9. Build and save order via Admin SDK ─────────────────────────────
        const orderId  = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
        const userSnap = await db.ref(`users/${uid}`).once('value');
        const userData = userSnap.val() || {};
        const totalQty = resolvedItems.reduce((s, i) => s + i.quantity, 0);

        const orderRecord = {
            orderId,
            userId:           uid,
            userEmail:        sanitizeString(authCtx.token.email || '', 255),
            customerName:     sanitizeString(userData.username || 'Usuario', 100),
            customerEmail:    sanitizeString(authCtx.token.email || '', 255),
            date:             new Date().toISOString(),
            dateFormatted:    new Date().toLocaleString('es-ES'),
            // NOTE: Use Date.now() — admin.database.ServerValue.TIMESTAMP is only
            // valid inside a set/update call, not as a plain object value.
            createdAt:        Date.now(),
            status:           'pendiente',
            trackingNumber:   null,
            items:            resolvedItems,

            // Financial fields — written by server ONLY (Admin SDK bypasses rules)
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

        console.log(`[${reqId}] Writing order to RTDB: ordersByUser/${uid}/${orderId}`);
        await db.ref(`ordersByUser/${uid}/${orderId}`).set(orderRecord);
        console.log(`[${reqId}] Order written successfully`);

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

        console.log(`[${reqId}] processCheckoutTotal COMPLETE — orderId: ${orderId}`);

        // ── 13. Return only what the client needs ─────────────────────────────
        return {
            success:      true,
            orderId,
            total:        roundedTotal,
            paypalLink:   orderRecord.paypalLink,
            pointsToEarn: orderRecord.pointsToEarn
        };

    } catch (error) {
        // ── Error handling ─────────────────────────────────────────────────
        console.error(`[${reqId}] ERROR in processCheckoutTotal:`, error?.message);
        console.error(`[${reqId}] ERROR code:`, error?.code);
        console.error(`[${reqId}] STACK:`, error?.stack);

        // Re-throw Firebase HttpsErrors as-is (they have user-safe messages)
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }

        // Wrap any unexpected uncaught exception with a descriptive message
        throw new functions.https.HttpsError(
            'internal',
            `Error interno al procesar el pedido (ref: ${reqId}). Por favor, inténtalo de nuevo.`
        );
    }
});


/**
 * validatePromoCode — Server-side promo validation (read-only check)
 * ───────────────────────────────────────────────────────────────────
 * Replaces the client-side read of promoCodes which was readable by any
 * authenticated user (vulnerability C-8).
 *
 * Returns only the discount info — never exposes the full promo record.
 */
exports.validatePromoCode = functions.https.onCall(async (data, context) => {
    const authCtx = requireAuth(context);
    const uid     = authCtx.uid;

    const { code, cartSubtotal } = data;

    if (!code || typeof code !== 'string') {
        throw new functions.https.HttpsError('invalid-argument', 'Código requerido.');
    }

    const normalizedCode = code.trim().toUpperCase().substring(0, 30);
    if (typeof cartSubtotal !== 'number' || cartSubtotal < 0) {
        throw new functions.https.HttpsError('invalid-argument', 'Subtotal inválido.');
    }

    const db       = admin.database();
    const promoSnap = await db.ref('promoCodes').orderByChild('code').equalTo(normalizedCode).once('value');

    if (!promoSnap.exists()) {
        return { valid: false, reason: 'Código no encontrado.' };
    }

    let promoId   = null;
    let promoData = null;
    promoSnap.forEach(child => { promoId = child.key; promoData = child.val(); });

    if (!promoData || promoData.active !== true) {
        return { valid: false, reason: 'El código está inactivo.' };
    }

    const totalUsed = promoData.usageCount || 0;
    const maxUses   = promoData.maxUses;
    if (maxUses !== null && maxUses !== undefined && totalUsed >= maxUses) {
        return { valid: false, reason: 'El código ha alcanzado su límite de usos.' };
    }

    const userUsed    = (promoData.userUsages && promoData.userUsages[uid]) || 0;
    const maxPerUser  = promoData.maxUsesPerUser || null;
    if (maxPerUser !== null && userUsed >= maxPerUser) {
        return { valid: false, reason: 'Ya has utilizado este código el máximo de veces permitido.' };
    }

    let discountAmount = 0;
    if (promoData.type === 'percentage') {
        discountAmount = (cartSubtotal * promoData.value) / 100;
    } else if (promoData.type === 'fixed') {
        discountAmount = Math.min(promoData.value, cartSubtotal);
    } else if (promoData.type === 'free_shipping') {
        discountAmount = cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    }

    return {
        valid:          true,
        promoId,
        type:           promoData.type,
        discountAmount: Math.round(discountAmount * 100) / 100,
        description:    promoData.description || ''
    };
});


// ─────────────────────────────────────────────────────────────────────────────
// PASSWORD HASHING (Argon2id — OWASP 2024 recommended)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * setBackupPassword — Hashes password with Argon2id and stores in RTDB
 * ─────────────────────────────────────────────────────────────────────
 * Upgraded from bcrypt (cost 12) → Argon2id with 64MB memory cost.
 * Argon2id is resistant to GPU and ASIC attacks unlike bcrypt.
 */
exports.setBackupPassword = functions.https.onCall(async (data, context) => {
    requireAuth(context);

    const { password } = data;

    if (!password || typeof password !== 'string') {
        throw new functions.https.HttpsError('invalid-argument', 'La contraseña es requerida.');
    }

    // Strict length bounds to prevent DoS via hashing
    if (password.length < 8 || password.length > 128) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'La contraseña debe tener entre 8 y 128 caracteres.'
        );
    }

    if (!PASSWORD_REGEX.test(password)) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'La contraseña no cumple los requisitos: mínimo 8 caracteres, mayúscula, minúscula, número y símbolo.'
        );
    }

    try {
        // Argon2id — GPU/ASIC resistant hashing (lazy-loaded)
        const a2 = getArgon2();
        const passwordHash = await a2.hash(password, ARGON2_OPTIONS);

        const uid = context.auth.uid;
        const db  = admin.database();

        await db.ref(`users/${uid}/security`).update({
            hasBackupPassword:       true,
            backupPasswordHash:      passwordHash,
            hashAlgorithm:           'argon2id',
            backupPasswordUpdatedAt: new Date().toISOString(),
            backupPasswordProvider:  'manual'
        });

        await writeAuditLog(uid, 'backup_password_set', { hashAlgorithm: 'argon2id' });

        return { success: true, message: 'Contraseña de respaldo configurada correctamente.' };

    } catch (error) {
        console.error('[setBackupPassword]', error.message);
        throw new functions.https.HttpsError('internal', 'Error al guardar la contraseña. Inténtalo de nuevo.');
    }
});


/**
 * checkBackupPasswordStatus — Boolean check only, no sensitive data returned
 */
exports.checkBackupPasswordStatus = functions.https.onCall(async (data, context) => {
    if (!context.auth) return { hasBackupPassword: false };

    try {
        const uid      = context.auth.uid;
        const snapshot = await admin.database().ref(`users/${uid}/security/hasBackupPassword`).once('value');
        return { hasBackupPassword: snapshot.val() === true };
    } catch (error) {
        console.error('[checkBackupPasswordStatus]', error.message);
        return { hasBackupPassword: false };
    }
});


/**
 * verifyBackupPassword — Timing-safe comparison using Argon2id or bcrypt legacy
 * ──────────────────────────────────────────────────────────────────────────────
 * Detects hash algorithm from stored hash prefix:
 *   $argon2id → verify with argon2
 *   $2b$      → verify with bcrypt (legacy migration path)
 */
exports.verifyBackupPassword = functions.https.onCall(async (data, context) => {
    requireAuth(context);

    const { password } = data;

    if (!password || typeof password !== 'string') {
        throw new functions.https.HttpsError('invalid-argument', 'Contraseña requerida.');
    }
    if (password.length > 128) {
        throw new functions.https.HttpsError('invalid-argument', 'Contraseña demasiado larga.');
    }

    try {
        const uid          = context.auth.uid;
        const snapshot     = await admin.database().ref(`users/${uid}/security`).once('value');
        const securityData = snapshot.val();

        if (!securityData?.hasBackupPassword || !securityData.backupPasswordHash) {
            throw new functions.https.HttpsError('not-found', 'No tienes contraseña de respaldo configurada.');
        }

        const storedHash = securityData.backupPasswordHash;
        let isValid      = false;

        if (storedHash.startsWith('$argon2')) {
            isValid = await argon2.verify(storedHash, password);
        } else if (storedHash.startsWith('$2b$') || storedHash.startsWith('$2a$')) {
            // Legacy bcrypt hash — verify and upgrade to Argon2id
            isValid = await bcrypt.compare(password, storedHash);
            if (isValid) {
                // Upgrade hash silently
                const newHash = await argon2.hash(password, ARGON2_OPTIONS);
                await admin.database().ref(`users/${uid}/security`).update({
                    backupPasswordHash: newHash,
                    hashAlgorithm:      'argon2id',
                    hashUpgradedAt:     new Date().toISOString()
                });
                console.log(`[verifyBackupPassword] Hash upgraded to Argon2id for UID: ${uid}`);
            }
        }

        return { isValid };

    } catch (error) {
        if (error instanceof functions.https.HttpsError) throw error;
        console.error('[verifyBackupPassword]', error.message);
        throw new functions.https.HttpsError('internal', 'Error de verificación.');
    }
});


// ─────────────────────────────────────────────────────────────────────────────
// ADMIN MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

exports.setAdminByEmail = functions.https.onCall(async (data, context) => {
    requireAdmin(context);

    const email = sanitizeString(data.email, 255);
    if (!email) throw new functions.https.HttpsError('invalid-argument', 'Email requerido.');

    try {
        const user = await admin.auth().getUserByEmail(email);
        await admin.auth().setCustomUserClaims(user.uid, { admin: true });
        await writeAuditLog(context.auth.uid, 'admin_granted', { targetEmail: email, targetUid: user.uid });
        return { success: true, message: `Usuario ${email} ahora es administrador`, uid: user.uid };
    } catch (error) {
        console.error('[setAdminByEmail]', error.message);
        throw new functions.https.HttpsError('internal', error.message);
    }
});

exports.setAdminByUID = functions.https.onCall(async (data, context) => {
    requireAdmin(context);

    const uid = sanitizeString(data.uid, 128);
    if (!uid) throw new functions.https.HttpsError('invalid-argument', 'UID requerido.');

    try {
        const user = await admin.auth().getUser(uid);
        await admin.auth().setCustomUserClaims(uid, { admin: true });
        await writeAuditLog(context.auth.uid, 'admin_granted', { targetUid: uid });
        return { success: true, message: `Usuario ${user.email || uid} ahora es administrador`, uid };
    } catch (error) {
        console.error('[setAdminByUID]', error.message);
        throw new functions.https.HttpsError('internal', error.message);
    }
});

exports.removeAdmin = functions.https.onCall(async (data, context) => {
    requireAuth(context);
    if (context.auth.token.email !== SUPER_ADMIN_EMAIL) {
        throw new functions.https.HttpsError('permission-denied', 'Solo el super admin puede quitar administradores.');
    }

    const email = sanitizeString(data.email, 255);
    const uid   = sanitizeString(data.uid, 128);

    if (!email && !uid) throw new functions.https.HttpsError('invalid-argument', 'Email o UID requerido.');

    try {
        const targetUser = email
            ? await admin.auth().getUserByEmail(email)
            : await admin.auth().getUser(uid);

        if (targetUser.email === SUPER_ADMIN_EMAIL) {
            throw new functions.https.HttpsError('failed-precondition', 'No puedes quitarte los permisos de super admin.');
        }

        await admin.auth().setCustomUserClaims(targetUser.uid, { admin: false });
        await writeAuditLog(context.auth.uid, 'admin_revoked', { targetUid: targetUser.uid });
        return { success: true, message: `Permisos de admin removidos de ${targetUser.email}`, uid: targetUser.uid };
    } catch (error) {
        if (error instanceof functions.https.HttpsError) throw error;
        console.error('[removeAdmin]', error.message);
        throw new functions.https.HttpsError('internal', error.message);
    }
});

exports.checkAdmin = functions.https.onCall(async (data, context) => {
    if (!context.auth) return { isAdmin: false };
    return {
        isAdmin: context.auth.token.admin === true,
        email:   context.auth.token.email,
        uid:     context.auth.uid
    };
});


/**
 * logAuditEvent — Client-triggered audit event (limited metadata)
 * ─────────────────────────────────────────────────────────────────
 * Used by the frontend for security events the client can detect:
 * login attempts, session anomalies, etc. Admin SDK writes bypass
 * the RTDB ".write: false" rule on auditLog.
 */
exports.logAuditEvent = functions.https.onCall(async (data, context) => {
    const uid   = context.auth ? context.auth.uid : 'anonymous';
    const event = sanitizeString(data.event || 'unknown', 100);

    // Allowlist of events that clients are allowed to log
    const ALLOWED_CLIENT_EVENTS = [
        'login_attempt_failed',
        'login_success',
        'logout',
        'session_anomaly_detected',
        'password_reset_requested',
        'registration_attempt'
    ];

    if (!ALLOWED_CLIENT_EVENTS.includes(event)) {
        // Silently ignore disallowed events — don't error out
        return { logged: false };
    }

    await writeAuditLog(uid, event, {
        userAgent: sanitizeString(data.userAgent || '', 200),
        source:    'client'
    });

    return { logged: true };
});

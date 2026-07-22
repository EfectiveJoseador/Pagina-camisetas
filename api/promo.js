import admin from './utils/firebase-admin.js';

const FREE_SHIPPING_THRESHOLD = 50.00;
const SHIPPING_COST = 4.99;

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ code: 'functions/invalid-argument', message: 'Method Not Allowed' });
    }

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ code: 'functions/unauthenticated', message: 'Debes estar autenticado.' });
        }
        
        const token = authHeader.split('Bearer ')[1];
        let decodedToken;
        try {
            decodedToken = await admin.auth().verifyIdToken(token);
        } catch (e) {
            return res.status(401).json({ code: 'functions/unauthenticated', message: 'Token inválido o expirado.' });
        }
        const uid = decodedToken.uid;

        const { code, cartSubtotal } = req.body;

        if (!code || typeof code !== 'string') {
            return res.status(400).json({ code: 'functions/invalid-argument', message: 'Código requerido.' });
        }

        const normalizedCode = code.trim().toUpperCase().substring(0, 30);
        if (typeof cartSubtotal !== 'number' || cartSubtotal < 0) {
            return res.status(400).json({ code: 'functions/invalid-argument', message: 'Subtotal inválido.' });
        }

        const db = admin.database();
        const promoSnap = await db.ref('promoCodes').orderByChild('code').equalTo(normalizedCode).once('value');

        if (!promoSnap.exists()) {
            return res.status(200).json({ data: { valid: false, reason: 'Código no encontrado.' } });
        }

        let promoId = null;
        let promoData = null;
        promoSnap.forEach(child => { promoId = child.key; promoData = child.val(); });

        if (!promoData || promoData.active !== true) {
            return res.status(200).json({ data: { valid: false, reason: 'El código está inactivo.' } });
        }

        const totalUsed = promoData.usageCount || 0;
        const maxUses   = promoData.maxUses;
        if (maxUses !== null && maxUses !== undefined && totalUsed >= maxUses) {
            return res.status(200).json({ data: { valid: false, reason: 'El código ha alcanzado su límite de usos.' } });
        }

        const userUsed    = (promoData.userUsages && promoData.userUsages[uid]) || 0;
        const maxPerUser  = promoData.maxUsesPerUser || null;
        if (maxPerUser !== null && userUsed >= maxPerUser) {
            return res.status(200).json({ data: { valid: false, reason: 'Ya has utilizado este código el máximo de veces permitido.' } });
        }

        let discountAmount = 0;
        if (promoData.type === 'percentage') {
            discountAmount = (cartSubtotal * promoData.value) / 100;
        } else if (promoData.type === 'fixed') {
            discountAmount = Math.min(promoData.value, cartSubtotal);
        } else if (promoData.type === 'free_shipping') {
            discountAmount = cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
        }

        return res.status(200).json({
            data: {
                valid: true,
                code: normalizedCode,
                id: promoId,
                type: promoData.type,
                value: promoData.value,
                discountAmount: Math.round(discountAmount * 100) / 100
            }
        });

    } catch (error) {
        console.error('ERROR in promo validation:', error);
        return res.status(500).json({ code: 'functions/internal', message: 'Error interno del servidor.' });
    }
}

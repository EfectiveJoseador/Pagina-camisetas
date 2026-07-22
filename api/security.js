import admin from './utils/firebase-admin.js';
import bcrypt from 'bcryptjs';

// Lazy loading for native modules in Vercel to prevent complete crash if missing
let argon2;
try {
    argon2 = require('@node-rs/argon2');
} catch (e) {
    console.error('[Vercel] @node-rs/argon2 failed to load. Will fallback to bcrypt if needed.', e.message);
}

const ARGON2_OPTIONS = {
    memoryCost:  65536,
    timeCost:    3,
    parallelism: 4,
    outputLen:   32
};

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>/?\\|[\]`~'"]).{8,128}$/;

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

        const { action, password } = req.body;

        if (action === 'checkBackupPasswordStatus') {
            const snapshot = await admin.database().ref(`users/${uid}/security/hasBackupPassword`).once('value');
            return res.status(200).json({ data: { hasBackupPassword: snapshot.val() === true } });
        }

        if (action === 'setBackupPassword') {
            if (!password || typeof password !== 'string') {
                return res.status(400).json({ code: 'functions/invalid-argument', message: 'La contraseña es requerida.' });
            }
            if (password.length < 8 || password.length > 128) {
                return res.status(400).json({ code: 'functions/invalid-argument', message: 'La contraseña debe tener entre 8 y 128 caracteres.' });
            }
            if (!PASSWORD_REGEX.test(password)) {
                return res.status(400).json({ code: 'functions/invalid-argument', message: 'La contraseña no cumple los requisitos.' });
            }

            let passwordHash;
            let hashAlgorithm;

            if (argon2) {
                passwordHash = await argon2.hash(password, ARGON2_OPTIONS);
                hashAlgorithm = 'argon2id';
            } else {
                // Fallback to bcrypt if Argon2 native module fails on Vercel
                passwordHash = await bcrypt.hash(password, 12);
                hashAlgorithm = 'bcrypt';
            }

            await admin.database().ref(`users/${uid}/security`).update({
                hasBackupPassword:       true,
                backupPasswordHash:      passwordHash,
                hashAlgorithm:           hashAlgorithm,
                backupPasswordUpdatedAt: new Date().toISOString(),
                backupPasswordProvider:  'manual'
            });

            await writeAuditLog(uid, 'backup_password_set', { hashAlgorithm });
            return res.status(200).json({ data: { success: true, message: 'Contraseña de respaldo configurada correctamente.' } });
        }

        if (action === 'verifyBackupPassword') {
            if (!password || typeof password !== 'string') {
                return res.status(400).json({ code: 'functions/invalid-argument', message: 'Contraseña requerida.' });
            }
            if (password.length > 128) {
                return res.status(400).json({ code: 'functions/invalid-argument', message: 'Contraseña demasiado larga.' });
            }

            const snapshot     = await admin.database().ref(`users/${uid}/security`).once('value');
            const securityData = snapshot.val();

            if (!securityData?.hasBackupPassword || !securityData.backupPasswordHash) {
                return res.status(404).json({ code: 'functions/not-found', message: 'No tienes contraseña de respaldo configurada.' });
            }

            const storedHash = securityData.backupPasswordHash;
            let isValid      = false;

            if (storedHash.startsWith('$argon2')) {
                if (argon2) {
                    isValid = await argon2.verify(storedHash, password);
                } else {
                    return res.status(500).json({ code: 'functions/internal', message: 'Servicio de verificación no disponible (Argon2 missing).' });
                }
            } else if (storedHash.startsWith('$2b$') || storedHash.startsWith('$2a$')) {
                isValid = await bcrypt.compare(password, storedHash);
                if (isValid && argon2) {
                    const newHash = await argon2.hash(password, ARGON2_OPTIONS);
                    await admin.database().ref(`users/${uid}/security`).update({
                        backupPasswordHash: newHash,
                        hashAlgorithm:      'argon2id',
                        hashUpgradedAt:     new Date().toISOString()
                    });
                }
            }

            return res.status(200).json({ data: { isValid } });
        }

        if (action === 'logAuditEvent') {
            const { event, metadata } = req.body;
            await writeAuditLog(uid, event || 'unknown_event', metadata || {});
            return res.status(200).json({ data: { success: true } });
        }

        return res.status(400).json({ code: 'functions/invalid-argument', message: 'Acción desconocida.' });

    } catch (error) {
        console.error('ERROR in security api:', error);
        return res.status(500).json({ code: 'functions/internal', message: 'Error interno del servidor.' });
    }
}



const functions = require('firebase-functions');
const admin = require('firebase-admin');


admin.initializeApp();




const SUPER_ADMIN_EMAIL = 'camisetazocontacto@gmail.com';




exports.setAdminByEmail = functions.https.onCall(async (data, context) => {
    
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Debes estar autenticado');
    }

    
    const callerEmail = context.auth.token.email;
    const isCallerAdmin = context.auth.token.admin === true;
    const isSuperAdmin = callerEmail === SUPER_ADMIN_EMAIL;

    if (!isCallerAdmin && !isSuperAdmin) {
        throw new functions.https.HttpsError('permission-denied', 'No tienes permisos de administrador');
    }

    const email = data.email;
    if (!email) {
        throw new functions.https.HttpsError('invalid-argument', 'Email requerido');
    }

    try {
        
        const user = await admin.auth().getUserByEmail(email);

        
        await admin.auth().setCustomUserClaims(user.uid, { admin: true });



        return {
            success: true,
            message: `Usuario ${email} ahora es administrador`,
            uid: user.uid
        };
    } catch (error) {
        console.error('Error asignando admin:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});




exports.setAdminByUID = functions.https.onCall(async (data, context) => {
    
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Debes estar autenticado');
    }

    const callerEmail = context.auth.token.email;
    const isCallerAdmin = context.auth.token.admin === true;
    const isSuperAdmin = callerEmail === SUPER_ADMIN_EMAIL;

    if (!isCallerAdmin && !isSuperAdmin) {
        throw new functions.https.HttpsError('permission-denied', 'No tienes permisos de administrador');
    }

    const uid = data.uid;
    if (!uid) {
        throw new functions.https.HttpsError('invalid-argument', 'UID requerido');
    }

    try {
        
        const user = await admin.auth().getUser(uid);

        
        await admin.auth().setCustomUserClaims(uid, { admin: true });



        return {
            success: true,
            message: `Usuario ${user.email || uid} ahora es administrador`,
            uid: uid
        };
    } catch (error) {
        console.error('Error asignando admin por UID:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});




exports.removeAdmin = functions.https.onCall(async (data, context) => {
    
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Debes estar autenticado');
    }

    const callerEmail = context.auth.token.email;
    const isSuperAdmin = callerEmail === SUPER_ADMIN_EMAIL;

    
    if (!isSuperAdmin) {
        throw new functions.https.HttpsError('permission-denied', 'Solo el super admin puede quitar administradores');
    }

    const email = data.email;
    const uid = data.uid;

    if (!email && !uid) {
        throw new functions.https.HttpsError('invalid-argument', 'Email o UID requerido');
    }

    try {
        let targetUser;

        if (email) {
            targetUser = await admin.auth().getUserByEmail(email);
        } else {
            targetUser = await admin.auth().getUser(uid);
        }

        
        if (targetUser.email === SUPER_ADMIN_EMAIL) {
            throw new functions.https.HttpsError('failed-precondition', 'No puedes quitarte los permisos de super admin');
        }

        
        await admin.auth().setCustomUserClaims(targetUser.uid, { admin: false });



        return {
            success: true,
            message: `Permisos de admin removidos de ${targetUser.email}`,
            uid: targetUser.uid
        };
    } catch (error) {
        console.error('Error removiendo admin:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});




exports.checkAdmin = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        return { isAdmin: false };
    }

    return {
        isAdmin: context.auth.token.admin === true,
        email: context.auth.token.email,
        uid: context.auth.uid
    };
});



// ─────────────────────────────────────────────────────────────────────────────
// FUNCIONES DE CONTRASEÑA DE RESPALDO (GOOGLE SIGN-IN)
// ─────────────────────────────────────────────────────────────────────────────

const bcrypt = require('bcryptjs');

/**
 * Expresión regular para validar la fortaleza de la contraseña.
 * Requisitos: mínimo 8 caracteres, una mayúscula, una minúscula,
 * un número y un carácter especial.
 */
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

/**
 * setBackupPassword
 * ─────────────────
 * Recibe la contraseña en texto plano, la valida, la hashea con bcryptjs
 * (salt automático, cost factor 12) y la guarda en Realtime Database.
 *
 * SEGURIDAD:
 *  - Solo accesible si el usuario está autenticado (context.auth lo verifica).
 *  - El hash NUNCA se devuelve al cliente.
 *  - La validación se realiza también en backend (defensa en profundidad).
 *  - Cost factor 12 de bcrypt: ~300ms por hash, suficientemente lento para
 *    resistir ataques de fuerza bruta si la BD fuese comprometida.
 */
exports.setBackupPassword = functions.https.onCall(async (data, context) => {
    // 1. Verificar que el usuario esté autenticado
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'Debes iniciar sesión con Google antes de configurar la contraseña.'
        );
    }

    const { password } = data;

    // 2. Validar que se recibió la contraseña
    if (!password || typeof password !== 'string') {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'La contraseña es requerida.'
        );
    }

    // 3. Validar la fortaleza de la contraseña en el backend
    if (!PASSWORD_REGEX.test(password)) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'La contraseña no cumple los requisitos de seguridad: mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo especial.'
        );
    }

    // 4. Limitar longitud máxima para evitar ataques DoS con bcrypt
    if (password.length > 72) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'La contraseña no puede superar los 72 caracteres.'
        );
    }

    try {
        // 5. Hashear la contraseña con salt automático (cost factor 12)
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 6. Guardar en Realtime Database:
        //    - SOLO se guarda el hash, NUNCA la contraseña en texto plano
        //    - hasBackupPassword: flag rápido de consulta sin exponer el hash
        const uid = context.auth.uid;
        const db = admin.database();
        const userRef = db.ref(`users/${uid}/security`);

        await userRef.update({
            hasBackupPassword: true,
            backupPasswordHash: passwordHash,
            backupPasswordUpdatedAt: new Date().toISOString(),
            backupPasswordProvider: 'manual'
        });

        console.log(`[setBackupPassword] Contraseña de respaldo configurada para UID: ${uid}`);

        // 7. Retornar solo confirmación (NUNCA el hash)
        return {
            success: true,
            message: 'Contraseña de respaldo configurada correctamente.'
        };

    } catch (error) {
        // No exponer detalles técnicos al cliente
        console.error('[setBackupPassword] Error interno:', error);
        throw new functions.https.HttpsError(
            'internal',
            'Error al guardar la contraseña. Inténtalo de nuevo.'
        );
    }
});


/**
 * checkBackupPasswordStatus
 * ─────────────────────────
 * Verifica si el usuario autenticado ya tiene una contraseña de respaldo
 * configurada. Devuelve solo un booleano, nunca datos sensibles.
 */
exports.checkBackupPasswordStatus = functions.https.onCall(async (data, context) => {
    // Verificar autenticación
    if (!context.auth) {
        return { hasBackupPassword: false };
    }

    try {
        const uid = context.auth.uid;
        const db = admin.database();
        const snapshot = await db.ref(`users/${uid}/security/hasBackupPassword`).once('value');

        return {
            hasBackupPassword: snapshot.val() === true
        };
    } catch (error) {
        console.error('[checkBackupPasswordStatus] Error:', error);
        return { hasBackupPassword: false };
    }
});


/**
 * verifyBackupPassword
 * ────────────────────
 * Verifica una contraseña de respaldo ingresada contra el hash almacenado.
 * Útil para flujos futuros de login con email+contraseña de respaldo.
 *
 * NOTA: Esta función es un placeholder para uso futuro. Actualmente
 * el login es exclusivamente vía Google + contraseña de respaldo como método
 * de seguridad adicional, no como login principal.
 */
exports.verifyBackupPassword = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'No autenticado.');
    }

    const { password } = data;
    if (!password || typeof password !== 'string') {
        throw new functions.https.HttpsError('invalid-argument', 'Contraseña requerida.');
    }

    try {
        const uid = context.auth.uid;
        const db = admin.database();
        const snapshot = await db.ref(`users/${uid}/security`).once('value');
        const securityData = snapshot.val();

        if (!securityData || !securityData.hasBackupPassword || !securityData.backupPasswordHash) {
            throw new functions.https.HttpsError(
                'not-found',
                'No tienes contraseña de respaldo configurada.'
            );
        }

        // Comparar usando bcrypt.compare (timing-safe)
        const isValid = await bcrypt.compare(password, securityData.backupPasswordHash);

        return { isValid };

    } catch (error) {
        if (error instanceof functions.https.HttpsError) throw error;
        console.error('[verifyBackupPassword] Error:', error);
        throw new functions.https.HttpsError('internal', 'Error de verificación.');
    }
});


// End of file

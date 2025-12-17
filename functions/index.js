

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





exports.initSuperAdmin = functions.https.onRequest(async (req, res) => {
    
    
    const secretKey = req.query.key;

    if (secretKey !== 'CAMISETAZO_INIT_2024') {
        res.status(403).send('Acceso denegado');
        return;
    }

    try {
        const user = await admin.auth().getUserByEmail(SUPER_ADMIN_EMAIL);
        await admin.auth().setCustomUserClaims(user.uid, { admin: true });

        res.status(200).send(`✅ Super admin configurado: ${SUPER_ADMIN_EMAIL}`);
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});

import {
    auth,
    db,
    googleProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    signInWithPopup,
    sendPasswordResetEmail,
    sendEmailVerification,
    updateProfile,
    RecaptchaVerifier,
    EmailAuthProvider,
    linkWithCredential,
    fetchSignInMethodsForEmail,
    ref,
    set,
    get,
    update
} from './firebase-config.js';
import { sanitizeInput, isValidEmail, checkRateLimit, getRemainingAttempts } from './security.js';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────────────────────
const LOGIN_RATE_LIMIT_KEY  = 'login_attempts';
const MAX_LOGIN_ATTEMPTS    = 5;
const RATE_LIMIT_WINDOW_MS  = 300000; // 5 minutos

/**
 * Regex de validación de contraseña — mínimo 8 chars, mayúscula, minúscula,
 * número y símbolo especial. Mismos requisitos mostrados en el modal.
 */
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>/?\\|[\]`~'"]).{8,}$/;


// ─────────────────────────────────────────────────────────────────────────────
// HELPERS DE REDIRECCIÓN Y ERRORES
// ─────────────────────────────────────────────────────────────────────────────
const urlParams     = new URLSearchParams(window.location.search);
const redirectParam = urlParams.get('redirect');

function getRedirectUrl(isAdmin) {
    if (isAdmin)                      return '/pages/admin.html';
    if (redirectParam === 'checkout') return '/pages/checkout.html';
    return '/pages/perfil.html';
}

function mapAuthError(code) {
    switch (code) {
        case 'auth/email-already-in-use':    return 'Este email ya está registrado.';
        case 'auth/invalid-email':           return 'El email no es válido.';
        case 'auth/operation-not-allowed':   return 'Operación no permitida. Contacta soporte.';
        case 'auth/weak-password':           return 'La contraseña es muy débil (mínimo 6 caracteres).';
        case 'auth/user-disabled':           return 'Esta cuenta ha sido deshabilitada.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':      return 'Email o contraseña incorrectos.';
        case 'auth/too-many-requests':       return 'Demasiados intentos. Inténtalo en unos minutos.';
        case 'auth/network-request-failed':  return 'Error de conexión. Verifica tu internet.';
        case 'auth/popup-closed-by-user':    return 'Ventana de Google cerrada. Inténtalo de nuevo.';
        case 'auth/popup-blocked':           return 'El navegador bloqueó la ventana de Google. Permite popups para este sitio.';
        case 'auth/cancelled-popup-request': return 'Operación cancelada.';
        case 'auth/provider-already-linked': return 'Ya tienes una contraseña de respaldo configurada.';
        case 'auth/credential-already-in-use': return 'Esta contraseña ya está asociada a otra cuenta.';
        case 'auth/requires-recent-login':   return 'Por seguridad, vuelve a iniciar sesión con Google e inténtalo de nuevo.';
        default:                             return 'Ocurrió un error. Inténtalo de nuevo.';
    }
}

function showError(elementId, message, isSuccess = false) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent   = message;
        el.style.display = 'block';
        el.style.color   = isSuccess ? '#22c55e' : '#ef4444';
        if (isSuccess) {
            el.style.backgroundColor = '#f0fdf4';
            el.style.borderColor     = '#86efac';
        } else {
            el.style.backgroundColor = '';
            el.style.borderColor     = '';
        }
    } else {
        alert(message);
    }
}

function clearError(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent   = '';
        el.style.display = 'none';
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// COMPROBACIÓN DE CONTRASEÑA DE RESPALDO
// Usa providerData de Firebase Auth — NO requiere Cloud Functions ni Blaze
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Verifica si el usuario ya tiene un método email+contraseña vinculado
 * a su cuenta de Google. Esto sirve como "contraseña de respaldo".
 *
 * Firebase guarda en user.providerData todos los proveedores vinculados.
 * Si hay uno con providerId === 'password', ya tiene contraseña de respaldo.
 *
 * @param {import('firebase/auth').User} user
 * @returns {boolean}
 */
function hasBackupPassword(user) {
    if (!user || !user.providerData) return false;
    return user.providerData.some(provider => provider.providerId === 'password');
}


// ─────────────────────────────────────────────────────────────────────────────
// MODAL DE CONTRASEÑA DE RESPALDO
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Muestra el modal y bloquea el scroll.
 */
function showBackupPasswordModal() {
    const modal = document.getElementById('modal-backup-password');
    if (!modal) return;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        document.getElementById('backup-password-input')?.focus();
    }, 300);
}

/**
 * Oculta el modal con animación de salida y restaura el scroll.
 */
function hideBackupPasswordModal() {
    const modal = document.getElementById('modal-backup-password');
    if (!modal) return;
    modal.classList.add('backup-modal-closing');
    setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove('backup-modal-closing');
        document.body.style.overflow = '';
    }, 300);
}

/**
 * Calcula la fortaleza de la contraseña (0–5).
 * @param {string} pw
 * @returns {number}
 */
function calcPasswordStrength(pw) {
    let score = 0;
    if (pw.length >= 8)  score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/\d/.test(pw))    score++;
    if (/[!@#$%^&*()\-_=+{};:,<.>/?\\|[\]`~'"]/.test(pw)) score++;
    return Math.min(score, 5);
}

/**
 * Actualiza los indicadores visuales de requisitos y la barra de fortaleza.
 * Habilita o deshabilita el botón de guardar según si todos los requisitos
 * están cumplidos.
 *
 * @param {string} pw     - Contraseña principal
 * @param {string} pwConf - Confirmación de contraseña
 * @returns {boolean} true si todos los requisitos se cumplen
 */
function updatePasswordIndicators(pw, pwConf) {
    const checks = {
        'req-length': pw.length >= 8,
        'req-upper':  /[A-Z]/.test(pw),
        'req-lower':  /[a-z]/.test(pw),
        'req-number': /\d/.test(pw),
        'req-symbol': /[!@#$%^&*()\-_=+{};:,<.>/?\\|[\]`~'"]/.test(pw),
        'req-match':  pw.length > 0 && pw === pwConf,
    };

    Object.entries(checks).forEach(([id, passed]) => {
        const el  = document.getElementById(id);
        const ico = el?.querySelector('i');
        if (!el) return;
        el.classList.toggle('passed', passed);
        el.classList.toggle('failed', !passed && pw.length > 0);
        if (ico) ico.className = passed ? 'fas fa-circle-check' : 'fas fa-circle';
    });

    // Barra de fortaleza
    const strength = calcPasswordStrength(pw);
    const fill     = document.getElementById('pw-strength-fill');
    const label    = document.getElementById('pw-strength-label');
    const levels   = [
        { pct: '0%',   color: 'transparent', text: '' },
        { pct: '20%',  color: '#ef4444',     text: '⚠️ Muy débil' },
        { pct: '40%',  color: '#f97316',     text: '🔶 Débil' },
        { pct: '60%',  color: '#eab308',     text: '🟡 Aceptable' },
        { pct: '80%',  color: '#22c55e',     text: '✅ Fuerte' },
        { pct: '100%', color: '#10b981',     text: '🔒 Muy fuerte' },
    ];
    if (fill && label && pw.length > 0) {
        fill.style.width           = levels[strength].pct;
        fill.style.backgroundColor = levels[strength].color;
        label.textContent          = levels[strength].text;
        label.style.color          = levels[strength].color;
    } else if (fill && label) {
        fill.style.width  = '0%';
        label.textContent = '';
    }

    // Habilitar/deshabilitar botón de guardar
    const allPassed = Object.values(checks).every(Boolean);
    const saveBtn   = document.getElementById('btn-save-backup-pw');
    if (saveBtn) {
        saveBtn.disabled      = !allPassed;
        saveBtn.style.opacity = allPassed ? '1' : '0.5';
        saveBtn.style.cursor  = allPassed ? 'pointer' : 'not-allowed';
    }

    return allPassed;
}

/**
 * Inicializa todos los event listeners del modal de contraseña de respaldo.
 * Debe llamarse desde DOMContentLoaded.
 */
function initBackupPasswordModal() {
    const pwInput       = document.getElementById('backup-password-input');
    const pwConfirm     = document.getElementById('backup-password-confirm');
    const form          = document.getElementById('form-backup-password');
    const btnSkip       = document.getElementById('btn-skip-backup-pw');

    if (!form) return;

    // ── Validación en tiempo real ──
    const onInput = () => {
        updatePasswordIndicators(pwInput?.value || '', pwConfirm?.value || '');
        clearError('backup-pw-error');
    };
    pwInput?.addEventListener('input', onInput);
    pwConfirm?.addEventListener('input', onInput);

    // ── Toggle mostrar/ocultar contraseña ──
    function setupToggle(btnId, iconId, inputEl) {
        document.getElementById(btnId)?.addEventListener('click', () => {
            if (!inputEl) return;
            const hidden   = inputEl.type === 'password';
            inputEl.type   = hidden ? 'text' : 'password';
            const ico = document.getElementById(iconId);
            if (ico) ico.className = hidden ? 'fas fa-eye-slash' : 'fas fa-eye';
        });
    }
    setupToggle('toggle-backup-pw',      'toggle-backup-pw-icon',     pwInput);
    setupToggle('toggle-backup-confirm', 'toggle-backup-confirm-icon', pwConfirm);

    // ── Botón "Configurar más tarde" ──
    btnSkip?.addEventListener('click', () => {
        hideBackupPasswordModal();
        setTimeout(() => { window.location.href = getRedirectUrl(false); }, 350);
    });

    // ── Envío del formulario ──
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearError('backup-pw-error');

        const pw     = pwInput?.value    || '';
        const pwConf = pwConfirm?.value  || '';

        // Validación frontend (defensa en profundidad)
        if (!PASSWORD_REGEX.test(pw)) {
            showError('backup-pw-error', 'La contraseña no cumple los requisitos de seguridad.');
            return;
        }
        if (pw !== pwConf) {
            showError('backup-pw-error', 'Las contraseñas no coinciden.');
            return;
        }

        const saveBtn     = document.getElementById('btn-save-backup-pw');
        const saveBtnSpan = saveBtn?.querySelector('span');

        if (saveBtn)     saveBtn.disabled         = true;
        if (saveBtnSpan) saveBtnSpan.textContent  = 'Guardando...';

        try {
            const user = auth.currentUser;
            if (!user) throw new Error('No hay sesión activa. Vuelve a iniciar sesión.');

            // ── ENFOQUE SIN CLOUD FUNCTIONS ──
            // linkWithCredential vincula email+contraseña como método adicional
            // a la cuenta de Google del usuario. Firebase gestiona el hash
            // internamente de forma segura (no necesitamos bcrypt propio).
            //
            // Esto permite al usuario iniciar sesión con:
            //   a) Google (método principal)
            //   b) email + contraseña de respaldo (método alternativo)
            //
            // SEGURIDAD: Firebase usa scrypt para hashear la contraseña.
            // El hash NUNCA llega al cliente.
            const credential = EmailAuthProvider.credential(user.email, pw);
            await linkWithCredential(user, credential);

            // Registrar en Realtime DB que ya tiene contraseña (solo el flag, no el hash)
            const userRef = ref(db, 'users/' + user.uid + '/security');
            await update(userRef, {
                hasBackupPassword:       true,
                backupPasswordUpdatedAt: new Date().toISOString(),
                backupPasswordProvider:  'firebase-email-link'
            });

            // Éxito
            showError('backup-pw-error', '✅ ¡Contraseña de respaldo guardada correctamente!', true);

            // Limpiar campos inmediatamente por seguridad
            if (pwInput)   pwInput.value   = '';
            if (pwConfirm) pwConfirm.value = '';

            setTimeout(() => {
                hideBackupPasswordModal();
                setTimeout(() => { window.location.href = getRedirectUrl(false); }, 350);
            }, 1500);

        } catch (error) {
            console.error('[Modal contraseña] Error:', error);

            // Error específico: ya tenía contraseña vinculada (caso extraño)
            if (error.code === 'auth/provider-already-linked') {
                showError('backup-pw-error',
                    '¡Ya tienes una contraseña configurada! Redirigiendo...',
                    true
                );
                setTimeout(() => {
                    hideBackupPasswordModal();
                    window.location.href = getRedirectUrl(false);
                }, 1500);
                return;
            }

            showError('backup-pw-error', mapAuthError(error.code) || error.message);
            if (saveBtn)     saveBtn.disabled        = false;
            if (saveBtnSpan) saveBtnSpan.textContent = 'Guardar contraseña segura';
        }
    });
}


// ─────────────────────────────────────────────────────────────────────────────
// GOOGLE SIGN-IN
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Flujo completo de Google Sign-In:
 * 1. signInWithPopup → Firebase Auth con GoogleProvider
 * 2. Crear/actualizar perfil en Realtime Database
 * 3. Comprobar si ya tiene contraseña de respaldo (via providerData)
 * 4a. Si tiene → redirigir al perfil
 * 4b. Si no tiene → mostrar modal obligatorio
 *
 * SEGURIDAD:
 *  - El token de Google NO se almacena en localStorage (Firebase usa IndexedDB)
 *  - La verificación de identidad la hace Firebase directamente
 *  - No se usan Cloud Functions → funciona en plan Spark (gratuito)
 */
async function handleGoogleSignIn() {
    const btn     = document.getElementById('btn-google-signin');
    const btnSpan = btn?.querySelector('span');
    if (!btn) return;

    btn.disabled = true;
    btn.classList.add('btn-google--loading');
    if (btnSpan) btnSpan.textContent = 'Conectando con Google...';

    try {
        // 1. Login con Google via Firebase Auth (popup)
        const result = await signInWithPopup(auth, googleProvider);
        const user   = result.user;

        console.log(`[Google Sign-In] Autenticado: ${user.email}`);

        // 2. Crear/actualizar perfil en Realtime Database
        const userRef  = ref(db, 'users/' + user.uid);
        const snapshot = await get(userRef);

        if (!snapshot.exists()) {
            await set(userRef, {
                username:   user.displayName || 'Usuario',
                email:      user.email,
                photoURL:   user.photoURL    || null,
                provider:   'google',
                createdAt:  new Date().toISOString(),
                verifiedAt: new Date().toISOString()
            });
        } else {
            await update(userRef, {
                photoURL:  user.photoURL || null,
                lastLogin: new Date().toISOString()
            });
        }

        // 3. Verificar contraseña de respaldo — SIN Cloud Functions
        //    Comprobamos user.providerData: si tiene 'password', ya configuró respaldo
        const tieneContrasena = hasBackupPassword(user);

        // 4a. Ya tiene contraseña → redirigir directamente
        if (tieneContrasena) {
            const idTokenResult = await user.getIdTokenResult(true);
            const isAdmin       = idTokenResult.claims.admin === true;
            window.location.href = getRedirectUrl(isAdmin);
            return;
        }

        // 4b. No tiene contraseña → mostrar modal obligatorio
        showBackupPasswordModal();

    } catch (error) {
        console.error('[Google Sign-In] Error:', error);

        btn.disabled = false;
        btn.classList.remove('btn-google--loading');
        if (btnSpan) btnSpan.textContent = 'Continuar con Google';

        if (error.code !== 'auth/popup-closed-by-user' &&
            error.code !== 'auth/cancelled-popup-request') {
            showError('login-error', mapAuthError(error.code));
        }
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// OBSERVADOR DE ESTADO (redirige si ya está logueado)
// ─────────────────────────────────────────────────────────────────────────────
onAuthStateChanged(auth, async (user) => {
    if (!window.location.pathname.includes('login.html')) return;

    if (user && (user.emailVerified || window.location.hostname === 'localhost')) {
        try {
            const idTokenResult = await user.getIdTokenResult(true);
            const isAdmin       = idTokenResult.claims.admin === true;
            window.location.href = getRedirectUrl(isAdmin);
        } catch (error) {
            console.error('Error comprobando estado admin:', error);
            window.location.href = getRedirectUrl(false);
        }
    }
});


// ─────────────────────────────────────────────────────────────────────────────
// INICIALIZACIÓN
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

    // ── Modal de contraseña de respaldo ──
    initBackupPasswordModal();

    // ── Botón Google Sign-In ──
    document.getElementById('btn-google-signin')
        ?.addEventListener('click', handleGoogleSignIn);

    // ── reCAPTCHA ──
    let recaptchaVerifier;
    const recaptchaContainer = document.getElementById('recaptcha-container');
    if (recaptchaContainer) {
        try {
            recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'normal',
                'callback': () => {},
                'expired-callback': () => {}
            });
            recaptchaVerifier.render();
        } catch (e) {
            console.error('Recaptcha init error:', e);
        }
    }

    // ── Tabs ──
    const tabs  = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t  => t.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.target)?.classList.add('active');
            clearError('login-error');
            clearError('register-error');
            clearError('reset-error');
        });
    });

    if (window.location.hash === '#register') {
        document.querySelector('.auth-tab[data-target="register-form"]')?.click();
    }

    // ── Login con email/contraseña ──
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearError('login-error');

            const email    = sanitizeInput(loginForm.querySelector('input[type="email"]').value, 255);
            const password = loginForm.querySelector('input[type="password"]').value;
            const btn      = loginForm.querySelector('button[type="submit"]');

            if (!isValidEmail(email)) {
                showError('login-error', 'Por favor, introduce un email válido.');
                return;
            }
            if (!checkRateLimit(LOGIN_RATE_LIMIT_KEY, MAX_LOGIN_ATTEMPTS, RATE_LIMIT_WINDOW_MS)) {
                showError('login-error', 'Demasiados intentos. Espera 5 minutos antes de volver a intentarlo.');
                return;
            }

            try {
                btn.textContent = 'Entrando...';
                btn.disabled    = true;

                const { user } = await signInWithEmailAndPassword(auth, email, password);

                if (!user.emailVerified && window.location.hostname !== 'localhost') {
                    const diffMin = (Date.now() - new Date(user.metadata.creationTime).getTime()) / 60000;
                    if (diffMin > 1) {
                        await user.delete();
                        showError('login-error', 'El tiempo de verificación (1 min) ha expirado. Tu cuenta ha sido eliminada. Por favor, regístrate de nuevo.');
                    } else {
                        await signOut(auth);
                        showError('login-error', 'Debes verificar tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada (y spam).');
                    }
                    btn.textContent = 'Entrar';
                    btn.disabled    = false;
                    return;
                }

                const userRef  = ref(db, 'users/' + user.uid);
                const snapshot = await get(userRef);
                if (!snapshot.exists()) {
                    await set(userRef, {
                        username:   user.displayName || 'Usuario',
                        email:      user.email,
                        createdAt:  new Date().toISOString(),
                        verifiedAt: new Date().toISOString()
                    });
                }

                const { claims } = await user.getIdTokenResult(true);
                window.location.href = getRedirectUrl(claims.admin === true);

            } catch (error) {
                console.error(error);
                showError('login-error', mapAuthError(error.code));
                btn.textContent = 'Entrar';
                btn.disabled    = false;
            }
        });
    }

    // ── Registro ──
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearError('register-error');

            const name     = registerForm.querySelector('input[type="text"]').value;
            const email    = registerForm.querySelector('input[type="email"]').value;
            const password = registerForm.querySelector('input[type="password"]').value;
            const btn      = registerForm.querySelector('button');

            if (recaptchaVerifier) {
                if (!grecaptcha.getResponse(recaptchaVerifier.widgetId)) {
                    showError('register-error', 'Por favor, completa el captcha.');
                    return;
                }
            }

            try {
                btn.textContent = 'Creando cuenta...';
                btn.disabled    = true;
                const { user } = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(user, { displayName: name });
                await sendEmailVerification(user);
                await signOut(auth);
                if (recaptchaVerifier) grecaptcha.reset(recaptchaVerifier.widgetId);
                showError('register-error', '¡Cuenta creada! Hemos enviado un enlace de verificación a tu correo. Por favor verifícalo para iniciar sesión.', true);
                registerForm.reset();
                btn.textContent = 'Crear Cuenta';
                btn.disabled    = false;
            } catch (error) {
                console.error(error);
                showError('register-error', mapAuthError(error.code) || error.message);
                btn.textContent = 'Crear Cuenta';
                btn.disabled    = false;
                if (recaptchaVerifier) grecaptcha.reset(recaptchaVerifier.widgetId);
            }
        });
    }

    // ── Recuperación de contraseña ──
    const resetForm = document.getElementById('reset-form');
    if (resetForm) {
        resetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearError('reset-error');
            const email = resetForm.querySelector('input[type="email"]').value;
            const btn   = resetForm.querySelector('button');
            try {
                btn.textContent = 'Enviando...';
                btn.disabled    = true;
                await sendPasswordResetEmail(auth, email);
                showError('reset-error', '¡Correo de recuperación enviado! Revisa tu bandeja de entrada y la carpeta de spam.', true);
                btn.textContent = 'Enviar Enlace';
                btn.disabled    = false;
                resetForm.reset();
            } catch (error) {
                console.error(error);
                showError('reset-error', mapAuthError(error.code));
                btn.textContent = 'Enviar Enlace';
                btn.disabled    = false;
            }
        });
    }

    // ── Link "¿Olvidaste tu contraseña?" ──
    document.querySelector('.forgot-password')?.addEventListener('click', (e) => {
        e.preventDefault();
        tabs.forEach(t  => t.classList.remove('active'));
        forms.forEach(f => f.classList.remove('active'));
        document.getElementById('reset-form')?.classList.add('active');
        clearError('login-error');
        clearError('register-error');
        clearError('reset-error');
    });

    // ── "Volver a Iniciar Sesión" ──
    document.getElementById('back-to-login')?.addEventListener('click', (e) => {
        e.preventDefault();
        forms.forEach(f => f.classList.remove('active'));
        tabs.forEach(t  => t.classList.remove('active'));
        document.querySelector('.auth-tab[data-target="login-form"]')?.classList.add('active');
        document.getElementById('login-form')?.classList.add('active');
        clearError('login-error');
        clearError('register-error');
        clearError('reset-error');
    });

    // ── Logout ──
    document.getElementById('logout-btn')?.addEventListener('click', async (e) => {
        e.preventDefault();
        if (confirm('¿Seguro que quieres cerrar sesión?')) {
            try {
                await signOut(auth);
                window.location.href = '/index.html';
            } catch (error) {
                console.error('Logout error:', error);
                alert('Error al cerrar sesión: ' + error.message);
            }
        }
    });
});

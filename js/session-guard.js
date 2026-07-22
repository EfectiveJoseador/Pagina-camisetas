/**
 * ════════════════════════════════════════════════════════════════════════════
 *  session-guard.js — Camisetazo Session Security Guard
 *  Zero Trust Session Management | Step-Up Auth | Anomaly Detection
 * ════════════════════════════════════════════════════════════════════════════
 *
 *  Implements:
 *  - Idle Timeout:      30 min inactivity → forced logout
 *  - Warning:           25 min → toast warning with 5-min countdown
 *  - Absolute Timeout:  8 hours from login → forced logout
 *  - Session Anomaly:   Fingerprint change mid-session → step-up auth
 *
 *  Usage (add to any authenticated page):
 *    import SessionGuard from './session-guard.js';
 *    SessionGuard.init();
 *
 *  The guard starts automatically when init() is called and the user
 *  is authenticated. It stops automatically on logout.
 */

import { auth, signOut, onAuthStateChanged } from './firebase-config.js';
import { detectSessionAnomaly, logSecurityEvent } from './security.js';

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

const CONFIG = {
    /** Idle timeout — force logout after X ms of inactivity */
    IDLE_TIMEOUT_MS:     30 * 60 * 1000,   // 30 minutes

    /** Warning threshold — show countdown warning X ms before idle logout */
    IDLE_WARNING_MS:     25 * 60 * 1000,   // 25 minutes (5 min warning)

    /** Absolute session timeout — force logout X ms after login */
    ABSOLUTE_TIMEOUT_MS: 8 * 60 * 60 * 1000, // 8 hours

    /** How often to poll for anomaly and timeout checks */
    CHECK_INTERVAL_MS:   60 * 1000,         // Check every 60 seconds

    /** How often to reset the idle timer on activity events */
    DEBOUNCE_MS:         5000,              // Max once per 5 seconds

    /** sessionStorage keys */
    KEYS: {
        LAST_ACTIVITY:   '_sg_last_act',
        SESSION_START:   '_sg_start',
        WARNED:          '_sg_warned'
    }
};

/** Activity events that reset the idle timer */
const ACTIVITY_EVENTS = ['mousemove', 'keydown', 'click', 'touchstart', 'scroll'];

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL STATE
// ─────────────────────────────────────────────────────────────────────────────

let _intervalId      = null;
let _lastDebounce    = 0;
let _warningToast    = null;
let _warningInterval = null;
let _isActive        = false;

// ─────────────────────────────────────────────────────────────────────────────
// CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Records current timestamp as last activity moment.
 * Debounced to prevent excessive sessionStorage writes.
 */
function _recordActivity() {
    const now = Date.now();
    if (now - _lastDebounce < CONFIG.DEBOUNCE_MS) return;
    _lastDebounce = now;

    try {
        sessionStorage.setItem(CONFIG.KEYS.LAST_ACTIVITY, String(now));
        // If user is active, dismiss any warning toast
        if (_warningToast) _dismissWarning();
    } catch (_) { /* ignore */ }
}


/**
 * Initializes session start timestamp (only on first login in this session).
 */
function _initSessionStart() {
    try {
        if (!sessionStorage.getItem(CONFIG.KEYS.SESSION_START)) {
            sessionStorage.setItem(CONFIG.KEYS.SESSION_START, String(Date.now()));
        }
        if (!sessionStorage.getItem(CONFIG.KEYS.LAST_ACTIVITY)) {
            sessionStorage.setItem(CONFIG.KEYS.LAST_ACTIVITY, String(Date.now()));
        }
    } catch (_) { /* ignore */ }
}


/**
 * Performs the forced logout sequence.
 *
 * @param {string} reason - Reason for logout (for logging/UX)
 */
async function _forceLogout(reason) {
    if (!_isActive) return;
    _isActive = false;
    _stop();

    console.warn(`[SessionGuard] Forced logout: ${reason}`);

    await logSecurityEvent('logout', { reason, forced: true });

    try {
        await signOut(auth);
    } catch (err) {
        console.error('[SessionGuard] Sign-out error:', err.message);
    }

    // Clear session data
    try {
        sessionStorage.removeItem(CONFIG.KEYS.LAST_ACTIVITY);
        sessionStorage.removeItem(CONFIG.KEYS.SESSION_START);
        sessionStorage.removeItem(CONFIG.KEYS.WARNED);
        sessionStorage.removeItem('_sfp');
    } catch (_) { /* ignore */ }

    // Redirect to login with reason
    const msg = encodeURIComponent(reason === 'idle'
        ? 'Tu sesión expiró por inactividad. Por favor, vuelve a iniciar sesión.'
        : reason === 'absolute'
        ? 'Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.'
        : 'Tu sesión se ha cerrado por seguridad. Por favor, vuelve a iniciar sesión.'
    );
    window.location.href = `/pages/login.html?expired=1&msg=${msg}`;
}


/**
 * Requests step-up re-authentication without full logout.
 * Shows a modal overlay requiring the user to re-authenticate.
 */
async function _requestStepUpAuth() {
    if (!_isActive) return;

    console.warn('[SessionGuard] Session anomaly detected — requesting step-up auth');
    await logSecurityEvent('session_anomaly_detected', {});

    // If no step-up UI available, force logout
    const hasStepUpModal = document.getElementById('step-up-auth-modal');
    if (!hasStepUpModal) {
        await _forceLogout('session_anomaly');
        return;
    }

    hasStepUpModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}


/**
 * Shows idle warning toast with countdown.
 */
function _showIdleWarning(msRemaining) {
    if (_warningToast) return; // Already showing

    const toast = document.createElement('div');
    toast.id = 'session-guard-warning';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.style.cssText = `
        position: fixed;
        bottom: 1.5rem;
        right: 1.5rem;
        z-index: 99999;
        background: #1e1b4b;
        color: #fff;
        padding: 1rem 1.25rem;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        max-width: 380px;
        font-family: Inter, system-ui, sans-serif;
        font-size: 0.9rem;
        border: 1px solid rgba(99,102,241,0.4);
        animation: slideInToast 0.3s ease;
    `;

    let secsLeft = Math.ceil(msRemaining / 1000);

    toast.innerHTML = `
        <span style="font-size:1.4rem;">⏱️</span>
        <div style="flex:1;">
            <p style="margin:0 0 0.25rem;font-weight:600;">Sesión a punto de expirar</p>
            <p id="_sg_countdown" style="margin:0;opacity:0.8;font-size:0.82rem;">
                Cierre por inactividad en <strong>${secsLeft}s</strong>
            </p>
        </div>
        <button id="_sg_stay" style="
            background:#6366f1;color:#fff;border:none;border-radius:8px;
            padding:0.4rem 0.8rem;cursor:pointer;font-weight:600;font-size:0.82rem;
            white-space:nowrap;
        ">Continuar</button>
    `;

    document.body.appendChild(toast);
    _warningToast = toast;

    document.getElementById('_sg_stay')?.addEventListener('click', () => {
        _recordActivity();
        _dismissWarning();
    });

    // Update countdown every second
    _warningInterval = setInterval(() => {
        secsLeft--;
        const countdown = document.getElementById('_sg_countdown');
        if (countdown) {
            countdown.innerHTML = `Cierre por inactividad en <strong>${Math.max(0, secsLeft)}s</strong>`;
        }
        if (secsLeft <= 0) _dismissWarning();
    }, 1000);

    // Auto-dismiss style injection
    if (!document.getElementById('_sg_style')) {
        const style = document.createElement('style');
        style.id = '_sg_style';
        style.textContent = `
            @keyframes slideInToast {
                from { transform: translateY(20px); opacity: 0; }
                to   { transform: translateY(0);    opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}


/**
 * Dismisses the idle warning toast.
 */
function _dismissWarning() {
    if (_warningToast) {
        _warningToast.remove();
        _warningToast = null;
    }
    if (_warningInterval) {
        clearInterval(_warningInterval);
        _warningInterval = null;
    }
    try { sessionStorage.removeItem(CONFIG.KEYS.WARNED); } catch (_) { /* ignore */ }
}


/**
 * Main periodic check — runs every CHECK_INTERVAL_MS.
 * Evaluates idle, absolute, and anomaly conditions.
 */
async function _periodicCheck() {
    if (!_isActive) return;

    const now = Date.now();

    try {
        const lastActivity  = parseInt(sessionStorage.getItem(CONFIG.KEYS.LAST_ACTIVITY) || '0', 10);
        const sessionStart  = parseInt(sessionStorage.getItem(CONFIG.KEYS.SESSION_START)  || '0', 10);
        const idleMs        = now - lastActivity;
        const absoluteMs    = now - sessionStart;

        // ── 1. Absolute timeout check ─────────────────────────────────────
        if (sessionStart > 0 && absoluteMs >= CONFIG.ABSOLUTE_TIMEOUT_MS) {
            await _forceLogout('absolute');
            return;
        }

        // ── 2. Idle timeout check ─────────────────────────────────────────
        if (lastActivity > 0 && idleMs >= CONFIG.IDLE_TIMEOUT_MS) {
            await _forceLogout('idle');
            return;
        }

        // ── 3. Idle warning check ─────────────────────────────────────────
        if (lastActivity > 0 && idleMs >= CONFIG.IDLE_WARNING_MS && !_warningToast) {
            const msUntilLogout = CONFIG.IDLE_TIMEOUT_MS - idleMs;
            _showIdleWarning(msUntilLogout);
        }

        // ── 4. Session anomaly check (fingerprint comparison) ─────────────
        const anomaly = await detectSessionAnomaly();
        if (anomaly) {
            await _requestStepUpAuth();
        }

    } catch (err) {
        console.warn('[SessionGuard] Check error:', err.message);
    }
}


/**
 * Stops all timers and event listeners.
 */
function _stop() {
    if (_intervalId) {
        clearInterval(_intervalId);
        _intervalId = null;
    }
    ACTIVITY_EVENTS.forEach(evt => {
        document.removeEventListener(evt, _recordActivity, { passive: true });
    });
    _dismissWarning();
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

const SessionGuard = {

    /**
     * Initializes the session guard.
     * Call this once per page on authenticated pages.
     * The guard automatically activates/deactivates on auth state changes.
     */
    init() {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.start();
            } else {
                this.stop();
            }
        });
    },


    /**
     * Starts the session guard for an authenticated user.
     */
    start() {
        if (_isActive) return;
        _isActive = true;

        _initSessionStart();

        // Register activity listeners
        ACTIVITY_EVENTS.forEach(evt => {
            document.addEventListener(evt, _recordActivity, { passive: true });
        });

        // Start periodic check
        _intervalId = setInterval(_periodicCheck, CONFIG.CHECK_INTERVAL_MS);

        // Run an immediate check after a short delay
        setTimeout(_periodicCheck, 5000);
    },


    /**
     * Stops the session guard (called on logout).
     */
    stop() {
        _isActive = false;
        _stop();
    },


    /**
     * Manually triggers a session activity reset.
     * Call after completing sensitive operations.
     */
    resetIdleTimer() {
        _recordActivity();
    }
};

export default SessionGuard;

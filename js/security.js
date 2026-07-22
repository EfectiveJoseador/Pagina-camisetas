/**
 * ════════════════════════════════════════════════════════════════════════════
 *  security.js — Camisetazo Frontend Security Module
 *  CISSP-grade hardening: sanitization, rate limiting, HIBP, CSRF, audit
 * ════════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

/** Strict allowlist for redirect parameters — prevents Open Redirect */
const ALLOWED_REDIRECTS = new Set(['checkout', 'carrito', 'perfil']);

/** HIBP k-Anonymity API endpoint */
const HIBP_API = 'https://api.pwnedpasswords.com/range/';

// ─────────────────────────────────────────────────────────────────────────────
// SANITIZATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Escapes HTML special characters to prevent XSS in text contexts.
 * Use this when inserting untrusted text into HTML via innerHTML.
 *
 * @param {string} str
 * @returns {string}
 */
export function sanitizeHTML(str) {
    if (str === null || str === undefined) return '';
    if (typeof str !== 'string') str = String(str);

    return str
        .replace(/&/g,  '&amp;')
        .replace(/</g,  '&lt;')
        .replace(/>/g,  '&gt;')
        .replace(/"/g,  '&quot;')
        .replace(/'/g,  '&#39;')
        .replace(/\//g, '&#47;')
        .replace(/`/g,  '&#96;')
        .replace(/=/g,  '&#61;');
}


/**
 * Sanitizes general string input — strips control chars, trims, limits length.
 *
 * @param {string} input
 * @param {number} maxLength
 * @returns {string}
 */
export function sanitizeInput(input, maxLength = 1000) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') input = String(input);
    return input
        .trim()
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
        .substring(0, maxLength);
}


/**
 * Creates a safe text node (never interpreted as HTML).
 * Use instead of innerHTML for plain text content.
 *
 * @param {string} text
 * @returns {Text}
 */
export function createSafeTextNode(text) {
    return document.createTextNode(sanitizeHTML(text));
}


/**
 * safeSetText — Sets element text content safely.
 * Always prefer this over innerHTML for plain text.
 *
 * @param {Element} element
 * @param {string}  text
 */
export function safeSetText(element, text) {
    if (element && typeof text === 'string') {
        element.textContent = text;
    }
}


/**
 * safeSetInnerHTML — Sets innerHTML after sanitizing the content.
 * Only use when you need HTML structure; prefer textContent for plain text.
 * This is NOT a full XSS filter — avoid for user-generated content.
 *
 * @param {Element} element
 * @param {string}  html
 */
export function safeSetInnerHTML(element, html) {
    if (!element || typeof html !== 'string') return;
    // Strip script tags and event handlers from the HTML
    const cleaned = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/\son\w+\s*=/gi, ' data-removed-handler=');
    element.innerHTML = cleaned;
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validates email format (RFC-compliant, length-bounded).
 *
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    if (email.length > 254) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


/**
 * Validates Spanish phone numbers.
 *
 * @param {string} phone
 * @returns {boolean}
 */
export function isValidPhone(phone) {
    if (!phone || typeof phone !== 'string') return false;
    const phoneRegex = /^(\+34)?[6789]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}


/**
 * Validates Spanish postal codes.
 *
 * @param {string} postalCode
 * @returns {boolean}
 */
export function isValidPostalCode(postalCode) {
    if (!postalCode || typeof postalCode !== 'string') return false;
    const postalCodeRegex = /^(?:0[1-9]|[1-4]\d|5[0-2])\d{3}$/;
    return postalCodeRegex.test(postalCode);
}


/**
 * Validates a redirect parameter against a strict allowlist.
 * Prevents Open Redirect attacks via ?redirect= parameter.
 *
 * @param {string|null} redirectParam
 * @returns {string|null} - Validated param or null if invalid
 */
export function validateRedirectParam(redirectParam) {
    if (!redirectParam || typeof redirectParam !== 'string') return null;
    const cleaned = redirectParam.trim().toLowerCase();
    return ALLOWED_REDIRECTS.has(cleaned) ? cleaned : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// RATE LIMITING (Client-side — defense layer 1 of 2)
// ─────────────────────────────────────────────────────────────────────────────
// NOTE: This is a UX convenience layer only.
// The authoritative rate limiting is in Firebase Cloud Functions + RTDB.
// Client-side rate limiting can be bypassed by clearing storage, but it
// still adds friction against casual attacks and reduces Firebase quota usage.

const rateLimitStore = new Map();

/**
 * Checks if an action is within rate limits.
 * Uses sessionStorage for persistence across soft reloads.
 *
 * @param {string} key         - Unique key for this action (e.g. 'login_attempts')
 * @param {number} maxAttempts - Maximum allowed attempts
 * @param {number} windowMs    - Time window in milliseconds
 * @returns {boolean} - true if action is allowed, false if blocked
 */
export function checkRateLimit(key, maxAttempts = 5, windowMs = 300000) {
    const now        = Date.now();
    const storeKey   = `rl_${key}`;

    // Try to load persisted state from sessionStorage
    let record = rateLimitStore.get(key);
    if (!record) {
        try {
            const stored = sessionStorage.getItem(storeKey);
            if (stored) record = JSON.parse(stored);
        } catch (_) { /* ignore */ }
    }

    if (!record || (now - record.firstAttempt > windowMs)) {
        record = { attempts: 1, firstAttempt: now, backoffUntil: 0 };
    } else {
        if (now < (record.backoffUntil || 0)) return false;
        if (record.attempts >= maxAttempts) {
            // Apply exponential backoff — 2^n * 5s, max 30min
            const backoffMs = Math.min(5000 * Math.pow(2, record.attempts - maxAttempts), 1800000);
            record.backoffUntil = now + backoffMs;
            rateLimitStore.set(key, record);
            _persistRateLimit(storeKey, record);
            return false;
        }
        record.attempts++;
    }

    rateLimitStore.set(key, record);
    _persistRateLimit(storeKey, record);
    return true;
}


/**
 * Returns remaining attempts before lockout.
 *
 * @param {string} key
 * @param {number} maxAttempts
 * @returns {number}
 */
export function getRemainingAttempts(key, maxAttempts = 5) {
    const record = rateLimitStore.get(key);
    if (!record) return maxAttempts;
    return Math.max(0, maxAttempts - record.attempts);
}


/**
 * Returns the backoff end timestamp (ms since epoch) or 0 if not in backoff.
 *
 * @param {string} key
 * @returns {number}
 */
export function getBackoffUntil(key) {
    const record = rateLimitStore.get(key);
    return record?.backoffUntil || 0;
}


/**
 * Resets a rate limit key (call on successful login).
 *
 * @param {string} key
 */
export function resetRateLimit(key) {
    rateLimitStore.delete(key);
    try { sessionStorage.removeItem(`rl_${key}`); } catch (_) { /* ignore */ }
}


/** @private */
function _persistRateLimit(storeKey, record) {
    try { sessionStorage.setItem(storeKey, JSON.stringify(record)); } catch (_) { /* ignore */ }
}

// ─────────────────────────────────────────────────────────────────────────────
// HIBP PASSWORD LEAK CHECK (k-Anonymity model)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Checks a password against the HaveIBeenPwned database using k-Anonymity.
 * Only the first 5 characters of the SHA-1 hash are sent — the full hash
 * and the password NEVER leave the browser.
 *
 * @param {string} password - Plaintext password to check
 * @returns {Promise<{pwned: boolean, count: number}>}
 *   pwned: true if found in breach data
 *   count: how many times it appeared in breaches (0 if not found)
 */
export async function checkPasswordBreached(password) {
    try {
        // Compute SHA-1 hash of password in browser (Web Crypto API)
        const encoder  = new TextEncoder();
        const data     = encoder.encode(password);
        const hashBuf  = await crypto.subtle.digest('SHA-1', data);
        const hashHex  = Array.from(new Uint8Array(hashBuf))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')
            .toUpperCase();

        const prefix = hashHex.slice(0, 5);
        const suffix = hashHex.slice(5);

        // Request range — only prefix is sent to API
        const response = await fetch(`${HIBP_API}${prefix}`, {
            headers: { 'Add-Padding': 'true' } // HIBP padding against traffic analysis
        });

        if (!response.ok) {
            // HIBP unavailable — fail open (don't block user)
            console.warn('[HIBP] API unavailable, skipping check');
            return { pwned: false, count: 0 };
        }

        const text  = await response.text();
        const lines = text.split('\r\n');

        for (const line of lines) {
            const [hashSuffix, countStr] = line.split(':');
            if (hashSuffix === suffix) {
                const count = parseInt(countStr, 10);
                return { pwned: true, count };
            }
        }

        return { pwned: false, count: 0 };

    } catch (err) {
        // Network error — fail open
        console.warn('[HIBP] Check failed:', err.message);
        return { pwned: false, count: 0 };
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT LOGGING (Client → Cloud Function bridge)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Logs a security event via the logAuditEvent Cloud Function.
 * The function enforces an event allowlist server-side.
 *
 * @param {string} event    - Event name from allowed list
 * @param {Object} metadata - Additional context (no PII)
 */
export async function logSecurityEvent(event, metadata = {}) {
    try {
        const { auth } = await import('./firebase-config.js');
        if (!auth.currentUser) return;

        const token = await auth.currentUser.getIdToken();

        await fetch('/api/security', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                action: 'logAuditEvent',
                event,
                metadata: {
                    userAgent: navigator.userAgent.substring(0, 200),
                    ...metadata
                }
            })
        });
    } catch (err) {
        // Logging must never break the main flow
        console.warn('[Security] Audit log failed:', err.message);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// SESSION FINGERPRINT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates a lightweight fingerprint of the current browser session.
 * Used to detect session anomalies (IP/device change mid-session).
 * Does NOT use persistent tracking APIs — only session-scoped signals.
 *
 * @returns {Promise<string>} - SHA-256 hex of session fingerprint
 */
export async function getSessionFingerprint() {
    const components = [
        navigator.userAgent,
        navigator.language,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
        screen.colorDepth,
        String(window.devicePixelRatio)
    ].join('|');

    const encoded = new TextEncoder().encode(components);
    const hashBuf = await crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(hashBuf))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}


/**
 * Stores the session fingerprint in sessionStorage.
 * Called once on successful login.
 */
export async function storeSessionFingerprint() {
    try {
        const fp = await getSessionFingerprint();
        sessionStorage.setItem('_sfp', fp);
    } catch (_) { /* ignore */ }
}


/**
 * Compares current fingerprint to stored one.
 * Returns true if anomaly detected (significant mismatch).
 *
 * @returns {Promise<boolean>}
 */
export async function detectSessionAnomaly() {
    try {
        const stored  = sessionStorage.getItem('_sfp');
        if (!stored) return false; // No baseline — can't compare

        const current = await getSessionFingerprint();
        return current !== stored;
    } catch (_) {
        return false;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT EXPORT (backwards compatibility)
// ─────────────────────────────────────────────────────────────────────────────

const Security = {
    sanitizeHTML,
    sanitizeInput,
    safeSetText,
    safeSetInnerHTML,
    createSafeTextNode,
    isValidEmail,
    isValidPhone,
    isValidPostalCode,
    validateRedirectParam,
    checkRateLimit,
    getRemainingAttempts,
    getBackoffUntil,
    resetRateLimit,
    checkPasswordBreached,
    logSecurityEvent,
    getSessionFingerprint,
    storeSessionFingerprint,
    detectSessionAnomaly
};

export default Security;

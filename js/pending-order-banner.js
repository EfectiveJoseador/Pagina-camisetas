/**
 * pending-order-banner.js
 * ──────────────────────────────────────────────────────────────────────────
 * Detecta si el usuario autenticado tiene algún pedido con status
 * 'paypal_pendiente' en Firebase y muestra un banner de recuperación
 * animado en la parte superior de la página.
 *
 * Mejoras v2:
 *  - Usa onValue() (tiempo real) → el banner desaparece solo cuando el
 *    pedido pasa a 'pendiente' sin recargar la página.
 *  - sessionStorage inteligente: si hay un pendingPayPalOrderId activo
 *    en localStorage, el dismiss previo se ignora.
 *  - El banner escucha el evento personalizado 'pendingOrderConfirmed'
 *    para eliminarse de forma instantánea.
 *  - CSS mejorado para móvil (sticky, columna, CTA centrado).
 *
 * Uso: importar como módulo en index.html, perfil.html y checkout.html.
 */

import { auth, db, onAuthStateChanged, ref, onValue } from './firebase-config.js';

// ── Estilos del banner (inyectados una sola vez) ─────────────────────────
const BANNER_STYLES = `
#pending-order-banner {
    position: sticky;
    top: 0;
    width: 100%;
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: #1c1917;
    z-index: 1100;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(245, 158, 11, 0.40);
    animation: pendingBannerSlideDown 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes pendingBannerSlideDown {
    from { transform: translateY(-110%); opacity: 0; }
    to   { transform: translateY(0);     opacity: 1; }
}

#pending-order-banner .banner-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0.85rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
}

#pending-order-banner .banner-icon {
    font-size: 1.4rem;
    flex-shrink: 0;
    animation: pendingPulse 2s ease-in-out infinite;
}

@keyframes pendingPulse {
    0%, 100% { transform: scale(1); }
    50%       { transform: scale(1.18); }
}

#pending-order-banner .banner-text {
    flex: 1;
    font-size: 0.92rem;
    font-weight: 500;
    line-height: 1.4;
    min-width: 180px;
}

#pending-order-banner .banner-text strong {
    font-weight: 700;
}

#pending-order-banner .banner-cta {
    background: #1c1917;
    color: #fef3c7;
    border: none;
    border-radius: 8px;
    padding: 0.6rem 1.2rem;
    font-size: 0.88rem;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    transition: background 0.2s, transform 0.15s;
    flex-shrink: 0;
}

#pending-order-banner .banner-cta:hover {
    background: #292524;
    transform: translateY(-1px);
}

#pending-order-banner .banner-dismiss {
    background: transparent;
    border: none;
    color: rgba(28, 25, 23, 0.6);
    cursor: pointer;
    font-size: 1rem;
    padding: 0.25rem;
    border-radius: 4px;
    flex-shrink: 0;
    transition: color 0.2s;
}

#pending-order-banner .banner-dismiss:hover {
    color: #1c1917;
}

/* ── Móvil: apilado en columna para mayor legibilidad ────────────── */
@media (max-width: 600px) {
    #pending-order-banner .banner-inner {
        padding: 0.85rem 1rem;
        gap: 0.55rem;
        flex-direction: column;
        align-items: flex-start;
    }

    #pending-order-banner .banner-text {
        font-size: 0.85rem;
        min-width: 0;
        width: 100%;
    }

    #pending-order-banner .banner-cta {
        font-size: 0.88rem;
        padding: 0.65rem 1.1rem;
        width: 100%;
        justify-content: center;
    }

    #pending-order-banner .banner-dismiss {
        position: absolute;
        top: 0.6rem;
        right: 0.75rem;
    }
}
`;

// ── Referencia al unsubscribe del listener de Firebase ───────────────────
let _unsubscribeOrderListener = null;

// ── Injectar estilos (una sola vez) ─────────────────────────────────────
function injectStyles() {
    if (document.getElementById('pending-order-banner-styles')) return;
    const style = document.createElement('style');
    style.id = 'pending-order-banner-styles';
    style.textContent = BANNER_STYLES;
    document.head.appendChild(style);
}

// ── Animar y quitar el banner del DOM ────────────────────────────────────
function removeBanner() {
    const banner = document.getElementById('pending-order-banner');
    if (!banner) return;
    banner.style.animation = 'none';
    banner.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    banner.style.transform = 'translateY(-110%)';
    banner.style.opacity = '0';
    setTimeout(() => banner.remove(), 320);
    // Limpiar listener en tiempo real si estaba activo
    if (_unsubscribeOrderListener) {
        _unsubscribeOrderListener();
        _unsubscribeOrderListener = null;
    }
}

// ── Renderizar el banner en el DOM ───────────────────────────────────────
function renderBanner(order) {
    if (document.getElementById('pending-order-banner')) return; // ya existe

    injectStyles();

    const banner = document.createElement('div');
    banner.id = 'pending-order-banner';
    banner.setAttribute('role', 'alert');
    banner.setAttribute('aria-live', 'assertive');
    // Necesario para que position:absolute del dismiss funcione en móvil
    banner.style.position = 'sticky';

    const total = order.total != null ? `€${Number(order.total).toFixed(2)}` : '';
    const totalText = total ? ` por <strong>${total}</strong>` : '';
    const resumeUrl = `/pages/checkout.html?resume=${encodeURIComponent(order.orderId)}`;

    banner.innerHTML = `
        <div class="banner-inner">
            <span class="banner-icon">⏳</span>
            <div class="banner-text">
                <strong>Tienes un pedido pendiente de confirmar.</strong>
                Realizaste el pago en PayPal${totalText} pero aún no finalizaste la confirmación.
            </div>
            <a href="${resumeUrl}" class="banner-cta" id="pending-order-cta">
                <i class="fas fa-arrow-right"></i> Completar ahora
            </a>
            <button class="banner-dismiss" id="pending-order-dismiss" aria-label="Descartar aviso" title="Descartar">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Insertar justo después del header, con varios fallbacks
    const header = document.querySelector('header.main-header');
    if (header) {
        header.insertAdjacentElement('afterend', banner);
    } else {
        document.body.insertAdjacentElement('afterbegin', banner);
    }

    console.info('[PendingOrderBanner] Banner de pedido pendiente mostrado ✓');

    // Botón descartar — solo lo oculta en esta sesión
    document.getElementById('pending-order-dismiss')?.addEventListener('click', () => {
        removeBanner();
        try { sessionStorage.setItem('pendingBannerDismissed', '1'); } catch (_) {}
    });

    // Escuchar evento personalizado de confirmación (desde checkout.js en la misma pestaña)
    window.addEventListener('pendingOrderConfirmed', () => {
        removeBanner();
    }, { once: true });
}

// ── Buscar pedidos con status 'paypal_pendiente' (con listener en tiempo real)
function checkPendingOrders(uid) {
    try {
        // Comprobar si el usuario tiene un pago PayPal activo en localStorage
        const hasPendingPayPalLocal = !!localStorage.getItem('pendingPayPalOrderId');

        // Si el usuario ya descartó el banner en esta sesión…
        if (sessionStorage.getItem('pendingBannerDismissed') === '1') {
            // …pero tiene un pago pendiente activo → mostrar igualmente
            if (!hasPendingPayPalLocal) {
                console.info('[PendingOrderBanner] Banner descartado en esta sesión, omitiendo.');
                return;
            }
            console.info('[PendingOrderBanner] Hay un pendingPayPalOrderId en localStorage → ignorando dismiss previo.');
        }

        console.info('[PendingOrderBanner] Iniciando listener en tiempo real para uid:', uid);

        const ordersRef = ref(db, `ordersByUser/${uid}`);

        // onValue se ejecuta inmediatamente y cada vez que cambien los datos
        _unsubscribeOrderListener = onValue(ordersRef, (snapshot) => {
            if (!snapshot.exists()) {
                console.info('[PendingOrderBanner] Sin pedidos encontrados.');
                removeBanner(); // limpiar si el banner ya estaba
                return;
            }

            const orders = snapshot.val();
            const pendingOrder = Object.values(orders).find(
                o => o.status === 'paypal_pendiente'
            );

            if (pendingOrder) {
                console.info('[PendingOrderBanner] Pedido pendiente encontrado:', pendingOrder.orderId);
                renderBanner(pendingOrder);
            } else {
                // Ya no hay pedidos pendientes → quitar el banner si está visible
                console.info('[PendingOrderBanner] Sin pedidos con status paypal_pendiente.');
                removeBanner();
            }
        }, (error) => {
            console.warn('[PendingOrderBanner] Error en listener de pedidos:', error);
        });

    } catch (error) {
        console.warn('[PendingOrderBanner] No se pudo verificar pedidos pendientes:', error);
    }
}

// ── Inicialización ────────────────────────────────────────────────────────
function init() {
    onAuthStateChanged(auth, (user) => {
        // Si el usuario cierra sesión, limpiar listener activo
        if (!user) {
            if (_unsubscribeOrderListener) {
                _unsubscribeOrderListener();
                _unsubscribeOrderListener = null;
            }
            return;
        }

        console.info('[PendingOrderBanner] Usuario autenticado, verificando pedidos pendientes...');
        // Esperar a que components.js inyecte el header en el DOM
        const tryRender = (attempts = 0) => {
            const header = document.querySelector('header.main-header');
            if (header) {
                checkPendingOrders(user.uid);
            } else if (attempts < 20) {
                // Reintentar hasta ~3 segundos
                setTimeout(() => tryRender(attempts + 1), 150);
            } else {
                // Si el header nunca llega, ejecutamos igualmente (el banner irá al body)
                console.warn('[PendingOrderBanner] Header no encontrado, insertando en body.');
                checkPendingOrders(user.uid);
            }
        };
        tryRender();
    });
}

// Arrancar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

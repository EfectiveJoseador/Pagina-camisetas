/**
 * pending-order-banner.js
 * ──────────────────────────────────────────────────────────────────────────
 * Detecta si el usuario autenticado tiene algún pedido con status
 * 'paypal_pendiente' en Firebase y muestra un banner de recuperación
 * animado en la parte superior de la página.
 *
 * Uso: importar como módulo en index.html, perfil.html y checkout.html.
 */

import { auth, db, onAuthStateChanged, ref, get } from './firebase-config.js';

// ── Estilos del banner (inyectados una sola vez) ─────────────────────────
const BANNER_STYLES = `
#pending-order-banner {
    position: relative;
    width: 100%;
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: #1c1917;
    z-index: 1100;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(245, 158, 11, 0.35);
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
    min-width: 200px;
}

#pending-order-banner .banner-text strong {
    font-weight: 700;
}

#pending-order-banner .banner-cta {
    background: #1c1917;
    color: #fef3c7;
    border: none;
    border-radius: 8px;
    padding: 0.55rem 1.1rem;
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

@media (max-width: 600px) {
    #pending-order-banner .banner-inner {
        padding: 0.75rem 1rem;
        gap: 0.6rem;
    }
    #pending-order-banner .banner-text {
        font-size: 0.83rem;
    }
    #pending-order-banner .banner-cta {
        font-size: 0.82rem;
        padding: 0.5rem 0.9rem;
    }
}
`;

// ── Injectar estilos (una sola vez) ─────────────────────────────────────
function injectStyles() {
    if (document.getElementById('pending-order-banner-styles')) return;
    const style = document.createElement('style');
    style.id = 'pending-order-banner-styles';
    style.textContent = BANNER_STYLES;
    document.head.appendChild(style);
}

// ── Renderizar el banner en el DOM ───────────────────────────────────────
function renderBanner(order) {
    if (document.getElementById('pending-order-banner')) return; // ya existe

    injectStyles();

    const banner = document.createElement('div');
    banner.id = 'pending-order-banner';
    banner.setAttribute('role', 'alert');
    banner.setAttribute('aria-live', 'assertive');

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
        // Fallback: al principio del body
        document.body.insertAdjacentElement('afterbegin', banner);
    }

    console.info('[PendingOrderBanner] Banner de pedido pendiente mostrado ✓');

    // Botón descartar — solo lo oculta en esta sesión (no elimina el pedido)
    document.getElementById('pending-order-dismiss')?.addEventListener('click', () => {
        banner.style.animation = 'none';
        banner.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        banner.style.transform = 'translateY(-110%)';
        banner.style.opacity = '0';
        setTimeout(() => banner.remove(), 320);
        // Guardar en sessionStorage para no volver a mostrar en esta sesión
        try { sessionStorage.setItem('pendingBannerDismissed', '1'); } catch (_) {}
    });
}

// ── Buscar pedidos con status 'paypal_pendiente' ─────────────────────────
async function checkPendingOrders(uid) {
    try {
        // Evitar volver a mostrar si el usuario lo descartó en esta sesión
        if (sessionStorage.getItem('pendingBannerDismissed') === '1') return;

        console.info('[PendingOrderBanner] Buscando pedidos pendientes para uid:', uid);

        const ordersRef = ref(db, `ordersByUser/${uid}`);
        const snapshot = await get(ordersRef);

        if (!snapshot.exists()) {
            console.info('[PendingOrderBanner] Sin pedidos encontrados.');
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
            console.info('[PendingOrderBanner] Sin pedidos con status paypal_pendiente.');
        }
    } catch (error) {
        // Silencioso: si falla la consulta, simplemente no mostramos el banner
        console.warn('[PendingOrderBanner] No se pudo verificar pedidos pendientes:', error);
    }
}

// ── Inicialización ────────────────────────────────────────────────────────
function init() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.info('[PendingOrderBanner] Usuario autenticado, verificando pedidos pendientes...');
            // Esperar a que components.js inyecte el header en el DOM
            // components.js es no-modular y se ejecuta en DOMContentLoaded
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
        }
    });
}

// Arrancar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

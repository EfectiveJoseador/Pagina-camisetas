

import { auth, db, onAuthStateChanged, signOut, ref, onValue, update, get, remove, push, set } from './firebase-config.js';
import { convertToAvailable } from './points.js';
import { sanitizeHTML } from './security.js';
let isAdmin = false;
let allOrders = [];
let currentFilters = {
    status: 'all',
    payment: 'all',
    search: ''
};
const authLoading = document.getElementById('auth-loading');
const adminPanel = document.getElementById('admin-panel');
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        redirectToHome('No has iniciado sesión');
        return;
    }
    try {
        const idTokenResult = await user.getIdTokenResult(true);
        const claims = idTokenResult.claims;

        if (claims.admin !== true) {
            redirectToHome('No tienes permisos de administrador');
            return;
        }
        isAdmin = true;
        showAdminPanel(user);

    } catch (error) {
        console.error('Error verifying admin:', error);
        redirectToHome('Error de verificación');
    }
});

function redirectToHome(reason) {
    authLoading.innerHTML = `
        <div style="text-align: center;">
            <i class="fas fa-shield-alt" style="font-size: 3rem; color: #ef4444; margin-bottom: 1rem;"></i>
            <p style="color: #ef4444; font-weight: 600;">${reason}</p>
            <p style="color: #666; font-size: 0.85rem;">Redirigiendo...</p>
        </div>
    `;
    setTimeout(() => {
        window.location.href = '/index.html';
    }, 2000);
}

function showAdminPanel(user) {
    authLoading.classList.add('hidden');
    adminPanel.classList.remove('hidden');
    document.getElementById('admin-email').textContent = user.email;
    initPanel();
}
function initPanel() {
    setupEventListeners();
    loadAllOrders();
    setupPromoCodeListeners();
    loadPromoCodes();
    setupUsersListeners();
    loadAllUsers();
    initPinnedProducts();
}

function setupEventListeners() {
    document.getElementById('btn-logout').addEventListener('click', async () => {
        if (confirm('¿Cerrar sesión de administrador?')) {
            await signOut(auth);
            window.location.href = '/index.html';
        }
    });
    document.getElementById('btn-refresh').addEventListener('click', () => {
        loadAllOrders();
    });
    document.getElementById('filter-status').addEventListener('change', (e) => {
        currentFilters.status = e.target.value;
        renderOrders();
    });

    document.getElementById('filter-payment').addEventListener('change', (e) => {
        currentFilters.payment = e.target.value;
        renderOrders();
    });

    document.getElementById('search-orders').addEventListener('input', (e) => {
        currentFilters.search = e.target.value.toLowerCase();
        renderOrders();
    });
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('order-modal').addEventListener('click', (e) => {
        if (e.target.id === 'order-modal') closeModal();
    });
}
function loadAllOrders() {
    const loadingEl = document.getElementById('loading-orders');
    const emptyEl = document.getElementById('empty-state');
    const tableBody = document.getElementById('orders-table-body');

    loadingEl.classList.remove('hidden');
    emptyEl.classList.add('hidden');
    tableBody.innerHTML = '';

    const ordersRef = ref(db, 'ordersByUser');

    onValue(ordersRef, (snapshot) => {
        allOrders = [];

        if (snapshot.exists()) {
            const usersData = snapshot.val();
            Object.keys(usersData).forEach(uid => {
                const userOrders = usersData[uid];
                Object.keys(userOrders).forEach(orderId => {
                    const order = userOrders[orderId];
                    allOrders.push({
                        ...order,
                        uid: uid,
                        orderId: orderId,
                        path: `ordersByUser/${uid}/${orderId}`
                    });
                });
            });
            allOrders.sort((a, b) => {
                const dateA = a.createdAt || new Date(a.date).getTime();
                const dateB = b.createdAt || new Date(b.date).getTime();
                return dateB - dateA;
            });
        }

        loadingEl.classList.add('hidden');
        updateStats();
        renderOrders();

    }, (error) => {
        console.error('Error loading orders:', error);
        loadingEl.classList.add('hidden');

        if (error.code === 'PERMISSION_DENIED') {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="9" class="error-message">
                        <i class="fas fa-lock"></i>
                        Acceso denegado. Verifica que tienes permisos de administrador.
                    </td>
                </tr>
            `;
        }
    });
}
function updateStats() {
    const total = allOrders.length;
    const pending = allOrders.filter(o => o.status === 'pendiente' || o.status === 'confirmado').length;
    const shipped = allOrders.filter(o => o.status === 'enviado').length;
    const delivered = allOrders.filter(o => o.status === 'entregado').length;

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-pending').textContent = pending;
    document.getElementById('stat-shipped').textContent = shipped;
    document.getElementById('stat-delivered').textContent = delivered;
}
function renderOrders() {
    const tableBody = document.getElementById('orders-table-body');
    const emptyEl = document.getElementById('empty-state');
    let filtered = allOrders.filter(order => {
        if (currentFilters.status !== 'all' && order.status !== currentFilters.status) {
            return false;
        }
        if (currentFilters.payment !== 'all') {
            const isPaid = order.payment?.paid === true;
            if (currentFilters.payment === 'paid' && !isPaid) return false;
            if (currentFilters.payment === 'unpaid' && isPaid) return false;
        }
        if (currentFilters.search) {
            const searchStr = currentFilters.search;
            const matchId = order.orderId?.toLowerCase().includes(searchStr);
            const matchEmail = order.userEmail?.toLowerCase().includes(searchStr);
            const matchName = order.customerName?.toLowerCase().includes(searchStr);
            if (!matchId && !matchEmail && !matchName) return false;
        }

        return true;
    });

    if (filtered.length === 0) {
        tableBody.innerHTML = '';
        emptyEl.classList.remove('hidden');
        return;
    }

    emptyEl.classList.add('hidden');

    tableBody.innerHTML = filtered.map(order => {
        const date = order.dateFormatted || new Date(order.date).toLocaleString('es-ES');
        const products = order.items?.map(i => `${i.name} x${i.quantity}`).join(', ') || '-';
        const truncatedProducts = products.length > 50 ? products.substring(0, 50) + '...' : products;
        const isPaid = order.payment?.paid === true;
        const paymentMethod = order.paymentMethod || 'N/A';
        const needsConfirmation = (['bizum', 'revtag', 'revolut', 'transferencia'].includes(paymentMethod)) && !isPaid;

        const sOrderId = sanitizeHTML(order.orderId || '-');
        const sCustomerName = sanitizeHTML(order.customerName || 'N/A');
        const sUserEmail = sanitizeHTML(order.userEmail || '-');
        const sTracking = sanitizeHTML(order.trackingNumber || '');

        return `
            <tr data-order-path="${order.path}">
                <td class="order-id">${sOrderId}</td>
                <td class="order-date">${date}</td>
                <td class="order-customer">
                    <div class="customer-info">
                        <span class="customer-name">${sCustomerName}</span>
                        <span class="customer-email">${sUserEmail}</span>
                    </div>
                </td>
                <td class="order-products" title="${sanitizeHTML(products)}">${sanitizeHTML(truncatedProducts)}</td>
                <td class="order-total">€${order.total?.toFixed(2) || '0.00'}</td>
                <td class="order-payment">
                    <span class="payment-method ${paymentMethod.toLowerCase()}">${paymentMethod}</span>
                    <span class="payment-status ${isPaid ? 'paid' : 'unpaid'}">
                        ${isPaid ? '<i class="fas fa-check"></i> Pagado' : '<i class="fas fa-clock"></i> Pendiente'}
                    </span>
                    ${needsConfirmation ? `
                        <button class="btn-confirm-payment" onclick="confirmPayment('${order.path}')">
                            <i class="fas fa-check-circle"></i> Confirmar
                        </button>
                    ` : ''}
                </td>
                <td class="order-status">
                    <select class="status-select status-${order.status}" onchange="updateOrderStatus('${order.path}', this.value, '${order.uid}', '${order.orderId}')">
                        <option value="pendiente" ${order.status === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                        <option value="confirmado" ${order.status === 'confirmado' ? 'selected' : ''}>Confirmado</option>
                        <option value="imagenes_cliente" ${order.status === 'imagenes_cliente' ? 'selected' : ''}>📷 Imágenes Cliente</option>
                        <option value="enviado" ${order.status === 'enviado' ? 'selected' : ''}>Enviado</option>
                        <option value="entregado" ${order.status === 'entregado' ? 'selected' : ''}>Entregado</option>
                        <option value="cancelado" ${order.status === 'cancelado' ? 'selected' : ''}>Cancelado</option>
                    </select>
                </td>
                <td class="order-tracking">
                    <div class="tracking-input">
                        <input type="text" 
                               value="${sTracking}" 
                               placeholder="Añadir tracking..."
                               onchange="updateTracking('${order.path}', this.value)">
                    </div>
                    ${sTracking ? `
                        <a href="https://www.17track.net/?nums=${encodeURIComponent(sTracking)}" 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           style="display: inline-flex; align-items: center; gap: 0.35rem; margin-top: 0.4rem; font-size: 0.78rem; color: #818cf8; text-decoration: none; font-weight: 600;"
                           title="Rastrear paquete en 17TRACK">
                            <i class="fas fa-external-link-alt"></i> Ver en 17TRACK
                        </a>
                    ` : ''}
                </td>
                <td class="order-actions">
                    <button class="btn-view" onclick="viewOrderDetails('${order.path}')" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteOrder('${order.path}', '${order.orderId}')" title="Eliminar pedido">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}
window.updateOrderStatus = async function (path, newStatus, uid, orderId) {
    if (!isAdmin) {
        alert('No tienes permisos');
        return;
    }

    const validStatuses = ['pendiente', 'confirmado', 'imagenes_cliente', 'enviado', 'entregado', 'cancelado'];
    if (!validStatuses.includes(newStatus)) {
        alert('Estado inválido');
        return;
    }

    try {
        const orderRef = ref(db, path);
        await update(orderRef, {
            status: newStatus,
            lastUpdated: new Date().toISOString(),
            updatedBy: auth.currentUser.email
        });
        if (newStatus === 'imagenes_cliente' && uid && orderId) {
            const converted = await convertToAvailable(uid, orderId);
            if (converted) {
                showToast(`Estado actualizado y puntos convertidos a disponibles`);
            } else {
                showToast(`Estado actualizado a: ${newStatus}`);
            }
        } else {
            showToast(`Estado actualizado a: ${newStatus}`);
        }
    } catch (error) {
        console.error('Error updating status:', error);
        alert('Error al actualizar estado: ' + error.message);
    }
};
window.updateTracking = async function (path, trackingNumber) {
    if (!isAdmin) {
        alert('No tienes permisos');
        return;
    }

    try {
        const orderRef = ref(db, path);
        await update(orderRef, {
            trackingNumber: trackingNumber || null,
            lastUpdated: new Date().toISOString(),
            updatedBy: auth.currentUser.email
        });

        showToast('Tracking actualizado');
    } catch (error) {
        console.error('Error updating tracking:', error);
        alert('Error al actualizar tracking: ' + error.message);
    }
};
window.confirmPayment = async function (path) {
    if (!isAdmin) {
        alert('No tienes permisos');
        return;
    }

    if (!confirm('¿Confirmar que el pago ha sido recibido? El estado pasará a "Confirmado".')) {
        return;
    }

    try {
        const orderRef = ref(db, path);
        await update(orderRef, {
            'payment/paid': true,
            'payment/confirmedAt': new Date().toISOString(),
            'payment/confirmedBy': auth.currentUser.email,
            status: 'confirmado',
            lastUpdated: new Date().toISOString(),
            updatedBy: auth.currentUser.email
        });

        showToast('Pago confirmado y estado actualizado a Confirmado');
    } catch (error) {
        console.error('Error confirming payment:', error);
        alert('Error al confirmar pago: ' + error.message);
    }
};
window.deleteOrder = async function (path, orderId) {
    if (!isAdmin) {
        alert('No tienes permisos');
        return;
    }
    if (!confirm(`¿Estás seguro de que quieres eliminar el pedido ${orderId}?`)) {
        return;
    }
    const confirmText = prompt(`Para confirmar la eliminación, escribe "ELIMINAR":`);
    if (confirmText !== 'ELIMINAR') {
        alert('Eliminación cancelada. Debes escribir exactamente "ELIMINAR" para confirmar.');
        return;
    }

    try {
        const orderRef = ref(db, path);
        await remove(orderRef);

        showToast(`Pedido ${orderId} eliminado`);
    } catch (error) {
        console.error('Error deleting order:', error);
        alert('Error al eliminar pedido: ' + error.message);
    }
};
let currentEditingOrder = null;
let currentEditingItems = [];
let isOrderEditMode = false;

window.viewOrderDetails = async function (path) {
    const order = allOrders.find(o => o.path === path);
    if (!order) return;

    currentEditingOrder = JSON.parse(JSON.stringify(order));
    currentEditingItems = JSON.parse(JSON.stringify(order.items || []));
    isOrderEditMode = false;

    renderOrderModalView();
};

function renderOrderModalView() {
    if (!currentEditingOrder) return;
    const order = currentEditingOrder;

    const modal = document.getElementById('order-modal');
    const modalBody = document.getElementById('modal-body');
    const modalOrderId = document.getElementById('modal-order-id');
    const headerActions = document.getElementById('modal-header-actions');

    modalOrderId.textContent = '#' + sanitizeHTML(order.orderId || '');

    if (headerActions) {
        if (isOrderEditMode) {
            headerActions.innerHTML = `
                <button class="btn-modal-cancel" onclick="cancelOrderEditMode()">
                    <i class="fas fa-times"></i> Cancelar Edición
                </button>
            `;
        } else {
            headerActions.innerHTML = `
                <button class="btn-modal-edit" onclick="enableOrderEditMode()">
                    <i class="fas fa-edit"></i> Editar Pedido
                </button>
            `;
        }
    }

    if (isOrderEditMode) {
        renderOrderEditMode();
        modal.classList.add('active');
        return;
    }

    const address = order.shippingAddress || {};
    const items = order.items || [];

    modalBody.innerHTML = `
        <div class="order-detail-grid">
            <div class="detail-section">
                <h3><i class="fas fa-user"></i> Cliente</h3>
                <p><strong>Nombre:</strong> ${sanitizeHTML(order.customerName || order.userEmail || 'N/A')}</p>
                <p><strong>Email:</strong> ${sanitizeHTML(order.userEmail || 'N/A')}</p>
                <p><strong>UID:</strong> <code>${sanitizeHTML(order.uid)}</code></p>
            </div>

            <div class="detail-section">
                <h3><i class="fas fa-map-marker-alt"></i> Dirección de Envío</h3>
                <p>${sanitizeHTML(address.street || address.address || 'N/A')}</p>
                <p>${sanitizeHTML(address.city || '')}, ${sanitizeHTML(address.postalCode || address.zip || '')}</p>
                <p>${sanitizeHTML(address.province || '')}, ${sanitizeHTML(address.country || '')}</p>
                <p><strong><i class="fab fa-tiktok" style="color: #00c951;"></i> TikTok:</strong> @${sanitizeHTML((address.instagram || '').replace(/^@/, ''))}</p>
                <p><strong>Tel:</strong> ${sanitizeHTML(address.phone || 'N/A')}</p>
            </div>

            <div class="detail-section">
                <h3><i class="fas fa-credit-card"></i> Pago</h3>
                <p><strong>Método:</strong> <span class="payment-method ${(order.paymentMethod || 'N/A').toLowerCase()}">${sanitizeHTML(order.paymentMethod || 'N/A')}</span></p>
                <p><strong>Estado pago:</strong> ${order.payment?.paid ? '<span style="color:#10b981;font-weight:700;"><i class="fas fa-check-circle"></i> Pagado</span>' : '<span style="color:#f59e0b;font-weight:700;"><i class="fas fa-clock"></i> Pendiente</span>'}</p>
                ${order.paymentMethod === 'bizum' && order.bizumInstagram ? `
                    <p><strong><i class="fab fa-tiktok" style="color: #00c951;"></i> TikTok Bizum:</strong> ${sanitizeHTML(order.bizumInstagram)}</p>
                ` : ''}
                ${order.payment?.confirmedBy ? `<p><strong>Confirmado por:</strong> ${sanitizeHTML(order.payment.confirmedBy)}</p>` : ''}
            </div>

            <div class="detail-section">
                <h3><i class="fas fa-info-circle"></i> Estado e Historial</h3>
                <p><strong>Estado actual:</strong> <span class="status-badge status-${order.status}">${order.status}</span></p>
                <p><strong>Tracking:</strong> ${order.trackingNumber ? `
                    <a href="https://www.17track.net/?nums=${encodeURIComponent(order.trackingNumber)}" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       style="color: #818cf8; font-weight: 600; text-decoration: underline; margin-left: 0.25rem;">
                        ${sanitizeHTML(order.trackingNumber)} <i class="fas fa-external-link-alt" style="font-size: 0.75rem;"></i>
                    </a>
                ` : 'Sin asignar'}</p>
                <p><strong>Fecha pedido:</strong> ${order.dateFormatted || new Date(order.date || Date.now()).toLocaleString('es-ES')}</p>
                ${order.lastUpdated ? `<p><strong>Última actualización:</strong> ${new Date(order.lastUpdated).toLocaleString('es-ES')}</p>` : ''}
                ${order.updatedBy ? `<p><strong>Editado por:</strong> ${sanitizeHTML(order.updatedBy)}</p>` : ''}
            </div>
        </div>

        <div class="detail-section full-width">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
                <h3 style="margin-bottom:0;"><i class="fas fa-shopping-cart"></i> Productos del Pedido (${items.reduce((acc, i) => acc + (parseInt(i.quantity) || 1), 0)} unidades)</h3>
                <button class="btn-modal-edit" style="font-size:0.8rem;padding:0.35rem 0.75rem;" onclick="enableOrderEditMode()">
                    <i class="fas fa-pencil-alt"></i> Editar Productos
                </button>
            </div>

            <table class="items-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Talla</th>
                        <th>Versión</th>
                        <th>Personalización / Extras</th>
                        <th>Cantidad</th>
                        <th>Precio Un.</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map((item, idx) => {
                        const custom = item.customization || {};
                        const name = custom.name || item.nameCustom || '';
                        const number = custom.number || item.numberCustom || '';
                        const patch = custom.patch || item.patch || '';
                        const version = custom.version || item.version || 'aficionado';
                        const size = custom.size || item.size || 'M';
                        const unitPrice = parseFloat(item.price || 0);
                        const qty = parseInt(item.quantity || item.qty || 1);
                        const itemSubtotal = unitPrice * qty;

                        return `
                            <tr>
                                <td>
                                    <div class="item-info">
                                        <img src="${item.image || '/assets/placeholder.webp'}" alt="${sanitizeHTML(item.name || '')}" onerror="this.src='/assets/placeholder.webp'">
                                        <div>
                                            <div style="font-weight:600;color:#fff;">${sanitizeHTML(item.name || `Producto ${item.id}`)}</div>
                                            ${item.sku ? `<div style="font-size:0.75rem;color:#888;">SKU: ${sanitizeHTML(item.sku)}</div>` : ''}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span class="item-extra-tag tag-size"><i class="fas fa-ruler"></i> ${sanitizeHTML(size)}</span>
                                </td>
                                <td>
                                    <span class="item-extra-tag ${version === 'jugador' ? 'tag-version-jugador' : 'tag-version-aficionado'}">
                                        <i class="fas ${version === 'jugador' ? 'fa-bolt' : 'fa-user'}"></i> ${version.toUpperCase()}
                                    </span>
                                </td>
                                <td>
                                    <div class="item-customization-tags">
                                        ${(name || number) ? `
                                            <span class="item-extra-tag tag-name-num">
                                                <i class="fas fa-font"></i> ${sanitizeHTML(name)} ${sanitizeHTML(number ? '#' + number : '')}
                                            </span>
                                        ` : ''}
                                        ${(patch && patch !== 'none') ? `
                                            <span class="item-extra-tag tag-patches">
                                                <i class="fas fa-shield-alt"></i> ${sanitizeHTML(patch)}
                                            </span>
                                        ` : ''}
                                        ${(!name && !number && (!patch || patch === 'none')) ? `
                                            <span style="color:#666;font-size:0.8rem;">Sin extras</span>
                                        ` : ''}
                                    </div>
                                </td>
                                <td><strong>x${qty}</strong></td>
                                <td>€${unitPrice.toFixed(2)}</td>
                                <td style="font-weight:700;color:#10b981;">€${itemSubtotal.toFixed(2)}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>

            <div class="order-total-box">
                <p><strong>Subtotal:</strong> €${(order.subtotal || 0).toFixed(2)}</p>
                ${order.shipping !== undefined ? `<p><strong>Envío:</strong> €${(order.shipping || 0).toFixed(2)}</p>` : ''}
                ${order.protectionFee ? `<p><strong>Tasa de Protección:</strong> +€${(order.protectionFee || 0).toFixed(2)}</p>` : ''}
                ${order.discount ? `<p style="color:#f87171;"><strong>Descuento:</strong> -€${(order.discount || 0).toFixed(2)}</p>` : ''}
                ${order.couponUsed ? `<p style="font-size:0.8rem;color:#888;">Cupón: ${sanitizeHTML(order.couponUsed)} (-€${(order.couponDiscount || 0).toFixed(2)})</p>` : ''}
                ${order.promoCodeUsed ? `<p style="font-size:0.8rem;color:#888;">Código Promo: ${sanitizeHTML(order.promoCodeUsed)} (-€${(order.promoCodeDiscount || 0).toFixed(2)})</p>` : ''}
                <p class="total"><strong>TOTAL PEDIDO:</strong> €${(order.total || 0).toFixed(2)}</p>
            </div>
        </div>
    `;

    modal.classList.add('active');
}

window.enableOrderEditMode = function () {
    isOrderEditMode = true;
    renderOrderModalView();
};

window.cancelOrderEditMode = function () {
    if (!currentEditingOrder) return;
    currentEditingItems = JSON.parse(JSON.stringify(currentEditingOrder.items || []));
    isOrderEditMode = false;
    renderOrderModalView();
};

window.renderOrderEditMode = function () {
    const modalContent = document.querySelector('#order-modal .modal-content');
    if (modalContent) modalContent.classList.add('full-screen-modal');

    const modalBody = document.getElementById('modal-body');
    const items = currentEditingItems;
    const standardSizes = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '16 (Niño)', '18 (Niño)', '20 (Niño)', '22 (Niño)', '24 (Niño)', '26 (Niño)', '28 (Niño)'];

    modalBody.innerHTML = `
        <div class="edit-mode-banner">
            <div>
                <i class="fas fa-edit" style="color:#6366f1;font-size:1.1rem;margin-right:0.4rem;"></i>
                <strong>Modo Edición Activado</strong> — Modifica modelos, tallas, versión, personalización, añade o elimina productos. Los precios se recalcularán automáticamente.
            </div>
        </div>

        <div class="detail-section full-width">
            <h3><i class="fas fa-tshirt"></i> Editar Productos del Pedido (${items.length} productos)</h3>
            
            <!-- DESKTOP TABLE -->
            <table class="items-edit-table">
                <thead>
                    <tr>
                        <th style="width:26%;">Producto / Modelo</th>
                        <th style="width:12%;">Talla</th>
                        <th style="width:14%;">Versión</th>
                        <th style="width:20%;">Nombre y Número</th>
                        <th style="width:14%;">Parches</th>
                        <th style="width:7%;">Cant.</th>
                        <th style="width:9%;">Precio (€)</th>
                        <th style="width:4%;"></th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map((item, idx) => {
                        const custom = item.customization || {};
                        const size = custom.size || item.size || 'M';
                        const version = custom.version || item.version || 'aficionado';
                        const name = custom.name || '';
                        const number = custom.number || '';
                        const patch = custom.patch || '';
                        const price = item.price !== undefined ? item.price : 19.90;
                        const qty = item.quantity || item.qty || 1;

                        return `
                            <tr>
                                <td>
                                    <div class="item-info" style="margin-bottom:0.4rem;">
                                        <img src="${item.image || '/assets/placeholder.webp'}" alt="${sanitizeHTML(item.name || '')}" onerror="this.src='/assets/placeholder.webp'">
                                        <input type="text" class="edit-input" value="${sanitizeHTML(item.name || '')}" 
                                               onchange="updateItemField(${idx}, 'name', this.value)" placeholder="Nombre del producto">
                                    </div>
                                </td>
                                <td>
                                    <select class="edit-select" onchange="updateItemField(${idx}, 'size', this.value)">
                                        ${standardSizes.map(s => `<option value="${s}" ${size === s ? 'selected' : ''}>${s}</option>`).join('')}
                                    </select>
                                </td>
                                <td>
                                    <select class="edit-select" onchange="updateItemField(${idx}, 'version', this.value)">
                                        <option value="aficionado" ${version === 'aficionado' ? 'selected' : ''}>Aficionado</option>
                                        <option value="jugador" ${version === 'jugador' ? 'selected' : ''}>Jugador (+5€)</option>
                                    </select>
                                </td>
                                <td>
                                    <div style="display:flex;gap:0.3rem;margin-bottom:0.2rem;">
                                        <input type="text" class="edit-input" placeholder="Nombre" value="${sanitizeHTML(name)}" 
                                               onchange="updateItemField(${idx}, 'nameCustom', this.value)">
                                        <input type="text" class="edit-input" style="width:65px;" placeholder="Nº" value="${sanitizeHTML(number)}" 
                                               onchange="updateItemField(${idx}, 'numberCustom', this.value)">
                                    </div>
                                </td>
                                <td>
                                    <input type="text" class="edit-input" placeholder="Parches" value="${sanitizeHTML(patch)}" 
                                           onchange="updateItemField(${idx}, 'patch', this.value)">
                                </td>
                                <td>
                                    <input type="number" class="edit-input edit-qty-input" min="1" max="99" value="${qty}" 
                                           onchange="updateItemField(${idx}, 'quantity', parseInt(this.value) || 1)">
                                </td>
                                <td>
                                    <input type="number" step="0.01" class="edit-input edit-price-input" value="${parseFloat(price).toFixed(2)}" 
                                           onchange="updateItemField(${idx}, 'price', parseFloat(this.value) || 0)">
                                </td>
                                <td>
                                    <button class="btn-remove-item" onclick="removeItemFromEditOrder(${idx})" title="Eliminar producto">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>

            <!-- MOBILE CARDS -->
            <div class="mobile-edit-cards">
                ${items.map((item, idx) => {
                    const custom = item.customization || {};
                    const size = custom.size || item.size || 'M';
                    const version = custom.version || item.version || 'aficionado';
                    const name = custom.name || '';
                    const number = custom.number || '';
                    const patch = custom.patch || '';
                    const price = item.price !== undefined ? item.price : 19.90;
                    const qty = item.quantity || item.qty || 1;

                    return `
                        <div class="edit-item-card">
                            <div class="card-item-header">
                                <img src="${item.image || '/assets/placeholder.webp'}" class="card-item-thumb" alt="${sanitizeHTML(item.name || '')}" onerror="this.src='/assets/placeholder.webp'">
                                <div style="flex:1;min-width:0;">
                                    <input type="text" class="edit-input" value="${sanitizeHTML(item.name || '')}" 
                                           onchange="updateItemField(${idx}, 'name', this.value)" placeholder="Nombre del producto">
                                </div>
                                <button class="btn-remove-item" onclick="removeItemFromEditOrder(${idx})" title="Eliminar">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>

                            <div class="card-item-grid">
                                <div class="card-field">
                                    <label><i class="fas fa-ruler"></i> Talla</label>
                                    <select class="edit-select" onchange="updateItemField(${idx}, 'size', this.value)">
                                        ${standardSizes.map(s => `<option value="${s}" ${size === s ? 'selected' : ''}>${s}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="card-field">
                                    <label><i class="fas fa-bolt"></i> Versión</label>
                                    <select class="edit-select" onchange="updateItemField(${idx}, 'version', this.value)">
                                        <option value="aficionado" ${version === 'aficionado' ? 'selected' : ''}>Aficionado</option>
                                        <option value="jugador" ${version === 'jugador' ? 'selected' : ''}>Jugador (+5€)</option>
                                    </select>
                                </div>
                                <div class="card-field full-width">
                                    <label><i class="fas fa-font"></i> Nombre y Número</label>
                                    <div style="display:flex;gap:0.4rem;">
                                        <input type="text" class="edit-input" placeholder="Nombre (Ej: MESSI)" value="${sanitizeHTML(name)}" 
                                               onchange="updateItemField(${idx}, 'nameCustom', this.value)">
                                        <input type="text" class="edit-input" style="width:75px;" placeholder="Nº" value="${sanitizeHTML(number)}" 
                                               onchange="updateItemField(${idx}, 'numberCustom', this.value)">
                                    </div>
                                </div>
                                <div class="card-field full-width">
                                    <label><i class="fas fa-shield-alt"></i> Parches</label>
                                    <input type="text" class="edit-input" placeholder="Parches (Ej: Champions)" value="${sanitizeHTML(patch)}" 
                                           onchange="updateItemField(${idx}, 'patch', this.value)">
                                </div>
                                <div class="card-field">
                                    <label><i class="fas fa-cubes"></i> Cantidad</label>
                                    <input type="number" class="edit-input" min="1" max="99" value="${qty}" 
                                           onchange="updateItemField(${idx}, 'quantity', parseInt(this.value) || 1)">
                                </div>
                                <div class="card-field">
                                    <label><i class="fas fa-euro-sign"></i> Precio Un. (€)</label>
                                    <input type="number" step="0.01" class="edit-input" value="${parseFloat(price).toFixed(2)}" 
                                           onchange="updateItemField(${idx}, 'price', parseFloat(this.value) || 0)">
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <div class="add-product-bar">
                <div class="add-product-btn-wrap">
                    <button class="btn-add-product-trigger" onclick="toggleAddProductPanel()">
                        <i class="fas fa-plus-circle"></i> Añadir Nuevo Producto al Pedido
                    </button>
                    <button class="btn-refresh" style="background:#4f46e5;font-size:0.8rem;" onclick="recalculateModalOrderTotals()">
                        <i class="fas fa-calculator"></i> Recalcular Precios Automáticamente
                    </button>
                </div>

                <div class="add-product-panel hidden" id="add-product-panel">
                    <label style="font-size:0.85rem;color:#a0a0a0;display:block;margin-bottom:0.4rem;">
                        Buscar camiseta en el catálogo:
                    </label>
                    <input type="text" class="edit-input" id="add-product-search-input" 
                           placeholder="Escribe el nombre o equipo (ej. Real Madrid, Barcelona, España)..." 
                           oninput="searchAddProductCatalog(this.value)">
                    <div class="add-product-search-results hidden" id="add-product-search-results"></div>
                </div>
            </div>

            <!-- Total Recalculation Form -->
            <div class="edit-totals-grid">
                <div class="edit-total-field">
                    <label>Subtotal (€):</label>
                    <input type="number" step="0.01" class="edit-input" id="edit-order-subtotal" 
                           value="${(currentEditingOrder.subtotal || 0).toFixed(2)}" onchange="updateOrderTotalsFromInput()">
                </div>
                <div class="edit-total-field">
                    <label>Gastos de Envío (€):</label>
                    <input type="number" step="0.01" class="edit-input" id="edit-order-shipping" 
                           value="${(currentEditingOrder.shipping || 0).toFixed(2)}" onchange="updateOrderTotalsFromInput()">
                </div>
                <div class="edit-total-field">
                    <label>Descuento Total (€):</label>
                    <input type="number" step="0.01" class="edit-input" id="edit-order-discount" 
                           value="${(currentEditingOrder.discount || 0).toFixed(2)}" onchange="updateOrderTotalsFromInput()">
                </div>
                <div class="edit-total-field">
                    <label style="color:#10b981;font-weight:700;">TOTAL FINAL (€):</label>
                    <input type="number" step="0.01" class="edit-input" id="edit-order-total" 
                           style="border-color:#10b981;font-weight:700;color:#10b981;" 
                           value="${(currentEditingOrder.total || 0).toFixed(2)}">
                </div>
            </div>

            <div class="edit-actions-footer">
                <button class="btn-modal-cancel" onclick="cancelOrderEditMode()">
                    Cancelar
                </button>
                <button class="btn-save-order-changes" onclick="saveOrderEdits()">
                    <i class="fas fa-check-circle"></i> Guardar Cambios y Notificar Cliente
                </button>
            </div>
        </div>
    `;

    recalculateModalOrderTotals();
};

window.updateItemField = function (index, field, value) {
    if (!currentEditingItems[index]) return;

    const item = currentEditingItems[index];
    if (!item.customization) item.customization = {};

    if (field === 'size') {
        item.size = value;
        item.customization.size = value;
    } else if (field === 'version') {
        item.version = value;
        item.customization.version = value;
    } else if (field === 'nameCustom') {
        item.customization.name = value;
    } else if (field === 'numberCustom') {
        item.customization.number = value;
    } else if (field === 'patch') {
        item.patch = value;
        item.customization.patch = value;
    } else if (field === 'name') {
        item.name = value;
    } else if (field === 'quantity') {
        item.quantity = value;
        item.qty = value;
    } else if (field === 'price') {
        item.price = value;
    }

    recalculateModalOrderTotals();
};

window.removeItemFromEditOrder = function (index) {
    if (confirm('¿Eliminar este producto del pedido?')) {
        currentEditingItems.splice(index, 1);
        renderOrderEditMode();
    }
};

window.toggleAddProductPanel = async function () {
    const panel = document.getElementById('add-product-panel');
    if (!panel) return;

    if (panel.classList.contains('hidden')) {
        panel.classList.remove('hidden');
        await loadProductsCache();
        const input = document.getElementById('add-product-search-input');
        if (input) input.focus();
    } else {
        panel.classList.add('hidden');
    }
};

window.searchAddProductCatalog = async function (query) {
    const resultsContainer = document.getElementById('add-product-search-results');
    if (!resultsContainer) return;

    if (!query || query.trim().length < 2) {
        resultsContainer.innerHTML = '';
        resultsContainer.classList.add('hidden');
        return;
    }

    const catalog = await loadProductsCache();
    const cleanQuery = query.toLowerCase().trim();
    const matches = catalog.filter(p => p.name.toLowerCase().includes(cleanQuery) || (p.sku && p.sku.toLowerCase().includes(cleanQuery))).slice(0, 10);

    if (matches.length === 0) {
        resultsContainer.innerHTML = `<div style="padding:0.6rem;color:#888;font-size:0.85rem;">No se encontraron productos</div>`;
        resultsContainer.classList.remove('hidden');
        return;
    }

    resultsContainer.innerHTML = matches.map(p => `
        <div class="add-product-result-item" onclick="selectProductToAdd(${p.id})">
            <img src="${p.image || '/assets/placeholder.webp'}" alt="${sanitizeHTML(p.name)}" onerror="this.src='/assets/placeholder.webp'">
            <div style="flex:1;">
                <div style="font-weight:600;color:#fff;font-size:0.85rem;">${sanitizeHTML(p.name)}</div>
                <div style="font-size:0.75rem;color:#888;">SKU: ${sanitizeHTML(p.sku || '-')} | €${(p.price || 19.90).toFixed(2)}</div>
            </div>
            <button class="btn-modal-edit" style="font-size:0.75rem;padding:0.25rem 0.5rem;">
                <i class="fas fa-plus"></i> Añadir
            </button>
        </div>
    `).join('');

    resultsContainer.classList.remove('hidden');
};

window.selectProductToAdd = async function (productId) {
    const catalog = await loadProductsCache();
    const product = catalog.find(p => p.id === productId);
    if (!product) return;

    const newItem = {
        id: product.id,
        sku: product.sku || '',
        name: product.name,
        image: product.image || '/assets/placeholder.webp',
        quantity: 1,
        qty: 1,
        size: 'M',
        version: 'aficionado',
        price: product.price || 19.90,
        customization: {
            size: 'M',
            version: 'aficionado',
            name: '',
            number: '',
            patch: ''
        }
    };

    currentEditingItems.push(newItem);
    renderOrderEditMode();
};

window.recalculateModalOrderTotals = function () {
    let totalShirtQty = 0;
    let surcharges = 0;

    currentEditingItems.forEach(item => {
        const qty = parseInt(item.quantity || item.qty || 1);
        totalShirtQty += qty;

        const custom = item.customization || {};
        const version = custom.version || item.version || 'aficionado';
        const versionSurcharge = version === 'jugador' ? 5 : 0;

        const patch = custom.patch || item.patch || '';
        let patchSurcharge = 0;
        if (patch && patch !== 'none') {
            patchSurcharge = 2;
        }

        const name = custom.name || '';
        const number = custom.number || '';
        const personSurcharge = (name || number) ? 3 : 0;

        surcharges += (versionSurcharge + patchSurcharge + personSurcharge) * qty;
    });

    const fullCycles = Math.floor(totalShirtQty / 5);
    const remainder = totalShirtQty % 5;
    let packBasePrice = fullCycles * 85.90;
    if (remainder === 1) packBasePrice += 19.90;
    else if (remainder === 2) packBasePrice += 19.90 * 2;
    else if (remainder === 3) packBasePrice += 56.90;
    else if (remainder === 4) packBasePrice += 56.90 + 19.90;

    const calculatedSubtotal = Math.round((packBasePrice + surcharges) * 100) / 100;
    const shipping = totalShirtQty === 1 ? 1.90 : 0;
    const protectionFee = currentEditingOrder.protectionFee || 0;
    const discount = currentEditingOrder.discount || 0;
    const calculatedTotal = Math.max(0, Math.round((calculatedSubtotal + shipping + protectionFee - discount) * 100) / 100);

    const subtotalEl = document.getElementById('edit-order-subtotal');
    const shippingEl = document.getElementById('edit-order-shipping');
    const discountEl = document.getElementById('edit-order-discount');
    const totalEl = document.getElementById('edit-order-total');

    if (subtotalEl) subtotalEl.value = calculatedSubtotal.toFixed(2);
    if (shippingEl) shippingEl.value = shipping.toFixed(2);
    if (discountEl) discountEl.value = discount.toFixed(2);
    if (totalEl) totalEl.value = calculatedTotal.toFixed(2);

    currentEditingOrder.subtotal = calculatedSubtotal;
    currentEditingOrder.shipping = shipping;
    currentEditingOrder.total = calculatedTotal;
};

window.updateOrderTotalsFromInput = function () {
    const subtotal = parseFloat(document.getElementById('edit-order-subtotal')?.value || 0);
    const shipping = parseFloat(document.getElementById('edit-order-shipping')?.value || 0);
    const discount = parseFloat(document.getElementById('edit-order-discount')?.value || 0);
    const protectionFee = currentEditingOrder.protectionFee || 0;

    const total = Math.max(0, subtotal + shipping + protectionFee - discount);
    const totalEl = document.getElementById('edit-order-total');
    if (totalEl) totalEl.value = total.toFixed(2);
};

window.saveOrderEdits = async function () {
    if (!isAdmin) {
        alert('No tienes permisos de administrador');
        return;
    }

    if (!currentEditingOrder || !currentEditingOrder.path) {
        alert('Error: no se encontró la ruta del pedido');
        return;
    }

    if (currentEditingItems.length === 0) {
        if (!confirm('Atención: El pedido no tiene ningún producto. ¿Deseas guardar el pedido vacío?')) {
            return;
        }
    }

    const subtotal = parseFloat(document.getElementById('edit-order-subtotal')?.value || 0);
    const shipping = parseFloat(document.getElementById('edit-order-shipping')?.value || 0);
    const discount = parseFloat(document.getElementById('edit-order-discount')?.value || 0);
    const total = parseFloat(document.getElementById('edit-order-total')?.value || 0);
    const totalShirtQty = currentEditingItems.reduce((acc, i) => acc + (parseInt(i.quantity) || 1), 0);

    const updatedOrderData = {
        ...currentEditingOrder,
        items: currentEditingItems,
        subtotal: subtotal,
        shipping: shipping,
        discount: discount,
        total: total,
        pointsToEarn: totalShirtQty * 10,
        lastUpdated: new Date().toISOString(),
        updatedBy: auth.currentUser ? auth.currentUser.email : 'Admin'
    };

    try {
        const orderRef = ref(db, currentEditingOrder.path);
        await update(orderRef, updatedOrderData);

        currentEditingOrder = updatedOrderData;
        const localIndex = allOrders.findIndex(o => o.path === currentEditingOrder.path);
        if (localIndex !== -1) {
            allOrders[localIndex] = { ...updatedOrderData };
        }

        renderOrders();
        updateStats();

        showToast('¡Pedido actualizado y recalculado correctamente!');
        isOrderEditMode = false;
        renderOrderModalView();
    } catch (error) {
        console.error('Error al guardar edición del pedido:', error);
        alert('Error al guardar el pedido: ' + error.message);
    }
};

function closeModal() {
    isOrderEditMode = false;
    currentEditingOrder = null;
    const modalContent = document.querySelector('#order-modal .modal-content');
    if (modalContent) modalContent.classList.remove('full-screen-modal');
    document.getElementById('order-modal').classList.remove('active');
}
function showToast(message) {
    const existing = document.querySelector('.admin-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'admin-toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});
let allPromoCodes = [];

function loadPromoCodes() {
    const promoCodesRef = ref(db, 'promoCodes');

    onValue(promoCodesRef, (snapshot) => {
        allPromoCodes = [];

        if (snapshot.exists()) {
            const codesData = snapshot.val();
            Object.keys(codesData).forEach(codeId => {
                allPromoCodes.push({
                    ...codesData[codeId],
                    id: codeId
                });
            });
            allPromoCodes.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
        }

        renderPromoCodes();
    }, (error) => {
        console.error('Error loading promo codes:', error);
    });
}

function renderPromoCodes() {
    const tableBody = document.getElementById('promo-codes-body');
    const emptyState = document.getElementById('promo-empty-state');

    if (!tableBody) return;

    if (allPromoCodes.length === 0) {
        tableBody.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    tableBody.innerHTML = allPromoCodes.map(code => {
        let typeLabel, typeText;
        if (code.type === 'percentage') {
            typeLabel = `${code.value}%`;
            typeText = 'Porcentaje';
        } else if (code.type === 'free_shipping') {
            typeLabel = '🚚';
            typeText = 'Envío gratis';
        } else {
            typeLabel = `€${code.value}`;
            typeText = 'Fijo';
        }
        // Columna "Usos totales": usado / límite
        const usageText = code.maxUses
            ? `${code.usageCount || 0}/${code.maxUses}`
            : `${code.usageCount || 0}/∞`;
        // Columna "Por usuario": límite de usos por usuario
        const perUserText = code.maxUsesPerUser
            ? `${code.maxUsesPerUser} por usuario`
            : '∞';
        const statusClass = code.active ? 'active' : 'inactive';
        const statusText = code.active ? 'Activo' : 'Inactivo';

        return `
            <tr>
                <td class="promo-code-cell"><code>${code.code}</code></td>
                <td>${typeText}</td>
                <td class="promo-value-cell">${typeLabel}</td>
                <td>${usageText}</td>
                <td>${perUserText}</td>
                <td>
                    <span class="promo-status ${statusClass}">${statusText}</span>
                </td>
                <td class="promo-actions">
                    <button class="btn-toggle-promo ${code.active ? 'deactivate' : 'activate'}" 
                            onclick="togglePromoCode('${code.id}', ${!code.active})"
                            title="${code.active ? 'Desactivar' : 'Activar'}">
                        <i class="fas ${code.active ? 'fa-pause' : 'fa-play'}"></i>
                    </button>
                    <button class="btn-delete-promo" onclick="deletePromoCode('${code.id}', '${code.code}')" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

window.createPromoCode = async function () {
    if (!isAdmin) {
        alert('No tienes permisos');
        return;
    }

    const codeInput          = document.getElementById('promo-code');
    const typeSelect         = document.getElementById('promo-type');
    const valueInput         = document.getElementById('promo-value');
    const maxUsesInput       = document.getElementById('promo-max-uses');
    const maxUsesPerUserInput = document.getElementById('promo-max-uses-per-user');

    const code   = codeInput.value.trim().toUpperCase();
    const type   = typeSelect.value;
    let value    = parseFloat(valueInput.value) || 0;
    const maxUses         = maxUsesInput.value       ? parseInt(maxUsesInput.value)       : null;
    const maxUsesPerUser  = maxUsesPerUserInput.value ? parseInt(maxUsesPerUserInput.value) : null;

    if (type === 'free_shipping') {
        value = 0;
    }
    if (!code || code.length < 3) {
        alert('El código debe tener al menos 3 caracteres');
        return;
    }

    if (!/^[A-Z0-9]+$/.test(code)) {
        alert('El código solo puede contener letras y números');
        return;
    }
    if (type !== 'free_shipping' && (!value || value <= 0)) {
        alert('El valor debe ser mayor que 0');
        return;
    }

    if (type === 'percentage' && value > 100) {
        alert('El porcentaje no puede ser mayor que 100');
        return;
    }
    const existingCode = allPromoCodes.find(c => c.code === code);
    if (existingCode) {
        alert('Este código ya existe');
        return;
    }

    try {
        const newCodeRef = ref(db, `promoCodes/${code}`);
        await update(newCodeRef, {
            code: code,
            type: type,
            value: value,
            active: true,
            usageCount: 0,
            maxUses: maxUses,
            maxUsesPerUser: maxUsesPerUser,
            createdAt: new Date().toISOString(),
            createdBy: auth.currentUser.email
        });
        codeInput.value = '';
        valueInput.value = '';
        maxUsesInput.value = '';
        maxUsesPerUserInput.value = '';

        showToast(`Código "${code}" creado correctamente`);
    } catch (error) {
        console.error('Error creating promo code:', error);
        alert('Error al crear código: ' + error.message);
    }
};

window.togglePromoCode = async function (codeId, newStatus) {
    if (!isAdmin) {
        alert('No tienes permisos');
        return;
    }

    try {
        const codeRef = ref(db, `promoCodes/${codeId}`);
        await update(codeRef, {
            active: newStatus
        });

        showToast(`Código ${newStatus ? 'activado' : 'desactivado'}`);
    } catch (error) {
        console.error('Error toggling promo code:', error);
        alert('Error al cambiar estado: ' + error.message);
    }
};

window.deletePromoCode = async function (codeId, codeName) {
    if (!isAdmin) {
        alert('No tienes permisos');
        return;
    }

    if (!confirm(`¿Eliminar el código "${codeName}"?`)) {
        return;
    }

    try {
        const codeRef = ref(db, `promoCodes/${codeId}`);
        await remove(codeRef);

        showToast(`Código "${codeName}" eliminado`);
    } catch (error) {
        console.error('Error deleting promo code:', error);
        alert('Error al eliminar código: ' + error.message);
    }
};
function setupPromoCodeListeners() {
    const createBtn = document.getElementById('btn-create-promo');
    if (createBtn) {
        createBtn.addEventListener('click', createPromoCode);
    }
    const promoCodeInput = document.getElementById('promo-code');
    if (promoCodeInput) {
        promoCodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                createPromoCode();
            }
        });
    }
    const typeSelect = document.getElementById('promo-type');
    const valueInput = document.getElementById('promo-value');

    if (typeSelect && valueInput) {
        typeSelect.addEventListener('change', () => {
            if (typeSelect.value === 'free_shipping') {
                valueInput.value = '';
                valueInput.disabled = true;
                valueInput.placeholder = 'No aplica';
            } else {
                valueInput.disabled = false;
                valueInput.placeholder = 'Ej: 10';
            }
        });
    }
}
let allUsers = [];
let usersSearchFilter = '';

function loadAllUsers() {
    const loadingEl = document.getElementById('loading-users');
    const emptyEl = document.getElementById('users-empty-state');
    const tableBody = document.getElementById('users-table-body');

    if (!loadingEl || !tableBody) return;

    loadingEl.classList.remove('hidden');
    if (emptyEl) emptyEl.classList.add('hidden');
    tableBody.innerHTML = '';

    const usersRef = ref(db, 'users');

    onValue(usersRef, async (snapshot) => {
        allUsers = [];

        if (snapshot.exists()) {
            const usersData = snapshot.val();

            for (const [uid, userData] of Object.entries(usersData)) {
                const ordersSnapshot = await get(ref(db, `ordersByUser/${uid}`));
                let orderCount = 0;
                let emailFromOrder = '';
                let nameFromOrder = '';
                let dateFromOrder = '';

                if (ordersSnapshot.exists()) {
                    const orders = ordersSnapshot.val();
                    orderCount = Object.keys(orders).length;
                    const firstOrder = Object.values(orders)[0];
                    if (firstOrder) {
                        emailFromOrder = firstOrder.customerEmail || firstOrder.userEmail || '';
                        nameFromOrder = firstOrder.customerName || '';
                    }
                    const orderDates = Object.values(orders).map(o => o.date || o.createdAt).filter(d => d);
                    if (orderDates.length > 0) {
                        orderDates.sort((a, b) => new Date(a) - new Date(b));
                        dateFromOrder = orderDates[0];
                    }
                }

                allUsers.push({
                    uid: uid,
                    email: userData.email || emailFromOrder || 'Sin email',
                    username: userData.username || nameFromOrder || '',
                    pendingPoints: userData.pendingPoints || 0,
                    availablePoints: userData.availablePoints || 0,
                    createdAt: userData.createdAt || userData.verifiedAt || dateFromOrder || '',
                    orderCount: orderCount
                });
            }
            allUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        loadingEl.classList.add('hidden');
        renderUsers();

    }, (error) => {
        console.error('Error loading users:', error);
        loadingEl.classList.add('hidden');
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="error-message">
                    <i class="fas fa-lock"></i>
                    Error al cargar usuarios: ${error.message}
                </td>
            </tr>
        `;
    });
}

function renderUsers() {
    const tableBody = document.getElementById('users-table-body');
    const emptyEl = document.getElementById('users-empty-state');

    if (!tableBody) return;
    let filtered = allUsers;
    if (usersSearchFilter) {
        const search = usersSearchFilter.toLowerCase();
        filtered = allUsers.filter(u =>
            (u.email && u.email.toLowerCase().includes(search)) ||
            (u.username && u.username.toLowerCase().includes(search))
        );
    }

    if (filtered.length === 0) {
        tableBody.innerHTML = '';
        if (emptyEl) emptyEl.classList.remove('hidden');
        return;
    }

    if (emptyEl) emptyEl.classList.add('hidden');

    tableBody.innerHTML = filtered.map(user => {
        const totalPoints = user.availablePoints + user.pendingPoints;
        const dateStr = user.createdAt
            ? new Date(user.createdAt).toLocaleDateString('es-ES')
            : 'N/A';

        return `
            <tr>
                <td class="user-email">${user.email}</td>
                <td>${user.username || '<em>Sin nombre</em>'}</td>
                <td class="text-center">${user.orderCount}</td>
                <td class="text-center">
                    <span class="points-badge">
                        ${user.availablePoints} <small>(+${user.pendingPoints} pend.)</small>
                    </span>
                </td>
                <td class="text-center">${dateStr}</td>
                <td class="user-actions">
                    <button class="btn-view-user" onclick="viewUserDetails('${user.uid}')" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-edit-points" onclick="openEditPoints('${user.uid}')" title="Modificar puntos">
                        <i class="fas fa-coins"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

window.viewUserDetails = async function (uid) {
    const user = allUsers.find(u => u.uid === uid);
    if (!user) return;

    const modal = document.getElementById('user-modal');
    const modalBody = document.getElementById('user-modal-body');

    if (!modal || !modalBody) return;
    let ordersHtml = '<p>Cargando pedidos...</p>';
    try {
        const ordersSnapshot = await get(ref(db, `ordersByUser/${uid}`));
        if (ordersSnapshot.exists()) {
            const orders = Object.entries(ordersSnapshot.val()).map(([id, order]) => ({
                id, ...order
            })).sort((a, b) => new Date(b.date) - new Date(a.date));

            ordersHtml = `
                <table class="user-orders-table">
                    <thead>
                        <tr>
                            <th>Pedido</th>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orders.map(o => `
                            <tr>
                                <td>#${o.orderId || o.id}</td>
                                <td>${new Date(o.date).toLocaleDateString('es-ES')}</td>
                                <td>€${(o.total || 0).toFixed(2)}</td>
                                <td><span class="status-badge status-${o.status}">${o.status}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            ordersHtml = '<p class="no-orders">Este usuario no tiene pedidos.</p>';
        }
    } catch (err) {
        console.error('Error loading user orders:', err);
        ordersHtml = `<p class="error">Error al cargar pedidos: ${err.message}</p>`;
    }

    modalBody.innerHTML = `
        <div class="user-detail-grid">
            <div class="user-info-section">
                <h3><i class="fas fa-user"></i> Información</h3>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Nombre:</strong> ${user.username || 'Sin nombre'}</p>
                <p><strong>UID:</strong> <code>${user.uid}</code></p>
                <p><strong>Fecha de registro:</strong> ${user.createdAt ? new Date(user.createdAt).toLocaleString('es-ES') : 'N/A'}</p>
            </div>
            
            <div class="user-points-section">
                <h3><i class="fas fa-coins"></i> Puntos</h3>
                <div class="points-display">
                    <div class="point-box available">
                        <span class="value">${user.availablePoints}</span>
                        <span class="label">Disponibles</span>
                    </div>
                    <div class="point-box pending">
                        <span class="value">${user.pendingPoints}</span>
                        <span class="label">Pendientes</span>
                    </div>
                </div>
                <button class="btn-modify-points" onclick="openEditPoints('${user.uid}')">
                    <i class="fas fa-edit"></i> Modificar puntos
                </button>
            </div>
        </div>
        
        <div class="user-orders-section">
            <h3><i class="fas fa-shopping-bag"></i> Pedidos (${user.orderCount})</h3>
            ${ordersHtml}
        </div>
    `;

    modal.classList.add('active');
};

window.openEditPoints = function (uid) {
    const user = allUsers.find(u => u.uid === uid);
    if (!user) return;

    const newAvailable = prompt(
        `Modificar puntos DISPONIBLES para ${user.email}\nValor actual: ${user.availablePoints}\n\nIntroduce el nuevo valor:`,
        user.availablePoints
    );

    if (newAvailable === null) return;

    const points = parseInt(newAvailable);
    if (isNaN(points) || points < 0) {
        alert('Por favor, introduce un número válido (>= 0)');
        return;
    }

    modifyUserPoints(uid, points, 'available');
};

async function modifyUserPoints(uid, newValue, type = 'available') {
    try {
        const field = type === 'available' ? 'availablePoints' : 'pendingPoints';
        const userRef = ref(db, `users/${uid}/${field}`);
        await set(userRef, newValue);
        const historyRef = ref(db, `users/${uid}/pointsHistory`);
        await push(historyRef, {
            type: 'admin_modification',
            points: newValue,
            timestamp: new Date().toISOString(),
            description: `Puntos modificados por admin a ${newValue}`,
            modifiedBy: auth.currentUser.email
        });

        showToast('Puntos actualizados correctamente');
        const modal = document.getElementById('user-modal');
        if (modal && modal.classList.contains('active')) {
            viewUserDetails(uid);
        }
    } catch (error) {
        console.error('Error modifying points:', error);
        alert('Error al modificar puntos: ' + error.message);
    }
}

function setupUsersListeners() {
    const searchInput = document.getElementById('search-users');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            usersSearchFilter = e.target.value;
            renderUsers();
        });
    }
    const refreshBtn = document.getElementById('btn-refresh-users');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadAllUsers);
    }
    const userModalClose = document.getElementById('user-modal-close');
    const userModal = document.getElementById('user-modal');

    if (userModalClose && userModal) {
        userModalClose.addEventListener('click', () => {
            userModal.classList.remove('active');
        });

        userModal.addEventListener('click', (e) => {
            if (e.target === userModal) {
                userModal.classList.remove('active');
            }
        });
    }
}

// ══════════════════════════════════════════════════════════════════════════════
// PRODUCTOS FIJADOS — Firebase RTDB (lectura pública / escritura solo admin)
// Nodo: /pinnedProducts  →  { ids: "[101,205,…]", updatedAt: "ISO" }
// ══════════════════════════════════════════════════════════════════════════════
let pinnedIds = []; // ordered array of product ids (numbers) — in-memory state
let allProductsCache = null; // product catalogue loaded lazily

async function loadProductsCache() {
    if (allProductsCache) return allProductsCache;
    try {
        const mod = await import('./products-data.js');
        allProductsCache = mod.default || mod.products || [];
    } catch {
        allProductsCache = [];
    }
    return allProductsCache;
}

function updatePinnedBadge() {
    const badge = document.getElementById('pinned-count-badge');
    if (badge) badge.textContent = pinnedIds.length === 1 ? '1 fijado' : `${pinnedIds.length} fijados`;
}

function renderPinnedList(products) {
    const list  = document.getElementById('pinned-list');
    const empty = document.getElementById('pinned-empty');
    if (!list || !empty) return;

    if (pinnedIds.length === 0) {
        list.innerHTML = '';
        empty.style.display = 'flex';
        updatePinnedBadge();
        return;
    }
    empty.style.display = 'none';
    updatePinnedBadge();

    list.innerHTML = pinnedIds.map((id, idx) => {
        const p     = products.find(x => x.id === id);
        const name  = p ? p.name  : `ID ${id} (no encontrado)`;
        const sku   = p ? (p.sku  || '') : '';
        const thumb = p ? (p.image || '') : '';
        return `
        <li class="pinned-item" data-id="${id}" draggable="true">
            <span class="pinned-drag-handle" title="Arrastra para reordenar">
                <i class="fas fa-grip-vertical"></i>
            </span>
            <span class="pinned-pos">${idx + 1}</span>
            ${thumb
                ? `<img class="pinned-thumb" src="${thumb}" alt="" loading="lazy">`
                : '<div class="pinned-thumb-placeholder"><i class="fas fa-tshirt"></i></div>'}
            <div class="pinned-info">
                <span class="pinned-name">${name}</span>
                ${sku ? `<span class="pinned-sku">SKU: ${sku}</span>` : ''}
            </div>
            <button class="pinned-remove-btn" data-id="${id}" title="Quitar del fijado">
                <i class="fas fa-times"></i>
            </button>
        </li>`;
    }).join('');

    list.querySelectorAll('.pinned-remove-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            pinnedIds = pinnedIds.filter(x => x !== Number(btn.dataset.id));
            renderPinnedList(await loadProductsCache());
        });
    });

    initPinnedDragDrop(list, products);
}

function initPinnedDragDrop(list, products) {
    let dragSrc = null;

    list.querySelectorAll('.pinned-item').forEach(item => {
        item.addEventListener('dragstart', e => {
            dragSrc = item;
            item.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });
        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
            list.querySelectorAll('.pinned-item').forEach(i => i.classList.remove('drag-over'));
        });
        item.addEventListener('dragover', e => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            list.querySelectorAll('.pinned-item').forEach(i => i.classList.remove('drag-over'));
            if (item !== dragSrc) item.classList.add('drag-over');
        });
        item.addEventListener('drop', e => {
            e.preventDefault();
            if (!dragSrc || dragSrc === item) return;
            const fromId  = Number(dragSrc.dataset.id);
            const toId    = Number(item.dataset.id);
            const fromIdx = pinnedIds.indexOf(fromId);
            const toIdx   = pinnedIds.indexOf(toId);
            pinnedIds.splice(fromIdx, 1);
            pinnedIds.splice(toIdx, 0, fromId);
            renderPinnedList(products);
        });
    });
}

async function initPinnedProducts() {
    const products = await loadProductsCache();

    // ── Carga inicial desde Firebase RTDB (nodo público) ─────────────────
    try {
        const snapshot = await get(ref(db, 'pinnedProducts'));
        if (snapshot.exists()) {
            const data = snapshot.val();
            pinnedIds = data && typeof data.ids === 'string'
                ? JSON.parse(data.ids).map(Number)
                : [];
        } else {
            pinnedIds = [];
        }
    } catch (err) {
        console.error('[Pinned] Error loading from Firebase:', err);
        pinnedIds = [];
    }

    renderPinnedList(products);

    // ── Buscador de productos ──────────────────────────────────────────────
    const searchInput = document.getElementById('pinned-search-input');
    const searchClear = document.getElementById('pinned-search-clear');
    const suggestions = document.getElementById('pinned-suggestions');
    if (!searchInput || !suggestions) return;

    function normalizeStr(s) {
        return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    }

    function showSuggestions(query) {
        const q = normalizeStr(query);
        if (!q || q.length < 2) {
            suggestions.innerHTML = '';
            suggestions.classList.remove('active');
            return;
        }
        const matches = products
            .filter(p => normalizeStr(`${p.name} ${p.sku || ''} ${p.league || ''}`).includes(q))
            .slice(0, 8);

        if (!matches.length) {
            suggestions.innerHTML = '<div class="pinned-sug-empty">Sin resultados</div>';
            suggestions.classList.add('active');
            return;
        }

        suggestions.innerHTML = matches.map(p => {
            const already = pinnedIds.includes(p.id);
            return `
            <div class="pinned-sug-item${already ? ' already-pinned' : ''}" data-id="${p.id}">
                ${p.image
                    ? `<img src="${p.image}" alt="" class="sug-thumb" loading="lazy">`
                    : '<div class="sug-thumb-placeholder"><i class="fas fa-tshirt"></i></div>'}
                <div class="sug-info">
                    <span class="sug-name">${p.name}</span>
                    <span class="sug-meta">${p.league || ''}${p.sku ? ' · SKU: ' + p.sku : ''}</span>
                </div>
                <button class="sug-pin-btn" data-id="${p.id}"${already ? ' disabled' : ''}>
                    ${already
                        ? '<i class="fas fa-check"></i> Fijado'
                        : '<i class="fas fa-thumbtack"></i> Fijar'}
                </button>
            </div>`;
        }).join('');

        // Pin from suggestion
        suggestions.querySelectorAll('.sug-pin-btn:not([disabled])').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = Number(btn.dataset.id);
                if (!pinnedIds.includes(id)) {
                    pinnedIds.push(id);
                    renderPinnedList(products);
                    // Update suggestion row in-place
                    const row = suggestions.querySelector(`.pinned-sug-item[data-id="${id}"]`);
                    if (row) {
                        row.classList.add('already-pinned');
                        btn.disabled = true;
                        btn.innerHTML = '<i class="fas fa-check"></i> Fijado';
                    }
                }
            });
        });

        suggestions.classList.add('active');
    }

    searchInput.addEventListener('input', () => showSuggestions(searchInput.value.trim()));
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim().length >= 2) showSuggestions(searchInput.value.trim());
    });
    searchClear.addEventListener('click', () => {
        searchInput.value = '';
        suggestions.innerHTML = '';
        suggestions.classList.remove('active');
        searchInput.focus();
    });
    document.addEventListener('click', e => {
        if (!e.target.closest('.pinned-search-wrap')) suggestions.classList.remove('active');
    });

    // ── Guardar en Firebase RTDB (escritura protegida: solo admin) ─────────
    const saveBtn = document.getElementById('btn-pinned-save');
    if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando…';
            try {
                await set(ref(db, 'pinnedProducts'), {
                    ids: JSON.stringify(pinnedIds),
                    updatedAt: new Date().toISOString()
                });
                saveBtn.innerHTML = '<i class="fas fa-check"></i> ¡Guardado!';
                saveBtn.classList.add('saved');
            } catch (err) {
                console.error('[Pinned] Error saving:', err);
                saveBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error al guardar';
                saveBtn.style.background = 'linear-gradient(135deg,#ef4444,#dc2626)';
            } finally {
                saveBtn.disabled = false;
                setTimeout(() => {
                    saveBtn.innerHTML = '<i class="fas fa-save"></i> Guardar y aplicar';
                    saveBtn.classList.remove('saved');
                    saveBtn.style.background = '';
                }, 2500);
            }
        });
    }

    // ── Quitar todos ───────────────────────────────────────────────────────
    const clearAll = document.getElementById('btn-pinned-clear-all');
    if (clearAll) {
        clearAll.addEventListener('click', async () => {
            if (!pinnedIds.length || !confirm('¿Quitar todos los productos fijados?')) return;
            pinnedIds = [];
            renderPinnedList(products);
            try {
                await set(ref(db, 'pinnedProducts'), {
                    ids: JSON.stringify([]),
                    updatedAt: new Date().toISOString()
                });
            } catch (err) {
                console.error('[Pinned] Error clearing:', err);
            }
        });
    }
}

/* ══════════════════════════════════════════════════
   EDITOR TOTAL DE PRODUCTOS & BIBLIOTECA GLOBAL DE PARCHES
   ══════════════════════════════════════════════════ */
let editingProduct = null;
let globalPatchesList = []; // Patches from /globalPatches node
let selectedGlobalPatchKeys = new Set(); // Active global patches for editing product
let exclusivePatches = []; // Custom exclusive patches for editing product

const KNOWN_LEAGUE_MAP = {
    'laliga': 'La Liga',
    'premier': 'Premier League',
    'seriea': 'Serie A',
    'bundesliga': 'Bundesliga',
    'ligue1': 'Ligue 1',
    'retro': 'Retro',
    'selecciones': 'Selecciones',
    'brasileirao': 'Brasileirão',
    'ligaarabe': 'Liga Árabe',
    'saf': 'SAF (Argentina)',
    'nba': 'NBA',
    'eredivisie': 'Eredivisie',
    'ligaportugal': 'Liga Portugal',
    'mls': 'MLS',
    'ligamx': 'Liga MX'
};

function formatLeagueName(rawLeague) {
    if (!rawLeague) return '';
    const key = rawLeague.toLowerCase().trim();
    return KNOWN_LEAGUE_MAP[key] || rawLeague;
}

function extractTeamFromProductName(productName) {
    if (!productName) return '';
    return productName
        .replace(/\s*\d{2}\/?\d{2}.*$/i, '')
        .replace(/\s*\(Niño\).*$/i, '')
        .replace(/\s*(Local|Visitante|Tercera|Cuarta|Especial|Retro|Entrenamiento|Portero|Edición Especial|Campeones|Manga Larga).*$/i, '')
        .trim();
}

async function populateEditorLeagueDropdown() {
    const select = document.getElementById('pe-league-select');
    if (!select) return;

    const catalog = await loadProductsCache();
    const leaguesSet = new Set();

    catalog.forEach(p => {
        if (p.league) {
            leaguesSet.add(formatLeagueName(p.league));
        }
    });

    select.innerHTML = '<option value="">-- Seleccionar Liga --</option>';
    [...leaguesSet].sort().forEach(l => {
        const opt = document.createElement('option');
        opt.value = l;
        opt.textContent = l;
        select.appendChild(opt);
    });

    const newOpt = document.createElement('option');
    newOpt.value = '__new__';
    newOpt.textContent = '+ Añadir nueva liga...';
    select.appendChild(newOpt);
}

async function populateEditorTeamDropdown(selectedLeague) {
    const teamSelect = document.getElementById('pe-team-select');
    if (!teamSelect) return;

    const catalog = await loadProductsCache();
    const teamsSet = new Set();

    catalog.forEach(p => {
        const pLeague = formatLeagueName(p.league);
        if (!selectedLeague || !pLeague || pLeague.toLowerCase() === selectedLeague.toLowerCase() || (p.league && p.league.toLowerCase() === selectedLeague.toLowerCase())) {
            let tName = p.team || extractTeamFromProductName(p.name);
            if (tName) teamsSet.add(tName);
        }
    });

    teamSelect.innerHTML = '<option value="">-- Seleccionar Equipo --</option>';
    [...teamsSet].sort().forEach(t => {
        const opt = document.createElement('option');
        opt.value = t;
        opt.textContent = t;
        teamSelect.appendChild(opt);
    });

    const newOpt = document.createElement('option');
    newOpt.value = '__new__';
    newOpt.textContent = '+ Añadir nuevo equipo...';
    teamSelect.appendChild(newOpt);
}

function initLeagueAndTeamHandlers() {
    const leagueSelect = document.getElementById('pe-league-select');
    const leagueCustom = document.getElementById('pe-league-custom');
    const teamSelect = document.getElementById('pe-team-select');
    const teamCustom = document.getElementById('pe-team-custom');

    if (leagueSelect) {
        leagueSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            if (val === '__new__') {
                if (leagueCustom) {
                    leagueCustom.classList.remove('hidden');
                    leagueCustom.focus();
                }
                populateEditorTeamDropdown('');
            } else {
                if (leagueCustom) {
                    leagueCustom.classList.add('hidden');
                    leagueCustom.value = '';
                }
                populateEditorTeamDropdown(val);
            }
            if (teamCustom) {
                teamCustom.classList.add('hidden');
                teamCustom.value = '';
            }
        });
    }

    if (teamSelect) {
        teamSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            if (val === '__new__') {
                if (teamCustom) {
                    teamCustom.classList.remove('hidden');
                    teamCustom.focus();
                }
            } else {
                if (teamCustom) {
                    teamCustom.classList.add('hidden');
                    teamCustom.value = '';
                }
            }
        });
    }
}

async function fetchGlobalPatches() {
    try {
        const snap = await get(ref(db, 'globalPatches'));
        if (snap.exists()) {
            const data = snap.val();
            globalPatchesList = Object.keys(data).map(key => ({
                key,
                ...data[key]
            }));
        } else {
            globalPatchesList = [];
        }
    } catch (err) {
        console.error('[GlobalPatches] Error fetching global patches:', err);
    }
}

function initProductEditor() {
    const btnOpen = document.getElementById('btn-open-product-editor');
    const modal = document.getElementById('product-editor-modal');
    const btnClose = document.getElementById('product-editor-close');

    if (!btnOpen || !modal) return;

    initLeagueAndTeamHandlers();
    populateEditorLeagueDropdown();

    btnOpen.addEventListener('click', (e) => {
        if (e) e.preventDefault();
        modal.classList.add('active');
        resetEditorForm();
    });

    btnClose.addEventListener('click', (e) => {
        if (e) e.preventDefault();
        modal.classList.remove('active');
    });
    
    // Cerrar clickeando fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    // Pestañas
    const tabs = document.querySelectorAll('.pe-tab');
    const tabContents = document.querySelectorAll('.pe-tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            if (e) e.preventDefault();
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.add('hidden'));
            tab.classList.add('active');
            document.getElementById(`pe-tab-${tab.dataset.tab}`).classList.remove('hidden');
            document.getElementById(`pe-tab-${tab.dataset.tab}`).classList.add('active');
        });
    });

    // Buscador
    const searchInput = document.getElementById('pe-search-input');
    const suggestions = document.getElementById('pe-suggestions');
    const searchClear = document.getElementById('pe-search-clear');
    
    async function doProductSearch() {
        if (!searchInput) return;
        const query = searchInput.value.toLowerCase().trim();
        if (query.length < 2) {
            if (suggestions) suggestions.classList.remove('active');
            return;
        }
        
        const catalog = await loadProductsCache();
        const results = catalog.filter(p => 
            (p.name && p.name.toLowerCase().includes(query)) ||
            (p.sku && p.sku.toLowerCase().includes(query)) ||
            (p.league && p.league.toLowerCase().includes(query))
        ).slice(0, 15);
        
        renderPESuggestions(results);
    }

    if (searchInput) {
        searchInput.addEventListener('input', doProductSearch);
        searchInput.addEventListener('focus', doProductSearch);
    }

    // Cerrar sugerencias al hacer clic fuera del buscador
    document.addEventListener('click', (e) => {
        const searchSection = document.querySelector('.pe-search-section');
        if (searchSection && !searchSection.contains(e.target) && suggestions) {
            suggestions.classList.remove('active');
        }
    });

    if (searchClear) {
        searchClear.addEventListener('click', (e) => {
            if (e) e.preventDefault();
            if (searchInput) searchInput.value = '';
            if (suggestions) suggestions.classList.remove('active');
            resetEditorForm();
        });
    }

    // Subida de imagen principal a Base64
    const imageUpload = document.getElementById('pe-image-upload');
    const imagePreview = document.getElementById('pe-image-preview');
    const imageBase64Input = document.getElementById('pe-image-base64');
    
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const b64 = event.target.result;
            imagePreview.src = b64;
            imageBase64Input.value = b64;
        };
        reader.readAsDataURL(file);
    });

    // Subida de imagen para NUEVO PARCHE GLOBAL
    const newGpFile = document.getElementById('pe-new-gp-file');
    const newGpPreview = document.getElementById('pe-new-gp-preview');
    const newGpB64 = document.getElementById('pe-new-gp-b64');
    if (newGpFile) {
        newGpFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                const b64 = event.target.result;
                if (newGpPreview) newGpPreview.src = b64;
                if (newGpB64) newGpB64.value = b64;
            };
            reader.readAsDataURL(file);
        });
    }

    // Botón GUARDAR EN BIBLIOTECA GLOBAL Y ASIGNAR
    const btnSaveGlobalPatch = document.getElementById('btn-save-global-patch');
    if (btnSaveGlobalPatch) {
        btnSaveGlobalPatch.addEventListener('click', saveNewGlobalPatch);
    }

    // Botón AÑADIR PARCHE EXCLUSIVO
    const btnAddExclusivePatch = document.getElementById('btn-add-exclusive-patch');
    if (btnAddExclusivePatch) {
        btnAddExclusivePatch.addEventListener('click', (e) => {
            if (e) e.preventDefault();
            exclusivePatches.push({ name: '', price: 2.00, image: '' });
            renderExclusivePatchesList();
        });
    }

    // Guardar Producto
    const btnSave = document.getElementById('btn-save-product');
    if (btnSave) {
        btnSave.addEventListener('click', (e) => {
            if (e) e.preventDefault();
            saveProductToFirebase();
        });
    }
}

function renderPESuggestions(results) {
    const suggestions = document.getElementById('pe-suggestions');
    if (!suggestions) return;
    suggestions.innerHTML = '';
    
    if (results.length === 0) {
        suggestions.innerHTML = '<div style="padding:0.85rem 1rem;color:#94a3b8;font-size:0.88rem;text-align:center;">No se encontraron productos</div>';
    } else {
        results.forEach(p => {
            const div = document.createElement('div');
            div.className = 'pe-suggestion-item';
            div.innerHTML = `
                <img src="${p.image || '../assets/placeholder.webp'}" alt="${p.name}">
                <div class="pe-suggestion-item-info">
                    <span class="pe-suggestion-item-name">${p.name}</span>
                    <span class="pe-suggestion-item-sku">SKU: ${p.sku || '-'} | ID: ${p.id}</span>
                </div>
            `;
            div.addEventListener('click', async (e) => {
                if (e) e.preventDefault();
                e.stopPropagation();
                suggestions.classList.remove('active');
                const searchInput = document.getElementById('pe-search-input');
                if (searchInput) searchInput.value = p.name;
                await loadProductIntoEditor(p.id);
            });
            suggestions.appendChild(div);
        });
    }
    suggestions.classList.add('active');
}

function resetEditorForm() {
    document.getElementById('pe-editor-form').classList.add('hidden');
    editingProduct = null;
    selectedGlobalPatchKeys.clear();
    exclusivePatches = [];
}

async function loadProductIntoEditor(productId) {
    const catalog = await loadProductsCache();
    const staticProduct = catalog.find(p => p.id === productId);
    
    if (!staticProduct) {
        alert('Producto no encontrado');
        return;
    }
    
    // Cargar biblioteca de parches globales y ligas
    await fetchGlobalPatches();
    await populateEditorLeagueDropdown();

    // Buscar si existe en Firebase
    let productData = { ...staticProduct };
    try {
        const snap = await get(ref(db, `products/${productId}`));
        if (snap.exists()) {
            productData = { ...productData, ...snap.val() };
        }
    } catch (err) {
        console.error('Error fetching product from Firebase', err);
    }

    editingProduct = productData;
    
    document.getElementById('pe-id').value = productData.id;
    document.getElementById('pe-name').value = productData.name || '';
    document.getElementById('pe-price').value = productData.price || '';
    document.getElementById('pe-oldPrice').value = productData.oldPrice || '';
    document.getElementById('pe-sku').value = productData.sku || '';

    // Cargar Liga
    const formattedLeague = formatLeagueName(productData.league);
    const leagueSelect = document.getElementById('pe-league-select');
    const leagueCustom = document.getElementById('pe-league-custom');
    
    let hasLeagueOption = false;
    if (leagueSelect) {
        for (let i = 0; i < leagueSelect.options.length; i++) {
            if (leagueSelect.options[i].value.toLowerCase() === formattedLeague.toLowerCase()) {
                leagueSelect.selectedIndex = i;
                hasLeagueOption = true;
                break;
            }
        }
        if (!hasLeagueOption && formattedLeague) {
            leagueSelect.value = '__new__';
            if (leagueCustom) {
                leagueCustom.classList.remove('hidden');
                leagueCustom.value = formattedLeague;
            }
        } else if (leagueCustom) {
            leagueCustom.classList.add('hidden');
            leagueCustom.value = '';
        }
    }

    // Cargar Equipo según Liga
    await populateEditorTeamDropdown(formattedLeague);
    
    const formattedTeam = productData.team || extractTeamFromProductName(productData.name);
    const teamSelect = document.getElementById('pe-team-select');
    const teamCustom = document.getElementById('pe-team-custom');

    let hasTeamOption = false;
    if (teamSelect) {
        for (let i = 0; i < teamSelect.options.length; i++) {
            if (teamSelect.options[i].value.toLowerCase() === formattedTeam.toLowerCase()) {
                teamSelect.selectedIndex = i;
                hasTeamOption = true;
                break;
            }
        }
        if (!hasTeamOption && formattedTeam) {
            teamSelect.value = '__new__';
            if (teamCustom) {
                teamCustom.classList.remove('hidden');
                teamCustom.value = formattedTeam;
            }
        } else if (teamCustom) {
            teamCustom.classList.add('hidden');
            teamCustom.value = '';
        }
    }

    document.getElementById('pe-isActive').checked = productData.isActive !== false;
    
    // Config
    document.getElementById('pe-allowCustomization').checked = productData.allowCustomization !== false;
    document.getElementById('pe-customizationPrice').value = productData.customizationPrice || 0;
    document.getElementById('pe-allowPatches').checked = productData.allowPatches !== false;
    
    // Clasificar parches guardados entre Globales y Exclusivos
    selectedGlobalPatchKeys.clear();
    exclusivePatches = [];

    const rawPatches = Array.isArray(productData.patches) 
        ? productData.patches 
        : (Array.isArray(productData.customPatches) ? productData.customPatches : []);

    rawPatches.forEach(patch => {
        if (typeof patch === 'object' && patch !== null) {
            // Comprobar si coincide con algún parche global por key o por nombre
            const matchGlobal = globalPatchesList.find(gp => gp.key === patch.key || (gp.name && gp.name.trim().toLowerCase() === patch.name.trim().toLowerCase()));
            if (matchGlobal) {
                selectedGlobalPatchKeys.add(matchGlobal.key);
            } else {
                exclusivePatches.push({ ...patch });
            }
        }
    });

    renderPatchesTab();

    // Imagen
    document.getElementById('pe-image-preview').src = productData.image || '/assets/placeholder.webp';
    document.getElementById('pe-image-base64').value = productData.image || '';

    // Resetear pestaña activa a "basic"
    const tabs = document.querySelectorAll('.pe-tab');
    const tabContents = document.querySelectorAll('.pe-tab-content');
    tabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(c => c.classList.add('hidden'));
    const defaultTab = document.querySelector('.pe-tab[data-tab="basic"]');
    if (defaultTab) defaultTab.classList.add('active');
    const defaultContent = document.getElementById('pe-tab-basic');
    if (defaultContent) defaultContent.classList.remove('hidden');

    document.getElementById('pe-editor-form').classList.remove('hidden');
}

function renderPatchesTab() {
    renderGlobalPatchesList();
    renderExclusivePatchesList();
}

function renderGlobalPatchesList() {
    const list = document.getElementById('pe-global-patches-list');
    if (!list) return;
    list.innerHTML = '';

    if (globalPatchesList.length === 0) {
        list.innerHTML = '<div style="color:#888; font-size:0.85rem; font-style:italic; padding:0.5rem 0;">No hay parches en la biblioteca global aún. ¡Crea uno abajo en la sección 2!</div>';
        return;
    }

    globalPatchesList.forEach(gp => {
        const item = document.createElement('label');
        item.className = 'pe-global-patch-item';
        
        const isChecked = selectedGlobalPatchKeys.has(gp.key);
        
        item.innerHTML = `
            <input type="checkbox" value="${gp.key}" ${isChecked ? 'checked' : ''}>
            <img src="${gp.image || '../assets/placeholder.webp'}" class="pe-global-patch-img" alt="${gp.name}">
            <div class="pe-global-patch-info">
                <span class="pe-global-patch-name">${gp.name}</span>
                <span class="pe-global-patch-price">+€${(parseFloat(gp.price) || 0).toFixed(2)}</span>
            </div>
            <span style="font-size:0.75rem; background:rgba(99,102,241,0.15); color:#818cf8; padding:0.2rem 0.5rem; border-radius:4px; font-weight:600;">Global</span>
        `;

        const checkbox = item.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                selectedGlobalPatchKeys.add(gp.key);
            } else {
                selectedGlobalPatchKeys.delete(gp.key);
            }
        });

        list.appendChild(item);
    });
}

async function saveNewGlobalPatch(e) {
    if (e) e.preventDefault();
    const nameInput = document.getElementById('pe-new-gp-name');
    const priceInput = document.getElementById('pe-new-gp-price');
    const b64Input = document.getElementById('pe-new-gp-b64');
    const previewImg = document.getElementById('pe-new-gp-preview');
    const btn = document.getElementById('btn-save-global-patch');

    const name = nameInput ? nameInput.value.trim() : '';
    const price = priceInput ? (parseFloat(priceInput.value) || 0) : 2.00;
    const image = b64Input ? b64Input.value : '';

    if (!name) {
        alert('Ingresa el nombre del nuevo parche global.');
        return;
    }

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando en Biblioteca...';
    }

    try {
        const newRef = push(ref(db, 'globalPatches'));
        const patchData = {
            key: newRef.key,
            name,
            price,
            image,
            createdAt: new Date().toISOString()
        };

        await set(newRef, patchData);

        // Añadir localmente y auto-seleccionar
        globalPatchesList.push(patchData);
        selectedGlobalPatchKeys.add(patchData.key);

        // Resetear campos del formulario
        if (nameInput) nameInput.value = '';
        if (priceInput) priceInput.value = '2.00';
        if (b64Input) b64Input.value = '';
        if (previewImg) previewImg.src = '../assets/placeholder.webp';

        renderPatchesTab();
        alert(`¡Parche "${name}" guardado en la Biblioteca Global y asignado a esta camiseta!`);
    } catch (err) {
        console.error('Error saving global patch:', err);
        alert('Error al guardar en la biblioteca global: ' + err.message);
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-save"></i> Guardar en Biblioteca y Asignar';
        }
    }
}

function renderExclusivePatchesList() {
    const list = document.getElementById('pe-exclusive-patches-list');
    if (!list) return;
    list.innerHTML = '';
    
    if (exclusivePatches.length === 0) {
        list.innerHTML = '<div style="color:#888; font-size:0.85rem; font-style:italic; padding:0.4rem 0;">No hay parches exclusivos para este producto.</div>';
        return;
    }

    exclusivePatches.forEach((patch, index) => {
        const item = document.createElement('div');
        item.className = 'pe-patch-item';
        
        item.innerHTML = `
            <button type="button" class="pe-patch-remove" title="Eliminar parche"><i class="fas fa-trash"></i></button>
            <div style="display: flex; gap: 1rem; align-items: center;">
                <div style="flex-shrink: 0;">
                    <img class="pe-patch-image-preview" id="patch-img-${index}" src="${patch.image || '../assets/placeholder.webp'}" alt="Parche">
                    <label class="pe-image-upload-btn" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; justify-content: center; margin-top: 0.5rem; cursor: pointer;">
                        Subir <input type="file" id="patch-upload-${index}" accept="image/*" class="hidden">
                    </label>
                </div>
                <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 0.5rem;">
                    <input type="text" class="pe-input" placeholder="Nombre del parche exclusivo" value="${patch.name || ''}" onchange="updateExclusivePatchName(${index}, this.value)">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="color:#a0a0a0; font-size:0.85rem;">Precio (€):</span>
                        <input type="number" class="pe-input" style="padding: 0.5rem;" step="0.01" value="${patch.price || 0}" onchange="updateExclusivePatchPrice(${index}, this.value)">
                    </div>
                </div>
            </div>
        `;
        
        list.appendChild(item);
        
        // Handlers
        item.querySelector('.pe-patch-remove').addEventListener('click', (e) => {
            if (e) e.preventDefault();
            if (confirm('¿Eliminar este parche exclusivo?')) {
                exclusivePatches.splice(index, 1);
                renderExclusivePatchesList();
            }
        });
        
        const uploader = item.querySelector(`#patch-upload-${index}`);
        if (uploader) {
            uploader.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                    const b64 = event.target.result;
                    const imgEl = document.getElementById(`patch-img-${index}`);
                    if (imgEl) imgEl.src = b64;
                    exclusivePatches[index].image = b64;
                };
                reader.readAsDataURL(file);
            });
        }
    });
}

// Expuestas al scope global para los onchange de parches exclusivos
window.updateExclusivePatchName = function(index, value) {
    if (exclusivePatches[index]) exclusivePatches[index].name = value;
};
window.updateExclusivePatchPrice = function(index, value) {
    if (exclusivePatches[index]) exclusivePatches[index].price = parseFloat(value) || 0;
};

async function saveProductToFirebase() {
    if (!editingProduct || !editingProduct.id) return;
    
    const id = document.getElementById('pe-id').value;
    const name = document.getElementById('pe-name').value;
    const price = parseFloat(document.getElementById('pe-price').value) || 0;
    const oldPrice = parseFloat(document.getElementById('pe-oldPrice').value) || null;
    const sku = document.getElementById('pe-sku').value;
    const isActive = document.getElementById('pe-isActive').checked;

    // Calcular Liga final (desplegable o personalizada)
    const leagueSelectVal = document.getElementById('pe-league-select') ? document.getElementById('pe-league-select').value : '';
    const leagueCustomVal = document.getElementById('pe-league-custom') ? document.getElementById('pe-league-custom').value.trim() : '';
    const finalLeague = leagueSelectVal === '__new__' ? leagueCustomVal : leagueSelectVal;

    // Calcular Equipo final (desplegable o personalizado)
    const teamSelectVal = document.getElementById('pe-team-select') ? document.getElementById('pe-team-select').value : '';
    const teamCustomVal = document.getElementById('pe-team-custom') ? document.getElementById('pe-team-custom').value.trim() : '';
    const finalTeam = teamSelectVal === '__new__' ? teamCustomVal : teamSelectVal;
    
    const allowCustomization = document.getElementById('pe-allowCustomization').checked;
    const customizationPrice = parseFloat(document.getElementById('pe-customizationPrice').value) || 0;
    const allowPatches = document.getElementById('pe-allowPatches').checked;
    
    const imageBase64 = document.getElementById('pe-image-base64').value;

    // Recopilar parches seleccionados (Globales activos + Exclusivos válidos)
    const activeGlobalPatches = globalPatchesList
        .filter(gp => selectedGlobalPatchKeys.has(gp.key))
        .map(gp => ({
            key: gp.key,
            name: gp.name,
            price: parseFloat(gp.price) || 0,
            image: gp.image || '',
            isGlobal: true
        }));

    const validExclusivePatches = exclusivePatches
        .filter(p => p.name && p.name.trim() !== '')
        .map(p => ({
            name: p.name.trim(),
            price: parseFloat(p.price) || 0,
            image: p.image || '',
            isGlobal: false
        }));

    const finalPatchesArray = [...activeGlobalPatches, ...validExclusivePatches];

    const updatedData = {
        id: parseInt(id),
        name,
        price,
        oldPrice,
        sku,
        league: finalLeague,
        team: finalTeam,
        isActive,
        allowCustomization,
        customizationPrice,
        allowPatches,
        patches: finalPatchesArray,
        customPatches: finalPatchesArray,
        image: imageBase64,
        updatedAt: new Date().toISOString()
    };
    
    const btnSave = document.getElementById('btn-save-product');
    if (btnSave) {
        btnSave.disabled = true;
        btnSave.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
    }

    try {
        await update(ref(db, `products/${id}`), updatedData);
        alert('¡Producto actualizado correctamente! Todos los cambios (Liga, Equipo, Parches) se reflejarán de inmediato.');
    } catch (err) {
        console.error('Error saving product', err);
        alert('Error al guardar el producto: ' + err.message);
    } finally {
        if (btnSave) {
            btnSave.disabled = false;
            btnSave.innerHTML = '<i class="fas fa-save"></i> Guardar en Firebase';
        }
    }
}

// Inicializar el editor cuando carga el documento
document.addEventListener('DOMContentLoaded', () => {
    initProductEditor();
});


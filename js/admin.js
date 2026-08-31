

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
let dashboardChart = null;
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
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    const startInput = document.getElementById('dash-date-start');
    const endInput = document.getElementById('dash-date-end');
    if (startInput) startInput.value = start.toISOString().split('T')[0];
    if (endInput) endInput.value = end.toISOString().split('T')[0];

    setupEventListeners();
    loadAllOrders();
    setupPromoCodeListeners();
    loadPromoCodes();
    setupUsersListeners();
    loadAllUsers();
    initPinnedProducts();
}

function setupEventListeners() {
    // Navigation Logic
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.admin-section');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Remove active from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.add('hidden'));
            
            // Add active to clicked link and target section
            link.classList.add('active');
            const targetId = link.getAttribute('data-target');
            document.getElementById(targetId).classList.remove('hidden');
        });
    });

    document.getElementById('btn-logout').addEventListener('click', async () => {
        if (confirm('¿Cerrar sesión de administrador?')) {
            await signOut(auth);
            window.location.href = '/index.html';
        }
    });
    document.getElementById('btn-refresh').addEventListener('click', () => {
        loadAllOrders();
    });
    
    const dashStart = document.getElementById('dash-date-start');
    const dashEnd = document.getElementById('dash-date-end');
    if (dashStart) dashStart.addEventListener('change', updateStats);
    if (dashEnd) dashEnd.addEventListener('change', updateStats);

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
    const startInput = document.getElementById('dash-date-start');
    const endInput = document.getElementById('dash-date-end');
    const startDateVal = startInput ? startInput.value : '';
    const endDateVal = endInput ? endInput.value : '';

    let filteredOrders = allOrders;

    if (startDateVal && endDateVal) {
        const start = new Date(startDateVal).getTime();
        const end = new Date(endDateVal);
        end.setHours(23, 59, 59, 999);
        const endTime = end.getTime();

        filteredOrders = allOrders.filter(o => {
            const orderTime = o.createdAt || new Date(o.date).getTime();
            return orderTime >= start && orderTime <= endTime;
        });
    }

    const total = filteredOrders.length;
    const pending = filteredOrders.filter(o => o.status === 'pendiente').length;
    const confirmed = filteredOrders.filter(o => o.status === 'confirmado').length;
    const images = filteredOrders.filter(o => o.status === 'imagenes_cliente').length;
    const shipped = filteredOrders.filter(o => o.status === 'enviado').length;
    const delivered = filteredOrders.filter(o => o.status === 'entregado').length;
    const cancelled = filteredOrders.filter(o => o.status === 'cancelado').length;

    // Calcular ingresos netos (confirmado, imagenes_cliente, enviado, entregado)
    const validStatuses = ['confirmado', 'imagenes_cliente', 'enviado', 'entregado'];
    const revenue = filteredOrders
        .filter(o => validStatuses.includes(o.status))
        .reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);

    const elTotal = document.getElementById('stat-total');
    const elPending = document.getElementById('stat-pending');
    const elConfirmed = document.getElementById('stat-confirmed');
    const elImages = document.getElementById('stat-images');
    const elShipped = document.getElementById('stat-shipped');
    const elDelivered = document.getElementById('stat-delivered');
    const elCancelled = document.getElementById('stat-cancelled');

    if (elTotal) elTotal.textContent = total;
    if (elPending) elPending.textContent = pending;
    if (elConfirmed) elConfirmed.textContent = confirmed;
    if (elImages) elImages.textContent = images;
    if (elShipped) elShipped.textContent = shipped;
    if (elDelivered) elDelivered.textContent = delivered;
    if (elCancelled) elCancelled.textContent = cancelled;

    const revenueEl = document.getElementById('dash-revenue-total');
    if (revenueEl) {
        revenueEl.textContent = revenue.toFixed(2).replace('.', ',') + ' €';
    }

    updateDashboardChart(filteredOrders, startDateVal, endDateVal);
}

function updateDashboardChart(filteredOrders, startStr, endStr) {
    const ctx = document.getElementById('dashboard-chart');
    if (!ctx) return;

    const grouped = {};
    
    if (startStr && endStr) {
        let curr = new Date(startStr);
        const end = new Date(endStr);
        while(curr <= end) {
            const dStr = curr.toISOString().split('T')[0];
            grouped[dStr] = { pending: 0, confirmed: 0, images: 0, shipped: 0, delivered: 0, cancelled: 0, total: 0 };
            curr.setDate(curr.getDate() + 1);
        }
    }

    filteredOrders.forEach(o => {
        const dateObj = new Date(o.createdAt || o.date);
        const dStr = dateObj.toISOString().split('T')[0];
        
        if (!grouped[dStr]) {
            grouped[dStr] = { pending: 0, confirmed: 0, images: 0, shipped: 0, delivered: 0, cancelled: 0, total: 0 };
        }
        
        grouped[dStr].total++;
        if (o.status === 'pendiente') grouped[dStr].pending++;
        else if (o.status === 'confirmado') grouped[dStr].confirmed++;
        else if (o.status === 'imagenes_cliente') grouped[dStr].images++;
        else if (o.status === 'enviado') grouped[dStr].shipped++;
        else if (o.status === 'entregado') grouped[dStr].delivered++;
        else if (o.status === 'cancelado') grouped[dStr].cancelled++;
    });

    const labels = Object.keys(grouped).sort();
    const dataTotal = labels.map(l => grouped[l].total);
    const dataPending = labels.map(l => grouped[l].pending);
    const dataConfirmed = labels.map(l => grouped[l].confirmed);
    const dataImages = labels.map(l => grouped[l].images);
    const dataShipped = labels.map(l => grouped[l].shipped);
    const dataDelivered = labels.map(l => grouped[l].delivered);
    const dataCancelled = labels.map(l => grouped[l].cancelled);

    if (dashboardChart) {
        dashboardChart.destroy();
    }

    // Crear gradiente para Total Pedidos
    const gradientTotal = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradientTotal.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
    gradientTotal.addColorStop(1, 'rgba(99, 102, 241, 0.01)');

    dashboardChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.map(l => new Date(l).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })),
            datasets: [
                {
                    label: 'Total Pedidos',
                    data: dataTotal,
                    borderColor: '#6366f1',
                    backgroundColor: gradientTotal,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#6366f1'
                },
                {
                    label: 'Pendientes',
                    data: dataPending,
                    borderColor: '#f59e0b',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 5
                },
                {
                    label: 'Confirmados',
                    data: dataConfirmed,
                    borderColor: '#06b6d4',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 5
                },
                {
                    label: 'Imágenes Cliente',
                    data: dataImages,
                    borderColor: '#ec4899',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 5
                },
                {
                    label: 'Enviados',
                    data: dataShipped,
                    borderColor: '#3b82f6',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 5
                },
                {
                    label: 'Entregados',
                    data: dataDelivered,
                    borderColor: '#10b981',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 5
                },
                {
                    label: 'Cancelados',
                    data: dataCancelled,
                    borderColor: '#ef4444',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [3, 3],
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 5
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: '#cbd5e1',
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            family: 'Inter, system-ui, sans-serif',
                            size: 13,
                            weight: '500'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#cbd5e1',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    usePointStyle: true,
                    titleFont: {
                        size: 14,
                        family: 'Inter, system-ui, sans-serif'
                    },
                    bodyFont: {
                        size: 13,
                        family: 'Inter, system-ui, sans-serif'
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.03)',
                        drawBorder: false,
                        display: false
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            family: 'Inter, system-ui, sans-serif'
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false,
                        borderDash: [5, 5]
                    },
                    ticks: {
                        color: '#94a3b8',
                        stepSize: 1,
                        padding: 10,
                        font: {
                            family: 'Inter, system-ui, sans-serif'
                        }
                    },
                    border: {
                        display: false
                    }
                }
            }
        }
    });
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
        const productsHTML = order.items?.map(i => {
            const img = i.image || i.img || '../assets/placeholder.webp';
            return `
                <div class="order-product-item">
                    <img src="${img}" alt="${sanitizeHTML(i.name)}">
                    <div class="product-info">
                        <span class="product-name">${sanitizeHTML(i.name)}</span>
                        <span class="product-qty">x${i.quantity}</span>
                    </div>
                </div>
            `;
        }).join('') || '-';
        const isPaid = order.payment?.paid === true;
        const paymentMethod = order.paymentMethod || 'N/A';
        const needsConfirmation = (['bizum', 'revtag', 'revolut', 'transferencia'].includes(paymentMethod)) && !isPaid;

        const sOrderId = sanitizeHTML(order.orderId || '-');
        const sCustomerName = sanitizeHTML(order.customerName || 'N/A');
        const sUserEmail = sanitizeHTML(order.userEmail || '-');
        const sTracking = sanitizeHTML(order.trackingNumber || '');

        return `
            <tr data-order-path="${order.path}">
                <td data-label="ID Pedido" class="order-id">${sOrderId}</td>
                <td data-label="Fecha" class="order-date">${date}</td>
                <td data-label="Cliente" class="order-customer">
                    <div class="customer-info">
                        <span class="customer-name">${sCustomerName}</span>
                        <span class="customer-email">${sUserEmail}</span>
                    </div>
                </td>
                <td data-label="Productos" class="order-products"><div class="order-products-grid">${productsHTML}</div></td>
                <td data-label="Total" class="order-total">€${order.total?.toFixed(2) || '0.00'}</td>
                <td data-label="Pago" class="order-payment">
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
                <td data-label="Estado" class="order-status">
                    <select class="status-select status-${order.status}" onchange="updateOrderStatus('${order.path}', this.value, '${order.uid}', '${order.orderId}')">
                        <option value="pendiente" ${order.status === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                        <option value="confirmado" ${order.status === 'confirmado' ? 'selected' : ''}>Confirmado</option>
                        <option value="imagenes_cliente" ${order.status === 'imagenes_cliente' ? 'selected' : ''}>📷 Imágenes Cliente</option>
                        <option value="enviado" ${order.status === 'enviado' ? 'selected' : ''}>Enviado</option>
                        <option value="entregado" ${order.status === 'entregado' ? 'selected' : ''}>Entregado</option>
                        <option value="cancelado" ${order.status === 'cancelado' ? 'selected' : ''}>Cancelado</option>
                    </select>
                </td>
                <td data-label="Tracking" class="order-tracking">
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
                <td data-label="Acciones" class="order-actions">
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
                                <td data-label="Producto">
                                    <div class="item-info">
                                        <img src="${item.image || '/assets/placeholder.webp'}" alt="${sanitizeHTML(item.name || '')}" onerror="this.src='/assets/placeholder.webp'">
                                        <div>
                                            <div style="font-weight:600;color:#fff;">${sanitizeHTML(item.name || `Producto ${item.id}`)}</div>
                                            ${item.sku ? `<div style="font-size:0.75rem;color:#888;">SKU: ${sanitizeHTML(item.sku)}</div>` : ''}
                                        </div>
                                    </div>
                                </td>
                                <td data-label="Talla">
                                    <span class="item-extra-tag tag-size"><i class="fas fa-ruler"></i> ${sanitizeHTML(size)}</span>
                                </td>
                                <td data-label="Versión">
                                    <span class="item-extra-tag ${version === 'jugador' ? 'tag-version-jugador' : 'tag-version-aficionado'}">
                                        <i class="fas ${version === 'jugador' ? 'fa-bolt' : 'fa-user'}"></i> ${version.toUpperCase()}
                                    </span>
                                </td>
                                <td data-label="Pers. / Extras">
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
                                <td data-label="Cantidad"><strong>x${qty}</strong></td>
                                <td data-label="Precio Un.">€${unitPrice.toFixed(2)}</td>
                                <td data-label="Subtotal" style="font-weight:700;color:#10b981;">€${itemSubtotal.toFixed(2)}</td>
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
    let packBasePrice = fullCycles * 92.70;
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
                <td data-label="Código" class="promo-code-cell"><code>${code.code}</code></td>
                <td data-label="Tipo">${typeText}</td>
                <td data-label="Valor" class="promo-value-cell">${typeLabel}</td>
                <td data-label="Usos totales">${usageText}</td>
                <td data-label="Por usuario">${perUserText}</td>
                <td data-label="Estado">
                    <span class="promo-status ${statusClass}">${statusText}</span>
                </td>
                <td data-label="Acciones" class="promo-actions">
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
                <td data-label="Email" class="user-email">${user.email}</td>
                <td data-label="Nombre">${user.username || '<em>Sin nombre</em>'}</td>
                <td data-label="Pedidos" class="text-center">${user.orderCount}</td>
                <td data-label="Puntos" class="text-center">
                    <span class="points-badge">
                        ${user.availablePoints} <small>(+${user.pendingPoints} pend.)</small>
                    </span>
                </td>
                <td data-label="Registro" class="text-center">${dateStr}</td>
                <td data-label="Acciones" class="user-actions">
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
                                <td data-label="Pedido">#${o.orderId || o.id}</td>
                                <td data-label="Fecha">${new Date(o.date).toLocaleDateString('es-ES')}</td>
                                <td data-label="Total">€${(o.total || 0).toFixed(2)}</td>
                                <td data-label="Estado"><span class="status-badge status-${o.status}">${o.status}</span></td>
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

    const mandatoryTop = [500002, 500001];
    const mandatorySet = new Set(mandatoryTop);
    const restPinned = pinnedIds.filter(id => !mandatorySet.has(id));
    pinnedIds = [...mandatoryTop, ...restPinned];

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
            exclusivePatches.push({ name: '', price: 3.00, image: '' });
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

    // Asignar Parches a Toda la Liga
    const btnAssignLeaguePatches = document.getElementById('btn-assign-league-patches');
    if (btnAssignLeaguePatches) {
        btnAssignLeaguePatches.addEventListener('click', (e) => {
            if (e) e.preventDefault();
            assignPatchesToLeague();
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

let catalogAvailableTeamsCache = [];

const LEAGUE_NORMALIZATION_MAP = {
    'la liga': 'laliga',
    'laliga': 'laliga',
    'premier league': 'premier',
    'premier': 'premier',
    'serie a': 'seriea',
    'seriea': 'seriea',
    'bundesliga': 'bundesliga',
    'ligue 1': 'ligue1',
    'ligue1': 'ligue1',
    'selecciones nacionales': 'selecciones',
    'selecciones': 'selecciones',
    'brasileirao': 'brasileirao',
    'liga arabe': 'ligaarabe',
    'ligaarabe': 'ligaarabe',
    'saf (argentina)': 'saf',
    'saf': 'saf',
    'nba': 'nba',
    'eredivisie': 'eredivisie',
    'liga portugal': 'ligaportugal',
    'ligaportugal': 'ligaportugal',
    'mls': 'mls',
    'liga mx': 'ligamx',
    'ligamx': 'ligamx',
    'ediciones retro': 'retro',
    'retro': 'retro'
};

function normalizeLeagueKey(league) {
    if (!league) return '';
    const raw = String(league).trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
    return LEAGUE_NORMALIZATION_MAP[raw] || raw.replace(/\s+/g, '');
}

async function getAllTeamsForLeague(leagueVal) {
    const liveProducts = await getAllLiveProducts();
    const rawTargetLeague = (leagueVal || '').replace('LIGA:', '').trim();
    const targetLeagueKey = normalizeLeagueKey(rawTargetLeague);

    const leagueProducts = liveProducts.filter(p => {
        if (!p.league) return false;
        return normalizeLeagueKey(p.league) === targetLeagueKey;
    });

    const teamMap = new Map();

    leagueProducts.forEach(p => {
        const rawT = p.team || extractTeamFromProductName(p.name);
        if (rawT) {
            const normT = normalizeTeamName(rawT);
            if (normT && normT.length > 1) {
                teamMap.set(normT.toLowerCase(), normT);
            }
        }
    });

    return [...teamMap.values()].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
}

function buildTeamAndLeagueSelectHTML(availableTeams, activeTeamsSet = new Set()) {
    const available = availableTeams.filter(t => !activeTeamsSet.has(t));
    
    return `
        <option value="">+ Selecciona una Liga o Equipos...</option>
        <optgroup label="🏆 LIGAS COMPLETAS (Añadir todos sus equipos)">
            <option value="LIGA:laliga">🏆 Toda La Liga</option>
            <option value="LIGA:premier">🏆 Toda la Premier League</option>
            <option value="LIGA:seriea">🏆 Toda la Serie A</option>
            <option value="LIGA:bundesliga">🏆 Toda la Bundesliga</option>
            <option value="LIGA:ligue1">🏆 Toda la Ligue 1</option>
            <option value="LIGA:selecciones">🏆 Todas las Selecciones</option>
            <option value="LIGA:brasileirao">🏆 Todo el Brasileirao</option>
            <option value="LIGA:ligaarabe">🏆 Toda la Liga Árabe</option>
            <option value="LIGA:eredivisie">🏆 Toda la Eredivisie</option>
            <option value="LIGA:ligaportugal">🏆 Toda la Liga Portugal</option>
            <option value="LIGA:mls">🏆 Toda la MLS</option>
            <option value="LIGA:ligamx">🏆 Toda la Liga MX</option>
        </optgroup>
        <optgroup label="🛡️ EQUIPOS INDIVIDUALES (${available.length} disponibles)">
            ${available.map(t => `<option value="${sanitizeHTML(t)}">${sanitizeHTML(t)}</option>`).join('')}
        </optgroup>
    `;
}

async function populateNewGpTeamSelect() {
    const select = document.getElementById('pe-new-gp-team-select');
    if (!select) return;
    const teams = catalogAvailableTeamsCache.length > 0 ? catalogAvailableTeamsCache : await getAllTeamsFromCatalog();
    select.innerHTML = buildTeamAndLeagueSelectHTML(teams, newGpTemporalTeams);
}

function renderPatchesTab() {
    renderGlobalPatchesList();
    renderExclusivePatchesList();
    populateNewGpTeamSelect();
}

function getCurrentEditingProductTeam() {
    const teamSelectVal = document.getElementById('pe-team-select') ? document.getElementById('pe-team-select').value : '';
    const teamCustomVal = document.getElementById('pe-team-custom') ? document.getElementById('pe-team-custom').value.trim() : '';
    let currentTeam = teamSelectVal === '__new__' ? teamCustomVal : teamSelectVal;
    if (!currentTeam && typeof editingProduct !== 'undefined' && editingProduct) {
        currentTeam = editingProduct.team || extractTeamFromProductName(editingProduct.name) || '';
    }
    return (currentTeam || '').trim();
}

async function getAllLiveProducts() {
    const catalog = await loadProductsCache();
    let firebaseProducts = {};
    try {
        const snap = await get(ref(db, 'products'));
        if (snap.exists()) {
            firebaseProducts = snap.val() || {};
        }
    } catch (e) {
        console.error('[GlobalPatches] Error fetching live products from Firebase:', e);
    }

    return catalog.map(p => {
        const fbData = firebaseProducts[p.id] || {};
        return {
            ...p,
            ...fbData
        };
    });
}

const STORE_CANONICAL_NAMES = {
    'ac milan': 'AC Milan',
    'ajax': 'Ajax',
    'al ahli': 'Al Ahli',
    'al-hilal': 'Al-Hilal',
    'al-nassr': 'Al-Nassr',
    'alaves': 'Alavés',
    'albacete': 'Albacete',
    'alemania': 'Alemania',
    'argelia': 'Argelia',
    'argentina': 'Argentina',
    'arsenal': 'Arsenal',
    'as roma': 'AS Roma',
    'aston villa': 'Aston Villa',
    'athletic club': 'Athletic Club',
    'atletico madrid': 'Atlético Madrid',
    'atletico mineiro': 'Atlético Mineiro',
    'bayern munich': 'Bayern Múnich',
    'belgica': 'Bélgica',
    'benfica': 'Benfica',
    'boca juniors': 'Boca Juniors',
    'brasil': 'Brasil',
    'burgos': 'Burgos',
    'cadiz': 'Cádiz',
    'celta de vigo': 'Celta de Vigo',
    'chelsea': 'Chelsea',
    'chile': 'Chile',
    'chivas': 'Chivas',
    'colombia': 'Colombia',
    'cordoba': 'Córdoba',
    'corea del sur': 'Corea del Sur',
    'costa rica': 'Costa Rica',
    'croacia': 'Croacia',
    'deportivo la coruna': 'Deportivo La Coruña',
    'dortmund': 'Dortmund',
    'ecuador': 'Ecuador',
    'elche': 'Elche',
    'escocia': 'Escocia',
    'espana': 'España',
    'espanyol': 'Espanyol',
    'estados unidos': 'Estados Unidos',
    'everton': 'Everton',
    'fc barcelona': 'FC Barcelona',
    'feyenoord': 'Feyenoord',
    'finlandia': 'Finlandia',
    'fiorentina': 'Fiorentina',
    'flamengo': 'Flamengo',
    'fluminense': 'Fluminense',
    'francia': 'Francia',
    'gales': 'Gales',
    'getafe': 'Getafe',
    'girona': 'Girona',
    'granada': 'Granada',
    'holanda': 'Holanda',
    'inglaterra': 'Inglaterra',
    'inter miami': 'Inter Miami',
    'inter milan': 'Inter de Milán',
    'internacional': 'Internacional',
    'italia': 'Italia',
    'jamaica': 'Jamaica',
    'japon': 'Japón',
    'las palmas': 'Las Palmas',
    'lazio': 'Lazio',
    'leeds united': 'Leeds United',
    'leganes': 'Leganés',
    'leicester city': 'Leicester City',
    'levante': 'Levante',
    'malaga cf': 'Málaga CF',
    'mallorca': 'Mallorca',
    'manchester city': 'Manchester City',
    'manchester united': 'Manchester United',
    'marruecos': 'Marruecos',
    'marseille': 'Marseille',
    'mexico': 'México',
    'monaco': 'Monaco',
    'monterrey': 'Monterrey',
    'napoli': 'Napoli',
    'newcastle united': 'Newcastle United',
    'nigeria': 'Nigeria',
    'noruega': 'Noruega',
    'osasuna': 'Osasuna',
    'palmeiras': 'Palmeiras',
    'peru': 'Perú',
    'polonia': 'Polonia',
    'porto': 'Porto',
    'portugal': 'Portugal',
    'psg': 'PSG',
    'real betis': 'Real Betis',
    'real madrid': 'Real Madrid',
    'real sociedad': 'Real Sociedad',
    'river plate': 'River Plate',
    'rumania': 'Rumania',
    'santos': 'Santos',
    'sao paulo': 'São Paulo',
    'sevilla': 'Sevilla',
    'sporting de lisboa': 'Sporting de Lisboa',
    'sporting gijon': 'Sporting de Gijón',
    'valencia': 'Valencia',
    'valladolid': 'Valladolid',
    'venezuela': 'Venezuela',
    'villarreal': 'Villarreal'
};

const STORE_CANONICAL_KEYS = {
    'barcelona': 'fc barcelona',
    'milan': 'ac milan',
    'ac milan': 'ac milan',
    'newcastle': 'newcastle united',
    'sporting lisboa': 'sporting de lisboa',
    'sporting lisbon': 'sporting de lisboa',
    'miami': 'inter miami',
    'mexico': 'mexico',
    'man utd': 'manchester united',
    'man united': 'manchester united',
    'boca juniors stadium': 'boca juniors',
    'celta': 'celta de vigo',
    'celta de vigo': 'celta de vigo',
    'deportivo alaves': 'alaves',
    'alaves': 'alaves',
    'athletic': 'athletic club',
    'athletic bilbao': 'athletic club',
    'athletic club': 'athletic club',
    'brazil': 'brasil',
    'deportivo la coruna': 'deportivo la coruna',
    'depor': 'deportivo la coruna',
    'deportivo': 'deportivo la coruna',
    'portugal': 'portugal',
    'norway': 'noruega',
    'sweden': 'suecia',
    'brazil juese': 'brasil',
    'finland': 'finlandia',
    'vicenza': 'victoria',
    'vitoria': 'victoria',
    'espana \'somos campeones\'': 'espana',
    'espana mundial 2 estrellas': 'espana'
};

function normalizeTeamName(rawName) {
    if (!rawName) return '';
    let name = String(rawName).trim();
    name = name.replace(/&amp;/g, '&').replace(/&[a-z]+;/gi, ' ');
    name = name.replace(/\b\d{2,4}\/\d{2,4}\b/g, '');
    name = name.replace(/\/\d{2,4}\b/g, '');
    name = name.replace(/\b(19|20)\d{2}\b/g, '');
    name = name.replace(/(?<!Schalke|Mainz|Pumas|CA)\s+\b(19|20|21|22|23|24|25|26|7\d|8\d|9\d)\b/gi, '');
    name = name.replace(/\(.*\)/g, '');

    const variants = [
        'Local', 'Visitante', 'Tercera', 'Cuarta', 'Fourth', 'Home', 'Away', 'Third',
        'Portero', 'Goalkeeper', 'GK', 'Niño', 'Niños',
        'Retro', 'Icon', 'Classic', 'Vintage',
        'Especial', 'Special', 'Edici[oó]n.*', 'Limited', 'Commemorative', 'Conmemorativ[ao]',
        'estilo', 'Style', 'Casual', 'Manga Larga', 'Long Sleeve',
        'Black', 'Gold', 'Golden', 'White', 'Pink', 'Blue', 'Red', 'Green', 'Golde', 'cyan', 'Negra',
        'Training', 'Entrenamiento', 'Pre-match', 'Pre-partido', 'Warm-up',
        'Anniversary', 'Aniversario', 'Centemary', 'Centenario', '100 Años', '125',
        'Player', 'Fan', 'Vapor', 'Authentic',
        'Stadium', 'Women', 'Edition', 'Polo', 'Dorada', 'Juese', 'Campeones'
    ];
    const variantRegex = new RegExp(`\\b(${variants.join('|')})\\b`, 'gi');
    name = name.replace(variantRegex, '');
    name = name.replace(/\bS-[X\d]+L?\b/gi, '');
    name = name.replace(/\s+/g, ' ').trim();

    if (!name) return '';

    function normStr(str) {
        return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    }

    let key = normStr(name);
    key = STORE_CANONICAL_KEYS[key] || key;

    const displayName = STORE_CANONICAL_NAMES[key] || STORE_CANONICAL_NAMES[normStr(name)] || name;
    return displayName.trim();
}

async function getAllTeamsFromCatalog() {
    const liveProducts = await getAllLiveProducts();
    const teamMap = new Map();

    const currentEditingTeam = getCurrentEditingProductTeam();
    if (currentEditingTeam) {
        const normCurrent = normalizeTeamName(currentEditingTeam);
        if (normCurrent) teamMap.set(normCurrent.toLowerCase(), normCurrent);
    }

    liveProducts.forEach(p => {
        const rawT = p.team || extractTeamFromProductName(p.name);
        if (rawT) {
            const normT = normalizeTeamName(rawT);
            if (normT && normT.length > 1) {
                teamMap.set(normT.toLowerCase(), normT);
            }
        }
    });

    return [...teamMap.values()].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
}

// --- MULTI-TEAM SELECTION STATE FOR GLOBAL PATCHES ---
let newGpTemporalTeams = new Set();
let editGpTemporalTeamsMap = {}; // key -> Set of team names

window.addTeamToNewGp = async function() {
    const select = document.getElementById('pe-new-gp-team-select');
    if (!select || !select.value) return;
    const val = select.value.trim();

    if (val.startsWith('LIGA:')) {
        const leagueTeams = await getAllTeamsForLeague(val);
        leagueTeams.forEach(t => newGpTemporalTeams.add(t));
        select.value = '';
        renderNewGpTeamsPills();
        showToast(`Añadidos ${leagueTeams.length} equipos de la liga seleccionada.`);
        return;
    }

    const teamName = normalizeTeamName(val);
    if (teamName) {
        newGpTemporalTeams.add(teamName);
        select.value = '';
        renderNewGpTeamsPills();
    }
};

window.addTeamToGpEdit = function(key) {
    const select = document.getElementById(`gp-edit-team-select-${key}`);
    if (!select || !select.value) return;
    const teamName = normalizeTeamName(select.value.trim());
    if (teamName) {
        if (!editGpTemporalTeamsMap[key]) editGpTemporalTeamsMap[key] = new Set();
        editGpTemporalTeamsMap[key].add(teamName);
        select.value = '';
        renderGpEditTeamsPills(key);
    }
};

window.removeTeamFromNewGp = function(teamName) {
    newGpTemporalTeams.delete(teamName);
    renderNewGpTeamsPills();
};

function renderNewGpTeamsPills() {
    const container = document.getElementById('pe-new-gp-teams-pills');
    if (!container) return;
    if (newGpTemporalTeams.size === 0) {
        container.innerHTML = '<span style="color:#64748b; font-size:0.8rem; font-style:italic;">No hay equipos seleccionados aún. Elige uno abajo y pulsa Añadir.</span>';
    } else {
        container.innerHTML = [...newGpTemporalTeams].map(team => `
            <span class="gp-team-pill">
                <i class="fas fa-shield-alt"></i> ${sanitizeHTML(team)}
                <span class="gp-team-pill-remove" onclick="removeTeamFromNewGp('${sanitizeHTML(team).replace(/'/g, "\\'")}')" title="Quitar equipo">✕</span>
            </span>
        `).join('');
    }

    populateNewGpTeamSelect();
}

window.addTeamToGpEdit = async function(key) {
    const select = document.getElementById(`gp-edit-team-select-${key}`);
    if (!select || !select.value) return;
    const val = select.value.trim();

    if (val.startsWith('LIGA:')) {
        const leagueTeams = await getAllTeamsForLeague(val);
        if (!editGpTemporalTeamsMap[key]) editGpTemporalTeamsMap[key] = new Set();
        leagueTeams.forEach(t => editGpTemporalTeamsMap[key].add(t));
        select.value = '';
        renderGpEditTeamsPills(key);
        showToast(`Añadidos ${leagueTeams.length} equipos de la liga seleccionada.`);
        return;
    }

    const teamName = normalizeTeamName(val);
    if (teamName) {
        if (!editGpTemporalTeamsMap[key]) editGpTemporalTeamsMap[key] = new Set();
        editGpTemporalTeamsMap[key].add(teamName);
        select.value = '';
        renderGpEditTeamsPills(key);
    }
};

window.removeTeamFromGpEdit = function(key, teamName) {
    if (editGpTemporalTeamsMap[key]) {
        editGpTemporalTeamsMap[key].delete(teamName);
        renderGpEditTeamsPills(key);
    }
};

function renderGpEditTeamsPills(key) {
    const container = document.getElementById(`gp-edit-teams-pills-${key}`);
    if (!container) return;
    const teamsSet = editGpTemporalTeamsMap[key] || new Set();
    
    if (teamsSet.size === 0) {
        container.innerHTML = '<span style="color:#64748b; font-size:0.8rem; font-style:italic;">No hay equipos asignados a esta competición aún.</span>';
    } else {
        container.innerHTML = [...teamsSet].map(team => `
            <span class="gp-team-pill">
                <i class="fas fa-shield-alt"></i> ${sanitizeHTML(team)}
                <span class="gp-team-pill-remove" onclick="removeTeamFromGpEdit('${key}', '${sanitizeHTML(team).replace(/'/g, "\\'")}')" title="Quitar equipo">✕</span>
            </span>
        `).join('');
    }

    const card = document.getElementById(`gp-card-${key}`);
    if (card) {
        const badge = card.querySelector('.badge-patch-temporal');
        if (badge) {
            const str = [...teamsSet].join(', ');
            badge.innerHTML = `<i class="fas fa-trophy"></i> ${sanitizeHTML(str || 'Temporal')}`;
        }
    }

    const select = document.getElementById(`gp-edit-team-select-${key}`);
    if (select && catalogAvailableTeamsCache.length > 0) {
        select.innerHTML = buildTeamAndLeagueSelectHTML(catalogAvailableTeamsCache, teamsSet);
    }
}

async function renderGlobalPatchesList() {
    const list = document.getElementById('pe-global-patches-list');
    if (!list) return;
    list.innerHTML = '';

    if (globalPatchesList.length === 0) {
        list.innerHTML = '<div style="color:#888; font-size:0.85rem; font-style:italic; padding:0.5rem 0;">No hay parches en la biblioteca global aún. ¡Crea uno abajo en la sección 2!</div>';
        return;
    }

    const availableTeams = await getAllTeamsFromCatalog();
    catalogAvailableTeamsCache = availableTeams;

    globalPatchesList.forEach(gp => {
        const card = document.createElement('div');
        card.className = `pe-global-patch-card ${gp.hidden ? 'is-hidden-patch' : ''}`;
        card.id = `gp-card-${gp.key}`;
        
        const isChecked = selectedGlobalPatchKeys.has(gp.key);

        let initialTeams = [];
        if (Array.isArray(gp.temporalTeams) && gp.temporalTeams.length > 0) {
            initialTeams = gp.temporalTeams;
        } else if (gp.temporalTeam) {
            initialTeams = gp.temporalTeam.split(',').map(t => t.trim()).filter(Boolean);
        }
        editGpTemporalTeamsMap[gp.key] = new Set(initialTeams);

        const currentEditingTeam = normalizeTeamName(getCurrentEditingProductTeam());
        if (!quickApplyTeamsMap[gp.key]) {
            quickApplyTeamsMap[gp.key] = new Set(currentEditingTeam ? [currentEditingTeam] : []);
        }

        const teamOptionsHTML = buildTeamAndLeagueSelectHTML(availableTeams, editGpTemporalTeamsMap[gp.key]);
        
        const teamsDisplayStr = [...editGpTemporalTeamsMap[gp.key]].join(', ');

        card.innerHTML = `
            <div class="pe-gp-card-header">
                <label class="pe-gp-assign-checkbox" title="Asignar o desasignar a esta camiseta">
                    <input type="checkbox" value="${gp.key}" ${isChecked ? 'checked' : ''}>
                    <span>Asignar</span>
                </label>
                
                <img src="${gp.image || '../assets/placeholder.webp'}" class="pe-global-patch-img" id="gp-img-view-${gp.key}" alt="${sanitizeHTML(gp.name)}">
                
                <div class="pe-global-patch-info">
                    <div style="display:flex; align-items:center; gap:0.35rem; flex-wrap:wrap;">
                        <span class="pe-global-patch-name">${sanitizeHTML(gp.name)}</span>
                        ${gp.hidden ? '<span class="badge-patch-hidden"><i class="fas fa-eye-slash"></i> Oculto</span>' : ''}
                        ${gp.isTemporal ? `<span class="badge-patch-temporal"><i class="fas fa-trophy"></i> ${sanitizeHTML(teamsDisplayStr || 'Temporal')}</span>` : ''}
                    </div>
                    <span class="pe-global-patch-price">+€${(parseFloat(gp.price) || 0).toFixed(2)}</span>
                </div>

                <div class="pe-gp-card-actions">
                    <button type="button" class="btn-gp-toggle-edit" onclick="toggleGlobalPatchEditPanel('${gp.key}')">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button type="button" class="btn-gp-delete" onclick="deleteGlobalPatchFromFirebase('${gp.key}', '${sanitizeHTML(gp.name)}')" title="Eliminar por completo">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>

            <!-- Panel de Edición Completa -->
            <div class="pe-gp-edit-panel hidden" id="gp-edit-panel-${gp.key}">
                <div class="form-group">
                    <label style="font-size:0.8rem; font-weight:700; color:#a1a1aa;">Nombre / Título del Parche:</label>
                    <input type="text" class="pe-input" id="gp-edit-name-${gp.key}" value="${sanitizeHTML(gp.name || '')}">
                </div>
                <div class="form-row-2">
                    <div class="form-group">
                        <label style="font-size:0.8rem; font-weight:700; color:#a1a1aa;">Precio Adicional (€):</label>
                        <input type="number" step="0.01" class="pe-input" id="gp-edit-price-${gp.key}" value="${(parseFloat(gp.price) || 0).toFixed(2)}">
                    </div>
                    <div class="form-group">
                        <label style="font-size:0.8rem; font-weight:700; color:#a1a1aa;">Imagen del Parche:</label>
                        <div style="display:flex; align-items:center; gap:0.5rem;">
                            <img id="gp-edit-preview-${gp.key}" src="${gp.image || '../assets/placeholder.webp'}" style="width:36px; height:36px; object-fit:contain; border-radius:4px; background:#111; border:1px solid rgba(255,255,255,0.1);">
                            <label for="gp-edit-file-${gp.key}" class="pe-image-upload-btn" style="padding:0.4rem 0.65rem; font-size:0.75rem; margin:0; cursor:pointer;">
                                <i class="fas fa-upload"></i> Subir
                            </label>
                            <input type="file" id="gp-edit-file-${gp.key}" accept="image/*" class="hidden">
                            <input type="hidden" id="gp-edit-b64-${gp.key}" value="${gp.image || ''}">
                        </div>
                    </div>
                </div>

                <div class="form-row-2" style="margin-top:0.4rem;">
                    <div class="form-group checkbox-group" style="padding:0.6rem 0.75rem;">
                        <input type="checkbox" id="gp-edit-hidden-${gp.key}" ${gp.hidden ? 'checked' : ''}>
                        <label for="gp-edit-hidden-${gp.key}" style="font-size:0.82rem;"><i class="fas fa-eye-slash" style="color:#ef4444;"></i> Ocultar en la tienda</label>
                    </div>
                    <div class="form-group checkbox-group" style="padding:0.6rem 0.75rem;">
                        <input type="checkbox" id="gp-edit-temporal-${gp.key}" ${gp.isTemporal ? 'checked' : ''} onchange="toggleGpEditTemporalTeam('${gp.key}', this.checked)">
                        <label for="gp-edit-temporal-${gp.key}" style="font-size:0.82rem;"><i class="fas fa-trophy" style="color:#f59e0b;"></i> ¿Competición Temporal?</label>
                    </div>
                </div>

                <div class="form-group ${gp.isTemporal ? '' : 'hidden'}" id="gp-edit-team-container-${gp.key}" style="margin-top:0.4rem;">
                    <label style="color:#818cf8; font-size:0.8rem; font-weight:700;"><i class="fas fa-shield-alt"></i> Equipos asignados a la Competición Temporal:</label>
                    <div id="gp-edit-teams-pills-${gp.key}" class="gp-teams-pills-container">
                        <!-- Pills de equipos -->
                    </div>
                    <div style="display:flex; gap:0.5rem; margin-top:0.4rem; flex-wrap:wrap;">
                        <select id="gp-edit-team-select-${gp.key}" class="pe-input" style="flex:1; min-width:180px;" onchange="addTeamToGpEdit('${gp.key}')">
                            <option value="">+ Selecciona o añade un equipo...</option>
                            ${teamOptionsHTML}
                        </select>
                        <button type="button" class="btn-gp-add-team" style="background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.4);" onclick="openMultiTeamModalForEditGp('${gp.key}')">
                            <i class="fas fa-tasks"></i> Selección Múltiple
                        </button>
                    </div>
                </div>

                <div style="display:flex; gap:0.5rem; margin-top:0.6rem; flex-wrap:wrap;">
                    <button type="button" class="btn-gp-save-changes" style="flex:1; background:linear-gradient(135deg, #6366f1, #4f46e5); color:#fff; border:none; padding:0.6rem; border-radius:6px; font-weight:600; cursor:pointer; font-size:0.85rem;" onclick="saveGlobalPatchEdit('${gp.key}')">
                        <i class="fas fa-save"></i> Guardar Cambios
                    </button>
                    ${gp.isTemporal ? `
                        <button type="button" class="btn-gp-apply-team" style="background:rgba(245,158,11,0.2); color:#fbbf24; border:1px solid rgba(245,158,11,0.4); padding:0.6rem 0.75rem; border-radius:6px; font-weight:600; cursor:pointer; font-size:0.85rem;" onclick="triggerApplyPatchToTeam('${gp.key}')">
                            <i class="fas fa-magic"></i> Aplicar a Camisetas de los Equipos
                        </button>
                    ` : ''}
                    <button type="button" style="background:rgba(255,255,255,0.08); color:#ccc; border:none; padding:0.6rem 0.85rem; border-radius:6px; font-weight:600; cursor:pointer; font-size:0.85rem;" onclick="toggleGlobalPatchEditPanel('${gp.key}')">
                        Cancelar
                    </button>
                </div>

                <!-- Sección para Asignación Rápida a Cualquier Equipo (Última Temporada) -->
                <div style="margin-top:0.75rem; padding-top:0.75rem; border-top:1px dashed rgba(255,255,255,0.1);">
                    <div style="display:flex; align-items:center; justify-content:space-between; gap:0.5rem; flex-wrap:wrap; margin-bottom:0.4rem;">
                        <span style="font-size:0.8rem; font-weight:700; color:#38bdf8; display:flex; align-items:center; gap:0.35rem;">
                            <i class="fas fa-bolt"></i> Aplicar parche a equipos (Última Temporada):
                        </span>
                        <button type="button" class="btn-gp-add-team" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.4); padding: 0.3rem 0.65rem; font-size: 0.78rem;" onclick="openMultiTeamModalForQuickApply('${gp.key}')">
                            <i class="fas fa-tasks"></i> Selección Múltiple
                        </button>
                    </div>

                    <div id="gp-quick-teams-pills-${gp.key}" class="gp-teams-pills-container" style="margin-bottom:0.4rem;">
                        <!-- Pills de equipos agregados dinámicamente -->
                    </div>

                    <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap;">
                        <select id="gp-quick-team-select-${gp.key}" class="pe-input" style="flex:1; min-width:180px; padding:0.4rem 0.6rem; font-size:0.82rem;" onchange="addTeamToQuickApply('${gp.key}')">
                            <option value="">+ Selecciona o añade un equipo...</option>
                            ${teamOptionsHTML}
                        </select>
                        <button type="button" class="btn-gp-quick-apply" style="background:linear-gradient(135deg, #0284c7, #0369a1); color:#fff; border:none; padding:0.45rem 0.95rem; border-radius:6px; font-weight:600; font-size:0.82rem; cursor:pointer; display:inline-flex; align-items:center; gap:0.4rem; white-space:nowrap;" onclick="quickApplyPatchToTeams('${gp.key}')">
                            <i class="fas fa-bolt"></i> Aplicar a Última Temporada
                        </button>
                    </div>
                </div>
            </div>
        `;

        const checkbox = card.querySelector('.pe-gp-assign-checkbox input[type="checkbox"]');
        if (checkbox) {
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    selectedGlobalPatchKeys.add(gp.key);
                } else {
                    selectedGlobalPatchKeys.delete(gp.key);
                }
            });
        }

        const uploader = card.querySelector(`#gp-edit-file-${gp.key}`);
        if (uploader) {
            uploader.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                    const b64 = event.target.result;
                    const preview = card.querySelector(`#gp-edit-preview-${gp.key}`);
                    const b64Input = card.querySelector(`#gp-edit-b64-${gp.key}`);
                    if (preview) preview.src = b64;
                    if (b64Input) b64Input.value = b64;
                };
                reader.readAsDataURL(file);
            });
        }

        list.appendChild(card);

        renderGpEditTeamsPills(gp.key);
        renderQuickApplyTeamsPills(gp.key);
    });

    populateNewGpTeamDropdown(availableTeams);
}

window.toggleGlobalPatchEditPanel = function(key) {
    const panel = document.getElementById(`gp-edit-panel-${key}`);
    if (panel) panel.classList.toggle('hidden');
};

window.toggleGpEditTemporalTeam = function(key, checked) {
    const container = document.getElementById(`gp-edit-team-container-${key}`);
    if (container) {
        if (checked) {
            container.classList.remove('hidden');
            if (!editGpTemporalTeamsMap[key] || editGpTemporalTeamsMap[key].size === 0) {
                const currentEditingTeam = getCurrentEditingProductTeam();
                if (currentEditingTeam) {
                    if (!editGpTemporalTeamsMap[key]) editGpTemporalTeamsMap[key] = new Set();
                    editGpTemporalTeamsMap[key].add(currentEditingTeam);
                }
            }
            renderGpEditTeamsPills(key);
        } else {
            container.classList.add('hidden');
        }
    }
};

window.toggleNewGpTemporalTeam = function(checked) {
    const container = document.getElementById('pe-new-gp-team-container');
    if (container) {
        if (checked) {
            container.classList.remove('hidden');
            if (newGpTemporalTeams.size === 0) {
                const currentEditingTeam = getCurrentEditingProductTeam();
                if (currentEditingTeam) {
                    newGpTemporalTeams.add(currentEditingTeam);
                }
            }
            renderNewGpTeamsPills();
        } else {
            container.classList.add('hidden');
        }
    }
};

function populateNewGpTeamDropdown(teams) {
    const select = document.getElementById('pe-new-gp-team-select');
    if (!select) return;
    select.innerHTML = '<option value="">+ Añadir equipo a la competición...</option>' + 
        teams.map(t => `<option value="${sanitizeHTML(t)}">${sanitizeHTML(t)}</option>`).join('');
}

window.saveGlobalPatchEdit = async function(key) {
    const nameInput = document.getElementById(`gp-edit-name-${key}`);
    const priceInput = document.getElementById(`gp-edit-price-${key}`);
    const b64Input = document.getElementById(`gp-edit-b64-${key}`);
    const hiddenCb = document.getElementById(`gp-edit-hidden-${key}`);
    const temporalCb = document.getElementById(`gp-edit-temporal-${key}`);

    const name = nameInput ? nameInput.value.trim() : '';
    const price = priceInput ? (parseFloat(priceInput.value) || 0) : 0;
    const image = b64Input ? b64Input.value : '';
    const hidden = hiddenCb ? hiddenCb.checked : false;
    const isTemporal = temporalCb ? temporalCb.checked : false;
    
    const temporalTeamsSet = editGpTemporalTeamsMap[key] || new Set();
    const temporalTeams = [...temporalTeamsSet];
    const temporalTeam = temporalTeams.join(', ');

    if (!name) {
        alert('El título del parche global no puede estar vacío.');
        return;
    }

    if (isTemporal && temporalTeams.length === 0) {
        alert('Por favor, añade al menos un equipo a la Competición Temporal.');
        return;
    }

    try {
        const patchData = {
            name,
            price,
            image,
            hidden,
            isTemporal,
            temporalTeams,
            temporalTeam,
            updatedAt: new Date().toISOString()
        };

        await update(ref(db, `globalPatches/${key}`), patchData);

        const idx = globalPatchesList.findIndex(gp => gp.key === key);
        if (idx !== -1) {
            globalPatchesList[idx] = { ...globalPatchesList[idx], ...patchData };
        }

        let appliedMsg = '';
        if (isTemporal && temporalTeams.length > 0) {
            const count = await applyPatchToTeamLatestSeason({ key, ...patchData }, temporalTeams);
            if (count > 0) {
                appliedMsg = `\n\n¡Además se ha aplicado automáticamente a ${count} camiseta(s) de la última temporada de: ${temporalTeam}!`;
            }
        }

        renderPatchesTab();
        showToast(`Parche "${name}" actualizado correctamente.${appliedMsg}`);
    } catch (err) {
        console.error('Error updating global patch:', err);
        alert('Error al actualizar el parche global: ' + err.message);
    }
};

window.deleteGlobalPatchFromFirebase = async function(key, patchName) {
    if (!confirm(`¿Eliminar por completo el parche global "${patchName}" de la biblioteca? Esta acción no se puede deshacer.`)) {
        return;
    }

    try {
        await remove(ref(db, `globalPatches/${key}`));
        globalPatchesList = globalPatchesList.filter(gp => gp.key !== key);
        selectedGlobalPatchKeys.delete(key);
        renderPatchesTab();
        showToast(`Parche "${patchName}" eliminado de la biblioteca global.`);
    } catch (err) {
        console.error('Error deleting global patch:', err);
        alert('Error al eliminar el parche global: ' + err.message);
    }
};

window.triggerApplyPatchToTeam = async function(key) {
    const gp = globalPatchesList.find(p => p.key === key);
    if (!gp) return;

    const temporalTeams = (Array.isArray(gp.temporalTeams) && gp.temporalTeams.length > 0) 
        ? gp.temporalTeams 
        : (gp.temporalTeam ? gp.temporalTeam.split(',').map(t => t.trim()).filter(Boolean) : []);

    if (!gp.isTemporal || temporalTeams.length === 0) {
        alert('Este parche no está configurado como Competición Temporal o no tiene equipos asignados.');
        return;
    }

    const teamsStr = temporalTeams.join(', ');

    if (!confirm(`¿Aplicar el parche "${gp.name}" a TODAS las camisetas de la última temporada de: ${teamsStr}?`)) {
        return;
    }

    try {
        const count = await applyPatchToTeamLatestSeason(gp, temporalTeams);
        if (gp.key) {
            selectedGlobalPatchKeys.add(gp.key);
        }
        await renderPatchesTab();
        alert(`¡Éxito! Parche "${gp.name}" asignado y aplicado a ${count} camiseta(s) de la última temporada de: ${teamsStr}.`);
    } catch (err) {
        console.error('Error applying patch to teams:', err);
        alert('Error al aplicar parche a los equipos: ' + err.message);
    }
};

let quickApplyTeamsMap = {}; // key -> Set of team names

window.addTeamToQuickApply = async function(key) {
    const select = document.getElementById(`gp-quick-team-select-${key}`);
    if (!select || !select.value) return;
    const val = select.value.trim();

    if (val.startsWith('LIGA:')) {
        const leagueTeams = await getAllTeamsForLeague(val);
        if (!quickApplyTeamsMap[key]) quickApplyTeamsMap[key] = new Set();
        leagueTeams.forEach(t => quickApplyTeamsMap[key].add(t));
        select.value = '';
        renderQuickApplyTeamsPills(key);
        showToast(`Añadidos ${leagueTeams.length} equipos de la liga seleccionada.`);
        return;
    }

    const teamName = normalizeTeamName(val);
    if (teamName) {
        if (!quickApplyTeamsMap[key]) quickApplyTeamsMap[key] = new Set();
        quickApplyTeamsMap[key].add(teamName);
        select.value = '';
        renderQuickApplyTeamsPills(key);
    }
};

window.removeTeamFromQuickApply = function(key, teamName) {
    if (quickApplyTeamsMap[key]) {
        quickApplyTeamsMap[key].delete(teamName);
        renderQuickApplyTeamsPills(key);
    }
};

function renderQuickApplyTeamsPills(key) {
    const container = document.getElementById(`gp-quick-teams-pills-${key}`);
    if (!container) return;
    const teamsSet = quickApplyTeamsMap[key] || new Set();
    
    if (teamsSet.size === 0) {
        container.innerHTML = '<span style="color:#64748b; font-size:0.8rem; font-style:italic;">No hay equipos elegidos. Selecciona abajo o usa Selección Múltiple.</span>';
    } else {
        container.innerHTML = [...teamsSet].map(team => `
            <span class="gp-team-pill" style="background: rgba(56, 189, 248, 0.18); border-color: rgba(56, 189, 248, 0.4); color: #38bdf8;">
                <i class="fas fa-shield-alt"></i> ${sanitizeHTML(team)}
                <span class="gp-team-pill-remove" onclick="removeTeamFromQuickApply('${key}', '${sanitizeHTML(team).replace(/'/g, "\\'")}')" title="Quitar equipo">✕</span>
            </span>
        `).join('');
    }

    const select = document.getElementById(`gp-quick-team-select-${key}`);
    if (select && catalogAvailableTeamsCache.length > 0) {
        select.innerHTML = buildTeamAndLeagueSelectHTML(catalogAvailableTeamsCache, teamsSet);
    }
}

window.openMultiTeamModalForQuickApply = async function(key) {
    currentMultiTeamTargetKey = 'quick_' + key;
    const existingTeams = quickApplyTeamsMap[key] || new Set();
    await renderMultiTeamChecklist(existingTeams);
    const modal = document.getElementById('pe-multi-team-modal');
    if (modal) modal.classList.remove('hidden');
};

window.quickApplyPatchToTeams = async function(key) {
    const gp = globalPatchesList.find(p => p.key === key);
    if (!gp) return;

    const teamsSet = quickApplyTeamsMap[key] || new Set();
    const targetTeams = [...teamsSet];

    if (targetTeams.length === 0) {
        alert('Por favor, selecciona al menos un equipo al que quieras aplicar este parche.');
        return;
    }

    const teamsStr = targetTeams.join(', ');

    if (!confirm(`¿Aplicar el parche "${gp.name}" a TODAS las camisetas de la última temporada de: ${teamsStr}?`)) {
        return;
    }

    try {
        const count = await applyPatchToTeamLatestSeason(gp, targetTeams);
        
        const currentTeam = normalizeTeamName(getCurrentEditingProductTeam());
        if (targetTeams.includes(currentTeam) && gp.key) {
            selectedGlobalPatchKeys.add(gp.key);
            const card = document.getElementById(`gp-card-${gp.key}`);
            if (card) {
                const cb = card.querySelector('.pe-gp-assign-checkbox input[type="checkbox"]');
                if (cb) cb.checked = true;
            }
        }

        showToast(`¡Éxito! Parche "${gp.name}" aplicado a ${count} camiseta(s) de la última temporada de: ${teamsStr}.`);
    } catch (err) {
        console.error('Error applying patch to teams:', err);
        alert('Error al aplicar parche a los equipos: ' + err.message);
    }
};

async function applyPatchToTeamLatestSeason(patchData, targetTeams) {
    const teamsArray = Array.isArray(targetTeams) ? targetTeams : (targetTeams ? [targetTeams] : []);
    if (teamsArray.length === 0) return 0;

    const liveProducts = await getAllLiveProducts();
    const cleanTeams = teamsArray.map(t => t.trim().toLowerCase());

    let totalUpdatedCount = 0;

    for (const cleanTeam of cleanTeams) {
        const teamProducts = liveProducts.filter(p => {
            const pTeam = (p.team || extractTeamFromProductName(p.name) || '').trim().toLowerCase();
            const isRetro = p.retro === true || (p.name && p.name.toLowerCase().includes('retro'));
            return pTeam === cleanTeam && !isRetro;
        });

        if (teamProducts.length === 0) continue;

        let highestSeasonRank = -1;

        function getSeasonRank(name) {
            if (!name) return 0;
            const matchFullDoubleYear = name.match(/\b20(\d{2})\/(\d{2})\b/);
            if (matchFullDoubleYear) {
                return parseInt(matchFullDoubleYear[1] + matchFullDoubleYear[2]);
            }
            const matchDoubleYear = name.match(/\b(\d{2})\/(\d{2})\b/);
            if (matchDoubleYear) {
                return parseInt(matchDoubleYear[1] + matchDoubleYear[2]);
            }
            const matchSingleYear = name.match(/\b(20\d{2})\b/);
            if (matchSingleYear) {
                return parseInt(matchSingleYear[1].slice(2) + '00');
            }
            return 0;
        }

        teamProducts.forEach(p => {
            const rank = getSeasonRank(p.name);
            if (rank > highestSeasonRank) {
                highestSeasonRank = rank;
            }
        });

        const latestSeasonProducts = teamProducts.filter(p => {
            if (highestSeasonRank > 0) {
                return getSeasonRank(p.name) === highestSeasonRank;
            }
            return true;
        });

        const olderSeasonProducts = teamProducts.filter(p => {
            if (highestSeasonRank > 0) {
                return getSeasonRank(p.name) < highestSeasonRank;
            }
            return false;
        });

        // 4a. Limpiar este parche temporal de las camisetas de temporadas anteriores del equipo
        for (const olderProd of olderSeasonProducts) {
            let currentPatches = Array.isArray(olderProd.patches) ? [...olderProd.patches] : (Array.isArray(olderProd.customPatches) ? [...olderProd.customPatches] : []);
            const hasTemporal = currentPatches.some(p => (patchData.key && p.key === patchData.key) || (p.name && p.name.trim().toLowerCase() === patchData.name.trim().toLowerCase()));
            if (hasTemporal) {
                const cleanedPatches = currentPatches.filter(p => {
                    const matchKey = patchData.key && p.key === patchData.key;
                    const matchName = p.name && p.name.trim().toLowerCase() === patchData.name.trim().toLowerCase();
                    return !(matchKey || matchName);
                });
                await update(ref(db, `products/${olderProd.id}`), {
                    patches: cleanedPatches,
                    customPatches: cleanedPatches,
                    updatedAt: new Date().toISOString()
                });
            }
        }

        if (latestSeasonProducts.length === 0) continue;

        const patchObj = {
            key: patchData.key || '',
            name: patchData.name,
            price: parseFloat(patchData.price) || 0,
            image: patchData.image || '',
            isGlobal: true,
            isTemporal: !!patchData.isTemporal,
            temporalTeams: teamsArray,
            temporalTeam: teamsArray.join(', ')
        };

        for (const prod of latestSeasonProducts) {
            let currentPatches = Array.isArray(prod.patches) ? [...prod.patches] : (Array.isArray(prod.customPatches) ? [...prod.customPatches] : []);
            
            if (typeof editingProduct !== 'undefined' && editingProduct && prod.id === editingProduct.id) {
                selectedGlobalPatchKeys.forEach(k => {
                    const gp = globalPatchesList.find(p => p.key === k);
                    if (gp) {
                        const already = currentPatches.some(p => (p.key && p.key === gp.key) || (p.name && p.name.trim().toLowerCase() === gp.name.trim().toLowerCase()));
                        if (!already) {
                            currentPatches.push({
                                key: gp.key,
                                name: gp.name,
                                price: parseFloat(gp.price) || 0,
                                image: gp.image || '',
                                isGlobal: true
                            });
                        }
                    }
                });
            }

            const exists = currentPatches.some(p => (patchData.key && p.key === patchData.key) || (p.name && p.name.trim().toLowerCase() === patchData.name.trim().toLowerCase()));
            if (!exists) {
                currentPatches.push(patchObj);
            }

            await update(ref(db, `products/${prod.id}`), {
                patches: currentPatches,
                customPatches: currentPatches,
                updatedAt: new Date().toISOString()
            });
            totalUpdatedCount++;
        }

        if (typeof editingProduct !== 'undefined' && editingProduct && editingProduct.id) {
            const currentEditingTeam = (editingProduct.team || extractTeamFromProductName(editingProduct.name) || '').trim().toLowerCase();
            if (cleanTeams.includes(currentEditingTeam) && patchData.key) {
                selectedGlobalPatchKeys.add(patchData.key);
            }
        }
    }

    return totalUpdatedCount;
}

async function saveNewGlobalPatch(e) {
    if (e) e.preventDefault();
    const nameInput = document.getElementById('pe-new-gp-name');
    const priceInput = document.getElementById('pe-new-gp-price');
    const b64Input = document.getElementById('pe-new-gp-b64');
    const hiddenInput = document.getElementById('pe-new-gp-hidden');
    const isTemporalInput = document.getElementById('pe-new-gp-is-temporal');
    const previewImg = document.getElementById('pe-new-gp-preview');
    const btn = document.getElementById('btn-save-global-patch');

    const name = nameInput ? nameInput.value.trim() : '';
    const price = priceInput ? (parseFloat(priceInput.value) || 0) : 3.00;
    const image = b64Input ? b64Input.value : '';
    const hidden = hiddenInput ? hiddenInput.checked : false;
    const isTemporal = isTemporalInput ? isTemporalInput.checked : false;
    
    const temporalTeams = [...newGpTemporalTeams];
    const temporalTeam = temporalTeams.join(', ');

    if (!name) {
        alert('Ingresa el nombre del nuevo parche global.');
        return;
    }

    if (isTemporal && temporalTeams.length === 0) {
        alert('Por favor, añade al menos un equipo a la Competición Temporal.');
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
            hidden,
            isTemporal,
            temporalTeams,
            temporalTeam,
            createdAt: new Date().toISOString()
        };

        await set(newRef, patchData);

        globalPatchesList.push(patchData);
        selectedGlobalPatchKeys.add(patchData.key);

        let appliedMsg = '';
        if (isTemporal && temporalTeams.length > 0) {
            const count = await applyPatchToTeamLatestSeason(patchData, temporalTeams);
            if (count > 0) {
                appliedMsg = `\n\n¡Además se ha aplicado automáticamente a ${count} camiseta(s) de la última temporada de: ${temporalTeam}!`;
            }
        }

        if (nameInput) nameInput.value = '';
        if (priceInput) priceInput.value = '3.00';
        if (b64Input) b64Input.value = '';
        if (hiddenInput) hiddenInput.checked = false;
        if (isTemporalInput) isTemporalInput.checked = false;
        newGpTemporalTeams.clear();
        if (previewImg) previewImg.src = '../assets/placeholder.webp';
        toggleNewGpTemporalTeam(false);

        renderPatchesTab();
        alert(`¡Parche "${name}" guardado en la Biblioteca Global y asignado a esta camiseta!${appliedMsg}`);
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

async function assignPatchesToLeague() {
    const leagueSelectVal = document.getElementById('pe-league-select') ? document.getElementById('pe-league-select').value : '';
    const leagueCustomVal = document.getElementById('pe-league-custom') ? document.getElementById('pe-league-custom').value.trim() : '';
    const finalLeague = leagueSelectVal === '__new__' ? leagueCustomVal : leagueSelectVal;

    if (!finalLeague) {
        alert('Por favor, selecciona o escribe una liga antes de asignar los parches.');
        return;
    }

    const confirmMsg = `¿Estás completamente seguro de que deseas aplicar los parches seleccionados actualmente (tanto globales como exclusivos) a TODOS los productos de la liga "${finalLeague}"?\n\nEsta acción modificará la base de datos de manera masiva y no se puede deshacer fácilmente.`;
    if (!confirm(confirmMsg)) {
        return;
    }

    const btn = document.getElementById('btn-assign-league-patches');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Aplicando a toda la liga...';
    }

    try {
        // 1. Obtener los parches actuales seleccionados en el editor
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

        // 2. Obtener todos los productos
        const catalog = await loadProductsCache();

        // Helper para extraer el año de la temporada
        const extractSeasonYears = (text) => {
            if (!text) return null;
            const match = text.match(/\b((?:20)?\d{2})[\/-]((?:20)?\d{2})\b/);
            if (!match) return null;
            let start = parseInt(match[1], 10);
            let end   = parseInt(match[2], 10);
            if (start < 100) start += (start >= 90 ? 1900 : 2000);
            if (end   < 100) end   += (end   >= 90 ? 1900 : 2000);
            return [start, end];
        };

        const MAX_SEASON_YEAR = new Date().getFullYear() + 10;
        const getMaxYearForProduct = (p) => {
            let y = 0;
            const season = extractSeasonYears(p.name);
            if (season) {
                if (season[0] <= MAX_SEASON_YEAR && season[0] > y) y = season[0];
                if (season[1] <= MAX_SEASON_YEAR && season[1] > y) y = season[1];
            }
            if (p.temporada) {
                const tSeason = extractSeasonYears(String(p.temporada));
                if (tSeason) {
                    if (tSeason[0] <= MAX_SEASON_YEAR && tSeason[0] > y) y = tSeason[0];
                    if (tSeason[1] <= MAX_SEASON_YEAR && tSeason[1] > y) y = tSeason[1];
                } else {
                    const plain = parseInt(p.temporada, 10);
                    if (!isNaN(plain) && plain > 2000 && plain <= MAX_SEASON_YEAR && plain > y) y = plain;
                }
            }
            return y;
        };

        // Encontrar el año máximo dentro de la liga
        let maxYear = 0;
        catalog.forEach(p => {
            if (p.league && formatLeagueName(p.league).toLowerCase() === finalLeague.toLowerCase()) {
                const isRetro = p.retro === true || (p.name && p.name.toLowerCase().includes('retro'));
                if (!isRetro) {
                    const y = getMaxYearForProduct(p);
                    if (y > maxYear) maxYear = y;
                }
            }
        });

        // Filtrar por la liga exacta, excluyendo retro, y que pertenezcan a la última temporada
        const targetProducts = catalog.filter(p => {
            if (!p.league || formatLeagueName(p.league).toLowerCase() !== finalLeague.toLowerCase()) return false;
            
            // Excluir camisetas retro de la asignación masiva
            const isRetro = p.retro === true || (p.name && p.name.toLowerCase().includes('retro'));
            if (isRetro) return false;
            
            // Si encontramos un año máximo para la liga, aplicar el filtro de "nueva temporada"
            if (maxYear > 0) {
                if (getMaxYearForProduct(p) !== maxYear) return false;
            }
            
            return true;
        });

        if (targetProducts.length === 0) {
            alert(`No se encontraron productos para la liga "${finalLeague}".`);
            return;
        }

        // 4. Actualizar todos los productos en Firebase concurrentemente
        const updates = targetProducts.map(p => {
            return update(ref(db, `products/${p.id}`), {
                patches: finalPatchesArray,
                customPatches: finalPatchesArray,
                allowPatches: true, // Forzamos a true porque le estamos añadiendo parches
                updatedAt: new Date().toISOString()
            });
        });

        await Promise.all(updates);

        alert(`¡Éxito! Se han asignado los parches a ${targetProducts.length} producto(s) de la liga "${finalLeague}".`);

    } catch (err) {
        console.error('Error en asignación masiva de parches:', err);
        alert('Ocurrió un error al asignar los parches: ' + err.message);
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-copy"></i> Aplicar Parches a TODA la Liga';
        }
    }
}

// Inicializar el editor cuando carga el documento
document.addEventListener('DOMContentLoaded', () => {
    initProductEditor();
});

// Ocultar dropdowns de autocompletado al hacer clic fuera
document.addEventListener('click', (e) => {
    if (!e.target.closest('.pe-team-suggestions-list') && !e.target.closest('.pe-input')) {
        document.querySelectorAll('.pe-team-suggestions-list').forEach(el => el.classList.add('hidden'));
    }
});

// --- MULTI-TEAM CHECKBOX MODAL CONTROLLERS ---
let currentMultiTeamTargetKey = null; // null for new GP, string for edit GP

window.openMultiTeamModalForNewGp = async function() {
    currentMultiTeamTargetKey = null;
    await renderMultiTeamChecklist(newGpTemporalTeams);
    const modal = document.getElementById('pe-multi-team-modal');
    if (modal) modal.classList.remove('hidden');
};

window.openMultiTeamModalForEditGp = async function(key) {
    currentMultiTeamTargetKey = key;
    const existingTeams = editGpTemporalTeamsMap[key] || new Set();
    await renderMultiTeamChecklist(existingTeams);
    const modal = document.getElementById('pe-multi-team-modal');
    if (modal) modal.classList.remove('hidden');
};

window.closeMultiTeamModal = function() {
    const modal = document.getElementById('pe-multi-team-modal');
    if (modal) modal.classList.add('hidden');
};

async function renderMultiTeamChecklist(activeTeamsSet) {
    const checklist = document.getElementById('pe-multi-team-checklist');
    if (!checklist) return;

    const allTeams = await getAllTeamsFromCatalog();
    checklist.innerHTML = allTeams.map(t => {
        const isChecked = activeTeamsSet.has(t);
        return `
            <label style="display: flex; align-items: center; gap: 0.5rem; padding: 0.4rem 0.6rem; border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; background: rgba(255,255,255,0.03); cursor: pointer; font-size: 0.85rem; color: #e2e8f0;">
                <input type="checkbox" class="pe-team-modal-cb" value="${sanitizeHTML(t)}" ${isChecked ? 'checked' : ''} style="accent-color: #10b981; width: 16px; height: 16px; cursor: pointer;">
                <span>${sanitizeHTML(t)}</span>
            </label>
        `;
    }).join('');

    const searchInput = document.getElementById('pe-multi-team-search');
    if (searchInput) searchInput.value = '';
}

window.filterMultiTeamModalList = function(query) {
    const q = (query || '').toLowerCase().trim();
    const labels = document.querySelectorAll('#pe-multi-team-checklist label');
    labels.forEach(lbl => {
        const text = lbl.textContent.toLowerCase();
        if (text.includes(q)) {
            lbl.style.display = 'flex';
        } else {
            lbl.style.display = 'none';
        }
    });
};

window.checkLeagueInModal = async function(leagueKey) {
    const leagueTeams = await getAllTeamsForLeague(leagueKey);
    const set = new Set(leagueTeams.map(t => t.toLowerCase()));
    
    const checkboxes = document.querySelectorAll('.pe-team-modal-cb');
    let count = 0;
    checkboxes.forEach(cb => {
        const teamName = cb.value.trim().toLowerCase();
        if (set.has(teamName)) {
            cb.checked = true;
            count++;
        }
    });

    if (typeof showToast === 'function') {
        showToast(`Marcados ${count} equipos de la liga seleccionada.`);
    }
};

window.confirmMultiTeamModalSelection = function() {
    const checkboxes = document.querySelectorAll('.pe-team-modal-cb:checked');
    const selectedTeams = Array.from(checkboxes).map(cb => cb.value.trim());

    if (currentMultiTeamTargetKey === null) {
        newGpTemporalTeams = new Set(selectedTeams);
        renderNewGpTeamsPills();
    } else if (currentMultiTeamTargetKey.startsWith('quick_')) {
        const key = currentMultiTeamTargetKey.replace('quick_', '');
        quickApplyTeamsMap[key] = new Set(selectedTeams);
        renderQuickApplyTeamsPills(key);
    } else {
        editGpTemporalTeamsMap[currentMultiTeamTargetKey] = new Set(selectedTeams);
        renderGpEditTeamsPills(currentMultiTeamTargetKey);
    }

    closeMultiTeamModal();
};


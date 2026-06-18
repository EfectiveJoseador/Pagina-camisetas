import { auth, db, onAuthStateChanged, ref, get, push, set } from './firebase-config.js';
import Cart from './carrito.js';
import products from './products-data.js';
import { getUserCoupons, useCoupon, addPendingPoints } from './points.js';
import { sanitizeHTML } from './security.js';
import Analytics from './analytics.js';
let currentUser = null;
let selectedAddressId = null;
let addresses = [];
let selectedCoupon = null;
let appliedDiscount = 0;
let userCoupons = [];
let appliedPromoCode = null;
let promoDiscount = 0;
let editingAddressId = null;
const WEB3FORMS_KEY = "8e920ab3-b0f7-4768-a83a-ed3ef8cd58a8";
const PAYPAL_USERNAME = "camisetazo";

async function loadUserAddresses() {
    if (!currentUser) {
        showLoginPrompt();
        return;
    }

    const addressList = document.getElementById('saved-addresses-list');

    try {
        const addressesRef = ref(db, `users/${currentUser.uid}/addresses`);
        const snapshot = await get(addressesRef);

        if (snapshot.exists()) {
            addresses = Object.entries(snapshot.val()).map(([id, addr]) => ({ id, ...addr }));
            renderAddresses(addresses);
        } else {
            addressList.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                    <i class="fas fa-map-marker-alt" style="font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.5;"></i>
                    <p>No tienes direcciones guardadas.</p>
                    <p style="font-size: 0.85rem; margin-top: 0.5rem;">Haz clic en "Añadir Nueva" para crear una.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading addresses:', error);
        addressList.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                <p>Error al cargar las direcciones. Inténtalo de nuevo.</p>
            </div>
        `;
    }
}

function renderAddresses(addressArray) {
    const addressList = document.getElementById('saved-addresses-list');

    if (addressArray.length === 0) {
        addressList.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                <i class="fas fa-map-marker-alt" style="font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.5;"></i>
                <p>No tienes direcciones guardadas.</p>
            </div>
        `;
        return;
    }

    addressList.innerHTML = addressArray.map(addr => `
        <label class="address-option ${selectedAddressId === addr.id ? 'selected' : ''}" data-id="${sanitizeHTML(addr.id)}">
            <input type="radio" name="shipping-address" value="${sanitizeHTML(addr.id)}" ${selectedAddressId === addr.id ? 'checked' : ''}>
            <div class="address-content">
                <div class="address-header" style="width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                    <strong>${sanitizeHTML(addr.name)}</strong>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        ${selectedAddressId === addr.id ? '<span class="selected-badge"><i class="fas fa-check-circle"></i> Seleccionada</span>' : ''}
                        <button type="button" class="btn-edit-address-card" data-id="${sanitizeHTML(addr.id)}" title="Editar dirección" style="background: rgba(99, 102, 241, 0.1); border: none; color: var(--primary); cursor: pointer; font-size: 0.8rem; padding: 0.3rem 0.6rem; border-radius: 6px; display: flex; align-items: center; gap: 0.25rem;">
                            <i class="fas fa-pen" style="font-size: 0.75rem;"></i> Editar
                        </button>
                    </div>
                </div>
                <p>${sanitizeHTML(addr.street)}</p>
                <p>${sanitizeHTML(addr.zip)}, ${sanitizeHTML(addr.city)}${addr.province ? ' (' + sanitizeHTML(addr.province) + ')' : ''}</p>
                <p><i class="fas fa-phone" style="font-size: 0.85em;"></i> ${sanitizeHTML(addr.phone)}</p>
                <p><i class="fab fa-tiktok" style="color: #00c951; font-size: 0.85em;"></i> @${sanitizeHTML((addr.instagram || '').replace(/^@/, ''))}</p>
            </div>
        </label>
    `).join('');

    document.querySelectorAll('input[name="shipping-address"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            selectAddress(e.target.value);
        });
    });

    document.querySelectorAll('.btn-edit-address-card').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const id = btn.dataset.id;
            editAddress(id);
        });
    });
}

function editAddress(addressId) {
    const addr = addresses.find(a => a.id === addressId);
    if (!addr) return;

    editingAddressId = addressId;

    document.getElementById('new-address-name').value = addr.name || '';
    document.getElementById('new-address-street').value = addr.street || '';
    document.getElementById('new-address-city').value = addr.city || '';
    document.getElementById('new-address-zip').value = addr.zip || '';
    
    const provinceSelect = document.getElementById('new-address-province');
    if (provinceSelect) {
        provinceSelect.value = addr.province || '';
    }
    
    document.getElementById('new-address-phone').value = addr.phone || '';
    
    const instagramInput = document.getElementById('new-address-instagram');
    if (instagramInput) {
        instagramInput.value = addr.instagram || '';
    }

    const formTitle = document.querySelector('#new-address-form-container h3');
    if (formTitle) {
        formTitle.textContent = 'Editar Dirección';
    }

    showNewAddressForm();
}

function selectAddress(addressId) {
    selectedAddressId = addressId;

    document.querySelectorAll('.address-option').forEach(option => {
        if (option.dataset.id === addressId) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });

    const warning = document.getElementById('address-warning');
    if (warning) {
        warning.style.display = 'none';
    }

    const paymentSection = document.getElementById('payment-section');
    if (paymentSection) {
        paymentSection.style.display = 'block';
        paymentSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    initPaymentMethods();
    const calculations = Cart.calculateTotal();
    if (Analytics && Cart.items.length > 0) {
        Analytics.trackBeginCheckout(Cart.items, calculations.total);
        const selectedAddr = addresses.find(a => a.id === addressId);
        if (selectedAddr) {
            Analytics.trackAddShippingInfo(selectedAddr);
        }
    }
}

function showNewAddressForm() {
    const formContainer = document.getElementById('new-address-form-container');
    const addButton = document.getElementById('add-new-address-btn');

    if (formContainer) {
        formContainer.style.display = 'block';
        formContainer.scrollIntoView({ behavior: 'smooth' });
    }

    if (addButton) {
        addButton.style.display = 'none';
    }
}

function hideNewAddressForm() {
    const formContainer = document.getElementById('new-address-form-container');
    const addButton = document.getElementById('add-new-address-btn');
    const form = document.getElementById('new-address-form');

    if (formContainer) {
        formContainer.style.display = 'none';
    }

    if (addButton) {
        addButton.style.display = 'inline-flex';
    }

    if (form) {
        form.reset();
    }
    
    editingAddressId = null;
    const formTitle = document.querySelector('#new-address-form-container h3');
    if (formTitle) {
        formTitle.textContent = 'Nueva Dirección';
    }
}

async function saveNewAddress(e) {
    e.preventDefault();
    if (!currentUser) return;

    const instagramInput = document.getElementById('new-address-instagram');
    const provinceInput = document.getElementById('new-address-province');
    const addressData = {
        name: document.getElementById('new-address-name').value.trim(),
        street: document.getElementById('new-address-street').value.trim(),
        city: document.getElementById('new-address-city').value.trim(),
        zip: document.getElementById('new-address-zip').value.trim(),
        province: provinceInput ? provinceInput.value : '',
        phone: document.getElementById('new-address-phone').value.trim(),
        instagram: instagramInput ? instagramInput.value.trim() : ''
    };

    try {
        if (editingAddressId) {
            const addressRef = ref(db, `users/${currentUser.uid}/addresses/${editingAddressId}`);
            await set(addressRef, addressData);

            await loadUserAddresses();
            selectAddress(editingAddressId);
        } else {
            const addressesRef = ref(db, `users/${currentUser.uid}/addresses`);
            const newAddressRef = await push(addressesRef, addressData);

            await loadUserAddresses();

            const newAddressId = newAddressRef.key;
            selectAddress(newAddressId);
        }

        hideNewAddressForm();
    } catch (error) {
        console.error('Error saving address:', error);
        alert('Error al guardar la dirección. Inténtalo de nuevo.');
    }
}

function initPaymentMethods() {
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const paypalInfo = document.getElementById('paypal-info');
    const bizumInfo = document.getElementById('bizum-info');

    if (!paymentRadios || paymentRadios.length === 0) return;

    // Set initial display states based on active radio
    const activeRadio = document.querySelector('input[name="payment"]:checked');
    if (activeRadio) {
        if (paypalInfo) paypalInfo.style.display = activeRadio.value === 'paypal' ? 'block' : 'none';
        if (bizumInfo) bizumInfo.style.display = activeRadio.value === 'bizum' ? 'block' : 'none';
    }

    paymentRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (paypalInfo) paypalInfo.style.display = e.target.value === 'paypal' ? 'block' : 'none';
            if (bizumInfo) bizumInfo.style.display = e.target.value === 'bizum' ? 'block' : 'none';

            // Reset checkout button state if payment method changes
            const confirmBtn = document.getElementById('confirm-order-btn');
            if (confirmBtn) {
                confirmBtn.innerHTML = '<i class="fas fa-check-circle"></i> Confirmar Pedido';
                confirmBtn.disabled = false;
                confirmBtn.classList.remove('paypal-opened');
                delete confirmBtn.dataset.paypalUrl;
            }
            const manualBtn = document.getElementById('paypal-manual-confirm-btn');
            if (manualBtn) {
                manualBtn.style.display = 'none';
            }

            if (window.Analytics) {
                window.Analytics.trackAddPaymentInfo(e.target.value);
            }
        });
    });
}

// ── 2. Validación de Código Postal (Mejora 3 - mock AJAX) ──
function setupZipCodeLookup() {
    const zipInput = document.getElementById('new-address-zip');
    const cityInput = document.getElementById('new-address-city');
    const provinceInput = document.getElementById('new-address-province');
    const zipSpinner = document.getElementById('zip-spinner');

    if (!zipInput) return;

    zipInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        e.target.value = value;

        if (value.length === 5) {
            zipSpinner?.classList.remove('hidden');
            setTimeout(() => {
                zipSpinner?.classList.add('hidden');

                const provCode = value.substring(0, 2);
                const provinces = {
                    '01': { city: 'Vitoria-Gasteiz', province: 'Álava' },
                    '02': { city: 'Albacete', province: 'Albacete' },
                    '03': { city: 'Alicante', province: 'Alicante' },
                    '04': { city: 'Almería', province: 'Almería' },
                    '05': { city: 'Ávila', province: 'Ávila' },
                    '06': { city: 'Badajoz', province: 'Badajoz' },
                    '07': { city: 'Palma de Mallorca', province: 'Illes Balears' },
                    '08': { city: 'Barcelona', province: 'Barcelona' },
                    '09': { city: 'Burgos', province: 'Burgos' },
                    '10': { city: 'Cáceres', province: 'Cáceres' },
                    '11': { city: 'Cádiz', province: 'Cádiz' },
                    '12': { city: 'Castellón de la Plana', province: 'Castellón' },
                    '13': { city: 'Ciudad Real', province: 'Ciudad Real' },
                    '14': { city: 'Córdoba', province: 'Córdoba' },
                    '15': { city: 'Santiago de Compostela', province: 'A Coruña' },
                    '16': { city: 'Cuenca', province: 'Cuenca' },
                    '17': { city: 'Girona', province: 'Girona' },
                    '18': { city: 'Granada', province: 'Granada' },
                    '19': { city: 'Guadalajara', province: 'Guadalajara' },
                    '20': { city: 'San Sebastián', province: 'Guipúzcoa' },
                    '21': { city: 'Huelva', province: 'Huelva' },
                    '22': { city: 'Huesca', province: 'Huesca' },
                    '23': { city: 'Jaén', province: 'Jaén' },
                    '24': { city: 'León', province: 'León' },
                    '25': { city: 'Lleida', province: 'Lleida' },
                    '26': { city: 'Logroño', province: 'La Rioja' },
                    '27': { city: 'Lugo', province: 'Lugo' },
                    '28': { city: 'Madrid', province: 'Madrid' },
                    '29': { city: 'Málaga', province: 'Málaga' },
                    '30': { city: 'Murcia', province: 'Murcia' },
                    '31': { city: 'Pamplona', province: 'Navarra' },
                    '32': { city: 'Ourense', province: 'Ourense' },
                    '33': { city: 'Oviedo', province: 'Asturias' },
                    '34': { city: 'Palencia', province: 'Palencia' },
                    '35': { city: 'Las Palmas de Gran Canaria', province: 'Las Palmas' },
                    '36': { city: 'Pontevedra', province: 'Pontevedra' },
                    '37': { city: 'Salamanca', province: 'Salamanca' },
                    '38': { city: 'Santa Cruz de Tenerife', province: 'Santa Cruz de Tenerife' },
                    '39': { city: 'Santander', province: 'Cantabria' },
                    '40': { city: 'Segovia', province: 'Segovia' },
                    '41': { city: 'Sevilla', province: 'Sevilla' },
                    '42': { city: 'Soria', province: 'Soria' },
                    '43': { city: 'Tarragona', province: 'Tarragona' },
                    '44': { city: 'Teruel', province: 'Teruel' },
                    '45': { city: 'Toledo', province: 'Toledo' },
                    '46': { city: 'Valencia', province: 'Valencia' },
                    '47': { city: 'Valladolid', province: 'Valladolid' },
                    '48': { city: 'Bilbao', province: 'Vizcaya' },
                    '49': { city: 'Zamora', province: 'Zamora' },
                    '50': { city: 'Zaragoza', province: 'Zaragoza' },
                    '51': { city: 'Ceuta', province: 'Ceuta' },
                    '52': { city: 'Melilla', province: 'Melilla' }
                };
                const match = provinces[provCode] || { city: 'Valencia', province: 'Valencia' };
                if (cityInput) cityInput.value = match.city;
                if (provinceInput) provinceInput.value = match.province;
            }, 400);
        }
    });
}

function confirmOrder() {
    const confirmBtn = document.getElementById('confirm-order-btn');
    
    // Si PayPal ya se abrió previamente, al hacer clic reabrimos la pestaña/ventana
    if (confirmBtn && confirmBtn.classList.contains('paypal-opened')) {
        const url = confirmBtn.dataset.paypalUrl;
        if (url) {
            window.open(url, '_blank');
        }
        return;
    }

    if (!currentUser) {
        alert('Debes iniciar sesión para realizar un pedido.');
        window.location.href = '/pages/login.html';
        return;
    }

    if (!selectedAddressId) {
        showAddressWarning();
        return;
    }

    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    if (!selectedPayment) {
        alert('Por favor, selecciona un método de pago');
        return;
    }

    const paymentMethod = selectedPayment.value;

    const selectedAddress = addresses.find(a => a.id === selectedAddressId);
    const calculations = Cart.calculateTotal();
    const orderId = 'ORD-' + Date.now();

    if (!calculations || isNaN(calculations.total)) {
        alert('Error al calcular el total del pedido. Actualiza la página e inténtalo de nuevo.');
        return;
    }
    const totalDiscounts = appliedDiscount + promoDiscount;
    const finalTotal = Math.max(0, calculations.total - totalDiscounts);
    const totalShirtQuantity = Cart.items.reduce((sum, item) => sum + (item.quantity || item.qty || 1), 0);

    const orderData = {
        orderId: orderId,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        customerName: currentUser.displayName || 'Usuario',
        customerEmail: currentUser.email,
        date: new Date().toISOString(),
        dateFormatted: new Date().toLocaleString('es-ES'),
        createdAt: Date.now(),
        status: 'pendiente',
        trackingNumber: null,
        items: Cart.items.map(item => {
            const product = products.find(p => p.id === item.id);
            const custom = item.customization || {};
            return {
                id: item.id,
                sku: product?.sku || item.sku || '',
                name: item.name || product?.name || `Producto ${item.id}`,
                image: item.image || product?.image || '/assets/placeholder.webp',
                quantity: item.quantity || item.qty || 1,
                size: custom.size || item.size || 'N/A',
                version: custom.version || item.version || 'aficionado',
                price: item.price || product?.price || 0,
                customization: custom
            };
        }),
        total: finalTotal,
        subtotal: calculations.subtotal,
        shipping: calculations.shipping,
        protectionFee: calculations.protectionFee,
        discount: totalDiscounts,
        couponUsed: selectedCoupon ? selectedCoupon.id : null,
        couponDiscount: appliedDiscount,
        promoCodeUsed: appliedPromoCode ? appliedPromoCode.id : null,
        promoCodeDiscount: promoDiscount,
        shippingAddress: selectedAddress,
        paymentMethod: paymentMethod,
        pointsToEarn: totalShirtQuantity * 10
    };

    if (paymentMethod === 'paypal') {
        orderData.paypalLink = `https://www.paypal.com/paypalme/${PAYPAL_USERNAME}/${finalTotal.toFixed(2)}`;
    }

    if (!confirmBtn) return;
    if (paymentMethod === 'paypal') {
        const paypalUrl = orderData.paypalLink;

        let paypalWindow = window.open(paypalUrl, '_blank');

        if (!paypalWindow) {
            alert('Por favor, permite ventanas emergentes para completar el pago.');
            return;
        }

        const originalText = confirmBtn.innerHTML;
        confirmBtn.innerHTML = '<i class="fas fa-external-link-alt"></i> PayPal abierto... Clic para volver a abrir';
        confirmBtn.classList.add('paypal-opened');
        confirmBtn.dataset.paypalUrl = paypalUrl;
        confirmBtn.disabled = false; // Mantener clickable para reabrir el enlace

        // Botón de confirmación manual — el usuario lo pulsa tras pagar
        let manualBtn = document.getElementById('paypal-manual-confirm-btn');
        if (!manualBtn) {
            manualBtn = document.createElement('button');
            manualBtn.id = 'paypal-manual-confirm-btn';
            manualBtn.type = 'button';
            manualBtn.style.cssText = 'width:100%;margin-top:0.75rem;padding:0.9rem 1.5rem;background:linear-gradient(135deg,#0070ba,#003087);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:0.5rem;box-shadow:0 4px 14px rgba(0,112,186,0.35);transition:all 0.2s ease';
            manualBtn.innerHTML = '<i class="fab fa-paypal"></i> Ya he pagado &mdash; Confirmar pedido';
            confirmBtn.parentNode.appendChild(manualBtn);
        }
        manualBtn.style.display = 'flex';

        manualBtn.onclick = async () => {
            manualBtn.style.display = 'none';
            confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Finalizando...';
            confirmBtn.disabled = true;
            confirmBtn.classList.remove('paypal-opened');
            delete confirmBtn.dataset.paypalUrl;
            try {
                await saveOrder(orderData);
                await sendOrderViaWeb3Forms(orderData);
                if (appliedPromoCode) {
                    await incrementPromoUsage(appliedPromoCode.id, appliedPromoCode);
                }
                if (orderData.pointsToEarn > 0) {
                    await addPendingPoints(currentUser.uid, orderData.orderId, totalShirtQuantity);
                }
                if (selectedCoupon) {
                    await useCoupon(currentUser.uid, selectedCoupon.id, orderData.orderId);
                }
                localStorage.removeItem('cart');
                localStorage.removeItem('appliedPacks');
                window.location.href = '/pages/orden-exitosa.html?order=' + orderData.orderId;
            } catch (error) {
                console.error('Error procesando pedido:', error);
                alert('Error al procesar el pedido: ' + (error.message || 'Intentalo de nuevo.'));
                confirmBtn.innerHTML = originalText;
                confirmBtn.disabled = false;
                confirmBtn.classList.add('paypal-opened');
                confirmBtn.dataset.paypalUrl = paypalUrl;
                manualBtn.style.display = 'flex';
            }
        };

    } else {
        const originalText = confirmBtn.innerHTML;
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        confirmBtn.disabled = true;
        (async () => {
            try {
                await saveOrder(orderData);
                await sendOrderViaWeb3Forms(orderData);
                // Incrementar uso del código promo solo si el pedido se guardó con éxito
                if (appliedPromoCode) {
                    await incrementPromoUsage(appliedPromoCode.id, appliedPromoCode);
                }
                if (orderData.pointsToEarn > 0) {
                    await addPendingPoints(currentUser.uid, orderData.orderId, totalShirtQuantity);
                }
                if (selectedCoupon) {
                    await useCoupon(currentUser.uid, selectedCoupon.id, orderData.orderId);
                }
                localStorage.removeItem('cart');
                localStorage.removeItem('appliedPacks');
                window.location.href = '/pages/orden-exitosa.html?order=' + orderData.orderId;
            } catch (error) {
                console.error('Error procesando pedido:', error);
                alert('Error al procesar el pedido: ' + (error.message || 'Inténtalo de nuevo.'));
                confirmBtn.innerHTML = originalText;
                confirmBtn.disabled = false;
            }
        })();
    }
}

async function sendOrderViaWeb3Forms(orderData) {
    const sa = orderData.shippingAddress || {};
    const customerInfo = `Contact Name: ${sa.name || ''}
Address Line: ${sa.street || ''}
City: ${sa.city || ''}
Province: ${sa.province || ''}
Country: España
Postal Code: ${sa.zip || ''}
Phone Number: ${sa.phone || ''}
TikTok: @${(sa.instagram || '').replace(/^@/, '')}`;
    let productsText = '';
    orderData.items.forEach((item) => {
        const qty = item.quantity || 1;
        const custom = item.customization || {};
        const size = custom.size || item.size || 'N/A';
        let version = custom.version || item.version || 'fan';
        if (version.toLowerCase() === 'aficionado') {
            version = 'fan';
        }

        let extras = [];
        if (custom.patch) {
            extras.push('Parche: ' + custom.patch);
        } else if (custom.patches && custom.patches.length > 0) {
            extras.push('Parches: ' + custom.patches.join(', '));
        }

        if (custom.name || custom.number) {
            const nombreVal = custom.name || '(nombre vacío)';
            const numeroVal = custom.number || '(numero vacío)';
            extras.push('Personalización: ' + nombreVal + ' - ' + numeroVal);
        }

        let extrasStr = extras.length > 0 ? (' [' + extras.join(' | ') + ']') : '';

        const price = (item.price * qty).toFixed(2);
        const itemSku = item.sku ? ` [SKU: ${item.sku}]` : '';
        productsText += qty + 'x ' + item.name + itemSku + ' - ' + size + ' - ' + version + extrasStr + ' - €' + price + '\n';
    });
    let totalInfo = `Subtotal: €${orderData.subtotal.toFixed(2)}\n`;

    if (orderData.protectionFee && orderData.protectionFee > 0) {
        totalInfo += `Tasa Temporal de Protección: +€${orderData.protectionFee.toFixed(2)}\n`;
    }

    if (orderData.promoCodeUsed) {
        totalInfo += `Código promo (${orderData.promoCodeUsed}): -€${orderData.promoCodeDiscount.toFixed(2)}\n`;
    }
    if (orderData.couponUsed) {
        totalInfo += `Cupón usado (${orderData.couponUsed}): -€${orderData.couponDiscount.toFixed(2)}\n`;
    }
    if (orderData.discount > 0) {
        totalInfo += `Descuento total: -€${orderData.discount.toFixed(2)}\n`;
    }

    const paymentMethodText = orderData.paymentMethod ? orderData.paymentMethod.toUpperCase() : 'NO ESPECIFICADO';
    totalInfo += `Método de pago: ${paymentMethodText}\n`;
    totalInfo += `TOTAL A PAGAR: €${orderData.total.toFixed(2)}`;

    const formData = new FormData();
    formData.append("access_key", WEB3FORMS_KEY);
    formData.append("subject", "Nuevo pedido con pago confirmado - " + orderData.orderId);
    formData.append("cliente", customerInfo);
    formData.append("productos", productsText.trim());
    formData.append("total", totalInfo);

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (response.ok && data.success) {
            return true;
        } else {
            console.error('Web3Forms error:', data.message);
            return false;
        }
    } catch (error) {
        console.error('Error al enviar Web3Forms:', error);
        return false;
    }
}

async function saveOrder(orderData) {
    if (!currentUser) {
        console.error('⚠️ Cannot save order: No user authenticated');
        throw new Error('Usuario no autenticado');
    }

    try {
        const orderRef = ref(db, `ordersByUser/${currentUser.uid}/${orderData.orderId}`);
        const orderToSave = {
            ...orderData,
            userId: currentUser.uid,
            userEmail: currentUser.email,
            status: orderData.status || 'pendiente',
            createdAt: orderData.createdAt || Date.now(),
            trackingNumber: orderData.trackingNumber || ''
        };

        await set(orderRef, orderToSave);
        return true;
    } catch (error) {
        console.error('❌ Error saving order to Firebase:', error);
        if (error.code === 'PERMISSION_DENIED') {
            console.error('⚠️ Firebase permission denied. Check if email is verified or rules are too restrictive.');
        }
        // Relanzar para que el bloque try/catch del caller lo capture
        throw error;
    }
}

function showAddressWarning() {
    const warning = document.getElementById('address-warning');
    if (warning) {
        warning.style.display = 'block';
        warning.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function showLoginPrompt() {
    const checkoutLayout = document.querySelector('.checkout-layout');
    if (checkoutLayout) {
        checkoutLayout.innerHTML = `
            <div class="login-required-overlay" style="
                grid-column: 1 / -1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 4rem 2rem;
                text-align: center;
                background: var(--bg-card);
                border-radius: 16px;
                border: 1px solid var(--border);
            ">
                <i class="fas fa-user-lock" style="font-size: 4rem; color: var(--primary); margin-bottom: 1.5rem; opacity: 0.8;"></i>
                <h2 style="color: var(--text-main); margin-bottom: 0.5rem; font-size: 1.5rem;">Inicia sesión para continuar</h2>
                <p style="color: var(--text-muted); margin-bottom: 2rem; max-width: 400px;">
                    Para realizar un pedido necesitas tener una cuenta. Así podrás guardar tus direcciones y ver el historial de tus pedidos.
                </p>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
                    <a href="/pages/login.html?redirect=checkout" class="btn-modal-primary" style="text-decoration: none;">
                        <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
                    </a>
                    <a href="/pages/login.html?redirect=checkout#register" class="btn-modal-secondary" style="text-decoration: none;">
                        <i class="fas fa-user-plus"></i> Crear Cuenta
                    </a>
                </div>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const addNewAddressBtn = document.getElementById('add-new-address-btn');
    const cancelNewAddressBtn = document.getElementById('cancel-new-address-btn');
    const newAddressForm = document.getElementById('new-address-form');

    if (addNewAddressBtn) {
        addNewAddressBtn.addEventListener('click', () => {
            editingAddressId = null;
            const formTitle = document.querySelector('#new-address-form-container h3');
            if (formTitle) {
                formTitle.textContent = 'Nueva Dirección';
            }
            const form = document.getElementById('new-address-form');
            if (form) {
                form.reset();
            }
            showNewAddressForm();
        });
    }

    if (cancelNewAddressBtn) {
        cancelNewAddressBtn.addEventListener('click', hideNewAddressForm);
    }

    if (newAddressForm) {
        newAddressForm.addEventListener('submit', saveNewAddress);
    }

    const confirmBtn = document.getElementById('confirm-order-btn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', confirmOrder);
    }

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            currentUser = user;
            await loadUserAddresses();
            await loadUserCoupons();
            initPaymentMethods();
            setupZipCodeLookup();
        } else {
            showLoginPrompt();
        }
    });

    const calculations = Cart.calculateTotal();
    const shippingEl = document.getElementById('checkout-shipping');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const totalEl = document.getElementById('checkout-total');

    if (shippingEl) {
        shippingEl.textContent = calculations.shipping === 0 ? 'Gratis' : `€${calculations.shipping.toFixed(2)}`;
    }
    if (subtotalEl) {
        if (calculations.packSaving > 0) {
            subtotalEl.innerHTML = `
                <span style="text-decoration: line-through; color: var(--text-muted); font-size: 0.88em; margin-right: 0.4em;">€${calculations.originalSubtotal.toFixed(2)}</span>
                <span style="color: var(--accent, #6366f1); font-weight: 700;">€${calculations.subtotal.toFixed(2)}</span>
            `;
        } else {
            subtotalEl.textContent = `€${calculations.subtotal.toFixed(2)}`;
        }
    }
    if (totalEl) {
        totalEl.textContent = `€${calculations.total.toFixed(2)}`;
    }
    const couponSelect = document.getElementById('apply-coupon');
    if (couponSelect) {
        couponSelect.addEventListener('change', applyCouponDiscount);
    }
});

async function loadUserCoupons() {
    if (!currentUser) return;

    userCoupons = await getUserCoupons(currentUser.uid);

    const couponSection = document.getElementById('coupon-section');
    const couponSelect = document.getElementById('apply-coupon');

    if (couponSection) {
        couponSection.style.display = 'block';

        if (userCoupons.length > 0 && couponSelect) {
            couponSelect.innerHTML = '<option value="">Sin cupón</option>';
            userCoupons.forEach(coupon => {
                const optionText = coupon.type === 'percentage'
                    ? `${coupon.value}% descuento`
                    : `€${coupon.value.toFixed(2)} descuento`;
                couponSelect.innerHTML += `<option value="${coupon.id}">${optionText}</option>`;
            });
        } else {
            couponSection.innerHTML = `
                <div style="text-align: center; padding: 0.75rem; color: var(--text-muted); font-size: 0.85rem;">
                    <i class="fas fa-ticket-alt" style="opacity: 0.5;"></i>
                    No tienes cupones disponibles.
                    <a href="/pages/perfil.html" style="color: var(--primary); text-decoration: none;">Canjea puntos</a>
                </div>
            `;
        }
    }
}

// ── Helper: total de artículos en el carrito ────────────────────────────
function getTotalCartItems() {
    return Cart.items.reduce((sum, item) => sum + (item.quantity || item.qty || 1), 0);
}

// ── Helper: mostrar/ocultar mensaje de error del cupón ──────────────────
function setCouponError(message) {
    let el = document.getElementById('coupon-restriction-msg');
    if (!el) {
        // Crear el elemento si no existe y anclarlo después del select
        const couponSelect = document.getElementById('apply-coupon');
        if (couponSelect) {
            el = document.createElement('p');
            el.id = 'coupon-restriction-msg';
            el.style.cssText = 'margin:6px 0 0; font-size:0.82rem; color:#f87171; display:flex; align-items:center; gap:5px;';
            couponSelect.parentNode.insertBefore(el, couponSelect.nextSibling);
        }
    }
    if (el) {
        el.innerHTML = message
            ? `<i class="fas fa-circle-exclamation"></i> ${message}`
            : '';
        el.style.display = message ? 'flex' : 'none';

        if (message && Analytics) {
            const couponSelect = document.getElementById('apply-coupon');
            Analytics.trackCouponError(couponSelect?.value || 'unknown', message);
        }
    }
}

// ── Helper: muestra el total con precio tachado si hay descuento ────────
function setTotalDisplay(originalTotal, finalTotal) {
    const totalEl = document.getElementById('checkout-total');
    if (!totalEl) return;
    const saving = Math.round((originalTotal - finalTotal) * 100) / 100;
    if (saving > 0.005) {
        totalEl.innerHTML = `
            <span style="text-decoration: line-through; color: var(--text-muted); font-size: 0.88em; margin-right: 0.4em;">€${originalTotal.toFixed(2)}</span>
            <span style="color: #10b981; font-weight: 700;">€${finalTotal.toFixed(2)}</span>
        `;
    } else {
        totalEl.textContent = `€${finalTotal.toFixed(2)}`;
    }
}

// ── Lógica principal de cupón ───────────────────────────────────────────
function applyCouponDiscount() {
    const couponSelect = document.getElementById('apply-coupon');
    const couponId = couponSelect?.value;
    const discountApplied = document.getElementById('discount-applied');
    const discountText = document.getElementById('discount-text');
    const totalEl = document.getElementById('checkout-total');
    selectedCoupon = null;
    appliedDiscount = 0;
    setCouponError('');

    const calculations = Cart.calculateTotal();
    let finalTotal = calculations.total - promoDiscount;

    if (couponId) {
        const coupon = userCoupons.find(c => c.id === couponId);
        if (coupon) {
            // ── Aviso exclusividad: código promo activo ───────────────────
            if (appliedPromoCode) {
                setCouponError('⚠️ El código de descuento ha sido eliminado para aplicar tu cupón');
                appliedPromoCode = null;
                promoDiscount = 0;
                finalTotal = calculations.total; // recalcular sin promo
                const promoInput = document.getElementById('promo-code-input');
                const promoBtn = document.getElementById('apply-promo-btn');
                const promoResult = document.getElementById('promo-result');
                const promoRemoveRow = document.getElementById('promo-remove-row');
                if (promoInput) { promoInput.value = ''; promoInput.disabled = false; }
                if (promoBtn) { promoBtn.disabled = false; promoBtn.innerHTML = 'Aplicar código'; promoBtn.style.background = '#6366f1'; }
                if (promoResult) { promoResult.style.display = 'none'; }
                if (promoRemoveRow) promoRemoveRow.style.display = 'none';
            }

            // ── RESTRICCIÓN: Camiseta Gratis solo con 2+ artículos ──────
            const isFreeShirtCoupon = coupon.type === 'fixed' && Number(coupon.value) === 19.90;
            if (isFreeShirtCoupon && getTotalCartItems() <= 1) {
                setCouponError('Este cupón solo es válido para pedidos de 2 o más camisetas');
                if (couponSelect) couponSelect.value = '';
                if (discountApplied) discountApplied.style.display = 'none';
                if (totalEl) totalEl.textContent = `€${finalTotal.toFixed(2)}`;
                return;
            }

            selectedCoupon = coupon;

            if (coupon.type === 'percentage') {
                appliedDiscount = (calculations.subtotal * coupon.value) / 100;
                if (discountText) discountText.textContent = `-${coupon.value}% = -€${appliedDiscount.toFixed(2)}`;
            } else {
                appliedDiscount = Math.min(coupon.value, calculations.subtotal);
                if (discountText) discountText.textContent = `-€${appliedDiscount.toFixed(2)}`;
            }

            finalTotal = Math.max(0, finalTotal - appliedDiscount);
            if (discountApplied) discountApplied.style.display = 'block';
        }
    } else {
        if (discountApplied) discountApplied.style.display = 'none';
    }

    setTotalDisplay(calculations.total, Math.max(0, finalTotal));
}

// ── Revalidar cupón cuando cambia el carrito ────────────────────────────
// Se llama cada vez que se actualice la cantidad de artículos.
export function revalidateCouponAfterCartChange() {
    if (!selectedCoupon) return;
    const isFreeShirtCoupon = selectedCoupon.type === 'fixed' && Number(selectedCoupon.value) === 19.90;
    if (isFreeShirtCoupon && getTotalCartItems() <= 1) {
        // Eliminar el cupón aplicado silenciosamente y avisar
        selectedCoupon = null;
        appliedDiscount = 0;
        const couponSelect = document.getElementById('apply-coupon');
        if (couponSelect) couponSelect.value = '';
        const discountApplied = document.getElementById('discount-applied');
        if (discountApplied) discountApplied.style.display = 'none';
        setCouponError(
            'El cupón de Camiseta Gratis fue eliminado: necesitas 2 o más artículos'
        );
        const calculations = Cart.calculateTotal();
        const finalTotal = Math.max(0, calculations.total - promoDiscount);
        setTotalDisplay(calculations.total, finalTotal);
    }
}

// ── Helper: incrementa contadores de uso del código promo ───────────────
// Se llama SOLO después de que saveOrder() tenga éxito.
async function incrementPromoUsage(code, promo) {
    try {
        const usageRef = ref(db, `promoCodes/${code}/usageCount`);
        const snap = await get(usageRef);
        const currentCount = snap.exists() ? (snap.val() || 0) : (promo.usageCount || 0);
        await set(usageRef, currentCount + 1);

        if (promo.maxUsesPerUser && currentUser) {
            const userUsageRef = ref(db, `promoCodes/${code}/userUsages/${currentUser.uid}`);
            const userSnap = await get(userUsageRef);
            const userCount = userSnap.exists() ? (userSnap.val() || 0) : 0;
            await set(userUsageRef, userCount + 1);
        }
    } catch (err) {
        // No bloqueante: si falla el contador el pedido ya está guardado
        console.warn('Could not increment promo usage count:', err);
    }
}

async function applyPromoCode() {

    const input = document.getElementById('promo-code-input');
    const resultDiv = document.getElementById('promo-result');
    const totalEl = document.getElementById('checkout-total');

    const code = input?.value.trim().toUpperCase();

    if (!code) {
        showPromoResult('Por favor, introduce un código', 'error');
        return;
    }
    if (!currentUser) {
        showPromoResult('Debes iniciar sesión para usar códigos', 'error');
        return;
    }
    const btn = document.getElementById('apply-promo-btn');
    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Validando...';
    }

    try {
        const promoRef = ref(db, `promoCodes/${code}`);
        const snapshot = await get(promoRef);

        if (!snapshot.exists()) {
            showPromoResult('Código no válido', 'error');
            resetPromoButton();
            return;
        }

        const promo = snapshot.val();
        if (!promo.active) {
            showPromoResult('Este código ya no está activo', 'error');
            resetPromoButton();
            return;
        }
        // ── Validar límite global de usos ───────────────────────────────────
        if (promo.maxUses && promo.usageCount >= promo.maxUses) {
            showPromoResult('Este código ha alcanzado el límite de usos', 'error');
            resetPromoButton();
            return;
        }

        // ── Validar límite de usos por usuario (maxUsesPerUser) ─────────────
        if (promo.maxUsesPerUser) {
            const userUsageRef = ref(db, `promoCodes/${code}/userUsages/${currentUser.uid}`);
            const userUsageSnap = await get(userUsageRef);
            const userUsageCount = userUsageSnap.exists() ? (userUsageSnap.val() || 0) : 0;
            if (userUsageCount >= promo.maxUsesPerUser) {
                showPromoResult(
                    `Ya has usado este código el máximo permitido (${promo.maxUsesPerUser} ${promo.maxUsesPerUser === 1 ? 'vez' : 'veces'} por usuario)`,
                    'error'
                );
                resetPromoButton();
                return;
            }
        }

        appliedPromoCode = { ...promo, id: code };
        const calculations = Cart.calculateTotal();

        if (promo.type === 'free_shipping') {
            if (calculations.shipping === 0) {
                showPromoResult('Ya tienes envío gratis en este pedido', 'error');
                appliedPromoCode = null;
                resetPromoButton();
                return;
            }
            promoDiscount = calculations.shipping;
            showPromoResult('¡Envío gratis aplicado!', 'success');
        } else if (promo.type === 'percentage') {
            promoDiscount = (calculations.subtotal * promo.value) / 100;
            showPromoResult(`¡${promo.value}% de descuento aplicado! (-€${promoDiscount.toFixed(2)})`, 'success');
        } else {
            promoDiscount = Math.min(promo.value, calculations.subtotal);
            showPromoResult(`¡€${promo.value} de descuento aplicado!`, 'success');
        }
        let finalTotal = calculations.total - promoDiscount - appliedDiscount;
        finalTotal = Math.max(0, finalTotal);

        setTotalDisplay(calculations.total, finalTotal);
        // El contador de usos se incrementa solo al confirmar el pedido (ver incrementPromoUsage).
        // ── Exclusividad mutua: aviso + desactivar cupones ──────────────
        const couponSelect = document.getElementById('apply-coupon');
        const discountApplied = document.getElementById('discount-applied');
        if (couponSelect) {
            if (couponSelect.value) {
                selectedCoupon = null;
                appliedDiscount = 0;
                couponSelect.value = '';
                if (discountApplied) discountApplied.style.display = 'none';
            }
            couponSelect.disabled = true;
            couponSelect.style.opacity = '0.45';
            couponSelect.style.pointerEvents = 'none';
        }
        // Mostrar aviso de exclusividad bajo el cupón
        setCouponError('ℹ️ Código de descuento activo — quita el código para usar un cupón');

        // Mostrar botón "Quitar código" junto al resultado
        let removeRow = document.getElementById('promo-remove-row');
        if (!removeRow) {
            removeRow = document.createElement('div');
            removeRow.id = 'promo-remove-row';
            removeRow.style.cssText = 'margin-top:0.5rem; display:flex; justify-content:flex-end;';
            removeRow.innerHTML = `<button id="remove-promo-btn" type="button"
                style="background:none; border:none; color:#f87171; font-size:0.78rem; cursor:pointer; display:flex; align-items:center; gap:4px; padding:0;">
                <i class="fas fa-times-circle"></i> Quitar código
            </button>`;
            // Insertar después del div promo-result
            const resultDiv = document.getElementById('promo-result');
            if (resultDiv && resultDiv.parentNode) {
                resultDiv.parentNode.insertBefore(removeRow, resultDiv.nextSibling);
            }
        }
        removeRow.style.display = 'flex';
        document.getElementById('remove-promo-btn')?.addEventListener('click', removePromoCode);

        if (btn) {
            btn.innerHTML = '<i class="fas fa-check"></i> Aplicado';
            btn.style.background = '#10b981';
        }
        if (input) {
            input.disabled = true;
        }



    } catch (error) {
        console.error('Error applying promo code:', error);
        showPromoResult('Error al validar el código', 'error');
        resetPromoButton();
    }
}

// ── Quitar código promo (restaura cupones) ───────────────────────────────
function removePromoCode() {
    appliedPromoCode = null;
    promoDiscount = 0;

    const input = document.getElementById('promo-code-input');
    const btn = document.getElementById('apply-promo-btn');
    const resultDiv = document.getElementById('promo-result');
    const removeRow = document.getElementById('promo-remove-row');

    if (input) { input.value = ''; input.disabled = false; }
    if (btn) { btn.disabled = false; btn.innerHTML = 'Aplicar código'; btn.style.background = '#6366f1'; }
    if (resultDiv) { resultDiv.style.display = 'none'; }
    if (removeRow) { removeRow.style.display = 'none'; }

    // Reactivar selector de cupones
    const couponSelect = document.getElementById('apply-coupon');
    if (couponSelect) {
        couponSelect.disabled = false;
        couponSelect.style.opacity = '1';
        couponSelect.style.pointerEvents = 'auto';
    }
    setCouponError(''); // limpiar aviso de exclusividad

    // Recalcular total (solo descuento de cupón activo si existe)
    const calculations = Cart.calculateTotal();
    const finalTotal = Math.max(0, calculations.total - appliedDiscount);
    setTotalDisplay(calculations.total, finalTotal);
}

function showPromoResult(message, type) {
    const resultDiv = document.getElementById('promo-result');
    if (!resultDiv) return;

    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
    resultDiv.style.color = type === 'success' ? '#10b981' : '#ef4444';
}

function resetPromoButton() {
    const btn = document.getElementById('apply-promo-btn');
    if (btn) {
        btn.disabled = false;
        btn.textContent = 'Aplicar código';
        btn.style.background = '#6366f1';
    }
}

function setupPromoCodeListeners() {
    const applyBtn = document.getElementById('apply-promo-btn');
    if (applyBtn) {
        applyBtn.addEventListener('click', applyPromoCode);
    }
    const promoInput = document.getElementById('promo-code-input');
    if (promoInput) {
        promoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyPromoCode();
            }
        });
    }
    const promoToggle = document.getElementById('promo-toggle');
    const promoContent = document.getElementById('promo-content');
    const promoChevron = document.getElementById('promo-chevron');

    if (promoToggle && promoContent) {
        promoToggle.addEventListener('click', () => {
            const isOpen = promoContent.style.display !== 'none';
            promoContent.style.display = isOpen ? 'none' : 'block';
            if (promoChevron) {
                promoChevron.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
            }
            promoToggle.style.borderRadius = isOpen ? '10px' : '10px 10px 0 0';
        });
    }
    const couponToggle = document.getElementById('coupon-toggle');
    const couponContent = document.getElementById('coupon-content');
    const couponChevron = document.getElementById('coupon-chevron');

    if (couponToggle && couponContent) {
        couponToggle.addEventListener('click', () => {
            const isOpen = couponContent.style.display !== 'none';
            couponContent.style.display = isOpen ? 'none' : 'block';
            if (couponChevron) {
                couponChevron.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
            }
            couponToggle.style.borderRadius = isOpen ? '10px' : '10px 10px 0 0';
        });
    }
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupPromoCodeListeners);
} else {
    setupPromoCodeListeners();
}

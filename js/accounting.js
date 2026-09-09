/**
 * ═════════════════════════════════════════════════════════════════════════
 * MÓDULO DE CONTABILIDAD DIARIA & REPARTO DE SALDOS (IGOR & JUNTOS)
 * ═════════════════════════════════════════════════════════════════════════
 */

import { db, ref, get, set, update, push, remove, onValue } from './firebase-config.js';

// Estado global del módulo
const state = {
    saldo_igor: 0.0,
    saldo_juntos: 0.0,
    history: [],
    currencyMode: 'EUR', // 'EUR' | 'USD'
    usdExchangeRate: 1.08,
    isInitialized: false,
    editingBalanceTitular: null // 'igor' | 'juntos'
};

const LOCAL_STORAGE_KEYS = {
    BALANCES: 'camisetazo_acc_balances_v1',
    HISTORY: 'camisetazo_acc_history_v1'
};

/**
 * Inicializador principal del módulo
 */
export function initAccountingModule() {
    if (state.isInitialized) return;
    state.isInitialized = true;

    // Configurar fecha de hoy en el selector
    const dateInput = document.getElementById('acc-date');
    if (dateInput && !dateInput.value) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }

    // Cargar saldos e historial (desde Firebase con respaldo local)
    loadBalancesAndHistory();

    // Configurar listeners de la interfaz
    setupFormListeners();
    setupCurrencyToggleListeners();
    setupAccordionListeners();
    setupQuickEditModalListeners();
    setupExportCsvListener();

    // Primer cálculo reactivo en base a inputs iniciales
    updateLivePreview();
}

/**
 * Carga de saldos e historial desde Firebase Realtime Database
 * con recuperación automática desde localStorage en caso de error/offline.
 */
async function loadBalancesAndHistory() {
    // 1. Cargar caché local primero para respuesta instantánea
    try {
        const cachedBalances = localStorage.getItem(LOCAL_STORAGE_KEYS.BALANCES);
        if (cachedBalances) {
            const parsed = JSON.parse(cachedBalances);
            state.saldo_igor = Number(parsed.saldo_igor) || 0;
            state.saldo_juntos = Number(parsed.saldo_juntos) || 0;
            renderGlobalBalances();
        }

        const cachedHistory = localStorage.getItem(LOCAL_STORAGE_KEYS.HISTORY);
        if (cachedHistory) {
            state.history = JSON.parse(cachedHistory) || [];
            renderHistory();
        }
    } catch (e) {
        console.warn('[Accounting] Error leyendo caché local:', e);
    }

    // 2. Suscribirse o escuchar cambios en Firebase
    try {
        const accRef = ref(db, 'accounting');
        onValue(accRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                if (data.balances) {
                    state.saldo_igor = Number(data.balances.saldo_igor) || 0;
                    state.saldo_juntos = Number(data.balances.saldo_juntos) || 0;
                    persistBalancesLocally();
                    renderGlobalBalances(data.balances.updatedAt);
                }

                if (data.history) {
                    // Convertir objeto de push IDs en array ordenado descendente por fecha
                    const histArray = Object.keys(data.history).map(key => ({
                        id: key,
                        ...data.history[key]
                    }));
                    histArray.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
                    state.history = histArray;
                    persistHistoryLocally();
                    renderHistory();
                } else {
                    state.history = [];
                    persistHistoryLocally();
                    renderHistory();
                }
            } else {
                // Nodo vacío en Firebase: inicializar con los saldos locales o 0
                syncBalancesToFirebase(state.saldo_igor, state.saldo_juntos, 'Inicialización de saldos');
            }
        }, (error) => {
            console.warn('[Accounting] Firebase realtime listener restringido o desconectado, operando con almacenamiento local:', error.message);
            renderGlobalBalances();
            renderHistory();
        });
    } catch (error) {
        console.warn('[Accounting] No se pudo conectar a Firebase:', error);
        renderGlobalBalances();
        renderHistory();
    }
}

/**
 * Persistencia en LocalStorage para garantizar resiliencia
 */
function persistBalancesLocally() {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.BALANCES, JSON.stringify({
            saldo_igor: state.saldo_igor,
            saldo_juntos: state.saldo_juntos,
            updatedAt: new Date().toISOString()
        }));
    } catch (e) {
        console.error('[Accounting] Error guardando saldos locales:', e);
    }
}

function persistHistoryLocally() {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.HISTORY, JSON.stringify(state.history));
    } catch (e) {
        console.error('[Accounting] Error guardando historial local:', e);
    }
}

/**
 * Sincroniza los saldos en Firebase y LocalStorage
 */
async function syncBalancesToFirebase(igor, juntos, reason = '') {
    state.saldo_igor = Math.round(Number(igor) * 100) / 100;
    state.saldo_juntos = Math.round(Number(juntos) * 100) / 100;
    persistBalancesLocally();
    renderGlobalBalances();

    try {
        const balancesRef = ref(db, 'accounting/balances');
        await set(balancesRef, {
            saldo_igor: state.saldo_igor,
            saldo_juntos: state.saldo_juntos,
            updatedAt: new Date().toISOString(),
            lastReason: reason
        });
    } catch (err) {
        console.warn('[Accounting] No se pudo sincronizar saldo con Firebase (guardado localmente):', err);
    }
}

/**
 * Renderizado de las tarjetas superiores de saldos globales
 */
function renderGlobalBalances(updatedAt) {
    const elIgor = document.getElementById('acc-val-igor');
    const elJuntos = document.getElementById('acc-val-juntos');
    const elTotal = document.getElementById('acc-val-total');
    const elLastSync = document.getElementById('acc-last-sync-text');

    const total = state.saldo_igor + state.saldo_juntos;

    if (elIgor) elIgor.textContent = formatEUR(state.saldo_igor);
    if (elJuntos) elJuntos.textContent = formatEUR(state.saldo_juntos);
    if (elTotal) elTotal.textContent = formatEUR(total);

    if (elLastSync) {
        if (updatedAt) {
            const date = new Date(updatedAt);
            elLastSync.textContent = `Actualizado: ${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else {
            elLastSync.textContent = 'Sincronizado en tiempo real';
        }
    }
}

/**
 * Motor de Cálculo Reactivo
 */
function getFormData() {
    const dateInput = document.getElementById('acc-date');
    const inPaypal = parseFloat(document.getElementById('acc-in-paypal')?.value) || 0;
    const inRevIgor = parseFloat(document.getElementById('acc-in-revolut-igor')?.value) || 0;
    const inRevConjunto = parseFloat(document.getElementById('acc-in-revolut-conjunto')?.value) || 0;

    const supplierAmountRaw = parseFloat(document.getElementById('acc-supplier-amount')?.value) || 0;
    const supplierRate = parseFloat(document.getElementById('acc-supplier-rate')?.value) || 1.08;
    const supplierAccount = document.getElementById('acc-supplier-account')?.value || 'revolut_conjunto';

    const expAds = parseFloat(document.getElementById('acc-exp-ads')?.value) || 0;
    const expPersonalIgor = parseFloat(document.getElementById('acc-exp-personal-igor')?.value) || 0;

    // Conversión de divisa a EUR
    let supplierAmountEUR = supplierAmountRaw;
    if (state.currencyMode === 'USD') {
        supplierAmountEUR = supplierRate > 0 ? (supplierAmountRaw / supplierRate) : supplierAmountRaw;
    }
    supplierAmountEUR = Math.round(supplierAmountEUR * 100) / 100;

    return {
        date: dateInput ? dateInput.value : new Date().toISOString().split('T')[0],
        inPaypal: Math.max(0, inPaypal),
        inRevIgor: Math.max(0, inRevIgor),
        inRevConjunto: Math.max(0, inRevConjunto),
        supplierCurrency: state.currencyMode,
        supplierAmountRaw: Math.max(0, supplierAmountRaw),
        supplierRate: Math.max(0.001, supplierRate),
        supplierAmountEUR: Math.max(0, supplierAmountEUR),
        supplierAccount,
        expAds: Math.max(0, expAds),
        expPersonalIgor: Math.max(0, expPersonalIgor)
    };
}

export function calculateSettlement(data) {
    const totalIngresos = data.inPaypal + data.inRevIgor + data.inRevConjunto;

    // Prorrateo del coste del proveedor
    let ratioConjunto = 0;
    if (totalIngresos > 0) {
        ratioConjunto = data.inRevConjunto / totalIngresos;
    }
    const costeConjunto = Math.round(data.supplierAmountEUR * ratioConjunto * 100) / 100;
    const costeIgor = Math.round((data.supplierAmountEUR - costeConjunto) * 100) / 100;

    // Reparto de gastos compartidos (Google Ads 50/50)
    const mitadAds = Math.round((data.expAds / 2) * 100) / 100;

    // Beneficio Neto Canal Conjunto
    // Beneficio Neto Conjunto = Ingreso_Conjunto - Coste_Conjunto - (Gastos 50/50 / 2)
    const beneficioNetoConjunto = Math.round((data.inRevConjunto - costeConjunto - mitadAds) * 100) / 100;

    // Reparto a Juntos (50% del canal conjunto)
    const incrementoJuntos = Math.round((beneficioNetoConjunto / 2) * 100) / 100;

    // Beneficio Neto Igor:
    // (Ingreso_PayPal + Ingreso_Revolut_Igor - Coste_Igor) + (Beneficio Neto Conjunto / 2) - (Gastos 50/50 / 2) - Gastos_Personales_Igor
    const beneficioNetoIgor = Math.round((
        (data.inPaypal + data.inRevIgor - costeIgor) +
        (beneficioNetoConjunto / 2) -
        mitadAds -
        data.expPersonalIgor
    ) * 100) / 100;

    const incrementoIgor = beneficioNetoIgor;

    // Margen comercial (%)
    let margenComercialPct = 0;
    if (totalIngresos > 0) {
        margenComercialPct = Math.round(((totalIngresos - data.supplierAmountEUR) / totalIngresos) * 1000) / 10;
    }

    return {
        totalIngresos,
        ratioConjunto,
        costeConjunto,
        costeIgor,
        mitadAds,
        beneficioNetoConjunto,
        incrementoJuntos,
        incrementoIgor,
        margenComercialPct
    };
}

/**
 * Actualiza la previsualización en tiempo real
 */
function updateLivePreview() {
    const data = getFormData();
    const results = calculateSettlement(data);

    // Actualizar texto de conversión si USD
    const usdConvertedVal = document.getElementById('acc-usd-converted-val');
    if (usdConvertedVal) {
        usdConvertedVal.textContent = formatEUR(data.supplierAmountEUR);
    }

    // Totales de ingresos y costes
    const elPrevVentas = document.getElementById('acc-prev-total-ventas');
    const elPrevCoste = document.getElementById('acc-prev-total-coste');
    const elPrevMargen = document.getElementById('acc-prev-margen-pct');
    const elPrevMargenBar = document.getElementById('acc-prev-margen-bar');
    const elPrevCuotaIgor = document.getElementById('acc-prev-cuota-igor');
    const elPrevCuotaConj = document.getElementById('acc-prev-cuota-conjunto');
    const elPrevDeltaIgor = document.getElementById('acc-prev-delta-igor');
    const elPrevDeltaJuntos = document.getElementById('acc-prev-delta-juntos');

    if (elPrevVentas) elPrevVentas.textContent = formatEUR(results.totalIngresos);
    if (elPrevCoste) elPrevCoste.textContent = formatEUR(data.supplierAmountEUR);
    if (elPrevMargen) elPrevMargen.textContent = `${results.margenComercialPct.toFixed(1)}%`;
    if (elPrevMargenBar) {
        const clampedBar = Math.max(0, Math.min(100, results.margenComercialPct));
        elPrevMargenBar.style.width = `${clampedBar}%`;
    }

    if (elPrevCuotaIgor) elPrevCuotaIgor.textContent = formatEUR(results.costeIgor);
    if (elPrevCuotaConj) elPrevCuotaConj.textContent = formatEUR(results.costeConjunto);

    // Incrementos con clases semánticas
    if (elPrevDeltaIgor) {
        elPrevDeltaIgor.textContent = formatDeltaEUR(results.incrementoIgor);
        setDeltaClass(elPrevDeltaIgor, results.incrementoIgor);
    }

    if (elPrevDeltaJuntos) {
        elPrevDeltaJuntos.textContent = formatDeltaEUR(results.incrementoJuntos);
        setDeltaClass(elPrevDeltaJuntos, results.incrementoJuntos);
    }
}

function setDeltaClass(element, value) {
    element.classList.remove('positive', 'negative', 'zero');
    if (value > 0) element.classList.add('positive');
    else if (value < 0) element.classList.add('negative');
    else element.classList.add('zero');
}

/**
 * Configuración de Listeners del Formulario
 */
function setupFormListeners() {
    const inputIds = [
        'acc-date',
        'acc-in-paypal',
        'acc-in-revolut-igor',
        'acc-in-revolut-conjunto',
        'acc-supplier-amount',
        'acc-supplier-rate',
        'acc-supplier-account',
        'acc-exp-ads',
        'acc-exp-personal-igor'
    ];

    inputIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', updateLivePreview);
            el.addEventListener('change', updateLivePreview);
        }
    });

    // Botón Principal: Liquidar y Guardar Día
    const btnSubmit = document.getElementById('btn-acc-submit-day');
    if (btnSubmit) {
        btnSubmit.addEventListener('click', handleSaveDay);
    }
}

/**
 * Manejador del guardado diario
 */
async function handleSaveDay() {
    const data = getFormData();
    const results = calculateSettlement(data);

    if (data.totalIngresos === 0 && data.supplierAmountEUR === 0 && data.expAds === 0 && data.expPersonalIgor === 0) {
        alert('Por favor, introduce al menos un importe de ingresos o gastos para liquidar el día.');
        return;
    }

    const confirmMsg = `¿Confirmar liquidación del día ${data.date}?\n\n` +
        `• Total Ventas: ${formatEUR(results.totalIngresos)}\n` +
        `• Coste Proveedor: ${formatEUR(data.supplierAmountEUR)}\n` +
        `• Incremento Saldo Igor: ${formatDeltaEUR(results.incrementoIgor)}\n` +
        `• Incremento Saldo Juntos: ${formatDeltaEUR(results.incrementoJuntos)}`;

    if (!confirm(confirmMsg)) return;

    const btnSubmit = document.getElementById('btn-acc-submit-day');
    if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Liquidando...';
    }

    try {
        const record = {
            date: data.date,
            createdAt: new Date().toISOString(),
            inputs: {
                inPaypal: data.inPaypal,
                inRevIgor: data.inRevIgor,
                inRevConjunto: data.inRevConjunto,
                supplierCurrency: data.supplierCurrency,
                supplierAmountRaw: data.supplierAmountRaw,
                supplierRate: data.supplierRate,
                supplierAmountEUR: data.supplierAmountEUR,
                supplierAccount: data.supplierAccount,
                expAds: data.expAds,
                expPersonalIgor: data.expPersonalIgor
            },
            results: {
                totalIngresos: results.totalIngresos,
                costeConjunto: results.costeConjunto,
                costeIgor: results.costeIgor,
                margenComercialPct: results.margenComercialPct,
                incrementoIgor: results.incrementoIgor,
                incrementoJuntos: results.incrementoJuntos
            }
        };

        // Nuevos saldos atómicos
        const newSaldoIgor = Math.round((state.saldo_igor + results.incrementoIgor) * 100) / 100;
        const newSaldoJuntos = Math.round((state.saldo_juntos + results.incrementoJuntos) * 100) / 100;

        // 1. Guardar registro en historial de Firebase
        try {
            const histRef = ref(db, 'accounting/history');
            const newRecordRef = push(histRef);
            await set(newRecordRef, record);
            record.id = newRecordRef.key;
        } catch (fbErr) {
            console.warn('[Accounting] Guardando registro localmente por falta de permisos o conexión Firebase:', fbErr);
            record.id = 'local_' + Date.now();
        }

        // 2. Actualizar saldos atómicos
        await syncBalancesToFirebase(newSaldoIgor, newSaldoJuntos, `Cierre del día ${data.date}`);

        // 3. Añadir a historial local y re-renderizar
        state.history.unshift(record);
        persistHistoryLocally();
        renderHistory();

        // 4. Limpiar formulario (conservar la fecha de hoy)
        resetDailyForm();

        showAccountingToast('¡Día liquidado y saldos actualizados correctamente!');
    } catch (error) {
        console.error('[Accounting] Error guardando liquidación diaria:', error);
        alert('Hubo un error al liquidar el día: ' + error.message);
    } finally {
        if (btnSubmit) {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = '<i class="fas fa-check-circle"></i> Liquidar y Guardar Día';
        }
    }
}

function resetDailyForm() {
    const fields = [
        'acc-in-paypal',
        'acc-in-revolut-igor',
        'acc-in-revolut-conjunto',
        'acc-supplier-amount',
        'acc-exp-ads',
        'acc-exp-personal-igor'
    ];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    updateLivePreview();
}

/**
 * Eliminación de un registro diario del historial (reversión atómica)
 */
async function handleDeleteRecord(recordId) {
    const record = state.history.find(r => r.id === recordId);
    if (!record) return;

    const deltaIgor = record.results?.incrementoIgor || 0;
    const deltaJuntos = record.results?.incrementoJuntos || 0;

    const confirmMsg = `¿Eliminar la liquidación del día ${record.date}?\n\n` +
        `Esta acción REVERTIRÁ los saldos acumulados:\n` +
        `• Saldo Igor: ${deltaIgor >= 0 ? '-' : '+'}${formatEUR(Math.abs(deltaIgor))}\n` +
        `• Saldo Juntos: ${deltaJuntos >= 0 ? '-' : '+'}${formatEUR(Math.abs(deltaJuntos))}`;

    if (!confirm(confirmMsg)) return;

    try {
        // Revertir saldos
        const revertedIgor = Math.round((state.saldo_igor - deltaIgor) * 100) / 100;
        const revertedJuntos = Math.round((state.saldo_juntos - deltaJuntos) * 100) / 100;

        // Eliminar de Firebase si no es id puramente local
        if (!recordId.startsWith('local_')) {
            try {
                const itemRef = ref(db, `accounting/history/${recordId}`);
                await remove(itemRef);
            } catch (err) {
                console.warn('[Accounting] Error eliminando de Firebase:', err);
            }
        }

        // Actualizar saldos
        await syncBalancesToFirebase(revertedIgor, revertedJuntos, `Reversión por eliminación de día ${record.date}`);

        // Actualizar array local
        state.history = state.history.filter(r => r.id !== recordId);
        persistHistoryLocally();
        renderHistory();

        showAccountingToast('Cierre eliminado y saldos revertidos con éxito');
    } catch (error) {
        console.error('[Accounting] Error eliminando registro:', error);
        alert('Error al eliminar registro: ' + error.message);
    }
}

/**
 * Renderizado del historial (Tabla para escritorio, tarjetas para móvil)
 */
function renderHistory() {
    const tbody = document.getElementById('acc-history-tbody');
    const mobileList = document.getElementById('acc-mobile-history-list');
    const countBadge = document.getElementById('acc-history-count');
    const emptyState = document.getElementById('acc-history-empty');

    if (countBadge) {
        countBadge.textContent = `${state.history.length} cierres registrados`;
    }

    if (!state.history || state.history.length === 0) {
        if (tbody) tbody.innerHTML = '';
        if (mobileList) mobileList.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    // 1. Renderizar tabla de escritorio
    if (tbody) {
        tbody.innerHTML = state.history.map(record => {
            const inputs = record.inputs || {};
            const res = record.results || {};
            const accountLabel = getAccountName(inputs.supplierAccount);
            const accountClass = `acc-account-${inputs.supplierAccount || 'revolut_conjunto'}`;

            return `
                <tr data-record-id="${record.id}">
                    <td>
                        <strong style="color: #fff;">${escapeHtml(record.date)}</strong>
                    </td>
                    <td>
                        <div style="font-weight: 700; color: #f8fafc;">${formatEUR(res.totalIngresos || 0)}</div>
                        <small style="font-size: 0.74rem; color: #94a3b8;">
                            PP: ${formatEUR(inputs.inPaypal || 0)} | RI: ${formatEUR(inputs.inRevIgor || 0)} | RC: ${formatEUR(inputs.inRevConjunto || 0)}
                        </small>
                    </td>
                    <td>
                        <div style="font-weight: 700; color: #fbbf24;">${formatEUR(inputs.supplierAmountEUR || 0)}</div>
                        <span class="acc-account-badge ${accountClass}">${accountLabel}</span>
                    </td>
                    <td>
                        <span class="acc-delta-badge ${getDeltaClass(res.incrementoIgor)}">
                            ${formatDeltaEUR(res.incrementoIgor || 0)}
                        </span>
                    </td>
                    <td>
                        <span class="acc-delta-badge ${getDeltaClass(res.incrementoJuntos)}">
                            ${formatDeltaEUR(res.incrementoJuntos || 0)}
                        </span>
                    </td>
                    <td>
                        <div style="display: flex; gap: 0.35rem;">
                            <button type="button" class="acc-btn-action acc-btn-delete-record" data-id="${record.id}" title="Eliminar registro y revertir saldos">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // Listeners en botones de tabla
        tbody.querySelectorAll('.acc-btn-delete-record').forEach(btn => {
            btn.addEventListener('click', () => {
                handleDeleteRecord(btn.getAttribute('data-id'));
            });
        });
    }

    // 2. Renderizar lista de tarjetas para móvil (< 640px)
    if (mobileList) {
        mobileList.innerHTML = state.history.map(record => {
            const inputs = record.inputs || {};
            const res = record.results || {};
            const accountLabel = getAccountName(inputs.supplierAccount);

            return `
                <div class="acc-mobile-card" id="acc-mcard-${record.id}">
                    <button type="button" class="acc-mobile-card-header" onclick="window.toggleAccMobileCard('${record.id}')">
                        <div class="acc-mobile-card-date">
                            <i class="far fa-calendar-alt" style="color: var(--accent-primary);"></i>
                            <span>${escapeHtml(record.date)}</span>
                        </div>
                        <div class="acc-mobile-card-deltas">
                            <span class="acc-delta-badge ${getDeltaClass(res.incrementoIgor)}" style="font-size: 0.78rem;">
                                I: ${formatDeltaEUR(res.incrementoIgor || 0)}
                            </span>
                            <span class="acc-delta-badge ${getDeltaClass(res.incrementoJuntos)}" style="font-size: 0.78rem;">
                                J: ${formatDeltaEUR(res.incrementoJuntos || 0)}
                            </span>
                            <i class="fas fa-chevron-down acc-mobile-card-chevron"></i>
                        </div>
                    </button>
                    <div class="acc-mobile-card-body">
                        <div class="acc-mobile-detail-row">
                            <span>Total Ventas:</span>
                            <strong style="color: #fff;">${formatEUR(res.totalIngresos || 0)}</strong>
                        </div>
                        <div class="acc-mobile-detail-row">
                            <span>Desglose Ingresos:</span>
                            <span>PP: ${formatEUR(inputs.inPaypal || 0)} | RI: ${formatEUR(inputs.inRevIgor || 0)} | RC: ${formatEUR(inputs.inRevConjunto || 0)}</span>
                        </div>
                        <div class="acc-mobile-detail-row">
                            <span>Coste Proveedor:</span>
                            <span style="color: #fbbf24;">${formatEUR(inputs.supplierAmountEUR || 0)} (${accountLabel})</span>
                        </div>
                        ${(inputs.expAds > 0 || inputs.expPersonalIgor > 0) ? `
                            <div class="acc-mobile-detail-row">
                                <span>Gastos Operativos:</span>
                                <span>Ads: ${formatEUR(inputs.expAds || 0)} | Personales Igor: ${formatEUR(inputs.expPersonalIgor || 0)}</span>
                            </div>
                        ` : ''}
                        <div class="acc-mobile-detail-row" style="padding-top: 0.5rem; font-weight: 700;">
                            <span style="color: #a5b4fc;">Beneficio Neto Igor:</span>
                            <span class="${getDeltaClass(res.incrementoIgor)}">${formatDeltaEUR(res.incrementoIgor || 0)}</span>
                        </div>
                        <div class="acc-mobile-detail-row" style="font-weight: 700;">
                            <span style="color: #67e8f9;">Beneficio Neto Juntos:</span>
                            <span class="${getDeltaClass(res.incrementoJuntos)}">${formatDeltaEUR(res.incrementoJuntos || 0)}</span>
                        </div>
                        <div class="acc-mobile-card-footer">
                            <button type="button" class="btn-secondary acc-btn-delete-mobile" data-id="${record.id}" style="font-size: 0.8rem; padding: 0.4rem 0.8rem; color: #f87171; border-color: rgba(239, 68, 68, 0.3);">
                                <i class="fas fa-trash-alt"></i> Eliminar Registro
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        mobileList.querySelectorAll('.acc-btn-delete-mobile').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                handleDeleteRecord(btn.getAttribute('data-id'));
            });
        });
    }
}

// Handler global para expandir/colapsar tarjeta móvil
window.toggleAccMobileCard = function(recordId) {
    const card = document.getElementById(`acc-mcard-${recordId}`);
    if (card) {
        card.classList.toggle('open');
    }
};

/**
 * Toggle de moneda EUR / USD
 */
function setupCurrencyToggleListeners() {
    const btnEur = document.getElementById('acc-curr-eur');
    const btnUsd = document.getElementById('acc-curr-usd');
    const usdGroup = document.getElementById('acc-usd-rate-group');
    const currPrefix = document.getElementById('acc-supplier-prefix');

    if (btnEur && btnUsd) {
        btnEur.addEventListener('click', () => {
            state.currencyMode = 'EUR';
            btnEur.classList.add('active');
            btnUsd.classList.remove('active');
            if (usdGroup) usdGroup.classList.add('hidden');
            if (currPrefix) currPrefix.textContent = '€';
            updateLivePreview();
        });

        btnUsd.addEventListener('click', () => {
            state.currencyMode = 'USD';
            btnUsd.classList.add('active');
            btnEur.classList.remove('active');
            if (usdGroup) usdGroup.classList.remove('hidden');
            if (currPrefix) currPrefix.textContent = '$';
            updateLivePreview();
        });
    }
}

/**
 * Acordeón de Gastos Operativos
 */
function setupAccordionListeners() {
    const header = document.getElementById('acc-accordion-header-expenses');
    const body = document.getElementById('acc-accordion-body-expenses');

    if (header && body) {
        header.addEventListener('click', () => {
            header.classList.toggle('active');
            body.classList.toggle('open');
        });
    }
}

/**
 * Modal de Edición Rápida de Saldo Global (Lápiz)
 */
function setupQuickEditModalListeners() {
    const btnEditIgor = document.getElementById('btn-acc-edit-igor');
    const btnEditJuntos = document.getElementById('btn-acc-edit-juntos');
    const modal = document.getElementById('acc-edit-balance-modal');
    const btnClose = document.getElementById('acc-modal-close');
    const btnCancel = document.getElementById('acc-modal-cancel');
    const btnConfirm = document.getElementById('acc-modal-confirm');

    const openModal = (titular) => {
        state.editingBalanceTitular = titular;
        const titularName = titular === 'igor' ? 'Igor' : 'Juntos';
        const currentVal = titular === 'igor' ? state.saldo_igor : state.saldo_juntos;

        const titleEl = document.getElementById('acc-modal-titular-name');
        const inputEl = document.getElementById('acc-modal-balance-input');
        const reasonEl = document.getElementById('acc-modal-reason-input');

        if (titleEl) titleEl.textContent = titularName;
        if (inputEl) {
            inputEl.value = currentVal.toFixed(2);
            inputEl.focus();
        }
        if (reasonEl) reasonEl.value = '';

        if (modal) modal.classList.remove('hidden');
    };

    const closeModal = () => {
        if (modal) modal.classList.add('hidden');
        state.editingBalanceTitular = null;
    };

    if (btnEditIgor) btnEditIgor.addEventListener('click', () => openModal('igor'));
    if (btnEditJuntos) btnEditJuntos.addEventListener('click', () => openModal('juntos'));

    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnCancel) btnCancel.addEventListener('click', closeModal);

    if (btnConfirm) {
        btnConfirm.addEventListener('click', async () => {
            const inputEl = document.getElementById('acc-modal-balance-input');
            const reasonEl = document.getElementById('acc-modal-reason-input');
            if (!inputEl) return;

            const newVal = parseFloat(inputEl.value);
            if (isNaN(newVal)) {
                alert('Por favor introduce un valor numérico válido.');
                return;
            }

            const titular = state.editingBalanceTitular;
            const titularName = titular === 'igor' ? 'Igor' : 'Juntos';
            const reason = reasonEl ? reasonEl.value.trim() : '';

            const confirmText = `¿Confirmar ajuste manual del Saldo de ${titularName} a ${formatEUR(newVal)}?`;
            if (!confirm(confirmText)) return;

            if (titular === 'igor') {
                await syncBalancesToFirebase(newVal, state.saldo_juntos, reason || 'Ajuste manual Saldo Igor');
            } else {
                await syncBalancesToFirebase(state.saldo_igor, newVal, reason || 'Ajuste manual Saldo Juntos');
            }

            closeModal();
            showAccountingToast(`Saldo de ${titularName} actualizado correctamente a ${formatEUR(newVal)}`);
        });
    }
}

/**
 * Exportar Historial a CSV
 */
function setupExportCsvListener() {
    const btnExport = document.getElementById('btn-acc-export-csv');
    if (!btnExport) return;

    btnExport.addEventListener('click', () => {
        if (!state.history || state.history.length === 0) {
            alert('No hay registros en el historial para exportar.');
            return;
        }

        const headers = [
            'Fecha',
            'PayPal (€)',
            'Revolut Igor (€)',
            'Revolut Conjunto (€)',
            'Total Ventas (€)',
            'Coste Proveedor (€)',
            'Divisa Proveedor',
            'Cuenta Pago Proveedor',
            'Google Ads 50/50 (€)',
            'Gastos Personales Igor (€)',
            'Beneficio Neto Igor (€)',
            'Beneficio Neto Juntos (€)'
        ];

        const rows = state.history.map(r => {
            const inp = r.inputs || {};
            const res = r.results || {};
            return [
                `"${r.date || ''}"`,
                (inp.inPaypal || 0).toFixed(2),
                (inp.inRevIgor || 0).toFixed(2),
                (inp.inRevConjunto || 0).toFixed(2),
                (res.totalIngresos || 0).toFixed(2),
                (inp.supplierAmountEUR || 0).toFixed(2),
                `"${inp.supplierCurrency || 'EUR'}"`,
                `"${getAccountName(inp.supplierAccount)}"`,
                (inp.expAds || 0).toFixed(2),
                (inp.expPersonalIgor || 0).toFixed(2),
                (res.incrementoIgor || 0).toFixed(2),
                (res.incrementoJuntos || 0).toFixed(2)
            ].join(',');
        });

        const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `contabilidad_camisetazo_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

/**
 * Utilidades de formato
 */
function formatEUR(val) {
    const num = Number(val) || 0;
    return num.toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + ' €';
}

function formatDeltaEUR(val) {
    const num = Number(val) || 0;
    const sign = num > 0 ? '+' : '';
    return sign + formatEUR(num);
}

function getDeltaClass(val) {
    const num = Number(val) || 0;
    if (num > 0) return 'positive';
    if (num < 0) return 'negative';
    return 'zero';
}

function getAccountName(accKey) {
    switch (accKey) {
        case 'paypal': return 'PayPal';
        case 'revolut_igor': return 'Revolut Igor';
        case 'revolut_conjunto': return 'Revolut Conjunto';
        default: return 'Revolut Conjunto';
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function showAccountingToast(message) {
    const toast = document.createElement('div');
    toast.className = 'admin-toast show';
    toast.innerHTML = `<i class="fas fa-check-circle" style="color:#10b981;"></i> <span>${escapeHtml(message)}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

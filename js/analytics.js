/**
 * Camisetazo - Telemetry & Analytics System
 * Centralized GA4 tracking module
 */

const GA_ID = 'G-GS53GWE2Z0';

class AnalyticsManager {
    constructor() {
        this.initialized = typeof gtag === 'function';
    }

    /**
     * Track a custom event
     */
    trackEvent(eventName, params = {}) {
        if (!this.initialized) {
            console.warn(`[Analytics] gtag not defined. Event dropped: ${eventName}`, params);
            return;
        }
        gtag('event', eventName, params);
        if (window.DEBUG_ANALYTICS) {
            console.log(`[Analytics] Track Event: ${eventName}`, params);
        }
    }

    /**
     * Standard Ecommerce Events
     */
    trackViewItem(product) {
        this.trackEvent('view_item', {
            currency: 'EUR',
            value: product.price,
            items: [{
                item_id: product.id,
                item_name: product.name,
                item_category: product.league || product.category,
                price: product.price,
                quantity: 1
            }]
        });
    }

    trackAddToCart(item) {
        this.trackEvent('add_to_cart', {
            currency: 'EUR',
            value: item.price * item.quantity,
            items: [{
                item_id: item.id,
                item_name: item.name,
                item_category: item.customization?.version || 'aficionado',
                price: item.price,
                quantity: item.quantity
            }]
        });
    }

    trackBeginCheckout(items, totalValue) {
        this.trackEvent('begin_checkout', {
            currency: 'EUR',
            value: Number(totalValue),
            items: items.map(item => ({
                item_id: String(item.id),
                item_name: item.name,
                price: Number(item.price || 0),
                quantity: Number(item.quantity || 1)
            }))
        });
    }

    trackAddShippingInfo(addressData) {
        this.trackEvent('add_shipping_info', {
            currency: 'EUR',
            shipping_tier: 'Standard',
            items: [] // Opcional en este paso, pero requerido para funnel completo en GA4 si se desea
        });
    }

    trackAddPaymentInfo(paymentType) {
        this.trackEvent('add_payment_info', {
            currency: 'EUR',
            payment_type: paymentType,
            items: []
        });
    }

    trackRemoveFromCart(product, quantity = 1) {
        this.trackEvent('remove_from_cart', {
            currency: 'EUR',
            value: Number(product.price * quantity),
            items: [{
                item_id: String(product.id),
                item_name: product.name,
                price: Number(product.price),
                quantity: Number(quantity)
            }]
        });
    }

    trackPurchase(orderData) {
        if (!orderData || !orderData.orderId) {
            console.error("[Analytics] Cannot track purchase: Missing order data");
            return;
        }

        const purchaseData = {
            transaction_id: String(orderData.orderId),
            value: parseFloat(Number(orderData.total || 0).toFixed(2)),
            currency: 'EUR',
            tax: 0,
            shipping: parseFloat(Number(orderData.shipping || 0).toFixed(2)),
            coupon: orderData.promoCodeUsed || orderData.couponUsed || '',
            items: (orderData.items || []).map(item => ({
                item_id: String(item.id),
                item_name: item.name,
                price: parseFloat(Number(item.price || 0).toFixed(2)),
                quantity: parseInt(item.quantity || item.qty || 1),
                item_category: item.version || 'aficionado',
                coupon: orderData.promoCodeUsed || orderData.couponUsed || ''
            }))
        };

        this.trackEvent('purchase', purchaseData);
        
        if (window.DEBUG_ANALYTICS || true) {
            console.log(`%c[Analytics] PURCHASE TRACKED: ${purchaseData.transaction_id}`, 'color: #10b981; font-weight: bold;', purchaseData);
        }
    }

    /**
     * Custom CRO Events
     */
    trackStickyCTAClick(productName) {
        this.trackEvent('sticky_cta_click', {
            product_name: productName,
            event_category: 'engagement',
            event_label: 'Conversion Optimization'
        });
    }

    trackCouponError(couponCode, errorMessage) {
        this.trackEvent('coupon_error', {
            coupon_code: couponCode,
            error_message: errorMessage,
            event_category: 'checkout_friction'
        });
    }

    trackImageInteraction(productName, action = 'view_gallery') {
        this.trackEvent('image_gallery_interaction', {
            product_name: productName,
            action: action
        });
    }

    trackFilterUse(filterType, value) {
        this.trackEvent('filter_usage', {
            filter_type: filterType,
            filter_value: value
        });
    }

    trackSearch(searchTerm, resultsCount) {
        this.trackEvent('search', {
            search_term: searchTerm,
            results_count: resultsCount
        });
        if (window.DEBUG_ANALYTICS) {
            console.log(`[Analytics] Track Search: "${searchTerm}" (${resultsCount} results)`);
        }
    }
}

// Export singleton
window.Analytics = new AnalyticsManager();
export default window.Analytics;

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
            value: totalValue,
            items: items.map(item => ({
                item_id: item.id,
                item_name: item.name,
                price: item.price,
                quantity: item.quantity
            }))
        });
    }

    trackPurchase(orderData) {
        this.trackEvent('purchase', {
            transaction_id: orderData.orderId,
            value: orderData.total,
            currency: 'EUR',
            shipping: orderData.shipping || 0,
            items: orderData.items.map(item => ({
                item_id: item.id,
                item_name: item.name,
                price: item.price,
                quantity: item.quantity
            }))
        });
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
}

// Export singleton
window.Analytics = new AnalyticsManager();
export default window.Analytics;

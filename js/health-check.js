/**
 * Camisetazo - Health Check & Reliability System
 * Monitoring critical frontend components
 */

import Analytics from './analytics.js';

class HealthCheck {
    constructor() {
        this.errors = [];
    }

    /**
     * Log a critical error with telemetry
     * @param {string} component - Component name (e.g., 'JSON-LD', 'YupooScraper')
     * @param {string} message - Error description
     * @param {object} context - Additional data
     */
    logError(component, message, context = {}) {
        const error = {
            timestamp: new Date().toISOString(),
            component,
            message,
            context
        };
        this.errors.push(error);
        
        console.error(`[HealthCheck] ${component}: ${message}`, context);

        if (Analytics) {
            Analytics.trackEvent('system_health_error', {
                error_component: component,
                error_message: message,
                ...context
            });
        }

        // Optional: In a real production environment, we could send this to a backend log.
    }

    /**
     * Verification methods
     */
    verifyJsonLd(productId) {
        const schema = document.getElementById(`json-ld-${productId}`);
        if (!schema) {
            this.logError('JSON-LD', 'Schema script missing from DOM', { productId });
            return false;
        }
        try {
            JSON.parse(schema.textContent);
            return true;
        } catch (e) {
            this.logError('JSON-LD', 'Invalid JSON content', { productId, error: e.message });
            return false;
        }
    }

    verifyImporterStructure(albumUrl, result) {
        if (!result || !result.title || !result.images || result.images.length === 0) {
            this.logError('YupooScraper', 'Possible structure change detected', { albumUrl, result });
            return false;
        }
        return true;
    }
}

window.Health = new HealthCheck();
export default window.Health;

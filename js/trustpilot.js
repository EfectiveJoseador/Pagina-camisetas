(function () {
    var KEY = 'camisetazoTrustpilot';
    var DEFAULTS = {
        rating: 4.5,
        reviewCount: 15,
        visible: true,
        url: 'https://es.trustpilot.com/review/camisetazo.shop'
    };

    function getConfig() {
        try {
            var s = localStorage.getItem(KEY);
            return s ? Object.assign({}, DEFAULTS, JSON.parse(s)) : Object.assign({}, DEFAULTS);
        } catch (e) {
            return Object.assign({}, DEFAULTS);
        }
    }

    function setConfig(data) {
        var updated = Object.assign(getConfig(), data);
        localStorage.setItem(KEY, JSON.stringify(updated));
        return updated;
    }

    var STAR_PATH = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z';

    function starSvg(fill, size, gradId) {
        if (gradId) {
            return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="' + gradId + '"><stop offset="50%" stop-color="#00b67a"/><stop offset="50%" stop-color="#d1d5db"/></linearGradient></defs><path d="' + STAR_PATH + '" fill="url(#' + gradId + ')"/></svg>';
        }
        return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="' + fill + '"><path d="' + STAR_PATH + '"/></svg>';
    }

    function renderStars(rating, size) {
        size = size || 18;
        var full = Math.floor(rating);
        var frac = rating % 1;
        var half = frac >= 0.25 && frac < 0.75;
        var empty = 5 - full - (half ? 1 : 0);
        var out = '';
        var uid = 'tph' + Math.random().toString(36).substr(2, 6);
        for (var i = 0; i < full; i++) out += starSvg('#00b67a', size);
        if (half) out += starSvg(null, size, uid);
        for (var j = 0; j < empty; j++) out += starSvg('#d1d5db', size);
        return out;
    }

    function renderBadgeAnnouncement() {
        var cfg = getConfig();
        if (!cfg.visible) return '';
        var stars = renderStars(cfg.rating, 15);
        return '<a href="' + cfg.url + '" target="_blank" rel="noopener noreferrer" class="tp-badge-compact" aria-label="Ver rese\u00f1as en Trustpilot">' +
            '<span class="tp-logo-text">Trustpilot</span>' +
            '<span class="tp-stars-row">' + stars + '</span>' +
            '<span class="tp-score">' + cfg.rating.toFixed(1) + '</span>' +
            '<span class="tp-reviews">' + cfg.reviewCount + ' opiniones</span>' +
            '</a>';
    }

    function renderBadgeHero() {
        var cfg = getConfig();
        if (!cfg.visible) return '';
        var stars = renderStars(cfg.rating, 16);
        return '<a href="' + cfg.url + '" target="_blank" rel="noopener noreferrer" class="tp-bar" aria-label="Ver rese\u00f1as en Trustpilot">' +
            '<span class="tp-bar-logo">Trustpilot</span>' +
            '<span class="tp-bar-stars">' + stars + '</span>' +
            '<span class="tp-bar-text"><strong>Excelente</strong> &middot; ' + cfg.rating.toFixed(1) + '/5 &middot; ' + cfg.reviewCount + ' opiniones</span>' +
            '</a>';
    }

    function renderBadgeCard() {
        var cfg = getConfig();
        if (!cfg.visible) return '';
        var stars = renderStars(cfg.rating, 22);
        return '<a href="' + cfg.url + '" target="_blank" rel="noopener noreferrer" class="tp-card" aria-label="Ver rese\u00f1as en Trustpilot">' +
            '<div class="tp-card-header"><span class="tp-logo-icon">\u2605</span><span class="tp-logo-text-lg">Trustpilot</span></div>' +
            '<div class="tp-card-stars">' + stars + '</div>' +
            '<div class="tp-card-info"><span class="tp-card-score">' + cfg.rating.toFixed(1) + '</span><span class="tp-card-label">Excelente</span></div>' +
            '<div class="tp-card-count">' + cfg.reviewCount + ' opiniones verificadas</div>' +
            '<div class="tp-card-cta">Ver en Trustpilot \u2192</div>' +
            '</a>';
    }

    window.TrustpilotConfig = {
        get: getConfig,
        set: setConfig,
        renderStars: renderStars,
        renderBadgeAnnouncement: renderBadgeAnnouncement,
        renderBadgeHero: renderBadgeHero,
        renderBadgeCard: renderBadgeCard
    };
})();

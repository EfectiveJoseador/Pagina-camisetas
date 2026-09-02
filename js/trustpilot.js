(function () {
    var KEY = 'camisetazoTrustpilot';
    var DB_URL = 'https://camisetazo-puntos-default-rtdb.europe-west1.firebasedatabase.app/trustpilotConfig.json';
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
        try {
            localStorage.setItem(KEY, JSON.stringify(updated));
        } catch (e) {}
        updateDOMBadges(updated);
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
        var r = parseFloat(rating);
        if (isNaN(r)) r = 4.5;
        var full = Math.floor(r);
        var frac = r % 1;
        var half = frac >= 0.25 && frac < 0.75;
        var empty = 5 - full - (half ? 1 : 0);
        if (empty < 0) empty = 0;
        var out = '';
        var uid = 'tph' + Math.random().toString(36).substr(2, 6);
        for (var i = 0; i < full && i < 5; i++) out += starSvg('#00b67a', size);
        if (half && full < 5) out += starSvg(null, size, uid);
        for (var j = 0; j < empty; j++) out += starSvg('#d1d5db', size);
        return out;
    }

    function renderBadgeAnnouncement(cfgOverride) {
        var cfg = cfgOverride || getConfig();
        if (!cfg.visible) return '';
        var stars = renderStars(cfg.rating, 15);
        var r = parseFloat(cfg.rating) || 4.5;
        return '<a href="' + cfg.url + '" target="_blank" rel="noopener noreferrer" class="tp-badge-compact" aria-label="Ver rese\u00f1as en Trustpilot">' +
            '<span class="tp-logo-text">Trustpilot</span>' +
            '<span class="tp-stars-row">' + stars + '</span>' +
            '<span class="tp-score">' + r.toFixed(1) + '</span>' +
            '<span class="tp-reviews">' + cfg.reviewCount + ' opiniones</span>' +
            '</a>';
    }

    function renderBadgeHero(cfgOverride) {
        var cfg = cfgOverride || getConfig();
        if (!cfg.visible) return '';
        var stars = renderStars(cfg.rating, 16);
        var r = parseFloat(cfg.rating) || 4.5;
        return '<a href="' + cfg.url + '" target="_blank" rel="noopener noreferrer" class="tp-bar" aria-label="Ver rese\u00f1as en Trustpilot">' +
            '<div class="tp-bar-inner">' +
            '<div class="tp-bar-top">' +
            '<span class="tp-bar-logo">Trustpilot</span>' +
            '<span class="tp-bar-stars">' + stars + '</span>' +
            '</div>' +
            '<span class="tp-bar-sep">&middot;</span>' +
            '<div class="tp-bar-bottom">' +
            '<span class="tp-bar-text"><strong>Excelente</strong> &middot; ' + r.toFixed(1) + '/5 &middot; ' + cfg.reviewCount + ' opiniones</span>' +
            '</div>' +
            '</div>' +
            '</a>';
    }

    function renderBadgeCard(cfgOverride) {
        var cfg = cfgOverride || getConfig();
        if (!cfg.visible) return '';
        var stars = renderStars(cfg.rating, 22);
        var r = parseFloat(cfg.rating) || 4.5;
        return '<a href="' + cfg.url + '" target="_blank" rel="noopener noreferrer" class="tp-card" aria-label="Ver rese\u00f1as en Trustpilot">' +
            '<div class="tp-card-header"><span class="tp-logo-icon">\u2605</span><span class="tp-logo-text-lg">Trustpilot</span></div>' +
            '<div class="tp-card-stars">' + stars + '</div>' +
            '<div class="tp-card-info"><span class="tp-card-score">' + r.toFixed(1) + '</span><span class="tp-card-label">Excelente</span></div>' +
            '<div class="tp-card-count">' + cfg.reviewCount + ' opiniones verificadas</div>' +
            '<div class="tp-card-cta">Ver en Trustpilot \u2192</div>' +
            '</a>';
    }

    function updateDOMBadges(cfg) {
        cfg = cfg || getConfig();

        // 1. Hero badge on index.html
        var heroWrap = document.getElementById('hero-tp-bar-wrap');
        if (heroWrap) {
            if (cfg.visible) {
                heroWrap.innerHTML = renderBadgeHero(cfg);
                heroWrap.style.display = '';
            } else {
                heroWrap.innerHTML = '';
                heroWrap.style.display = 'none';
            }
        }

        // 2. Announcement bar slide
        var slide1 = document.getElementById('ann-slide-1');
        if (slide1) {
            if (cfg.visible) {
                var tpBadge = renderBadgeAnnouncement(cfg);
                slide1.innerHTML = '<i class="fas fa-star" style="font-size:0.85rem;color:#00e08e;flex-shrink:0;"></i>' + tpBadge;
                slide1.style.display = '';
            } else {
                slide1.innerHTML = '';
                slide1.style.display = 'none';
            }
        }

        // 3. Quienes somos card
        var cardElem = document.querySelector('.tp-card') || document.getElementById('tp-stat-slot');
        if (cardElem) {
            if (cfg.visible) {
                var newCardHtml = renderBadgeCard(cfg);
                if (newCardHtml) {
                    var temp = document.createElement('div');
                    temp.innerHTML = newCardHtml;
                    var newElem = temp.firstElementChild;
                    if (newElem && cardElem.parentNode) {
                        cardElem.parentNode.replaceChild(newElem, cardElem);
                    }
                }
            } else {
                cardElem.style.display = 'none';
            }
        }

        try {
            window.dispatchEvent(new CustomEvent('trustpilot:updated', { detail: cfg }));
        } catch (e) {}
    }

    function fetchRemoteConfig() {
        if (typeof fetch === 'undefined') return;
        fetch(DB_URL)
            .then(function (res) {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.json();
            })
            .then(function (data) {
                if (data && typeof data === 'object') {
                    var current = getConfig();
                    var changed = false;
                    ['rating', 'reviewCount', 'visible', 'url'].forEach(function (k) {
                        if (data[k] !== undefined && data[k] !== current[k]) {
                            changed = true;
                        }
                    });
                    if (changed) {
                        setConfig(data);
                    }
                }
            })
            .catch(function () {
                // Silently fallback to cached or default values
            });
    }

    // Auto-fetch remote global config on load
    fetchRemoteConfig();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            updateDOMBadges();
        });
    } else {
        updateDOMBadges();
    }

    window.TrustpilotConfig = {
        get: getConfig,
        set: setConfig,
        fetchRemote: fetchRemoteConfig,
        renderStars: renderStars,
        renderBadgeAnnouncement: renderBadgeAnnouncement,
        renderBadgeHero: renderBadgeHero,
        renderBadgeCard: renderBadgeCard,
        updateDOMBadges: updateDOMBadges
    };
})();


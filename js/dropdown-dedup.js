/**
 * Dropdown Deduplication Utility
 * Detecta y elimina duplicados en dropdowns de equipos/ligas
 * normalizando variantes al nombre canónico.
 */

const DropdownDedup = (function () {
    // ========== CONFIGURACIÓN ==========
    const CONFIG = {
        // Umbral de similitud (0-1). Mayor = más estricto
        SIMILARITY_THRESHOLD: 0.7,

        // Tokens "ruido" a ignorar en comparaciones
        STOPWORDS: [
            'uefa', 'champions', 'league', 'ucl', 'fc', 'cf', 'sc', 'ac',
            'club', 'team', 'women', 'u19', 'u21', 'u23', 'ii', 'b',
            'local', 'visitante', 'tercera', 'cuarta', 'home', 'away', 'third',
            'retro', 'icon', 'classic', 'vintage', 'special', 'edition',
            'black', 'gold', 'golden', 'white', 'pink', 'blue', 'red', 'green',
            'training', 'entrenamiento', 'pre-match', 'stadium', 'authentic',
            'player', 'fan', 'vapor', 'kids', 'niño', 'niños'
        ],

        // Prefijos comunes de clubes (se ignoran para comparación pero se mantienen en canónico)
        CLUB_PREFIXES: ['fc', 'cf', 'sc', 'ac', 'real', 'cd', 'ud', 'rcd', 'rc', 'sd'],

        // Mapeo manual de alias conocidos (variante -> canónico)
        MANUAL_ALIASES: {
            'barca': 'FC Barcelona',
            'barça': 'FC Barcelona',
            'man utd': 'Manchester United',
            'man united': 'Manchester United',
            'man city': 'Manchester City',
            'atleti': 'Atlético Madrid',
            'atletico': 'Atlético Madrid',
            'madrid': 'Real Madrid', // Solo si no hay otro contexto
        }
    };

    // ========== FUNCIONES DE NORMALIZACIÓN ==========

    /**
     * Normaliza un string: minúsculas, sin tildes, sin puntuación, espacios colapsados
     */
    function normalize(str) {
        if (!str) return '';
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Eliminar tildes
            .replace(/[^\w\s]/g, ' ')         // Puntuación a espacios
            .replace(/\s+/g, ' ')             // Colapsar espacios
            .trim();
    }

    /**
     * Tokeniza un string normalizado, filtrando stopwords
     */
    function tokenize(str, removeStopwords = true) {
        const normalized = normalize(str);
        let tokens = normalized.split(' ').filter(t => t.length > 1);

        if (removeStopwords) {
            tokens = tokens.filter(t => !CONFIG.STOPWORDS.includes(t));
        }

        return tokens;
    }

    /**
     * Extrae el "núcleo" del nombre de equipo (sin prefijos de club ni temporada)
     */
    function extractCore(str) {
        let tokens = tokenize(str, true);

        // Eliminar prefijos de club del inicio
        if (tokens.length > 1 && CONFIG.CLUB_PREFIXES.includes(tokens[0])) {
            tokens = tokens.slice(1);
        }

        // Eliminar patrones de temporada (ej: "25/26", "2526", "97/98")
        tokens = tokens.filter(t => !/^\d{2,4}$/.test(t));

        return tokens;
    }

    /**
     * Calcula similitud entre dos arrays de tokens (Jaccard index)
     */
    function tokenSimilarity(tokens1, tokens2) {
        if (tokens1.length === 0 || tokens2.length === 0) return 0;

        const set1 = new Set(tokens1);
        const set2 = new Set(tokens2);

        const intersection = [...set1].filter(t => set2.has(t)).length;
        const union = new Set([...set1, ...set2]).size;

        return intersection / union;
    }

    /**
     * Verifica si un token está contenido en el otro (coincidencia parcial)
     */
    function hasPartialMatch(tokens1, tokens2) {
        // Si el token principal de uno está en el otro
        for (const t1 of tokens1) {
            for (const t2 of tokens2) {
                if (t1.includes(t2) || t2.includes(t1)) {
                    return true;
                }
            }
        }
        return false;
    }

    // ========== FUNCIONES DE DETECCIÓN ==========

    /**
     * Determina si dos nombres se refieren al mismo equipo
     */
    function isMatch(name1, name2) {
        // Verificar alias manuales primero
        const n1 = normalize(name1);
        const n2 = normalize(name2);

        if (n1 === n2) return true;

        // Extraer núcleos
        const core1 = extractCore(name1);
        const core2 = extractCore(name2);

        if (core1.length === 0 || core2.length === 0) return false;

        // Coincidencia exacta de núcleos
        if (core1.join(' ') === core2.join(' ')) return true;

        // Similitud de tokens
        const similarity = tokenSimilarity(core1, core2);
        if (similarity >= CONFIG.SIMILARITY_THRESHOLD) return true;

        // Coincidencia parcial del token principal
        if (hasPartialMatch(core1, core2) && similarity >= 0.5) return true;

        return false;
    }

    /**
     * Determina cuál de dos nombres es el "canónico" (el mejor)
     * Preferencia: más corto, con prefijo de club, sin ruido
     */
    function selectCanonical(name1, name2) {
        const tokens1 = tokenize(name1, false);
        const tokens2 = tokenize(name2, false);

        // Preferir el que tiene prefijo de club
        const hasPrefix1 = CONFIG.CLUB_PREFIXES.includes(tokens1[0]);
        const hasPrefix2 = CONFIG.CLUB_PREFIXES.includes(tokens2[0]);

        if (hasPrefix1 && !hasPrefix2) return name1;
        if (hasPrefix2 && !hasPrefix1) return name2;

        // Preferir el más corto (menos ruido)
        const noise1 = tokens1.filter(t => CONFIG.STOPWORDS.includes(t)).length;
        const noise2 = tokens2.filter(t => CONFIG.STOPWORDS.includes(t)).length;

        if (noise1 < noise2) return name1;
        if (noise2 < noise1) return name2;

        // Por defecto, el más corto
        return name1.length <= name2.length ? name1 : name2;
    }

    // ========== FUNCIONES DE CONSTRUCCIÓN DE MAPA ==========

    /**
     * Construye un mapa de variantes -> canónico
     * @param {string[]} names - Lista de nombres del dropdown
     * @returns {Object} { canonMap: {variante: canónico}, canonicals: [nombres canónicos únicos] }
     */
    function buildCanonicalMap(names) {
        const canonMap = {}; // variante -> canónico
        const groups = [];   // Grupos de nombres que coinciden

        names.forEach(name => {
            let foundGroup = false;

            for (const group of groups) {
                // Comprobar si coincide con algún miembro del grupo
                if (group.some(member => isMatch(name, member))) {
                    group.push(name);
                    foundGroup = true;
                    break;
                }
            }

            if (!foundGroup) {
                groups.push([name]);
            }
        });

        // Para cada grupo, seleccionar el canónico y mapear el resto
        const canonicals = [];

        groups.forEach(group => {
            if (group.length === 1) {
                canonicals.push(group[0]);
                canonMap[group[0]] = group[0];
            } else {
                // Encontrar el mejor canónico
                let canonical = group[0];
                for (let i = 1; i < group.length; i++) {
                    canonical = selectCanonical(canonical, group[i]);
                }

                canonicals.push(canonical);

                // Mapear todas las variantes
                group.forEach(variant => {
                    canonMap[variant] = canonical;
                });
            }
        });

        return { canonMap, canonicals };
    }

    /**
     * Aplica el mapa canónico a un elemento <select>
     * @param {HTMLSelectElement} selectElement - El dropdown a limpiar
     * @returns {Object} canonMap para uso posterior
     */
    function applyMapToDropdown(selectElement) {
        if (!selectElement) return {};

        // Obtener todas las opciones (excepto la primera que suele ser "Todos")
        const options = Array.from(selectElement.options);
        const firstOption = options[0]; // Guardar "Todos los X"
        const names = options.slice(1).map(opt => opt.textContent.trim());

        // Construir mapa
        const { canonMap, canonicals } = buildCanonicalMap(names);

        // Limpiar y reconstruir el select
        selectElement.innerHTML = '';
        selectElement.appendChild(firstOption);

        // Añadir solo los canónicos, ordenados
        canonicals.sort((a, b) => a.localeCompare(b, 'es'));

        canonicals.forEach(canonical => {
            const option = document.createElement('option');
            option.value = canonical;
            option.textContent = canonical;
            selectElement.appendChild(option);
        });

        // Guardar el mapa en el elemento para uso posterior
        selectElement._canonMap = canonMap;

        return canonMap;
    }

    /**
     * Obtiene el nombre canónico dado un valor (puede ser variante)
     * @param {HTMLSelectElement} selectElement - El dropdown procesado
     * @param {string} value - El valor a resolver
     * @returns {string} El nombre canónico
     */
    function getCanonical(selectElement, value) {
        if (!selectElement || !selectElement._canonMap) return value;
        return selectElement._canonMap[value] || value;
    }

    // ========== API PÚBLICA ==========
    return {
        // Configuración
        config: CONFIG,

        // Funciones de normalización
        normalize,
        tokenize,
        extractCore,

        // Funciones de detección
        isMatch,
        selectCanonical,
        tokenSimilarity,

        // Funciones de construcción
        buildCanonicalMap,
        applyMapToDropdown,
        getCanonical,

        // Utilidad para depuración
        debug: function (names) {
            const result = buildCanonicalMap(names);
            console.log('=== Dropdown Dedup Debug ===');
            console.log('Input:', names);
            console.log('Canonicals:', result.canonicals);
            console.log('Map:', result.canonMap);
            return result;
        }
    };
})();

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DropdownDedup;
}

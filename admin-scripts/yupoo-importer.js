/**
 * Yupoo Product Importer Module
 * 
 * Extrae información de productos desde álbumes de Yupoo y genera
 * objetos de producto compatibles con el catálogo de la tienda.
 * 
 * @author Camisetazo Admin Scripts
 * @version 2.0.0
 */

const crypto = require('crypto');

/**
 * Mapeo de términos en inglés a español para normalización
 */
const TEXT_NORMALIZATION = {
    // Tipos de camiseta
    'away': 'Visitante',
    'home': 'Local',
    'third': 'Tercera',
    'retro': 'Retro',
    'kids': 'Niño',
    'goalkeeper': 'Portero',
    'gk': 'Portero',
    'training': 'Entrenamiento',
    'special': 'Especial',
    'anniversary': 'Aniversario',
    'classic': 'Clásica',
    // Otros términos comunes
    'jersey': 'Camiseta',
    'shirt': 'Camiseta',
    'kit': 'Equipación',
    'player': 'Jugador',
    'fan': 'Aficionado'
};

/**
 * Mapeo de equipos conocidos a sus ligas
 * Clave: nombre del equipo (lowercase, normalizado)
 * Valor: código de liga
 */
const TEAM_TO_LEAGUE = {
    // LaLiga
    'athletic': 'laliga',
    'athletic club': 'laliga',
    'athletic bilbao': 'laliga',
    'bilbao': 'laliga',
    'barcelona': 'laliga',
    'barca': 'laliga',
    'fc barcelona': 'laliga',
    'real madrid': 'laliga',
    'madrid': 'laliga',
    'atletico madrid': 'laliga',
    'atletico': 'laliga',
    'atlético madrid': 'laliga',
    'atlético': 'laliga',
    'sevilla': 'laliga',
    'valencia': 'laliga',
    'real sociedad': 'laliga',
    'sociedad': 'laliga',
    'betis': 'laliga',
    'real betis': 'laliga',
    'villarreal': 'laliga',
    'getafe': 'laliga',
    'osasuna': 'laliga',
    'celta': 'laliga',
    'celta vigo': 'laliga',
    'mallorca': 'laliga',
    'rayo': 'laliga',
    'rayo vallecano': 'laliga',
    'girona': 'laliga',
    'almeria': 'laliga',
    'cadiz': 'laliga',
    'alaves': 'laliga',
    'las palmas': 'laliga',
    'leganes': 'laliga',
    'espanyol': 'laliga',
    'valladolid': 'laliga',
    'granada': 'laliga',
    'elche': 'laliga',
    'levante': 'laliga',
    'oviedo': 'laliga',
    'albacete': 'laliga',
    'albacete': 'laliga',
    'malaga': 'laliga',
    'real murcia': 'laliga',
    'murcia': 'laliga',
    'deportivo': 'laliga',
    'deportivo la coruna': 'laliga',
    'depor': 'laliga',
    'racing santander': 'laliga',
    'zaragoza': 'laliga',

    // Premier League
    'arsenal': 'premier',

    'chelsea': 'premier',
    'liverpool': 'premier',
    'man united': 'premier',
    'manchester united': 'premier',
    'united': 'premier',
    'man city': 'premier',
    'manchester city': 'premier',
    'city': 'premier',
    'tottenham': 'premier',
    'spurs': 'premier',
    'newcastle': 'premier',
    'aston villa': 'premier',
    'villa': 'premier',
    'west ham': 'premier',
    'brighton': 'premier',
    'crystal palace': 'premier',
    'palace': 'premier',
    'fulham': 'premier',
    'brentford': 'premier',
    'nottingham': 'premier',
    'nottingham forest': 'premier',
    'wolves': 'premier',
    'wolverhampton': 'premier',
    'bournemouth': 'premier',
    'everton': 'premier',
    'leicester': 'premier',
    'ipswich': 'premier',
    'southampton': 'premier',

    // Serie A
    'juventus': 'seriea',
    'juve': 'seriea',
    'inter': 'seriea',
    'inter milan': 'seriea',
    'internazionale': 'seriea',
    'milan': 'seriea',
    'ac milan': 'seriea',
    'napoli': 'seriea',
    'roma': 'seriea',
    'as roma': 'seriea',
    'lazio': 'seriea',
    'atalanta': 'seriea',
    'fiorentina': 'seriea',
    'torino': 'seriea',
    'bologna': 'seriea',
    'udinese': 'seriea',
    'sassuolo': 'seriea',
    'genoa': 'seriea',
    'sampdoria': 'seriea',
    'verona': 'seriea',
    'parma': 'seriea',
    'como': 'seriea',

    // Bundesliga
    'bayern': 'bundesliga',
    'bayern munich': 'bundesliga',
    'bayern munchen': 'bundesliga',
    'dortmund': 'bundesliga',
    'borussia dortmund': 'bundesliga',
    'bvb': 'bundesliga',
    'leverkusen': 'bundesliga',
    'bayer leverkusen': 'bundesliga',
    'leipzig': 'bundesliga',
    'rb leipzig': 'bundesliga',
    'frankfurt': 'bundesliga',
    'eintracht frankfurt': 'bundesliga',
    'wolfsburg': 'bundesliga',
    'schalke': 'bundesliga',
    'monchengladbach': 'bundesliga',
    'gladbach': 'bundesliga',
    'hoffenheim': 'bundesliga',
    'mainz': 'bundesliga',
    'freiburg': 'bundesliga',
    'cologne': 'bundesliga',
    'koln': 'bundesliga',
    'union berlin': 'bundesliga',
    'stuttgart': 'bundesliga',

    // Ligue 1
    'psg': 'ligue1',
    'paris': 'ligue1',
    'paris saint-germain': 'ligue1',
    'paris saint germain': 'ligue1',
    'marseille': 'ligue1',
    'om': 'ligue1',
    'olympique marseille': 'ligue1',
    'monaco': 'ligue1',
    'as monaco': 'ligue1',
    'lyon': 'ligue1',
    'olympique lyon': 'ligue1',
    'ol': 'ligue1',
    'lille': 'ligue1',
    'nice': 'ligue1',
    'lens': 'ligue1',
    'rennes': 'ligue1',
    'strasbourg': 'ligue1',
    'nantes': 'ligue1',
    'toulouse': 'ligue1',
    'montpellier': 'ligue1',
    'reims': 'ligue1',
    'brest': 'ligue1',

    // Brasileirão
    'flamengo': 'brasileirao',
    'palmeiras': 'brasileirao',
    'corinthians': 'brasileirao',
    'sao paulo': 'brasileirao',
    'santos': 'brasileirao',
    'gremio': 'brasileirao',
    'internacional': 'brasileirao',
    'fluminense': 'brasileirao',
    'botafogo': 'brasileirao',
    'athletico': 'brasileirao',
    'cruzeiro': 'brasileirao',
    'atletico mineiro': 'brasileirao',

    // SAF (Argentina)
    'boca': 'saf',
    'boca juniors': 'saf',
    'river': 'saf',
    'river plate': 'saf',
    'racing': 'saf',
    'independiente': 'saf',
    'san lorenzo': 'saf',
    'estudiantes': 'saf',

    // Liga Árabe
    'al-nassr': 'ligaarabe',
    'al nassr': 'ligaarabe',
    'al-hilal': 'ligaarabe',
    'al hilal': 'ligaarabe',
    'al-ittihad': 'ligaarabe',
    'al ittihad': 'ligaarabe',
    'al-ahli': 'ligaarabe',

    // Selecciones
    'spain': 'selecciones',
    'españa': 'selecciones',
    'france': 'selecciones',
    'francia': 'selecciones',
    'germany': 'selecciones',
    'alemania': 'selecciones',
    'england': 'selecciones',
    'inglaterra': 'selecciones',
    'italy': 'selecciones',
    'italia': 'selecciones',
    'portugal': 'selecciones',
    'brazil': 'selecciones',
    'brasil': 'selecciones',
    'argentina': 'selecciones',
    'netherlands': 'selecciones',
    'holanda': 'selecciones',
    'belgium': 'selecciones',
    'belgica': 'selecciones',
    'croatia': 'selecciones',
    'croacia': 'selecciones',
    'japan': 'selecciones',
    'japon': 'selecciones',
    'japón': 'selecciones',
    'korea': 'selecciones',
    'south korea': 'selecciones',
    'corea': 'selecciones',
    'mexico': 'selecciones',
    'méxico': 'selecciones',
    'usa': 'selecciones',
    'united states': 'selecciones',
    'eeuu': 'selecciones',
    'colombia': 'selecciones',
    'uruguay': 'selecciones',
    'chile': 'selecciones',
    'peru': 'selecciones',
    'perú': 'selecciones',
    'morocco': 'selecciones',
    'marruecos': 'selecciones',
    'senegal': 'selecciones',
    'nigeria': 'selecciones',
    'ghana': 'selecciones',
    'cameroon': 'selecciones',
    'camerún': 'selecciones',
    'egypt': 'selecciones',
    'egipto': 'selecciones',
    'australia': 'selecciones',
    'poland': 'selecciones',
    'polonia': 'selecciones',
    'denmark': 'selecciones',
    'dinamarca': 'selecciones',
    'sweden': 'selecciones',
    'suecia': 'selecciones',
    'norway': 'selecciones',
    'noruega': 'selecciones',
    'switzerland': 'selecciones',
    'suiza': 'selecciones',
    'austria': 'selecciones',
    'turkey': 'selecciones',
    'turquia': 'selecciones',
    'turquía': 'selecciones',
    'greece': 'selecciones',
    'grecia': 'selecciones',
    'serbia': 'selecciones',
    'ukraine': 'selecciones',
    'ucrania': 'selecciones',
    'czech': 'selecciones',
    'czech republic': 'selecciones',
    'chequia': 'selecciones',
    'scotland': 'selecciones',
    'escocia': 'selecciones',
    'wales': 'selecciones',
    'gales': 'selecciones',
    'ireland': 'selecciones',
    'irlanda': 'selecciones',

    // NBA - Todos los equipos
    'lakers': 'nba',
    'los angeles lakers': 'nba',
    'celtics': 'nba',
    'boston celtics': 'nba',
    'bulls': 'nba',
    'chicago bulls': 'nba',
    'warriors': 'nba',
    'golden state warriors': 'nba',
    'golden state': 'nba',
    'heat': 'nba',
    'miami heat': 'nba',
    'nets': 'nba',
    'brooklyn nets': 'nba',
    'knicks': 'nba',
    'new york knicks': 'nba',
    'clippers': 'nba',
    'la clippers': 'nba',
    'los angeles clippers': 'nba',
    'mavericks': 'nba',
    'dallas mavericks': 'nba',
    'suns': 'nba',
    'phoenix suns': 'nba',
    'bucks': 'nba',
    'milwaukee bucks': 'nba',
    '76ers': 'nba',
    'sixers': 'nba',
    'philadelphia 76ers': 'nba',
    'thunder': 'nba',
    'oklahoma': 'nba',
    'oklahoma city thunder': 'nba',
    'spurs': 'nba',
    'san antonio spurs': 'nba',
    'raptors': 'nba',
    'toronto raptors': 'nba',
    'rockets': 'nba',
    'houston rockets': 'nba',
    'nuggets': 'nba',
    'denver nuggets': 'nba',
    'timberwolves': 'nba',
    'minnesota timberwolves': 'nba',
    'grizzlies': 'nba',
    'memphis grizzlies': 'nba',
    'pelicans': 'nba',
    'new orleans pelicans': 'nba',
    'hawks': 'nba',
    'atlanta hawks': 'nba',
    'hornets': 'nba',
    'charlotte hornets': 'nba',
    'wizards': 'nba',
    'washington wizards': 'nba',
    'pacers': 'nba',
    'indiana pacers': 'nba',
    'pistons': 'nba',
    'detroit pistons': 'nba',
    'cavaliers': 'nba',
    'cleveland cavaliers': 'nba',
    'magic': 'nba',
    'orlando magic': 'nba',
    'jazz': 'nba',
    'utah jazz': 'nba',
    'kings': 'nba',
    'sacramento kings': 'nba',
    'trail blazers': 'nba',
    'blazers': 'nba',
    'portland trail blazers': 'nba',
    'lebron': 'nba',
    'curry': 'nba',
    'jordan': 'nba'
};

/**
 * Palabras clave para detectar imágenes a excluir
 */
const EXCLUDED_IMAGE_KEYWORDS = [
    'qr',
    'qrcode',
    'whatsapp',
    'wechat',
    'weixin',
    'contact',
    'logo',
    'icon',
    'banner',
    'watermark',
    'payment',
    'shipping',
    'size-chart',
    'sizechart',
    'size_chart'
];

/**
 * Patrones de URL para imágenes de contacto/sociales
 */
const EXCLUDED_URL_PATTERNS = [
    /whatsapp/i,
    /wechat/i,
    /weixin/i,
    /qr[-_]?code/i,
    /contact/i,
    /instagram/i,
    /facebook/i,
    /telegram/i,
    /\/icon\//i,
    /\/logo\//i,
    /size[-_]?chart/i
];

// ============================================================
// SISTEMA DE COMPARACIÓN INTELIGENTE DE EQUIPOS
// ============================================================

/**
 * Palabras a ignorar en la comparación de nombres de equipo
 */
const TEAM_STOPWORDS = [
    'fc', 'cf', 'sc', 'ac', 'as', 'rc', 'cd', 'ud', 'rcd', 'sd', 'real',
    'club', 'sporting', 'deportivo', 'atletico', 'atlético', 'athletic',
    'united', 'city', 'town', 'rovers', 'wanderers',
    'local', 'visitante', 'tercera', 'cuarta', 'home', 'away', 'third', 'fourth',
    'retro', 'special', 'especial', 'edition', 'classic', 'vintage',
    'training', 'entrenamiento', 'portero', 'goalkeeper', 'gk',
    'kids', 'niño', 'niños', 'junior'
];

/**
 * Normaliza un nombre para comparación (sin tildes, minúsculas, sin puntuación)
 */
function normalizeForComparison(str) {
    if (!str) return '';
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Sin tildes
        .replace(/[^\w\s]/g, ' ')         // Puntuación a espacios
        .replace(/\s+/g, ' ')             // Colapsar espacios
        .trim();
}

/**
 * Extrae tokens significativos de un nombre de equipo
 */
function extractTeamTokens(name) {
    const normalized = normalizeForComparison(name);
    const tokens = normalized.split(' ').filter(t => t.length > 1);

    // Filtrar stopwords y números (temporadas)
    return tokens.filter(t =>
        !TEAM_STOPWORDS.includes(t) &&
        !/^\d+$/.test(t) &&
        !/^\d{2}\/?\d{2}$/.test(t) // Temporadas
    );
}

/**
 * Calcula score de similitud entre dos conjuntos de tokens
 * @returns {number} Score de 0 a 1
 */
function calculateTokenSimilarity(tokens1, tokens2) {
    if (tokens1.length === 0 || tokens2.length === 0) return 0;

    const set1 = new Set(tokens1);
    const set2 = new Set(tokens2);

    // Contar matches exactos
    let exactMatches = 0;
    for (const t of set1) {
        if (set2.has(t)) exactMatches++;
    }

    // Contar matches parciales (uno contiene al otro)
    let partialMatches = 0;
    for (const t1 of set1) {
        for (const t2 of set2) {
            if (t1 !== t2 && (t1.includes(t2) || t2.includes(t1))) {
                partialMatches += 0.5;
            }
        }
    }

    const totalMatches = exactMatches + partialMatches;
    const maxPossible = Math.max(set1.size, set2.size);

    return totalMatches / maxPossible;
}

/**
 * Clase para gestionar la comparación de equipos con productos existentes
 */
class TeamMatcher {
    constructor(existingProducts = []) {
        this.products = existingProducts;
        this.teamIndex = new Map(); // token -> [productNames]
        this.buildIndex();
    }

    /**
     * Construye índice invertido de tokens a equipos
     */
    buildIndex() {
        const teamNames = new Set();

        // Extraer nombres únicos de equipos
        this.products.forEach(p => {
            if (p.name) {
                // Extraer solo el nombre del equipo (primera parte antes de la temporada)
                const teamPart = p.name.replace(/\d{2}\/?\d{2}.*$/, '').trim();
                if (teamPart) teamNames.add(teamPart);
            }
        });

        // Indexar por tokens
        teamNames.forEach(name => {
            const tokens = extractTeamTokens(name);
            tokens.forEach(token => {
                if (!this.teamIndex.has(token)) {
                    this.teamIndex.set(token, new Set());
                }
                this.teamIndex.get(token).add(name);
            });
        });
    }

    /**
     * Encuentra el mejor match para un nombre de equipo nuevo
     * @param {string} newTeamName - Nombre del nuevo equipo
     * @param {number} threshold - Umbral mínimo de similitud (0-1)
     * @returns {Object|null} { name, score, league } o null si no hay match
     */
    findBestMatch(newTeamName, threshold = 0.5) {
        const newTokens = extractTeamTokens(newTeamName);
        if (newTokens.length === 0) return null;

        // Buscar candidatos que compartan al menos un token
        const candidates = new Set();
        newTokens.forEach(token => {
            if (this.teamIndex.has(token)) {
                this.teamIndex.get(token).forEach(name => candidates.add(name));
            }
            // Buscar también matches parciales en tokens
            this.teamIndex.forEach((names, indexToken) => {
                if (token.includes(indexToken) || indexToken.includes(token)) {
                    names.forEach(name => candidates.add(name));
                }
            });
        });

        if (candidates.size === 0) return null;

        // Evaluar cada candidato
        let bestMatch = null;
        let bestScore = 0;

        candidates.forEach(candidateName => {
            const candidateTokens = extractTeamTokens(candidateName);
            const score = calculateTokenSimilarity(newTokens, candidateTokens);

            if (score > bestScore && score >= threshold) {
                bestScore = score;
                bestMatch = candidateName;
            }
        });

        if (!bestMatch) return null;

        // Buscar producto con ese nombre para obtener la liga
        const matchingProduct = this.products.find(p =>
            p.name && p.name.startsWith(bestMatch)
        );

        return {
            name: bestMatch,
            score: bestScore,
            league: matchingProduct?.league || null
        };
    }

    /**
     * Normaliza el nombre de equipo basándose en matches existentes
     * Si encuentra un match, usa el formato canónico existente
     */
    normalizeTeamName(newTeamName) {
        const match = this.findBestMatch(newTeamName, 0.6);

        if (match && match.score >= 0.8) {
            // Alta coincidencia - usar el nombre existente
            return {
                name: match.name,
                league: match.league,
                matched: true,
                score: match.score
            };
        }

        // No hay match suficiente - usar el nombre nuevo
        return {
            name: newTeamName,
            league: null,
            matched: false,
            score: 0
        };
    }
}

/**
 * Carga productos existentes desde el archivo products-data.js
 * @param {string} productsFilePath - Ruta al archivo products-data.js
 * @returns {Array} Array de productos
 */
function loadExistingProducts(productsFilePath) {
    try {
        // Leer el archivo
        const content = fs.readFileSync(productsFilePath, 'utf-8');

        // Extraer el array de productos usando regex
        const match = content.match(/const\s+products\s*=\s*(\[[\s\S]*?\]);/);
        if (!match) {
            console.warn('⚠️  No se pudo parsear products-data.js');
            return [];
        }

        // Evaluar el array (cuidado: solo para archivos confiables)
        const products = eval(match[1]);
        return Array.isArray(products) ? products : [];
    } catch (err) {
        console.warn(`⚠️  Error cargando productos existentes: ${err.message}`);
        return [];
    }
}

/**
 * Genera un ID estable basado en hash de la URL del álbum
 * El ID se mantiene constante para la misma URL, permitiendo actualizaciones
 * 
 * @param {string} albumUrl - URL del álbum de Yupoo
 * @returns {number} - ID numérico de 6 dígitos
 */
function generateStableId(albumUrl) {
    // Extraer el ID del álbum de la URL
    const albumIdMatch = albumUrl.match(/albums\/(\d+)/);
    const albumId = albumIdMatch ? albumIdMatch[1] : albumUrl;

    // Crear hash SHA256 de la URL
    const hash = crypto.createHash('sha256').update(albumId).digest('hex');

    // Convertir primeros 8 caracteres hex a número y tomar 6 dígitos
    const numericHash = parseInt(hash.substring(0, 8), 16);

    // Asegurar que esté en rango 100000-999999 (6 dígitos)
    return 100000 + (numericHash % 900000);
}

/**
 * Extrae el ID del álbum desde una URL de Yupoo
 * 
 * @param {string} url - URL completa del álbum
 * @returns {string|null} - ID del álbum o null
 */
function extractAlbumId(url) {
    const match = url.match(/albums\/(\d+)/);
    return match ? match[1] : null;
}

/**
 * Genera un slug URL-friendly desde el nombre del producto
 * 
 * @param {string} name - Nombre del producto
 * @returns {string} - Slug normalizado
 */
function generateSlug(name) {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
        .replace(/[^a-z0-9\s-]/g, '')    // Solo alfanuméricos
        .replace(/\s+/g, '-')            // Espacios a guiones
        .replace(/-+/g, '-')             // Múltiples guiones a uno
        .replace(/^-|-$/g, '');          // Eliminar guiones al inicio/final
}

/**
 * Genera texto alternativo para imagen basado en nombre de producto
 * 
 * @param {string} productName - Nombre del producto
 * @param {number} imageIndex - Índice de la imagen (0-based)
 * @returns {string} - Texto alt descriptivo
 */
function generateImageAlt(productName, imageIndex = 0) {
    if (imageIndex === 0) {
        return `${productName} - Vista principal`;
    }
    return `${productName} - Vista ${imageIndex + 1}`;
}

/**
 * Normaliza texto de inglés a español según mapeo
 * 
 * @param {string} text - Texto a normalizar
 * @returns {string} - Texto normalizado en español
 */
function normalizeText(text) {
    let normalized = text;

    // Reemplazar cada término inglés por su versión española
    for (const [english, spanish] of Object.entries(TEXT_NORMALIZATION)) {
        const regex = new RegExp(`\\b${english}\\b`, 'gi');
        normalized = normalized.replace(regex, spanish);
    }

    return normalized;
}

/**
 * Mapeo de traducciones de países y equipos conocidos
 */
const TEAM_TRANSLATIONS = {
    // Países europeos
    'germany': 'Alemania',
    'deutschland': 'Alemania',
    'england': 'Inglaterra',
    'spain': 'España',
    'france': 'Francia',
    'italy': 'Italia',
    'portugal': 'Portugal',
    'netherlands': 'Holanda',
    'holland': 'Holanda',
    'belgium': 'Bélgica',
    'croatia': 'Croacia',
    'switzerland': 'Suiza',
    'austria': 'Austria',
    'poland': 'Polonia',
    'denmark': 'Dinamarca',
    'sweden': 'Suecia',
    'norway': 'Noruega',
    'finland': 'Finlandia',
    'greece': 'Grecia',
    'turkey': 'Turquía',
    'serbia': 'Serbia',
    'ukraine': 'Ucrania',
    'czech republic': 'República Checa',
    'czechia': 'Chequia',
    'russia': 'Rusia',
    'scotland': 'Escocia',
    'wales': 'Gales',
    'ireland': 'Irlanda',
    'hungary': 'Hungría',
    'romania': 'Rumania',
    'slovakia': 'Eslovaquia',
    'slovenia': 'Eslovenia',
    'iceland': 'Islandia',

    // Países americanos
    'brazil': 'Brasil',
    'argentina': 'Argentina',
    'mexico': 'México',
    'usa': 'Estados Unidos',
    'united states': 'Estados Unidos',
    'colombia': 'Colombia',
    'uruguay': 'Uruguay',
    'chile': 'Chile',
    'peru': 'Perú',
    'ecuador': 'Ecuador',
    'venezuela': 'Venezuela',
    'paraguay': 'Paraguay',
    'bolivia': 'Bolivia',
    'costa rica': 'Costa Rica',
    'panama': 'Panamá',
    'canada': 'Canadá',

    // Países africanos
    'morocco': 'Marruecos',
    'egypt': 'Egipto',
    'nigeria': 'Nigeria',
    'senegal': 'Senegal',
    'cameroon': 'Camerún',
    'ghana': 'Ghana',
    'ivory coast': 'Costa de Marfil',
    'cote divoire': 'Costa de Marfil',
    'tunisia': 'Túnez',
    'algeria': 'Argelia',
    'south africa': 'Sudáfrica',

    // Países asiáticos
    'japan': 'Japón',
    'south korea': 'Corea del Sur',
    'korea': 'Corea del Sur',
    'china': 'China',
    'saudi arabia': 'Arabia Saudita',
    'iran': 'Irán',
    'qatar': 'Qatar',
    'australia': 'Australia',

    // Equipos con variaciones
    'man utd': 'Manchester United',
    'man city': 'Manchester City',
    'spurs': 'Tottenham',
    'barca': 'FC Barcelona',
    'bayern': 'Bayern Munich',
    'juve': 'Juventus',
    'psg': 'PSG',
    'real': 'Real Madrid',
    'inter': 'Inter de Milán',
    'atletico': 'Atlético Madrid',
    'atlético': 'Atlético Madrid'
};

/**
 * Patrones de texto para eliminar del nombre del equipo
 */
const TITLE_CLEANUP_PATTERNS = [
    // Sponsors y versiones
    /with\s+\w+\s+sponsor/gi,      // with white sponsor
    /with\s+\w+\s+sponosr/gi,      // typo common in yupoo: sponosr
    /player\s+version/gi,
    /fans?\s+version/gi,
    /match\s+version/gi,
    /authentic\s+version/gi,
    /replica\s+version/gi,

    // Colores y patrones de diseño
    /black[\s-]?red(\s+line)?/gi,
    /white[\s-]?red(\s+line)?/gi,
    /blue[\s-]?white(\s+line)?/gi,
    /\b(Black|Gold|Blue|White|Pink|Red|Green|Yellow|Purple|Orange|Grey|Gray|Cyan|Navy)\b/gi,

    // Ediciones especiales
    /\d+th\s+anniversary/gi,
    /\d+\s+anniversary/gi,
    /special\s+edition/gi,
    /limited\s+edition/gi,
    /commemorative/gi,
    /edici[oó]n\s+especial/gi,
    /edici[oó]n\s+limitada/gi,
    /aniversario/gi,

    // Contenido entre paréntesis y corchetes
    /\(.*?\)/g,
    /\[.*?\]/g,

    // Entrenamientos y pre-partido
    /\b(Training|Entrenamiento|Pre-match|Warm-up|Prematch|Warmup)\b/gi,

    // Versiones de equipación
    /\b(Vapor|Authentic|Fan|Elite|Match|Stadium|Player|Replica)\b/gi,

    // Marcas y textos comerciales
    /\b(Nike|Adidas|Puma|New Balance|Kappa|Umbro|Under Armour|Jordan)\b/gi,

    // Patrones de tallas en el título
    /\b(Size|Talla)\s*[:=]?\s*[XSMLxsml0-9-]+\b/gi,

    // Números de modelo
    /\b[A-Z]{2,3}\d{4,}\b/gi,

    // Sufijos de versión
    /\bv\d+\.?\d*\b/gi,

    // Indicadores de calidad (Yupoo)
    /\b(AAA|AA|A)\s*quality/gi,
    /\bThai\s*quality/gi,
    /\b1:1\b/gi,
    /\bhigh\s*quality/gi,

    // Términos genéricos a limpiar (incluyendo plurales)
    /\bjerseys?\b/gi,
    /\bshirts?\b/gi,
    /\bkits?\b/gi,
    /\bsoccer\b/gi,
    /\bfootball\b/gi,
    /\bbasketball\b/gi
];

/**
 * Parsea el título del producto y extrae información estructurada
 * 
 * @param {string} rawTitle - Título crudo del álbum
 * @returns {Object} - Información parseada
 */
function parseProductTitle(rawTitle) {
    // === LIMPIEZA INICIAL DEL TÍTULO ===
    let title = rawTitle.trim();

    // Limpiar entidades HTML escapadas
    title = title
        .replace(/&amp;amp;/gi, '&')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/&nbsp;/gi, ' ');

    // Eliminar caracteres especiales sueltos que no aportan (& sin contexto)
    title = title.replace(/\s*&\s*/g, ' ');

    // Eliminar colores comunes en inglés del título
    const colors = ['black', 'white', 'red', 'blue', 'green', 'yellow', 'pink', 'gold', 'golden',
        'purple', 'orange', 'grey', 'gray', 'navy', 'cyan', 'balck', 'bule', 'whit'];
    colors.forEach(color => {
        title = title.replace(new RegExp(`\\b${color}\\b`, 'gi'), '');
    });

    // Limpiar espacios múltiples
    title = title.replace(/\s+/g, ' ').trim();

    const result = {
        raw: rawTitle,
        name: '',
        team: '',
        temporada: null,
        tipo: null,
        tallas: null,
        isKids: false,
        isRetro: false
    };

    // Detectar temporada (formato XX/XX, 20XX, o XXYY)
    // Prioridad: formato XX/XX explícito, luego 20XX (año completo)

    // Buscar primero formato explícito XX/XX o XX-XX (ej: 87/89, 25/26)
    const explicitSeasonMatch = title.match(/\b(\d{2})[\/\-](\d{2})\b/);
    // Buscar año completo 20XX
    const fullYearMatch = title.match(/\b(20\d{2})\b/);
    // Buscar formato pegado XXYY (ej: 2526)
    const gluedSeasonMatch = title.match(/\b(\d{2})(\d{2})\b(?!\d)/);

    if (explicitSeasonMatch) {
        // Formato explícito XX/XX (ej: 87/89, 25/26, 97/98)
        const y1 = explicitSeasonMatch[1];
        const y2 = explicitSeasonMatch[2];
        result.temporada = `${y1}/${y2}`;
    } else if (fullYearMatch) {
        // Año simple: 2026 -> usar tal cual para mundiales y eventos
        result.temporada = fullYearMatch[1];
    } else if (gluedSeasonMatch) {
        // Formato pegado 2526 -> 25/26
        const y1 = gluedSeasonMatch[1];
        const y2 = gluedSeasonMatch[2];
        const n1 = parseInt(y1);
        const n2 = parseInt(y2);
        // Solo aceptar si parece una temporada válida (segundo > primero o es vuelta de siglo)
        if (n2 > n1 || (n1 >= 90 && n2 < 10)) {
            result.temporada = `${y1}/${y2}`;
        }
    }

    // Default temporada si no se encontró y hay indicios comunes
    if (!result.temporada && title.includes('25/26')) result.temporada = '25/26';
    if (!result.temporada && title.includes('24/25')) result.temporada = '24/25';


    // Detectar tipo de camiseta
    const titleLower = title.toLowerCase();
    if (titleLower.includes('away') || titleLower.includes('visitante')) {
        result.tipo = 'visitante';
    } else if (titleLower.includes('third') || titleLower.includes('tercera')) {
        result.tipo = 'tercera';
    } else if (titleLower.includes('fourth') || titleLower.includes('cuarta')) {
        result.tipo = 'cuarta';
    } else if (titleLower.includes('home') || titleLower.includes('local')) {
        result.tipo = 'local';
    } else if (titleLower.includes('gk') || titleLower.includes('goalkeeper') || titleLower.includes('portero')) {
        result.tipo = 'portero';
    } else if (titleLower.includes('special') || titleLower.includes('especial') || titleLower.includes('edition')) {
        result.tipo = 'especial';
    } else if (titleLower.includes('training') || titleLower.includes('entrenamiento')) {
        result.tipo = 'entrenamiento';
    }

    // Detectar tallas
    const sizesMatch = title.match(/\b(S-\d?XL|S-4XL|XS-XXL|S-XXL|M-XXL|S-3XL)/i);
    if (sizesMatch) {
        result.tallas = sizesMatch[1].toUpperCase();
    }

    // Detectar si es kids/niño
    result.isKids = /\b(kids?|niños?|child|children|junior)\b/i.test(titleLower);

    // Detectar si es retro
    result.isRetro = /\bretro\b/i.test(titleLower);

    // --- Extracción y Limpieza del Nombre del Equipo ---
    let teamName = title;

    // 1. Eliminar palabras clave conocidas (meta-info)
    teamName = teamName
        .replace(/\b(20\d{2})\b/g, '')                 // Años 20XX
        .replace(/(\d{2})[\/-]?(\d{2})\b/g, '')        // Temporadas XX/YY o XXYY
        .replace(/\b(away|home|third|fourth|visitante|local|tercera|cuarta|gk|goalkeeper|portero)\b/gi, '')
        .replace(/\b(special|especial|edition|edici[oó]n)\b/gi, '')
        .replace(/\b(training|entrenamiento|pre-?match|warm-?up)\b/gi, '')
        .replace(/\b(retro|classic|vintage)\b/gi, '')
        .replace(/\b(kids?|niños?|child|children|junior)\b/gi, '')
        .replace(/\b(S-\d?XL|S-4XL|XS-XXL|S-XXL|M-XXL|S-3XL)\b/gi, '')
        .replace(/\b(jerseys?|shirts?|camisas?|camisetas?|kits?)\b/gi, ''); // Palabras genéricas

    // 2. Aplicar patrones de limpieza específicos (junk phrases)
    TITLE_CLEANUP_PATTERNS.forEach(pattern => {
        teamName = teamName.replace(pattern, '');
    });

    // 3. Limpieza final de espacios y caracteres
    teamName = teamName
        .replace(/\s+/g, ' ')
        .replace(/^\W+|\W+$/g, '') // Eliminar no-alfanuméricos extremos
        .trim();

    // 4. Traducir nombre del país/equipo si existe en diccionario
    const lowerTeam = teamName.toLowerCase();
    if (TEAM_TRANSLATIONS[lowerTeam]) {
        teamName = TEAM_TRANSLATIONS[lowerTeam];
    } else {
        // Intentar buscar palabras sueltas (ej: "Germany Home" -> "Germany" -> "Alemania")
        // Como ya limpiamos "Home", queda "Germany".
        // Pero si es "Team Germany", puede fallar.
        // Hacemos una pasada de reemplazo por palabras para traducciones conocidas
        for (const [eng, esp] of Object.entries(TEAM_TRANSLATIONS)) {
            const regex = new RegExp(`\\b${eng}\\b`, 'yi'); // case insensitive match full word
            if (lowerTeam === eng) { // match exacto
                teamName = esp;
                break;
            }
        }
    }

    result.team = teamName;

    // Generar nombre final normalizado
    // Formato: [Equipo] [Temporada] [Tipo] [Retro?] [Niño?]
    let finalParts = [result.team];

    if (result.temporada) finalParts.push(result.temporada);

    if (result.tipo) {
        finalParts.push(result.tipo.charAt(0).toUpperCase() + result.tipo.slice(1));
    }

    if (result.isRetro) finalParts.push('Retro');
    if (result.isKids) finalParts.push('(Niño)');

    result.name = finalParts.join(' ');

    // Fallback: si quedó vacío el nombre, usar el raw (no debería pasar)
    if (!result.name.trim()) result.name = result.raw;

    return result;
}

/**
 * Detecta la liga del equipo basándose en el nombre
 * 
 * @param {string} teamName - Nombre del equipo
 * @param {boolean} isRetro - Si es camiseta retro
 * @returns {string} - Código de liga
 */
function detectLeague(teamName, isRetro = false) {
    // NOTA: Ya no retornamos 'retro' como liga.
    // Los productos retro mantienen su liga real y tienen retro: true

    const teamLower = teamName.toLowerCase().trim();

    // Buscar coincidencia exacta primero
    if (TEAM_TO_LEAGUE[teamLower]) {
        return TEAM_TO_LEAGUE[teamLower];
    }

    // Heurística simple para selecciones
    const SELECCIONES = [
        'alemania', 'inglaterra', 'españa', 'francia', 'italia', 'portugal',
        'holanda', 'bélgica', 'brasil', 'argentina', 'méxico', 'estados unidos',
        'japón', 'marruecos', 'croacia', 'suiza', 'uruguay', 'colombia',
        'corea del sur', 'nigeria', 'senegal', 'camerún', 'ghana', 'egipto',
        'túnez', 'argelia', 'costa de marfil', 'perú', 'chile', 'ecuador',
        'venezuela', 'paraguay', 'panamá', 'costa rica', 'canadá',
        'polonia', 'dinamarca', 'suecia', 'noruega', 'austria', 'turquía',
        'grecia', 'serbia', 'ucrania', 'chequia', 'rusia', 'escocia',
        'gales', 'irlanda', 'hungría', 'rumania', 'eslovaquia', 'eslovenia',
        'islandia', 'finlandia', 'arabia saudita', 'irán', 'qatar', 'australia',
        'china', 'sudáfrica'
    ];

    if (SELECCIONES.includes(teamLower)) {
        return 'selecciones';
    }

    // Buscar coincidencia parcial, priorizando las cadenas más largas
    const sortedTeams = Object.keys(TEAM_TO_LEAGUE).sort((a, b) => b.length - a.length);

    for (const team of sortedTeams) {
        if (teamLower.includes(team)) {
            return TEAM_TO_LEAGUE[team];
        }
    }

    // Default: futbol genérico
    return 'otros';
}

/**
 * Detecta la categoría del producto
 * 
 * @param {string} league - Liga detectada
 * @returns {string} - Categoría
 */
function detectCategory(league) {
    if (league === 'nba') {
        return 'nba';
    }
    return 'futbol';
}

/**
 * Verifica si una URL de imagen debe ser excluida
 * 
 * @param {string} url - URL de la imagen
 * @param {string} alt - Texto alternativo o nombre de archivo
 * @returns {boolean} - true si debe excluirse
 */
function shouldExcludeImage(url, alt = '') {
    const urlLower = url.toLowerCase();
    const altLower = (alt || '').toLowerCase();

    // Verificar patrones de URL excluidos
    for (const pattern of EXCLUDED_URL_PATTERNS) {
        if (pattern.test(urlLower)) {
            return true;
        }
    }

    // Verificar palabras clave excluidas
    for (const keyword of EXCLUDED_IMAGE_KEYWORDS) {
        if (urlLower.includes(keyword) || altLower.includes(keyword)) {
            return true;
        }
    }

    return false;
}

/**
 * Extrae el número final del nombre de archivo
 * Ej: M47A8004.jpg -> 8004, big.jpg -> null
 * 
 * @param {string} url - URL de la imagen
 * @returns {number|null} - Número extraído o null
 */
function extractTrailingNumber(url) {
    try {
        const clean = url.split('?')[0];
        const filename = clean.split('/').pop() || '';
        const base = filename.replace(/\.[^.]+$/, ''); // sin extensión

        // Coge los últimos dígitos del nombre (M47A8004 -> 8004)
        const m = base.match(/(\d+)(?!.*\d)/);
        return m ? parseInt(m[1], 10) : null;
    } catch {
        return null;
    }
}

/**
 * Verifica si una imagen es válida para importar
 * Acepta: big.jpg O ficheros con número final (M47A8004.jpg)
 * 
 * @param {string} url - URL de la imagen
 * @returns {boolean} - true si es imagen válida
 */
function isHighResImage(url) {
    const u = url.toLowerCase();
    if (!u.includes('photo.yupoo.com')) return false;

    // Rechazar miniaturas
    if (u.includes('square.jpg') || u.includes('/small.') ||
        u.includes('/medium.') || u.includes('/thumb.')) {
        return false;
    }

    // Acepta: big.jpg
    if (/\/big\.jpg(\?.*)?$/i.test(u)) return true;

    // Acepta: ficheros con número final (M47A8004.jpg)
    const n = extractTrailingNumber(url);
    return n !== null;
}

/**
 * Convierte URL de Yupoo a versión de alta resolución
 * 
 * @param {string} url - URL original
 * @returns {string} - URL de alta resolución
 */
function toHighResUrl(url) {
    // Asegurar protocolo
    let highRes = url.startsWith('//') ? `https:${url}` : url;

    // Intentar convertir a versión "big"
    highRes = highRes
        .replace(/\/small\./gi, '/big.')
        .replace(/\/medium\./gi, '/big.')
        .replace(/\/thumb\./gi, '/big.');

    return highRes;
}

/**
 * Filtra y procesa array de URLs de imágenes
 * Selecciona SOLO 2 imágenes: min y max por número extraído del filename
 * 
 * @param {Array<{url: string, alt?: string, filename?: string}>} images - Imágenes crudas
 * @param {boolean} strictMode - Si es true, solo incluye imágenes 1000x confirmadas
 * @returns {Object} - { image, images, imageAlt }
 */
function processImages(images, strictMode = false) {
    const seen = new Set();
    const validImages = [];

    for (const img of images) {
        // Skip if URL is missing or malformed
        if (!img.url || img.url === 'undefined' || img.url.includes('undefined')) continue;
        if (!img.url.includes('photo.yupoo.com')) continue;

        const url = toHighResUrl(img.url);

        // Skip duplicados
        if (seen.has(url)) continue;
        seen.add(url);

        // Skip imágenes excluidas (QR, WhatsApp, etc.)
        if (shouldExcludeImage(url, img.alt)) continue;

        // Verificar si es imagen válida
        if (!isHighResImage(url)) continue;

        // Extraer número del filename (ej: 10003.jpg -> 10003, M47A8004.jpg -> 8004)
        let fileNumber = null;
        const filename = img.filename || img.alt || '';

        // Buscar el último grupo de dígitos en el nombre
        const numMatch = filename.match(/(\d+)(?=\.[^.]+$)|(\d+)$/);
        if (numMatch) {
            fileNumber = parseInt(numMatch[1] || numMatch[2], 10);
        }

        // Fallback: extraer número del hash hex en la URL
        if (fileNumber === null) {
            const hashMatch = url.match(/\/([a-f0-9]{8})\//i);
            if (hashMatch) {
                fileNumber = parseInt(hashMatch[1], 16);
            }
        }

        validImages.push({
            url,
            alt: img.alt || '',
            filename: filename,
            fileNumber: fileNumber
        });
    }

    // Debug: mostrar imágenes válidas con sus números
    if (process.env.DEBUG_YUPOO) {
        console.log('\n=== DEBUG: Imágenes válidas para selección ===');
        validImages.forEach((img, i) => {
            console.log(`${i}: filename="${img.filename}" num=${img.fileNumber} url=${img.url.substring(0, 60)}...`);
        });
    }

    // --- ORDENAR POR NÚMERO DE ARCHIVO Y SELECCIONAR MIN/MAX ---
    // Filtrar solo las que tienen número
    const withNumber = validImages.filter(img => img.fileNumber !== null);

    let finalImages = [];

    if (withNumber.length >= 2) {
        // Ordenar por número
        withNumber.sort((a, b) => a.fileNumber - b.fileNumber);

        const minImg = withNumber[0];                      // Menor número = principal
        const maxImg = withNumber[withNumber.length - 1];  // Mayor número = secundaria

        finalImages = [minImg, maxImg];

        if (process.env.DEBUG_YUPOO) {
            console.log(`\nSeleccionadas: MIN=${minImg.fileNumber} (${minImg.filename}), MAX=${maxImg.fileNumber} (${maxImg.filename})`);
        }
    } else if (withNumber.length === 1) {
        finalImages = [withNumber[0]];
    } else if (validImages.length >= 2) {
        // Fallback: usar las 2 últimas del array original
        finalImages = [
            validImages[validImages.length - 1],
            validImages[validImages.length - 2]
        ];
    } else if (validImages.length === 1) {
        finalImages = [validImages[0]];
    }

    if (process.env.DEBUG_YUPOO) {
        console.log('=================================\n');
    }

    return {
        image: finalImages[0]?.url || null,
        images: finalImages.slice(1).map(img => img.url),
        allImages: finalImages.map(img => img.url)
    };
}



/**
 * Intenta obtener datos del álbum mediante la API JSON de Yupoo
 * 
 * @param {string} albumUrl - URL del álbum
 * @returns {Promise<Object|null>} - Datos del álbum o null si falla
 */
async function fetchYupooJson(albumUrl) {
    try {
        const albumId = extractAlbumId(albumUrl);
        if (!albumId) return null;

        // Extraer subdomain del URL
        const urlObj = new URL(albumUrl);
        const subdomain = urlObj.hostname.split('.')[0];

        // Intentar endpoint de API JSON de Yupoo
        const apiUrl = `https://${subdomain}.x.yupoo.com/api/albums/${albumId}?uid=1`;

        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/json',
                'Referer': albumUrl,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!response.ok) return null;

        const data = await response.json();
        return data;
    } catch (error) {
        // JSON API no disponible, fallback a DOM parsing
        return null;
    }
}

/**
 * Parsea HTML de Yupoo para extraer datos del producto
 * Fallback cuando la API JSON no está disponible
 * 
 * @param {string} html - HTML de la página
 * @param {string} albumUrl - URL del álbum para contexto
 * @returns {Object} - Datos parseados
 */
function parseYupooHtml(html, albumUrl) {
    const result = {
        title: '',
        images: []
    };

    // Extraer título
    // Patrón 1: <title>
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
        // Limpiar el título (quitar sufijos de Yupoo y basura)
        result.title = titleMatch[1]
            .replace(/\s*\|\s*又拍图片管家.*$/i, '')
            .replace(/\s*\|\s*yupoo.*$/i, '')
            .replace(/\s*-\s*yupoo.*$/i, '')
            .replace(/\s*\|\s*Yupoo.*$/i, '')
            .replace(/\bjersey\b/gi, '')  // Remove redundant 'jersey'
            .replace(/\s+/g, ' ')  // Normalize whitespace
            .trim();
    }

    // Extraer imágenes CON NOMBRES DE ARCHIVO ORIGINALES
    // En Yupoo, los nombres de archivo aparecen en varios lugares:
    // 1. Elementos con data-name o data-title
    // 2. Texto dentro de elementos .photo__info, .photo__title, etc.
    // 3. Atributo title o alt de las imágenes
    // 4. Estructuras JSON embebidas con "name", "filename", "origin_name"

    // Primero, buscar estructuras JSON embebidas que contengan datos de fotos
    const jsonDataPattern = /(?:photos|images)\s*[:=]\s*(\[[^\]]+\])/gi;
    let jsonMatch;
    while ((jsonMatch = jsonDataPattern.exec(html)) !== null) {
        try {
            const photosArray = JSON.parse(jsonMatch[1].replace(/'/g, '"'));
            for (const photo of photosArray) {
                if (photo.url || photo.src) {
                    result.images.push({
                        url: photo.url || photo.src,
                        alt: photo.name || photo.filename || photo.origin_name || '',
                        filename: photo.name || photo.filename || photo.origin_name || ''
                    });
                }
            }
        } catch (e) {
            // No es JSON válido, continuar
        }
    }

    // Patrón para encontrar bloques de foto con nombre asociado
    // Buscar patrones como: data-src="URL" ... title="10003.jpg" o similares
    const photoBlockPattern = /<div[^>]*class="[^"]*photo[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
    while ((match = photoBlockPattern.exec(html)) !== null) {
        const block = match[0];

        // Extraer URL de la imagen
        const urlMatch = block.match(/(?:data-src|src)=["']([^"']+photo\.yupoo\.com[^"']+)["']/i);
        if (!urlMatch) continue;

        const url = urlMatch[1];

        // Buscar nombre de archivo asociado en el mismo bloque
        // Patrones: title="10003.jpg", data-name="10003", texto como "10003.jpg"
        let filename = '';

        const titleMatch = block.match(/title=["']([^"']*\d+\.(?:jpg|png|jpeg)[^"']*)["']/i);
        if (titleMatch) filename = titleMatch[1];

        const dataNameMatch = block.match(/data-name=["']([^"']*)["']/i);
        if (!filename && dataNameMatch) filename = dataNameMatch[1];

        // Buscar texto que parezca nombre de archivo (ej: 10003.jpg)
        const filenameTextMatch = block.match(/>(\d+\.(?:jpg|png|jpeg))</i);
        if (!filename && filenameTextMatch) filename = filenameTextMatch[1];

        result.images.push({ url, alt: filename, filename });
    }

    // Patrón alternativo: data-src con nombres de archivo cercanos
    const dataSrcPattern = /data-src=["']([^"']+)["'][^>]*>/gi;
    while ((match = dataSrcPattern.exec(html)) !== null) {
        const url = match[1];
        if (!url.includes('photo.yupoo.com')) continue;

        // Buscar nombre de archivo en el contexto cercano (100 chars adelante)
        const contextStart = match.index;
        const context = html.substring(contextStart, contextStart + 300);

        let filename = '';
        const filenameMatch = context.match(/(\d{4,}\.(?:jpg|png|jpeg))/i);
        if (filenameMatch) filename = filenameMatch[1];

        const altMatch = context.match(/alt=["']([^"']*)["']/i);
        if (!filename && altMatch) filename = altMatch[1];

        result.images.push({ url, alt: filename, filename });
    }

    // Patrón 2: src directo en imágenes
    const srcPattern = /src=["']((?:https?:)?\/\/photo\.yupoo\.com[^"']+)["']/gi;
    while ((match = srcPattern.exec(html)) !== null) {
        result.images.push({ url: match[1], alt: '', filename: '' });
    }

    // Eliminar duplicados manteniendo el que tenga filename
    const seen = new Map();
    for (const img of result.images) {
        const key = img.url.replace(/^https?:/, '');
        if (!seen.has(key) || (img.filename && !seen.get(key).filename)) {
            seen.set(key, img);
        }
    }
    result.images = Array.from(seen.values());

    // Debug: mostrar lo que encontramos
    if (process.env.DEBUG_YUPOO) {
        console.log('\n=== DEBUG: Imágenes extraídas ===');
        result.images.forEach((img, i) => {
            const num = img.filename ? img.filename.match(/\d+/) : null;
            console.log(`${i}: ${img.filename || 'SIN_NOMBRE'} -> ${num ? num[0] : 'N/A'} -> ${img.url.substring(0, 60)}...`);
        });
        console.log('=================================\n');
    }

    return result;
}

/**
 * Obtiene datos completos de un álbum de Yupoo
 * 
 * @param {string} albumUrl - URL del álbum
 * @returns {Promise<Object>} - Datos del producto
 */
async function fetchYupooAlbum(albumUrl) {
    const albumId = extractAlbumId(albumUrl);

    if (!albumId) {
        throw new Error(`URL de álbum inválida: ${albumUrl}`);
    }

    // Intentar JSON API primero (más confiable)
    const jsonData = await fetchYupooJson(albumUrl);

    if (jsonData && jsonData.album) {
        const album = jsonData.album;
        return {
            title: album.title || album.name || '',
            images: (album.photos || []).map(photo => ({
                url: photo.url || photo.original_url || photo.big_url,
                alt: photo.name || ''
            }))
        };
    }

    // Fallback a parsing HTML
    const response = await fetch(albumUrl, {
        headers: {
            'Accept': 'text/html',
            'Referer': 'https://yupoo.com/',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    });

    if (!response.ok) {
        throw new Error(`Error al cargar álbum: HTTP ${response.status}`);
    }

    const html = await response.text();
    return parseYupooHtml(html, albumUrl);
}

/**
 * Importa un producto desde una URL de álbum de Yupoo
 * 
 * @param {string} albumUrl - URL del álbum de Yupoo
 * @param {Object} options - Opciones de importación
 * @param {boolean} options.strictImages - Solo incluir imágenes de alta resolución confirmadas
 * @returns {Promise<Object>} - Producto importado
 */
async function importFromYupoo(albumUrl, options = {}) {
    const { strictImages = false } = options;

    // Validar URL
    if (!albumUrl || !albumUrl.includes('yupoo.com')) {
        throw new Error('URL de Yupoo inválida');
    }

    // Obtener datos del álbum
    const albumData = await fetchYupooAlbum(albumUrl);

    if (!albumData.title) {
        throw new Error('No se pudo extraer el título del producto');
    }

    // Parsear título
    const titleInfo = parseProductTitle(albumData.title);

    // Procesar imágenes
    const imageData = processImages(albumData.images, strictImages);

    if (strictImages && !imageData.image) {
        throw new Error('No se encontraron imágenes de alta resolución (1000x1000)');
    }

    if (!imageData.image && albumData.images.length > 0) {
        // En modo no estricto, usar la primera imagen disponible
        imageData.image = toHighResUrl(albumData.images[0].url);
    }

    if (!imageData.image) {
        throw new Error('No se encontraron imágenes válidas en el álbum');
    }

    // Detectar liga y categoría
    const league = detectLeague(titleInfo.team, titleInfo.isRetro);
    const category = detectCategory(league);

    // Generar ID estable
    const id = generateStableId(albumUrl);

    // Construir objeto producto (campos mínimos esenciales)
    const product = {
        id,
        name: titleInfo.name,
        category,
        league,
        image: imageData.image,
        images: imageData.images
    };

    // Añadir campos opcionales solo si existen y son útiles
    if (titleInfo.temporada) {
        product.temporada = titleInfo.temporada;
    }

    if (titleInfo.tipo) {
        product.tipo = titleInfo.tipo;
    }

    if (titleInfo.isKids) {
        product.kids = true;
    }

    if (titleInfo.isRetro) {
        product.retro = true;
    }

    return product;
}

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

/**
 * Descarga una imagen desde URL con el header Referer correcto
 * 
 * @param {string} imageUrl - URL de la imagen
 * @param {string} destPath - Ruta de destino local
 * @param {string} referer - URL de referrer para la petición
 * @returns {Promise<boolean>} - true si descargó correctamente
 */
function downloadImage(imageUrl, destPath, referer) {
    return new Promise((resolve, reject) => {
        const url = imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl;
        const protocol = url.startsWith('https') ? https : http;

        const options = {
            headers: {
                'Referer': referer,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        };

        const request = protocol.get(url, options, (response) => {
            // Handle redirects
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                downloadImage(response.headers.location, destPath, referer)
                    .then(resolve)
                    .catch(reject);
                return;
            }

            if (response.statusCode !== 200) {
                reject(new Error(`HTTP ${response.statusCode}`));
                return;
            }

            // Ensure directory exists
            const dir = path.dirname(destPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            const fileStream = fs.createWriteStream(destPath);
            response.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                resolve(true);
            });

            fileStream.on('error', (err) => {
                fs.unlink(destPath, () => { }); // Delete partial file
                reject(err);
            });
        });

        request.on('error', reject);
        request.setTimeout(30000, () => {
            request.destroy();
            reject(new Error('Timeout'));
        });
    });
}

/**
 * Descarga una imagen y la convierte a WebP
 * Requiere: npm install sharp
 * 
 * @param {string} imageUrl - URL de la imagen
 * @param {string} destPath - Ruta de destino (sin extensión, se añade .webp)
 * @param {string} referer - URL de referrer para la petición
 * @param {Object} options - Opciones de conversión
 * @param {number} options.quality - Calidad WebP (1-100, default: 85)
 * @returns {Promise<string>} - Ruta final del archivo WebP
 */
async function downloadAndConvertToWebP(imageUrl, destPath, referer, options = {}) {
    const { quality = 85 } = options;

    // Crear ruta temporal para descarga original
    const tempPath = destPath + '.tmp';
    const webpPath = destPath.replace(/\.[^.]+$/, '') + '.webp';

    try {
        // Descargar imagen original
        await downloadImage(imageUrl, tempPath, referer);

        // Intentar cargar sharp (debe estar instalado)
        let sharp;
        try {
            sharp = require('sharp');
        } catch (e) {
            // Si sharp no está disponible, renombrar el archivo sin conversión
            console.warn('⚠️  sharp no está instalado. Ejecuta: npm install sharp');
            console.warn('    Guardando imagen sin conversión a WebP.');
            const originalExt = path.extname(imageUrl).split('?')[0] || '.jpg';
            const finalPath = destPath.replace(/\.[^.]+$/, '') + originalExt;
            fs.renameSync(tempPath, finalPath);
            return finalPath;
        }

        // Convertir a WebP
        await sharp(tempPath)
            .webp({ quality })
            .toFile(webpPath);

        // Eliminar archivo temporal
        fs.unlinkSync(tempPath);

        return webpPath;
    } catch (err) {
        // Limpiar archivos temporales en caso de error
        if (fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath);
        }
        throw err;
    }
}

/**
 * Descarga todas las imágenes de un producto y actualiza las rutas
 * Genera miniaturas 600x600 para las primeras 2 imágenes (1_mini.webp, 2_mini.webp)
 * 
 * @param {Object} product - Producto con URLs de Yupoo
 * @param {string} assetsDir - Directorio base de assets
 * @param {Object} options - Opciones de descarga
 * @param {boolean} options.convertToWebP - Si convertir a WebP (default: true)
 * @param {number} options.webpQuality - Calidad WebP 1-100 (default: 85)
 * @param {boolean} options.generateThumbnails - Si generar miniaturas (default: true)
 * @param {number} options.thumbnailSize - Tamaño máximo de miniatura (default: 600)
 * @param {number} options.thumbnailQuality - Calidad de miniatura (default: 80)
 * @returns {Promise<Object>} - Producto con rutas locales
 */
async function downloadProductImages(product, assetsDir, options = {}) {
    const {
        convertToWebP = true,
        webpQuality = 85,
        generateThumbnails = true,
        thumbnailSize = 600,
        thumbnailQuality = 80,
        referer = 'https://yupoo.com/'
    } = options;

    const albumId = product.id.toString();
    const productDir = path.join(assetsDir, 'productos', 'Yupoo', albumId);
    const webPath = `/assets/productos/Yupoo/${albumId}`;

    // Ensure directory exists
    if (!fs.existsSync(productDir)) {
        fs.mkdirSync(productDir, { recursive: true });
    }

    const downloadedImages = [];

    // Collect all images to download
    const allImages = [product.image, ...(product.images || [])].filter(Boolean);

    // Cargar sharp si está disponible (para miniaturas)
    let sharp = null;
    if (generateThumbnails) {
        try {
            sharp = require('sharp');
        } catch (e) {
            console.warn('⚠️  sharp no disponible, miniaturas no se generarán');
        }
    }

    for (let i = 0; i < allImages.length; i++) {
        const imageUrl = allImages[i];
        const imageNumber = i + 1;
        const baseFilename = `${imageNumber}`;
        const localBasePath = path.join(productDir, baseFilename);

        try {
            let finalPath;

            if (convertToWebP) {
                // Descargar y convertir a WebP
                finalPath = await downloadAndConvertToWebP(
                    imageUrl,
                    localBasePath + '.tmp',
                    referer,
                    { quality: webpQuality }
                );
            } else {
                // Descargar sin conversión
                const ext = path.extname(imageUrl).split('?')[0] || '.jpg';
                finalPath = localBasePath + ext;
                await downloadImage(imageUrl, finalPath, referer);
            }

            // Extraer nombre de archivo del path final para la ruta web
            const finalFilename = path.basename(finalPath);
            downloadedImages.push(`${webPath}/${finalFilename}`);

            // Generar miniatura solo para las primeras 2 imágenes
            if (sharp && generateThumbnails && imageNumber <= 2) {
                try {
                    const miniFilename = `${imageNumber}_mini.webp`;
                    const miniPath = path.join(productDir, miniFilename);

                    await sharp(finalPath)
                        .resize(thumbnailSize, thumbnailSize, {
                            fit: 'cover',
                            position: 'center'
                        })
                        .webp({ quality: thumbnailQuality })
                        .toFile(miniPath);

                    console.log(`  ✓ Miniatura generada: ${miniFilename}`);
                } catch (thumbErr) {
                    console.warn(`  ⚠️ Error generando miniatura ${imageNumber}: ${thumbErr.message}`);
                }
            }

        } catch (err) {
            console.warn(`Warning: Failed to download image ${imageNumber}: ${err.message}`);
        }
    }

    if (downloadedImages.length === 0) {
        throw new Error('No se pudieron descargar imágenes');
    }

    // Update product with local paths
    return {
        ...product,
        image: downloadedImages[0],
        images: downloadedImages.slice(1)
    };
}

module.exports = {
    // Main function
    importFromYupoo,

    // Image download
    downloadProductImages,
    downloadImage,
    downloadAndConvertToWebP,

    // Team matching (comparación inteligente)
    TeamMatcher,
    loadExistingProducts,
    extractTeamTokens,
    calculateTokenSimilarity,
    normalizeForComparison,

    // Utilities (para testing/extensión)
    generateStableId,
    extractAlbumId,
    generateSlug,
    generateImageAlt,
    normalizeText,
    parseProductTitle,
    detectLeague,
    detectCategory,
    processImages,
    shouldExcludeImage,
    isHighResImage,
    toHighResUrl,
    fetchYupooAlbum,

    // Constants (para extensión)
    TEAM_TO_LEAGUE,
    TEXT_NORMALIZATION,
    EXCLUDED_IMAGE_KEYWORDS,
    TEAM_STOPWORDS
};

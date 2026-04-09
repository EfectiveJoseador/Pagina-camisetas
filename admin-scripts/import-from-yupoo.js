#!/usr/bin/env node



const fs = require('fs');
const path = require('path');
const {
    importFromYupoo,
    generateStableId,
    extractAlbumId,
    downloadProductImages,
    fetchYupooAlbum,
    toHighResUrl,
    TeamMatcher,
    loadExistingProducts
} = require('./yupoo-importer.js');

const PRODUCTS_FILE = path.join(__dirname, '..', 'js', 'products-data.js');
const ASSETS_DIR = path.join(__dirname, '..', 'assets');
const COLORS = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
};


function print(color, text) {
    console.log(`${COLORS[color]}${text}${COLORS.reset}`);
}


function success(text) {
    print('green', `✓ ${text}`);
}


function error(text) {
    print('red', `✗ ${text}`);
}


function warn(text) {
    print('yellow', `⚠ ${text}`);
}


function info(text) {
    print('cyan', `ℹ ${text}`);
}


function separator() {
    console.log(`${COLORS.dim}${'─'.repeat(60)}${COLORS.reset}`);
}


function showHelp() {
    console.log(`
${COLORS.bright}Yupoo Product Import CLI${COLORS.reset}

${COLORS.cyan}Uso:${COLORS.reset}
  node import-from-yupoo.js <url> [opciones]

${COLORS.cyan}Argumentos:${COLORS.reset}
  url               URL del álbum de Yupoo

${COLORS.cyan}Opciones:${COLORS.reset}
  --dry-run         Previsualizar sin guardar cambios (por defecto)
  --write           Guardar producto en products-data.js
  --json            Salida en formato JSON (para integración)
  --strict-images   Fallar si no hay imágenes de alta resolución (1000x1000)
  --update          Actualizar producto existente si el ID ya existe
  --images N,M      Seleccionar imágenes por índice (ej: --images 8,9)
  --list-images     Listar todas las imágenes disponibles con sus índices
  --help, -h        Mostrar esta ayuda

${COLORS.cyan}Ejemplos:${COLORS.reset}
  ${COLORS.dim}# Previsualizar producto (sin guardar)${COLORS.reset}
  node import-from-yupoo.js "https://pandasportjersey.x.yupoo.com/albums/203698766?uid=1"

  ${COLORS.dim}# Listar imágenes disponibles${COLORS.reset}
  node import-from-yupoo.js "URL" --list-images

  ${COLORS.dim}# Importar con imágenes específicas (0=principal, 1=secundaria)${COLORS.reset}
  node import-from-yupoo.js "URL" --images 8,9 --write

  ${COLORS.dim}# Actualizar producto existente${COLORS.reset}
  node import-from-yupoo.js "https://pandasportjersey.x.yupoo.com/albums/203698766?uid=1" --write --update

  ${COLORS.dim}# Exportar como JSON${COLORS.reset}
  node import-from-yupoo.js "https://pandasportjersey.x.yupoo.com/albums/203698766?uid=1" --json
`);
}


function parseArgs(args) {
    const options = {
        url: null,
        dryRun: true,
        write: false,
        json: false,
        strictImages: false,
        update: false,
        help: false,
        imageIndices: null,
        listImages: false
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (arg === '--help' || arg === '-h') {
            options.help = true;
        } else if (arg === '--dry-run') {
            options.dryRun = true;
            options.write = false;
        } else if (arg === '--write') {
            options.write = true;
            options.dryRun = false;
        } else if (arg === '--json') {
            options.json = true;
        } else if (arg === '--strict-images') {
            options.strictImages = true;
        } else if (arg === '--update') {
            options.update = true;
        } else if (arg === '--list-images') {
            options.listImages = true;
        } else if (arg === '--images' && args[i + 1]) {

            const indicesStr = args[i + 1];
            options.imageIndices = indicesStr.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
            i++;
        } else if (!arg.startsWith('-') && arg.includes('yupoo.com')) {
            options.url = arg;
        }
    }

    return options;
}


function readProductsFile() {
    if (!fs.existsSync(PRODUCTS_FILE)) {
        throw new Error(`Archivo de productos no encontrado: ${PRODUCTS_FILE}`);
    }

    const content = fs.readFileSync(PRODUCTS_FILE, 'utf-8');



    const match = content.match(/const\s+products\s*=\s*(\[[\s\S]*?\]);/);

    if (!match) {
        throw new Error('No se pudo parsear el archivo de productos');
    }


    const productsArray = eval(match[1]);

    return {
        products: productsArray,
        originalContent: content
    };
}


function writeProductsFile(products) {

    const productsJson = JSON.stringify(products, null, 4)

        .replace(/"([^"]+)":/g, '$1:')
        .replace(/: "([^"]+)"/g, ': "$1"');

    const content = `
const products = ${productsJson};

export default products;
`;

    fs.writeFileSync(PRODUCTS_FILE, content.trim() + '\n', 'utf-8');
}


function findProductById(products, id) {
    const index = products.findIndex(p => p.id === id);
    return { product: products[index] || null, index };
}


function findProductBySourceUrl(products, url) {
    const index = products.findIndex(p =>
        p.source && p.source.url === url
    );
    return { product: products[index] || null, index };
}


function displayProductPreview(product) {
    separator();
    console.log(`${COLORS.bright}${COLORS.magenta}PRODUCTO IMPORTADO${COLORS.reset}`);
    separator();

    console.log(`${COLORS.cyan}ID:${COLORS.reset}          ${product.id}`);
    console.log(`${COLORS.cyan}Nombre:${COLORS.reset}      ${product.name}`);
    console.log(`${COLORS.cyan}Categoría:${COLORS.reset}   ${product.category}`);
    console.log(`${COLORS.cyan}Liga:${COLORS.reset}        ${product.league}`);

    if (product.temporada) {
        console.log(`${COLORS.cyan}Temporada:${COLORS.reset}   ${product.temporada}`);
    }
    if (product.tipo) {
        console.log(`${COLORS.cyan}Tipo:${COLORS.reset}        ${product.tipo}`);
    }
    if (product.tallas) {
        console.log(`${COLORS.cyan}Tallas:${COLORS.reset}      ${product.tallas}`);
    }

    separator();
    console.log(`${COLORS.cyan}Imagen principal:${COLORS.reset}`);
    console.log(`  ${COLORS.dim}${product.image}${COLORS.reset}`);

    if (product.images && product.images.length > 0) {
        console.log(`${COLORS.cyan}Imágenes adicionales (${product.images.length}):${COLORS.reset}`);
        product.images.forEach((img, i) => {
            console.log(`  ${COLORS.dim}${i + 1}. ${img}${COLORS.reset}`);
        });
    }

    separator();


    const flags = [];
    if (product.kids) flags.push('👶 Niño');
    if (product.retro) flags.push('🏛️ Retro');

    if (flags.length > 0) {
        console.log(`${COLORS.cyan}Tags:${COLORS.reset}        ${flags.join(' | ')}`);
        separator();
    }
}

async function main() {
    const args = process.argv.slice(2);
    const options = parseArgs(args);


    if (options.help || args.length === 0) {
        showHelp();
        process.exit(0);
    }


    if (!options.url) {
        error('No se proporcionó una URL de Yupoo válida');
        console.log(`\nUso: node import-from-yupoo.js <url> [opciones]`);
        console.log(`Para más ayuda: node import-from-yupoo.js --help`);
        process.exit(1);
    }


    const silent = options.json;

    if (!silent) {
        console.log('');
        info(`Importando desde: ${options.url}`);
        console.log('');
    }

    try {
        const generatedId = generateStableId(options.url);
        const { products } = readProductsFile();

        const existingById = findProductById(products, generatedId);
        const existingByUrl = findProductBySourceUrl(products, options.url);

        if (existingById.product || existingByUrl.product) {
            const existing = existingById.product || existingByUrl.product;
            warn(`⚠ Producto ya existe con ID ${existing.id}: "${existing.name}"`);
            options.update = true;
        }

        if (options.listImages) {
            const albumData = await fetchYupooAlbum(options.url);
            separator();
            console.log(`${COLORS.bright}IMÁGENES DISPONIBLES EN EL ÁLBUM${COLORS.reset}`);
            separator();
            console.log(`${COLORS.cyan}Título:${COLORS.reset} ${albumData.title}`);
            console.log('');


            const bigImages = albumData.images.filter(img => {
                if (!img.url || !img.url.includes('photo.yupoo.com')) return false;
                const urlLower = img.url.toLowerCase();
                if (urlLower.includes('whatsapp') || urlLower.includes('wechat') || urlLower.includes('qr')) return false;

                return urlLower.includes('/big.');
            });

            console.log(`${COLORS.cyan}Imágenes big.jpg:${COLORS.reset} ${bigImages.length}`);
            console.log('');

            bigImages.forEach((img, i) => {
                const urlShort = img.url.substring(0, 70);
                console.log(`  ${COLORS.green}[${i}]${COLORS.reset} ${urlShort}...`);
            });

            separator();
            console.log(`${COLORS.bright}Elige las imágenes separadas por comas.${COLORS.reset}`);
            console.log(`${COLORS.dim}La primera será la principal, la segunda la secundaria.${COLORS.reset}`);
            console.log(`${COLORS.dim}Usa "all" para incluir todas las demás imágenes.${COLORS.reset}`);
            console.log(`${COLORS.dim}Ejemplos: 7,8  ó  4,5,all${COLORS.reset}`);
            console.log('');



            let userInput;
            const lastIdx = bigImages.length - 1;
            const secondLastIdx = bigImages.length - 2;
            const defaultSelection = secondLastIdx >= 0 ? `${lastIdx},${secondLastIdx}` : `${lastIdx}`;

            if (bigImages.length === 2) {
                console.log(`${COLORS.green}✓ Detectadas exactamente 2 imágenes.${COLORS.reset}`);
                console.log(`${COLORS.cyan}Auto-seleccionando: ${lastIdx} (Principal), ${secondLastIdx} (Secundaria)${COLORS.reset}`);
                userInput = defaultSelection;
            } else {
                const readline = require('readline');
                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });

                userInput = await new Promise(resolve => {
                    rl.question(`${COLORS.cyan}Índices (ej: 7,8) [Enter para ${defaultSelection}]: ${COLORS.reset}`, answer => {
                        rl.close();
                        resolve(answer.trim());
                    });
                });
            }

            let finalInput = userInput;

            if (!finalInput) {
                console.log(`${COLORS.yellow}⚠ Input vacío. Usando defecto: ${defaultSelection} (Último=Principal, Penúltimo=Secundaria)${COLORS.reset}`);
                finalInput = defaultSelection;
            }


            const inputParts = finalInput.split(',').map(s => s.trim().toLowerCase());
            const hasAll = inputParts.includes('all');
            const selectedIndices = inputParts
                .filter(s => s !== 'all')
                .map(s => parseInt(s, 10))
                .filter(n => !isNaN(n) && n >= 0 && n < bigImages.length);

            if (selectedIndices.length === 0) {
                error('Índices no válidos');
                process.exit(1);
            }


            if (hasAll) {
                const alreadySelected = new Set(selectedIndices);
                for (let i = 0; i < bigImages.length; i++) {
                    if (!alreadySelected.has(i)) {
                        selectedIndices.push(i);
                    }
                }
            }


            options.imageIndices = selectedIndices;
            options.includeAll = hasAll;
            options.write = true;
            options.dryRun = false;
            options.update = true;


            options._bigImages = bigImages;

            console.log('');
            if (hasAll) {
                success(`Seleccionadas: ${selectedIndices.slice(0, 2).join(', ')} + ${selectedIndices.length - 2} adicionales`);
            } else {
                success(`Seleccionadas: ${selectedIndices.join(', ')}`);
            }
            console.log('');
        }


        let product = await importFromYupoo(options.url, {
            strictImages: options.strictImages
        });


        if (options.imageIndices && options.imageIndices.length > 0) {

            let validImages = options._bigImages;

            if (!validImages) {
                const albumData = await fetchYupooAlbum(options.url);
                validImages = albumData.images.filter(img => {
                    if (!img.url || !img.url.includes('photo.yupoo.com')) return false;
                    const urlLower = img.url.toLowerCase();
                    if (urlLower.includes('whatsapp') || urlLower.includes('wechat') || urlLower.includes('qr')) return false;

                    return urlLower.includes('/big.');
                });
            }

            const selectedImages = options.imageIndices
                .filter(idx => idx >= 0 && idx < validImages.length)
                .map(idx => toHighResUrl(validImages[idx].url));

            if (selectedImages.length > 0) {
                product.image = selectedImages[0];
                product.images = selectedImages.slice(1);
                const extraCount = selectedImages.length > 2 ? ` (+${selectedImages.length - 2} más)` : '';
                info(`Usando imágenes manuales: ${selectedImages.length} imágenes${extraCount}`);
            } else {
                warn('Índices de imagen no válidos, usando selección automática');
            }
        }


        if (options.json) {
            console.log(JSON.stringify(product, null, 2));
            process.exit(0);
        }


        const matcher = new TeamMatcher(products);
        const teamMatch = matcher.findBestMatch(product.name, 0.6); // Threshold aumentado de 0.3 a 0.6

        if (teamMatch && teamMatch.league) {
            info(`🔗 Match encontrado: "${teamMatch.name}" (score: ${(teamMatch.score * 100).toFixed(0)}%)`);

            // Extraer solo la parte del equipo (sin temporada ni variantes) para comparar
            const cleanExistingTeam = teamMatch.name
                .replace(/\s*\d{2}\/?\d{2}.*$/, '')
                .replace(/\b(estilo|Retro|Local|Visitante|Tercera|Cuarta|Especial|Entrenamiento|Portero|Niño|Kids)\b/gi, '')
                .trim();
            
            const cleanCurrentTeam = product.name
                .replace(/\s*\d{2}\/?\d{2}.*$/, '')
                .replace(/\b(estilo|Retro|Local|Visitante|Tercera|Cuarta|Especial|Entrenamiento|Portero|Niño|Kids)\b/gi, '')
                .trim();

            if (teamMatch.score >= 0.7 && cleanExistingTeam && cleanExistingTeam !== cleanCurrentTeam) {
                // Reemplazar el nombre del equipo dentro del nombre completo del producto
                product.name = product.name.replace(cleanCurrentTeam, cleanExistingTeam);
                
                // Regenerar el slug
                const oldSlugPart = cleanCurrentTeam.toLowerCase().replace(/\s+/g, '-');
                const newSlugPart = cleanExistingTeam.toLowerCase().replace(/\s+/g, '-');
                product.slug = product.slug.replace(oldSlugPart, newSlugPart);
                
                info(`   Nombre normalizado: ${cleanCurrentTeam} → ${cleanExistingTeam}`);
            } else if (teamMatch.score < 0.7) {
                info(`   Score bajo (${(teamMatch.score * 100).toFixed(0)}%), manteniendo nombre original`);
            }

            // Solo usar la liga del match si la detección original fue "otros"
            if (product.league === 'otros') {
                info(`   Liga detectada desde match: ${teamMatch.league}`);
                product.league = teamMatch.league;
            } else {
                info(`   Liga original mantenida: ${product.league}`);
            }
        } else if (product.league === 'otros') {

            warn('⚠️  No se encontró match, liga asignada: otros');
            warn('   Considera revisar manualmente la liga después de importar');
        }


        displayProductPreview(product);


        if (!options.write) {
            separator();
            warn('Modo DRY-RUN: No se guardaron cambios');
            info('Usa --write para guardar el producto');
            separator();
            process.exit(0);
        }


        separator();


        info('Descargando imágenes...');
        let productWithLocalImages;
        try {
            productWithLocalImages = await downloadProductImages(product, ASSETS_DIR, {
                referer: options.url
            });
            success(`Imágenes descargadas: ${[productWithLocalImages.image, ...productWithLocalImages.images].length}`);
        } catch (downloadErr) {
            error(`Error descargando imágenes: ${downloadErr.message}`);
            info('Las imágenes de Yupoo requieren descarga local para mostrarse.');
            process.exit(1);
        }

        info('Guardando producto...');

        if (existingById.product && options.update) {

            products[existingById.index] = { ...products[existingById.index], ...productWithLocalImages };
            success(`Producto actualizado: ID ${productWithLocalImages.id}`);
        } else if (existingByUrl.product && options.update) {

            products[existingByUrl.index] = { ...products[existingByUrl.index], ...productWithLocalImages };
            success(`Producto actualizado: ID ${productWithLocalImages.id}`);
        } else if (existingById.product || existingByUrl.product) {

            error('Producto ya existe. Usa --update para sobrescribir');
            process.exit(1);
        } else {

            products.push(productWithLocalImages);
            success(`Producto añadido: ID ${productWithLocalImages.id}`);
        }

        writeProductsFile(products);
        success(`Archivo actualizado: ${PRODUCTS_FILE}`);
        separator();

        console.log(`\n${COLORS.green}${COLORS.bright}¡Importación completada!${COLORS.reset}\n`);

    } catch (err) {
        if (options.json) {
            console.log(JSON.stringify({ error: err.message }, null, 2));
            process.exit(1);
        }

        separator();
        error(`Error de importación: ${err.message}`);
        separator();

        if (err.message.includes('1000x1000')) {
            info('Consejo: Intenta sin --strict-images para aceptar cualquier imagen');
        }

        process.exit(1);
    }
}


main().catch(err => {
    console.error('Error fatal:', err);
    process.exit(1);
});

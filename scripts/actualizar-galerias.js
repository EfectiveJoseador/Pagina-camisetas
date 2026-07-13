const fs = require('fs');
const path = require('path');
let sharp;

try {
    sharp = require('sharp');
} catch (e) {
    console.warn('⚠️ Módulo "sharp" no encontrado. Las imágenes no se convertirán a WebP automáticamente.');
    console.warn('💡 Puedes instalarlo ejecutando: npm install sharp');
}

const assetsDir = path.join(__dirname, '..', 'assets');
const galleries = [
    { name: 'clientes', path: path.join(assetsDir, 'clientes'), prefix: 'cliente' },
    { name: 'pedidos', path: path.join(assetsDir, 'pedidos'), prefix: 'pedido' }
];

const supportedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

async function processGallery(gallery) {
    console.log(`\n📁 Procesando galería: ${gallery.name.toUpperCase()}`);
    
    if (!fs.existsSync(gallery.path)) {
        console.log(`⚠️ La carpeta ${gallery.path} no existe. Creándola...`);
        fs.mkdirSync(gallery.path, { recursive: true });
    }

    const files = fs.readdirSync(gallery.path);
    const finalImages = [];
    let convertedCount = 0;

    for (const file of files) {
        if (file.startsWith('.')) continue; // Ignorar ocultos
        if (file.endsWith('.json')) continue; // Ignorar json

        const ext = path.extname(file).toLowerCase();
        if (!supportedExtensions.includes(ext)) {
            continue; // No es imagen
        }

        const filePath = path.join(gallery.path, file);
        let fileNameNoExt = path.basename(file, ext);
        
        // Si no tenemos sharp, o si ya es webp, lo dejamos tal cual
        if (!sharp || ext === '.webp') {
            finalImages.push(file);
            continue;
        }

        // Si tenemos sharp y no es webp, lo optimizamos y convertimos
        const webpFileName = `${fileNameNoExt}.webp`;
        const webpFilePath = path.join(gallery.path, webpFileName);

        if (!fs.existsSync(webpFilePath)) {
            try {
                console.log(`⏳ Optimizando: ${file} -> ${webpFileName}`);
                await sharp(filePath)
                    .webp({ quality: 80 }) // 80 de calidad da un balance perfecto de peso y visualización
                    .resize({ width: 800, withoutEnlargement: true }) // Redimensionar si es gigante para web
                    .toFile(webpFilePath);
                
                convertedCount++;
                finalImages.push(webpFileName);
                
                // Borramos el original pesado para ahorrar espacio
                fs.unlinkSync(filePath);
                console.log(`🗑️  Original pesado eliminado: ${file}`);
            } catch (error) {
                console.error(`❌ Error convirtiendo ${file}:`, error.message);
                // Fallback: usar el original
                finalImages.push(file);
            }
        } else {
            // Si el webp ya existe (por alguna razón) y tenemos el original, borramos el original
            fs.unlinkSync(filePath);
            console.log(`🗑️  Original eliminado (ya existía su versión webp): ${file}`);
        }
    }

    // Ordenamos las imágenes extrayendo el número si lo tienen
    finalImages.sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || '0');
        const numB = parseInt(b.match(/\d+/)?.[0] || '0');
        return numA - numB;
    });

    const jsonPath = path.join(gallery.path, `${gallery.name}.json`);
    const jsonData = {
        updated: new Date().toISOString(),
        count: finalImages.length,
        images: finalImages
    };

    fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), 'utf-8');
    console.log(`✅ Archivo ${gallery.name}.json actualizado con ${finalImages.length} imágenes.`);
    if (convertedCount > 0) {
        console.log(`✨ ${convertedCount} imágenes fueron optimizadas a formato WebP.`);
    }
}

async function main() {
    console.log('🚀 Iniciando MEGA-ACTUALIZADOR de galerías...\n');
    console.log('ℹ️  Este script buscará imágenes en las carpetas de clientes y pedidos.');
    console.log('ℹ️  Si pones imágenes en JPG o PNG, las convertirá automáticamente a WebP para que tu web cargue súper rápido y borrará los originales pesados.\n');
    
    for (const gallery of galleries) {
        await processGallery(gallery);
    }

    console.log('\n🎉 ¡Listo! Todas las galerías han sido actualizadas y están listas en tu página web.');
}

main().catch(err => {
    console.error('❌ Ocurrió un error fatal:', err);
    process.exit(1);
});

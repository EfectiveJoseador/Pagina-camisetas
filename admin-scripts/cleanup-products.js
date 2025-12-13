const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, '../js/products-data.js');
const BACKUP_FILE = path.join(__dirname, '../js/products-data.js.bak');

// Campos simples a eliminar
const FIELDS_TO_REMOVE = [
    'slug',
    'imageAlt',
    'new',
    'sale',
    'tallas',
    'price',
    'oldPrice'
];

try {
    // 1. Crear backup
    fs.copyFileSync(PRODUCTS_FILE, BACKUP_FILE);
    console.log('✅ Backup creado en products-data.js.bak');

    // 2. Leer archivo
    const content = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    const lines = content.split('\n');
    const newLines = [];
    let isSkippingSource = false;

    // 3. Procesar línea por línea
    for (let line of lines) {
        const trimmed = line.trim();

        // Detectar bloque source
        if (trimmed.startsWith('source: {')) {
            isSkippingSource = true;
            continue;
        }

        if (isSkippingSource) {
            // Si estamos dentro de source, buscar el cierre
            if (trimmed.startsWith('},') || trimmed.startsWith('}')) {
                isSkippingSource = false;
            }
            continue;
        }

        // Verificar si es un campo a eliminar
        // regex: campo: valor,
        let shouldRemove = false;
        for (const field of FIELDS_TO_REMOVE) {
            // Coincide con "field:" al inicio (respetando indentación)
            if (trimmed.startsWith(`${field}:`)) {
                shouldRemove = true;
                break;
            }
        }

        if (!shouldRemove) {
            newLines.push(line);
        }
    }

    // 4. Escribir archivo limpio
    fs.writeFileSync(PRODUCTS_FILE, newLines.join('\n'), 'utf8');
    console.log('✅ products-data.js limpiado correctamente.');

} catch (error) {
    console.error('❌ Error:', error.message);
}

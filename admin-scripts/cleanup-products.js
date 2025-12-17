const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, '../js/products-data.js');
const BACKUP_FILE = path.join(__dirname, '../js/products-data.js.bak');


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
    
    fs.copyFileSync(PRODUCTS_FILE, BACKUP_FILE);
    console.log('✅ Backup creado en products-data.js.bak');

    
    const content = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    const lines = content.split('\n');
    const newLines = [];
    let isSkippingSource = false;

    
    for (let line of lines) {
        const trimmed = line.trim();

        
        if (trimmed.startsWith('source: {')) {
            isSkippingSource = true;
            continue;
        }

        if (isSkippingSource) {
            
            if (trimmed.startsWith('},') || trimmed.startsWith('}')) {
                isSkippingSource = false;
            }
            continue;
        }

        
        
        let shouldRemove = false;
        for (const field of FIELDS_TO_REMOVE) {
            
            if (trimmed.startsWith(`${field}:`)) {
                shouldRemove = true;
                break;
            }
        }

        if (!shouldRemove) {
            newLines.push(line);
        }
    }

    
    fs.writeFileSync(PRODUCTS_FILE, newLines.join('\n'), 'utf8');
    console.log('✅ products-data.js limpiado correctamente.');

} catch (error) {
    console.error('❌ Error:', error.message);
}

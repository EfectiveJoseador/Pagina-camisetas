/**
 * add-skus.js — Asigna un SKU único de 4 dígitos a cada producto en products-data.js
 * Uso: node admin-scripts/add-skus.js
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../js/products-data.js');
let source = fs.readFileSync(filePath, 'utf8');

// ── 1. Extraer el array de productos ────────────────────────────────────────
// El archivo empieza con: const products = [   y termina con: ]; export default products;
// Usamos eval-safe extraction: leemos el JSON entre corchetes
const arrayStart = source.indexOf('[');
const arrayEnd = source.lastIndexOf(']');
const arrayStr = source.slice(arrayStart, arrayEnd + 1);

// Parsear como JSON (los objetos son JSON válido)
let products;
try {
    products = JSON.parse(arrayStr);
} catch (e) {
    console.error('❌ Error al parsear el array de productos:', e.message);
    process.exit(1);
}

console.log(`✅ Parseados ${products.length} productos.`);

// ── 2. Verificar cuántos ya tienen SKU ──────────────────────────────────────
const withSku = products.filter(p => p.sku).length;
const withoutSku = products.filter(p => !p.sku).length;
console.log(`   Con SKU: ${withSku} | Sin SKU: ${withoutSku}`);

// ── 3. Generar pool de SKUs únicos de 4 dígitos ─────────────────────────────
const usedSkus = new Set(products.filter(p => p.sku).map(p => String(p.sku)));

function generateUniqueSku(usedSet) {
    let sku;
    let attempts = 0;
    do {
        // Rango 1000–9999 para garantizar siempre 4 dígitos
        sku = String(Math.floor(1000 + Math.random() * 9000));
        attempts++;
        if (attempts > 10000) throw new Error('No se pueden generar más SKUs únicos (pool agotado)');
    } while (usedSet.has(sku));
    usedSet.add(sku);
    return sku;
}

// ── 4. Asignar SKU a los que no tienen ──────────────────────────────────────
let assigned = 0;
products.forEach(product => {
    if (!product.sku) {
        product.sku = generateUniqueSku(usedSkus);
        assigned++;
    }
});

console.log(`✅ Asignados ${assigned} nuevos SKUs.`);

// ── 5. Verificar unicidad ────────────────────────────────────────────────────
const allSkus = products.map(p => p.sku);
const uniqueSkus = new Set(allSkus);
if (uniqueSkus.size !== products.length) {
    console.error('❌ ERROR: Se detectaron SKUs duplicados. Abortando.');
    process.exit(1);
}
console.log(`✅ Todos los ${products.length} SKUs son únicos.`);

// ── 6. Reconstruir el archivo ────────────────────────────────────────────────
// Reordenar campos: id, sku, name, ... para que el SKU sea visible al principio
const reordered = products.map(p => {
    const { id, sku, name, slug, category, league, image, images, ...rest } = p;
    const obj = {};
    if (id !== undefined) obj.id = id;
    obj.sku = sku;
    if (name !== undefined) obj.name = name;
    if (slug !== undefined) obj.slug = slug;
    if (category !== undefined) obj.category = category;
    if (league !== undefined) obj.league = league;
    if (image !== undefined) obj.image = image;
    if (images !== undefined) obj.images = images;
    // Resto de campos
    Object.assign(obj, rest);
    return obj;
});

const newArrayStr = JSON.stringify(reordered, null, 4)
    .replace(/"([^"]+)":/g, '"$1":');   // mantener formato normal

const header = source.slice(0, arrayStart);
const footer = source.slice(arrayEnd + 1);
const newSource = header + newArrayStr + footer;

// ── 7. Backup + escritura ────────────────────────────────────────────────────
const backupPath = filePath + '.bak';
fs.writeFileSync(backupPath, source, 'utf8');
console.log(`✅ Backup guardado en: ${backupPath}`);

fs.writeFileSync(filePath, newSource, 'utf8');
console.log(`✅ products-data.js actualizado con SKUs.`);

// ── 8. Resumen de duplicados de nombre (diagnóstico) ────────────────────────
const nameCount = {};
products.forEach(p => {
    nameCount[p.name] = (nameCount[p.name] || 0) + 1;
});
const duplicates = Object.entries(nameCount).filter(([, count]) => count > 1);
if (duplicates.length > 0) {
    console.log('\n⚠️  Productos con nombre duplicado (ahora diferenciados por SKU):');
    duplicates.forEach(([name, count]) => {
        const skus = products.filter(p => p.name === name).map(p => p.sku).join(', ');
        console.log(`   "${name}" (${count} veces) → SKUs: ${skus}`);
    });
}

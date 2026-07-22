/**
 * sync-products-to-rtdb.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Sincroniza los productos de products-data.js (archivo estático del frontend)
 * al nodo "products" de Firebase Realtime Database.
 *
 * La Cloud Function processCheckoutTotal lee precios desde RTDB para evitar
 * que el cliente pueda manipularlos. Si el nodo products/ está vacío,
 * la función devuelve un error 'failed-precondition'.
 *
 * INSTRUCCIONES:
 *   1. Asegúrate de tener serviceAccountKey.json en admin-scripts/
 *   2. Ejecuta: node admin-scripts/sync-products-to-rtdb.js
 *   3. Verifica en Firebase Console → Realtime Database → products/
 *
 * DESCARGA serviceAccountKey.json:
 *   Firebase Console → Configuración del proyecto → Cuentas de servicio
 *   → Generar nueva clave privada
 */

const admin = require('firebase-admin');
const path  = require('path');
const fs    = require('fs');

// ── Cargar Service Account ─────────────────────────────────────────────────
const keyPath = path.join(__dirname, 'serviceAccountKey.json');
if (!fs.existsSync(keyPath)) {
    console.error('❌ ERROR: No se encontró serviceAccountKey.json en admin-scripts/');
    console.error('   Descárgalo desde Firebase Console → Configuración → Cuentas de servicio');
    process.exit(1);
}

const serviceAccount = require(keyPath);

admin.initializeApp({
    credential:   admin.credential.cert(serviceAccount),
    databaseURL:  'https://camisetazo-puntos-default-rtdb.europe-west1.firebasedatabase.app/'
});

// ── Leer productos desde el archivo estático ────────────────────────────────
// products-data.js usa export default — lo parseamos manualmente
const productsPath = path.join(__dirname, '..', 'js', 'products-data.js');
if (!fs.existsSync(productsPath)) {
    console.error('❌ ERROR: No se encontró js/products-data.js');
    process.exit(1);
}

const productsRaw = fs.readFileSync(productsPath, 'utf8');

// Extraer el array de productos (compatible con ES module export default [...])
let products;
try {
    // Reemplazar export default por module.exports = para poder hacer require
    const cjsCode = productsRaw.replace(/export\s+default\s+/, 'module.exports = ');
    const tmpPath = path.join(__dirname, '_tmp_products.cjs');
    fs.writeFileSync(tmpPath, cjsCode);
    products = require(tmpPath);
    fs.unlinkSync(tmpPath);
} catch (err) {
    console.error('❌ ERROR al parsear products-data.js:', err.message);
    console.error('   Asegúrate de que el formato sea "export default [...]"');
    process.exit(1);
}

if (!Array.isArray(products)) {
    console.error('❌ ERROR: products-data.js no exporta un array');
    process.exit(1);
}

console.log(`✅ Leídos ${products.length} productos de products-data.js`);

// ── Construir el objeto para RTDB ────────────────────────────────────────────
// Clave: product.id
// Valor: campos necesarios para processCheckoutTotal (price, name, sku, image)
const rtdbProducts = {};
let skipped = 0;

for (const product of products) {
    if (!product.id) {
        console.warn(`⚠️  Producto sin ID ignorado:`, product.name || '(sin nombre)');
        skipped++;
        continue;
    }
    if (typeof product.price !== 'number' || product.price <= 0) {
        console.warn(`⚠️  Producto '${product.id}' ignorado: price inválido (${product.price})`);
        skipped++;
        continue;
    }

    rtdbProducts[product.id] = {
        price:     product.price,
        name:      product.name  || product.id,
        sku:       product.sku   || '',
        image:     product.image || '',
        category:  product.category || '',
        updatedAt: new Date().toISOString()
    };
}

const syncCount = Object.keys(rtdbProducts).length;
console.log(`📦 Sincronizando ${syncCount} productos al nodo RTDB 'products/'...`);
if (skipped > 0) {
    console.warn(`   ⚠️  ${skipped} productos omitidos (sin ID o precio inválido)`);
}

// ── Escribir en RTDB ─────────────────────────────────────────────────────────
const db = admin.database();

db.ref('products').set(rtdbProducts)
    .then(() => {
        console.log(`\n✅ ¡Sincronización completada!`);
        console.log(`   ${syncCount} productos escritos en RTDB products/`);
        console.log(`\nVerifica en: Firebase Console → Realtime Database → products/`);
        console.log(`\nAhora despliega las Cloud Functions y vuelve a intentar el pedido:`);
        console.log(`   firebase deploy --only functions`);
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Error al escribir en RTDB:', err.message);
        process.exit(1);
    });

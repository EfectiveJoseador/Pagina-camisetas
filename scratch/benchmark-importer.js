const path = require('path');
const { TeamMatcher, loadExistingProducts } = require('./admin-scripts/yupoo-importer.js');

console.time('Loading Products');
const products = loadExistingProducts();
console.timeEnd('Loading Products');
console.log(`Loaded ${products.length} products`);

console.time('Building Matcher');
const matcher = new TeamMatcher(products);
console.timeEnd('Building Matcher');

const nameToTest = 'Retro Deportivo Alaves 2000/01 UEFA Cup Away soccer size S-2XL';
console.time('Finding Match');
const match = matcher.findBestMatch(nameToTest, 0.6);
console.timeEnd('Finding Match');
console.log('Match:', match ? match.name : 'None');

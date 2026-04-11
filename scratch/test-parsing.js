
const { parseProductTitle } = require('../admin-scripts/yupoo-importer.js');

const titles = [
    " Retro Deportivo Alaves 1999/00 Home Soccer | album | National World Cup 2026 Jerseys | Supplier Product Catalog",
    "Real Madrid 24/25 Home Authentic Player Version",
    "FC Barcelona 1998/99 Retro Style Jersey",
    "Spain 2024 National Team Home Kids Kit"
];

titles.forEach(t => {
    const result = parseProductTitle(t);
    console.log('Title:', t);
    console.log('Result:', JSON.stringify(result, null, 2));
    console.log('-------------------');
});

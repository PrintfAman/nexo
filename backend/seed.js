import { getDB } from './db.js';
import fs from 'fs';


const run = async () => {
const db = await getDB();
const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'));
await db.exec('DELETE FROM products;');
const stmt = await db.prepare('INSERT INTO products (id,name,price,image,tags) VALUES (?,?,?,?,?)');
for (const p of products) await stmt.run(p.id, p.name, p.price, p.image, p.tags);
await stmt.finalize();
console.log('Seeded products:', products.length);
process.exit(0);
};
run();
import express from "express";
import { db } from "../db.js";

const router = express.Router();

// 🛍️ GET /api/products — Fetch all products
router.get("/", async (req, res) => {
  try {
    const products = await db.all("SELECT * FROM products");
    res.json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ error: "Failed to load products" });
  }
});

// 🛍️ GET /api/products/:id — Fetch single product
router.get("/:id", async (req, res) => {
  try {
    const product = await db.get("SELECT * FROM products WHERE id = ?", [req.params.id]);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    res.status(500).json({ error: "Failed to load product" });
  }
});

// 🔧 POST /api/products/add-sample — Add a sample product (dev helper)
router.post('/add-sample', async (req, res) => {
  try {
    const sample = req.body && Object.keys(req.body).length ? req.body : {
      name: 'Sample Tee',
      category: 'men',
      price: 499.0,
      image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500'
    };
    const result = await db.run(
      'INSERT INTO products (name, category, price, image) VALUES (?, ?, ?, ?)',
      [sample.name, sample.category, sample.price, sample.image]
    );
    const id = result.lastID || (await db.get('SELECT last_insert_rowid() as id')).id;
    const product = await db.get('SELECT * FROM products WHERE id = ?', [id]);
    res.json(product);
  } catch (err) {
    console.error('❌ Error adding sample product:', err);
    res.status(500).json({ error: 'Failed to add sample product' });
  }
});

export default router;

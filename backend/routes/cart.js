import express from "express";
import { db } from "../db.js";

const router = express.Router();

// 🛒 GET /api/cart — Fetch all cart items
router.get("/", async (req, res) => {
  try {
    const cartItems = await db.all(`
      SELECT 
        cart.id,
        cart.product_id,
        cart.quantity,
        products.name,
        products.price,
        products.category,
        products.image
      FROM cart
      JOIN products ON cart.product_id = products.id
    `);

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.json({ items: cartItems, total });
  } catch (error) {
    console.error("❌ Error fetching cart:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// 🛒 POST /api/cart — Add or update a product in the cart
router.post("/", async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) return res.status(400).json({ error: "Missing productId" });

    const product = await db.get("SELECT * FROM products WHERE id = ?", [productId]);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const existing = await db.get("SELECT * FROM cart WHERE product_id = ?", [productId]);
    if (existing) {
      await db.run("UPDATE cart SET quantity = quantity + ? WHERE product_id = ?", [quantity, productId]);
    } else {
      await db.run("INSERT INTO cart (product_id, quantity) VALUES (?, ?)", [productId, quantity]);
    }

    const cartItems = await db.all(`
      SELECT 
        cart.id,
        cart.product_id,
        cart.quantity,
        products.name,
        products.price,
        products.category,
        products.image
      FROM cart
      JOIN products ON cart.product_id = products.id
    `);

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.json({ items: cartItems, total });
  } catch (error) {
    console.error("❌ Error adding to cart:", error);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

// 🗑️ DELETE /api/cart/:id — Remove product from cart
router.delete("/:id", async (req, res) => {
  try {
    await db.run("DELETE FROM cart WHERE product_id = ?", [req.params.id]);

    const cartItems = await db.all(`
      SELECT 
        cart.id,
        cart.product_id,
        cart.quantity,
        products.name,
        products.price,
        products.category,
        products.image
      FROM cart
      JOIN products ON cart.product_id = products.id
    `);

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.json({ items: cartItems, total });
  } catch (error) {
    console.error("❌ Error removing from cart:", error);
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
});

// 🧹 DELETE /api/cart — Clear the entire cart
router.delete("/", async (req, res) => {
  try {
    await db.run("DELETE FROM cart");
    res.json({ items: [], total: 0 });
  } catch (error) {
    console.error("❌ Error clearing cart:", error);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

export default router; // ✅ THIS LINE IS CRUCIAL

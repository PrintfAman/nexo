import express from "express";
import { db } from "../db.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// 🧾 POST /api/checkout — Process order and generate receipt
router.post("/", async (req, res) => {
  try {
    const { cartItems, customerInfo } = req.body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty or invalid payload" });
    }

    if (!customerInfo?.name || !customerInfo?.email) {
      return res.status(400).json({ error: "Missing customer details" });
    }

    // Compute accurate total from DB
    let subtotal = 0;
    const validatedItems = [];

    for (const item of cartItems) {
      const product = await db.get("SELECT * FROM products WHERE id = ?", [item.product_id || item.productId]);
      if (!product) {
        throw new Error(`Invalid productId: ${item.product_id || item.productId}`);
      }

      const qty = Number(item.quantity || item.qty || 1);
      const lineTotal = product.price * qty;
      subtotal += lineTotal;

      validatedItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        qty,
        lineTotal
      });
    }

    // Add tax and shipping
    const tax = subtotal * 0.18;
    const shipping = subtotal > 999 ? 0 : 50;
    const total = subtotal + tax + shipping;

    // Generate order ID
    const orderId = `ORD-${uuidv4().substring(0, 8).toUpperCase()}`;
    const shippingAddress = `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state} - ${customerInfo.pincode}`;

    // Save order in database
    await db.run(
      `INSERT INTO orders (order_id, customer_name, customer_email, customer_phone, shipping_address, total, items)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        customerInfo.name,
        customerInfo.email,
        customerInfo.phone || "",
        shippingAddress,
        total,
        JSON.stringify(validatedItems)
      ]
    );

    // 🧾 Return receipt to frontend
    const receipt = {
      orderId,
      name: customerInfo.name,
      email: customerInfo.email,
      total,
      subtotal,
      tax,
      shipping,
      currency: "INR",
      items: validatedItems,
      timestamp: new Date().toISOString(),
      message: "✅ Order placed successfully!"
    };

    res.json(receipt);
  } catch (err) {
    console.error("❌ Checkout error:", err);
    res.status(500).json({ error: "Checkout failed" });
  }
});

export default router;

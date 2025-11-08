import express from 'express';
import cors from 'cors';
import { db } from "./db.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v4 as uuidv4 } from 'uuid';

// ✅ Import routes
import cartRoutes from "./routes/cart.js";
import recommendationsRoutes from "./routes/recs.js";
import productsRoutes from "./routes/products.js";
import checkoutRoutes from "./routes/checkout.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 4000;

// ✅ Middleware (must come BEFORE routes)
app.use(cors());
app.use(express.json());

// ✅ Use routes
app.use("/api/checkout", checkoutRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/recommendations", recommendationsRoutes);
app.use("/api/cart", cartRoutes);
// Initialize SQLite Database


// Create tables
// Create tables and seed database
// Create tables and seed database
async function initializeDatabase() {
  // Drop and recreate products table (to fix old schema)
  await db.exec(`
    DROP TABLE IF EXISTS products;
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      image TEXT NOT NULL,
      description TEXT,
      stock INTEGER DEFAULT 100
    )
  `);

  // Cart table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  // Orders table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT,
      shipping_address TEXT,
      total REAL NOT NULL,
      items TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Check if products exist
  const countRow = await db.get('SELECT COUNT(*) as count FROM products');
  if (!countRow || countRow.count === 0) {
    console.log("🪄 Seeding initial products...");
    await seedProducts();
  } else {
    console.log(`🧾 Products already exist in DB (${countRow.count})`);
  }
}

async function seedProducts() {
  // Use real product photos from Unsplash (source URLs) so the frontend shows realistic images.
  const products = [
    { name: 'Korean Pant', price: 2799.0, category: 'women', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=1000&fit=crop&q=80', description: 'Comfortable Korean style pants perfect for casual wear' },
    { name: 'Pinstripe Pyjama', price: 1250.0, category: 'women', image: 'https://images.unsplash.com/photo-1584299574144-b5f8ac209707?w=800&h=1000&fit=crop&q=80', description: 'Cozy pinstripe pyjama set for relaxed evenings' },
    { name: 'Formal Shirt', price: 2299.0, category: 'men', image: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=800&h=1000&fit=crop&q=80', description: 'Classic formal shirt for business occasions' },
    { name: 'Relaxed Hoodie', price: 1799.0, category: 'unisex', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop&q=80', description: 'Soft cozy hoodie for everyday comfort' },
    { name: 'Denim Jacket', price: 3499.0, category: 'men', image: 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=800&h=1000&fit=crop&q=80', description: 'Timeless denim jacket with modern fit' },
    { name: 'Floral Dress', price: 2999.0, category: 'women', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&h=1000&fit=crop&q=80', description: 'Lightweight floral dress for sunny days' },
    { name: 'Sneaker Run', price: 3999.0, category: 'footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop&q=80', description: 'Comfortable sneakers with great support' },
    { name: 'Leather Belt', price: 799.0, category: 'accessories', image: 'https://images.unsplash.com/photo-1553981834-a23f5b69e3ec?w=800&h=1000&fit=crop&q=80', description: 'Genuine leather belt' },
    { name: 'Baseball Cap', price: 599.0, category: 'accessories', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=1000&fit=crop&q=80', description: 'Stylish cap for daily use' },
    { name: 'Cargo Shorts', price: 1599.0, category: 'men', image: 'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=800&h=1000&fit=crop&q=80', description: 'Casual cargo shorts with pockets' },
  { name: 'Silk Scarf', price: 1299.0, category: 'women', image: 'https://images.unsplash.com/photo-1674768015404-7aabcf6e9066?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764', description: 'Elegant silk scarf to elevate outfits' },
  { name: 'Running Shorts', price: 999.0, category: 'unisex', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170', description: 'Breathable shorts for workouts' }
  ];

  const insertQuery = `
    INSERT INTO products (name, price, category, image, description, stock)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  for (const p of products) {
    await db.run(insertQuery, [p.name, p.price, p.category, p.image, p.description, 100]);
  }

  console.log("✅ Database seeded with products");
}

// Initialize database
initializeDatabase();


// API Routes

// GET /api/products - Get all products
app.get('/api/products', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products').all();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id - Get single product
app.get('/api/products/:id', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST /api/cart - Add item to cart
app.post('/api/cart', (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ error: 'Product ID and quantity are required' });
    }

    // Check if product exists
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if item already in cart
    const existingItem = db.prepare('SELECT * FROM cart WHERE product_id = ?').get(productId);

    if (existingItem) {
      // Update quantity
      db.prepare('UPDATE cart SET quantity = ? WHERE product_id = ?').run(quantity, productId);
    } else {
      // Insert new item
      db.prepare('INSERT INTO cart (product_id, quantity) VALUES (?, ?)').run(productId, quantity);
    }

    res.json({ message: 'Item added to cart successfully' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// GET /api/cart - Get cart items
app.get('/api/cart', (req, res) => {
  try {
    const cartItems = db.prepare(`
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
    `).all();

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({
      items: cartItems,
      total: total
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// DELETE /api/cart/:id - Remove item from cart
app.delete('/api/cart/:productId', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM cart WHERE product_id = ?').run(req.params.productId);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    res.json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// POST /api/checkout - Process checkout
app.post('/api/checkout', (req, res) => {
  try {
    const { cartItems, customerInfo } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    if (!customerInfo || !customerInfo.name || !customerInfo.email) {
      return res.status(400).json({ error: 'Customer information is required' });
    }

    // Calculate total
    const total = cartItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    const tax = total * 0.18;
    const shipping = total > 999 ? 0 : 50;
    const grandTotal = total + tax + shipping;

    // Generate order ID
    const orderId = `ORD-${uuidv4().substring(0, 8).toUpperCase()}`;

    // Save order to database
    const insertOrder = db.prepare(`
      INSERT INTO orders (order_id, customer_name, customer_email, customer_phone, shipping_address, total, items)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const shippingAddress = `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state} - ${customerInfo.pincode}`;
    
    insertOrder.run(
      orderId,
      customerInfo.name,
      customerInfo.email,
      customerInfo.phone || '',
      shippingAddress,
      grandTotal,
      JSON.stringify(cartItems)
    );

    // Return receipt
    res.json({
      orderId: orderId,
      total: grandTotal,
      subtotal: total,
      tax: tax,
      shipping: shipping,
      items: cartItems,
      customerInfo: customerInfo,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error processing checkout:', error);
    res.status(500).json({ error: 'Failed to process checkout' });
  }
});

// GET /api/orders - Get all orders
app.get('/api/orders', (req, res) => {
  try {
    const orders = db.prepare('SELECT * FROM orders ORDER BY timestamp DESC').all();
    
    // Parse items JSON
    const ordersWithParsedItems = orders.map(order => ({
      ...order,
      items: JSON.parse(order.items)
    }));

    res.json(ordersWithParsedItems);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:orderId - Get specific order
app.get('/api/orders/:orderId', (req, res) => {
  try {
    const order = db.prepare('SELECT * FROM orders WHERE order_id = ?').get(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.items = JSON.parse(order.items);
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Nexora Fashion API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Nexora Fashion Backend API running on http://localhost:${PORT}`);
  console.log(`📊 Database: nexora.db`);
  console.log(`✨ Ready to serve amazing fashion!`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close();
  console.log('\n👋 Database connection closed');
  process.exit(0);
});



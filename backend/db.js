import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Open or create the Nexora database
const db = await open({
  filename: "./nexora.db",
  driver: sqlite3.Database,
});

// Create tables if they don’t exist
await db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    category TEXT,
    price REAL,
    image TEXT
  );

  CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    quantity INTEGER,
    FOREIGN KEY(product_id) REFERENCES products(id)
  );
`);

export { db };

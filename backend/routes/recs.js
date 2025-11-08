import express from "express";
import { db } from "../db.js";

const router = express.Router();

/**
 * GET /api/recommendations?mood=casual
 * Returns 3–5 recommended products based on a mood or category keyword
 */
router.get("/", async (req, res) => {
  try {
    const mood = (req.query.mood || "").toLowerCase();

    // Fetch all products from DB
    const products = await db.all("SELECT * FROM products");

    // Filter based on mood/category/description
    const recs = products.filter((p) =>
      [p.name, p.category, p.description].some((field) =>
        field.toLowerCase().includes(mood)
      )
    );

    // Return top matches or fallback random 5
    const results =
      recs.length > 0
        ? recs.slice(0, 5)
        : products.sort(() => 0.5 - Math.random()).slice(0, 5);

    res.json({
      mood: mood || "default",
      count: results.length,
      recommendations: results,
    });
  } catch (error) {
    console.error("❌ AI Recommendations Error:", error);
    res.status(500).json({ error: "Failed to load recommendations" });
  }
});

export default router;

// ✅ Centralized API base resolver for both dev & production
export function getApiBase() {
  try {
    if (
      typeof import.meta !== "undefined" &&
      import.meta.env &&
      import.meta.env.VITE_API_URL
    ) {
      return import.meta.env.VITE_API_URL.replace(/\/$/, ""); // remove trailing slash
    }
  } catch (err) {
    console.warn("⚠️ Unable to read VITE_API_URL:", err);
  }

  // Default fallback for local dev
  return "http://localhost:4000/api";
}

const API = getApiBase();

// Utility to handle responses safely
async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    console.error(`❌ API Error (${res.status}):`, text);
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res.json();
}

// ✅ Fetch all products
export async function fetchProducts() {
  console.log("🛍️ Fetching products from", `${API}/products`);
  const res = await fetch(`${API}/products`);
  return handleResponse(res);
}

// ✅ Fetch recommendations by mood
export async function fetchRecs(mood) {
  console.log("🧠 Fetching recs for mood:", mood);
  const res = await fetch(`${API}/recs?mood=${encodeURIComponent(mood)}`);
  return handleResponse(res);
}

// ✅ Get all cart items
export async function getCart() {
  console.log("🛒 Fetching cart...");
  const res = await fetch(`${API}/cart`);
  return handleResponse(res);
}

// ✅ Add product to cart
export async function addToCart(productId, qty = 1) {
  console.log(`➕ Adding product ${productId} (x${qty}) to cart`);
  const res = await fetch(`${API}/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, qty }),
  });
  return handleResponse(res);
}

// ✅ Remove product from cart
export async function removeFromCart(id) {
  console.log(`❌ Removing item ${id} from cart`);
  const res = await fetch(`${API}/cart/${id}`, { method: "DELETE" });
  return handleResponse(res);
}

// ✅ Mock Checkout (creates receipt)
export async function checkout(payload) {
  console.log("💳 Processing checkout with payload:", payload);
  const res = await fetch(`${API}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

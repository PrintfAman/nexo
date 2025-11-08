import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/cart");
      setCart(res.data.items || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("❌ Error fetching cart:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    try {
      await axios.post("http://localhost:4000/api/cart", { productId, quantity });
      fetchCart();
    } catch (err) {
      console.error("❌ Error adding to cart:", err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:4000/api/cart/${productId}`);
      fetchCart();
    } catch (err) {
      console.error("❌ Error removing from cart:", err);
    }
  };

  const clear = async () => {
    try {
      // call backend endpoint to clear cart in one request
      await axios.delete("http://localhost:4000/api/cart");
      fetchCart();
    } catch (err) {
      console.error("❌ Error clearing cart:", err);
    }
  };

  return (
    <CartContext.Provider value={{ cart, total, addToCart, removeFromCart, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside a CartProvider");
  }
  return context;
}

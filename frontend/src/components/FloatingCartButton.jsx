import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react"; // if lucide-react already installed
import { useCart } from "../context/CartContext";

export default function FloatingCartButton() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const count = cart.reduce((n, i) => n + i.qty, 0);

  return (
    <button
      onClick={() => navigate("/cart")}
      className="
        fixed bottom-6 right-6 z-50
        bg-orange-500 hover:bg-orange-600
        text-white rounded-full shadow-lg
        w-14 h-14 flex items-center justify-center relative
        transition-transform hover:scale-105
      "
      title="View Cart"
    >
      <ShoppingBag size={26} />
      {count > 0 && (
        <span
          className="
            absolute -top-1 -right-1
            text-xs font-semibold
            bg-white text-orange-600
            w-5 h-5 rounded-full flex items-center justify-center
            border border-orange-600
          "
        >
          {count}
        </span>
      )}
    </button>
  );
}

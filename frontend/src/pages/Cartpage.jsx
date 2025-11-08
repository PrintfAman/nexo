import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowRight, Trash2 } from "lucide-react";


export default function CartPage({ setPage }) {
  const { cart, total, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (!cart || cart.length === 0) {
  return (
    <div className="cart-page min-h-screen flex flex-col items-center justify-center bg-black text-white text-center px-6">
      <div className="p-8 rounded-3xl bg-gradient-to-b from-zinc-900/60 to-black border border-zinc-800 shadow-xl shadow-orange-500/10 backdrop-blur-md">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
            <ShoppingBag size={40} className="text-orange-500" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-wide mb-2">
            Your Cart is Empty 🛍️
          </h1>
          <p className="text-gray-400 mb-8 max-w-md">
            Looks like you haven’t added anything to your cart yet.  
            Explore our latest arrivals and exclusive offers today.
          </p>

          <button
            onClick={() => (setPage ? setPage('home') : navigate("/"))}
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 font-medium text-lg shadow-md shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Shopping
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
        </div>
      </div>
    </div>
  );
}

  return (
  <div className="cart-page min-h-screen bg-black text-white py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
          Your Shopping Cart
        </h1>

        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item.product_id}
              className="flex items-center justify-between bg-zinc-900/70 border border-zinc-800 p-4 rounded-2xl hover:border-orange-500/50 transition-all duration-300 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div>
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-gray-400">₹{item.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-gray-300 text-sm">
                  Qty: {item.quantity}
                </span>
                <button
                  onClick={() => removeFromCart(item.product_id)}
                  className="text-red-400 hover:text-red-600 transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-12 border-t border-zinc-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div>
            <p className="text-lg text-gray-400">Subtotal</p>
            <h3 className="text-3xl font-semibold text-orange-400">₹{total}</h3>
          </div>

          <button
            onClick={() => (setPage ? setPage('checkout') : navigate("/checkout"))}
            disabled={!cart || cart.length === 0}
            className="mt-6 md:mt-0 flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-300 text-white px-8 py-3 rounded-full font-medium text-lg shadow-lg shadow-orange-500/20"
          >
            Proceed to Checkout
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
    
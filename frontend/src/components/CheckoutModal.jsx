import React, { useState } from "react";
import { checkout } from "../api";
import { useCart } from "../context/CartContext";

export default function CheckoutModal({ open, onClose, onReceipt }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { cart, refresh } = useCart();

  if (!open) return null;

  const pay = async () => {
    if (!name || !email) {
      alert("Please fill in your name and email.");
      return;
    }

    const payload = {
      name,
      email,
      cartItems: cart.items.map((i) => ({
        productId: i.product.id,
        qty: i.qty,
      })),
    };

    try {
      const receipt = await checkout(payload);
      await refresh();
      onReceipt(receipt);
    } catch (err) {
      alert("Checkout failed!");
      console.error(err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Checkout</h2>
        <input
          className="w-full mb-3 p-2 border rounded dark:bg-gray-700 dark:text-white"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:text-white"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={pay}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Pay (Mock)
          </button>
        </div>
      </div>
    </div>
  );
}

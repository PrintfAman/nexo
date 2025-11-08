import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { checkout } from "../api";

const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n || 0);

export default function CheckoutPage({ showNotification }) {
  const { cart, total, clear } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const hasItems = Array.isArray(cart) && cart.length > 0;

  const handleCheckout = async () => {
    if (!hasItems) {
      if (showNotification) showNotification('Your cart is empty.', 'error');
      else alert('Your cart is empty.');
      return;
    }
    if (!name || !email) {
      if (showNotification) showNotification('Please fill in your name and email.', 'error');
      else alert('Please fill in your name and email.');
      return;
    }

    setLoading(true);
    try {
      // Build payload matching backend expectations
      const cartItems = cart.map((i) => ({
        productId: i.product_id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      }));

      const payload = {
        cartItems,
        customerInfo: {
          name,
          email,
        },
      };

      const res = await checkout(payload);
      setReceipt({
        ...res,
        total: res.total || total, // ensure total always shown correctly
      });
  clear();
  // show app-level toast if available, fallback to alert
  if (showNotification) showNotification('Payment successful — thank you!', 'success');
  else alert('Payment successful — thank you! Your receipt is shown.');
    } catch (e) {
      console.error(e);
      alert("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Success state UI
  if (receipt) {
    return (
      <div
        className="
          max-w-md mx-auto mt-16 p-6 text-center
          bg-white dark:bg-gray-900
          text-gray-900 dark:text-gray-100
          rounded-2xl shadow 
          border border-gray-200 dark:border-gray-700
          transition-colors
        "
      >
        <h2 className="text-2xl font-bold text-green-600 mb-2">✅ Payment Successful</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Thanks, {receipt.name || name}. We emailed your receipt to{" "}
          {receipt.email || email}.
        </p>

        <div
          className="
            space-y-2 text-left p-4 rounded-xl
            bg-gray-50 dark:bg-gray-800
            border border-gray-200 dark:border-gray-700
            transition-colors
          "
        >
          <p>
            <span className="font-semibold">Order ID:</span> {receipt.id || "NEX-" + Date.now()}
          </p>
          <p>
            <span className="font-semibold">Total Paid:</span> {formatINR(receipt.total)}
          </p>
          <p>
            <span className="font-semibold">Time:</span>{" "}
            {new Date(receipt.timestamp || Date.now()).toLocaleString()}
          </p>
        </div>

        <a
          href="/"
          className="inline-block mt-6 px-5 py-2 rounded-lg
                     bg-orange-500 text-white hover:bg-orange-600 transition"
        >
          Continue Shopping
        </a>
      </div>
    );
  }

  // Checkout layout that uses the app-level CSS classes to match Cart page
  return (
    <div className="checkout-page">
      <div className="max-w-5xl mx-auto checkout-layout">
        <div className="checkout-form">
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>

          <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
          {!hasItems ? (
            <p className="text-gray-600 dark:text-gray-300">Your cart is empty.</p>
          ) : (
            <div className="summary-items mb-4">
              {cart.map((item) => (
                <div key={item.product_id} className="summary-item">
                  <img src={item.image} alt={item.name} />
                  <div className="summary-item-info">
                    <p className="font-medium">{item.name}</p>
                    <p className="summary-item-qty">{item.quantity} × {formatINR(item.price)}</p>
                  </div>
                  <div className="summary-item-price">{formatINR(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>
          )}

          {/* Form fields */}
          <div className="form-section">
            <div className="form-group">
              <label>Full Name</label>
              <input
                className="w-full"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="w-full"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>
        </div>

        <aside className="checkout-summary">
          <h2>Summary</h2>
          <div className="summary-items">
            {cart.map((item) => (
              <div key={item.product_id} className="summary-item">
                <img src={item.image} alt={item.name} />
                <div className="summary-item-info">
                  <p className="font-medium">{item.name}</p>
                  <p className="summary-item-qty">{item.quantity} × {formatINR(item.price)}</p>
                </div>
                <div className="summary-item-price">{formatINR(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatINR(total)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (18%)</span>
              <span>{formatINR(total * 0.18)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{formatINR(total > 999 ? 0 : 50)}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>{formatINR(total + total * 0.18 + (total > 999 ? 0 : 50))}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={!hasItems || loading}
              className="place-order-btn"
            >
              {loading ? 'Processing...' : 'Pay'}
            </button>
            <button onClick={() => window.location.href = '/'} className="continue-shopping-btn">Continue shopping</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

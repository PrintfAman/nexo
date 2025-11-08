import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ import this
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import "./index.css"; // ✅ make sure global styles are loaded

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter> {/* ✅ Wrap everything in Router */}
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);

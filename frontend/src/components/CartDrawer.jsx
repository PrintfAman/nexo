import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

<button
  onClick={() => {
    if (cart.items.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/checkout");
  }}
  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
>
  Checkout
</button>

import React from "react";

export default function ProductCard({ p, onAdd }) {
  // Resolve image paths:
  // - Absolute URLs (http/https) -> use as-is
  // - Leading slash paths ("/images/...") -> public assets served by the frontend, use as-is
  // - Relative paths ("images/...") -> normalize to "/images/..."
  let imgSrc = '';
  if (p.image) {
    if (p.image.startsWith('http') || p.image.startsWith('https')) {
      imgSrc = p.image;
    } else if (p.image.startsWith('/')) {
      imgSrc = p.image; // served from frontend `public/`
    } else {
      imgSrc = '/' + p.image.replace(/^\/+/, '');
    }
  }

  return (
    <div className="bg-white/3 border border-gray-700 rounded-lg overflow-hidden hover:shadow transition-colors duration-200">
      <img src={imgSrc} alt={p.name} className="w-full aspect-[4/5] object-cover" />
      <div className="p-3 flex flex-col gap-1">
        <h3 className="font-medium text-sm truncate">{p.name}</h3>
        <p className="text-xs text-gray-400">₹{p.price}</p>
        <button
          onClick={() => onAdd(p)}
          className="mt-2 w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-1 rounded-md text-sm transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

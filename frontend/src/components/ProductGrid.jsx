import React from 'react'
import ProductCard from './ProductCard'

export default function ProductGrid({ products, onAdd }) {
  return (
    <div className="grid grid-4">
      {products.map(p => <ProductCard key={p.id} p={p} onAdd={onAdd} />)}
    </div>
  )
}

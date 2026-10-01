import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import ProductImage from './ProductImage'
import { categoryName, formatPrice } from '../utils/catalog'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  const outOfStock = product.stock !== undefined && product.stock !== null && Number(product.stock) <= 0
  const category = categoryName(product)

  const handleAdd = (e) => {
    e.preventDefault()
    if (outOfStock) return
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <Link to={`/products/${product.id}`} className="group flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
        <ProductImage
          src={product.image}
          alt={product.name}
          className="h-full w-full object-top transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {outOfStock && (
          <span className="absolute left-0 top-3 bg-black px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
            Sold out
          </span>
        )}

        {!outOfStock && (
          <button
            onClick={handleAdd}
            className={`absolute inset-x-0 bottom-0 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] transition-all duration-300 sm:translate-y-full sm:group-hover:translate-y-0 ${
              added ? 'bg-brand-gold text-black sm:translate-y-0' : 'bg-black/85 text-white hover:bg-black'
            }`}
          >
            {added ? 'Added ✓' : 'Add to cart'}
          </button>
        )}
      </div>

      <div className="mt-4 text-left">
        {category && <p className="text-[10px] uppercase tracking-widest text-gray-400">{category}</p>}
        <h3 className="mt-0.5 line-clamp-1 text-xs font-normal text-gray-700 transition-colors group-hover:text-black">
          {product.name}
        </h3>
        <p className="mt-1 text-xs font-bold text-black">{formatPrice(product.price)}</p>
      </div>
    </Link>
  )
}

export function ProductCardSkeleton() {
  return (
    <div>
      <div className="aspect-[3/4] animate-pulse bg-stone-100" />
      <div className="mt-4 space-y-2">
        <div className="h-3 w-3/4 animate-pulse bg-stone-100" />
        <div className="h-3 w-1/4 animate-pulse bg-stone-100" />
      </div>
    </div>
  )
}

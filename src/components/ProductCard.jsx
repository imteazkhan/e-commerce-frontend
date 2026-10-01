import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  return (
    <div className="border border-gray-200 rounded p-4 bg-white">
      <img
        src={product.image || 'https://via.placeholder.com/300'}
        alt={product.name}
        className="w-full h-48 object-cover rounded"
      />
      <h3 className="mt-3 font-semibold text-gray-900">{product.name}</h3>
      <p className="text-primary font-bold mt-1">৳ {product.price}</p>
      <div className="mt-3 flex gap-2">
        <Link
          to={`/products/${product.id}`}
          className="flex-1 text-center border border-gray-300 py-1 rounded text-sm"
        >
          View
        </Link>
        <button
          onClick={() => addToCart(product)}
          className="flex-1 bg-primary text-white py-1 rounded text-sm"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}
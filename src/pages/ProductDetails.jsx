import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'
import { useCart } from '../context/CartContext'

export default function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const { addToCart } = useCart()

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data.data || res.data))
  }, [id])

  if (!product) return <div className="p-8">Loading...</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
      <img
        src={product.image || 'https://via.placeholder.com/500'}
        alt={product.name}
        className="w-full rounded border border-gray-200"
      />
      <div>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-primary text-xl font-bold mt-2">৳ {product.price}</p>
        <p className="text-secondary mt-4">{product.description}</p>
        <button
          onClick={() => addToCart(product)}
          className="mt-6 bg-primary text-white px-6 py-2 rounded"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}
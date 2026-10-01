import { useEffect, useState } from 'react'
import api from '../services/api'
import ProductCard from '../components/ProductCard'

export default function Products() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    api.get('/products').then((res) => setProducts(res.data.data || res.data))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}
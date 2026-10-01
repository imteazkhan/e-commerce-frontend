import { useEffect, useState } from 'react'
import api from '../../services/api'

export default function ManageStock() {
  const [products, setProducts] = useState([])

  const load = () => api.get('/products').then((res) => setProducts(res.data.data || res.data))
  useEffect(() => { load() }, [])

  const updateStock = async (id, stock) => {
    await api.put(`/products/${id}`, { stock })
    load()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Stock</h1>
      <table className="w-full border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-2 border-b">Product</th>
            <th className="text-left p-2 border-b">Stock</th>
            <th className="text-left p-2 border-b">Update</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="p-2 border-b">{p.name}</td>
              <td className="p-2 border-b">{p.stock}</td>
              <td className="p-2 border-b">
                <input
                  type="number"
                  defaultValue={p.stock}
                  onBlur={(e) => updateStock(p.id, e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 w-24"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
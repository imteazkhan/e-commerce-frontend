import { useEffect, useState } from 'react'
import api from '../../services/api'

export default function ManageProducts() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ name: '', price: '', description: '', image: '', stock: '' })
  const [editing, setEditing] = useState(null)

  const load = () => api.get('/products').then((res) => setProducts(res.data.data || res.data))

  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) {
      await api.put(`/products/${editing}`, form)
    } else {
      await api.post('/products', form)
    }
    setForm({ name: '', price: '', description: '', image: '', stock: '' })
    setEditing(null)
    load()
  }

  const handleEdit = (p) => {
    setEditing(p.id)
    setForm({
      name: p.name, price: p.price, description: p.description || '',
      image: p.image || '', stock: p.stock || ''
    })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    await api.delete(`/products/${id}`)
    load()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 border border-gray-200 rounded p-4">
        <input placeholder="Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2" required />
        <input placeholder="Price" type="number" value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2" required />
        <input placeholder="Stock" type="number" value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2" />
        <input placeholder="Image URL" value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2" />
        <textarea placeholder="Description" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border border-gray-300 rounded px-3 py-2 md:col-span-2" />
        <button className="bg-primary text-white py-2 rounded md:col-span-2">
          {editing ? 'Update Product' : 'Add Product'}
        </button>
      </form>

      <table className="w-full border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-2 border-b">Name</th>
            <th className="text-left p-2 border-b">Price</th>
            <th className="text-left p-2 border-b">Stock</th>
            <th className="text-left p-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="p-2 border-b">{p.name}</td>
              <td className="p-2 border-b">৳ {p.price}</td>
              <td className="p-2 border-b">{p.stock}</td>
              <td className="p-2 border-b space-x-2">
                <button onClick={() => handleEdit(p)} className="border border-gray-300 px-3 py-1 rounded text-sm">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="border border-gray-300 px-3 py-1 rounded text-sm">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
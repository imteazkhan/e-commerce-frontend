import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import api from '../services/api'

export default function Checkout() {
  const { cart, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    payment_method: 'cod',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/orders', {
        ...form,
        items: cart.map((i) => ({ product_id: i.id, qty: i.qty, price: i.price })),
        total,
      })
      clearCart()
      alert('Order placed successfully')
      navigate('/my-orders')
    } catch (err) {
      alert('Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
        <textarea
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
        <select
          value={form.payment_method}
          onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="cod">Cash on Delivery</option>
          <option value="bkash">bKash</option>
          <option value="card">Card</option>
        </select>
        <p className="text-lg font-bold">Total: ৳ {total}</p>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 rounded"
        >
          {loading ? 'Placing...' : 'Place Order'}
        </button>
      </form>
    </div>
  )
}
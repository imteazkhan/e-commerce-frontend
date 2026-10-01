import { useEffect, useState } from 'react'
import api from '../../services/api'

export default function ManageOrders() {
  const [orders, setOrders] = useState([])

  const load = () => api.get('/admin/orders').then((res) => setOrders(res.data.data || res.data))
  useEffect(() => { load() }, [])

  const updateStatus = async (id, status) => {
    await api.put(`/admin/orders/${id}`, { status })
    load()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>
      <table className="w-full border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-2 border-b">Order ID</th>
            <th className="text-left p-2 border-b">Customer</th>
            <th className="text-left p-2 border-b">Total</th>
            <th className="text-left p-2 border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td className="p-2 border-b">#{o.id}</td>
              <td className="p-2 border-b">{o.name}</td>
              <td className="p-2 border-b">৳ {o.total}</td>
              <td className="p-2 border-b">
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o.id, e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
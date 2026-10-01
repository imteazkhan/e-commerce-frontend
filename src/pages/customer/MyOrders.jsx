import { useEffect, useState } from 'react'
import api from '../../services/api'

export default function MyOrders() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    api.get('/my-orders').then((res) => setOrders(res.data.data || res.data))
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-secondary">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="border border-gray-200 rounded p-4">
              <div className="flex justify-between">
                <h3 className="font-semibold">Order #{o.id}</h3>
                <span className="text-sm text-secondary">{o.status}</span>
              </div>
              <p className="text-secondary text-sm mt-1">Total: ৳ {o.total}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
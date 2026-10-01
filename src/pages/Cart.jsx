import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { cart, removeFromCart, updateQty, total } = useCart()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      {cart.length === 0 ? (
        <p className="text-secondary">Cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border border-gray-200 rounded p-3"
              >
                <img
                  src={item.image || 'https://via.placeholder.com/80'}
                  className="w-20 h-20 object-cover rounded"
                  alt={item.name}
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-primary">৳ {item.price}</p>
                </div>
                <input
                  type="number"
                  min="1"
                  value={item.qty}
                  onChange={(e) => updateQty(item.id, e.target.value)}
                  className="w-16 border border-gray-300 rounded px-2 py-1"
                />
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="border border-gray-300 px-3 py-1 rounded text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-gray-200 pt-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Total: ৳ {total}</h2>
            <Link
              to="/checkout"
              className="bg-primary text-white px-6 py-2 rounded"
            >
              Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
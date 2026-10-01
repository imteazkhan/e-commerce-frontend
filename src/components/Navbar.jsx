import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cart } = useCart()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary">
          ShopBD
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/products" className="text-secondary hover:text-primary">
            Products
          </Link>
          <Link to="/cart" className="text-secondary hover:text-primary">
            Cart ({cart.length})
          </Link>

          {!user && (
            <>
              <Link to="/login" className="text-secondary hover:text-primary">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary text-white px-3 py-1 rounded"
              >
                Register
              </Link>
            </>
          )}

          {user && user.role === 'customer' && (
            <>
              <Link to="/my-orders" className="text-secondary hover:text-primary">
                My Orders
              </Link>
              <Link to="/profile" className="text-secondary hover:text-primary">
                Profile
              </Link>
            </>
          )}

          {user && user.role === 'admin' && (
            <Link to="/admin" className="text-secondary hover:text-primary">
              Admin Panel
            </Link>
          )}

          {user && user.role === 'manager' && (
            <Link to="/manager" className="text-secondary hover:text-primary">
              Manager Panel
            </Link>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="border border-gray-300 px-3 py-1 rounded text-secondary"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
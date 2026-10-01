import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/admin/products" className="border border-gray-200 rounded p-6 hover:border-primary">
          <h2 className="font-semibold">Manage Products</h2>
          <p className="text-secondary text-sm mt-1">Add, edit, delete products</p>
        </Link>
        <Link to="/admin/orders" className="border border-gray-200 rounded p-6 hover:border-primary">
          <h2 className="font-semibold">Manage Orders</h2>
          <p className="text-secondary text-sm mt-1">View and update orders</p>
        </Link>
        <Link to="/admin/users" className="border border-gray-200 rounded p-6 hover:border-primary">
          <h2 className="font-semibold">Manage Users</h2>
          <p className="text-secondary text-sm mt-1">Users and roles</p>
        </Link>
      </div>
    </div>
  )
}
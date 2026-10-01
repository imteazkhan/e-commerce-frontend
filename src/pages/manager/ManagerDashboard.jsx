import { Link } from 'react-router-dom'

export default function ManagerDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>
      <Link to="/manager/stock" className="border border-gray-200 rounded p-6 inline-block hover:border-primary">
        <h2 className="font-semibold">Manage Stock</h2>
        <p className="text-secondary text-sm mt-1">Update product stock</p>
      </Link>
    </div>
  )
}
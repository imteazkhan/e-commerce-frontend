import { useAuth } from '../../context/AuthContext'

export default function Profile() {
  const { user } = useAuth()

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="border border-gray-200 rounded p-4 space-y-2">
        <p><span className="text-secondary">Name:</span> {user?.name}</p>
        <p><span className="text-secondary">Email:</span> {user?.email}</p>
        <p><span className="text-secondary">Role:</span> {user?.role}</p>
      </div>
    </div>
  )
}
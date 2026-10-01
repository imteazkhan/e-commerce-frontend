import { useEffect, useState } from 'react'
import api from '../../services/api'

export default function ManageUsers() {
  const [users, setUsers] = useState([])

  const load = () => api.get('/admin/users').then((res) => setUsers(res.data.data || res.data))
  useEffect(() => { load() }, [])

  const changeRole = async (id, role) => {
    await api.put(`/admin/users/${id}`, { role })
    load()
  }

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return
    await api.delete(`/admin/users/${id}`)
    load()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <table className="w-full border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-2 border-b">Name</th>
            <th className="text-left p-2 border-b">Email</th>
            <th className="text-left p-2 border-b">Role</th>
            <th className="text-left p-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="p-2 border-b">{u.name}</td>
              <td className="p-2 border-b">{u.email}</td>
              <td className="p-2 border-b">
                <select
                  value={u.role}
                  onChange={(e) => changeRole(u.id, e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  <option value="customer">Customer</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="p-2 border-b">
                <button onClick={() => deleteUser(u.id)} className="border border-gray-300 px-3 py-1 rounded text-sm">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { PlusIcon, TrashIcon } from '../../components/Icons'
import {
  Badge, Card, Drawer, EmptyState, Field, Modal, PageHeader, SearchBox, StatusBadge, TablePager, Tabs,
  btn, errorMessage, formatDate, inputClass, money, pageMeta, useDebounced, useToast,
} from '../../components/admin/ui'

const ROLES = [
  { value: 'customer', label: 'Customer', tone: 'stone' },
  { value: 'manager', label: 'Manager', tone: 'blue' },
  { value: 'admin', label: 'Admin', tone: 'gold' },
]

const emptyForm = { name: '', email: '', password: '', role: 'manager' }

const RoleBadge = ({ role }) => {
  const r = ROLES.find((x) => x.value === role) || { label: role, tone: 'stone' }
  return <Badge tone={r.tone}>{r.label}</Badge>
}

function UserDrawer({ userId, me, onClose, onChange }) {
  const notify = useToast()
  const [user, setUser] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!userId) return
    setUser(null)
    api.get(`/admin/users/${userId}`).then((res) => {
      setUser(res.data)
      setForm({ name: res.data.name, email: res.data.email, password: '' })
    })
  }, [userId])

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put(`/admin/users/${user.id}`, form)
      notify('User updated')
      setForm((f) => ({ ...f, password: '' }))
      onChange()
    } catch (err) {
      notify(errorMessage(err), 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Drawer open={Boolean(userId)} onClose={onClose} title={user?.name || 'User'}>
      {!user ? (
        <div className="space-y-3 p-5">{[0, 1].map((i) => <div key={i} className="h-24 animate-pulse rounded bg-stone-100" />)}</div>
      ) : (
        <div className="divide-y divide-stone-100">
          <section className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-900 text-lg font-semibold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-stone-900">{user.name}</p>
                <p className="text-sm text-stone-500">{user.email}</p>
              </div>
              <div className="ml-auto"><RoleBadge role={user.role} /></div>
            </div>
            <dl className="mt-5 grid grid-cols-3 gap-3 text-center">
              {[
                ['Orders', user.orders_count],
                ['Total spent', money(user.total_spent)],
                ['Joined', formatDate(user.created_at)],
              ].map(([k, v]) => (
                <div key={k} className="rounded-md bg-stone-50 p-3">
                  <dt className="text-xs text-stone-500">{k}</dt>
                  <dd className="mt-1 text-sm font-semibold text-stone-900">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="p-5">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Order history</h3>
            {user.orders.length === 0 ? (
              <p className="text-sm text-stone-500">No orders yet.</p>
            ) : (
              <ul className="divide-y divide-stone-100 rounded-md border border-stone-200">
                {user.orders.map((o) => (
                  <li key={o.id}>
                    <Link to={`/admin/orders?open=${o.id}`} className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm hover:bg-stone-50">
                      <span>
                        <b className="font-medium text-stone-900">#{o.id}</b>
                        <span className="ml-2 text-stone-500">{formatDate(o.created_at)} · {o.items_count} items</span>
                      </span>
                      <span className="flex items-center gap-3">
                        <span className="tabular-nums">{money(o.total)}</span>
                        <StatusBadge status={o.status} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <form onSubmit={save} className="space-y-4 p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">Account details</h3>
            <Field label="Name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} required /></Field>
            <Field label="Email"><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} required /></Field>
            <Field label="New password" hint={user.id === me?.id ? 'Leave blank to keep your current password' : 'Leave blank to keep the current password'}>
              <input type="password" minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputClass} autoComplete="new-password" />
            </Field>
            <button disabled={saving} className={btn.primary}>{saving ? 'Saving…' : 'Save changes'}</button>
          </form>
        </div>
      )}
    </Drawer>
  )
}

export default function ManageUsers() {
  const { user: me } = useAuth()
  const notify = useToast()
  const [users, setUsers] = useState([])
  const [counts, setCounts] = useState({})
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [openId, setOpenId] = useState(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const debouncedSearch = useDebounced(search)

  const load = () => {
    setLoading(true)
    return api
      .get('/admin/users', { params: { role: role || undefined, search: debouncedSearch || undefined, page } })
      .then((res) => {
        const { rows, counts, meta } = pageMeta(res)
        setUsers(rows)
        setCounts(counts)
        setMeta(meta)
      })
      .catch((err) => notify(errorMessage(err), 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [role, debouncedSearch, page])
  useEffect(() => setPage(1), [role, debouncedSearch])

  const changeRole = async (u, newRole) => {
    try {
      await api.put(`/admin/users/${u.id}`, { role: newRole })
      notify(`${u.name} is now ${newRole === 'admin' ? 'an' : 'a'} ${newRole}`)
      load()
    } catch (err) {
      notify(errorMessage(err), 'error')
    }
  }

  const deleteUser = async (u) => {
    if (!confirm(`Delete ${u.name}? Their orders will be deleted too.`)) return
    try {
      await api.delete(`/admin/users/${u.id}`)
      notify('User deleted')
      load()
    } catch (err) {
      notify(errorMessage(err), 'error')
    }
  }

  const createUser = async (e) => {
    e.preventDefault()
    try {
      await api.post('/admin/users', form)
      notify(`${form.name} added`)
      setCreating(false)
      setForm(emptyForm)
      load()
    } catch (err) {
      notify(errorMessage(err), 'error')
    }
  }

  const total = Object.values(counts).reduce((a, b) => a + Number(b), 0)

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle="Customers and staff accounts"
        actions={
          <button onClick={() => setCreating(true)} className={btn.primary}>
            <PlusIcon className="h-4 w-4" /> Add user
          </button>
        }
      />

      <Card bodyClass="">
        <div className="px-4 pt-2">
          <Tabs
            tabs={[{ value: '', label: 'All', count: total }, ...ROLES.map((r) => ({ value: r.value, label: `${r.label}s`, count: Number(counts[r.value] || 0) }))]}
            value={role}
            onChange={setRole}
          />
        </div>
        <div className="border-b border-stone-100 p-4">
          <SearchBox value={search} onChange={setSearch} placeholder="Search by name or email" className="max-w-md" />
        </div>

        <div className={`overflow-x-auto transition-opacity ${loading ? 'opacity-60' : ''}`}>
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-stone-50 text-left text-xs uppercase tracking-wider text-stone-500">
              <tr>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 text-right font-medium">Orders</th>
                <th className="px-4 py-3 text-right font-medium">Total spent</th>
                <th className="px-4 py-3 font-medium">Last order</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <button onClick={() => setOpenId(u.id)} className="flex items-center gap-3 text-left">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-100 font-semibold text-stone-700">
                        {u.name.charAt(0).toUpperCase()}
                      </span>
                      <span>
                        <span className="block font-medium text-stone-900 hover:underline">
                          {u.name} {u.id === me?.id && <span className="text-xs font-normal text-stone-500">(you)</span>}
                        </span>
                        <span className="block text-xs text-stone-500">{u.email}</span>
                      </span>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      disabled={u.id === me?.id}
                      onChange={(e) => changeRole(u, e.target.value)}
                      className={`${inputClass} w-32 py-1.5`}
                      aria-label={`Role for ${u.name}`}
                    >
                      {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{u.orders_count}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{money(u.total_spent)}</td>
                  <td className="px-4 py-3 text-stone-600">{formatDate(u.last_order_at)}</td>
                  <td className="px-4 py-3 text-stone-600">{formatDate(u.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    {u.id !== me?.id && (
                      <button onClick={() => deleteUser(u)} className={`${btn.icon} hover:!text-red-700`} aria-label={`Delete ${u.name}`} title="Delete">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && users.length === 0 && <EmptyState title="No users found" />}
        </div>
        <TablePager meta={meta} onPage={setPage} />
      </Card>

      <UserDrawer userId={openId} me={me} onClose={() => setOpenId(null)} onChange={load} />

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="Add user"
        footer={
          <>
            <button type="button" onClick={() => setCreating(false)} className={btn.secondary}>Cancel</button>
            <button type="submit" form="user-form" className={btn.primary}>Add user</button>
          </>
        }
      >
        <form id="user-form" onSubmit={createUser} className="space-y-4">
          <Field label="Name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} required /></Field>
          <Field label="Email"><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} required /></Field>
          <Field label="Password" hint="At least 6 characters. Share it with the user securely.">
            <input type="password" minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputClass} required autoComplete="new-password" />
          </Field>
          <Field label="Role">
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputClass}>
              {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </Field>
        </form>
      </Modal>
    </div>
  )
}

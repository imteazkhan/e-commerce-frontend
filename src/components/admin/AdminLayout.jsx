import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { BoxIcon, DashboardIcon, ExternalIcon, LayersIcon, ReceiptIcon, TagIcon, UsersIcon } from '../Icons'
import { ToastProvider } from './ui'

const adminNav = [
  { to: '/admin', label: 'Dashboard', icon: DashboardIcon, end: true },
  { to: '/admin/orders', label: 'Orders', icon: ReceiptIcon },
  { to: '/admin/products', label: 'Products', icon: BoxIcon },
  { to: '/admin/stock', label: 'Inventory', icon: LayersIcon },
  { to: '/admin/categories', label: 'Categories', icon: TagIcon },
  { to: '/admin/users', label: 'Users', icon: UsersIcon },
]

const managerNav = [
  { to: '/manager', label: 'Dashboard', icon: DashboardIcon, end: true },
  { to: '/manager/orders', label: 'Orders', icon: ReceiptIcon },
  { to: '/manager/stock', label: 'Inventory', icon: LayersIcon },
]

/**
 * Shell for /admin/* and /manager/*. Pages read { base, isAdmin } from the outlet context
 * so the same page component works under both panels.
 */
export default function AdminLayout() {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const base = pathname.startsWith('/manager') ? '/manager' : '/admin'
  const nav = base === '/admin' ? adminNav : managerNav
  const isAdmin = user?.role === 'admin'

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
      isActive ? 'bg-stone-900 font-medium text-white' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
    }`

  return (
    <ToastProvider>
      <div className="min-h-[calc(100vh-5rem)] bg-stone-50">
        <div className="mx-auto flex max-w-[1440px]">
          <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] w-60 shrink-0 flex-col border-r border-stone-200 bg-white px-3 py-6 lg:flex">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400">
              {base === '/admin' ? 'Admin panel' : 'Manager panel'}
            </p>
            <nav className="mt-3 flex flex-col gap-1">
              {nav.map(({ to, label, icon: Icon, end }) => (
                <NavLink key={to} to={to} end={end} className={linkClass}>
                  <Icon className="h-[18px] w-[18px]" />
                  {label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-auto space-y-1 border-t border-stone-100 pt-4">
              {isAdmin && base === '/admin' && (
                <NavLink to="/manager" className={linkClass}>
                  <LayersIcon className="h-[18px] w-[18px]" /> Manager view
                </NavLink>
              )}
              <NavLink to="/" className={linkClass} end>
                <ExternalIcon className="h-[18px] w-[18px]" /> View store
              </NavLink>
              <div className="px-3 pt-3">
                <p className="truncate text-sm font-medium text-stone-900">{user?.name}</p>
                <p className="truncate text-xs capitalize text-stone-500">{user?.role}</p>
              </div>
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            {/* Compact nav for small screens */}
            <nav className="sticky top-20 z-30 flex gap-1 overflow-x-auto border-b border-stone-200 bg-white px-4 py-2 lg:hidden">
              {nav.map(({ to, label, icon: Icon, end }) => (
                <NavLink key={to} to={to} end={end} className={(s) => `${linkClass(s)} shrink-0 whitespace-nowrap`}>
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </nav>
            <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
              <Outlet context={{ base, isAdmin }} />
            </main>
          </div>
        </div>
      </div>
    </ToastProvider>
  )
}

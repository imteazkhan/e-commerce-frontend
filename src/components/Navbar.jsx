import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { BagIcon, CloseIcon, MenuIcon, SearchIcon, UserIcon } from './Icons'
import { useCategories } from '../context/CategoryContext'
import Logo from './Logo'

const fixedMenu = [
  // { to: '/products?discount=1', label: 'Sale', sale: true },
  // { to: '/products?sort=new', label: 'New Arrival' },
]

function accountLinks(user) {
  if (!user) return []
  if (user.role === 'admin') return [{ to: '/admin', label: 'Admin Panel' }]
  if (user.role === 'manager') return [{ to: '/manager', label: 'Manager Panel' }]
  return [
    { to: '/profile', label: 'My Profile' },
    { to: '/my-orders', label: 'My Orders' },
  ]
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cart } = useCart()
  const { activeCategories: categories } = useCategories()
  const navigate = useNavigate()
  const location = useLocation()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const menuRef = useRef(null)

  const menu = [
    ...fixedMenu,
    ...categories.map((c) => ({ to: `/products?category=${c.slug}`, label: c.name })),
  ]
  const cartCount = cart.reduce((sum, i) => sum + (i.qty || 1), 0)
  const links = accountLinks(user)
  const current = location.pathname + location.search

  // Close menus on navigation
  useEffect(() => {
    setDrawerOpen(false)
    setMenuOpen(false)
  }, [current])

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/products?search=${encodeURIComponent(q)}` : '/products')
  }

  const linkClass = (item) => {
    const active = current === item.to
    if (item.sale) return active ? 'text-red-700' : 'text-red-600 hover:text-red-700'
    return active ? 'text-brand-gold' : 'text-gray-700 hover:text-black'
  }

  return (
    <header className="sticky top-0 z-50 text-gray-900">
      {/* Glass background lives on its own layer so backdrop-filter doesn't trap the fixed drawer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 border-b border-white/60 bg-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl backdrop-saturate-150"
      />
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-4 px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="-ml-1 p-1.5 text-gray-700 hover:text-black xl:hidden"
            aria-label="Open menu"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <Logo light={false} />
        </div>

        {/* Desktop menu */}
        <nav aria-label="Main" className="hidden items-center gap-6 text-[12px] font-medium uppercase tracking-widest xl:flex">
          {menu.map((item) => (
            <Link key={item.to} to={item.to} className={`whitespace-nowrap transition-colors ${linkClass(item)}`}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Utilities */}
        <div className="flex items-center gap-5">
          <form onSubmit={handleSearch} className="relative hidden w-36 sm:block md:w-44">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="h-8 w-full rounded-full border border-black/10 bg-white/50 py-1.5 pl-4 pr-8 text-xs text-gray-900 placeholder-gray-500 backdrop-blur-md transition-colors focus:border-brand-gold/70 focus:bg-white/80 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Submit search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
            >
              <SearchIcon className="h-3.5 w-3.5" strokeWidth={2.2} />
            </button>
          </form>

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="My account"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-brand-gold text-[11px] font-semibold text-brand-gold transition-colors hover:bg-brand-gold hover:text-black"
              >
                {(user.name || user.email || 'U').charAt(0).toUpperCase()}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-4 w-56 animate-fade-up overflow-hidden rounded-xl border border-white/60 bg-white/70 py-2 text-gray-700 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl">
                  <div className="px-4 py-2">
                    <p className="truncate text-sm font-semibold text-gray-900">{user.name || 'Account'}</p>
                    <p className="truncate text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="my-1 h-px bg-black/5" />
                  {links.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      className="block px-4 py-2 text-xs uppercase tracking-wider hover:bg-black/5 hover:text-black"
                    >
                      {l.label}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-xs uppercase tracking-wider text-red-600 hover:bg-red-500/10"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" aria-label="My account" className="text-gray-700 hover:text-black">
              <UserIcon className="h-5 w-5" />
            </Link>
          )}

          <Link to="/cart" aria-label="Shopping cart" className="relative text-gray-700 hover:text-black">
            <BagIcon className="h-5 w-5" />
            <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-0.5 text-[10px] font-bold text-white">
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile / tablet drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] xl:hidden">
          <div className="absolute inset-0 animate-fade-in bg-black/20 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-80 max-w-[85%] flex-col overflow-y-auto border-r border-white/60 bg-white/75 backdrop-blur-2xl">
            <div className="flex h-20 items-center justify-between border-b border-black/5 px-5">
              <Logo light={false} />
              <button onClick={() => setDrawerOpen(false)} aria-label="Close menu" className="text-gray-500 hover:text-black">
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSearch} className="relative p-5 sm:hidden">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="h-10 w-full rounded-full border border-black/10 bg-white/60 pl-4 pr-10 text-sm text-gray-900 placeholder-gray-500 focus:border-brand-gold/70 focus:bg-white/90 focus:outline-none"
              />
              <SearchIcon className="pointer-events-none absolute right-9 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            </form>

            <nav className="flex flex-col px-5 py-2 text-[13px] font-medium uppercase tracking-widest">
              {menu.map((item) => (
                <Link key={item.to} to={item.to} className={`border-b border-black/5 py-4 ${linkClass(item)}`}>
                  {item.label}
                </Link>
              ))}
            </nav>

            {!user && (
              <div className="mt-auto grid grid-cols-2 gap-3 p-5">
                <Link to="/login" className="btn-gold-outline !px-4">Log in</Link>
                <Link to="/register" className="btn !px-4 bg-brand-gold text-black hover:bg-primary-400">Register</Link>
              </div>
            )}
          </aside>
        </div>
      )}
    </header>
  )
}

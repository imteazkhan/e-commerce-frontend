import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../services/api'
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard'
import {
  ChevronRightIcon,
  CloseIcon,
  FilterIcon,
  SearchIcon,
} from '../components/Icons'
import { categories, categorySlug, unwrap } from '../utils/catalog'

const sortOptions = [
  { value: '', label: 'Featured' },
  { value: 'new', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

const priceRanges = [
  { value: '', label: 'Any price' },
  { value: '0-500', label: 'Under ৳500' },
  { value: '500-2000', label: '৳500 – ৳2,000' },
  { value: '2000-5000', label: '৳2,000 – ৳5,000' },
  { value: '5000-', label: 'Over ৳5,000' },
]

function applyFilters(products, { category, search, price, sort }) {
  let list = [...products]

  // Only filter by category client-side when products carry category info;
  // otherwise trust the API, which already received ?category=.
  if (category && list.some((p) => categorySlug(p))) {
    list = list.filter((p) => categorySlug(p).includes(category))
  }

  if (search) {
    const q = search.toLowerCase()
    list = list.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    )
  }

  if (price) {
    const [min, max] = price.split('-').map((v) => (v === '' ? null : Number(v)))
    list = list.filter((p) => {
      const n = Number(p.price)
      return (min === null || n >= min) && (max === null || n <= max)
    })
  }

  if (sort === 'price_asc') list.sort((a, b) => a.price - b.price)
  if (sort === 'price_desc') list.sort((a, b) => b.price - a.price)
  if (sort === 'new') {
    list.sort((a, b) =>
      a.created_at && b.created_at
        ? new Date(b.created_at) - new Date(a.created_at)
        : b.id - a.id
    )
  }

  return list
}

function FilterPanel({ params, setParam }) {
  const category = params.get('category') || ''
  const price = params.get('price') || ''

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold text-stone-900">Category</h3>
        <ul className="mt-3 space-y-1">
          {[{ name: 'All products', slug: '' }, ...categories].map((c) => (
            <li key={c.slug}>
              <button
                onClick={() => setParam('category', c.slug)}
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors ${
                  category === c.slug
                    ? 'bg-stone-900 font-medium text-white'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                {c.name}
                {category === c.slug && <ChevronRightIcon className="w-4 h-4" />}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-stone-900">Price</h3>
        <div className="mt-3 space-y-1">
          {priceRanges.map((r) => (
            <label
              key={r.value}
              className="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm text-stone-600 hover:bg-stone-50"
            >
              <input
                type="radio"
                name="price"
                checked={price === r.value}
                onChange={() => setParam('price', r.value)}
                className="h-4 w-4 accent-black"
              />
              {r.label}
            </label>
          ))}
        </div>
      </div>

      <label className="flex cursor-pointer items-center justify-between bg-stone-50 border border-stone-200 p-4">
        <span>
          <span className="block text-sm font-semibold text-stone-900">On sale</span>
          <span className="block text-xs text-stone-500">Show discounted items only</span>
        </span>
        <input
          type="checkbox"
          checked={params.get('discount') === '1'}
          onChange={(e) => setParam('discount', e.target.checked ? '1' : '')}
          className="h-5 w-5 rounded accent-black"
        />
      </label>
    </div>
  )
}

export default function Products() {
  const [params, setParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchInput, setSearchInput] = useState(params.get('search') || '')

  const category = params.get('category') || ''
  const search = params.get('search') || ''
  const sort = params.get('sort') || ''
  const price = params.get('price') || ''
  const discount = params.get('discount') || ''

  useEffect(() => setSearchInput(search), [search])

  // Server-side params; price filtering and sorting are also applied client-side.
  useEffect(() => {
    setLoading(true)
    setError('')
    const query = {}
    if (category) query.category = category
    if (search) query.search = search
    if (sort) query.sort = sort
    if (discount) query.discount = discount

    api
      .get('/products', { params: query })
      .then((res) => setProducts(unwrap(res) || []))
      .catch(() => setError('Could not load products. Please try again.'))
      .finally(() => setLoading(false))
  }, [category, search, sort, discount])

  const visible = useMemo(
    () => applyFilters(products, { category, search, price, sort }),
    [products, category, search, price, sort]
  )

  const setParam = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next)
    setDrawerOpen(false)
  }

  const activeChips = [
    category && { key: 'category', label: categories.find((c) => c.slug === category)?.name || category },
    search && { key: 'search', label: `"${search}"` },
    price && { key: 'price', label: priceRanges.find((r) => r.value === price)?.label || price },
    discount && { key: 'discount', label: 'On sale' },
  ].filter(Boolean)

  const title = categories.find((c) => c.slug === category)?.name
    || (sort === 'new' ? 'New arrivals' : discount ? 'Deals' : 'All products')

  return (
    <div>
      {/* Header */}
      <section className="border-b border-stone-100 bg-gradient-to-b from-stone-50 to-white">
        <div className="container-page py-10 sm:py-14">
          <nav className="flex items-center gap-1.5 text-xs text-stone-500">
            <Link to="/" className="hover:text-stone-900">Home</Link>
            <ChevronRightIcon className="w-3.5 h-3.5" />
            <span className="text-stone-900">Shop</span>
          </nav>
          <h1 className="mt-4 text-3xl font-serif font-semibold tracking-wider text-stone-900 sm:text-4xl">{title}</h1>
          <p className="mt-2 text-stone-500">
            Browse our collection of quality products at honest prices.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              setParam('search', searchInput.trim())
            }}
            className="relative mt-6 max-w-xl"
          >
            <SearchIcon className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for products..."
              className="w-full rounded-full border border-stone-200 bg-white py-3.5 pl-14 pr-32 text-sm shadow-soft outline-none transition focus:border-primary-300 focus:ring-4 focus:ring-primary-50"
            />
            <button type="submit" className="btn-primary absolute right-1.5 top-1/2 -translate-y-1/2 !py-2.5">
              Search
            </button>
          </form>
        </div>
      </section>

      <div className="container-page grid gap-10 py-10 lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-32">
            <FilterPanel params={params} setParam={setParam} />
          </div>
        </aside>

        <div>
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-stone-500">
              {loading ? 'Loading…' : (
                <>Showing <span className="font-semibold text-stone-900">{visible.length}</span> products</>
              )}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDrawerOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 hover:border-stone-900 lg:hidden"
              >
                <FilterIcon className="w-4 h-4" />
                Filters
                {activeChips.length > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                    {activeChips.length}
                  </span>
                )}
              </button>
              <select
                value={sort}
                onChange={(e) => setParam('sort', e.target.value)}
                className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 outline-none hover:border-stone-900 focus:ring-4 focus:ring-primary-50"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active filters */}
          {activeChips.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {activeChips.map((chip) => (
                <button
                  key={chip.key}
                  onClick={() => setParam(chip.key, '')}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 hover:bg-primary-100"
                >
                  {chip.label}
                  <CloseIcon className="w-3.5 h-3.5" />
                </button>
              ))}
              <button
                onClick={() => setParams(new URLSearchParams())}
                className="px-2 text-xs font-medium text-stone-500 underline-offset-4 hover:text-stone-900 hover:underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Grid */}
          <div className="mt-8">
            {loading ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : error ? (
              <div className=" border border-rose-100 bg-rose-50 py-16 text-center">
                <p className="text-sm font-medium text-rose-700">{error}</p>
              </div>
            ) : visible.length === 0 ? (
              <div className=" border border-dashed border-stone-200 px-6 py-20 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center bg-stone-100 text-stone-400">
                  <SearchIcon className="w-6 h-6" />
                </span>
                <h3 className="mt-4 font-semibold text-stone-900">No products found</h3>
                <p className="mt-1 text-sm text-stone-500">Try adjusting your search or filters.</p>
                <button onClick={() => setParams(new URLSearchParams())} className="btn-outline mt-6">
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
                {visible.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-full max-w-xs flex-col overflow-y-auto bg-white p-6 shadow-lift">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-900">Filters</h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="rounded-full p-2 text-stone-500 hover:bg-stone-100"
                aria-label="Close filters"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            <FilterPanel params={params} setParam={setParam} />
          </div>
        </div>
      )}
    </div>
  )
}

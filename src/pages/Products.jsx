import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../services/api'
import { useCart } from '../context/CartContext'
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard'
import ProductImage from '../components/ProductImage'
import Pagination from '../components/Pagination'
import {
  CloseIcon,
  FilterIcon,
  GridIcon,
  GridSmallIcon,
  ListIcon,
  SearchIcon,
} from '../components/Icons'
import { useCategories } from '../context/CategoryContext'
import { categorySlug, formatPrice, unwrap } from '../utils/catalog'

const sortOptions = [
  { value: '', label: 'Featured' },
  { value: 'new', label: 'Newness' },
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

const PAGE_SIZE = 16

const viewModes = [
  { id: 'dense', Icon: GridSmallIcon, label: 'Compact grid' },
  { id: 'grid', Icon: GridIcon, label: 'Grid view' },
  { id: 'list', Icon: ListIcon, label: 'List view' },
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
  const { activeCategories: categories } = useCategories()

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

function ProductListRow({ product }) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)
  const outOfStock = product.stock !== undefined && product.stock !== null && Number(product.stock) <= 0

  const handleAdd = (e) => {
    e.preventDefault()
    if (outOfStock) return
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <Link to={`/products/${product.id}`} className="group flex items-center gap-5 py-5">
      <div className="h-24 w-20 flex-shrink-0 overflow-hidden bg-stone-100 sm:h-32 sm:w-28">
        <ProductImage src={product.image} alt={product.name} className="h-full w-full object-top" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-medium uppercase tracking-wide text-gray-800 transition-colors group-hover:text-black sm:text-base">
          {product.name}
        </h3>
        <p className="mt-1.5 text-sm font-bold text-black">{formatPrice(product.price)}</p>
        {outOfStock && (
          <span className="mt-2 inline-block bg-black px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white">
            Sold out
          </span>
        )}
      </div>
      {!outOfStock && (
        <button
          onClick={handleAdd}
          className={`hidden flex-shrink-0 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors sm:block ${
            added ? 'bg-brand-gold text-black' : 'bg-black text-white hover:bg-stone-800'
          }`}
        >
          {added ? 'Added ✓' : 'Add to cart'}
        </button>
      )}
    </Link>
  )
}

export default function Products() {
  const [params, setParams] = useSearchParams()
  const { activeCategories: categories } = useCategories()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchInput, setSearchInput] = useState(params.get('search') || '')
  const [view, setView] = useState('grid')
  const [page, setPage] = useState(1)

  const category = params.get('category') || ''
  const search = params.get('search') || ''
  const sort = params.get('sort') || ''
  const price = params.get('price') || ''
  const discount = params.get('discount') || ''

  useEffect(() => setSearchInput(search), [search])
  useEffect(() => setPage(1), [category, search, price, sort, discount])

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

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE))
  const paged = useMemo(
    () => visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [visible, page]
  )

  const setParam = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next)
    setDrawerOpen(false)
  }

  const goToPage = (p) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const activeChips = [
    category && { key: 'category', label: categories.find((c) => c.slug === category)?.name || category },
    search && { key: 'search', label: `"${search}"` },
    price && { key: 'price', label: priceRanges.find((r) => r.value === price)?.label || price },
    discount && { key: 'discount', label: 'On sale' },
  ].filter(Boolean)

  const title = categories.find((c) => c.slug === category)?.name
    || (sort === 'new' ? 'New arrivals' : discount ? 'Deals' : 'Summer Collection')

  const gridCols =
    view === 'dense'
      ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
      : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'

  return (
    <div>
      {/* Header */}
      <section className="border-b border-stone-100 bg-white">
        <div className="container-page py-12 text-center sm:py-16">
          <h1 className="text-4xl font-light tracking-wide text-stone-900 sm:text-5xl">{title}</h1>
          <nav className="mt-4 flex items-center justify-center gap-2 text-xs text-stone-500">
            <Link to="/" className="hover:text-stone-900">Home</Link>
            <span>/</span>
            <span className="text-stone-900">{title}</span>
          </nav>
        </div>
      </section>

      <div className="container-page py-10">
        {/* Intro + search */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-2xl text-sm leading-relaxed text-stone-500">
            Step into this season with distinction. Richman introduces a curated collection of{' '}
            <strong className="font-semibold text-stone-800">premium formal wear</strong>, casual wear and accessories
            crafted for the man who values sophistication, style, and structure.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setParam('search', searchInput.trim())
            }}
            className="relative w-full sm:w-64"
          >
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for products..."
              className="w-full border border-stone-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-stone-900"
            />
          </form>
        </div>

        {/* Toolbar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-y border-stone-100 py-3">
          <p className="text-sm text-stone-500">
            {loading ? (
              'Loading…'
            ) : (
              <>
                Showing <span className="font-medium text-stone-900">{paged.length}</span> of{' '}
                <span className="font-medium text-stone-900">{visible.length}</span> results
              </>
            )}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDrawerOpen(true)}
              className="inline-flex items-center gap-2 border border-stone-200 px-3.5 py-2 text-xs font-medium uppercase tracking-wider text-stone-700 hover:border-stone-900"
            >
              <FilterIcon className="h-4 w-4" />
              Filters
              {activeChips.length > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-stone-900 text-[9px] font-bold text-white">
                  {activeChips.length}
                </span>
              )}
            </button>

            <div className="hidden items-center gap-1 sm:flex">
              {viewModes.map(({ id, Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setView(id)}
                  aria-label={label}
                  aria-pressed={view === id}
                  className={`flex h-9 w-9 items-center justify-center border transition ${
                    view === id
                      ? 'border-stone-900 bg-stone-900 text-white'
                      : 'border-stone-200 text-stone-400 hover:border-stone-900 hover:text-stone-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>

            <select
              value={sort}
              onChange={(e) => setParam('sort', e.target.value)}
              className="border border-stone-200 bg-white px-4 py-2 text-xs font-medium uppercase tracking-wider text-stone-700 outline-none hover:border-stone-900 focus:ring-4 focus:ring-primary-50"
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
                className="inline-flex items-center gap-1.5 bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-200"
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

        {/* Results */}
        <div className="mt-8">
          {loading ? (
            <div className={`grid gap-4 sm:gap-6 ${gridCols}`}>
              {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : error ? (
            <div className="border border-rose-100 bg-rose-50 py-16 text-center">
              <p className="text-sm font-medium text-rose-700">{error}</p>
            </div>
          ) : visible.length === 0 ? (
            <div className="border border-dashed border-stone-200 px-6 py-20 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center bg-stone-100 text-stone-400">
                <SearchIcon className="w-6 h-6" />
              </span>
              <h3 className="mt-4 font-semibold text-stone-900">No products found</h3>
              <p className="mt-1 text-sm text-stone-500">Try adjusting your search or filters.</p>
              <button onClick={() => setParams(new URLSearchParams())} className="btn-outline mt-6">
                Reset filters
              </button>
            </div>
          ) : view === 'list' ? (
            <div className="divide-y divide-stone-100">
              {paged.map((p) => <ProductListRow key={p.id} product={p} />)}
            </div>
          ) : (
            <div className={`grid gap-4 sm:gap-6 ${gridCols}`}>
              {paged.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>

        <Pagination page={page} totalPages={totalPages} onChange={goToPage} />
      </div>

      {/* Filters drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60]">
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

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../../services/api'
import ProductImage from '../../components/ProductImage'
import { useCategories } from '../../context/CategoryContext'
import { MinusIcon, PlusIcon } from '../../components/Icons'
import {
  Card, EmptyState, PageHeader, SearchBox, StatCard, StockBadge, TablePager, Tabs,
  LOW_STOCK, btn, errorMessage, inputClass, money, paginate, useToast,
} from '../../components/admin/ui'

const FILTERS = [
  { value: '', label: 'All', test: () => true },
  { value: 'low', label: 'Low stock', test: (p) => p.stock > 0 && p.stock <= LOW_STOCK },
  { value: 'out', label: 'Out of stock', test: (p) => p.stock <= 0 },
  { value: 'in', label: 'In stock', test: (p) => p.stock > LOW_STOCK },
]

export default function ManageStock() {
  const notify = useToast()
  const { categories } = useCategories()
  const [params, setParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [drafts, setDrafts] = useState({}) // id -> edited stock value
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const filter = params.get('filter') || ''

  const load = () =>
    api
      .get('/products', { params: { all: 1 } })
      .then((res) => setProducts(res.data.data || res.data))
      .catch((err) => notify(errorMessage(err), 'error'))
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])
  useEffect(() => setPage(1), [search, category, filter])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const test = FILTERS.find((f) => f.value === filter)?.test || (() => true)
    return products
      .filter((p) => test(p) && (!category || String(p.category_id) === category) && (!q || p.name.toLowerCase().includes(q) || (p.sku || '').toLowerCase().includes(q)))
      .sort((a, b) => a.stock - b.stock || a.name.localeCompare(b.name))
  }, [products, search, category, filter])

  const { rows, meta } = paginate(filtered, page, 20)
  const dirty = Object.entries(drafts).filter(([id, v]) => v !== '' && Number(v) !== products.find((p) => p.id === Number(id))?.stock)
  const units = products.reduce((s, p) => s + p.stock, 0)
  const value = products.reduce((s, p) => s + p.stock * p.price, 0)

  const setDraft = (p, v) => setDrafts((d) => ({ ...d, [p.id]: v === '' ? '' : String(Math.max(0, Number(v))) }))
  const current = (p) => (drafts[p.id] ?? p.stock)

  const saveAll = async () => {
    setSaving(true)
    const results = await Promise.allSettled(dirty.map(([id, v]) => api.put(`/products/${id}`, { stock: Number(v) })))
    const failed = results.filter((r) => r.status === 'rejected').length
    setSaving(false)
    setDrafts({})
    notify(failed ? `${failed} update(s) failed` : `Stock updated for ${results.length} product(s)`, failed ? 'error' : 'success')
    load()
  }

  return (
    <div>
      <PageHeader
        title="Inventory"
        subtitle="Keep stock levels accurate. Cancelled orders are returned to stock automatically."
        actions={
          dirty.length > 0 && (
            <>
              <button onClick={() => setDrafts({})} className={btn.secondary}>Discard</button>
              <button onClick={saveAll} disabled={saving} className={btn.primary}>
                {saving ? 'Saving…' : `Save ${dirty.length} change${dirty.length === 1 ? '' : 's'}`}
              </button>
            </>
          )
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Products" value={products.length.toLocaleString()} hint={`${units.toLocaleString()} units on hand`} />
        <StatCard label="Inventory value" value={money(value)} hint="At selling price" />
        <StatCard label="Low stock" value={products.filter(FILTERS[1].test).length} hint={`${LOW_STOCK} units or fewer`} />
        <StatCard label="Out of stock" value={products.filter(FILTERS[2].test).length} hint="Not available to buy" />
      </div>

      <Card bodyClass="">
        <div className="px-4 pt-2">
          <Tabs
            tabs={FILTERS.map((f) => ({ value: f.value, label: f.label, count: products.filter(f.test).length }))}
            value={filter}
            onChange={(v) => setParams(v ? { filter: v } : {})}
          />
        </div>
        <div className="grid gap-3 border-b border-stone-100 p-4 sm:grid-cols-[1fr_220px]">
          <SearchBox value={search} onChange={setSearch} placeholder="Search by name or SKU" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} aria-label="Category">
            <option value="">All categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}{c.is_active === false ? ' (paused)' : ''}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-stone-50 text-left text-xs uppercase tracking-wider text-stone-500">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {rows.map((p) => {
                const value = current(p)
                const changed = value !== '' && Number(value) !== p.stock
                return (
                  <tr key={p.id} className={changed ? 'bg-amber-50/60' : 'hover:bg-stone-50'}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <ProductImage src={p.image} alt="" className="h-10 w-10 shrink-0 rounded" />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-stone-900">{p.name}</p>
                          <p className="text-xs text-stone-500">{[p.sku, p.category?.name].filter(Boolean).join(' · ') || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StockBadge stock={changed ? Number(value) : p.stock} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setDraft(p, Number(value || 0) - 1)} disabled={Number(value) <= 0} className={`${btn.icon} border border-stone-200`} aria-label={`Decrease ${p.name}`}>
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={value}
                          onChange={(e) => setDraft(p, e.target.value)}
                          className={`${inputClass} w-20 text-center tabular-nums`}
                          aria-label={`Stock for ${p.name}`}
                        />
                        <button onClick={() => setDraft(p, Number(value || 0) + 1)} className={`${btn.icon} border border-stone-200`} aria-label={`Increase ${p.name}`}>
                          <PlusIcon className="h-4 w-4" />
                        </button>
                        {changed && <span className="ml-2 text-xs text-stone-500">was {p.stock}</span>}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {!loading && rows.length === 0 && <EmptyState title="Nothing here">No products match these filters.</EmptyState>}
        </div>
        <TablePager meta={meta} onPage={setPage} />
      </Card>
    </div>
  )
}

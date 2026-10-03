import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import ProductImage from '../../components/ProductImage'
import { useCategories } from '../../context/CategoryContext'
import { EditIcon, ExternalIcon, PlusIcon, StarIcon, TrashIcon } from '../../components/Icons'
import {
  Badge, Card, EmptyState, Field, Modal, PageHeader, SearchBox, StockBadge, TablePager, Tabs,
  LOW_STOCK, btn, errorMessage, inputClass, money, paginate, useToast,
} from '../../components/admin/ui'

const emptyForm = {
  name: '', sku: '', category_id: '', price: '', compare_price: '', stock: '',
  image: '', images: '', description: '', is_featured: false,
}

const STOCK_TABS = [
  { value: '', label: 'All', test: () => true },
  { value: 'in', label: 'In stock', test: (p) => p.stock > LOW_STOCK },
  { value: 'low', label: 'Low stock', test: (p) => p.stock > 0 && p.stock <= LOW_STOCK },
  { value: 'out', label: 'Out of stock', test: (p) => p.stock <= 0 },
  { value: 'featured', label: 'Featured', test: (p) => p.is_featured },
  { value: 'sale', label: 'On sale', test: (p) => p.compare_price > p.price },
]

function toForm(p) {
  return {
    name: p.name || '',
    sku: p.sku || '',
    category_id: p.category_id || '',
    price: p.price ?? '',
    compare_price: p.compare_price ?? '',
    stock: p.stock ?? '',
    image: p.image || '',
    images: (p.images || []).join('\n'),
    description: p.description || '',
    is_featured: Boolean(p.is_featured),
  }
}

function toPayload(f) {
  return {
    ...f,
    sku: f.sku.trim() || null,
    category_id: f.category_id || null,
    compare_price: f.compare_price === '' ? null : f.compare_price,
    images: f.images.split('\n').map((s) => s.trim()).filter(Boolean),
  }
}

export default function ManageProducts() {
  const notify = useToast()
  const { categories, reload: reloadCategories } = useCategories()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [tab, setTab] = useState('')
  const [page, setPage] = useState(1)

  const [editing, setEditing] = useState(null) // null = closed, 'new' or a product
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const load = () =>
    api
      .get('/products', { params: { sort: 'new', all: 1 } })
      .then((res) => setProducts(res.data.data || res.data))
      .catch((err) => notify(errorMessage(err), 'error'))
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])
  useEffect(() => setPage(1), [search, category, tab])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const test = STOCK_TABS.find((t) => t.value === tab).test
    return products.filter(
      (p) =>
        test(p) &&
        (!category || String(p.category_id) === category) &&
        (!q || p.name.toLowerCase().includes(q) || (p.sku || '').toLowerCase().includes(q))
    )
  }, [products, search, category, tab])

  const { rows, meta } = paginate(filtered, page)
  const tabs = STOCK_TABS.map((t) => ({ value: t.value, label: t.label, count: products.filter(t.test).length }))

  const openForm = (p) => {
    setEditing(p || 'new')
    setForm(p ? toForm(p) : emptyForm)
    setErrors({})
  }

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      if (editing === 'new') {
        await api.post('/products', toPayload(form))
        notify('Product added')
      } else {
        await api.put(`/products/${editing.id}`, toPayload(form))
        notify('Product updated')
      }
      setEditing(null)
      load()
      reloadCategories()
    } catch (err) {
      const fieldErrors = err.response?.data?.errors
      if (fieldErrors) setErrors(Object.fromEntries(Object.entries(fieldErrors).map(([k, v]) => [k.split('.')[0], v[0]])))
      notify(errorMessage(err), 'error')
    } finally {
      setSaving(false)
    }
  }

  const toggleFeatured = async (p) => {
    setProducts((list) => list.map((x) => (x.id === p.id ? { ...x, is_featured: !p.is_featured } : x)))
    try {
      await api.put(`/products/${p.id}`, { is_featured: !p.is_featured })
    } catch (err) {
      notify(errorMessage(err), 'error')
      load()
    }
  }

  const handleDelete = async (p) => {
    if (!confirm(`Delete "${p.name}"? Past orders keep their line items.`)) return
    try {
      await api.delete(`/products/${p.id}`)
      notify('Product deleted')
      load()
      reloadCategories()
    } catch (err) {
      notify(errorMessage(err), 'error')
    }
  }

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle={`${products.length} products in the catalogue`}
        actions={
          <button onClick={() => openForm(null)} className={btn.primary}>
            <PlusIcon className="h-4 w-4" /> Add product
          </button>
        }
      />

      <Card bodyClass="">
        <div className="px-4 pt-2">
          <Tabs tabs={tabs} value={tab} onChange={setTab} />
        </div>
        <div className="grid gap-3 border-b border-stone-100 p-4 sm:grid-cols-[1fr_220px]">
          <SearchBox value={search} onChange={setSearch} placeholder="Search by name or SKU" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} aria-label="Category">
            <option value="">All categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}{c.is_active === false ? ' (paused)' : ''}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-stone-50 text-left text-xs uppercase tracking-wider text-stone-500">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 text-right font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 text-center font-medium">Featured</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {rows.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <ProductImage src={p.image} alt="" className="h-12 w-12 shrink-0 rounded" />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-stone-900">{p.name}</p>
                        <p className="text-xs text-stone-500">{p.sku || 'No SKU'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-stone-700">
                    {p.category?.name || <span className="text-stone-400">—</span>}
                    {p.category?.is_active === false && <span className="ml-2"><Badge tone="stone">Paused</Badge></span>}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    <p className="font-medium text-stone-900">{money(p.price)}</p>
                    {p.compare_price > p.price && <p className="text-xs text-stone-400 line-through">{money(p.compare_price)}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <p className="mb-1 font-medium tabular-nums text-stone-900">{p.stock}</p>
                    <StockBadge stock={p.stock} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleFeatured(p)}
                      aria-pressed={Boolean(p.is_featured)}
                      aria-label={p.is_featured ? 'Remove from featured' : 'Mark as featured'}
                      title={p.is_featured ? 'Featured on the home page' : 'Not featured'}
                      className={`${btn.icon} ${p.is_featured ? 'text-primary-600' : 'text-stone-300'}`}
                    >
                      <StarIcon className="h-5 w-5" filled={Boolean(p.is_featured)} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Link to={`/products/${p.id}`} target="_blank" className={btn.icon} aria-label="View in store" title="View in store">
                        <ExternalIcon className="h-4 w-4" />
                      </Link>
                      <button onClick={() => openForm(p)} className={btn.icon} aria-label="Edit" title="Edit">
                        <EditIcon className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(p)} className={`${btn.icon} hover:!text-red-700`} aria-label="Delete" title="Delete">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && rows.length === 0 && <EmptyState title="No products found">Try a different search or filter.</EmptyState>}
        </div>
        <TablePager meta={meta} onPage={setPage} />
      </Card>

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'Add product' : 'Edit product'}
        wide
        footer={
          <>
            <button type="button" onClick={() => setEditing(null)} className={btn.secondary}>Cancel</button>
            <button type="submit" form="product-form" disabled={saving} className={btn.primary}>
              {saving ? 'Saving…' : editing === 'new' ? 'Add product' : 'Save changes'}
            </button>
          </>
        }
      >
        <form id="product-form" onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" error={errors.name} className="sm:col-span-2">
            <input value={form.name} onChange={set('name')} className={inputClass} required />
          </Field>
          <Field label="SKU" error={errors.sku} hint="Optional, must be unique">
            <input value={form.sku} onChange={set('sku')} className={inputClass} />
          </Field>
          <Field label="Category" error={errors.category_id}>
            <select value={form.category_id} onChange={set('category_id')} className={inputClass}>
              <option value="">No category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}{c.is_active === false ? ' (paused)' : ''}</option>)}
            </select>
          </Field>
          <Field label="Price (৳)" error={errors.price}>
            <input type="number" min="0" step="0.01" value={form.price} onChange={set('price')} className={inputClass} required />
          </Field>
          <Field label="Compare-at price (৳)" error={errors.compare_price} hint="Set higher than price to show it on sale">
            <input type="number" min="0" step="0.01" value={form.compare_price} onChange={set('compare_price')} className={inputClass} />
          </Field>
          <Field label="Stock" error={errors.stock}>
            <input type="number" min="0" value={form.stock} onChange={set('stock')} className={inputClass} />
          </Field>
          <label className="flex items-center gap-2 self-end pb-2 text-sm text-stone-700">
            <input type="checkbox" checked={form.is_featured} onChange={set('is_featured')} className="h-4 w-4 accent-stone-900" />
            Feature on the home page
          </label>
          <Field label="Main image URL" error={errors.image} className="sm:col-span-2">
            <div className="flex gap-3">
              <ProductImage src={form.image} alt="" className="h-10 w-10 shrink-0 rounded" />
              <input value={form.image} onChange={set('image')} className={inputClass} placeholder="https://…" />
            </div>
          </Field>
          <Field label="Gallery image URLs" error={errors.images} hint="One URL per line" className="sm:col-span-2">
            <textarea value={form.images} onChange={set('images')} rows={3} className={inputClass} />
          </Field>
          <Field label="Description" error={errors.description} className="sm:col-span-2">
            <textarea value={form.description} onChange={set('description')} rows={4} className={inputClass} />
          </Field>
        </form>
      </Modal>
    </div>
  )
}

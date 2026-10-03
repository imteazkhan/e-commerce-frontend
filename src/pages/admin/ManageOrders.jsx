import { useEffect, useState } from 'react'
import { useOutletContext, useSearchParams } from 'react-router-dom'
import api from '../../services/api'
import { DownloadIcon } from '../../components/Icons'
import OrderDrawer from './OrderDrawer'
import {
  Card, EmptyState, ORDER_STATUSES, PAYMENT_METHODS, PAYMENT_STATUSES, PageHeader, PaymentBadge, SearchBox,
  StatusBadge, TablePager, Tabs, btn, errorMessage, formatDateTime, inputClass, money, pageMeta, useDebounced, useToast,
} from '../../components/admin/ui'

const FILTER_KEYS = ['status', 'payment_status', 'search', 'from', 'to']

export default function ManageOrders() {
  const { isAdmin } = useOutletContext()
  const notify = useToast()
  const [params, setParams] = useSearchParams()
  const [orders, setOrders] = useState([])
  const [counts, setCounts] = useState({})
  const [meta, setMeta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(params.get('search') || '')
  const debouncedSearch = useDebounced(search)

  const status = params.get('status') || ''
  const openId = params.get('open')
  const page = Number(params.get('page') || 1)
  const filters = Object.fromEntries(FILTER_KEYS.map((k) => [k, params.get(k) || '']).filter(([, v]) => v))
  const filterKey = JSON.stringify(filters)

  const setParam = (key, value, { keepPage = false } = {}) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    if (!keepPage && key !== 'page' && key !== 'open') next.delete('page')
    setParams(next)
  }

  useEffect(() => {
    if (debouncedSearch !== (params.get('search') || '')) setParam('search', debouncedSearch.trim())
  }, [debouncedSearch])

  const load = () => {
    setLoading(true)
    return api
      .get('/admin/orders', { params: { ...filters, page } })
      .then((res) => {
        const { rows, counts, meta } = pageMeta(res)
        setOrders(rows)
        setCounts(counts)
        setMeta(meta)
      })
      .catch((err) => notify(errorMessage(err), 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [filterKey, page])

  const exportCsv = async () => {
    try {
      const res = await api.get('/admin/orders/export', { params: filters, responseType: 'blob' })
      const url = URL.createObjectURL(res.data)
      const a = document.createElement('a')
      a.href = url
      a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      notify(errorMessage(err), 'error')
    }
  }

  const total = Object.values(counts).reduce((a, b) => a + Number(b), 0)
  const tabs = [
    { value: '', label: 'All', count: total },
    ...ORDER_STATUSES.map((s) => ({ value: s.value, label: s.label, count: Number(counts[s.value] || 0) })),
  ]
  const hasFilters = FILTER_KEYS.some((k) => k !== 'status' && params.get(k))

  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle="Confirm, ship and track customer orders"
        actions={
          <button onClick={exportCsv} className={btn.secondary}>
            <DownloadIcon className="h-4 w-4" /> Export CSV
          </button>
        }
      />

      <Card bodyClass="">
        <div className="px-4 pt-2">
          <Tabs tabs={tabs} value={status} onChange={(v) => setParam('status', v)} />
        </div>

        <div className="grid gap-3 border-b border-stone-100 p-4 md:grid-cols-[1fr_auto_auto_auto]">
          <SearchBox value={search} onChange={setSearch} placeholder="Search order #, name, phone or email" />
          <select value={params.get('payment_status') || ''} onChange={(e) => setParam('payment_status', e.target.value)} className={inputClass} aria-label="Payment status">
            <option value="">Any payment</option>
            {PAYMENT_STATUSES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
          <input type="date" value={params.get('from') || ''} onChange={(e) => setParam('from', e.target.value)} className={inputClass} aria-label="From date" />
          <input type="date" value={params.get('to') || ''} onChange={(e) => setParam('to', e.target.value)} className={inputClass} aria-label="To date" />
        </div>
        {hasFilters && (
          <div className="border-b border-stone-100 px-4 py-2 text-sm">
            <button
              className="text-stone-600 underline hover:text-stone-900"
              onClick={() => {
                setSearch('')
                setParams(status ? { status } : {})
              }}
            >
              Clear filters
            </button>
          </div>
        )}

        <div className={`overflow-x-auto transition-opacity ${loading ? 'opacity-60' : ''}`}>
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-stone-50 text-left text-xs uppercase tracking-wider text-stone-500">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 text-right font-medium">Items</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.map((o) => (
                <tr key={o.id} onClick={() => setParam('open', String(o.id), { keepPage: true })} className="cursor-pointer hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <button className="font-medium text-stone-900 hover:underline">#{o.id}</button>
                    <p className="text-xs text-stone-500">{formatDateTime(o.created_at)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-stone-900">{o.name}</p>
                    <p className="text-xs text-stone-500">{o.user?.email || o.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{o.items_count}</td>
                  <td className="px-4 py-3 text-right font-medium tabular-nums">{money(o.total)}</td>
                  <td className="px-4 py-3">
                    <PaymentBadge status={o.payment_status} />
                    <p className="mt-1 text-xs text-stone-500">{PAYMENT_METHODS[o.payment_method] || o.payment_method}</p>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && orders.length === 0 && (
            <EmptyState title="No orders found">{hasFilters || status ? 'Try changing the filters.' : 'New orders will appear here.'}</EmptyState>
          )}
        </div>
        <TablePager meta={meta} onPage={(p) => setParam('page', String(p))} />
      </Card>

      <OrderDrawer
        orderId={openId}
        isAdmin={isAdmin}
        onClose={() => setParam('open', '', { keepPage: true })}
        onChange={load}
      />
    </div>
  )
}

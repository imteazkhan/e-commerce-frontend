import { useEffect, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import api from '../../services/api'
import ProductImage from '../../components/ProductImage'
import { BarList, SalesChart } from '../../components/admin/charts'
import { AlertIcon, BoxIcon, ReceiptIcon, RefreshIcon, UsersIcon } from '../../components/Icons'
import {
  Card, EmptyState, ORDER_STATUSES, PAYMENT_METHODS, PageHeader, StatCard, StatusBadge, StockBadge,
  btn, compactMoney, formatDate, money, percentChange,
} from '../../components/admin/ui'

const RANGES = [
  { value: 7, label: '7 days' },
  { value: 30, label: '30 days' },
  { value: 90, label: '90 days' },
  { value: 365, label: '12 months' },
]

export default function AdminDashboard() {
  const { base, isAdmin } = useOutletContext()
  const [days, setDays] = useState(30)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    setError('')
    api
      .get('/dashboard', { params: { days } })
      .then((res) => setStats(res.data))
      .catch(() => setError('Could not load dashboard data.'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [days])

  const rangeLabel = RANGES.find((r) => r.value === days)?.label.toLowerCase()

  const actions = stats
    ? [
        { count: stats.pending_orders, label: 'new orders to confirm', to: `${base}/orders?status=pending` },
        { count: stats.processing_orders, label: 'orders to ship', to: `${base}/orders?status=processing` },
        isAdmin && { count: stats.unpaid_orders, label: 'unpaid orders', to: `${base}/orders?payment_status=unpaid` },
        { count: stats.low_stock_count, label: 'products running low', to: `${base}/stock?filter=low` },
        { count: stats.out_of_stock_count, label: 'products out of stock', to: `${base}/stock?filter=out`, urgent: true },
      ].filter((a) => a && a.count > 0)
    : []

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`Store performance for the last ${rangeLabel}`}
        actions={
          <>
            <div className="flex rounded-md border border-stone-300 bg-white p-0.5" role="group" aria-label="Date range">
              {RANGES.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setDays(r.value)}
                  aria-pressed={days === r.value}
                  className={`rounded px-3 py-1.5 text-sm transition ${days === r.value ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900'}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <button onClick={load} className={btn.icon} aria-label="Refresh">
              <RefreshIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </>
        }
      />

      {error && <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {!stats ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => <div key={i} className="h-32 animate-pulse rounded-lg border border-stone-200 bg-white" />)}
        </div>
      ) : (
        // Refetch keeps the previous render, dimmed, instead of flashing a skeleton.
        <div className={`space-y-6 transition-opacity ${loading ? 'opacity-60' : ''}`}>
          {actions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {actions.map((a) => (
                <Link
                  key={a.label}
                  to={a.to}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
                    a.urgent ? 'border-red-200 bg-red-50 text-red-800 hover:border-red-400' : 'border-amber-200 bg-amber-50 text-amber-900 hover:border-amber-400'
                  }`}
                >
                  <AlertIcon className="h-4 w-4" />
                  <b className="font-semibold">{a.count}</b> {a.label}
                </Link>
              ))}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Revenue" value={compactMoney(stats.revenue)} delta={percentChange(stats.revenue, stats.revenue_prev)} hint={stats.revenue_prev ? 'vs previous period' : 'No sales in the previous period'} />
            <StatCard label="Orders" value={stats.orders.toLocaleString()} delta={percentChange(stats.orders, stats.orders_prev)} hint={stats.orders_prev ? 'vs previous period' : 'No orders in the previous period'} icon={ReceiptIcon} />
            <StatCard label="Average order value" value={money(stats.avg_order_value)} hint="Excludes cancelled orders" />
            <StatCard
              label="New customers"
              value={stats.new_customers.toLocaleString()}
              delta={percentChange(stats.new_customers, stats.new_customers_prev)}
              hint={`${stats.customers.toLocaleString()} customers in total`}
              icon={UsersIcon}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <Card title="Revenue" subtitle={`Excludes cancelled orders · last ${rangeLabel}`} className="xl:col-span-2">
              <SalesChart data={stats.sales} days={stats.days} />
            </Card>
            <Card title="Orders by status" subtitle={`Placed in the last ${rangeLabel}`}>
              <BarList
                format={(v) => v.toLocaleString()}
                empty="No orders in this period."
                items={ORDER_STATUSES.map((s) => ({ key: s.value, label: s.label, value: Number(stats.status_counts?.[s.value] || 0) }))}
              />
              {stats.payment_methods.length > 0 && (
                <div className="mt-6 border-t border-stone-100 pt-4">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Payment methods</h3>
                  <BarList
                    items={stats.payment_methods.map((p) => ({
                      key: p.payment_method,
                      label: `${PAYMENT_METHODS[p.payment_method] || p.payment_method} · ${p.orders}`,
                      value: Number(p.revenue),
                    }))}
                  />
                </div>
              )}
            </Card>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <Card title="Top products" subtitle="By units sold" className="xl:col-span-2" bodyClass="">
              {stats.top_products.length === 0 ? (
                <EmptyState title="No sales yet">Best sellers for this period will show up here.</EmptyState>
              ) : (
                <div className="overflow-x-auto"><table className="w-full text-sm">
                  <thead className="text-left text-xs uppercase tracking-wider text-stone-500">
                    <tr>
                      <th className="px-5 py-3 font-medium">Product</th>
                      <th className="px-5 py-3 text-right font-medium">Units</th>
                      <th className="px-5 py-3 text-right font-medium">Revenue</th>
                      <th className="hidden px-5 py-3 font-medium sm:table-cell">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {stats.top_products.map((p) => (
                      <tr key={`${p.product_id}-${p.name}`}>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <ProductImage src={p.image} alt="" className="h-10 w-10 shrink-0 rounded" />
                            <span className="font-medium text-stone-900">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-right tabular-nums">{Number(p.qty)}</td>
                        <td className="px-5 py-3 text-right tabular-nums">{money(p.revenue)}</td>
                        <td className="hidden px-5 py-3 sm:table-cell">{p.stock != null ? <StockBadge stock={p.stock} /> : <span className="text-stone-400">Deleted</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table></div>
              )}
            </Card>
            <Card title="Sales by category">
              <BarList items={stats.category_sales.map((c) => ({ key: c.name, label: c.name, value: Number(c.revenue) }))} empty="No sales in this period." />
            </Card>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <Card
              title="Recent orders"
              className="xl:col-span-2"
              bodyClass=""
              action={<Link to={`${base}/orders`} className="text-sm text-stone-600 hover:text-stone-900">View all →</Link>}
            >
              {stats.recent_orders.length === 0 ? (
                <EmptyState title="No orders yet" />
              ) : (
                <div className="overflow-x-auto"><table className="w-full text-sm">
                  <tbody className="divide-y divide-stone-100">
                    {stats.recent_orders.map((o) => (
                      <tr key={o.id} className="hover:bg-stone-50">
                        <td className="px-5 py-3">
                          <Link to={`${base}/orders?open=${o.id}`} className="font-medium text-stone-900 hover:underline">#{o.id}</Link>
                          <p className="whitespace-nowrap text-xs text-stone-500">{formatDate(o.created_at)}</p>
                        </td>
                        <td className="px-5 py-3">
                          <p className="text-stone-900">{o.name}</p>
                          <p className="text-xs text-stone-500">{o.items_count} item{o.items_count === 1 ? '' : 's'}</p>
                        </td>
                        <td className="px-5 py-3 text-right tabular-nums">{money(o.total)}</td>
                        <td className="px-5 py-3 text-right"><StatusBadge status={o.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table></div>
              )}
            </Card>

            <Card
              title="Low stock"
              subtitle={`${stats.products} products · ${compactMoney(stats.inventory_value)} inventory value`}
              bodyClass=""
              action={<Link to={`${base}/stock?filter=low`} className="text-sm text-stone-600 hover:text-stone-900">Manage →</Link>}
            >
              {stats.low_stock.length === 0 ? (
                <EmptyState title="All stocked up">
                  <BoxIcon className="mx-auto mt-2 h-6 w-6 text-stone-300" />
                </EmptyState>
              ) : (
                <ul className="divide-y divide-stone-100">
                  {stats.low_stock.map((p) => (
                    <li key={p.id} className="flex items-center gap-3 px-5 py-3">
                      <ProductImage src={p.image} alt="" className="h-10 w-10 shrink-0 rounded" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-stone-900">{p.name}</p>
                        <p className="text-xs text-stone-500">{p.category?.name || 'Uncategorized'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold tabular-nums text-stone-900">{p.stock}</p>
                        <StockBadge stock={p.stock} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import api from '../../services/api'
import ProductImage from '../../components/ProductImage'
import { CheckIcon, PrinterIcon } from '../../components/Icons'
import {
  Drawer, ORDER_STATUSES, PAYMENT_METHODS, PAYMENT_STATUSES, PaymentBadge, StatusBadge,
  btn, errorMessage, formatDate, formatDateTime, inputClass, money, useToast,
} from '../../components/admin/ui'

const FLOW = ['pending', 'processing', 'shipped', 'delivered']

// The next step an operator usually takes from each status.
const NEXT_STEP = {
  pending: { status: 'processing', label: 'Confirm order' },
  processing: { status: 'shipped', label: 'Mark as shipped' },
  shipped: { status: 'delivered', label: 'Mark as delivered' },
}

const escapeHtml = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

function printInvoice(order) {
  const rows = order.items
    .map((i) => `<tr><td>${escapeHtml(i.product_name)}</td><td class="r">${i.qty}</td><td class="r">${money(i.price)}</td><td class="r">${money(i.price * i.qty)}</td></tr>`)
    .join('')
  const w = window.open('', '_blank', 'width=800,height=900')
  if (!w) return
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Invoice #${order.id}</title>
<style>
  body{font-family:Arial,sans-serif;color:#1c1917;margin:40px;font-size:14px}
  h1{font-size:22px;margin:0}.muted{color:#78716c}.r{text-align:right}
  table{width:100%;border-collapse:collapse;margin-top:24px}th,td{padding:8px;border-bottom:1px solid #e7e5e4;text-align:left}
  th{font-size:12px;text-transform:uppercase;color:#78716c}.grid{display:flex;justify-content:space-between;margin-top:24px}
  .total td{font-weight:bold;border-bottom:none;font-size:16px}
</style></head><body>
<div class="grid" style="margin-top:0"><div><h1>Invoice</h1><p class="muted">Order #${order.id} · ${formatDate(order.created_at)}</p></div>
<div class="r"><b>ShopBD</b><p class="muted">Payment: ${escapeHtml(PAYMENT_METHODS[order.payment_method] || order.payment_method)} (${escapeHtml(order.payment_status)})</p></div></div>
<div class="grid"><div><p class="muted">Bill to</p><b>${escapeHtml(order.name)}</b><br>${escapeHtml(order.phone)}<br>${escapeHtml(order.address)}</div></div>
<table><thead><tr><th>Item</th><th class="r">Qty</th><th class="r">Price</th><th class="r">Amount</th></tr></thead>
<tbody>${rows}<tr class="total"><td colspan="3" class="r">Total</td><td class="r">${money(order.total)}</td></tr></tbody></table>
<p class="muted" style="margin-top:40px">Thank you for shopping with us.</p>
</body></html>`)
  w.document.close()
  w.focus()
  w.print()
}

export default function OrderDrawer({ orderId, isAdmin, onClose, onChange }) {
  const notify = useToast()
  const [order, setOrder] = useState(null)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!orderId) return
    setOrder(null)
    api
      .get(`/admin/orders/${orderId}`)
      .then((res) => {
        setOrder(res.data)
        setNote(res.data.admin_note || '')
      })
      .catch((err) => {
        notify(errorMessage(err), 'error')
        onClose()
      })
  }, [orderId])

  const update = async (data, message) => {
    if (data.status === 'cancelled' && !confirm('Cancel this order? Its items will be returned to stock.')) return
    setSaving(true)
    try {
      const res = await api.put(`/admin/orders/${order.id}`, data)
      setOrder(res.data)
      setNote(res.data.admin_note || '')
      notify(message)
      onChange()
    } catch (err) {
      notify(errorMessage(err), 'error')
    } finally {
      setSaving(false)
    }
  }

  const next = order && NEXT_STEP[order.status]
  const step = order ? FLOW.indexOf(order.status) : -1

  return (
    <Drawer
      open={Boolean(orderId)}
      onClose={onClose}
      title={order ? `Order #${order.id}` : 'Order'}
      actions={
        order && (
          <button onClick={() => printInvoice(order)} className={btn.icon} aria-label="Print invoice" title="Print invoice">
            <PrinterIcon className="h-5 w-5" />
          </button>
        )
      }
    >
      {!order ? (
        <div className="space-y-3 p-5">
          {[0, 1, 2].map((i) => <div key={i} className="h-20 animate-pulse rounded bg-stone-100" />)}
        </div>
      ) : (
        <div className="divide-y divide-stone-100">
          <section className="space-y-4 p-5">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={order.status} />
              <PaymentBadge status={order.payment_status} />
              <span className="text-sm text-stone-500">Placed {formatDateTime(order.created_at)}</span>
            </div>

            {order.status !== 'cancelled' && (
              <ol className="grid grid-cols-4 gap-1" aria-label="Order progress">
                {FLOW.map((s, i) => (
                  <li key={s} className="text-center">
                    <div className={`h-1.5 rounded-full ${i <= step ? 'bg-stone-900' : 'bg-stone-200'}`} />
                    <p className={`mt-1.5 text-xs ${i <= step ? 'font-medium text-stone-900' : 'text-stone-400'}`}>
                      {i <= step && <CheckIcon className="mr-0.5 inline h-3 w-3" />}
                      {ORDER_STATUSES.find((x) => x.value === s).label}
                    </p>
                  </li>
                ))}
              </ol>
            )}

            {next && (
              <button disabled={saving} onClick={() => update({ status: next.status }, `Order #${order.id}: ${next.label.toLowerCase()} done`)} className={btn.primary}>
                {next.label}
              </button>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-medium text-stone-500">
                Order status
                <select
                  value={order.status}
                  disabled={saving}
                  onChange={(e) => update({ status: e.target.value }, 'Status updated')}
                  className={`${inputClass} mt-1`}
                >
                  {ORDER_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </label>
              {isAdmin && (
                <label className="text-xs font-medium text-stone-500">
                  Payment status
                  <select
                    value={order.payment_status || 'unpaid'}
                    disabled={saving}
                    onChange={(e) => update({ payment_status: e.target.value }, 'Payment status updated')}
                    className={`${inputClass} mt-1`}
                  >
                    {PAYMENT_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </label>
              )}
            </div>
          </section>

          <section className="p-5">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Items</h3>
            <ul className="space-y-3">
              {order.items.map((i) => (
                <li key={i.id} className="flex items-center gap-3">
                  <ProductImage src={i.product?.image} alt="" className="h-12 w-12 shrink-0 rounded" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-stone-900">{i.product_name}</p>
                    <p className="text-xs text-stone-500">
                      {i.qty} × {money(i.price)}
                      {i.product?.sku && ` · ${i.product.sku}`}
                      {!i.product && ' · product deleted'}
                    </p>
                  </div>
                  <p className="text-sm font-medium tabular-nums">{money(i.qty * i.price)}</p>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-stone-100 pt-3 text-sm">
              <span className="text-stone-500">{PAYMENT_METHODS[order.payment_method] || order.payment_method}</span>
              <span className="font-semibold text-stone-900">Total {money(order.total)}</span>
            </div>
          </section>

          <section className="grid gap-5 p-5 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-500">Shipping</h3>
              <p className="text-sm font-medium text-stone-900">{order.name}</p>
              <a href={`tel:${order.phone}`} className="block text-sm text-stone-700 hover:underline">{order.phone}</a>
              <p className="mt-1 whitespace-pre-line text-sm text-stone-700">{order.address}</p>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-500">Customer account</h3>
              {order.user ? (
                <>
                  <p className="text-sm font-medium text-stone-900">{order.user.name}</p>
                  <a href={`mailto:${order.user.email}`} className="block text-sm text-stone-700 hover:underline">{order.user.email}</a>
                  <p className="mt-1 text-xs text-stone-500">Customer since {formatDate(order.user.created_at)}</p>
                </>
              ) : (
                <p className="text-sm text-stone-500">Account deleted</p>
              )}
            </div>
          </section>

          <section className="p-5">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-500">Staff note</h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Visible to staff only, e.g. courier tracking number"
              className={inputClass}
            />
            <button
              disabled={saving || note === (order.admin_note || '')}
              onClick={() => update({ admin_note: note }, 'Note saved')}
              className={`${btn.secondary} mt-2`}
            >
              Save note
            </button>
          </section>
        </div>
      )}
    </Drawer>
  )
}

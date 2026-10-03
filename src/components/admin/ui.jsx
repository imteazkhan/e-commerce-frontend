import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, SearchIcon } from '../Icons'

// ---------- formatting ----------

export const money = (v) =>
  `৳${Number(v || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`

export const compactMoney = (v) =>
  `৳${Number(v || 0).toLocaleString('en-US', { notation: 'compact', maximumFractionDigits: 1 })}`

export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

export const formatDateTime = (d) =>
  d
    ? new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—'

export const errorMessage = (err) => {
  const data = err?.response?.data
  const first = data?.errors && Object.values(data.errors)[0]
  return (Array.isArray(first) ? first[0] : first) || data?.message || 'Something went wrong. Please try again.'
}

// Laravel paginator responses carry data + meta at the top level.
export const pageMeta = (res) => {
  const { data, counts, ...meta } = res.data
  return { rows: data || [], counts: Array.isArray(counts) ? {} : counts || {}, meta }
}

export function useDebounced(value, delay = 350) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

// ---------- status ----------

export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', tone: 'amber' },
  { value: 'processing', label: 'Processing', tone: 'blue' },
  { value: 'shipped', label: 'Shipped', tone: 'violet' },
  { value: 'delivered', label: 'Delivered', tone: 'green' },
  { value: 'cancelled', label: 'Cancelled', tone: 'red' },
]

export const PAYMENT_STATUSES = [
  { value: 'unpaid', label: 'Unpaid', tone: 'amber' },
  { value: 'paid', label: 'Paid', tone: 'green' },
  { value: 'refunded', label: 'Refunded', tone: 'stone' },
]

export const PAYMENT_METHODS = { cod: 'Cash on delivery', bkash: 'bKash', card: 'Card' }

export const LOW_STOCK = 5

export const stockState = (stock) =>
  stock <= 0
    ? { label: 'Out of stock', tone: 'red' }
    : stock <= LOW_STOCK
      ? { label: 'Low stock', tone: 'amber' }
      : { label: 'In stock', tone: 'green' }

const tones = {
  amber: 'bg-amber-50 text-amber-800 ring-amber-200 [--dot:theme(colors.amber.500)]',
  blue: 'bg-sky-50 text-sky-800 ring-sky-200 [--dot:theme(colors.sky.500)]',
  violet: 'bg-violet-50 text-violet-800 ring-violet-200 [--dot:theme(colors.violet.500)]',
  green: 'bg-emerald-50 text-emerald-800 ring-emerald-200 [--dot:theme(colors.emerald.500)]',
  red: 'bg-red-50 text-red-700 ring-red-200 [--dot:theme(colors.red.500)]',
  stone: 'bg-stone-100 text-stone-700 ring-stone-200 [--dot:theme(colors.stone.400)]',
  gold: 'bg-primary-50 text-primary-800 ring-primary-200 [--dot:theme(colors.primary.500)]',
}

// Always a label next to the color, never color alone.
export function Badge({ tone = 'stone', children }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${tones[tone]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--dot)]" />
      {children}
    </span>
  )
}

export const StatusBadge = ({ status }) => {
  const s = ORDER_STATUSES.find((x) => x.value === status) || { label: status, tone: 'stone' }
  return <Badge tone={s.tone}>{s.label}</Badge>
}

export const PaymentBadge = ({ status }) => {
  const s = PAYMENT_STATUSES.find((x) => x.value === status) || { label: status || 'Unpaid', tone: 'amber' }
  return <Badge tone={s.tone}>{s.label}</Badge>
}

export const StockBadge = ({ stock }) => {
  const s = stockState(stock)
  return <Badge tone={s.tone}>{s.label}</Badge>
}

// ---------- layout pieces ----------

export const inputClass =
  'w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 disabled:bg-stone-50'

export const btn = {
  primary: 'inline-flex items-center justify-center gap-2 rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-black disabled:opacity-50',
  secondary: 'inline-flex items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-800 transition hover:border-stone-900 disabled:opacity-50',
  danger: 'inline-flex items-center justify-center gap-2 rounded-md border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50',
  icon: 'inline-flex h-8 w-8 items-center justify-center rounded-md text-stone-500 transition hover:bg-stone-100 hover:text-stone-900 disabled:opacity-40 disabled:hover:bg-transparent',
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-stone-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function Card({ title, subtitle, action, children, className = '', bodyClass = 'p-5' }) {
  return (
    <section className={`min-w-0 rounded-lg border border-stone-200 bg-white ${className}`}>
      {(title || action) && (
        <header className="flex items-start justify-between gap-3 border-b border-stone-100 px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-stone-900">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs text-stone-500">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={bodyClass}>{children}</div>
    </section>
  )
}

// delta: fraction (0.12 = +12%) or null when there is nothing to compare with.
export function StatCard({ label, value, delta, hint, icon: Icon }) {
  const up = delta > 0
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-500">{label}</p>
        {Icon && <Icon className="h-5 w-5 text-stone-400" />}
      </div>
      <p className="mt-2 text-3xl font-semibold text-stone-900">{value}</p>
      <p className="mt-1 text-xs text-stone-500">
        {delta != null && delta !== 0 && (
          <span className={`mr-1 font-medium ${up ? 'text-emerald-700' : 'text-red-700'}`}>
            {up ? '▲' : '▼'} {Math.abs(delta * 100).toFixed(0)}%
          </span>
        )}
        {hint}
      </p>
    </div>
  )
}

export const percentChange = (current, previous) => (previous ? (current - previous) / previous : null)

export function EmptyState({ title, children }) {
  return (
    <div className="px-6 py-14 text-center">
      <p className="font-medium text-stone-900">{title}</p>
      {children && <p className="mt-1 text-sm text-stone-500">{children}</p>}
    </div>
  )
}

export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <div className="flex min-w-max gap-1 border-b border-stone-200">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            className={`-mb-px flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm transition ${
              value === t.value ? 'border-stone-900 font-medium text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            {t.label}
            {t.count != null && (
              <span className={`rounded-full px-1.5 text-xs tabular-nums ${value === t.value ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'}`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export function SearchBox({ value, onChange, placeholder = 'Search…', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${inputClass} pl-9`} />
    </div>
  )
}

export function Field({ label, hint, error, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-sm font-medium text-stone-700">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-red-700">{error}</span> : hint && <span className="mt-1 block text-xs text-stone-500">{hint}</span>}
    </label>
  )
}

// Works with Laravel paginator meta, or {current_page, last_page, total, from, to} computed client-side.
export function TablePager({ meta, onPage }) {
  if (!meta || !meta.total) return null
  return (
    <div className="flex items-center justify-between gap-3 border-t border-stone-100 px-4 py-3 text-sm text-stone-500">
      <span>
        Showing <b className="font-medium text-stone-900">{meta.from}</b>–<b className="font-medium text-stone-900">{meta.to}</b> of{' '}
        <b className="font-medium text-stone-900">{meta.total}</b>
      </span>
      <div className="flex items-center gap-1">
        <button className={btn.icon} disabled={meta.current_page <= 1} onClick={() => onPage(meta.current_page - 1)} aria-label="Previous page">
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        <span className="px-2 tabular-nums">
          {meta.current_page} / {meta.last_page}
        </span>
        <button className={btn.icon} disabled={meta.current_page >= meta.last_page} onClick={() => onPage(meta.current_page + 1)} aria-label="Next page">
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function paginate(list, page, perPage = 15) {
  const total = list.length
  const last = Math.max(1, Math.ceil(total / perPage))
  const current = Math.min(page, last)
  const start = (current - 1) * perPage
  return {
    rows: list.slice(start, start + perPage),
    meta: { total, current_page: current, last_page: last, from: total ? start + 1 : 0, to: Math.min(start + perPage, total) },
  }
}

// ---------- overlays ----------

function useEscape(open, onClose) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])
}

export function Modal({ open, onClose, title, children, footer, wide = false }) {
  useEscape(open, onClose)
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto p-4 sm:items-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label={title} className={`relative w-full animate-fade-up rounded-lg bg-white shadow-lift ${wide ? 'max-w-3xl' : 'max-w-lg'}`}>
        <header className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
          <h2 className="font-semibold text-stone-900">{title}</h2>
          <button onClick={onClose} className={btn.icon} aria-label="Close">
            <CloseIcon className="h-5 w-5" />
          </button>
        </header>
        <div className="max-h-[70vh] overflow-y-auto p-5">{children}</div>
        {footer && <footer className="flex justify-end gap-2 border-t border-stone-100 px-5 py-4">{footer}</footer>}
      </div>
    </div>
  )
}

export function Drawer({ open, onClose, title, children, actions }) {
  useEscape(open, onClose)
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 animate-fade-in bg-black/50" onClick={onClose} />
      <aside role="dialog" aria-modal="true" aria-label={title} className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col bg-white shadow-lift">
        <header className="flex items-center justify-between gap-3 border-b border-stone-200 px-5 py-4">
          <h2 className="font-semibold text-stone-900">{title}</h2>
          <div className="flex items-center gap-1">
            {actions}
            <button onClick={onClose} className={btn.icon} aria-label="Close">
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </aside>
    </div>
  )
}

// ---------- toasts ----------

const ToastContext = createContext(() => {})

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const notify = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500)
  }, [])

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div aria-live="polite" className="fixed bottom-4 right-4 z-[80] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`animate-fade-up rounded-md px-4 py-3 text-sm shadow-lift ${t.type === 'error' ? 'bg-red-700 text-white' : 'bg-stone-900 text-white'}`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)

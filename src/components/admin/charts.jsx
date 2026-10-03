import { useEffect, useMemo, useRef, useState } from 'react'
import { compactMoney, money } from './ui'

// Single accent for every chart: primary-600 clears 3:1 against the white card.
const BAR = '#a8843e'
const BAR_HOVER = '#cfae6c'
const GRID = '#e7e5e4'

const day = (iso) => new Date(`${iso}T00:00:00`)
const fmt = (d, opts) => d.toLocaleDateString('en-GB', opts)

// Daily for short ranges, weekly for a quarter, monthly for a year.
function bucket(data, days) {
  if (days <= 31) {
    return data.map((d) => ({
      ...d,
      tick: fmt(day(d.date), { day: 'numeric', month: 'short' }),
      label: fmt(day(d.date), { weekday: 'short', day: 'numeric', month: 'short' }),
    }))
  }

  const groups = new Map()
  data.forEach((d, i) => {
    const key = days <= 120 ? Math.floor(i / 7) : d.date.slice(0, 7)
    const g = groups.get(key) || { date: d.date, revenue: 0, orders: 0 }
    g.revenue += d.revenue
    g.orders += d.orders
    groups.set(key, g)
  })

  return [...groups.values()].map((g) =>
    days <= 120
      ? { ...g, tick: fmt(day(g.date), { day: 'numeric', month: 'short' }), label: `Week of ${fmt(day(g.date), { day: 'numeric', month: 'short' })}` }
      : { ...g, tick: fmt(day(g.date), { month: 'short' }), label: fmt(day(g.date), { month: 'long', year: 'numeric' }) }
  )
}

function niceMax(v) {
  if (v <= 0) return 1000
  const pow = 10 ** Math.floor(Math.log10(v))
  const step = [1, 2, 2.5, 5, 10].find((s) => s * pow * 4 >= v) * pow
  return step * 4
}

// Column with a 4px rounded top and a square base.
function columnPath(x, y, w, h) {
  const r = Math.min(4, w / 2, h)
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`
}

export function SalesChart({ data = [], days = 30, height = 260 }) {
  const wrap = useRef(null)
  const [width, setWidth] = useState(0)
  const [active, setActive] = useState(null)

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const points = useMemo(() => bucket(data, days), [data, days])
  const max = niceMax(Math.max(0, ...points.map((p) => p.revenue)))
  const m = { top: 12, right: 8, bottom: 28, left: 52 }
  const innerW = Math.max(0, width - m.left - m.right)
  const innerH = height - m.top - m.bottom
  const slot = points.length ? innerW / points.length : 0
  const barW = Math.max(2, Math.min(24, slot * 0.68))
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max)
  const labelEvery = Math.max(1, Math.ceil(points.length / Math.max(2, Math.floor(innerW / 70))))
  const y = (v) => m.top + innerH - (v / max) * innerH

  const hovered = active != null ? points[active] : null
  const tipLeft = active != null ? Math.min(Math.max(m.left + slot * (active + 0.5), 80), width - 80) : 0

  return (
    <div ref={wrap} className="relative w-full overflow-hidden" style={{ minHeight: height }} onMouseLeave={() => setActive(null)}>
      {width > 0 && <svg width={width} height={height} role="img" aria-label="Revenue over time" className="block">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={m.left} x2={width - m.right} y1={y(t)} y2={y(t)} stroke={GRID} strokeWidth="1" />
            <text x={m.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-stone-500 text-[11px] tabular-nums">
              {compactMoney(t)}
            </text>
          </g>
        ))}

        {points.map((p, i) => {
          const x = m.left + slot * i + (slot - barW) / 2
          const h = (p.revenue / max) * innerH
          return (
            <g key={p.date}>
              {h > 0 && <path d={columnPath(x, y(p.revenue), barW, h)} fill={active === i ? BAR_HOVER : BAR} />}
              {i % labelEvery === 0 && (
                <text x={x + barW / 2} y={height - 8} textAnchor="middle" className="fill-stone-500 text-[11px]">
                  {p.tick}
                </text>
              )}
              {/* Hit area spans the whole slot, not just the painted bar. */}
              <rect
                x={m.left + slot * i}
                y={m.top}
                width={slot}
                height={innerH}
                fill="transparent"
                tabIndex={0}
                aria-label={`${p.label}: ${money(p.revenue)}, ${p.orders} orders`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="cursor-default outline-none"
              />
            </g>
          )
        })}
      </svg>}

      {hovered && (
        <div
          className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-stone-200 bg-white px-3 py-2 text-xs shadow-soft"
          style={{ left: tipLeft }}
        >
          <p className="text-sm font-semibold text-stone-900">{money(hovered.revenue)}</p>
          <p className="text-stone-500">
            {hovered.orders} order{hovered.orders === 1 ? '' : 's'} · {hovered.label}
          </p>
        </div>
      )}

      <table className="sr-only">
        <caption>Revenue by period</caption>
        <thead>
          <tr><th>Period</th><th>Revenue</th><th>Orders</th></tr>
        </thead>
        <tbody>
          {points.map((p) => (
            <tr key={p.date}><td>{p.label}</td><td>{money(p.revenue)}</td><td>{p.orders}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * Horizontal bars for a ranked breakdown. items: [{ key, label, value, display? }].
 */
export function BarList({ items, format = money, empty = 'No data yet.' }) {
  const max = Math.max(0, ...items.map((i) => i.value))
  if (!items.length || max === 0) return <p className="py-6 text-center text-sm text-stone-500">{empty}</p>

  return (
    <ul className="space-y-3">
      {items.map((i) => (
        <li key={i.key ?? i.label} title={`${i.label}: ${format(i.value)}`}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate text-stone-700">{i.label}</span>
            <span className="shrink-0 font-medium tabular-nums text-stone-900">{i.display ?? format(i.value)}</span>
          </div>
          <div className="h-2 rounded-full bg-stone-100">
            <div className="h-2 rounded-full" style={{ width: `${Math.max(2, (i.value / max) * 100)}%`, background: BAR }} />
          </div>
        </li>
      ))}
    </ul>
  )
}

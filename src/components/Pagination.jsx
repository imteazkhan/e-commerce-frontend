import { ChevronLeftIcon, ChevronRightIcon } from './Icons'

function range(start, end) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

// Compact page list with an ellipsis gap, e.g. 1 2 3 4 … 9 10 11
function buildPages(current, total) {
  if (total <= 7) return range(1, total)
  const pages = new Set([1, 2, total - 1, total, current - 1, current, current + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const out = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push(`gap-${p}`)
    out.push(p)
  })
  return out
}

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  const pages = buildPages(page, totalPages)

  return (
    <nav aria-label="Pagination" className="mt-14 flex items-center justify-center gap-2">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Previous page"
        className="flex h-9 w-9 items-center justify-center border border-stone-200 text-stone-500 transition hover:border-stone-900 hover:text-stone-900 disabled:opacity-30 disabled:hover:border-stone-200 disabled:hover:text-stone-500"
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </button>

      {pages.map((p) =>
        typeof p === 'string' ? (
          <span key={p} className="flex h-9 w-9 items-center justify-center text-sm text-stone-400">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`flex h-9 w-9 items-center justify-center border text-sm transition ${
              p === page
                ? 'border-stone-900 bg-stone-900 font-semibold text-white'
                : 'border-stone-200 text-stone-600 hover:border-stone-900 hover:text-stone-900'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Next page"
        className="flex h-9 w-9 items-center justify-center border border-stone-200 text-stone-500 transition hover:border-stone-900 hover:text-stone-900 disabled:opacity-30 disabled:hover:border-stone-200 disabled:hover:text-stone-500"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </button>
    </nav>
  )
}

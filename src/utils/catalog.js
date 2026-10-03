export const formatPrice = (value) =>
  `৳${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

// API responses may be paginated ({ data: [...] }) or a plain array.
export const unwrap = (res) => res.data?.data ?? res.data

// Category may come back as a slug string, a name, or a nested object.
export const categorySlug = (product) => {
  const c = product?.category
  if (!c) return ''
  if (typeof c === 'string') return c.toLowerCase()
  return (c.slug || c.name || '').toLowerCase()
}

export const categoryName = (product) => {
  const c = product?.category
  if (!c) return ''
  return typeof c === 'string' ? c : c.name || ''
}

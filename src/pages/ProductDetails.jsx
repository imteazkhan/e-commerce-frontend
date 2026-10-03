import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'
import ProductImage from '../components/ProductImage'
import {
  ArrowLeftIcon,
  BagIcon,
  CheckIcon,
  ChevronRightIcon,
  HeartIcon,
  MinusIcon,
  PlusIcon,
  ReturnIcon,
  ShieldIcon,
  StarIcon,
  TruckIcon,
} from '../components/Icons'
import { categoryName, categorySlug, formatPrice, unwrap } from '../utils/catalog'

// Collect the main image plus any gallery images (strings or { url }).
function galleryOf(product) {
  const extra = Array.isArray(product.images)
    ? product.images.map((img) => (typeof img === 'string' ? img : img?.url || img?.image))
    : []
  return [...new Set([product.image, ...extra].filter(Boolean))]
}

const tabs = [
  { id: 'description', label: 'Description' },
  { id: 'info', label: 'Additional Information' },
  { id: 'reviews', label: 'Reviews (0)' },
]

function DetailsSkeleton() {
  return (
    <div className="container-page grid gap-10 py-10 lg:grid-cols-2">
      <div className="aspect-square animate-pulse bg-stone-100" />
      <div className="space-y-4 py-4">
        <div className="h-4 w-24 animate-pulse rounded bg-stone-100" />
        <div className="h-10 w-3/4 animate-pulse rounded bg-stone-100" />
        <div className="h-8 w-32 animate-pulse rounded bg-stone-100" />
        <div className="h-24 w-full animate-pulse rounded bg-stone-100" />
        <div className="h-14 w-full animate-pulse rounded-full bg-stone-100" />
      </div>
    </div>
  )
}

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [notFound, setNotFound] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const [tab, setTab] = useState('description')

  useEffect(() => {
    setProduct(null)
    setNotFound(false)
    setActiveImage(0)
    setQty(1)
    setRelated([])
    setWishlisted(false)
    window.scrollTo({ top: 0 })
    let cancelled = false

    api
      .get(`/products/${id}`)
      .then((res) => {
        if (cancelled) return
        const p = unwrap(res)
        setProduct(p)
        const slug = categorySlug(p)
        return api
          .get('/products', { params: slug ? { category: slug } : {} })
          .then((r) => {
            if (cancelled) return
            setRelated(unwrap(r).filter((x) => String(x.id) !== String(id)).slice(0, 4))
          })
          .catch(() => {})
      })
      .catch(() => !cancelled && setNotFound(true))

    return () => {
      cancelled = true
    }
  }, [id])

  if (notFound && !product) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-2xl font-bold text-stone-900">Product not found</h1>
        <p className="mt-2 text-stone-500">It may have been removed or is no longer available.</p>
        <Link to="/products" className="btn-primary mt-8">Back to shop</Link>
      </div>
    )
  }

  if (!product) return <DetailsSkeleton />

  const images = galleryOf(product)
  const hasStock = product.stock !== undefined && product.stock !== null
  const stock = hasStock ? Number(product.stock) : Infinity
  const outOfStock = stock <= 0
  const category = categoryName(product)

  const handleAdd = () => {
    addToCart(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const handleBuyNow = () => {
    addToCart(product, qty)
    navigate('/cart')
  }

  return (
    <div>
      <div className="container-page py-8 sm:py-10">
        {/* Breadcrumbs + back */}
        <div className="flex items-center justify-between gap-4">
          <nav className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500">
            <Link to="/" className="hover:text-stone-900">Home</Link>
            <ChevronRightIcon className="w-3.5 h-3.5" />
            <Link to="/products" className="hover:text-stone-900">Shop</Link>
            {category && (
              <>
                <ChevronRightIcon className="w-3.5 h-3.5" />
                <Link to={`/products?category=${categorySlug(product)}`} className="hover:text-stone-900">
                  {category}
                </Link>
              </>
            )}
            <ChevronRightIcon className="w-3.5 h-3.5" />
            <span className="max-w-[16rem] truncate text-stone-900">{product.name}</span>
          </nav>
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="hidden h-9 w-9 flex-shrink-0 items-center justify-center border border-stone-200 text-stone-500 transition hover:border-stone-900 hover:text-stone-900 sm:flex"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className="overflow-hidden bg-stone-50 ring-1 ring-stone-100">
              <ProductImage
                key={images[activeImage]}
                src={images[activeImage]}
                alt={product.name}
                className="aspect-square w-full animate-fade-up"
              />
            </div>
            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-3">
                {images.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setActiveImage(i)}
                    className={`overflow-hidden ring-2 transition ${
                      i === activeImage ? 'ring-primary-600' : 'ring-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <ProductImage src={src} alt="" className="aspect-square w-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-primary-500">
                  {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} className="h-3.5 w-3.5" filled={false} />)}
                  <span className="ml-1.5 text-xs text-stone-400">(0 reviews)</span>
                </div>
                <h1 className="mt-3 text-2xl font-semibold uppercase leading-snug tracking-wide text-stone-900 sm:text-3xl">
                  {product.name}
                </h1>
              </div>
              <button
                onClick={() => setWishlisted((v) => !v)}
                aria-label="Toggle wishlist"
                aria-pressed={wishlisted}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center border border-stone-200 text-stone-400 transition hover:border-stone-900 hover:text-stone-900"
              >
                <HeartIcon className="h-4 w-4" filled={wishlisted} />
              </button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <p className="text-3xl font-bold text-rose-600">{formatPrice(product.price)}</p>
              {outOfStock ? (
                <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600">
                  Out of stock
                </span>
              ) : hasStock && stock <= 5 ? (
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  Only {stock} left
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  In stock
                </span>
              )}
            </div>

            {product.description && (
              <p className="mt-6 line-clamp-4 leading-relaxed text-stone-600">{product.description}</p>
            )}

            <div className="my-8 h-px bg-stone-100" />

            {/* Quantity + actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex items-center justify-between border border-stone-200 p-1 sm:w-36">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1 || outOfStock}
                  className="flex h-11 w-11 items-center justify-center text-stone-700 hover:bg-stone-100 disabled:opacity-30"
                  aria-label="Decrease quantity"
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-semibold tabular-nums">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(stock, q + 1))}
                  disabled={qty >= stock || outOfStock}
                  className="flex h-11 w-11 items-center justify-center text-stone-700 hover:bg-stone-100 disabled:opacity-30"
                  aria-label="Increase quantity"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAdd}
                disabled={outOfStock}
                className={`btn flex-1 !rounded-none !py-4 ${
                  added ? 'bg-emerald-500 text-white' : 'bg-stone-900 text-white hover:bg-stone-800'
                }`}
              >
                {added ? (
                  <><CheckIcon className="w-5 h-5" strokeWidth={2.2} /> Added to cart</>
                ) : (
                  <><BagIcon className="w-5 h-5" /> Add to cart</>
                )}
              </button>
            </div>

            <button onClick={handleBuyNow} disabled={outOfStock} className="btn-primary mt-3 w-full !rounded-none !py-4">
              Buy it now
            </button>

            <p className="mt-6 text-xs text-stone-500">
              <span className="font-medium text-stone-700">SKU:</span> {product.sku || `#${product.id}`}
              {category && (
                <>
                  <span className="mx-2 text-stone-300">|</span>
                  <span className="font-medium text-stone-700">Categories:</span> {category}
                </>
              )}
            </p>

            {/* Perks */}
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { Icon: TruckIcon, title: 'Free delivery', text: 'On orders over ৳1,000' },
                { Icon: ReturnIcon, title: '7-day returns', text: 'Hassle-free' },
                { Icon: ShieldIcon, title: 'Secure payment', text: 'bKash, Nagad, cards' },
              ].map(({ Icon, title, text }) => (
                <div key={title} className="bg-stone-50 p-4">
                  <Icon className="w-5 h-5 text-primary-600" />
                  <p className="mt-2 text-sm font-semibold text-stone-900">{title}</p>
                  <p className="text-xs text-stone-500">{text}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="mt-10">
              <div className="flex gap-6 border-b border-stone-200">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`-mb-px border-b-2 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                      tab === t.id
                        ? 'border-stone-900 text-stone-900'
                        : 'border-transparent text-stone-400 hover:text-stone-700'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="pt-6 text-sm leading-relaxed text-stone-600">
                {tab === 'description' && (
                  <p className="whitespace-pre-line">{product.description || 'No description available.'}</p>
                )}
                {tab === 'info' && (
                  <table className="w-full text-left text-sm">
                    <tbody className="divide-y divide-stone-100">
                      <tr>
                        <td className="w-40 py-2.5 font-medium text-stone-900">Category</td>
                        <td className="py-2.5 text-stone-600">{category || '—'}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-medium text-stone-900">Availability</td>
                        <td className="py-2.5 text-stone-600">{outOfStock ? 'Out of stock' : 'In stock'}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-medium text-stone-900">SKU</td>
                        <td className="py-2.5 text-stone-600">{product.sku || `#${product.id}`}</td>
                      </tr>
                    </tbody>
                  </table>
                )}
                {tab === 'reviews' && (
                  <p>No reviews yet. Be the first to review this product.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="container-page border-t border-stone-100 py-14">
          <div className="text-center">
            <h2 className="text-2xl font-light tracking-wide text-stone-900 sm:text-3xl">Related Products</h2>
            <span className="mx-auto mt-3 block h-0.5 w-12 bg-stone-900" />
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/products?featured=1'),
      api.get('/products?sort=new'),
    ])
      .then(([f, n]) => {
        setFeatured(f.data.data || f.data)
        setNewArrivals((n.data.data || n.data).slice(0, 4))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const categories = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Home & Living', slug: 'home' },
    { name: 'Beauty', slug: 'beauty' },
    { name: 'Sports', slug: 'sports' },
    { name: 'Books', slug: 'books' },
  ]

  const features = [
    {
      title: 'Fast Delivery',
      text: 'Delivery within 24 to 48 hours inside Dhaka.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm10 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 0 0-1-1H3v11h10zM13 9h4l4 4v3h-8V9z" />
        </svg>
      ),
    },
    {
      title: 'Secure Payment',
      text: 'bKash, Nagad and card payments accepted.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l8 4v5c0 5-3.4 8.5-8 9-4.6-.5-8-4-8-9V7l8-4z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
    {
      title: 'Easy Return',
      text: '7 day return policy on all products.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10a9 9 0 1 1 3 6.7" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4v6h6" />
        </svg>
      ),
    },
    {
      title: 'Support 24/7',
      text: 'Our support team is always available.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 10a6 6 0 0 0-12 0v4a3 3 0 0 0 3 3h1v-5H7m11 0h-3v5h1a3 3 0 0 0 3-3v-4z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="bg-white">
      {/* Hero section */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-xs font-semibold text-primary uppercase tracking-wider mb-4">
                New Season Arrivals
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Shop Smarter,<br />
                Live Better.
              </h1>
              <p className="mt-5 text-gray-600 text-lg max-w-md leading-relaxed">
                Discover quality products at honest prices. Delivered to your
                door anywhere in Bangladesh.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="px-6 py-3 bg-primary text-white text-sm font-semibold rounded-md hover:bg-blue-800 transition-colors"
                >
                  Shop Now
                </Link>
                <Link
                  to="/products?sort=new"
                  className="px-6 py-3 border border-gray-300 text-gray-900 text-sm font-semibold rounded-md hover:border-gray-900 transition-colors"
                >
                  Explore New
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
                <div>
                  <p className="text-2xl font-bold text-gray-900">10K+</p>
                  <p className="text-xs text-gray-500 mt-1">Products</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">50K+</p>
                  <p className="text-xs text-gray-500 mt-1">Customers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">4.8</p>
                  <p className="text-xs text-gray-500 mt-1">Rating</p>
                </div>
              </div>
            </div>

            {/* Hero image block */}
            <div className="hidden md:block">
              <div className="aspect-square max-w-md mx-auto border border-gray-200 rounded-lg p-8 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto border-2 border-gray-300 rounded-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p className="mt-6 text-sm text-gray-500">
                    Quality products, honest prices
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 border border-gray-200 rounded-md flex items-center justify-center text-primary">
                {f.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{f.title}</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Shop by Category
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Find exactly what you need
            </p>
          </div>
          <Link
            to="/products"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to={`/products?category=${c.slug}`}
              className="group border border-gray-200 rounded-md p-6 text-center hover:border-primary transition-colors"
            >
              <div className="w-12 h-12 mx-auto border border-gray-200 rounded-full flex items-center justify-center group-hover:border-primary transition-colors">
                <svg className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <p className="mt-3 text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
                {c.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Featured Products
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Hand picked for you
            </p>
          </div>
          <Link
            to="/products"
            className="text-sm font-medium text-primary hover:underline"
          >
            See all
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-md h-72 animate-pulse bg-gray-50"
              ></div>
            ))}
          </div>
        ) : featured.length === 0 ? (
          <p className="text-sm text-gray-500">No featured products yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Promo banner */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="border border-gray-200 rounded-lg p-8 md:p-12 bg-gray-900 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Limited Time
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-3 leading-tight">
                Up to 40% off on<br />selected items
              </h2>
              <p className="text-gray-400 mt-4 text-sm max-w-md">
                Grab your favourite products before the offer ends. Free
                shipping on orders above 1000 Tk.
              </p>
              <Link
                to="/products?discount=1"
                className="mt-6 inline-block px-6 py-3 bg-white text-gray-900 text-sm font-semibold rounded-md hover:bg-gray-100 transition-colors"
              >
                Shop the Sale
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="aspect-video border border-gray-700 rounded-md flex items-center justify-center">
                <p className="text-gray-500 text-sm">Sale Banner</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="max-w-7xl mx-auto px-4 py-10 pb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              New Arrivals
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Freshly added to the store
            </p>
          </div>
          <Link
            to="/products?sort=new"
            className="text-sm font-medium text-primary hover:underline"
          >
            See all
          </Link>
        </div>

        {newArrivals.length === 0 ? (
          <p className="text-sm text-gray-500">No products yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Stay Updated
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Get notified about new arrivals and exclusive offers.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-6 flex border border-gray-300 rounded-md overflow-hidden focus-within:border-primary"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 text-sm outline-none"
                required
              />
              <button
                type="submit"
                className="bg-primary text-white px-6 text-sm font-semibold hover:bg-blue-800 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
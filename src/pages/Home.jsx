import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard'
import { ChevronLeftIcon, ChevronRightIcon } from '../components/Icons'
import { unwrap } from '../utils/catalog'
import { useCategories } from '../context/CategoryContext'

const giftCards = [
  {
    amount: 2000, serial: '10001', tier: 'Infinity Privilege',
    card: 'bg-gradient-to-br from-[#ffe082] via-[#ffd54f] to-[#ffb300] border-amber-300 text-stone-900',
    sub: 'text-stone-800', title: 'text-stone-900', brand: '',
    seal: 'border-dashed border-amber-900/60 bg-amber-400/40 text-stone-900',
  },
  {
    amount: 1000, serial: '0001', tier: 'Infinity Club',
    card: 'bg-gradient-to-br from-[#26c6da] via-[#00acc1] to-[#007c91] border-cyan-400 text-white',
    sub: 'text-cyan-100', title: 'text-white', brand: '',
    seal: 'border-white/60 bg-cyan-800/40 text-white',
  },
  {
    amount: 500, serial: '1000001', tier: 'Infinity Club',
    card: 'bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 border-gray-300 text-gray-800',
    sub: 'text-gray-600', title: 'text-emerald-800', brand: 'text-stone-700',
    seal: 'border-emerald-700/50 bg-white/70 text-emerald-900',
  },
  {
    amount: 5000, serial: '20001', tier: 'ShopBD Elite',
    card: 'bg-gradient-to-br from-[#311b92] via-[#1a237e] to-[#000051] border-purple-900 text-white',
    sub: 'text-purple-200', title: 'text-amber-300', brand: 'text-amber-300',
    seal: 'border-amber-400 bg-purple-950/60 text-amber-300',
  },
]

function SectionDivider({ children }) {
  return (
    <div className="section-divider my-8">
      <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.3em] text-gray-900">{children}</h2>
    </div>
  )
}

function HeroCarousel({ slides }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const go = (delta) => setIndex((i) => (i + delta + slides.length) % slides.length)

  useEffect(() => {
    if (paused || slides.length < 2) return
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000)
    return () => clearInterval(t)
  }, [paused, slides.length])

  if (!slides.length) return null
  // The slide list can shrink when staff hide an image.
  const current = index % slides.length
  const slide = slides[current]

  return (
    <section
      className="relative overflow-hidden bg-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div className="relative flex min-h-[460px] w-full items-center bg-gradient-to-r from-black via-[#0d0d0d] to-black lg:min-h-[580px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(197,160,89,0.25),transparent_60%)] opacity-40" />

        <button
          onClick={() => go(-1)}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-stone-800 bg-black/60 text-white/80 transition-all hover:bg-black/90 hover:text-white lg:left-6"
        >
          <ChevronLeftIcon className="h-4 w-4" strokeWidth={2.2} />
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-stone-800 bg-black/60 text-white/80 transition-all hover:bg-black/90 hover:text-white lg:right-6"
        >
          <ChevronRightIcon className="h-4 w-4" strokeWidth={2.2} />
        </button>

        <div
          key={current}
          className="mx-auto flex w-full max-w-[1400px] flex-col items-center justify-between gap-10 px-12 py-12 lg:flex-row lg:px-16"
        >
          <div className="z-10 max-w-xl animate-fade-up select-none text-center lg:text-left">
            <h2 className="mb-1 font-serif text-2xl font-light uppercase tracking-[0.35em] text-[#d4af37] drop-shadow-md sm:text-3xl lg:text-4xl">
              {slide.eyebrow}
            </h2>
            <h1 className="-mt-2 font-script text-6xl font-normal leading-none tracking-wide text-white drop-shadow-lg sm:-mt-4 sm:text-7xl lg:text-8xl">
              {slide.title}
            </h1>
            <p className="mx-auto mt-4 max-w-md text-xs uppercase tracking-widest text-stone-400 sm:text-sm lg:mx-0">
              {slide.text}
            </p>
            {slide.cta && slide.link && (
              <div className="mt-8">
                <Link to={slide.link} className="btn-gold-outline">
                  {slide.cta}
                </Link>
              </div>
            )}
          </div>

          <div className="relative z-10 flex animate-fade-in items-center justify-center">
            <div className="group relative h-[280px] w-[280px] sm:h-[400px] sm:w-[400px] lg:h-[480px] lg:w-[480px]">
              <img
                src={slide.image}
                alt={slide.alt}
                className="h-full w-full rounded-full border-4 border-brand-gold/40 object-cover shadow-gold transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-black/40 via-transparent to-amber-400/10" />
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'w-8 bg-brand-gold' : 'w-1.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductRow({ loading, products }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    )
  }
  if (products.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="font-serif text-sm italic text-gray-400">No Product</p>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [loading, setLoading] = useState(true)
  const [banners, setBanners] = useState(null) // home page images, chosen in the admin/manager panel
  const { activeCategories, loading: categoriesLoading } = useCategories()

  // Staff choose which images show; if one links to a paused or deleted category,
  // keep the image but drop the link so shoppers don't land on an empty page.
  const isLive = (link) => {
    const slug = new URLSearchParams((link || '').split('?')[1]).get('category')
    return !slug || categoriesLoading || activeCategories.some((a) => a.slug === slug)
  }
  const section = (name) =>
    (banners || []).filter((b) => b.section === name).map((b) => (isLive(b.link) ? b : { ...b, link: null }))
  const liveSlides = section('hero')
  const tiles = section('tile')
  const lifestyle = section('lifestyle')
  const editorial = section('editorial')

  useEffect(() => {
    api
      .get('/home-banners')
      .then((res) => setBanners(unwrap(res) || []))
      .catch(() => setBanners([]))
  }, [])

  useEffect(() => {
    Promise.all([
      api.get('/products?featured=1'),
      api.get('/products?sort=new'),
    ])
      .then(([f, n]) => {
        setFeatured(unwrap(f).slice(0, 8))
        setNewArrivals(unwrap(n).slice(0, 4))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Keep the slider's space while images load so the page doesn't jump. */}
      {banners === null ? <div className="min-h-[460px] bg-black lg:min-h-[580px]" /> : <HeroCarousel slides={liveSlides} />}

      {/* Featured categories */}
      {tiles.length > 0 && (
      <section className="container-page py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {tiles.map((c) => (
            <article key={c.id} className="group relative h-[520px] overflow-hidden shadow-sm lg:h-[590px]">
              <img
                src={c.image}
                alt={c.alt || c.title || ''}
                className="h-full w-full object-cover object-top transition-transform duration-700 ease-in-out group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 pb-12 text-center">
                <div className="border-y border-white/50 px-6 py-2 backdrop-blur-[2px] transition-all group-hover:border-white">
                  {c.link && <span className="mb-0.5 block text-[11px] uppercase tracking-[0.25em] text-gray-200">Shop Now</span>}
                  <h3 className="font-serif text-2xl font-medium tracking-wide text-white lg:text-3xl">{c.title}</h3>
                </div>
              </div>
              {c.link && <Link to={c.link} aria-label={`Browse ${c.title}`} className="absolute inset-0" />}
            </article>
          ))}
        </div>
      </section>
      )}

      {/* Summer collection */}
      <section id="summer-collection" className="container-page py-8">
        <SectionDivider>Summer Collection</SectionDivider>
        <ProductRow loading={loading} products={featured} />
        {!loading && featured.length > 0 && (
          <div className="mt-10 text-center">
            <Link to="/products" className="btn-outline">View all</Link>
          </div>
        )}
      </section>

      {/* New arrivals */}
      {(loading || newArrivals.length > 0) && (
        <section className="container-page py-8">
          <SectionDivider>New Arrival</SectionDivider>
          <ProductRow loading={loading} products={newArrivals} />
        </section>
      )}

      {/* Gift cards */}
      <section className="container-page py-10">
        <SectionDivider>Gift Card</SectionDivider>
        <div className="grid grid-cols-1 gap-6 pt-4 sm:grid-cols-2 lg:grid-cols-4">
          {giftCards.map((g) => (
            <article key={g.amount} className="group flex cursor-pointer flex-col">
              <div
                className={`relative flex aspect-[16/10] w-full flex-col justify-between overflow-hidden rounded-xl border p-5 shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg ${g.card}`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[10px] opacity-70">SN No: {g.serial}</span>
                  <span className={`font-serif text-xs font-bold italic ${g.brand}`}>ShopBD</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-[10px] uppercase tracking-widest ${g.sub}`}>Prepaid</p>
                    <h4 className={`font-script text-3xl font-bold leading-none ${g.title}`}>Gift Card</h4>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-xs font-bold shadow-inner ${g.seal}`}>
                    {g.amount}
                  </div>
                </div>
                <div className={`text-right text-[8px] font-semibold uppercase tracking-wider opacity-80 ${g.brand}`}>
                  {g.tier}
                </div>
              </div>
              <div className="mt-4 text-left">
                <h5 className="text-xs font-normal text-gray-700">Gift Card-{g.amount}</h5>
                <p className="mt-1 text-xs font-bold text-black">
                  ৳{g.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Lifestyle gallery */}
      {lifestyle.length > 0 && (
      <section className="container-page py-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {lifestyle.map((l) => (
            <div key={l.id} className="group relative aspect-[4/5] overflow-hidden shadow-sm sm:aspect-auto sm:h-[580px]">
              <img
                src={l.image}
                alt={l.alt || ''}
                loading="lazy"
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          ))}
        </div>
      </section>
      )}

      {/* Editorial */}
      {editorial.length > 0 && (
      <section className="container-page pb-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {editorial.map((e) => (
            <div key={e.id} className="group relative h-[320px] overflow-hidden shadow-sm sm:h-[380px]">
              <img
                src={e.image}
                alt={e.alt || e.title || ''}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 p-6 text-center transition-colors group-hover:bg-black/35">
                {e.title && <h3 className="mb-2 font-serif text-3xl tracking-wider text-white sm:text-4xl">{e.title}</h3>}
                {e.link && (
                  <Link to={e.link} className="text-xs font-light uppercase tracking-widest text-white/90 underline underline-offset-4 hover:text-white">
                    Read more
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      )}
    </div>
  )
}

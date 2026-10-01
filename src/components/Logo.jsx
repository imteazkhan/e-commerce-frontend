import { Link } from 'react-router-dom'

export default function Logo({ light = true, className = '' }) {
  return (
    <Link to="/" className={`group flex flex-col items-center ${className}`}>
      <span
        className={`font-serif text-2xl font-bold uppercase tracking-widest transition-colors lg:text-3xl ${
          light ? 'text-white group-hover:text-amber-200' : 'text-black'
        }`}
      >
        ShopBD
      </span>
      <span
        className={`-mt-1 text-[9px] font-light uppercase tracking-[0.45em] ${
          light ? 'text-gray-400' : 'text-gray-600'
        }`}
      >
        menswear
      </span>
    </Link>
  )
}

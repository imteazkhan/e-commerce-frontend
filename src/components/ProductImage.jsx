import { useState } from 'react'
import { ImageIcon } from './Icons'

// Product image with a styled fallback when the URL is missing or broken.
export default function ProductImage({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200 text-stone-400 ${className}`}
      >
        <ImageIcon className="w-10 h-10" strokeWidth={1.4} />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  )
}

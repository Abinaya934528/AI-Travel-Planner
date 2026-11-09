import { useState } from 'react'
import { FALLBACK_IMAGE } from '../data/destinations'

interface DestinationImageProps {
  src: string
  alt: string
  className?: string
}

export function DestinationImage({ src, alt, className }: DestinationImageProps) {
  const [current, setCurrent] = useState(src || FALLBACK_IMAGE)

  return (
    <img
      src={current}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => {
        if (current !== FALLBACK_IMAGE) setCurrent(FALLBACK_IMAGE)
      }}
    />
  )
}

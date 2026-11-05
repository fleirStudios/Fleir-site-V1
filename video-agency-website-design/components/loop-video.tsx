'use client'

import { useEffect, useRef } from 'react'

export function LoopVideo({ opacity = 1 }: { opacity?: number }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      video.pause()
      return
    }

    video.muted = true
    const tryPlay = () => video.play().catch(() => {})
    tryPlay()
    video.addEventListener('canplay', tryPlay)
    return () => video.removeEventListener('canplay', tryPlay)
  }, [])

  return (
    <video
      ref={ref}
      className="absolute inset-0 size-full object-cover object-center"
      style={{ opacity }}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
    >
      <source src="/videos/boucle-fleir.webm" type="video/webm" />
      <source src="/videos/boucle-fleir.mp4" type="video/mp4" />
    </video>
  )
}

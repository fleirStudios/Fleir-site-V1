'use client'

import { useEffect, useState } from 'react'

const layer = 'transition-all duration-500 ease-[cubic-bezier(0.65,0,0.25,1)] [grid-area:1/1]'

export function FlairWord() {
  const [showFleir, setShowFleir] = useState(false)

  useEffect(() => {
    const interval = window.setInterval(() => setShowFleir((current) => !current), 4000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <span
      aria-live="polite"
      className="inline-grid rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span
        className={`${layer} ${showFleir ? '-translate-y-[0.5em] opacity-0' : 'translate-y-0 opacity-100'}`}
      >
        flair
      </span>
      <span
        aria-hidden={!showFleir}
        className={`${layer} ${showFleir ? 'translate-y-0 text-primary opacity-100' : 'translate-y-[0.5em] opacity-0'}`}
      >
        Fleir
      </span>
    </span>
  )
}

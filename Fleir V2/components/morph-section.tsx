'use client'

import { useEffect, useRef, useState } from 'react'
import { Hero } from '@/components/hero'
import { MorphDevice } from '@/components/morph-device'

const INTRO_VH = 55
const PHONE_VH = 42
const LAPTOP_VH = 42
const TV_VH = 36
const EXPAND_VH = 64
const VISION_VH = 130
const TOTAL_SCROLL_VH = INTRO_VH + PHONE_VH + LAPTOP_VH + TV_VH + EXPAND_VH + VISION_VH

const clamp = (value: number) => Math.min(1, Math.max(0, value))
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

const phoneHalfW = 'min(18svh, 34vw)'

export function MorphSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [expanding, setExpanding] = useState(false)
  const [phoneCopy, setPhoneCopy] = useState(0)
  const [laptopCopy, setLaptopCopy] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const citiesRef = useRef<HTMLParagraphElement>(null)
  const deviceRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = document.documentElement
    let frame = 0

    function update() {
      frame = 0
      const section = sectionRef.current
      const hero = heroRef.current
      const cities = citiesRef.current
      const device = deviceRef.current
      if (!section || !hero || !cities || !device) return

      const vh = window.innerHeight / 100
      const scrolled = Math.max(0, -section.getBoundingClientRect().top) / vh
      const intro = clamp(scrolled / INTRO_VH)
      const afterIntro = scrolled - INTRO_VH
      const laptop = clamp((afterIntro - PHONE_VH) / LAPTOP_VH)
      const tv = clamp((afterIntro - PHONE_VH - LAPTOP_VH) / TV_VH)
      const expandProgress = clamp((afterIntro - PHONE_VH - LAPTOP_VH - TV_VH) / EXPAND_VH)
      const vision = clamp((afterIntro - PHONE_VH - LAPTOP_VH - TV_VH - EXPAND_VH) / VISION_VH)
      const easedIntro = 1 - Math.pow(1 - intro, 3)

      const heroOpacity = String(1 - clamp(intro * 1.6))
      hero.style.opacity = heroOpacity
      hero.style.transform = reduceMotion ? '' : `scale(${1 - easedIntro * 0.4})`
      cities.style.opacity = heroOpacity

      device.style.opacity = String(clamp(intro * 1.5))
      const introScale = expandProgress > 0.02 ? 1 : 2.8 - easedIntro * 1.8
      device.style.transform = reduceMotion ? '' : `scale(${introScale})`

      const videoFade = easeInOut(clamp((vision - 0.7) / 0.3))
      const headline = clamp((tv - 0.25) / 0.5) * (1 - clamp(vision / 0.15))
      device.style.setProperty('--expand', easeInOut(expandProgress).toFixed(4))
      device.style.setProperty('--video-opacity', (1 - videoFade).toFixed(3))
      device.style.setProperty('--dim', (0.42 * clamp(vision / 0.2)).toFixed(3))
      device.style.setProperty('--headline', headline.toFixed(3))

      let stage = 0
      if (tv > 0 || expandProgress > 0 || vision > 0) stage = 2
      else if (laptop > 0) stage = 1

      setActiveIndex(stage)
      setExpanding(expandProgress > 0.005)
      setPhoneCopy(stage === 0 && intro > 0.45 ? clamp((intro - 0.45) / 0.3) * (1 - laptop) : 0)
      setLaptopCopy(stage === 1 ? clamp(laptop / 0.25) * (1 - tv) : 0)

      root.style.setProperty('--about-opacity', clamp(vision / 0.12).toFixed(3))
      root.style.setProperty('--about-video', (vision > 0 ? 1 - videoFade : 0).toFixed(3))
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
      root.style.removeProperty('--about-opacity')
      root.style.removeProperty('--about-video')
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-label="Fleir et nos formats"
      className="relative"
      style={{ height: `${100 + TOTAL_SCROLL_VH}svh` }}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div ref={deviceRef} className="opacity-0 will-change-transform">
            <MorphDevice activeIndex={activeIndex} expanding={expanding} />
          </div>
        </div>

        <p
          className="pointer-events-none absolute bottom-[6svh] left-1/2 z-10 w-[min(16ch,86vw)] text-center font-medium tracking-tight text-foreground md:hidden"
          style={{
            fontSize: 'clamp(1.5rem, 6.6vw, 2rem)',
            lineHeight: 1.1,
            opacity: phoneCopy,
            transform: `translate(-50%, ${10 * (1 - phoneCopy)}px)`,
          }}
        >
          À portée de <span className="text-primary">pouce</span>.
        </p>

        <p
          className="pointer-events-none absolute top-1/2 z-10 hidden w-[min(9ch,26vw)] text-left font-medium tracking-tight text-foreground md:block"
          style={{
            left: `calc(50% + ${phoneHalfW} + 4vw)`,
            fontSize: 'clamp(1.6rem, 3.2vw, 3.35rem)',
            lineHeight: 1.05,
            opacity: phoneCopy,
            transform: `translate(${-16 * (1 - phoneCopy)}px, -50%)`,
          }}
        >
          À portée de <span className="text-primary">pouce</span>.
        </p>

        <p
          className="pointer-events-none absolute top-1/2 right-[4.5vw] z-10 hidden w-[min(11ch,28vw)] text-right font-medium tracking-tight text-foreground md:block"
          style={{
            fontSize: 'clamp(1.6rem, 3.2vw, 3.35rem)',
            lineHeight: 1.05,
            opacity: laptopCopy,
            transform: `translate(${16 * (1 - laptopCopy)}px, -50%)`,
          }}
        >
          Être visible, <span className="text-primary">partout</span>.
        </p>

        <p
          className="pointer-events-none absolute bottom-[12svh] left-1/2 z-10 w-[min(16ch,86vw)] text-center font-medium tracking-tight text-foreground md:hidden"
          style={{
            fontSize: 'clamp(1.5rem, 6.6vw, 2rem)',
            lineHeight: 1.1,
            opacity: laptopCopy,
            transform: `translate(-50%, ${10 * (1 - laptopCopy)}px)`,
          }}
        >
          Être visible, <span className="text-primary">partout</span>.
        </p>

        <div
          ref={heroRef}
          className="pointer-events-none absolute inset-0 flex origin-left items-center px-6 will-change-transform md:px-12 lg:px-20"
        >
          <Hero />
        </div>

        <p
          ref={citiesRef}
          className="pointer-events-none absolute top-6 right-6 z-10 text-base font-medium tracking-tight text-muted-foreground md:top-10 md:right-12 md:text-xl lg:right-20"
        >
          Paris · Bordeaux
        </p>
      </div>
    </section>
  )
}

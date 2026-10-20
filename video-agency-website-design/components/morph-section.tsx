'use client'

import { useEffect, useRef, useState } from 'react'
import { Hero } from '@/components/hero'
import { MorphDevice } from '@/components/morph-device'

const INTRO_VH = 55
const PHONE_VH = 42
const LAPTOP_VH = 42
const TV_VH = 32
const EXPAND_VH = 58
const FADE_VH = 52
const TOTAL_SCROLL_VH = INTRO_VH + PHONE_VH + LAPTOP_VH + TV_VH + EXPAND_VH + FADE_VH

const clamp = (value: number) => Math.min(1, Math.max(0, value))

export function MorphSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [expand, setExpand] = useState(0)
  const [videoOpacity, setVideoOpacity] = useState(1)
  const [phoneCopy, setPhoneCopy] = useState(0)
  const [laptopCopy, setLaptopCopy] = useState(0)
  const [grandCopy, setGrandCopy] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const deviceRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0

    function update() {
      frame = 0
      const section = sectionRef.current
      const hero = heroRef.current
      const device = deviceRef.current
      if (!section || !hero || !device) return

      const vh = window.innerHeight / 100
      const scrolled = Math.max(0, -section.getBoundingClientRect().top) / vh
      const intro = clamp(scrolled / INTRO_VH)
      const afterIntro = scrolled - INTRO_VH
      const laptop = clamp((afterIntro - PHONE_VH) / LAPTOP_VH)
      const tv = clamp((afterIntro - PHONE_VH - LAPTOP_VH) / TV_VH)
      const expandProgress = clamp((afterIntro - PHONE_VH - LAPTOP_VH - TV_VH) / EXPAND_VH)
      const fade = clamp((afterIntro - PHONE_VH - LAPTOP_VH - TV_VH - EXPAND_VH) / FADE_VH)
      const easedIntro = 1 - Math.pow(1 - intro, 3)

      hero.style.opacity = String(1 - clamp(intro * 1.6))
      hero.style.transform = reduceMotion ? '' : `scale(${1 - easedIntro * 0.4})`

      device.style.opacity = String(clamp(intro * 1.5) * (1 - fade))
      const introScale = expandProgress > 0.02 ? 1 : 2.8 - easedIntro * 1.8
      device.style.transform = reduceMotion ? '' : `scale(${introScale})`

      let stage = 0
      if (tv > 0 || expandProgress > 0 || fade > 0) stage = 2
      else if (laptop > 0) stage = 1

      setActiveIndex(stage)
      setExpand(Math.round(expandProgress * 50) / 50)
      setVideoOpacity(Math.round((1 - fade) * 50) / 50)
      setPhoneCopy(stage === 0 && intro > 0.45 ? clamp((intro - 0.45) / 0.3) * (1 - laptop) : 0)
      setLaptopCopy(stage === 1 ? clamp(laptop / 0.25) * (1 - tv) : 0)
      setGrandCopy(clamp((expandProgress - 0.12) / 0.28) * (1 - clamp((fade - 0.05) / 0.35)))

      document.documentElement.style.setProperty(
        '--about-opacity',
        clamp(expandProgress * 0.22 + fade).toFixed(3),
      )
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
      document.documentElement.style.removeProperty('--about-opacity')
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
            <MorphDevice activeIndex={activeIndex} expand={expand} videoOpacity={videoOpacity} />
          </div>
        </div>

        <p
          className="pointer-events-none absolute bottom-[5.5svh] left-1/2 z-10 w-[min(16ch,86vw)] -translate-x-1/2 text-center font-medium tracking-tight text-foreground"
          style={{
            fontSize: 'clamp(1.35rem, 6.2vw, 2rem)',
            opacity: phoneCopy,
            transform: `translate(-50%, ${8 * (1 - phoneCopy)}px)`,
          }}
        >
          À portée de pouce.
        </p>

        <p
          className="pointer-events-none absolute top-1/2 right-[4.5vw] z-10 hidden w-[min(11ch,28vw)] -translate-y-1/2 text-right font-medium tracking-tight text-foreground md:block"
          style={{
            fontSize: 'clamp(1.6rem, 3.2vw, 3.35rem)',
            lineHeight: 1.05,
            opacity: laptopCopy,
            transform: `translate(${16 * (1 - laptopCopy)}px, -50%)`,
          }}
        >
          Être visible, partout.
        </p>

        <p
          className="pointer-events-none absolute top-1/2 left-1/2 z-10 w-[min(18ch,90vw)] -translate-x-1/2 -translate-y-1/2 text-center font-medium tracking-tight text-white mix-blend-overlay md:hidden"
          style={{
            fontSize: 'clamp(1.6rem, 7vw, 2.4rem)',
            lineHeight: 1.05,
            opacity: laptopCopy * 0.9,
          }}
        >
          Être visible, partout.
        </p>

        <p
          className="pointer-events-none absolute inset-x-0 top-[18%] z-10 text-center font-medium tracking-tight text-white/55"
          style={{
            fontSize: 'clamp(2.4rem, 9vw, 8.5rem)',
            letterSpacing: '-0.04em',
            opacity: grandCopy,
            textShadow: '0 8px 40px rgba(0,0,0,0.22)',
          }}
        >
          Voyez plus grand
        </p>

        <div
          ref={heroRef}
          className="pointer-events-none absolute inset-0 flex origin-left items-center px-6 will-change-transform md:px-12 lg:px-20"
        >
          <Hero />
        </div>
      </div>
    </section>
  )
}

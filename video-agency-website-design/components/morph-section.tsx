'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Hero } from '@/components/hero'
import { MorphDevice } from '@/components/morph-device'

const INTRO_VH = 55
const PHONE_VH = 42
const LAPTOP_VH = 42
const TV_VH = 24
const EXPAND_VH = 72
const VISION_VH = 180
const TOTAL_SCROLL_VH = INTRO_VH + PHONE_VH + LAPTOP_VH + TV_VH + EXPAND_VH + VISION_VH

// Le texte « À propos » (dans <Contact />) commence à remonter sur la vidéo
// 127svh avant la fin de la phase d'animation, comme avant.
const ABOUT_OVERLAP_VH = 200
const CONTENT_START_VH = 100 + TOTAL_SCROLL_VH - ABOUT_OVERLAP_VH

// Vidéo de fond après l'animation de la télé :
// - elle s'estompe sur TOUTE la phase « vision » (au lieu des 30 % finaux),
// - puis elle reste à cette opacité plancher jusqu'en bas de la page.
const VIDEO_FLOOR = 0.5 // 0 = disparaît complètement, 1 = pleinement visible
const VIDEO_FADE_START = 0.24 // garde la vidéo visible plus longtemps avant l'estompage

const clamp = (value: number) => Math.min(1, Math.max(0, value))
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const smooth = (t: number) => t * t * (3 - 2 * t)

const phoneHalfW = 'min(18svh, 34vw)'

function CopyBlock({
  title,
  subtitle,
  compact = false,
}: {
  title: ReactNode
  subtitle: string
  compact?: boolean
}) {
  return (
    <>
      <span
        className="block font-medium tracking-tight text-foreground"
        style={{
          fontSize: compact ? 'clamp(1.35rem, 6vw, 1.85rem)' : 'clamp(1.4rem, 2.5vw, 2.9rem)',
          lineHeight: 1.08,
        }}
      >
        {title}
      </span>
      <span
        className="mt-2 block font-normal tracking-tight text-muted-foreground md:mt-3"
        style={{
          fontSize: compact ? 'clamp(0.95rem, 4vw, 1.15rem)' : 'clamp(1rem, 1.3vw, 1.5rem)',
          lineHeight: 1.3,
        }}
      >
        {subtitle}
      </span>
    </>
  )
}

const phoneTitle = (
  <>
    Package <span className="text-primary">Social Media</span>
  </>
)
const phoneSubtitle = 'Votre histoire dans le creux de la main'

const laptopTitle = (
  <>
    Vulgariser les <span className="text-primary">récits complexes</span>
  </>
)
const laptopSubtitle = 'Convaincre grâce à des journalistes confirmés'

export function MorphSection({ children }: { children?: ReactNode }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [expanding, setExpanding] = useState(false)
  const [phoneCopy, setPhoneCopy] = useState(0)
  const [laptopCopy, setLaptopCopy] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const citiesRef = useRef<HTMLParagraphElement>(null)
  const kickerRef = useRef<HTMLParagraphElement>(null)
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
      const kicker = kickerRef.current
      const device = deviceRef.current
      if (!section || !hero || !cities || !kicker || !device) return

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
      kicker.style.opacity = heroOpacity
      // Une fois le hero invisible, son bouton ne doit plus être cliquable ni atteignable au clavier.
      hero.style.visibility = Number(heroOpacity) > 0.02 ? 'visible' : 'hidden'

      device.style.opacity = String(clamp(intro * 1.5))
      const introScale = expandProgress > 0.02 ? 1 : 2.8 - easedIntro * 1.8
      device.style.transform = reduceMotion ? '' : `scale(${introScale})`

      // Estompage très progressif de la vidéo, étalé sur toute la phase « vision »,
      // qui s'arrête à VIDEO_FLOOR et y reste jusqu'en bas de page.
      const fadeProgress = smooth(clamp((vision - VIDEO_FADE_START) / (1 - VIDEO_FADE_START)))
      const videoOpacity = 1
      const contentReveal = smooth(clamp((scrolled - CONTENT_START_VH) / 6))
      const headline = clamp(tv / 0.12) * (1 - clamp(vision / 0.08)) * (1 - contentReveal)
      device.style.setProperty('--expand', easeInOut(expandProgress).toFixed(4))
      device.style.setProperty('--video-opacity', videoOpacity.toFixed(3))
      device.style.setProperty('--dim', '0')
      device.style.setProperty('--headline', headline.toFixed(3))

      let stage = 0
      if (tv > 0 || expandProgress > 0 || vision > 0) stage = 2
      else if (laptop > 0) stage = 1

      setActiveIndex(stage)
      setExpanding(expandProgress > 0.005)
      setPhoneCopy(stage === 0 && intro > 0.45 ? clamp((intro - 0.45) / 0.3) * (1 - laptop) : 0)
      setLaptopCopy(stage === 1 ? clamp(laptop / 0.25) * (1 - tv) : 0)

      // Le texte « À propos » passe du blanc (vidéo bien visible) au sombre (vidéo presque effacée).
      const aboutOnVideo = vision > 0 ? clamp((videoOpacity - 0.3) / 0.4) : 0
      root.style.setProperty('--about-opacity', smooth(clamp(vision / 0.015)).toFixed(3))
      root.style.setProperty('--about-video', aboutOnVideo.toFixed(3))
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
    <section ref={sectionRef} aria-label="Fleir et nos formats" className="relative">
      {/*
        Panneau « collant » : il reste à l'écran tant que la section existe.
        Comme la section englobe aussi le contenu (children) ci-dessous, la vidéo
        reste en fond jusqu'à la toute fin du défilement.
      */}
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div ref={deviceRef} className="opacity-0 will-change-transform">
            <MorphDevice activeIndex={activeIndex} expanding={expanding} />
          </div>
        </div>

        {/* Animation 1 (téléphone) : mobile, sous l'appareil */}
        <div
          className="pointer-events-none absolute bottom-[2svh] left-1/2 z-10 w-[min(18rem,82vw)] text-center md:hidden"
          style={{
            opacity: phoneCopy,
            transform: `translate(-50%, ${10 * (1 - phoneCopy)}px)`,
          }}
        >
          <CopyBlock title={phoneTitle} subtitle={phoneSubtitle} compact />
        </div>

        {/* Animation 1 (téléphone) : bureau, à droite du téléphone qui reste centré */}
        <div
          className="pointer-events-none absolute top-1/2 z-10 hidden text-left md:block"
          style={{
            left: `calc(50% + ${phoneHalfW} + 4vw)`,
            width: `min(24rem, calc(41vw - ${phoneHalfW}))`,
            opacity: phoneCopy,
            transform: `translate(${-16 * (1 - phoneCopy)}px, -50%)`,
          }}
        >
          <CopyBlock title={phoneTitle} subtitle={phoneSubtitle} />
        </div>

        {/* Animation 2 (ordinateur) : bureau, à droite */}
        <div
          className="pointer-events-none absolute top-1/2 right-[1vw] z-10 hidden text-right md:block"
          style={{
            width: 'min(24rem, 29vw)',
            opacity: laptopCopy,
            transform: `translate(${16 * (1 - laptopCopy)}px, -50%)`,
          }}
        >
          <CopyBlock title={laptopTitle} subtitle={laptopSubtitle} />
        </div>

        {/* Animation 2 (ordinateur) : mobile */}
        <div
          className="pointer-events-none absolute bottom-[2svh] left-1/2 z-10 w-[min(18rem,82vw)] text-center md:hidden"
          style={{
            opacity: laptopCopy,
            transform: `translate(-50%, ${10 * (1 - laptopCopy)}px)`,
          }}
        >
          <CopyBlock title={laptopTitle} subtitle={laptopSubtitle} compact />
        </div>

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

        <p
          ref={kickerRef}
          className="pointer-events-none absolute top-14 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap text-sm font-medium tracking-tight text-muted-foreground md:top-10 md:text-base"
        >
          Production audiovisuelle
        </p>
      </div>

      {/*
        Calque de contenu : il recouvre le panneau (marge négative de 100svh).
        Le vide du haut laisse jouer les animations ; le contenu (Contact) arrive ensuite
        par-dessus la vidéo. Le calque laisse passer les clics, sauf sur Contact lui-même.
      */}
      <div className="pointer-events-none relative z-10 -mt-[100svh]">
        <div aria-hidden="true" style={{ height: `${CONTENT_START_VH}svh` }} />
        {children}
      </div>
    </section>
  )
}

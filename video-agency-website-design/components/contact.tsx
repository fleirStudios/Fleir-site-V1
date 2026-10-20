import { ArrowUpRight } from 'lucide-react'
import { FlairWord } from '@/components/flair-word'
import { LogoMarquee } from '@/components/logo-marquee'
import { Reveal } from '@/components/reveal'

function Instagram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  )
}

const EMAIL = 'contact@fleir.fr'
const INSTAGRAM_URL = 'https://www.instagram.com/fleir'

export function Contact() {
  return (
    <section
      id="contact"
      aria-label="À propos et contact"
      className="relative z-10 -mt-[70svh] flex flex-col items-center gap-24 pt-[18svh] pb-16 text-center md:gap-32"
    >
      <p
        className="about-copy mx-auto max-w-4xl px-6 text-balance font-medium tracking-tight text-muted-foreground"
        style={{
          fontSize: 'clamp(1.5rem, 4.6vw, 3.25rem)',
          lineHeight: 1.15,
          opacity: 'var(--about-opacity, 0)',
        }}
      >
        Fondé par deux journalistes, <span className="text-foreground">Fleir</span> allie la rigueur du grand
        reportage à la puissance visuelle des contenus de marque. Un studio indépendant, agile, basé à{' '}
        <span className="text-foreground">Paris</span> et <span className="text-foreground">Bordeaux</span>, avec du{' '}
        <FlairWord /> pour les histoires qui marquent.
      </p>

      <Reveal className="flex w-full flex-col items-center gap-8">
        <h2 className="text-xl font-medium tracking-tight text-muted-foreground md:text-2xl">Nos expériences</h2>
        <LogoMarquee />
      </Reveal>

      <Reveal className="flex flex-col items-center gap-10 px-6">
        <h2 className="-mb-4 text-xl font-medium tracking-tight text-muted-foreground md:text-2xl">
          Nous contacter
        </h2>
        <a
          href={`mailto:${EMAIL}`}
          className="group inline-flex items-center gap-3 rounded-full bg-primary px-10 py-5 text-lg font-semibold tracking-tight text-white shadow-[0_18px_40px_-18px_var(--primary)] transition-all duration-300 hover:scale-[1.04] active:scale-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40 md:px-14 md:py-6 md:text-2xl"
        >
          Démarrer un projet
          <ArrowUpRight
            className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 md:size-6"
            aria-hidden="true"
          />
        </a>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-card px-7 py-3.5 text-base font-medium tracking-tight transition-all hover:scale-[1.03] hover:border-primary hover:text-primary active:scale-100"
        >
          <Instagram className="size-5" />
          Instagram
        </a>
        <p className="text-base font-medium tracking-tight text-muted-foreground">Paris · Bordeaux</p>
      </Reveal>

      <p className="text-sm font-medium tracking-tight text-muted-foreground">{'© 2026 Fleir'}</p>
    </section>
  )
}

import { BrandName } from '@/components/brand-name'
import { StartProjectButton } from '@/components/start-project-button'

export function Hero() {
  return (
    <div>
      <h1 className="-ml-[0.06em] text-[clamp(5.5rem,26vw,22rem)] font-bold leading-[0.8] tracking-tighter">
        <BrandName />
      </h1>
      <p className="mt-8 text-balance text-2xl font-medium tracking-tight text-muted-foreground md:text-4xl">
        Raconter votre <span className="text-foreground">histoire.</span>
      </p>
      {/* Le conteneur du hero ignore les clics : on les réactive sur le bouton seulement. */}
      <div className="mt-6 flex justify-center md:mt-8">
        <StartProjectButton
          size="sm"
          className="pointer-events-auto md:absolute md:top-1/2 md:right-6 md:-translate-y-1/2 lg:right-12"
        />
      </div>
    </div>
  )
}

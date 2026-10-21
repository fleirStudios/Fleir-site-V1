import { BrandName } from '@/components/brand-name'

export function Hero() {
  return (
    <div>
      <h1 className="-ml-[0.06em] text-[clamp(5.5rem,26vw,22rem)] font-bold leading-[0.8] tracking-tighter">
        <BrandName />
      </h1>
      <p className="mt-8 text-balance text-2xl font-medium tracking-tight text-muted-foreground md:text-4xl">
        Raconter votre <span className="text-foreground">histoire.</span>
      </p>
    </div>
  )
}

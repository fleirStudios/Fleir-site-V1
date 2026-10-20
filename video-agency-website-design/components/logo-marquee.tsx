import { clientMarks } from '@/components/client-logos'

const clients = ['France 2', 'TF1', 'YouTube', 'La 1ère', 'France 3', 'CANAL+', 'Grand Angle']

function LogoList({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center pr-6 md:pr-10" aria-hidden={hidden}>
      {clients.map((name) => (
        <li key={name} className="px-10 md:px-16">
          <span className="flex items-center gap-3 whitespace-nowrap text-3xl font-medium tracking-tight text-foreground/35 transition-colors duration-300 hover:text-foreground md:gap-4 md:text-5xl">
            {clientMarks[name]}
            {name}
          </span>
        </li>
      ))}
    </ul>
  )
}

export function LogoMarquee() {
  return (
    <div className="group w-full overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <div className="flex w-max animate-[marquee_38s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        <LogoList />
        <LogoList hidden />
      </div>
    </div>
  )
}

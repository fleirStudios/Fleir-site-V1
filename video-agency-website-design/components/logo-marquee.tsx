type Client = { name: string; src?: string; className?: string }

const clients: Client[] = [
  { name: 'France 2', src: '/logos/france-2.svg', className: 'h-7 md:h-9' },
  { name: 'TF1', src: '/logos/tf1.svg', className: 'h-9 md:h-12' },
  { name: 'YouTube', src: '/logos/youtube.svg', className: 'h-7 md:h-9' },
  { name: 'La 1ère', src: '/logos/la-1ere.svg', className: 'h-10 md:h-14' },
  { name: 'France 3', src: '/logos/france-3.svg', className: 'h-7 md:h-9' },
  { name: 'CANAL+', src: '/logos/canal-plus.svg', className: 'h-8 md:h-11' },
  { name: 'Grand Angle' },
]

function LogoList({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center pr-6 md:pr-10" aria-hidden={hidden}>
      {clients.map((client) => (
        <li
          key={client.name}
          className="flex items-center px-8 opacity-50 grayscale transition-[filter,opacity] duration-300 hover:opacity-100 hover:grayscale-0 md:px-14"
        >
          {client.src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={client.src}
              alt={hidden ? '' : client.name}
              className={`w-auto max-w-none ${client.className}`}
              loading="lazy"
              draggable={false}
            />
          ) : (
            <span className="whitespace-nowrap text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {client.name}
            </span>
          )}
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

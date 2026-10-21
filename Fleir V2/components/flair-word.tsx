const layer = 'transition-all duration-500 ease-[cubic-bezier(0.65,0,0.25,1)] [grid-area:1/1]'

export function FlairWord() {
  return (
    <span
      tabIndex={0}
      className="group inline-grid cursor-default rounded-md underline decoration-primary/50 decoration-dotted decoration-2 underline-offset-[0.18em] outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span
        className={`${layer} group-hover:-translate-y-[0.5em] group-hover:opacity-0 group-focus:-translate-y-[0.5em] group-focus:opacity-0`}
      >
        flair
      </span>
      <span
        aria-hidden="true"
        className={`${layer} translate-y-[0.5em] text-primary opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus:translate-y-0 group-focus:opacity-100`}
      >
        Fleir
      </span>
    </span>
  )
}

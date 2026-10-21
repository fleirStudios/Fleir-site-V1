export function BrandName() {
  return (
    <>
      <span className="sr-only">Fleir.</span>
      <span aria-hidden="true">
        Fle
        <span className="relative inline-block">
          {'\u0131'}
          <span className="absolute left-1/2 top-[-0.53em] -translate-x-1/2 text-primary">.</span>
        </span>
        r<span className="text-primary">.</span>
      </span>
    </>
  )
}

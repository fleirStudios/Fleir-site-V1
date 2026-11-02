'use client'

import { LoopVideo } from '@/components/loop-video'

const phoneW = 'min(36svh, 68vw)'
const laptopW = 'min(max(58vw, min(88vw, 640px)), 80svh, 820px)'
const tvW = 'min(max(82vw, min(94vw, 900px)), 130svh, 1120px)'
const tvScreenW = `(${tvW} - 20px)`
const tvScreenH = `(${tvW} * 9 / 16 - 20px)`

const shapes = [
  {
    width: phoneW,
    height: `calc(${phoneW} * 16 / 9)`,
    radius: '44px',
    bezel: '12px',
    shift: '0px',
    inner: '32px',
  },
  {
    width: laptopW,
    height: `calc(${laptopW} * 9 / 16)`,
    radius: '16px 16px 4px 4px',
    bezel: '12px',
    shift: `calc(${laptopW} * -0.09)`,
    inner: '6px',
  },
  {
    width: tvW,
    height: `calc(${tvW} * 9 / 16)`,
    radius: '10px',
    bezel: '10px',
    shift: '0px',
    inner: '2px',
  },
]

const ease =
  'transition-[width,height,border-radius,transform,box-shadow,opacity] duration-700 ease-[cubic-bezier(0.65,0,0.25,1)]'

const keyRows = [14, 14, 13, 12, 10]

function LaptopDeck({ visible }: { visible: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute left-0 top-full w-full ${ease} ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ perspective: '900px' }}
      aria-hidden="true"
    >
      <div className="mx-auto h-1.5 w-[86%] rounded-b-sm bg-[#8e8e93]" />
      <div
        className={`flex aspect-[2.6/1] w-full origin-top flex-col items-center gap-[4%] rounded-b-[22px] bg-gradient-to-b from-[#d8d8dd] to-[#c4c4ca] px-[6%] pt-[4%] pb-[5%] shadow-[0_30px_40px_-25px_rgba(0,0,0,0.45)] transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.25,1)] motion-reduce:transition-none ${
          visible ? 'delay-150' : ''
        }`}
        style={{ transform: visible ? 'rotateX(68deg)' : 'rotateX(90deg)' }}
      >
        <div className="flex w-full flex-1 flex-col gap-[2.5%] rounded-[6px] bg-[#b6b6bc] p-[1.2%]">
          {keyRows.map((count, row) => (
            <div key={row} className="flex flex-1 gap-[0.6%]">
              {Array.from({ length: count }).map((_, k) => (
                <span
                  key={k}
                  className={`h-full rounded-[3px] bg-[#2c2c2e] ${row === 4 && k === 4 ? 'flex-[5]' : 'flex-1'}`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="h-[28%] w-[38%] rounded-[8px] bg-[#cdcdd2] ring-1 ring-black/10" />
      </div>
    </div>
  )
}

/**
 * Expansion, video fade and headline are driven by CSS variables set on an
 * ancestor (--expand, --video-opacity, --dim, --headline) so scrolling never
 * re-renders React on every frame.
 */
export function MorphDevice({ activeIndex, expanding = false }: { activeIndex: number; expanding?: boolean }) {
  const shape = shapes[activeIndex]
  const isExpanding = activeIndex === 2 && expanding
  const motion = isExpanding ? 'transition-none' : ease

  const screenWidth = `calc(100% - ${shape.bezel} * 2)`
  const screenHeight = `calc(100% - ${shape.bezel} * 2)`
  const screenRadius = isExpanding ? 'clamp(2px, calc(72px * (1 - var(--expand, 0))), 72px)' : shape.inner

  return (
    <div className={`relative ${motion}`} style={{ transform: `translateY(${isExpanding ? '0px' : shape.shift})` }}>
      <div className={`relative ${motion}`} style={{ width: shape.width, height: shape.height }}>
        <div
          className={`absolute inset-0 bg-device shadow-[0_40px_80px_-30px_rgba(0,0,0,0.35)] ${motion}`}
          style={{
            borderRadius: shape.radius,
            opacity: isExpanding ? 'calc(1 - var(--expand, 0) * 2.2)' : 1,
            transform: isExpanding ? 'scale(calc(1 + var(--expand, 0) * 0.18))' : 'none',
          }}
          aria-hidden="true"
        />

        <div
          className={`@container absolute left-1/2 top-1/2 overflow-hidden bg-black ${motion}`}
          style={{
            width: screenWidth,
            height: screenHeight,
            borderRadius: screenRadius,
            transform: isExpanding
              ? 'translate(-50%, -50%) scaleX(calc(1 + var(--expand, 0) * 0.7)) scaleY(calc(1 + var(--expand, 0) * 0.4))'
              : 'translate(-50%, -50%)',
            opacity: 'var(--video-opacity, 1)',
            boxShadow: isExpanding
              ? '0 40px 90px -20px rgb(0 0 0 / calc(0.45 * (1 - var(--expand, 0))))'
              : undefined,
          }}
        >
          <div
            className="absolute inset-0"
            style={{ transform: isExpanding ? 'scale(calc(1 + var(--expand, 0) * 0.06))' : undefined }}
          >
            <LoopVideo />
          </div>
          <div className="absolute inset-0 bg-black" style={{ opacity: 'var(--dim, 0)' }} aria-hidden="true" />
          <p
            className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-semibold text-white"
            style={{
              fontSize: '8.5cqw',
              lineHeight: 1,
              letterSpacing: '-0.04em',
              opacity: 'var(--headline, 0)',
              textShadow: '0 6px 40px rgba(0,0,0,0.35)',
            }}
          >
            Voyez plus grand
          </p>
        </div>

        <span
          className={`absolute left-1/2 top-[18px] h-[22px] w-[28%] -translate-x-1/2 rounded-full bg-device ${ease} ${
            activeIndex === 0 ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        />

        <span
          className={`absolute left-1/2 top-[5px] size-1.5 -translate-x-1/2 rounded-full bg-[#3a3a3c] ${ease} ${
            activeIndex === 1 ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        />

        <LaptopDeck visible={activeIndex === 1} />

        <span
          className={`absolute left-1/2 top-full flex -translate-x-1/2 flex-col items-center ${ease} ${
            activeIndex === 2 && !expanding ? 'translate-y-0 opacity-100 delay-200' : 'translate-y-6 opacity-0'
          }`}
          aria-hidden="true"
        >
          <span className="h-8 w-5 bg-[#c7c7cc]" />
          <span className="h-2 w-48 max-w-[50vw] rounded-full bg-[#c7c7cc]" />
        </span>
      </div>
    </div>
  )
}

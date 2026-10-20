'use client'

import { LoopVideo } from '@/components/loop-video'

const phoneW = 'min(36svh, 68vw)'
const laptopW = 'min(58vw, 80svh, 820px)'
const tvW = 'min(82vw, 130svh, 1120px)'

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

const ease = 'transition-[width,height,border-radius,padding,transform,box-shadow,opacity] duration-700 ease-[cubic-bezier(0.65,0,0.25,1)]'

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
                  className={`h-full rounded-[3px] bg-[#2c2c2e] ${
                    row === 4 && k === 4 ? 'flex-[5]' : 'flex-1'
                  }`}
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

export function MorphDevice({
  activeIndex,
  expand = 0,
  videoOpacity = 1,
}: {
  activeIndex: number
  expand?: number
  videoOpacity?: number
}) {
  const shape = shapes[activeIndex]
  const e = activeIndex === 2 ? expand : 0
  const expanding = e > 0.01
  const motion = expanding ? 'transition-none' : ease
  const width = expanding ? `calc((${tvW}) + (100vw - (${tvW})) * ${e})` : shape.width
  const height = expanding ? `calc((${shapes[2].height}) + (100svh - (${shapes[2].height})) * ${e})` : shape.height
  const radius = expanding ? `${10 * (1 - e)}px` : shape.radius
  const bezel = expanding ? `${10 * (1 - e)}px` : shape.bezel
  const inner = expanding ? `${2 * (1 - e)}px` : shape.inner
  const shift = expanding ? '0px' : shape.shift

  return (
    <div className={`relative ${motion}`} style={{ transform: `translateY(${shift})` }}>
      <div
        className={`relative bg-device ${motion} ${
          e > 0.2 ? 'shadow-none' : 'shadow-[0_40px_80px_-30px_rgba(0,0,0,0.35)]'
        }`}
        style={{
          width,
          height,
          borderRadius: radius,
          padding: bezel,
        }}
      >
        <div
          className={`relative h-full w-full overflow-hidden bg-black ${motion}`}
          style={{ borderRadius: inner }}
        >
          <LoopVideo opacity={videoOpacity} />
        </div>

        <span
          className={`absolute left-1/2 top-[18px] h-[22px] w-[28%] -translate-x-1/2 rounded-full bg-device ${ease} ${
            activeIndex === 0 ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        />

        <span
          className={`absolute left-1/2 top-[5px] size-1.5 -translate-x-1/2 rounded-full bg-[#3a3a3c] ${ease} ${
            activeIndex === 1 && e === 0 ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        />

        <LaptopDeck visible={activeIndex === 1 && e === 0} />

        <span
          className={`absolute left-1/2 top-full flex -translate-x-1/2 flex-col items-center ${ease} ${
            activeIndex === 2 && e < 0.25 ? 'translate-y-0 opacity-100 delay-200' : '-translate-y-6 opacity-0'
          }`}
          aria-hidden="true"
        >
          <span className="h-8 w-5 bg-[#c7c7cc]" />
          <span className="h-2 w-48 rounded-full bg-[#c7c7cc]" />
        </span>
      </div>
    </div>
  )
}

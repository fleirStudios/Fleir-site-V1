import type { ReactNode } from 'react'

function Mark({ children, viewBox }: { children: ReactNode; viewBox: string }) {
  return (
    <svg viewBox={viewBox} className="h-[1.05em] w-auto shrink-0" aria-hidden="true" fill="currentColor">
      {children}
    </svg>
  )
}

export const clientMarks: Record<string, ReactNode> = {
  'France 2': (
    <Mark viewBox="0 0 52 32">
      <path d="M2 6h20l6 10-6 10H2V6Z" />
      <text x="32" y="24" fontSize="22" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
        2
      </text>
    </Mark>
  ),
  'France 3': (
    <Mark viewBox="0 0 52 32">
      <path d="M2 6h20l6 10-6 10H2V6Z" />
      <text x="32" y="24" fontSize="22" fontWeight="700" fontFamily="ui-sans-serif, system-ui, sans-serif">
        3
      </text>
    </Mark>
  ),
  TF1: (
    <Mark viewBox="0 0 36 32">
      <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <path d="M12.2 9.2h9.2v3.1h-3v11.5h-3.2V12.3h-3V9.2Z" />
    </Mark>
  ),
  'CANAL+': (
    <Mark viewBox="0 0 28 28">
      <rect x="1.2" y="1.2" width="25.6" height="25.6" rx="3.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8 14h12M14 8v12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" />
    </Mark>
  ),
  'La 1ère': (
    <Mark viewBox="0 0 28 28">
      <circle cx="14" cy="14" r="12.2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12.2 8.4h2.4v11.2h-2.4V10.6H10.4V8.8c.7-.2 1.3-.3 1.8-.4Z" />
    </Mark>
  ),
  YouTube: (
    <Mark viewBox="0 0 34 24">
      <rect x="1" y="2" width="32" height="20" rx="6" />
      <path d="M14 8.2v7.6L22.4 12 14 8.2Z" fill="var(--background)" />
    </Mark>
  ),
  'Grand Angle': (
    <Mark viewBox="0 0 36 24">
      <path d="M2 20 18 4l16 16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M10 20h16" fill="none" stroke="currentColor" strokeWidth="2.6" />
    </Mark>
  ),
}

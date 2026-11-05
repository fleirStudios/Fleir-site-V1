'use client'

import { ArrowUpRight } from 'lucide-react'
import { useContactDialog } from '@/components/contact-dialog'
import { cn } from '@/lib/utils'

type StartProjectButtonProps = {
  /** « lg » : le grand bouton du bas de page. « sm » : la version réduite du haut de page. */
  size?: 'lg' | 'sm'
  className?: string
}

export function StartProjectButton({ size = 'lg', className }: StartProjectButtonProps) {
  const { openDialog } = useContactDialog()

  return (
    <button
      type="button"
      onClick={openDialog}
      className={cn(
        'group inline-flex items-center rounded-full bg-primary font-semibold tracking-tight text-white transition-all duration-300 hover:scale-[1.04] active:scale-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40',
        size === 'lg'
          ? 'gap-3 px-10 py-5 text-lg shadow-[0_18px_40px_-18px_var(--primary)] md:px-14 md:py-6 md:text-2xl'
          : 'gap-2 px-5 py-2.5 text-sm shadow-[0_12px_28px_-14px_var(--primary)] md:px-6 md:py-3 md:text-base',
        className,
      )}
    >
      Démarrer un projet
      <ArrowUpRight
        className={cn(
          'transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5',
          size === 'lg' ? 'size-5 md:size-6' : 'size-4',
        )}
        aria-hidden="true"
      />
    </button>
  )
}

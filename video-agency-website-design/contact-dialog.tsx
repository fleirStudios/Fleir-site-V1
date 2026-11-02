'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'
import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const EMAIL = 'contact@fleir.fr'

/* -------------------------------------------------------------------------- */
/*  Réglages des créneaux de rappel                                           */
/* -------------------------------------------------------------------------- */

const DAY_START_HOUR = 8 // premier créneau : 8h-10h
const WEEK_END_HOUR = 22 // dernier créneau du lundi au samedi : 20h-22h
const SUNDAY_END_HOUR = 18 // dernier créneau le dimanche : 16h-18h
const SLOT_HOURS = 2
const BOOKING_HORIZON_DAYS = 60 // on peut réserver jusqu'à 60 jours à l'avance

/* -------------------------------------------------------------------------- */
/*  Contexte : permet d'ouvrir la fenêtre depuis n'importe quel bouton        */
/* -------------------------------------------------------------------------- */

type ContactDialogContextValue = { openDialog: () => void }

const ContactDialogContext = createContext<ContactDialogContextValue | null>(null)

export function useContactDialog() {
  const ctx = useContext(ContactDialogContext)
  if (!ctx) throw new Error('useContactDialog doit être utilisé dans un <ContactDialogProvider>.')
  return ctx
}

export function ContactDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const openDialog = useCallback(() => setOpen(true), [])
  const closeDialog = useCallback(() => setOpen(false), [])
  const value = useMemo(() => ({ openDialog }), [openDialog])

  return (
    <ContactDialogContext.Provider value={value}>
      {children}
      <ContactDialog open={open} onClose={closeDialog} />
    </ContactDialogContext.Provider>
  )
}

/* -------------------------------------------------------------------------- */
/*  Dates (tout est calculé à l'heure de Paris)                               */
/* -------------------------------------------------------------------------- */

type YMD = { y: number; m: number; d: number } // m : 0-11
type ParisNow = YMD & { hour: number }

const DAY_MS = 86_400_000
const dayNumber = ({ y, m, d }: YMD) => Math.floor(Date.UTC(y, m, d) / DAY_MS)
const fromDayNumber = (n: number): YMD => {
  const date = new Date(n * DAY_MS)
  return { y: date.getUTCFullYear(), m: date.getUTCMonth(), d: date.getUTCDate() }
}
const pad = (n: number) => String(n).padStart(2, '0')
const toIso = ({ y, m, d }: YMD) => `${y}-${pad(m + 1)}-${pad(d)}`

function getParisNow(): ParisNow {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    hour12: false,
  }).formatToParts(new Date())
  const read = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0)
  return { y: read('year'), m: read('month') - 1, d: read('day'), hour: read('hour') % 24 }
}

/** Heures de début des créneaux disponibles pour un jour donné. */
function slotsFor(day: YMD, today: ParisNow): number[] {
  const weekday = new Date(Date.UTC(day.y, day.m, day.d)).getUTCDay() // 0 = dimanche
  const end = weekday === 0 ? SUNDAY_END_HOUR : WEEK_END_HOUR
  const slots: number[] = []
  for (let h = DAY_START_HOUR; h + SLOT_HOURS <= end; h += SLOT_HOURS) slots.push(h)
  // Aujourd'hui : on ne propose que les créneaux qui n'ont pas encore commencé.
  return dayNumber(day) === dayNumber(today) ? slots.filter((h) => h > today.hour) : slots
}

const monthFormat = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' })
const longDayFormat = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
})
const utcDate = ({ y, m, d }: YMD) => new Date(Date.UTC(y, m, d))

/* -------------------------------------------------------------------------- */
/*  Envoi de la demande                                                       */
/* -------------------------------------------------------------------------- */

export type CallbackRequest = {
  name: string
  phone: string
  email: string
  message: string
  date: string // AAAA-MM-JJ
  slotStart: number // heure de Paris
  slotEnd: number // heure de Paris
}

async function sendCallbackRequest(request: CallbackRequest): Promise<void> {
  // TODO (étape suivante) : envoyer cette demande par e-mail à contact@fleir.fr
  // depuis une route serveur (par ex. app/api/callback/route.ts).
  // Pour l'instant, RIEN N'EST ENVOYÉ : la fonction simule seulement un envoi.
  await new Promise((resolve) => setTimeout(resolve, 600))
  console.info('[Fleir] demande de rappel (non envoyée)', request)
}

/* -------------------------------------------------------------------------- */
/*  Fenêtre                                                                   */
/* -------------------------------------------------------------------------- */

function ContactDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  // Bloque le défilement de la page derrière la fenêtre.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="contact-dialog-title"
      onClose={onClose}
      onClick={(event) => {
        // Un clic sur le fond (le ::backdrop) ferme la fenêtre.
        if (event.target === event.currentTarget) onClose()
      }}
      className="m-auto max-h-[calc(100svh-1.5rem)] w-[min(34rem,calc(100vw-1.5rem))] overflow-y-auto overscroll-contain rounded-3xl border border-border bg-card p-0 text-foreground shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-sm open:animate-in open:fade-in-0 open:zoom-in-95 open:duration-200"
    >
      {open && <CallbackForm onClose={onClose} />}
    </dialog>
  )
}

type Errors = Partial<Record<'name' | 'phone' | 'email' | 'slot', string>>

const fieldClass =
  'w-full rounded-xl border border-input bg-background px-4 py-3 text-base outline-none transition focus:border-primary focus:ring-4 focus:ring-ring/20 aria-[invalid=true]:border-destructive'

function CallbackForm({ onClose }: { onClose: () => void }) {
  const today = useMemo(getParisNow, [])
  const todayNum = dayNumber(today)
  const lastNum = todayNum + BOOKING_HORIZON_DAYS

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [view, setView] = useState({ y: today.y, m: today.m })
  const [selected, setSelected] = useState<YMD | null>(null)
  const [slot, setSlot] = useState<number | null>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const monthIndex = (v: { y: number; m: number }) => v.y * 12 + v.m
  const canPrev = monthIndex(view) > monthIndex(today)
  const canNext = monthIndex(view) < monthIndex(fromDayNumber(lastNum))
  const shiftMonth = (delta: number) =>
    setView((v) => {
      const index = monthIndex(v) + delta
      return { y: Math.floor(index / 12), m: index % 12 }
    })

  const isSelectable = (day: YMD) => {
    const n = dayNumber(day)
    return n >= todayNum && n <= lastNum && slotsFor(day, today).length > 0
  }

  function pickDay(day: YMD) {
    setSelected(day)
    setSlot((current) => (current !== null && slotsFor(day, today).includes(current) ? current : null))
    setErrors((e) => ({ ...e, slot: undefined }))
  }

  const daysInMonth = new Date(Date.UTC(view.y, view.m + 1, 0)).getUTCDate()
  const leadingBlanks = (new Date(Date.UTC(view.y, view.m, 1)).getUTCDay() + 6) % 7 // semaine : lundi en premier
  const availableSlots = selected ? slotsFor(selected, today) : []

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const next: Errors = {}
    if (!name.trim()) next.name = 'Indiquez votre nom.'
    if (!/^\+?\d{8,15}$/.test(phone.replace(/[\s.\-()]/g, ''))) next.phone = 'Indiquez un numéro de téléphone valide.'
    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim())) next.email = 'Cette adresse e-mail semble invalide.'
    if (!selected || slot === null) next.slot = 'Choisissez un jour et un créneau.'
    setErrors(next)
    if (Object.keys(next).length > 0 || !selected || slot === null) return

    setStatus('sending')
    try {
      await sendCallbackRequest({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        message: message.trim(),
        date: toIso(selected),
        slotStart: slot,
        slotEnd: slot + SLOT_HOURS,
      })
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent' && selected && slot !== null) {
    return (
      <div className="flex flex-col items-center gap-5 p-8 text-center md:p-12">
        <span className="inline-flex size-14 items-center justify-center rounded-full bg-primary text-white">
          <Check className="size-7" aria-hidden="true" />
        </span>
        <h2 id="contact-dialog-title" className="text-2xl font-semibold tracking-tight md:text-3xl">
          Demande envoyée
        </h2>
        <p className="text-balance text-base text-muted-foreground md:text-lg">
          Nous vous rappelons le {longDayFormat.format(utcDate(selected))}, entre {slot}h et {slot + SLOT_HOURS}h
          (heure de Paris).
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 rounded-full bg-primary px-8 py-3 text-base font-semibold tracking-tight text-white transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40"
        >
          Fermer
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6 p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="contact-dialog-title" className="text-2xl font-semibold tracking-tight md:text-3xl">
            Démarrer un projet
          </h2>
          <p className="mt-2 text-base text-muted-foreground">
            Choisissez un créneau, nous vous rappelons. Vous préférez écrire ?{' '}
            <a href={`mailto:${EMAIL}`} className="font-medium text-primary underline-offset-4 hover:underline">
              {EMAIL}
            </a>
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="-mr-2 -mt-2 inline-flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cb-name" className="text-sm font-medium tracking-tight">
            Nom
          </label>
          <input
            id="cb-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            className={fieldClass}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cb-phone" className="text-sm font-medium tracking-tight">
            Téléphone
          </label>
          <input
            id="cb-phone"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            className={fieldClass}
          />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="cb-email" className="text-sm font-medium tracking-tight">
          E-mail <span className="font-normal text-muted-foreground">(facultatif)</span>
        </label>
        <input
          id="cb-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          className={fieldClass}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="cb-message" className="text-sm font-medium tracking-tight">
          Votre projet <span className="font-normal text-muted-foreground">(facultatif)</span>
        </label>
        <textarea
          id="cb-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className={cn(fieldClass, 'resize-none')}
        />
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-sm font-medium tracking-tight">Quand souhaitez-vous être rappelé ?</legend>

        <div className="rounded-2xl border border-border bg-background p-3">
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              disabled={!canPrev}
              aria-label="Mois précédent"
              className="inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <p className="text-base font-medium capitalize tracking-tight" aria-live="polite">
              {monthFormat.format(new Date(Date.UTC(view.y, view.m, 1)))}
            </p>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              disabled={!canNext}
              aria-label="Mois suivant"
              className="inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-7 text-center text-xs font-medium text-muted-foreground" aria-hidden="true">
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((label, i) => (
              <span key={i} className="py-1">
                {label}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: leadingBlanks }, (_, i) => (
              <span key={`blank-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day: YMD = { y: view.y, m: view.m, d: i + 1 }
              const selectable = isSelectable(day)
              const isSelected = selected !== null && dayNumber(selected) === dayNumber(day)
              const isToday = dayNumber(day) === todayNum
              return (
                <button
                  key={day.d}
                  type="button"
                  disabled={!selectable}
                  onClick={() => pickDay(day)}
                  aria-pressed={isSelected}
                  aria-label={longDayFormat.format(utcDate(day))}
                  className={cn(
                    'aspect-square rounded-full text-sm font-medium transition-colors',
                    isSelected
                      ? 'bg-primary text-white'
                      : selectable
                        ? 'hover:bg-secondary'
                        : 'cursor-not-allowed text-muted-foreground/40',
                    isToday && !isSelected && 'ring-1 ring-primary/60',
                  )}
                >
                  {day.d}
                </button>
              )
            })}
          </div>
        </div>

        {selected ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              <span className="capitalize">{longDayFormat.format(utcDate(selected))}</span> · créneaux de 2 h, heure
              de Paris
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {availableSlots.map((start) => (
                <button
                  key={start}
                  type="button"
                  onClick={() => {
                    setSlot(start)
                    setErrors((e) => ({ ...e, slot: undefined }))
                  }}
                  aria-pressed={slot === start}
                  className={cn(
                    'rounded-full border px-3 py-2.5 text-sm font-medium tracking-tight transition-colors',
                    slot === start
                      ? 'border-primary bg-primary text-white'
                      : 'border-border bg-background hover:border-primary hover:text-primary',
                  )}
                >
                  {start}h – {start + SLOT_HOURS}h
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Sélectionnez un jour pour voir les créneaux disponibles.</p>
        )}
        {errors.slot && <p className="text-sm text-destructive">{errors.slot}</p>}
      </fieldset>

      {status === 'error' && (
        <p role="alert" className="text-sm text-destructive">
          L’envoi a échoué. Réessayez, ou écrivez-nous à {EMAIL}.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-lg font-semibold tracking-tight text-white shadow-[0_14px_32px_-16px_var(--primary)] transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40 disabled:opacity-60 disabled:hover:scale-100"
      >
        {status === 'sending' ? 'Envoi…' : 'Être rappelé'}
      </button>
    </form>
  )
}

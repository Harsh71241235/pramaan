import { useState, type FormEvent } from 'react'
import { ArrowRight, CircleCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { PROFESSIONS } from '@/data/fixtures'

type State = 'idle' | 'pending' | 'success' | 'error'
type Role = 'hire' | 'work'

/**
 * Early-access waitlist, captured with Netlify Forms.
 * Field names must match public/waitlist-form.html exactly.
 */
export function WaitlistForm() {
  const [state, setState] = useState<State>('idle')
  const [role, setRole] = useState<Role>('work')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (state === 'pending') return
    const body = new URLSearchParams()
    new FormData(event.currentTarget).forEach((value, key) =>
      body.append(key, String(value)),
    )
    setState('pending')
    try {
      const response = await fetch('/waitlist-form.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
        signal: AbortSignal.timeout(15000),
      })
      if (!response.ok) throw new Error('Submission failed')
      const unprocessed = /\bdata-netlify\s*=/i.test(await response.text())
      if (unprocessed) throw new Error('Form handling is unavailable')
      setState('success')
    } catch {
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div
        role="status"
        className="rise flex items-start gap-4 rounded-lg border border-primary-foreground/20 bg-primary-foreground/5 p-6"
      >
        <CircleCheck className="mt-0.5 size-6 shrink-0 text-turmeric" />
        <div>
          <p className="font-display text-2xl">You’re on the list.</p>
          <p className="mt-1 text-sm text-primary-foreground/70">
            We’re onboarding the first cohort in small batches, profession by
            profession. We’ll email you when your batch opens.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form
      name="waitlist"
      method="POST"
      action="/waitlist-form.html"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={submit}
      onChange={() => {
        if (state === 'error') setState('idle')
      }}
      className="grid gap-5"
    >
      <input type="hidden" name="form-name" value="waitlist" />
      <input type="hidden" name="role" value={role} />
      <p hidden>
        <label>
          Leave empty
          <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <fieldset disabled={state === 'pending'} className="grid gap-5">
        <legend className="sr-only">Join the early-access waitlist</legend>
        <div
          role="radiogroup"
          aria-label="I want to"
          className="grid grid-cols-2 gap-1 rounded-lg border border-primary-foreground/20 p-1"
        >
          {(
            [
              ['work', 'Get verified & hired'],
              ['hire', 'Hire professionals'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={role === value}
              onClick={() => setRole(value)}
              className={cn(
                'rounded-md px-3 py-2 text-sm transition-colors motion-reduce:transition-none',
                role === value
                  ? 'bg-primary-foreground text-ink-deep'
                  : 'text-primary-foreground/70 hover:text-primary-foreground',
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="wl-name" className="text-primary-foreground/80">
              Full name
            </Label>
            <Input
              id="wl-name"
              name="name"
              required
              maxLength={100}
              autoComplete="name"
              placeholder="Meera Iyer"
              className="border-primary-foreground/25 bg-transparent text-primary-foreground placeholder:text-primary-foreground/35"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="wl-email" className="text-primary-foreground/80">
              Work email
            </Label>
            <Input
              id="wl-email"
              name="email"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              placeholder="meera@studio.in"
              className="border-primary-foreground/25 bg-transparent text-primary-foreground placeholder:text-primary-foreground/35"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="wl-prof" className="text-primary-foreground/80">
            {role === 'work' ? 'Your profession' : 'Who you want to hire'}
          </Label>
          <select
            id="wl-prof"
            name="profession"
            required
            defaultValue=""
            className="h-9 rounded-md border border-primary-foreground/25 bg-transparent px-3 text-sm text-primary-foreground outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 [&>option]:text-foreground"
          >
            <option value="" disabled>
              Choose one
            </option>
            {PROFESSIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
            <option value="Other">Something else</option>
          </select>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-seal text-seal-foreground hover:bg-seal/90 sm:w-fit"
        >
          {state === 'pending' ? 'Adding you…' : 'Request early access'}
          {state !== 'pending' && <ArrowRight />}
        </Button>
      </fieldset>

      {state === 'error' && (
        <p role="alert" className="text-sm text-turmeric">
          We couldn’t confirm your request. Your details are still here — please
          try again in a moment.
        </p>
      )}
    </form>
  )
}

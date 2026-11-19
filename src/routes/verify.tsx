import { useEffect, useRef, useState, type FormEvent } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowUpRight, Check, CircleAlert, Plus, ScanLine } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageShell } from '@/components/pramaan/layout'
import {
  EvidenceGlyph,
  Monogram,
  SectionLabel,
  TrustSeal,
} from '@/components/pramaan/primitives'
import {
  EVIDENCE_KIND_LABEL,
  EVIDENCE_SOURCES,
  PIPELINE_STAGES,
  getProfessional,
  verificationQueue,
  type EvidenceKind,
  type QueueItem,
} from '@/data/fixtures'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/verify')({
  head: () => ({
    meta: [{ title: 'Verification Engine — Pramaan TrustCore' }],
  }),
  component: VerifyConsole,
})

const STAGE_MS = 1100
const FINAL_STAGE = PIPELINE_STAGES.length

/** Demo weights per evidence kind — the real engine computes these. */
const DEMO_WEIGHT: Record<EvidenceKind, number> = {
  'connected-account': 4.6,
  'verified-work': 6.2,
  assessment: 7.9,
  portfolio: 5.3,
  'project-performance': 8.8,
  credential: 3.4,
}

type LiveItem = QueueItem & { live?: boolean }

function VerifyConsole() {
  const me = getProfessional('ishaan-varadarajan')!
  const [kind, setKind] = useState<EvidenceKind>('verified-work')
  const [queue, setQueue] = useState<LiveItem[]>(verificationQueue)
  const [errors, setErrors] = useState<{ title?: string; source?: string }>({})
  const formRef = useRef<HTMLFormElement>(null)
  const queueRef = useRef(queue)
  useEffect(() => {
    queueRef.current = queue
  }, [queue])

  // Record preview is derived from items this session has pushed through.
  const recorded = queue.filter((q) => q.live && q.stage >= FINAL_STAGE)
  const gain = recorded.reduce((g, q) => g + DEMO_WEIGHT[q.kind] * 0.06, 0)
  const index = Math.min(99.4, +(me.trustIndex + gain).toFixed(1))
  const verifiedCount =
    me.evidence.filter((e) => e.status === 'verified').length + recorded.length

  const hasLive = queue.some((q) => q.live && q.stage < FINAL_STAGE)

  useEffect(() => {
    if (!hasLive) return
    const t = setInterval(() => {
      const next = queueRef.current.map((q) =>
        q.live && q.stage < FINAL_STAGE ? { ...q, stage: q.stage + 1 } : q,
      )
      for (const q of next) {
        const before = queueRef.current.find((p) => p.id === q.id)
        if (
          q.live &&
          q.stage === FINAL_STAGE &&
          before &&
          before.stage < FINAL_STAGE
        ) {
          toast.success('Evidence verified and recorded', {
            description: `${q.title} · +${DEMO_WEIGHT[q.kind].toFixed(1)} weight`,
          })
        }
      }
      queueRef.current = next
      setQueue(next)
    }, STAGE_MS)
    return () => clearInterval(t)
  }, [hasLive])

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const title = String(data.get('title') ?? '').trim()
    const source = String(data.get('source') ?? '').trim()
    const next: typeof errors = {}
    if (title.length < 6)
      next.title = 'Describe the evidence in at least 6 characters.'
    if (source.length < 3)
      next.source = 'Add where we can verify it — a link, registry or client.'
    setErrors(next)
    if (Object.keys(next).length) return

    const item: LiveItem = {
      id: `live-${Date.now()}`,
      kind,
      title,
      source,
      stage: 0,
      submitted: 'Just now',
      live: true,
    }
    setQueue((qs) => [item, ...qs])
    formRef.current?.reset()
    toast('Submitted to TrustCore', {
      description: 'Watch it move through the pipeline below.',
    })
  }

  const active = EVIDENCE_SOURCES.find((s) => s.kind === kind)!

  return (
    <PageShell>
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-content px-4 pb-10 pt-12 sm:px-6">
          <SectionLabel>TrustCore · Verification Engine</SectionLabel>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-4xl leading-tight sm:text-5xl">
                Turn your work into proof.
              </h1>
              <p className="mt-4 text-muted-foreground">
                Submit any kind of professional evidence. TrustCore checks where
                it came from, confirms it’s yours, maps it to skills and writes
                it to your Capability Record.
              </p>
            </div>
            <p className="font-data rounded-md border border-dashed border-border bg-card px-3 py-2 text-[11px] uppercase tracking-widest text-muted-foreground">
              Interactive preview · sample record
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-content gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_22rem]">
        <div className="grid gap-8">
          {/* Add evidence */}
          <section
            aria-labelledby="add-evidence"
            className="rounded-xl border border-border bg-card p-6 sm:p-8"
          >
            <h2 id="add-evidence" className="text-3xl">
              Add evidence
            </h2>
            <div
              role="radiogroup"
              aria-label="Evidence type"
              className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3"
            >
              {EVIDENCE_SOURCES.map((s) => (
                <button
                  key={s.kind}
                  type="button"
                  role="radio"
                  aria-checked={kind === s.kind}
                  onClick={() => setKind(s.kind)}
                  className={cn(
                    'flex items-start gap-3 rounded-lg border p-3 text-left transition-colors motion-reduce:transition-none',
                    kind === s.kind
                      ? 'border-primary bg-accent'
                      : 'border-border hover:border-primary/40 hover:bg-muted/60',
                  )}
                >
                  <EvidenceGlyph kind={s.kind} className="size-8" />
                  <span>
                    <span className="block text-sm font-medium">{s.label}</span>
                    <span className="block text-xs text-muted-foreground">
                      {s.examples}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <form
              ref={formRef}
              onSubmit={submit}
              noValidate
              className="mt-6 grid gap-4 border-t border-dashed border-border pt-6 sm:grid-cols-[1.3fr_1fr_auto] sm:items-start"
            >
              <div className="grid gap-2">
                <Label htmlFor="ev-title">What is it?</Label>
                <Input
                  id="ev-title"
                  name="title"
                  placeholder={
                    kind === 'project-performance'
                      ? 'Checkout rebuild for a Jaipur D2C brand'
                      : kind === 'credential'
                        ? 'AWS Solutions Architect — Associate'
                        : 'Conference talk at PyCon India 2026'
                  }
                  aria-invalid={!!errors.title}
                  aria-describedby={errors.title ? 'ev-title-err' : undefined}
                  onChange={() =>
                    errors.title &&
                    setErrors((x) => ({ ...x, title: undefined }))
                  }
                />
                {errors.title && (
                  <p
                    id="ev-title-err"
                    className="flex items-center gap-1 text-xs text-destructive"
                  >
                    <CircleAlert className="size-3" /> {errors.title}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ev-source">Where can we verify it?</Label>
                <Input
                  id="ev-source"
                  name="source"
                  placeholder={active.examples.split(',')[0]}
                  aria-invalid={!!errors.source}
                  aria-describedby={errors.source ? 'ev-source-err' : undefined}
                  onChange={() =>
                    errors.source &&
                    setErrors((x) => ({ ...x, source: undefined }))
                  }
                />
                {errors.source && (
                  <p
                    id="ev-source-err"
                    className="flex items-center gap-1 text-xs text-destructive"
                  >
                    <CircleAlert className="size-3" /> {errors.source}
                  </p>
                )}
              </div>
              <Button type="submit" className="sm:mt-[1.375rem]">
                <Plus /> Submit
              </Button>
            </form>
          </section>

          {/* Queue */}
          <section aria-labelledby="queue">
            <div className="flex items-baseline justify-between gap-4">
              <h2 id="queue" className="text-3xl">
                Verification queue
              </h2>
              <span className="font-data text-xs text-muted-foreground">
                {queue.filter((q) => q.stage < FINAL_STAGE).length} in progress
              </span>
            </div>
            {queue.length === 0 ? (
              <div className="mt-5 rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
                Nothing in the queue. Add a piece of evidence above to start.
              </div>
            ) : (
              <ul className="mt-5 grid gap-3">
                {queue.map((q) => (
                  <QueueRow key={q.id} item={q} />
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Record preview */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="font-data text-[11px] uppercase tracking-widest text-muted-foreground">
              Your Capability Record
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Monogram initials={me.initials} hue={me.hue} size="sm" />
              <div>
                <p className="font-display text-xl leading-tight">{me.name}</p>
                <p className="font-data text-[11px] text-muted-foreground">
                  {me.recordId}
                </p>
              </div>
            </div>
            <div className="my-6 flex justify-center">
              <TrustSeal score={index} tier={me.tier} size={176} />
            </div>
            <dl className="grid grid-cols-2 gap-4 border-t border-border pt-5 text-sm">
              <div>
                <dt className="font-data text-[10px] uppercase tracking-widest text-muted-foreground">
                  Verified items
                </dt>
                <dd className="font-display mt-0.5 text-2xl">
                  {verifiedCount}
                </dd>
              </div>
              <div>
                <dt className="font-data text-[10px] uppercase tracking-widest text-muted-foreground">
                  Skills mapped
                </dt>
                <dd className="font-display mt-0.5 text-2xl">
                  {me.skills.length}
                </dd>
              </div>
            </dl>
            <Button asChild variant="outline" className="mt-6 w-full">
              <Link to="/talent/$id" params={{ id: me.id }}>
                View public record <ArrowUpRight />
              </Link>
            </Button>
          </div>
          <div className="mt-4 rounded-xl border border-border bg-muted/50 p-5 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Why some items wait</p>
            <p className="mt-1.5">
              Evidence that depends on a third party, such as a client
              confirmation or a registry, stays in review until they respond. It
              never counts towards your index until it’s confirmed.
            </p>
          </div>
        </aside>
      </div>
    </PageShell>
  )
}

function QueueRow({ item }: { item: LiveItem }) {
  const done = item.stage >= FINAL_STAGE
  const current = PIPELINE_STAGES[Math.min(item.stage, FINAL_STAGE - 1)]
  return (
    <li
      className={cn(
        'rise relative overflow-hidden rounded-xl border bg-card p-5',
        done ? 'border-primary/30' : 'border-border',
      )}
    >
      {!done && item.live && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 overflow-hidden">
          <div className="animate-scan h-full w-1/3 bg-seal/70" />
        </div>
      )}
      <div className="flex items-start gap-4">
        <EvidenceGlyph kind={item.kind} />
        <div className="min-w-0 flex-1">
          <p className="font-data text-[10px] uppercase tracking-widest text-muted-foreground">
            {EVIDENCE_KIND_LABEL[item.kind]} · {item.source} · {item.submitted}
          </p>
          <p className="mt-1 font-medium leading-snug">{item.title}</p>
        </div>
        {done ? (
          <span className="animate-stamp inline-flex shrink-0 items-center gap-1 rounded-full border border-seal/50 px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-seal">
            <Check className="size-3.5" /> Recorded
          </span>
        ) : (
          <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
            <ScanLine className="size-3.5 text-seal" /> {current.label}
          </span>
        )}
      </div>

      <ol
        className="mt-5 grid grid-cols-6 gap-1.5"
        aria-label={`Stage ${Math.min(item.stage + 1, FINAL_STAGE)} of ${FINAL_STAGE}`}
      >
        {PIPELINE_STAGES.map((s, i) => {
          const state =
            i < item.stage
              ? 'done'
              : i === item.stage && !done
                ? 'active'
                : 'todo'
          return (
            <li key={s.key} className="grid gap-1.5">
              <span
                className={cn(
                  'h-1.5 rounded-full transition-colors duration-500 motion-reduce:transition-none',
                  state === 'done' && 'bg-primary',
                  state === 'active' && 'bg-seal',
                  state === 'todo' && 'bg-muted',
                )}
              />
              <span
                className={cn(
                  'font-data hidden truncate text-[10px] uppercase tracking-wider sm:block',
                  state === 'todo'
                    ? 'text-muted-foreground/60'
                    : 'text-foreground/75',
                )}
              >
                {s.label}
              </span>
            </li>
          )
        })}
      </ol>
      {item.note && !done && (
        <p className="mt-3 text-xs text-muted-foreground">{item.note}</p>
      )}
    </li>
  )
}

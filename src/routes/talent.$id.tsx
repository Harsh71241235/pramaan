import { useState } from 'react'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Clock,
  Languages,
  MapPin,
  Quote,
  Share2,
  Star,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { PageShell } from '@/components/pramaan/layout'
import {
  DimensionBars,
  EvidenceGlyph,
  Monogram,
  SectionLabel,
  StatusPill,
  TierBadge,
  TrustSeal,
} from '@/components/pramaan/primitives'
import {
  EVIDENCE_KIND_LABEL,
  formatInr,
  getProfessional,
  type EvidenceKind,
  type Professional,
} from '@/data/fixtures'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/talent/$id')({
  loader: ({ params }) => {
    const pro = getProfessional(params.id)
    if (!pro) throw notFound()
    return pro
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Capability Record · Pramaan` },
          { name: 'description', content: loaderData.headline },
        ]
      : [],
  }),
  component: CapabilityRecord,
  notFoundComponent: RecordNotFound,
})

function RecordNotFound() {
  return (
    <PageShell>
      <div className="mx-auto flex max-w-reading flex-col items-center px-4 py-28 text-center sm:px-6">
        <TrustSeal
          score={0}
          tier={1}
          size={120}
          spin={false}
          className="opacity-40 grayscale"
        />
        <h1 className="mt-8 text-4xl">No Capability Record here</h1>
        <p className="mt-3 text-muted-foreground">
          This record doesn’t exist or is no longer shared publicly.
        </p>
        <Button asChild className="mt-8">
          <Link to="/talent">Browse verified professionals</Link>
        </Button>
      </div>
    </PageShell>
  )
}

function CapabilityRecord() {
  const pro = Route.useLoaderData()
  const [saved, setSaved] = useState(false)
  const verified = pro.evidence.filter((e) => e.status === 'verified')

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Record link copied', {
        description: 'Anyone with the link can inspect this record’s evidence.',
      })
    } catch {
      toast.error('Couldn’t copy the link', {
        description: 'Copy it from the address bar instead.',
      })
    }
  }

  return (
    <PageShell>
      <section className="relative overflow-hidden border-b border-border">
        <div className="ledger-rules pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-content px-4 pb-12 pt-8 sm:px-6">
          <Link
            to="/talent"
            className="inline-flex items-center gap-1.5 rounded-sm text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> All professionals
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_auto]">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <Monogram initials={pro.initials} hue={pro.hue} size="lg" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <TierBadge tier={pro.tier} />
                  <span className="font-data text-xs text-muted-foreground">
                    {pro.recordId}
                  </span>
                </div>
                <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">
                  {pro.name}
                </h1>
                <p className="mt-2 max-w-2xl text-lg text-foreground/80">
                  {pro.headline}
                </p>
                <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-4" /> {pro.city}, {pro.state}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Languages className="size-4" /> {pro.languages.join(' · ')}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-4" /> Replies {pro.responseTime}
                  </span>
                </p>
                <p className="mt-5 max-w-2xl text-muted-foreground">
                  {pro.summary}
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button asChild>
                    <a href="/#waitlist">
                      Invite to a project <ArrowRight />
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-card"
                    aria-pressed={saved}
                    onClick={() => {
                      setSaved((s) => !s)
                      toast(
                        saved
                          ? 'Removed from shortlist'
                          : 'Added to your shortlist',
                        {
                          description: saved
                            ? undefined
                            : 'Shortlists sync to your account once client accounts launch.',
                        },
                      )
                    }}
                  >
                    {saved ? (
                      <BookmarkCheck className="text-seal" />
                    ) : (
                      <Bookmark />
                    )}
                    {saved ? 'Shortlisted' : 'Shortlist'}
                  </Button>
                  <Button variant="ghost" onClick={share}>
                    <Share2 /> Share record
                  </Button>
                </div>
              </div>
            </div>

            <aside className="flex flex-row items-center gap-6 rounded-xl border border-border bg-card p-6 lg:flex-col lg:items-stretch">
              <TrustSeal
                score={pro.trustIndex}
                tier={pro.tier}
                size={168}
                className="mx-auto"
              />
              <dl className="grid flex-1 grid-cols-2 gap-x-6 gap-y-4 text-sm lg:mt-2">
                <Stat
                  label="Rate"
                  value={`${formatInr(pro.rateInr)}/${pro.rateUnit}`}
                />
                <Stat label="Availability" value={pro.availability} />
                <Stat label="On time" value={`${pro.onTimeRate}%`} />
                <Stat
                  label="Repeat clients"
                  value={`${pro.repeatClientRate}%`}
                />
                <Stat label="Projects" value={String(pro.projectsCompleted)} />
                <Stat label="Member since" value={pro.memberSince} />
              </dl>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 py-10 sm:px-6">
        <Tabs defaultValue="evidence">
          <TabsList
            variant="line"
            className="w-full justify-start gap-7 overflow-x-auto rounded-none border-b border-border p-0 group-data-[orientation=horizontal]/tabs:h-auto"
          >
            {[
              ['evidence', `Evidence ledger (${pro.evidence.length})`],
              ['skills', 'Verified skills'],
              ['projects', 'Project performance'],
              ['score', 'How the index is built'],
            ].map(([v, l]) => (
              <TabsTrigger
                key={v}
                value={v}
                className="h-auto flex-none rounded-none px-0 pb-3 pt-1 text-base after:bg-seal group-data-[orientation=horizontal]/tabs:after:bottom-0"
              >
                {l}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="evidence" className="mt-8">
            <EvidenceLedger pro={pro} />
          </TabsContent>
          <TabsContent value="skills" className="mt-8">
            <SkillsTable pro={pro} />
          </TabsContent>
          <TabsContent value="projects" className="mt-8">
            <Projects pro={pro} />
          </TabsContent>
          <TabsContent value="score" className="mt-8">
            <ScoreExplainer pro={pro} verifiedCount={verified.length} />
          </TabsContent>
        </Tabs>
      </section>
    </PageShell>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-data text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  )
}

function EvidenceLedger({ pro }: { pro: Professional }) {
  const kinds = Array.from(new Set(pro.evidence.map((e) => e.kind)))
  const [filter, setFilter] = useState<EvidenceKind | 'all'>('all')
  const items =
    filter === 'all'
      ? pro.evidence
      : pro.evidence.filter((e) => e.kind === filter)

  return (
    <div className="grid gap-8 lg:grid-cols-[14rem_1fr]">
      <div
        className="flex flex-wrap gap-2 lg:flex-col"
        role="group"
        aria-label="Filter evidence"
      >
        {(['all', ...kinds] as const).map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={filter === k}
            onClick={() => setFilter(k)}
            className={cn(
              'flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-left text-sm transition-colors motion-reduce:transition-none',
              filter === k
                ? 'border-primary bg-accent text-foreground'
                : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            {k === 'all' ? 'All evidence' : EVIDENCE_KIND_LABEL[k]}
            <span className="font-data text-xs">
              {k === 'all'
                ? pro.evidence.length
                : pro.evidence.filter((e) => e.kind === k).length}
            </span>
          </button>
        ))}
      </div>

      <Accordion type="multiple" className="grid gap-3">
        {items.map((e) => (
          <AccordionItem
            key={e.id}
            value={e.id}
            className="rounded-xl border border-border bg-card px-5 last:border-b"
          >
            <AccordionTrigger className="gap-4 py-5 hover:no-underline">
              <div className="flex min-w-0 flex-1 items-start gap-4 text-left">
                <EvidenceGlyph kind={e.kind} />
                <div className="min-w-0 flex-1">
                  <p className="font-data text-[10px] uppercase tracking-widest text-muted-foreground">
                    {EVIDENCE_KIND_LABEL[e.kind]} · {e.source}
                  </p>
                  <p className="mt-1 text-base font-medium leading-snug">
                    {e.title}
                  </p>
                </div>
                <div className="hidden shrink-0 flex-col items-end gap-1.5 sm:flex">
                  <StatusPill status={e.status} />
                  {e.weight > 0 && (
                    <span className="font-data text-[11px] text-muted-foreground">
                      +{e.weight.toFixed(1)} weight
                    </span>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-6 border-t border-dashed border-border pt-5 sm:grid-cols-[1.4fr_1fr]">
                <div>
                  <div className="mb-3 sm:hidden">
                    <StatusPill status={e.status} />
                  </div>
                  <p className="text-sm text-foreground/85">{e.detail}</p>
                  {e.signals.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {e.signals.map((s) => (
                        <li
                          key={s}
                          className="rounded-md bg-muted px-2 py-1 text-xs text-foreground/80"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <dl className="font-data grid gap-3 text-xs">
                  <Row k="Method" v={e.method} />
                  <Row k="Verified on" v={e.verifiedOn} />
                  <Row
                    k="Maps to"
                    v={e.skills.length ? e.skills.join(', ') : 'Identity only'}
                  />
                  <Row
                    k="Proof ID"
                    v={`${pro.recordId}/${e.id.toUpperCase()}`}
                  />
                </dl>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-[6.5rem_1fr] gap-2">
      <dt className="uppercase tracking-wider text-muted-foreground">{k}</dt>
      <dd className="text-foreground/85">{v}</dd>
    </div>
  )
}

function SkillsTable({ pro }: { pro: Professional }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="font-data hidden grid-cols-[1.2fr_2fr_0.7fr_0.8fr] gap-4 border-b border-border bg-muted/60 px-6 py-3 text-[11px] uppercase tracking-widest text-muted-foreground sm:grid">
        <span>Skill</span>
        <span>Confidence</span>
        <span>Evidence</span>
        <span>Last evidenced</span>
      </div>
      <ul>
        {pro.skills.map((s) => (
          <li
            key={s.name}
            className="grid gap-3 border-b border-border px-6 py-5 last:border-b-0 sm:grid-cols-[1.2fr_2fr_0.7fr_0.8fr] sm:items-center sm:gap-4"
          >
            <span className="font-display text-xl">{s.name}</span>
            <span className="flex items-center gap-3">
              <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-primary"
                  style={{ width: `${s.confidence}%` }}
                />
              </span>
              <span className="font-data w-10 text-right text-sm">
                {s.confidence}%
              </span>
            </span>
            <span className="font-data text-sm text-muted-foreground">
              {s.evidenceCount} items
            </span>
            <span className="font-data text-sm text-muted-foreground">
              {s.lastEvidenced}
            </span>
          </li>
        ))}
      </ul>
      <p className="border-t border-border bg-muted/40 px-6 py-3 text-xs text-muted-foreground">
        Confidence reflects how many independent sources support a skill and how
        well they agree. Self-reported skills are never shown here.
      </p>
    </div>
  )
}

function Projects({ pro }: { pro: Professional }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {pro.projects.map((p, i) => (
        <article
          key={p.title}
          className={cn(
            'flex flex-col justify-between rounded-xl border border-border bg-card p-6',
            i === 0 && pro.projects.length > 2 && 'md:row-span-2',
          )}
        >
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-data text-[10px] uppercase tracking-widest text-muted-foreground">
                  {p.client} · {p.delivered}
                </p>
                <h3 className="mt-1.5 text-2xl leading-tight">{p.title}</h3>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-turmeric/20 px-2 py-0.5 text-sm">
                <Star className="size-3.5 fill-current text-[oklch(0.6_0.13_75)]" />
                {p.rating.toFixed(1)}
              </span>
            </div>
            <blockquote className="relative mt-6 border-l-2 border-seal/50 pl-4 text-foreground/85">
              <Quote
                className="absolute -left-2.5 -top-3 size-5 bg-card text-seal"
                aria-hidden
              />
              {p.clientNote}
            </blockquote>
          </div>
          <div className="font-data mt-6 flex flex-wrap gap-x-6 gap-y-1 border-t border-dashed border-border pt-4 text-xs text-muted-foreground">
            <span>Contract value {formatInr(p.budgetInr)}</span>
            <span
              className={p.onTime ? 'text-primary' : 'text-[oklch(0.5_0.1_70)]'}
            >
              {p.onTime ? 'Delivered on time' : 'Delivered late'}
            </span>
            <span>Client-confirmed</span>
          </div>
        </article>
      ))}
    </div>
  )
}

function ScoreExplainer({
  pro,
  verifiedCount,
}: {
  pro: Professional
  verifiedCount: number
}) {
  const contributions = [...pro.evidence]
    .filter((e) => e.weight > 0)
    .sort((a, b) => b.weight - a.weight)
  const max = Math.max(...contributions.map((c) => c.weight), 1)
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
        <SectionLabel>Five dimensions</SectionLabel>
        <p className="mt-4 text-sm text-muted-foreground">
          The TrustCore index of{' '}
          <span className="font-medium text-foreground">
            {pro.trustIndex.toFixed(1)}
          </span>{' '}
          blends these published dimensions. Weights are the same for every
          profession; only the evidence differs.
        </p>
        <div className="mt-6">
          <DimensionBars dimensions={pro.dimensions} />
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
        <SectionLabel>What moved the needle</SectionLabel>
        <p className="mt-4 text-sm text-muted-foreground">
          {verifiedCount} of {pro.evidence.length} evidence items are verified.
          Items in review or self-reported contribute nothing until confirmed.
        </p>
        <ul className="mt-6 grid gap-4">
          {contributions.map((e) => (
            <li key={e.id} className="grid gap-1.5">
              <div className="flex items-baseline justify-between gap-4">
                <span className="truncate text-sm">{e.title}</span>
                <span className="font-data shrink-0 text-xs text-muted-foreground">
                  +{e.weight.toFixed(1)}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-seal"
                  style={{ width: `${(e.weight / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  Clock,
  Languages,
  MapPin,
  Search,
  SearchX,
  SlidersHorizontal,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { PageShell } from '@/components/pramaan/layout'
import {
  EVIDENCE_ICON,
  Monogram,
  SectionLabel,
  TierBadge,
  TrustSeal,
} from '@/components/pramaan/primitives'
import {
  EVIDENCE_KIND_LABEL,
  PROFESSIONS,
  formatInr,
  professionals,
  type EvidenceKind,
  type Professional,
  type TrustTier,
} from '@/data/fixtures'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/talent/')({
  head: () => ({
    meta: [{ title: 'Discover verified talent — Pramaan' }],
  }),
  component: Discover,
})

type Sort = 'trust' | 'rate' | 'projects' | 'recent'

function Discover() {
  const [query, setQuery] = useState('')
  const [profession, setProfession] = useState<string>('all')
  const [minTier, setMinTier] = useState<TrustTier>(1)
  const [availableOnly, setAvailableOnly] = useState(false)
  const [sort, setSort] = useState<Sort>('trust')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = professionals.filter((p) => {
      if (profession !== 'all' && p.profession !== profession) return false
      if (p.tier < minTier) return false
      if (availableOnly && p.availability !== 'Available now') return false
      if (!q) return true
      const hay = [
        p.name,
        p.headline,
        p.city,
        p.state,
        p.profession,
        ...p.languages,
        ...p.skills.map((s) => s.name),
      ]
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
    return [...list].sort((a, b) => {
      if (sort === 'trust') return b.trustIndex - a.trustIndex
      if (sort === 'projects') return b.projectsCompleted - a.projectsCompleted
      if (sort === 'recent')
        return b.dimensions[2].value - a.dimensions[2].value
      return a.rateInr - b.rateInr
    })
  }, [query, profession, minTier, availableOnly, sort])

  const reset = () => {
    setQuery('')
    setProfession('all')
    setMinTier(1)
    setAvailableOnly(false)
  }

  return (
    <PageShell>
      <section className="border-b border-border">
        <div className="mx-auto max-w-content px-4 pb-10 pt-12 sm:px-6">
          <SectionLabel>Discover</SectionLabel>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
            <h1 className="max-w-2xl text-4xl leading-tight sm:text-5xl">
              Verified professionals, ranked by what they’ve proven.
            </h1>
            <p className="max-w-sm text-sm text-muted-foreground">
              Every profile is a Capability Record. Filter by trust tier and
              open any piece of evidence to see how TrustCore verified it.
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search a skill, city or language — e.g. “Power BI”, “Pune”, “Telugu”"
                aria-label="Search professionals"
                className="h-12 bg-card pl-10 text-base"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
                <SelectTrigger
                  className="h-12 w-[13rem] bg-card"
                  aria-label="Sort by"
                >
                  <SlidersHorizontal className="size-4 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trust">Highest TrustCore index</SelectItem>
                  <SelectItem value="projects">
                    Most projects delivered
                  </SelectItem>
                  <SelectItem value="recent">Most recent evidence</SelectItem>
                  <SelectItem value="rate">Lowest rate</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex h-12 items-center gap-2.5 rounded-md border border-input bg-card px-4">
                <Switch
                  id="avail"
                  checked={availableOnly}
                  onCheckedChange={setAvailableOnly}
                />
                <Label htmlFor="avail" className="text-sm font-normal">
                  Available now
                </Label>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Profession"
            >
              {['all', ...PROFESSIONS].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setProfession(p)}
                  aria-pressed={profession === p}
                  className={cn(
                    'rounded-full border px-3.5 py-1.5 text-sm transition-colors motion-reduce:transition-none',
                    profession === p
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-foreground/75 hover:border-primary/40 hover:text-foreground',
                  )}
                >
                  {p === 'all' ? 'All professions' : p}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="font-data text-[11px] uppercase tracking-widest text-muted-foreground">
              Minimum tier
            </span>
            <div className="inline-flex rounded-md border border-border bg-card p-0.5">
              {([1, 2, 3] as TrustTier[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setMinTier(t)}
                  aria-pressed={minTier === t}
                  className={cn(
                    'font-data rounded px-3 py-1 text-xs transition-colors motion-reduce:transition-none',
                    minTier === t
                      ? 'bg-seal text-seal-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {t === 1
                    ? 'T1 Linked+'
                    : t === 2
                      ? 'T2 Assessed+'
                      : 'T3 Proven'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 py-10 sm:px-6">
        <p
          className="font-data mb-5 text-xs text-muted-foreground"
          aria-live="polite"
        >
          {results.length} {results.length === 1 ? 'record' : 'records'} match
        </p>
        {results.length === 0 ? (
          <EmptyState onReset={reset} />
        ) : (
          <ul className="grid gap-4">
            {results.map((p, i) => (
              <li
                key={p.id}
                className="rise"
                style={{ animationDelay: `${Math.min(i, 6) * 60}ms` }}
              >
                <ProfessionalRow pro={p} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </PageShell>
  )
}

function ProfessionalRow({ pro }: { pro: Professional }) {
  const kindCounts = pro.evidence.reduce<Partial<Record<EvidenceKind, number>>>(
    (acc, e) => {
      if (e.status === 'verified') acc[e.kind] = (acc[e.kind] ?? 0) + 1
      return acc
    },
    {},
  )
  return (
    <article className="group grid gap-6 rounded-xl border border-border bg-card p-5 transition-[border-color,box-shadow] duration-300 hover:border-primary/35 hover:shadow-[0_18px_40px_-28px_oklch(0.3_0.04_160/0.45)] motion-reduce:transition-none sm:p-6 md:grid-cols-[1fr_auto]">
      <div className="min-w-0">
        <div className="flex items-start gap-4">
          <Monogram initials={pro.initials} hue={pro.hue} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h2 className="font-display text-2xl leading-tight">
                <Link
                  to="/talent/$id"
                  params={{ id: pro.id }}
                  className="rounded-sm outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  {pro.name}
                </Link>
              </h2>
              <TierBadge tier={pro.tier} />
            </div>
            <p className="mt-1 text-sm text-foreground/80">{pro.headline}</p>
            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3" /> {pro.city}, {pro.state}
              </span>
              <span className="inline-flex items-center gap-1">
                <Languages className="size-3" /> {pro.languages.join(', ')}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3" /> Replies {pro.responseTime}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {pro.skills.map((s) => (
            <span
              key={s.name}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1 text-xs"
            >
              {s.name}
              <span className="font-data text-[10px] text-muted-foreground">
                {s.evidenceCount}×
              </span>
              <span
                className="h-1 w-8 overflow-hidden rounded-full bg-muted"
                aria-label={`${s.confidence}% confidence`}
              >
                <span
                  className="block h-full rounded-full bg-primary"
                  style={{ width: `${s.confidence}%` }}
                />
              </span>
            </span>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-dashed border-border pt-4">
          <span className="font-data text-[11px] uppercase tracking-widest text-muted-foreground">
            Verified evidence
          </span>
          <div className="flex flex-wrap gap-3">
            {(Object.keys(kindCounts) as EvidenceKind[]).map((k) => {
              const Icon = EVIDENCE_ICON[k]
              return (
                <Tooltip key={k}>
                  <TooltipTrigger asChild>
                    <span
                      tabIndex={0}
                      className="inline-flex items-center gap-1.5 rounded-sm text-xs text-primary outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    >
                      <Icon className="size-3.5" aria-hidden />
                      <span className="font-data">{kindCounts[k]}</span>
                      <span className="sr-only">{EVIDENCE_KIND_LABEL[k]}</span>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{EVIDENCE_KIND_LABEL[k]}</TooltipContent>
                </Tooltip>
              )
            })}
          </div>
          <span className="text-xs text-muted-foreground">
            · {pro.projectsCompleted} projects · {pro.onTimeRate}% on time
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-6 border-t border-border pt-5 md:flex-col md:items-end md:justify-between md:border-l md:border-t-0 md:pl-6 md:pt-0">
        <TrustSeal
          score={pro.trustIndex}
          tier={pro.tier}
          size={104}
          spin={false}
        />
        <div className="text-right">
          <p className="font-display text-2xl">
            {formatInr(pro.rateInr)}
            <span className="text-sm text-muted-foreground">
              {' '}
              / {pro.rateUnit}
            </span>
          </p>
          <p
            className={cn(
              'text-xs',
              pro.availability === 'Available now'
                ? 'text-primary'
                : 'text-muted-foreground',
            )}
          >
            {pro.availability}
          </p>
          <Button asChild size="sm" className="mt-3">
            <Link to="/talent/$id" params={{ id: pro.id }}>
              View record <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="ledger-rules flex flex-col items-center rounded-xl border border-dashed border-border bg-card px-6 py-20 text-center">
      <span className="flex size-14 items-center justify-center rounded-full border border-border bg-background">
        <SearchX className="size-6 text-muted-foreground" />
      </span>
      <h2 className="mt-5 text-3xl">No records match yet</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Try a broader skill, lower the minimum trust tier, or include
        professionals who are available from next week.
      </p>
      <Button variant="outline" className="mt-6" onClick={onReset}>
        Clear filters
      </Button>
    </div>
  )
}

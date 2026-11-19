import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  MapPin,
  ScanLine,
  ShieldCheck,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { PageShell } from '@/components/pramaan/layout'
import {
  DimensionBars,
  EvidenceGlyph,
  Monogram,
  SectionLabel,
  StatusPill,
  TrustSeal,
} from '@/components/pramaan/primitives'
import { WaitlistForm } from '@/components/pramaan/waitlist-form'
import {
  EVIDENCE_KIND_LABEL,
  PIPELINE_STAGES,
  PROFESSIONS,
  getProfessional,
  type EvidenceKind,
} from '@/data/fixtures'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <PageShell>
      <Hero />
      <ProfessionTicker />
      <ClaimsVsEvidence />
      <TrustCoreSection />
      <EvidenceTypes />
      <TwoSides />
      <Vision />
      <Waitlist />
    </PageShell>
  )
}

/* ------------------------------------------------------------------ */

function Hero() {
  const pro = getProfessional('sravya-kothapalli')!
  return (
    <section className="relative overflow-hidden">
      <div className="dot-grid pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] opacity-60 lg:block" />
      <div className="relative mx-auto grid max-w-content gap-14 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-10 lg:pt-24">
        <div className="max-w-xl">
          <div className="rise">
            <SectionLabel>
              India-first · Verified freelance marketplace
            </SectionLabel>
          </div>
          <h1
            className="rise mt-6 text-5xl leading-[1.02] sm:text-6xl lg:text-[5.2rem]"
            style={{ animationDelay: '80ms' }}
          >
            Hire on <em className="italic text-primary">evidence</em>,
            <br />
            not claims.
          </h1>
          <p
            className="rise mt-7 max-w-lg text-lg text-muted-foreground"
            style={{ animationDelay: '160ms' }}
          >
            Pramaan turns connected accounts, verifiable work, practical
            assessments and real project outcomes into one transparent{' '}
            <span className="text-foreground">Capability Record</span>, so
            clients can see exactly why a professional is good, and how we know.
          </p>
          <div
            className="rise mt-9 flex flex-wrap gap-3"
            style={{ animationDelay: '240ms' }}
          >
            <Button asChild size="lg">
              <Link to="/talent">
                Discover verified talent <ArrowRight />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent"
            >
              <Link to="/verify">Build your Capability Record</Link>
            </Button>
          </div>
          <dl
            className="rise mt-12 grid max-w-md grid-cols-3 divide-x divide-border border-y border-border py-4"
            style={{ animationDelay: '320ms' }}
          >
            {[
              ['6', 'evidence types'],
              ['3', 'trust tiers'],
              ['1', 'reusable record'],
            ].map(([n, l]) => (
              <div key={l} className="px-4 first:pl-0">
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-3xl">{n}</dd>
                <dd className="text-xs text-muted-foreground">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Record preview */}
        <div className="relative lg:pl-6">
          <div
            className="rise relative rotate-[0.6deg] rounded-xl border border-border bg-card shadow-[0_30px_60px_-30px_oklch(0.3_0.04_160/0.35)]"
            style={{ animationDelay: '200ms' }}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <span className="font-data text-[11px] uppercase tracking-widest text-muted-foreground">
                Capability Record
              </span>
              <span className="font-data text-[11px] text-muted-foreground">
                {pro.recordId}
              </span>
            </div>
            <div className="flex items-center gap-4 px-5 pt-5">
              <Monogram initials={pro.initials} hue={pro.hue} />
              <div className="min-w-0">
                <p className="font-display text-2xl leading-tight">
                  {pro.name}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {pro.headline}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3" /> {pro.city}, {pro.state}
                </p>
              </div>
            </div>
            <ul className="mt-5 divide-y divide-border border-t border-border">
              {pro.evidence.map((e, i) => (
                <li
                  key={e.id}
                  className="rise flex items-center gap-3 px-5 py-3"
                  style={{ animationDelay: `${450 + i * 140}ms` }}
                >
                  <EvidenceGlyph kind={e.kind} className="size-8" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{e.title}</p>
                    <p className="font-data truncate text-[11px] text-muted-foreground">
                      {e.method}
                    </p>
                  </div>
                  <StatusPill status={e.status} />
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-3 border-t border-border text-center">
              {[
                [`${pro.onTimeRate}%`, 'on time'],
                [`${pro.repeatClientRate}%`, 'repeat clients'],
                [String(pro.projectsCompleted), 'projects'],
              ].map(([v, l]) => (
                <div
                  key={l}
                  className="border-r border-border py-3 last:border-r-0"
                >
                  <p className="font-display text-xl">{v}</p>
                  <p className="text-[11px] text-muted-foreground">{l}</p>
                </div>
              ))}
            </div>
          </div>
          <div
            className="animate-stamp absolute -top-10 right-2 rounded-full bg-background/90 p-1 sm:-right-6"
            style={{ animationDelay: '1300ms' }}
          >
            <TrustSeal score={pro.trustIndex} tier={pro.tier} size={128} />
          </div>
          <Link
            to="/talent/$id"
            params={{ id: pro.id }}
            className="mt-4 inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
          >
            Open Sravya’s full record <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function ProfessionTicker() {
  const items = [
    ...PROFESSIONS,
    'Civil Engineering',
    'Healthcare Writing',
    'Cybersecurity',
    'Sales Operations',
  ]
  return (
    <div
      className="overflow-hidden border-y border-border bg-ink-deep py-4 text-primary-foreground"
      aria-label="Professions Pramaan verifies"
    >
      <div className="animate-ticker flex w-max gap-10">
        {[...items, ...items].map((p, i) => (
          <span
            key={i}
            className="font-display flex items-center gap-10 whitespace-nowrap text-xl text-primary-foreground/85"
            aria-hidden={i >= items.length}
          >
            {p}
            <span className="size-1.5 rounded-full bg-seal" aria-hidden />
          </span>
        ))}
      </div>
    </div>
  )
}

function ClaimsVsEvidence() {
  const rows: [string, string][] = [
    [
      '“Expert in SQL”',
      'Solved 12/12 queries on a 40M-row dataset, top 4% runtime',
    ],
    [
      '“5+ years of design experience”',
      'Figma version history and client attestation on 6 shipped products',
    ],
    [
      '“Detail-oriented CA”',
      '31 filings delivered before statutory deadlines, 72% repeat clients',
    ],
    [
      '“Fluent Malayalam translator”',
      'Blind dual review by native editors, 93/100',
    ],
  ]
  return (
    <section className="mx-auto max-w-content px-4 py-24 sm:px-6">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.4fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionLabel>The problem</SectionLabel>
          <h2 className="mt-5 text-4xl leading-tight sm:text-5xl">
            A resume <span className="italic">says</span>.
            <br />A record <span className="italic text-seal">shows</span>.
          </h2>
          <p className="mt-5 max-w-md text-muted-foreground">
            Hiring still runs on self-reported skills, keyword-matched resumes
            and star ratings nobody can audit. Talented professionals outside a
            few metros and logos get overlooked, and clients take on risk they
            can’t measure.
          </p>
        </div>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="font-data grid grid-cols-[1fr_1.4fr] border-b border-border bg-muted/60 text-[11px] uppercase tracking-widest text-muted-foreground">
            <span className="px-5 py-3">What profiles claim</span>
            <span className="border-l border-border px-5 py-3">
              What Pramaan records
            </span>
          </div>
          {rows.map(([claim, ev]) => (
            <div
              key={claim}
              className="group grid grid-cols-[1fr_1.4fr] border-b border-border last:border-b-0"
            >
              <p className="flex items-start gap-2 px-5 py-5 text-muted-foreground">
                <X
                  className="mt-1 size-4 shrink-0 text-destructive/60"
                  aria-hidden
                />
                <span className="line-through decoration-destructive/40">
                  {claim}
                </span>
              </p>
              <p className="flex items-start gap-2 border-l border-border px-5 py-5 transition-colors group-hover:bg-accent/50 motion-reduce:transition-none">
                <Check
                  className="mt-1 size-4 shrink-0 text-primary"
                  aria-hidden
                />
                {ev}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TrustCoreSection() {
  const sample = getProfessional('ishaan-varadarajan')!
  return (
    <section
      id="trustcore"
      className="scroll-mt-20 border-y border-border bg-secondary/50"
    >
      <div className="mx-auto max-w-content px-4 py-24 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <SectionLabel>TrustCore · Verification Engine</SectionLabel>
            <h2 className="mt-5 text-4xl leading-tight sm:text-5xl">
              One engine for every profession.
            </h2>
            <p className="mt-5 text-muted-foreground">
              A commit history, a GST filing, a Devanagari type system and a
              Revit model look nothing alike. TrustCore runs each one through
              the same six checks and turns it into a structured, reusable
              capability record.
            </p>
          </div>
          <Button asChild variant="outline" className="bg-transparent">
            <Link to="/verify">
              <ScanLine /> See the engine run
            </Link>
          </Button>
        </div>

        <ol className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-6">
          {PIPELINE_STAGES.map((s, i) => (
            <li
              key={s.key}
              className="group relative bg-card p-5 transition-colors hover:bg-accent/60 motion-reduce:transition-none lg:min-h-52"
            >
              <span className="font-data text-xs text-seal">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="font-display mt-6 text-xl">{s.label}</p>
              <p className="mt-2 text-sm text-muted-foreground">{s.detail}</p>
              {i < PIPELINE_STAGES.length - 1 && (
                <ArrowRight
                  className="absolute right-4 top-5 hidden size-4 text-muted-foreground/50 transition-transform group-hover:translate-x-1 lg:block"
                  aria-hidden
                />
              )}
            </li>
          ))}
        </ol>

        <div className="mt-16 grid items-start gap-10 lg:grid-cols-[auto_1fr_1fr]">
          <TrustSeal score={sample.trustIndex} tier={sample.tier} size={170} />
          <div>
            <h3 className="text-3xl">An index you can audit</h3>
            <p className="mt-3 text-muted-foreground">
              The TrustCore index isn’t a popularity score. It combines five
              published dimensions, and every point traces back to a specific
              piece of evidence a client can open and inspect.
            </p>
            <ul className="mt-6 grid gap-3 text-sm">
              {[
                [
                  'T1 Linked',
                  'Identity and accounts connected; sources attributed.',
                ],
                [
                  'T2 Assessed',
                  'Passed a practical assessment reviewed by practitioners.',
                ],
                [
                  'T3 Proven',
                  'Delivered client-confirmed outcomes on real projects.',
                ],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-3">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>
                    <span className="font-medium">{t}</span>{' '}
                    <span className="text-muted-foreground">— {d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="font-data mb-5 text-[11px] uppercase tracking-widest text-muted-foreground">
              Index breakdown · {sample.name}
            </p>
            <DimensionBars dimensions={sample.dimensions} compact />
          </div>
        </div>
      </div>
    </section>
  )
}

function EvidenceTypes() {
  const items: { kind: EvidenceKind; body: string; span: string }[] = [
    {
      kind: 'connected-account',
      body: 'Link GitHub, Behance, Kaggle, DigiLocker and more. We attribute what’s genuinely yours, and leave out forks, templates and vendored code.',
      span: 'lg:col-span-2 lg:row-span-2',
    },
    {
      kind: 'assessment',
      body: 'Practical, profession-specific tasks reviewed by working practitioners. No trivia quizzes.',
      span: '',
    },
    {
      kind: 'project-performance',
      body: 'On-time delivery, outcomes and repeat hires, confirmed by the client and not just star ratings.',
      span: '',
    },
    {
      kind: 'verified-work',
      body: 'Publications, talks, filings and repositories, checked against the source.',
      span: '',
    },
    {
      kind: 'portfolio',
      body: 'Work samples with authorship traced through file history and attestations.',
      span: '',
    },
    {
      kind: 'credential',
      body: 'ICAI, Bar Council, COA and university records, verified against the issuing registry.',
      span: 'lg:col-span-2',
    },
  ]
  return (
    <section
      id="evidence"
      className="mx-auto max-w-content scroll-mt-20 px-4 py-24 sm:px-6"
    >
      <div className="max-w-2xl">
        <SectionLabel>Evidence, not adjectives</SectionLabel>
        <h2 className="mt-5 text-4xl leading-tight sm:text-5xl">
          Six kinds of proof. One structured record.
        </h2>
      </div>
      <div className="mt-12 grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <article
            key={it.kind}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_oklch(0.3_0.04_160/0.4)] motion-reduce:transition-none ${it.span}`}
          >
            {i === 0 && (
              <div className="ledger-rules pointer-events-none absolute inset-0 opacity-60" />
            )}
            <div className="relative">
              <EvidenceGlyph kind={it.kind} />
              <h3
                className={`mt-5 ${i === 0 ? 'text-4xl' : 'text-2xl'} leading-tight`}
              >
                {EVIDENCE_KIND_LABEL[it.kind]}
              </h3>
            </div>
            <p
              className={`relative mt-4 text-muted-foreground ${i === 0 ? 'max-w-sm text-base' : 'text-sm'}`}
            >
              {it.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

function TwoSides() {
  return (
    <section className="mx-auto grid max-w-content gap-6 px-4 sm:px-6 lg:grid-cols-[1.15fr_1fr]">
      <div className="rounded-2xl bg-primary p-8 text-primary-foreground sm:p-12">
        <SectionLabel className="text-turmeric [&>span]:bg-turmeric/60">
          For clients &amp; businesses
        </SectionLabel>
        <h2 className="mt-5 text-4xl leading-tight">
          Shortlist in minutes. Defend every hire.
        </h2>
        <ul className="mt-8 grid gap-4">
          {[
            'Filter by verified skill, evidence type and trust tier, not keywords',
            'Compare professionals on the same five published dimensions',
            'Open any evidence item and see how it was verified',
            'Milestone contracts in ₹ with GST-ready invoicing',
          ].map((t) => (
            <li key={t} className="flex gap-3 text-primary-foreground/85">
              <Check className="mt-1 size-4 shrink-0 text-turmeric" /> {t}
            </li>
          ))}
        </ul>
        <Button
          asChild
          className="mt-10 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
        >
          <Link to="/talent">
            Browse verified professionals <ArrowRight />
          </Link>
        </Button>
      </div>
      <div className="rounded-2xl border border-border bg-card p-8 sm:mt-16 sm:p-12">
        <SectionLabel>For professionals</SectionLabel>
        <h2 className="mt-5 text-4xl leading-tight">
          Prove it once. Reuse it everywhere.
        </h2>
        <p className="mt-5 text-muted-foreground">
          Your Capability Record belongs to you. Every verified project and
          assessment adds to it, so you never have to re-prove the same skill to
          the next client, platform or employer.
        </p>
        <ul className="mt-6 grid gap-3 text-sm">
          {[
            'Be discovered for what you can do, wherever you live',
            'Win work on evidence, not on bidding the lowest price',
            'Share a verifiable link to your record anywhere',
          ].map((t) => (
            <li key={t} className="flex gap-3">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {t}
            </li>
          ))}
        </ul>
        <Button asChild variant="outline" className="mt-10 bg-transparent">
          <Link to="/verify">Start your record</Link>
        </Button>
      </div>
    </section>
  )
}

function Vision() {
  const steps = [
    {
      phase: 'Now',
      title: 'Verified freelance marketplace',
      body: 'Clients hire professionals using structured evidence. Every engagement strengthens the record.',
    },
    {
      phase: 'Next',
      title: 'Portable professional identity',
      body: 'Capability Records that professionals carry across platforms, with consented, verifiable sharing.',
    },
    {
      phase: 'Later',
      title: 'Talent discovery & recruitment',
      body: 'Full-time hiring that starts from verified capability instead of resume screening.',
    },
    {
      phase: 'Horizon',
      title: 'Enterprise talent intelligence',
      body: 'Organisations understand, develop and deploy capability across their workforce.',
    },
  ]
  return (
    <section
      id="vision"
      className="mx-auto max-w-content scroll-mt-20 px-4 py-28 sm:px-6"
    >
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionLabel>Where this goes</SectionLabel>
          <h2 className="mt-5 text-4xl leading-tight sm:text-5xl">
            Trusted infrastructure for capability and opportunity.
          </h2>
          <p className="mt-5 max-w-md text-muted-foreground">
            The marketplace comes first. The verification layer underneath it is
            profession-independent by design, so the same records can power
            identity, recruitment and enterprise talent decisions over time.
          </p>
        </div>
        <ol className="relative grid gap-4">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="relative grid grid-cols-[5.5rem_1fr] items-baseline gap-4 rounded-xl border border-border bg-card p-6"
              style={{ marginLeft: `${i * 1.75}rem` }}
            >
              <span
                className={`font-data text-xs uppercase tracking-widest ${i === 0 ? 'text-seal' : 'text-muted-foreground'}`}
              >
                {s.phase}
              </span>
              <div>
                <p className="font-display text-2xl">{s.title}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
              </div>
              {i === 0 && (
                <span className="absolute -left-1.5 top-7 size-3 rounded-full bg-seal ring-4 ring-seal/20" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Waitlist() {
  return (
    <section
      id="waitlist"
      className="mx-auto max-w-content scroll-mt-20 px-4 sm:px-6"
    >
      <div className="relative overflow-hidden rounded-2xl bg-ink-deep px-6 py-14 text-primary-foreground sm:px-12">
        <div className="pointer-events-none absolute -right-16 -top-16 opacity-25">
          <TrustSeal score={91.3} tier={3} size={300} />
        </div>
        <div className="relative grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <SectionLabel className="text-turmeric [&>span]:bg-turmeric/60">
              Early access
            </SectionLabel>
            <h2 className="mt-5 text-4xl leading-tight sm:text-5xl">
              Be in the first verified cohort.
            </h2>
            <p className="mt-5 max-w-md text-primary-foreground/70">
              We’re opening Pramaan profession by profession, starting with
              engineering, design, finance and content. Tell us who you are and
              we’ll reach out when your batch opens.
            </p>
          </div>
          <WaitlistForm />
        </div>
      </div>
    </section>
  )
}

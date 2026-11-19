import { useId } from 'react'
import {
  Award,
  ClipboardCheck,
  FileCheck,
  FolderOpen,
  Link2,
  TrendingUp,
  CircleCheck,
  Hourglass,
  CircleDashed,
  type LucideIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  TIER_LABEL,
  type EvidenceKind,
  type TrustTier,
  type VerificationStatus,
  type ScoreDimension,
} from '@/data/fixtures'

export const EVIDENCE_ICON: Record<EvidenceKind, LucideIcon> = {
  'connected-account': Link2,
  'verified-work': FileCheck,
  assessment: ClipboardCheck,
  portfolio: FolderOpen,
  'project-performance': TrendingUp,
  credential: Award,
}

export function EvidenceGlyph({
  kind,
  className,
}: {
  kind: EvidenceKind
  className?: string
}) {
  const Icon = EVIDENCE_ICON[kind]
  return (
    <span
      className={cn(
        'inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-accent text-primary',
        className,
      )}
    >
      <Icon className="size-4" aria-hidden />
    </span>
  )
}

/** Rotating circular "seal" — the TrustCore signature mark. */
export function TrustSeal({
  score,
  tier,
  size = 132,
  className,
  spin = true,
}: {
  score: number
  tier: TrustTier
  size?: number
  className?: string
  spin?: boolean
}) {
  const id = `seal-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  return (
    <div
      className={cn('relative shrink-0 text-seal', className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`TrustCore index ${score.toFixed(1)}, tier ${TIER_LABEL[tier].short} ${TIER_LABEL[tier].name}`}
    >
      <svg
        viewBox="0 0 120 120"
        className={cn('absolute inset-0', spin && 'animate-seal')}
        aria-hidden
      >
        <defs>
          <path
            id={id}
            d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0"
          />
        </defs>
        <text
          fill="currentColor"
          style={{
            fontFamily: 'var(--font-data)',
            fontSize: 8.6,
            letterSpacing: 3.1,
          }}
        >
          <textPath href={`#${id}`}>
            TRUSTCORE · VERIFIED ON EVIDENCE · PRAMAAN ·
          </textPath>
        </text>
      </svg>
      <svg viewBox="0 0 120 120" className="absolute inset-0" aria-hidden>
        <circle
          cx="60"
          cy="60"
          r="56"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <circle
          cx="60"
          cy="60"
          r="35"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 3"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-display leading-none text-foreground"
          style={{ fontSize: size * 0.22 }}
        >
          {score.toFixed(1)}
        </span>
        <span
          className="font-data mt-1 uppercase tracking-widest text-seal"
          style={{ fontSize: Math.max(9, size * 0.07) }}
        >
          {TIER_LABEL[tier].short} · {TIER_LABEL[tier].name}
        </span>
      </div>
    </div>
  )
}

export function Monogram({
  initials,
  hue,
  size = 'md',
  className,
}: {
  initials: string
  hue: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const dims = {
    sm: 'size-10 text-sm',
    md: 'size-14 text-lg',
    lg: 'size-24 text-3xl',
  }[size]
  return (
    <span
      aria-hidden
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-full font-display',
        dims,
        className,
      )}
      style={{
        background: `oklch(0.9 0.05 ${hue})`,
        color: `oklch(0.3 0.07 ${hue})`,
        boxShadow: `inset 0 0 0 1px oklch(0.6 0.07 ${hue} / 0.45), 0 0 0 3px var(--card), 0 0 0 4px oklch(0.6 0.07 ${hue} / 0.35)`,
      }}
    >
      {initials}
    </span>
  )
}

export function TierBadge({
  tier,
  className,
}: {
  tier: TrustTier
  className?: string
}) {
  return (
    <span
      className={cn(
        'font-data inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] uppercase tracking-wider',
        tier === 3 && 'border-seal/40 bg-seal/10 text-seal',
        tier === 2 && 'border-primary/30 bg-accent text-primary',
        tier === 1 && 'border-border bg-muted text-muted-foreground',
        className,
      )}
    >
      <span className="flex gap-0.5" aria-hidden>
        {[1, 2, 3].map((t) => (
          <span
            key={t}
            className={cn(
              'size-1.5 rounded-full',
              t <= tier ? 'bg-current' : 'bg-current/20',
            )}
          />
        ))}
      </span>
      {TIER_LABEL[tier].short} {TIER_LABEL[tier].name}
    </span>
  )
}

export function StatusPill({ status }: { status: VerificationStatus }) {
  const map = {
    verified: {
      icon: CircleCheck,
      label: 'Verified',
      cls: 'text-primary bg-accent border-primary/25',
    },
    'in-review': {
      icon: Hourglass,
      label: 'In review',
      cls: 'text-[oklch(0.5_0.1_70)] bg-turmeric/15 border-turmeric/50',
    },
    'self-reported': {
      icon: CircleDashed,
      label: 'Self-reported',
      cls: 'text-muted-foreground bg-muted border-border',
    },
  }[status]
  const Icon = map.icon
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
        map.cls,
      )}
    >
      <Icon className="size-3" aria-hidden />
      {map.label}
    </span>
  )
}

export function DimensionBars({
  dimensions,
  compact = false,
}: {
  dimensions: ScoreDimension[]
  compact?: boolean
}) {
  return (
    <dl className={cn('grid', compact ? 'gap-2' : 'gap-4')}>
      {dimensions.map((d) => (
        <div key={d.key} className="grid gap-1.5">
          <div className="flex items-baseline justify-between gap-3">
            <dt className={cn('text-sm', compact && 'text-xs')}>{d.label}</dt>
            <dd className="font-data text-xs text-muted-foreground">
              {d.value}
            </dd>
          </div>
          <div
            className="relative h-1.5 overflow-hidden rounded-full bg-muted"
            role="presentation"
          >
            <div
              className="absolute inset-y-0 left-0 origin-left rounded-full bg-primary transition-transform duration-700 motion-reduce:transition-none"
              style={{ width: `${d.value}%` }}
            />
          </div>
          {!compact && (
            <p className="text-xs text-muted-foreground">{d.hint}</p>
          )}
        </div>
      ))}
    </dl>
  )
}

export function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        'font-data flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-seal',
        className,
      )}
    >
      <span className="h-px w-8 bg-seal/60" aria-hidden />
      {children}
    </p>
  )
}

import { Link } from '@tanstack/react-router'
import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const NAV = [
  { to: '/talent', label: 'Discover talent' },
  { to: '/verify', label: 'Verification Engine' },
] as const

export function Wordmark() {
  return (
    <Link
      to="/"
      className="group flex items-center gap-2.5 rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      aria-label="Pramaan home"
    >
      <svg viewBox="0 0 32 32" className="size-8 text-primary" aria-hidden>
        <circle
          cx="16"
          cy="16"
          r="14.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle
          cx="16"
          cy="16"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="1.5 2"
        />
        <path
          d="M11 16.5l3.4 3.4L21.5 12.5"
          fill="none"
          stroke="var(--seal)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="origin-center transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none"
        />
      </svg>
      <span className="font-display text-2xl leading-none tracking-tight">
        Pramaan
      </span>
    </Link>
  )
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between gap-6 px-4 sm:px-6">
        <Wordmark />
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-2 text-sm text-foreground/70 transition-colors hover:text-foreground data-[status=active]:text-foreground data-[status=active]:underline data-[status=active]:decoration-seal data-[status=active]:decoration-2 data-[status=active]:underline-offset-8"
            >
              {n.label}
            </Link>
          ))}
          <a
            href="/#vision"
            className="rounded-md px-3 py-2 text-sm text-foreground/70 transition-colors hover:text-foreground"
          >
            Vision
          </a>
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link to="/verify">Build your record</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/talent">Hire on evidence</Link>
          </Button>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-background">
            <SheetHeader>
              <SheetTitle className="font-display text-2xl font-normal">
                Pramaan
              </SheetTitle>
              <SheetDescription>
                Verified professional talent, built on evidence.
              </SheetDescription>
            </SheetHeader>
            <nav aria-label="Mobile" className="grid gap-1 px-4">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className="rounded-md px-3 py-3 text-base hover:bg-accent"
                >
                  {n.label}
                </Link>
              ))}
              <a
                href="/#vision"
                className="rounded-md px-3 py-3 text-base hover:bg-accent"
              >
                Vision
              </a>
              <Button asChild className="mt-4">
                <Link to="/talent">Hire on evidence</Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-ink-deep text-primary-foreground">
      <div className="mx-auto grid max-w-content gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-sm">
          <p className="font-display text-3xl">Pramaan</p>
          <p className="mt-3 text-sm text-primary-foreground/65">
            Profession-independent verification infrastructure, and the
            freelance marketplace built on top of it. Made in India, built for
            everywhere.
          </p>
        </div>
        <FooterCol
          title="Hire"
          items={[
            ['Discover talent', '/talent'],
            ['How TrustCore scores', '/#trustcore'],
          ]}
        />
        <FooterCol
          title="Professionals"
          items={[
            ['Verification Engine', '/verify'],
            ['Evidence types', '/#evidence'],
          ]}
        />
        <FooterCol
          title="Company"
          items={[
            ['Vision', '/#vision'],
            ['Join the waitlist', '/#waitlist'],
          ]}
        />
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="font-data mx-auto flex max-w-content flex-wrap justify-between gap-2 px-4 py-5 text-[11px] uppercase tracking-widest text-primary-foreground/45 sm:px-6">
          <span>© 2026 Pramaan Technologies</span>
          <span>Bengaluru · Pune · Remote</span>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({
  title,
  items,
}: {
  title: string
  items: [string, string][]
}) {
  return (
    <div>
      <p className="font-data text-[11px] uppercase tracking-widest text-primary-foreground/45">
        {title}
      </p>
      <ul className="mt-4 grid gap-2.5 text-sm">
        {items.map(([label, href]) => (
          <li key={label}>
            <a
              href={href}
              className="text-primary-foreground/80 transition-colors hover:text-primary-foreground"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="paper-grain flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}

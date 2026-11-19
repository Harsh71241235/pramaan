# AGENTS.md

This document describes the project for developers and AI agents working on this codebase.

## Project Overview

**Pramaan** is an India-first verified freelance marketplace built on **TrustCore**, a profession-independent verification engine that turns professional evidence into structured, reusable _Capability Records_. TrustCore and the Verification Engine are the product's first priority.

**Read `PLAN.md` first.** It is the milestone roadmap. Milestone 1 (the product surface) is complete; continue from the next unchecked milestone.

### Current state (Milestone 1)

- Screens: `/` (landing), `/talent` (discover), `/talent/$id` (Capability Record), `/verify` (Verification Engine console preview).
- **All product data is stubbed in `src/data/fixtures.ts`.** Its exported types (`Professional`, `Evidence`, `SkillRecord`, `QueueItem`, `TrustTier`, …) are the domain model. When adding persistence, keep these shapes and swap the fixture reads for server functions or route loaders. Don't scatter new hard-coded data in components.
- The `/verify` pipeline is simulated client-side with a timer (`STAGE_MS`, `DEMO_WEIGHT`). It must be replaced by the real engine in Milestone 4.
- The waitlist (`src/components/pramaan/waitlist-form.tsx`) is **live** through Netlify Forms. Its fields must match `public/waitlist-form.html` exactly, and it POSTs to `/waitlist-form.html` (not `/`, which the SSR catch-all handles).

### Domain vocabulary

- **Evidence kinds**: connected-account, verified-work, assessment, portfolio, project-performance, credential.
- **Status**: verified, in-review, self-reported. Only `verified` evidence carries weight.
- **Trust tiers**: T1 Linked → T2 Assessed → T3 Proven.
- **TrustCore index**: a 0–100 blend of five published dimensions (depth, independence, recency, performance, consistency). Every point must trace back to specific evidence, so keep it auditable.
- **Pipeline stages**: Intake → Authenticity → Attribution → Skill mapping → Weighting → Record issued (`PIPELINE_STAGES`).

### Design system

- An "archival ledger" look: warm paper background, ink-green `primary`, vermilion `seal` accent, turmeric highlight, and `ink-deep` for dark bands. Tokens live in `src/styles.css` (`bg-seal`, `text-turmeric`, `bg-ink-deep`, …). Light theme only.
- Fonts: Gloock for headings (`font-display`, applied to h1–h3 by default), Hanken Grotesk for body text, and IBM Plex Mono via the `.font-data` class for IDs, labels and metrics. They load from Google Fonts in `__root.tsx`.
- Utilities: `.paper-grain` (fixed noise overlay, set on `PageShell`), `.ledger-rules`, `.dot-grid`, `.rise`, `.animate-stamp`, `.animate-seal`, `.animate-scan` and `.animate-ticker`. All are disabled under reduced motion.
- Shared building blocks are in `src/components/pramaan/`:
  - `layout.tsx`: `PageShell`, header, footer and wordmark. Wrap every page in `PageShell`.
  - `primitives.tsx`: `TrustSeal`, `Monogram`, `TierBadge`, `StatusPill`, `EvidenceGlyph`, `DimensionBars` and `SectionLabel`.
  - `waitlist-form.tsx`: the Netlify Forms waitlist.

### Tech Stack

| Layer         | Technology                                          |
| ------------- | --------------------------------------------------- |
| Framework     | TanStack Start                                      |
| Frontend      | React 19, TanStack Router                           |
| Build         | Vite 8                                              |
| Styling       | Tailwind CSS 4, theme variables in `src/styles.css` |
| UI Components | shadcn/ui (Radix UI + Tailwind)                     |
| Toasts        | sonner                                              |
| Icons         | lucide-react                                        |
| Language      | TypeScript 6.0 (strict mode)                        |
| Deployment    | Netlify, via `@netlify/vite-plugin-tanstack-start`  |
| Forms         | Netlify Forms (early-access waitlist)               |

## Directory Structure

```
├── public
│   ├── favicon.ico
│   └── waitlist-form.html # Static Netlify Forms registration for the waitlist.
├── src
│   ├── components
│   │   ├── pramaan     # Product components: layout shell, TrustCore primitives, waitlist form.
│   │   ├── error-pages.tsx # Themed 404 and route error pages with home/retry actions.
│   │   └── ui          # shadcn/ui controls, overlays, feedback, forms, and tables.
│   ├── data
│   │   └── fixtures.ts # ALL stubbed product data + domain types (swap for Netlify Database).
│   ├── examples
│   │   └── validated-form.tsx # Unmounted form pattern with validation, pending, error, and success states.
│   ├── lib
│   │   └── utils.ts    # cn() helper for merging Tailwind classes.
│   ├── routes
│   │   ├── __root.tsx  # HTML shell, <head> metadata (siteName, siteDescription), the tooltip provider, and the toast container.
│   │   ├── index.tsx   # Landing page (/).
│   │   ├── talent.index.tsx # Discover talent (/talent).
│   │   ├── talent.$id.tsx   # Capability Record (/talent/$id), notFound for unknown ids.
│   │   └── verify.tsx  # Verification Engine console (/verify), simulated pipeline.
│   ├── router.tsx      # Creates the router from the generated route tree.
│   └── styles.css      # Tailwind import, theme variables for light and dark mode, base styles.
├── PLAN.md             # Milestone roadmap — continue from here.
├── components.json     # shadcn/ui config, used by `npx shadcn add`.
├── netlify.toml        # Build command, publish directory, dev server ports.
├── package.json
├── tsconfig.json
└── vite.config.ts      # Vite path aliases and Tailwind, Netlify, TanStack Start, React plugins.
```

`src/routeTree.gen.ts` is generated by the router plugin when the dev server or build runs. Don't edit it.

Shared framework skill source lives in `frameworks/tanstack-start-react/.claude/skills` in this repository, separate from the standalone starter. Consult the matching framework/Netlify skills when available in a generated app; don't assume the starter contains a `.claude` directory.

## Key Concepts

### File-Based Routing

Route files in `src/routes/` define pages and endpoints:

- `__root.tsx` wraps every page.
- `index.tsx` is `/`.
- `about.tsx` would be `/about`.
- `api.*.ts` files are server API endpoints. See the `tanstack-start-api-routes` skill.

### Theme Variables

Colors and corner radius are CSS variables in `src/styles.css` (`--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--radius`, and more), with a second set under `.dark`. Tailwind exposes them as classes such as `bg-primary`, `text-muted-foreground`, and `border-border`.

Set these variables for the product before you build any page. In components, use the variable classes instead of raw colors like `bg-white` or `text-gray-600`, so the whole site changes when a variable changes.

### UI Components

Ready-made components are in `src/components/ui/`. Use them before writing your own, and restyle them through the theme variables or their variants. Add more with `npx shadcn add <name>`. Show a toast by calling `toast()` from `sonner`; the container is already mounted in `__root.tsx`. `TooltipProvider` is mounted there too, so `Tooltip` works anywhere without its own provider.

| Need               | Components                                                         |
| ------------------ | ------------------------------------------------------------------ |
| Actions and status | Button, Badge, Progress, Skeleton, Alert, Sonner                   |
| Forms              | Input, Textarea, Label, Checkbox, RadioGroup, Switch, Select, Form |
| Overlays and menus | Dialog, Sheet, Popover, DropdownMenu, Tooltip                      |
| Content and layout | Card, Tabs, Accordion, Separator, Table                            |

Use `Form` with React Hook Form and the Zod resolver. Start from `src/examples/validated-form.tsx`; it isn't mounted or connected to a backend. Its required `onSubmit` callback must reject on failure. See [the form pattern](docs/forms.md) for HTTP submission and error handling.

Use Sheet for a mobile menu and DropdownMenu for short action lists. Give Dialog and Sheet an accessible title and description. Pair Checkbox, RadioGroup, Switch, and inputs with visible labels. Reserve tables for tabular data and wrap them in their provided scroll container.

### Routing and Server Data

Router types are registered in `src/router.tsx`, so use typed `Link` destinations and route parameters. The root route supplies the themed 404 page; the router's default error component supplies the safe retry/home page, including child-route SSR failures. Use `throw notFound()` for absent records; keep unexpected failures on the error path. See [routing conventions](src/routes/README.md).

Start with route loaders and server functions for server data. Validate server-function input with `.validator(...)`, keep secrets on the server, and handle HTTP failures before returning data. See [the data-fetching pattern](docs/data-fetching.md). Add TanStack Query only when client-side caching, mutations, or background refresh are needed.

### Browser Storage

Pages are rendered on the server first, where `window` and `localStorage` don't exist. Read `localStorage` inside `useEffect`, not during render or in a `useState` initializer, or the first render will differ from the server HTML and React will log a hydration error.

## Configuration Files

| File             | Purpose                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------ |
| `vite.config.ts` | Vite path aliases and Tailwind, Netlify, TanStack Start, React plugins                           |
| `tsconfig.json`  | Strict TypeScript, with the `@/*` alias for `src/*`                                              |
| `netlify.toml`   | Builds with `vite build`, publishes `dist/client`, dev server on port 8888 proxying Vite on 3000 |

## Development Commands

Use Node 22.13+ on the Node 22 line, Node 24, or Node 26+. The installed lint and test tools set this minimum alongside the framework.

```bash
npm run dev        # Start the Vite dev server on port 3000
npm run build      # Production build
npm run typecheck  # Type-check with tsc; the build doesn't
npm run lint       # Check TypeScript and React Hooks rules
npm run format:check # Check formatting
npm run format     # Format project files
npm test           # Run local form, control, and error page tests
npm run preview    # Preview the production build
```

## Conventions

- Components: PascalCase. Utilities and hooks: camelCase. Route files: kebab-case.
- Import from `src` with the `@/` alias.
- TypeScript fails on unused locals and parameters, so remove what you don't use.
- Use React hooks for state.
- Run the dev server or build once to generate route types before type-checking a fresh copy.
- Run build, typecheck, lint, format:check, and tests before reporting completion. Verify changed user flows locally; a passing build doesn't prove an interaction works.

## Application Name

The name and description are set in `src/routes/__root.tsx` (`siteName`, `siteDescription`). Individual routes override `title` through `head()`.

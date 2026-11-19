# Pramaan

**Hire on evidence, not claims.** Pramaan is an India-first, globally scalable professional talent ecosystem: a verified freelance marketplace on top of **TrustCore**, a profession-independent verification infrastructure. TrustCore turns connected accounts, verifiable work, practical assessments, portfolios and real project performance into transparent, reusable **Capability Records**.

## What's in the app today

| Route         | Screen                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------ |
| `/`           | Landing page: the problem, the TrustCore pipeline, evidence types, vision, early-access waitlist |
| `/talent`     | Discover verified professionals: search, profession and trust-tier filters, sorting              |
| `/talent/:id` | Capability Record: evidence ledger, verified skills, project performance, index breakdown        |
| `/verify`     | Verification Engine console: submit evidence and watch it move through the six stages            |

The waitlist form is live through Netlify Forms. Professionals, evidence and the verification queue are realistic sample data in `src/data/fixtures.ts`, which the next milestone replaces with Netlify Database.

## Tech stack

- **TanStack Start** (React 19, TanStack Router, file-based routing), Vite 8
- **Tailwind CSS 4** with theme variables in `src/styles.css`; shadcn/ui components on Radix
- Fonts: Gloock (display), Hanken Grotesk (body), IBM Plex Mono (data)
- **Netlify** hosting, with Netlify Forms for the waitlist

## Run locally

```bash
pnpm install
netlify dev        # full Netlify emulation (Forms, etc.) — or:
pnpm dev           # Vite dev server on http://localhost:3000
```

Other scripts: `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm format`.

## Roadmap

See [PLAN.md](PLAN.md). Next up:

1. Data model & persistence (Netlify Database)
2. Accounts & roles (Netlify Identity)
3. **TrustCore Verification Engine v1**: a real pipeline, audit trail and versioned scoring
4. Connected accounts, practical assessments, client confirmation
5. Marketplace core: briefs, contracts and ₹ payments; then AI-assisted matching

# Pramaan — Product Roadmap

Pramaan is an India-first, globally scalable professional talent ecosystem: a **verified freelance marketplace** built on **TrustCore**, a profession-independent verification and evidence infrastructure.

The roadmap starts with what people see and use, then builds the systems underneath it. TrustCore and the Verification Engine are the first priority, so they come right after data and accounts. Each milestone is small enough to ship on its own.

---

## ✅ Milestone 1 — Product surface (done)

- Landing page that tells the company story: claims vs evidence, the TrustCore pipeline, six evidence types, clients vs professionals, and the long-term vision.
- **Discover talent** (`/talent`): search, profession filter, minimum trust tier, availability and sort.
- **Capability Record** (`/talent/$id`): evidence ledger with verification method and proof IDs, verified skills, project performance, and an index breakdown.
- **Verification Engine console** (`/verify`): an interactive preview of evidence moving through the six-stage pipeline.
- **Early-access waitlist** captured with Netlify Forms (live).
- All product data is stubbed in `src/data/fixtures.ts`.

## Milestone 2 — Data model & persistence

- Netlify Database (Postgres + Drizzle) schema in `db/schema.ts`: `professionals`, `evidence`, `evidence_events` (pipeline audit trail), `skills` (capability taxonomy), `skill_evidence`, `projects`, `score_snapshots`.
- Seed the database from the current fixtures, then replace fixture reads with TanStack Start server functions and route loaders.
- Keep the fixture module's types as the shared domain types.

## Milestone 3 — Accounts & roles

- Netlify Identity sign-up/login with roles: `professional`, `client`, `reviewer`, `admin`.
- Professional onboarding (profession, location, languages, rate) that creates an empty Capability Record.
- Client onboarding (company, GST number optional).
- Protected routes: `/verify` becomes the signed-in professional's own console.

## Milestone 4 — TrustCore Verification Engine v1 ★ first priority

- Evidence intake server endpoints with validation, plus file uploads to Netlify Blobs.
- Pipeline state machine: Intake → Authenticity → Attribution → Skill mapping → Weighting → Record issued. Every transition is written to `evidence_events`.
- Processing in background functions (authenticity checks, metadata extraction).
- Scoring service with **versioned, published weights** across the five dimensions (depth, independence, recency, performance, consistency). Scores are recomputed on change and snapshotted.
- A "why this score" API that powers the record breakdown.

## Milestone 5 — Connected accounts & credentials

- OAuth connectors, starting with GitHub (commit attribution, ownership checks), then Behance/Dribbble, Kaggle, Stack Overflow.
- Credential checks against registries (ICAI, Bar Council, COA) and DigiLocker documents.
- Imported, uncorroborated data is clearly marked "self-reported" and contributes zero weight.

## Milestone 6 — Practical assessments

- An assessment library per profession (briefs, rubrics, time limits).
- Submission flow, a reviewer queue, rubric scoring, and inter-reviewer agreement.
- Results become `assessment` evidence automatically.

## Milestone 7 — Client confirmation & project performance

- Clients confirm past and on-platform projects through a signed magic link: outcome, on-time delivery, rating and a note.
- Delivery metrics (on-time rate, repeat clients) computed from confirmed records.

## Milestone 8 — Marketplace core

- Client briefs and jobs, invites from a Capability Record, proposals.
- Messaging between client and professional.
- Milestone-based contracts in ₹ with payments (provider to be chosen, e.g. Razorpay or Stripe) and GST-ready invoices.
- Completed contracts flow back into TrustCore as `project-performance` evidence.

## Milestone 9 — Discovery v2 & AI matching

- Server-side search and ranking by verified skill confidence, tier and recency.
- AI-assisted shortlisting through Netlify AI Gateway: a client describes a need, and Pramaan returns a shortlist where every recommendation cites the evidence behind it.
- Saved shortlists and side-by-side comparison.

## Milestone 10 — Portable, shareable records

- Public record pages with consented sharing and signed proof links per evidence item.
- An embeddable record badge and a read-only verification API for third parties.

## Milestone 11 — Trust, safety & operations

- Admin console: reviewer management, disputes, fraud and duplicate-identity detection, appeals.
- Moderation of evidence and client notes. Audit exports.

## Horizon (beyond the marketplace)

- **Professional identity**: records that move with the professional across platforms.
- **Talent discovery & recruitment**: full-time hiring that starts from verified capability.
- **Enterprise talent intelligence**: capability mapping across an organisation's workforce.

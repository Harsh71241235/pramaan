/**
 * Stubbed product data for Milestone 1.
 *
 * Every screen reads from this module so it can be swapped for real
 * persistence (Netlify Database) in a later milestone without touching UI.
 * See PLAN.md for the roadmap.
 */

export type EvidenceKind =
  | 'connected-account'
  | 'verified-work'
  | 'assessment'
  | 'portfolio'
  | 'project-performance'
  | 'credential'

export type VerificationStatus = 'verified' | 'in-review' | 'self-reported'

/** T1 Linked → T2 Assessed → T3 Proven in real client work */
export type TrustTier = 1 | 2 | 3

export interface Evidence {
  id: string
  kind: EvidenceKind
  title: string
  source: string
  detail: string
  method: string
  status: VerificationStatus
  verifiedOn: string
  skills: string[]
  signals: string[]
  /** Contribution to the TrustCore index, 0–10 */
  weight: number
}

export interface SkillRecord {
  name: string
  confidence: number
  evidenceCount: number
  lastEvidenced: string
}

export interface ProjectRecord {
  client: string
  title: string
  budgetInr: number
  delivered: string
  onTime: boolean
  rating: number
  clientNote: string
}

export interface ScoreDimension {
  key: string
  label: string
  value: number
  hint: string
}

export interface Professional {
  id: string
  name: string
  initials: string
  headline: string
  profession: Profession
  city: string
  state: string
  languages: string[]
  rateInr: number
  rateUnit: 'hour' | 'day' | 'project'
  availability: 'Available now' | 'From next week' | 'Limited'
  trustIndex: number
  tier: TrustTier
  recordId: string
  memberSince: string
  projectsCompleted: number
  onTimeRate: number
  repeatClientRate: number
  responseTime: string
  summary: string
  skills: SkillRecord[]
  evidence: Evidence[]
  projects: ProjectRecord[]
  dimensions: ScoreDimension[]
  hue: number
}

export const PROFESSIONS = [
  'Software Engineering',
  'Product & Brand Design',
  'Finance & Accounting',
  'Content & Language',
  'Data & Analytics',
  'Legal',
  'Motion & Video',
  'Architecture & Visualisation',
] as const
export type Profession = (typeof PROFESSIONS)[number]

export const EVIDENCE_KIND_LABEL: Record<EvidenceKind, string> = {
  'connected-account': 'Connected account',
  'verified-work': 'Verified work',
  assessment: 'Practical assessment',
  portfolio: 'Portfolio',
  'project-performance': 'Project performance',
  credential: 'Credential',
}

export const TIER_LABEL: Record<TrustTier, { name: string; short: string }> = {
  1: { name: 'Linked', short: 'T1' },
  2: { name: 'Assessed', short: 'T2' },
  3: { name: 'Proven', short: 'T3' },
}

const dims = (
  depth: number,
  independence: number,
  recency: number,
  performance: number,
  consistency: number,
): ScoreDimension[] => [
  {
    key: 'depth',
    label: 'Evidence depth',
    value: depth,
    hint: 'How much independent evidence backs each claimed skill.',
  },
  {
    key: 'independence',
    label: 'Source independence',
    value: independence,
    hint: 'Share of evidence confirmed by third parties rather than self-reported.',
  },
  {
    key: 'recency',
    label: 'Recency',
    value: recency,
    hint: 'How recently the evidence was produced. Older work decays gently.',
  },
  {
    key: 'performance',
    label: 'Delivery performance',
    value: performance,
    hint: 'On-time delivery, client ratings and repeat engagements on Pramaan.',
  },
  {
    key: 'consistency',
    label: 'Consistency',
    value: consistency,
    hint: 'Whether assessments, work samples and client outcomes agree with each other.',
  },
]

export const professionals: Professional[] = [
  {
    id: 'ishaan-varadarajan',
    name: 'Ishaan Varadarajan',
    initials: 'IV',
    headline: 'Backend engineer — payments, ledgers & high-volume APIs',
    profession: 'Software Engineering',
    city: 'Bengaluru',
    state: 'Karnataka',
    languages: ['English', 'Tamil', 'Kannada'],
    rateInr: 2400,
    rateUnit: 'hour',
    availability: 'From next week',
    trustIndex: 91.3,
    tier: 3,
    recordId: 'PRM-7Q4K-2291',
    memberSince: 'Mar 2025',
    projectsCompleted: 23,
    onTimeRate: 95.6,
    repeatClientRate: 61,
    responseTime: '~2 h',
    summary:
      'Eight years building settlement and reconciliation systems for Indian fintechs. Comfortable owning a service end-to-end — schema, queues, observability and the 2 a.m. pager.',
    hue: 162,
    skills: [
      {
        name: 'Go',
        confidence: 94,
        evidenceCount: 7,
        lastEvidenced: 'Oct 2026',
      },
      {
        name: 'PostgreSQL',
        confidence: 91,
        evidenceCount: 6,
        lastEvidenced: 'Oct 2026',
      },
      {
        name: 'UPI / payment rails',
        confidence: 88,
        evidenceCount: 4,
        lastEvidenced: 'Sep 2026',
      },
      {
        name: 'Kafka',
        confidence: 79,
        evidenceCount: 3,
        lastEvidenced: 'Jul 2026',
      },
      {
        name: 'System design',
        confidence: 86,
        evidenceCount: 5,
        lastEvidenced: 'Aug 2026',
      },
    ],
    evidence: [
      {
        id: 'ev-iv-1',
        kind: 'connected-account',
        title: 'GitHub — 1,412 attributed commits across 9 repositories',
        source: 'github.com',
        detail:
          'OAuth-linked account. Commit authorship matched to verified email; forks and vendored code excluded.',
        method: 'OAuth link · authorship attribution',
        status: 'verified',
        verifiedOn: '14 Oct 2026',
        skills: ['Go', 'PostgreSQL', 'Kafka'],
        signals: [
          'Signed commits',
          '3 yrs continuous activity',
          'Code-review participation',
        ],
        weight: 7.8,
      },
      {
        id: 'ev-iv-2',
        kind: 'assessment',
        title: 'Live systems task — idempotent payout service',
        source: 'Pramaan Assessments',
        detail:
          'Three-hour proctored build. Scored by two independent reviewers against a published rubric.',
        method: 'Proctored practical · 2 reviewers',
        status: 'verified',
        verifiedOn: '02 Aug 2026',
        skills: ['Go', 'System design', 'UPI / payment rails'],
        signals: ['Rubric score 87/100', 'Reviewer agreement 0.91'],
        weight: 8.6,
      },
      {
        id: 'ev-iv-3',
        kind: 'project-performance',
        title: 'Reconciliation engine rebuild for a Pune NBFC',
        source: 'Pramaan contract #C-40917',
        detail:
          'Milestone-based engagement. Delivery and outcome confirmed by the client’s engineering lead.',
        method: 'Client-confirmed delivery record',
        status: 'verified',
        verifiedOn: '29 Sep 2026',
        skills: ['PostgreSQL', 'UPI / payment rails'],
        signals: ['Delivered 4 days early', 'Rating 4.9 / 5', 'Re-hired'],
        weight: 9.4,
      },
      {
        id: 'ev-iv-4',
        kind: 'verified-work',
        title: 'Open-source: ledgerkit — double-entry primitives for Go',
        source: 'github.com/ledgerkit',
        detail:
          'Maintainer role confirmed via repository permissions. 640 stars, used in production by 3 known teams.',
        method: 'Repository ownership check',
        status: 'verified',
        verifiedOn: '11 Jun 2026',
        skills: ['Go', 'System design'],
        signals: ['Maintainer', 'External adopters'],
        weight: 6.9,
      },
      {
        id: 'ev-iv-5',
        kind: 'credential',
        title: 'B.Tech, Computer Science — NIT Tiruchirappalli',
        source: 'DigiLocker',
        detail:
          'Degree certificate fetched directly from the issuing institution via DigiLocker.',
        method: 'Issuer-signed document',
        status: 'verified',
        verifiedOn: '18 Mar 2025',
        skills: [],
        signals: ['Issuer signature valid'],
        weight: 3.1,
      },
    ],
    projects: [
      {
        client: 'Kshetra Finance',
        title: 'Reconciliation engine rebuild',
        budgetInr: 642000,
        delivered: 'Sep 2026',
        onTime: true,
        rating: 4.9,
        clientNote:
          'Cut our nightly recon from 3 hours to 11 minutes. We extended the contract.',
      },
      {
        client: 'Tiffinly',
        title: 'Payout retries & webhook hardening',
        budgetInr: 188500,
        delivered: 'May 2026',
        onTime: true,
        rating: 4.8,
        clientNote:
          'Clear written updates every Friday. Zero duplicate payouts since launch.',
      },
      {
        client: 'Agrisetu Labs',
        title: 'Postgres partitioning & migration',
        budgetInr: 96000,
        delivered: 'Jan 2026',
        onTime: false,
        rating: 4.6,
        clientNote:
          'Slipped a week because of our data-access delays, communicated early.',
      },
    ],
    dimensions: dims(93, 89, 90, 94, 88),
  },
  {
    id: 'nikita-deshpande',
    name: 'Nikita Deshpande',
    initials: 'ND',
    headline: 'Product designer for vernacular-first consumer apps',
    profession: 'Product & Brand Design',
    city: 'Pune',
    state: 'Maharashtra',
    languages: ['Marathi', 'Hindi', 'English'],
    rateInr: 1850,
    rateUnit: 'hour',
    availability: 'Available now',
    trustIndex: 88.6,
    tier: 3,
    recordId: 'PRM-3MZ8-1047',
    memberSince: 'Jun 2025',
    projectsCompleted: 17,
    onTimeRate: 94.1,
    repeatClientRate: 47,
    responseTime: '~1 h',
    summary:
      'Designs for the next 500 million users — low-literacy flows, Devanagari type systems and onboarding that works on a ₹7,000 phone.',
    hue: 38,
    skills: [
      {
        name: 'Interaction design',
        confidence: 92,
        evidenceCount: 6,
        lastEvidenced: 'Nov 2026',
      },
      {
        name: 'Figma systems',
        confidence: 90,
        evidenceCount: 5,
        lastEvidenced: 'Oct 2026',
      },
      {
        name: 'Usability research',
        confidence: 84,
        evidenceCount: 4,
        lastEvidenced: 'Sep 2026',
      },
      {
        name: 'Indic typography',
        confidence: 87,
        evidenceCount: 3,
        lastEvidenced: 'Aug 2026',
      },
    ],
    evidence: [
      {
        id: 'ev-nd-1',
        kind: 'portfolio',
        title: 'Krishi Mitra — voice-first crop advisory app',
        source: 'Figma file + Play Store listing',
        detail:
          'Authorship verified from Figma version history and confirmed by the client’s product head.',
        method: 'File history + client attestation',
        status: 'verified',
        verifiedOn: '06 Oct 2026',
        skills: ['Interaction design', 'Usability research'],
        signals: ['1.2M installs', 'Client attestation'],
        weight: 8.2,
      },
      {
        id: 'ev-nd-2',
        kind: 'assessment',
        title: 'Design challenge — UPI onboarding for first-time users',
        source: 'Pramaan Assessments',
        detail:
          'Four-hour brief, recorded critique session with two senior design reviewers.',
        method: 'Practical brief · recorded critique',
        status: 'verified',
        verifiedOn: '21 Jul 2026',
        skills: ['Interaction design', 'Figma systems'],
        signals: ['Rubric score 91/100'],
        weight: 8.4,
      },
      {
        id: 'ev-nd-3',
        kind: 'connected-account',
        title: 'Dribbble & Behance — 34 shots, 6 case studies',
        source: 'dribbble.com · behance.net',
        detail:
          'Accounts linked. Work cross-checked against portfolio items for consistency.',
        method: 'OAuth link · cross-source match',
        status: 'verified',
        verifiedOn: '02 Jun 2025',
        skills: ['Figma systems', 'Indic typography'],
        signals: ['Consistent authorship'],
        weight: 4.3,
      },
      {
        id: 'ev-nd-4',
        kind: 'project-performance',
        title: 'Design system for a Marathi news app',
        source: 'Pramaan contract #C-38802',
        detail:
          'Delivered 142 components with Devanagari-aware spacing tokens.',
        method: 'Client-confirmed delivery record',
        status: 'verified',
        verifiedOn: '30 Aug 2026',
        skills: ['Figma systems', 'Indic typography'],
        signals: ['On time', 'Rating 4.9 / 5'],
        weight: 9.0,
      },
      {
        id: 'ev-nd-5',
        kind: 'verified-work',
        title: 'Field research — 28 interviews in Nashik & Latur',
        source: 'Research report (redacted)',
        detail:
          'Submitted for review; awaiting confirmation from the commissioning NGO.',
        method: 'Commissioner confirmation',
        status: 'in-review',
        verifiedOn: '—',
        skills: ['Usability research'],
        signals: ['Pending third-party confirmation'],
        weight: 0,
      },
    ],
    projects: [
      {
        client: 'Batmi Media',
        title: 'Marathi news design system',
        budgetInr: 310000,
        delivered: 'Aug 2026',
        onTime: true,
        rating: 4.9,
        clientNote: 'Finally a system that understands conjuncts and matras.',
      },
      {
        client: 'Krishi Mitra',
        title: 'Voice-first advisory flows',
        budgetInr: 455000,
        delivered: 'Mar 2026',
        onTime: true,
        rating: 4.8,
        clientNote:
          'Task completion among first-time users went from 41% to 73%.',
      },
    ],
    dimensions: dims(88, 84, 93, 91, 87),
  },
  {
    id: 'farhan-qureshi',
    name: 'Farhan Qureshi',
    initials: 'FQ',
    headline: 'Chartered Accountant — GST, startup compliance & virtual CFO',
    profession: 'Finance & Accounting',
    city: 'Ahmedabad',
    state: 'Gujarat',
    languages: ['Gujarati', 'Hindi', 'English', 'Urdu'],
    rateInr: 28000,
    rateUnit: 'project',
    availability: 'Limited',
    trustIndex: 84.2,
    tier: 3,
    recordId: 'PRM-9TJ2-5580',
    memberSince: 'Jan 2026',
    projectsCompleted: 31,
    onTimeRate: 96.8,
    repeatClientRate: 72,
    responseTime: '~4 h',
    summary:
      'Practising CA working with D2C brands and early-stage startups on GST filings, ESOP structuring and monthly MIS that founders actually read.',
    hue: 80,
    skills: [
      {
        name: 'GST compliance',
        confidence: 93,
        evidenceCount: 6,
        lastEvidenced: 'Nov 2026',
      },
      {
        name: 'Financial modelling',
        confidence: 81,
        evidenceCount: 3,
        lastEvidenced: 'Sep 2026',
      },
      {
        name: 'Startup due diligence',
        confidence: 78,
        evidenceCount: 2,
        lastEvidenced: 'Jun 2026',
      },
      {
        name: 'Tally & Zoho Books',
        confidence: 89,
        evidenceCount: 4,
        lastEvidenced: 'Oct 2026',
      },
    ],
    evidence: [
      {
        id: 'ev-fq-1',
        kind: 'credential',
        title: 'ICAI membership — Associate Chartered Accountant',
        source: 'ICAI member registry',
        detail:
          'Membership number and Certificate of Practice validated against the public registry.',
        method: 'Registry lookup',
        status: 'verified',
        verifiedOn: '08 Jan 2026',
        skills: ['GST compliance'],
        signals: ['Certificate of Practice active'],
        weight: 6.2,
      },
      {
        id: 'ev-fq-2',
        kind: 'project-performance',
        title: '31 monthly compliance engagements on Pramaan',
        source: 'Pramaan contracts',
        detail:
          'Aggregated record of filings delivered before statutory deadlines.',
        method: 'Platform delivery records',
        status: 'verified',
        verifiedOn: '15 Nov 2026',
        skills: ['GST compliance', 'Tally & Zoho Books'],
        signals: ['96.8% on time', '72% repeat clients'],
        weight: 9.6,
      },
      {
        id: 'ev-fq-3',
        kind: 'assessment',
        title: 'Case assessment — GST reconciliation with ITC mismatch',
        source: 'Pramaan Assessments',
        detail:
          'Timed case using anonymised GSTR-2B data, reviewed by a senior CA panel.',
        method: 'Timed case · panel review',
        status: 'verified',
        verifiedOn: '19 Feb 2026',
        skills: ['GST compliance'],
        signals: ['Rubric score 84/100'],
        weight: 7.1,
      },
      {
        id: 'ev-fq-4',
        kind: 'verified-work',
        title: 'Series-A financial model for a Surat textile D2C brand',
        source: 'Client attestation',
        detail:
          'Model structure reviewed; client confirmed authorship and outcome.',
        method: 'Client attestation',
        status: 'verified',
        verifiedOn: '04 Sep 2026',
        skills: ['Financial modelling', 'Startup due diligence'],
        signals: ['Round closed'],
        weight: 6.4,
      },
    ],
    projects: [
      {
        client: 'Vastrika',
        title: 'Monthly GST & MIS (14 months)',
        budgetInr: 392000,
        delivered: 'Ongoing',
        onTime: true,
        rating: 5,
        clientNote: 'We haven’t paid a late fee since Farhan took over.',
      },
      {
        client: 'Chaiwala Co.',
        title: 'ESOP pool structuring',
        budgetInr: 85000,
        delivered: 'Jun 2026',
        onTime: true,
        rating: 4.7,
        clientNote:
          'Explained every trade-off in plain language to our whole team.',
      },
    ],
    dimensions: dims(81, 92, 88, 96, 79),
  },
  {
    id: 'anjali-menon',
    name: 'Anjali Menon',
    initials: 'AM',
    headline: 'Bilingual content strategist & translator — Malayalam ⇄ English',
    profession: 'Content & Language',
    city: 'Kochi',
    state: 'Kerala',
    languages: ['Malayalam', 'English', 'Tamil'],
    rateInr: 6500,
    rateUnit: 'day',
    availability: 'Available now',
    trustIndex: 79.8,
    tier: 2,
    recordId: 'PRM-2HB6-8834',
    memberSince: 'Aug 2026',
    projectsCompleted: 4,
    onTimeRate: 100,
    repeatClientRate: 25,
    responseTime: '~3 h',
    summary:
      'Ex-newsroom sub-editor. Localises health, finance and government communication so it reads like it was written in Malayalam first.',
    hue: 150,
    skills: [
      {
        name: 'Malayalam translation',
        confidence: 91,
        evidenceCount: 4,
        lastEvidenced: 'Nov 2026',
      },
      {
        name: 'Editorial strategy',
        confidence: 76,
        evidenceCount: 2,
        lastEvidenced: 'Sep 2026',
      },
      {
        name: 'Health communication',
        confidence: 72,
        evidenceCount: 2,
        lastEvidenced: 'Oct 2026',
      },
    ],
    evidence: [
      {
        id: 'ev-am-1',
        kind: 'assessment',
        title: 'Translation assessment — public-health advisory, 1,800 words',
        source: 'Pramaan Assessments',
        detail:
          'Blind-reviewed by two native-speaker editors for accuracy, register and readability.',
        method: 'Blind dual review',
        status: 'verified',
        verifiedOn: '22 Aug 2026',
        skills: ['Malayalam translation', 'Health communication'],
        signals: ['Rubric score 93/100', 'Reviewer agreement 0.88'],
        weight: 8.1,
      },
      {
        id: 'ev-am-2',
        kind: 'verified-work',
        title: 'Bylined features — 46 articles, 2019–2024',
        source: 'Publisher archive',
        detail:
          'Bylines matched against publisher archive and confirmed by a former editor.',
        method: 'Archive match + referee',
        status: 'verified',
        verifiedOn: '30 Aug 2026',
        skills: ['Editorial strategy'],
        signals: ['Referee confirmed'],
        weight: 5.6,
      },
      {
        id: 'ev-am-3',
        kind: 'project-performance',
        title: 'Hospital patient-leaflet localisation (4 projects)',
        source: 'Pramaan contracts',
        detail: 'All four delivered on time; one follow-on engagement booked.',
        method: 'Platform delivery records',
        status: 'verified',
        verifiedOn: '12 Nov 2026',
        skills: ['Malayalam translation', 'Health communication'],
        signals: ['100% on time'],
        weight: 6.0,
      },
      {
        id: 'ev-am-4',
        kind: 'connected-account',
        title: 'LinkedIn — employment history',
        source: 'linkedin.com',
        detail:
          'Self-reported roles imported. Not counted towards the index until corroborated.',
        method: 'Imported · uncorroborated',
        status: 'self-reported',
        verifiedOn: '—',
        skills: [],
        signals: ['Awaiting corroboration'],
        weight: 0,
      },
    ],
    projects: [
      {
        client: 'Amrita Care Network',
        title: 'Patient leaflet localisation',
        budgetInr: 58500,
        delivered: 'Nov 2026',
        onTime: true,
        rating: 4.9,
        clientNote:
          'Our older patients finally understand the discharge instructions.',
      },
    ],
    dimensions: dims(74, 82, 96, 83, 85),
  },
  {
    id: 'sravya-kothapalli',
    name: 'Sravya Kothapalli',
    initials: 'SK',
    headline: 'Data analyst — retail demand forecasting & BI dashboards',
    profession: 'Data & Analytics',
    city: 'Hyderabad',
    state: 'Telangana',
    languages: ['Telugu', 'English', 'Hindi'],
    rateInr: 1600,
    rateUnit: 'hour',
    availability: 'Available now',
    trustIndex: 90.4,
    tier: 3,
    recordId: 'PRM-5RW1-3362',
    memberSince: 'Nov 2025',
    projectsCompleted: 19,
    onTimeRate: 94.7,
    repeatClientRate: 58,
    responseTime: '~1 h',
    summary:
      'Turns messy POS exports into forecasts that store managers trust. SQL first, Python when it earns its place, dashboards nobody needs a manual for.',
    hue: 230,
    skills: [
      {
        name: 'SQL',
        confidence: 95,
        evidenceCount: 7,
        lastEvidenced: 'Nov 2026',
      },
      {
        name: 'Python (pandas)',
        confidence: 88,
        evidenceCount: 5,
        lastEvidenced: 'Oct 2026',
      },
      {
        name: 'Power BI',
        confidence: 90,
        evidenceCount: 4,
        lastEvidenced: 'Oct 2026',
      },
      {
        name: 'Demand forecasting',
        confidence: 83,
        evidenceCount: 3,
        lastEvidenced: 'Sep 2026',
      },
    ],
    evidence: [
      {
        id: 'ev-sk-1',
        kind: 'assessment',
        title: 'SQL practical — 12 queries on a 40M-row retail dataset',
        source: 'Pramaan Assessments',
        detail:
          'Auto-graded for correctness and performance, then reviewed for readability.',
        method: 'Auto-graded + human review',
        status: 'verified',
        verifiedOn: '03 Dec 2025',
        skills: ['SQL'],
        signals: ['12/12 correct', 'Top 4% runtime'],
        weight: 8.8,
      },
      {
        id: 'ev-sk-2',
        kind: 'connected-account',
        title: 'Kaggle — Notebooks Expert, 2 competition medals',
        source: 'kaggle.com',
        detail:
          'Profile linked; medals and notebooks pulled from the public API.',
        method: 'OAuth link · public API',
        status: 'verified',
        verifiedOn: '20 Nov 2025',
        skills: ['Python (pandas)', 'Demand forecasting'],
        signals: ['Bronze ×2'],
        weight: 5.4,
      },
      {
        id: 'ev-sk-3',
        kind: 'project-performance',
        title: 'Forecasting pilot for a 60-store grocery chain',
        source: 'Pramaan contract #C-41230',
        detail:
          'Client confirmed stock-out reduction measured over eight weeks.',
        method: 'Client-confirmed outcome',
        status: 'verified',
        verifiedOn: '17 Sep 2026',
        skills: ['Demand forecasting', 'Python (pandas)'],
        signals: ['Stock-outs −18.4%', 'Rating 5.0 / 5'],
        weight: 9.7,
      },
      {
        id: 'ev-sk-4',
        kind: 'portfolio',
        title: 'Power BI — regional sales cockpit',
        source: 'Published report (sample data)',
        detail: 'Report file metadata confirms authorship.',
        method: 'File metadata',
        status: 'verified',
        verifiedOn: '05 Oct 2026',
        skills: ['Power BI'],
        signals: ['Authorship confirmed'],
        weight: 4.9,
      },
    ],
    projects: [
      {
        client: 'Ratnadeep Fresh',
        title: 'Store-level demand forecasting pilot',
        budgetInr: 274000,
        delivered: 'Sep 2026',
        onTime: true,
        rating: 5,
        clientNote:
          'Our category managers check her dashboard before their morning tea.',
      },
      {
        client: 'Nimbus Pharmacies',
        title: 'Inventory ageing report',
        budgetInr: 64000,
        delivered: 'Jun 2026',
        onTime: true,
        rating: 4.8,
        clientNote: 'Found ₹11.6 lakh of near-expiry stock in week one.',
      },
    ],
    dimensions: dims(91, 87, 94, 93, 89),
  },
  {
    id: 'harpreet-gill',
    name: 'Harpreet Gill',
    initials: 'HG',
    headline: 'Advocate — commercial contracts, SaaS terms & IP licensing',
    profession: 'Legal',
    city: 'Chandigarh',
    state: 'Punjab',
    languages: ['Punjabi', 'Hindi', 'English'],
    rateInr: 4200,
    rateUnit: 'hour',
    availability: 'From next week',
    trustIndex: 82.7,
    tier: 2,
    recordId: 'PRM-8NC4-0719',
    memberSince: 'Apr 2026',
    projectsCompleted: 9,
    onTimeRate: 100,
    repeatClientRate: 44,
    responseTime: '~5 h',
    summary:
      'Enrolled advocate drafting and negotiating contracts for software and media companies. Writes clauses that survive both courtrooms and procurement teams.',
    hue: 20,
    skills: [
      {
        name: 'Contract drafting',
        confidence: 90,
        evidenceCount: 5,
        lastEvidenced: 'Oct 2026',
      },
      {
        name: 'IP licensing',
        confidence: 80,
        evidenceCount: 3,
        lastEvidenced: 'Aug 2026',
      },
      {
        name: 'DPDP Act compliance',
        confidence: 74,
        evidenceCount: 2,
        lastEvidenced: 'Nov 2026',
      },
    ],
    evidence: [
      {
        id: 'ev-hg-1',
        kind: 'credential',
        title: 'Bar Council of Punjab & Haryana — enrolment',
        source: 'Bar Council roll',
        detail: 'Enrolment number verified against the state bar roll.',
        method: 'Registry lookup',
        status: 'verified',
        verifiedOn: '09 Apr 2026',
        skills: ['Contract drafting'],
        signals: ['Active enrolment'],
        weight: 6.0,
      },
      {
        id: 'ev-hg-2',
        kind: 'assessment',
        title: 'Drafting exercise — enterprise SaaS MSA redline',
        source: 'Pramaan Assessments',
        detail: 'Redline of a 22-page MSA reviewed by two senior counsel.',
        method: 'Practical redline · panel review',
        status: 'verified',
        verifiedOn: '28 Apr 2026',
        skills: ['Contract drafting', 'IP licensing'],
        signals: ['Rubric score 89/100'],
        weight: 8.3,
      },
      {
        id: 'ev-hg-3',
        kind: 'verified-work',
        title: 'DPDP readiness memo for an ed-tech platform',
        source: 'Client attestation',
        detail: 'Awaiting client sign-off on the redacted excerpt.',
        method: 'Client attestation',
        status: 'in-review',
        verifiedOn: '—',
        skills: ['DPDP Act compliance'],
        signals: ['Pending'],
        weight: 0,
      },
    ],
    projects: [
      {
        client: 'Reelbox Studios',
        title: 'Content licensing agreements (6)',
        budgetInr: 168000,
        delivered: 'Aug 2026',
        onTime: true,
        rating: 4.8,
        clientNote: 'Turned around redlines in 48 hours, every time.',
      },
    ],
    dimensions: dims(78, 90, 87, 88, 76),
  },
  {
    id: 'tenzin-norbu',
    name: 'Tenzin Norbu',
    initials: 'TN',
    headline: 'Motion designer — explainer films & brand animation',
    profession: 'Motion & Video',
    city: 'Darjeeling',
    state: 'West Bengal',
    languages: ['English', 'Nepali', 'Hindi', 'Tibetan'],
    rateInr: 52000,
    rateUnit: 'project',
    availability: 'Available now',
    trustIndex: 86.1,
    tier: 3,
    recordId: 'PRM-4DX9-6625',
    memberSince: 'Sep 2025',
    projectsCompleted: 14,
    onTimeRate: 92.9,
    repeatClientRate: 50,
    responseTime: '~2 h',
    summary:
      'Hand-crafted 2D motion for fintech and climate brands. Storyboards in a day, a 60-second explainer in about two weeks.',
    hue: 280,
    skills: [
      {
        name: 'After Effects',
        confidence: 93,
        evidenceCount: 6,
        lastEvidenced: 'Oct 2026',
      },
      {
        name: 'Storyboarding',
        confidence: 85,
        evidenceCount: 4,
        lastEvidenced: 'Sep 2026',
      },
      {
        name: 'Character animation',
        confidence: 80,
        evidenceCount: 3,
        lastEvidenced: 'Jul 2026',
      },
    ],
    evidence: [
      {
        id: 'ev-tn-1',
        kind: 'portfolio',
        title: 'Showreel 2026 — 11 client pieces',
        source: 'Vimeo + project files',
        detail:
          'Each clip traced to an engagement; 9 of 11 confirmed by the commissioning client.',
        method: 'Project-file trace + client attestation',
        status: 'verified',
        verifiedOn: '01 Oct 2026',
        skills: ['After Effects', 'Character animation'],
        signals: ['9/11 client-confirmed'],
        weight: 7.9,
      },
      {
        id: 'ev-tn-2',
        kind: 'project-performance',
        title: '14 explainer projects on Pramaan',
        source: 'Pramaan contracts',
        detail:
          'One delivery slipped by three days due to a scope change, documented in the contract thread.',
        method: 'Platform delivery records',
        status: 'verified',
        verifiedOn: '10 Nov 2026',
        skills: ['After Effects', 'Storyboarding'],
        signals: ['92.9% on time', 'Avg rating 4.8'],
        weight: 9.1,
      },
      {
        id: 'ev-tn-3',
        kind: 'assessment',
        title: 'Motion brief — 15-second logo sting',
        source: 'Pramaan Assessments',
        detail: 'Six-hour brief judged on timing, easing and brand fit.',
        method: 'Practical brief · 2 reviewers',
        status: 'verified',
        verifiedOn: '14 Sep 2025',
        skills: ['After Effects'],
        signals: ['Rubric score 88/100'],
        weight: 7.2,
      },
    ],
    projects: [
      {
        client: 'Solarkart',
        title: 'Rooftop solar explainer (Hindi + English)',
        budgetInr: 96000,
        delivered: 'Oct 2026',
        onTime: true,
        rating: 4.9,
        clientNote:
          'Lead conversion on the landing page rose 22% after the video went live.',
      },
    ],
    dimensions: dims(86, 83, 89, 90, 84),
  },
  {
    id: 'rohan-dsouza',
    name: 'Rohan D’Souza',
    initials: 'RD',
    headline: 'Architectural visualisation & BIM drafting',
    profession: 'Architecture & Visualisation',
    city: 'Panaji',
    state: 'Goa',
    languages: ['Konkani', 'English', 'Marathi'],
    rateInr: 1400,
    rateUnit: 'hour',
    availability: 'Limited',
    trustIndex: 76.5,
    tier: 1,
    recordId: 'PRM-6PL3-9908',
    memberSince: 'Oct 2026',
    projectsCompleted: 1,
    onTimeRate: 100,
    repeatClientRate: 0,
    responseTime: '~6 h',
    summary:
      'Photoreal renders and Revit models for residential developers along the Konkan coast. New to Pramaan and building his record.',
    hue: 190,
    skills: [
      {
        name: 'Revit / BIM',
        confidence: 78,
        evidenceCount: 2,
        lastEvidenced: 'Oct 2026',
      },
      {
        name: 'Twinmotion rendering',
        confidence: 74,
        evidenceCount: 2,
        lastEvidenced: 'Oct 2026',
      },
    ],
    evidence: [
      {
        id: 'ev-rd-1',
        kind: 'credential',
        title: 'Council of Architecture — registration',
        source: 'COA register',
        detail: 'Registration verified against the public COA register.',
        method: 'Registry lookup',
        status: 'verified',
        verifiedOn: '04 Oct 2026',
        skills: ['Revit / BIM'],
        signals: ['Active registration'],
        weight: 6.1,
      },
      {
        id: 'ev-rd-2',
        kind: 'portfolio',
        title: 'Villa cluster, Assagao — renders & model',
        source: 'Revit file + renders',
        detail: 'Model metadata reviewed; developer attestation requested.',
        method: 'File metadata + attestation',
        status: 'in-review',
        verifiedOn: '—',
        skills: ['Revit / BIM', 'Twinmotion rendering'],
        signals: ['Attestation pending'],
        weight: 0,
      },
      {
        id: 'ev-rd-3',
        kind: 'project-performance',
        title: 'First Pramaan engagement — 3-bedroom render set',
        source: 'Pramaan contract #C-44102',
        detail: 'Delivered on time with a 4.7 rating.',
        method: 'Platform delivery records',
        status: 'verified',
        verifiedOn: '13 Nov 2026',
        skills: ['Twinmotion rendering'],
        signals: ['On time'],
        weight: 5.2,
      },
    ],
    projects: [
      {
        client: 'Coastline Habitats',
        title: '3-bedroom interior render set',
        budgetInr: 42000,
        delivered: 'Nov 2026',
        onTime: true,
        rating: 4.7,
        clientNote: 'Quick, accurate, and happy to iterate on lighting.',
      },
    ],
    dimensions: dims(68, 79, 97, 74, 71),
  },
]

export function getProfessional(id: string) {
  return professionals.find((p) => p.id === id)
}

export function formatInr(n: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n)
}

/* ---------- Verification Engine (professional-side console) ---------- */

export const PIPELINE_STAGES = [
  {
    key: 'intake',
    label: 'Intake',
    detail: 'Evidence received and normalised into a common format.',
  },
  {
    key: 'authenticity',
    label: 'Authenticity',
    detail: 'Source, signatures and tamper checks.',
  },
  {
    key: 'attribution',
    label: 'Attribution',
    detail: 'Confirms the work is genuinely yours, and how much of it.',
  },
  {
    key: 'mapping',
    label: 'Skill mapping',
    detail: 'Maps evidence to a profession-independent capability taxonomy.',
  },
  {
    key: 'weighting',
    label: 'Weighting',
    detail: 'Scores independence, depth and recency.',
  },
  {
    key: 'record',
    label: 'Record issued',
    detail: 'Written to your Capability Record with a reusable proof.',
  },
] as const

export interface QueueItem {
  id: string
  kind: EvidenceKind
  title: string
  source: string
  stage: number
  submitted: string
  note?: string
}

export const verificationQueue: QueueItem[] = [
  {
    id: 'q-1',
    kind: 'project-performance',
    title: 'Payment gateway failover — Kshetra Finance phase 2',
    source: 'Pramaan contract #C-45518',
    stage: 6,
    submitted: '12 Nov 2026',
  },
  {
    id: 'q-2',
    kind: 'verified-work',
    title: 'Conference talk — “Exactly-once is a lie” at GopherCon India',
    source: 'Event listing + recording',
    stage: 3,
    submitted: '16 Nov 2026',
    note: 'Matching speaker identity to the event organiser’s records.',
  },
  {
    id: 'q-3',
    kind: 'connected-account',
    title: 'Stack Overflow — 214 accepted answers',
    source: 'stackoverflow.com',
    stage: 1,
    submitted: '18 Nov 2026',
  },
]

export const EVIDENCE_SOURCES: {
  kind: EvidenceKind
  label: string
  examples: string
}[] = [
  {
    kind: 'connected-account',
    label: 'Connect an account',
    examples: 'GitHub, Behance, Kaggle, DigiLocker, LinkedIn',
  },
  {
    kind: 'verified-work',
    label: 'Submit verifiable work',
    examples: 'Publications, talks, repositories, filings',
  },
  {
    kind: 'assessment',
    label: 'Take a practical assessment',
    examples: 'Live tasks reviewed by practitioners',
  },
  {
    kind: 'portfolio',
    label: 'Add a portfolio item',
    examples: 'Source files with authorship metadata',
  },
  {
    kind: 'project-performance',
    label: 'Import a past project',
    examples: 'Invite the client to confirm the outcome',
  },
  {
    kind: 'credential',
    label: 'Add a credential',
    examples: 'ICAI, Bar Council, COA, university degrees',
  },
]

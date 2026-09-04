# MergeBounty Website Build Prompt

Build a polished, responsive public website for **MergeBounty**, a GenLayer-powered consensus-settled software bounty escrow.

Use the repository documentation as the source of truth, especially `README.md`, `SUBMISSION_EVIDENCE.md`, and `WEBSITE_HANDOFF.md`.

## Core product

MergeBounty lets sponsors escrow GEN against immutable software-development requirements. A developer explicitly accepts the governing terms hash, submits an exact Git commit plus SHA-256 commit-bound evidence, and GenLayer validators independently adjudicate whether the submitted work satisfies the requirements. Approved work can be finalized into payout. Rejected or insufficient-evidence outcomes have a bounded challenge path, with timeout/refund protections and append-only audit history.

## Canonical live demo data

- Network: GenLayer Studionet
- Contract: `0xe382bD55151f22Cd6477Ea613F21337C8d30b1EE`
- Bounty ID: `mergebounty-slugify-001`
- Bounty title: `Deterministic Slugify Utility`
- Escrowed reward: 1 GEN
- Final verdict: `APPROVED`
- Final settlement: payout finalized to accepted developer
- Exact reviewed commit: `7ce2b69d8f5dd664c6450627fa696afd46f0bdd9`
- Evidence SHA-256: `44975f1aee71aa648481d55babbd43c6fa2a502337a831a0ea4a7a38c1c03ac7`
- Repository: `https://github.com/amzar1st/mergebounty-demo`
- Evidence URL: `https://raw.githubusercontent.com/amzar1st/mergebounty-demo/7ce2b69d8f5dd664c6450627fa696afd46f0bdd9/EVIDENCE.md`

### Verified lifecycle transactions

1. Deployment: `0xd336d8f089efde838fd581f808061ae0258d9198e579d527558acfe409b573b5`
2. Evidence preflight: `0xab9a5dcb01aa535aa35e63d2afd468220ce34871b239ebd782c83612ef0db615`
3. Create + fund bounty: `0xee4dbc5888bc6add1ae16e4e4d27afe70e40e892297b24e7c745259515fc22ab`
4. Developer accepts immutable terms: `0x9ed93a119bcf680a147cf67c2f234ba39b90c7c13381ecf39bf1ecef20dc472b`
5. Submit commit-bound work: `0xb4bb16220dd37512727ccabc1f966ea8d60d765a7da3c11fc6d13c618490e44b`
6. Full-consensus review — APPROVED: `0x4cf42ba498c4a03a3526c71231395b2c5bb60df6b3bc7677d4c6676f83b7ddca`
7. Finalize + payout: `0x823819926a39da43d56c48592ded003eba1cdf499e93b63edd459034ffbbc864`

## Required pages/sections

Create a strong single-page application or compact multi-page site with:

### 1. Hero
- Product name: MergeBounty
- Headline similar to: **Software bounties settled by evidence, not trust.**
- Short copy explaining commit-bound proof + GenLayer consensus.
- Primary CTA: Explore Live Demo
- Secondary CTA: View GitHub
- Show a small `Studionet • Live demo verified` status indicator.

### 2. How it works
Visual lifecycle:
**Fund Bounty → Accept Immutable Terms → Submit Exact Commit → Consensus Review → Challenge if needed → Settle**

Each step should have one concise explanation.

### 3. Live verified demo dashboard
Build a prominent proof card for `mergebounty-slugify-001` showing:
- Status: PAID / APPROVED consensus
- Reward: 1 GEN
- exact commit SHA (shortened visually, copyable full value)
- evidence SHA-256
- repository link
- developer acceptance state
- adjudication count: 1
- consensus verdict: APPROVED
- settlement: finalized

Do not claim live RPC reads unless the site actually performs them. If the integration environment cannot query GenLayer directly, label this section **Verified Studionet Demo** and source it from the canonical proof data supplied above.

### 4. Transaction proof timeline
Create a vertical or horizontal transaction timeline using all seven hashes above. Each item should clearly show stage and success/finalized state. If reliable GenLayer explorer deep-links are available in the environment, use them; otherwise provide copy buttons and do not invent explorer URLs.

### 5. Consensus/evidence architecture
Explain visually:
- immutable terms hash
- accepted developer identity
- exact Git commit binding
- SHA-256 evidence integrity
- independent validator evaluation
- deterministic settlement guards
- bounded challenge
- timeout/refund protection
- append-only audit history

Make it understandable to both developers and hackathon/project reviewers.

### 6. Security / why this matters
Contrast normal bounty settlement with MergeBounty:
- no subjective sponsor-only approval
- no mutable latest-branch evidence dependency
- no unsupported developer claims as proof
- explicit accepted terms
- auditable settlement state

Avoid exaggerated claims such as “trustless” or “fraud-proof.” Use technically precise language.

### 7. Developer / contract section
Show the canonical Studionet contract address with copy button and links to:
- GitHub repository
- exact reviewed commit
- EVIDENCE.md
- submission evidence document

### 8. Footer
Include MergeBounty, GenLayer Studionet, GitHub, and a concise experimental/demo disclaimer.

## Optional dApp functionality

If the generated environment can correctly integrate with the deployed GenLayer contract and wallet infrastructure, add a separate **Contract Console** area with wallet connect and real methods such as:
- `get_bounty`
- `get_bounty_count`
- `get_bounty_id`
- `get_adjudication`
- `get_audit_count`
- `get_audit_entry`

Potential write actions may include create bounty, accept bounty, submit work, review submission, challenge verdict, finalize bounty, cancellation and timeout refund only if the actual GenLayer wallet/tooling supports them correctly.

**Do not fake wallet connectivity or transaction success.** If real writes are not supported, keep the production site as a high-quality read-only proof dashboard and present the lifecycle clearly.

## Design direction

Aim for a competition-quality crypto/developer product, not a generic SaaS landing page.

- Dark charcoal/navy interface
- restrained electric accents and subtle gradients
- crisp modern typography
- high information hierarchy
- compact status chips
- terminal/code motifs used sparingly
- tasteful animated consensus nodes / evidence flow if performance remains strong
- clean cards with thin borders and soft glow
- fully responsive on desktop and mobile
- accessibility-conscious contrast and focus states
- fast loading; no huge background videos

Use visual metaphors around Git commits, hashed evidence, validator agreement and escrow settlement. Avoid cliché coin graphics and excessive cyberpunk styling.

## Technical requirements

- Build clean, maintainable frontend source.
- Make all canonical addresses, hashes and URLs centralized in a data/config file rather than duplicated throughout components.
- Use reusable components for status cards and transaction rows.
- Include copy-to-clipboard interactions.
- Include loading/error states for any real data integration.
- No fabricated data.
- No API keys or secrets in frontend source.
- Include a README explaining local run/build/deploy steps.
- Preserve the final source as a downloadable ZIP/project directory.

## Final delivery

Return:
1. complete website source;
2. deployable production build/project;
3. README with local and deployment instructions;
4. live deployed URL if the builder supports deployment;
5. note identifying whether wallet/contract reads are truly live or the site is a verified static proof dashboard.

The result should make a reviewer understand within 30–60 seconds what MergeBounty solves, how GenLayer consensus is materially used, and that the full 1 GEN lifecycle was actually executed successfully on Studionet.

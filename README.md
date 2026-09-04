# MergeBounty

**A runnable GenLayer Builder Project — Intelligent Contract + MetaMask/GenLayerJS frontend.**

> Software bounties settled by evidence, not trust.

MergeBounty is not only an Intelligent Contract. This repository contains the **deployed contract source**, the **complete public dApp source**, a **dependency-free build**, local run scripts, automated source verification, deployment evidence, and a reproducible reviewer path.

## Reviewer quick start

Prerequisite: **Node.js 20+**.

```bash
git clone https://github.com/amzar1st/mergebounty-demo.git
cd mergebounty-demo
npm ci
npm run check
npm run build
npm start
```

Open **http://localhost:4173**.

Expected results:

- `npm run check` prints PASS for the contract, MetaMask/GenLayerJS integration, canonical deployment, and verified demo data.
- `npm run build` creates `dist/` containing the complete frontend.
- `npm start` serves the built project at `http://localhost:4173`.
- The page loads without a wallet. MetaMask is only required for live write actions.

No API keys, private keys, seed phrases, `.env` file, Docker, Python packages, or proprietary services are required to build the frontend.

## Live deployment

- **Live dApp:** https://genspark.genspark.site/api/designer2/serve/307ba5bb-fbd9-45a9-9e6e-9bd06293838a/index.html
- **Network:** GenLayer Studionet
- **Contract:** `0xe382bD55151f22Cd6477Ea613F21337C8d30b1EE`
- **Deployment tx:** `0xd336d8f089efde838fd581f808061ae0258d9198e579d527558acfe409b573b5`

## Verified end-to-end demo

A real 1 GEN bounty completed the full lifecycle on Studionet:

| Step | Result | Transaction |
| --- | --- | --- |
| Evidence preflight | SUCCESS | `0xab9a5dcb01aa535aa35e63d2afd468220ce34871b239ebd782c83612ef0db615` |
| Create + fund bounty | SUCCESS | `0xee4dbc5888bc6add1ae16e4e4d27afe70e40e892297b24e7c745259515fc22ab` |
| Developer accepts terms | SUCCESS | `0x9ed93a119bcf680a147cf67c2f234ba39b90c7c13381ecf39bf1ecef20dc472b` |
| Submit exact commit + evidence | SUCCESS | `0xb4bb16220dd37512727ccabc1f966ea8d60d765a7da3c11fc6d13c618490e44b` |
| Full-consensus review | **APPROVED** | `0x4cf42ba498c4a03a3526c71231395b2c5bb60df6b3bc7677d4c6676f83b7ddca` |
| Finalize + payout | SUCCESS | `0x823819926a39da43d56c48592ded003eba1cdf499e93b63edd459034ffbbc864` |

Demo bounty: `mergebounty-slugify-001`  
Reward: **1 GEN**  
Final verdict: **APPROVED**  
Settlement: **finalized payout**

## Commit-bound evidence

- Exact reviewed developer commit: `7ce2b69d8f5dd664c6450627fa696afd46f0bdd9`
- Commit: https://github.com/amzar1st/mergebounty-demo/commit/7ce2b69d8f5dd664c6450627fa696afd46f0bdd9
- Evidence: https://raw.githubusercontent.com/amzar1st/mergebounty-demo/7ce2b69d8f5dd664c6450627fa696afd46f0bdd9/EVIDENCE.md
- Evidence SHA-256: `44975f1aee71aa648481d55babbd43c6fa2a502337a831a0ea4a7a38c1c03ac7`

The historical developer-submission commit is intentionally left unchanged. Current Builder Project packaging lives on `main`.

## Project structure

```text
.
├── contract/
│   └── mergebounty.py          # deployed v3 Intelligent Contract source
├── frontend/
│   ├── index.html              # complete public website + live dApp
│   ├── css/main.css
│   ├── assets/favicon.svg
│   └── js/
│       ├── app.js
│       ├── components.js
│       ├── config.js           # canonical demo/deployment data
│       ├── network.js          # Studionet 61999 / 0xf22f
│       ├── wallet.js           # MetaMask EIP-1193 integration
│       ├── genlayer.js         # GenLayerJS reads/writes/finalization
│       ├── abi.js              # method metadata, not Solidity ABI
│       └── dapp.js             # sponsor/developer/consensus/read UI
├── scripts/
│   ├── check.mjs               # reviewer/source verification
│   ├── build.mjs               # dependency-free production build
│   └── serve.mjs               # dependency-free local static server
├── docs/
│   ├── SETUP.md
│   ├── DEMO.md
│   └── DEPLOYMENT.md
├── evidence/
│   └── VERIFIED_LIFECYCLE.md
├── .github/workflows/build.yml # CI: npm ci → check → build
├── package.json
└── package-lock.json
```

## What the dApp can do

### Sponsor
- Create a GEN-funded bounty with immutable requirements.
- Finalize an approved bounty.
- Cancel an unaccepted open bounty.
- Claim timeout refunds when the contract allows it.

### Developer
- Explicitly accept the exact stored terms hash.
- Submit an exact Git commit plus commit-bound SHA-256 evidence.
- Use the one bounded challenge path after a non-approved verdict.

### Consensus / reads
- Trigger `review_submission` for GenLayer consensus adjudication.
- Read bounty records, adjudications, bounty indexes, and append-only audit entries.

## Frontend integration

The frontend uses:

- MetaMask via `window.ethereum`;
- GenLayer Studionet chain ID `61999` (`0xf22f`);
- RPC `https://studio.genlayer.com/api`;
- canonical contract `0xe382bD55151f22Cd6477Ea613F21337C8d30b1EE`;
- GenLayerJS `readContract` for reads;
- `estimateTransactionFeesForWrite` + `writeContract` for writes;
- `waitForFinalization` + `isSuccessful` before reporting transaction success.

The Verified Studionet Demo is clearly separated from live wallet interactions. Historical proof is never presented as a newly generated live transaction.

## Build and test commands

```bash
npm ci
npm run check
npm test
npm run build
npm start
```

`npm run check` is intentionally dependency-free and verifies the exact source properties a reviewer needs before opening the browser.

## Contract deployment / Studio

The deployed source is [`contract/mergebounty.py`](contract/mergebounty.py). It includes the successful `probe_evidence` preflight and avoids unsupported `response.status_code` access in the nondeterministic evidence fetch path.

Full deployment and verification details are in [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## Why GenLayer is necessary

A conventional escrow contract can enforce timestamps and transfers but cannot independently inspect a commit-bound evidence document and decide whether arbitrary software work materially satisfies natural-language requirements. MergeBounty uses GenLayer validators to fetch the exact SHA-256-bound evidence and independently adjudicate it, while deterministic guards constrain what consensus output can settle funds.

## Security / scope

MergeBounty reduces sponsor discretion; it does not claim to eliminate every dispute or software-security risk. Verdict quality depends on well-written requirements and verifiable evidence. Hash checks, exact-commit binding, explicit developer acceptance, bounded challenge windows, timeout/refund paths, and append-only audit records make the settlement process auditable and bounded.

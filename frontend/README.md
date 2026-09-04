# MergeBounty — Public Website + Live dApp

> **Software bounties settled by evidence, not trust.**

Public presentation layer for **MergeBounty**, a GenLayer-powered
consensus-settled software bounty escrow. Sponsors escrow GEN against
immutable software requirements; developers explicitly accept the governing
terms hash and submit an exact Git commit plus SHA-256 commit-bound public
evidence; GenLayer validators independently adjudicate whether the evidence
satisfies the original requirements.

## Site classification

**Verified Studionet proof dashboard + genuine MetaMask-connected
GenLayerJS dApp.**

Two clearly separated halves:

1. **Verified Studionet Demo** (read-only) — the canonical, completed
   1 GEN lifecycle of `mergebounty-slugify-001`: seven on-chain
   transactions, reviewed commit, evidence SHA-256, consensus verdict,
   and finalized payout. Includes one genuine live integration: a
   client-side SHA-256 check of the pinned `EVIDENCE.md` computed in the
   browser via the Web Crypto API.
2. **Live dApp** (wallet-connected) — a real MetaMask + GenLayerJS
   interface for the deployed MergeBounty Intelligent Contract on
   GenLayer Studionet. Every write is a real MetaMask signature and a
   real GenLayer transaction; every read is a real `gen_call`. No state
   is fabricated and success is only reported after
   `client.waitForFinalization(...)` + `isSuccessful(transaction)`
   return true.

No secrets or private keys are stored anywhere in the client.

## Wallet + contract stack

- **MetaMask** (EIP-1193) — real `eth_requestAccounts`, real event
  subscriptions (`accountsChanged`, `chainChanged`, `disconnect`), real
  `wallet_switchEthereumChain` / `wallet_addEthereumChain`. No wallet is
  faked when MetaMask is absent — the UI shows an Install MetaMask
  link.
- **GenLayerJS SDK** (`genlayer-js`) — loaded at runtime from esm.sh at
  the pinned pre-release `2.0.0-rc.1`, which exposes
  `estimateTransactionFeesForWrite`, `waitForFinalization`, and
  `isSuccessful`. The wallet client is built with the actual EIP-1193
  provider:

  ```js
  const client = createClient({
    chain: studionet,
    account: walletAddress,
    provider: window.ethereum,
  });
  await client.connect('studionet');
  ```

  A separate account-free read client is used for public reads before
  the wallet is connected.
- **Studionet network switching** — via
  `wallet_switchEthereumChain(0xf22f)`, falling back to
  `wallet_addEthereumChain(...)` with the canonical params (see
  `js/network.js`).
- **Reads** — `client.readContract({ address, functionName, args })`.
  The SDK decodes the GenLayer response to plain JSON-safe values; the
  UI renders them as key/value rows.
- **Writes** — every write follows this fee-estimated pipeline:
  1. Build the call `{ address, functionName, args }` (+ `value` for
     the payable `create_bounty`).
  2. `estimate = await client.estimateTransactionFeesForWrite(call)`
     — real GenLayer fee estimation. Failure here is surfaced before
     MetaMask is ever prompted.
  3. `txHash = await client.writeContract({ ...call, fees: {
     distribution: estimate.distribution, feeValue: estimate.feeValue
     } })` — real MetaMask signature.
  4. `transaction = await client.waitForFinalization({ hash: txHash })`
     — real GenLayer finalization.
  5. `if (!isSuccessful(transaction)) throw …` — success is authoritative
     via the SDK helper. The UI displays **FINALIZED — SUCCESS** only
     when this returns true.

- **Reward vs fees.** The GEN reward escrowed by `create_bounty` is
  passed as GenLayerJS `value` (wei). GenLayer transaction fees are a
  separate `fees` field on the same call. Never confused.

## Canonical data (single source of truth: `js/config.js`, `js/network.js`)

| Item | Value |
|---|---|
| Network | GenLayer Studionet |
| Chain ID | `61999` decimal / `0xf22f` hex |
| RPC | `https://studio.genlayer.com/api` |
| Explorer | `https://explorer-studio.genlayer.com` |
| Native currency | GenLayer / **GEN** / 18 decimals |
| Contract | `0xe382bD55151f22Cd6477Ea613F21337C8d30b1EE` |
| Demo bounty | `mergebounty-slugify-001` — Deterministic Slugify Utility |
| Reward | 1 GEN |
| Reviewed commit | `7ce2b69d8f5dd664c6450627fa696afd46f0bdd9` |
| Evidence SHA-256 | `44975f1aee71aa648481d55babbd43c6fa2a502337a831a0ea4a7a38c1c03ac7` |
| Verdict | APPROVED (one full-consensus adjudication) |
| Settlement | Finalized payout `0x823819926a39da43d56c48592ded003eba1cdf499e93b63edd459034ffbbc864` |
| Repository | https://github.com/amzar1st/mergebounty-demo |

The seven canonical lifecycle transactions (deployment, evidence preflight,
create+fund, accept terms, submit work, consensus APPROVED review,
finalize+payout) are listed in `js/config.js` under `transactions`.

## Tech stack

- Vanilla HTML + CSS + ES-module JavaScript. **No build step.**
- `genlayer-js@2.0.0-rc.1` (and its transitive `viem`) are loaded at
  runtime from `https://esm.sh` on first read/write — no npm install
  required to serve the site.
- Reusable presentational components in `js/components.js` (chips, hash
  fields with copy-to-clipboard, transaction items, architecture cards,
  lifecycle steps).
- All canonical proof-dashboard data centralized in `js/config.js`.
- Canonical Studionet network parameters centralized in `js/network.js`.
- Contract method metadata (name / kind / positional param list) in
  `js/abi.js`. **Not a Solidity ABI** — the SDK does the calldata
  encoding by `functionName` + positional `args`.
- No secrets, API keys, seed phrases, or private keys anywhere.
- No environment variables are required.

## Run locally

Any static file server works (ES modules require `http://`, not `file://`):

```bash
# Python
python3 -m http.server 8000

# or Node
npx serve .
```

Open http://localhost:8000

## Production build

Nothing to compile — the source **is** the production build. Shipping the
project directory as-is is supported. If your CSP disallows `esm.sh`,
`npm i genlayer-js@2.0.0-rc.1` and replace the two dynamic imports at the
top of `js/genlayer.js` with static imports resolved by your bundler.

## Deployment

Deploy the project directory to any static host:

- **Netlify / Vercel / Cloudflare Pages:** framework preset "Other";
  build command: *(none)*; output directory: project root.
- **GitHub Pages:** push the directory and enable Pages on the branch root.
- **Any web server / S3 / IPFS pin:** upload the directory contents as-is.

CSP `connect-src` must allow: `studio.genlayer.com`, `esm.sh`,
`raw.githubusercontent.com`.

No server-side component, environment variables, or secrets are needed.

## Project structure

```
├── index.html          # nav, hero, lifecycle, Verified Demo,
│                       # LIVE dApp, tx timeline, evidence,
│                       # architecture, security, footer
├── css/main.css        # design system + wallet + dApp styles,
│                       # responsive, reduced-motion safe
├── js/config.js        # canonical Verified Demo data
├── js/network.js       # canonical Studionet params
├── js/wallet.js        # MetaMask connect / disconnect / events /
│                       # chain switch / balance
├── js/abi.js           # display-only method metadata
│                       # (NOT a Solidity ABI)
├── js/genlayer.js      # GenLayerJS SDK wrapper:
│                       #   • wallet client with provider: window.ethereum
│                       #     and client.connect('studionet')
│                       #   • estimateTransactionFeesForWrite → writeContract
│                       #   • waitForFinalization + isSuccessful
├── js/dapp.js          # Live dApp UI: wallet button + panel, tabs,
│                       # per-method forms, tx state machine, read
│                       # renderer, role hints
├── js/components.js    # presentational HTML string builders
├── js/app.js           # boots the static sections and the dApp,
│                       # runs the SHA-256 integrity check
└── assets/favicon.svg
```

## Accuracy rules honored

- No invented deployments, verdicts, validator counts, explorer URLs,
  wallet states, or financial metrics.
- No fake wallet connectivity: MetaMask is either real or the user is
  told to install it.
- No simulated transaction success: FINALIZED / SUCCESS is only shown
  after `isSuccessful(transaction)` returns true.
- The security section makes no "fraud-proof" or guaranteed-security
  claims.

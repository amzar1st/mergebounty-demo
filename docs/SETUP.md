# Local setup and build

## Prerequisites

- Node.js 20 or newer
- A modern browser
- MetaMask only if you want to exercise live wallet writes

No environment variables are required for the canonical Studionet deployment.

## Clone, verify, build

```bash
git clone https://github.com/amzar1st/mergebounty-demo.git
cd mergebounty-demo
npm ci
npm run check
npm run build
```

The build command copies the reviewed production frontend into `dist/` after checking required source files.

## Run the built app

```bash
npm start
```

Open http://localhost:4173.

For development without rebuilding first:

```bash
npm run dev
```

## Expected behavior

Without MetaMask, the site still loads and displays the Verified Studionet Demo, transaction trail, contract address, evidence hash and architecture. The live dApp shows an Install MetaMask / Connect Wallet path rather than faking a connected account.

With MetaMask, the app can switch/add GenLayer Studionet and use the connected EIP-1193 provider for GenLayerJS write calls.

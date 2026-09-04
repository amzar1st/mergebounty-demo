# MergeBounty Website Architecture

## Recommended frontend structure

```text
src/
  components/
    Hero.tsx
    Lifecycle.tsx
    VerifiedDemo.tsx
    TransactionTimeline.tsx
    EvidencePanel.tsx
    ConsensusArchitecture.tsx
    SecuritySection.tsx
    ContractPanel.tsx
    Footer.tsx
  data/
    mergebounty.ts
  lib/
    clipboard.ts
    format.ts
    genlayer.ts        # only if real integration is supported
  pages/ or app/
    main route
```

## Data model

Keep the following canonical values in one config/data module:

- network
- contract address
- demo bounty ID
- reward
- verdict
- settlement state
- exact commit SHA
- evidence digest
- repository/evidence URLs
- verified lifecycle transaction hashes

Components should consume these values rather than duplicating constants.

## Integration modes

### Mode A — verified read-only proof dashboard
Preferred when the website generator cannot reliably connect to GenLayer Studionet. Use the canonical verified data from `WEBSITE_DATA.json`. Clearly label the demo as verified historical Studionet proof, not live RPC state.

### Mode B — live read integration
If supported, query public view methods and show loading/error states. Keep verified demo data available as a fallback/reference but distinguish it from live reads.

### Mode C — wallet-connected dApp
Only use if the environment provides correct GenLayer wallet and transaction tooling. Enforce role/state checks in the UI and never simulate transaction success.

## Quality bar

- responsive, mobile-first layout;
- accessible buttons and focus states;
- deterministic display of canonical proof data;
- no secret/API key exposure;
- clear README and build commands;
- production build should complete without warnings/errors that affect functionality.

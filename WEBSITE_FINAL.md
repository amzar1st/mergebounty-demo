# MergeBounty — Final Website

## Live site

https://genspark.genspark.site/api/designer2/serve/307ba5bb-fbd9-45a9-9e6e-9bd06293838a/index.html

## Classification

Verified Studionet proof dashboard + genuine MetaMask-connected GenLayerJS dApp.

The final Genspark export was source-audited before this document was added. The production root implements:

- MetaMask EIP-1193 connection with `eth_requestAccounts`;
- `accountsChanged` and `chainChanged` handling;
- GenLayer Studionet switching / add-chain flow;
- chain ID `61999` / `0xf22f`;
- RPC `https://studio.genlayer.com/api`;
- explorer `https://explorer-studio.genlayer.com`;
- canonical MergeBounty contract `0xe382bD55151f22Cd6477Ea613F21337C8d30b1EE`;
- `genlayer-js@2.0.0-rc.1`;
- wallet-backed GenLayerJS client with `provider: window.ethereum`;
- `client.connect('studionet')`;
- account-free client for public reads;
- `readContract` for the contract's public read methods;
- `estimateTransactionFeesForWrite` before writes;
- `writeContract` with `fees.distribution` and `fees.feeValue`;
- payable `value` support for `create_bounty`;
- `waitForFinalization` for durable completion; and
- `isSuccessful(transaction)` before the UI reports `FINALIZED — SUCCESS`.

## Contract method coverage

### Sponsor
- `create_bounty`
- `finalize_bounty`
- `cancel_open_bounty`
- `claim_timeout_refund`

### Developer
- `accept_bounty`
- `submit_work`
- `challenge_verdict`

### Consensus
- `review_submission`

### Reads
- `get_bounty`
- `get_bounty_count`
- `get_bounty_id`
- `get_adjudication`
- `get_audit_count`
- `get_audit_entry`

The final method metadata preserves GenLayer/Python argument semantics: commit SHA, terms hash, and evidence hashes are strings; `challenge_verdict` has four arguments; `get_audit_count` takes no arguments; and `get_audit_entry` takes only an index.

## Verified historical demo

The website preserves the completed historical proof separately from live interactions:

- Bounty: `mergebounty-slugify-001`
- Reward: 1 GEN
- Commit: `7ce2b69d8f5dd664c6450627fa696afd46f0bdd9`
- Evidence SHA-256: `44975f1aee71aa648481d55babbd43c6fa2a502337a831a0ea4a7a38c1c03ac7`
- Verdict: `APPROVED`
- Final payout: `0x823819926a39da43d56c48592ded003eba1cdf499e93b63edd459034ffbbc864`

## Packaging note

The final Genspark ZIP also contained a stale duplicate `design_handoff_mergebounty_wallet_dapp/` folder from an earlier iteration. That duplicate is not treated as production source; the audited production root is the authoritative website build.

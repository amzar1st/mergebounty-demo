# MergeBounty

MergeBounty is a GenLayer-powered software bounty escrow that binds payment to immutable requirements, exact Git commits, SHA-256 evidence integrity, and validator consensus.

Sponsors fund bounties in GEN. Developers explicitly accept the governing terms hash, submit an exact commit plus commit-bound evidence, and GenLayer validators independently adjudicate whether the work materially satisfies the bounty. Approved work can be finalized into payout, while non-approved outcomes have a bounded challenge path and timeout/refund protections.

## Live website

- Public website / live dApp: https://genspark.genspark.site/api/designer2/serve/307ba5bb-fbd9-45a9-9e6e-9bd06293838a/index.html
- Site classification: verified Studionet proof dashboard + genuine MetaMask-connected GenLayerJS dApp

The frontend keeps the historical verified demo separate from live wallet interactions. Live writes use MetaMask, GenLayerJS fee estimation, `writeContract`, `waitForFinalization`, and `isSuccessful` before reporting success.

## Canonical Studionet deployment

- Network: GenLayer Studionet
- Contract address: `0xe382bD55151f22Cd6477Ea613F21337C8d30b1EE`
- Deployment transaction: `0xd336d8f089efde838fd581f808061ae0258d9198e579d527558acfe409b573b5`

## Verified end-to-end demo

MergeBounty completed a full live 1 GEN bounty lifecycle using bounty ID `mergebounty-slugify-001`.

1. Evidence preflight — `0xab9a5dcb01aa535aa35e63d2afd468220ce34871b239ebd782c83612ef0db615`
2. Bounty created and funded — `0xee4dbc5888bc6add1ae16e4e4d27afe70e40e892297b24e7c745259515fc22ab`
3. Developer explicitly accepted immutable terms — `0x9ed93a119bcf680a147cf67c2f234ba39b90c7c13381ecf39bf1ecef20dc472b`
4. Commit-bound work submitted — `0xb4bb16220dd37512727ccabc1f966ea8d60d765a7da3c11fc6d13c618490e44b`
5. Full-consensus review returned `APPROVED` — `0x4cf42ba498c4a03a3526c71231395b2c5bb60df6b3bc7677d4c6676f83b7ddca`
6. Approved bounty finalized and payout executed — `0x823819926a39da43d56c48592ded003eba1cdf499e93b63edd459034ffbbc864`

## Commit-bound submission evidence

- Exact reviewed commit: `7ce2b69d8f5dd664c6450627fa696afd46f0bdd9`
- Exact commit: https://github.com/amzar1st/mergebounty-demo/commit/7ce2b69d8f5dd664c6450627fa696afd46f0bdd9
- Evidence manifest: https://raw.githubusercontent.com/amzar1st/mergebounty-demo/7ce2b69d8f5dd664c6450627fa696afd46f0bdd9/EVIDENCE.md
- Evidence SHA-256: `44975f1aee71aa648481d55babbd43c6fa2a502337a831a0ea4a7a38c1c03ac7`
- Developer submission branch: https://github.com/amzar1st/mergebounty-demo/tree/developer-submission

The reviewed `EVIDENCE.md` maps all immutable bounty requirements to the implementation, automated tests and documentation contained in the exact commit. The reviewed developer commit remains unchanged; presentation/frontend work lives on `main`.

## Demo task

The live demo bounty requires a deterministic `slugify(text)` utility that:

- converts input to lowercase;
- replaces whitespace with a single hyphen;
- removes unsupported punctuation/special characters;
- removes leading/trailing and repeated hyphens;
- includes at least five automated tests; and
- includes README usage documentation and examples.

The exact reviewed developer commit contains the completed implementation and eight automated tests.

## Core trust model

MergeBounty demonstrates:

- GEN-funded escrow;
- immutable bounty requirements;
- explicit developer acceptance via terms hash;
- exact Git commit binding;
- SHA-256 evidence integrity;
- GenLayer consensus adjudication;
- `APPROVED`, `REJECTED`, and `INSUFFICIENT_EVIDENCE` outcomes;
- one bounded developer challenge for non-approved outcomes;
- timeout/refund paths;
- append-only audit history; and
- final payout/refund settlement.

## Frontend stack

The final Genspark frontend includes:

- MetaMask EIP-1193 wallet connection;
- GenLayer Studionet network switching (`61999` / `0xf22f`);
- GenLayerJS `readContract` for public reads;
- provider-backed GenLayerJS writes;
- fee estimation with `estimateTransactionFeesForWrite`;
- payable GEN value support for `create_bounty`;
- `waitForFinalization` + `isSuccessful` outcome verification;
- exact MergeBounty read/write forms; and
- a separate immutable Verified Studionet Demo proof dashboard.

## Evidence and submission documentation

- [`SUBMISSION_EVIDENCE.md`](./SUBMISSION_EVIDENCE.md) — canonical deployment, proof links, website link and complete live transaction trail.
- [`WEBSITE_FINAL.md`](./WEBSITE_FINAL.md) — live site URL and final wallet/GenLayerJS integration audit.

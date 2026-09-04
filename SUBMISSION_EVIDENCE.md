# MergeBounty — Final Studionet Submission Evidence

This document records the canonical deployment and completed end-to-end live bounty lifecycle for MergeBounty.

## Canonical deployment

- Network: GenLayer Studionet
- Contract address: `0xe382bD55151f22Cd6477Ea613F21337C8d30b1EE`
- Deployment transaction: `0xd336d8f089efde838fd581f808061ae0258d9198e579d527558acfe409b573b5`

## Demo bounty

- Bounty ID: `mergebounty-slugify-001`
- Title: `Deterministic Slugify Utility`
- Escrowed reward: 1 GEN
- Exact reviewed developer commit: `7ce2b69d8f5dd664c6450627fa696afd46f0bdd9`
- Evidence SHA-256: `44975f1aee71aa648481d55babbd43c6fa2a502337a831a0ea4a7a38c1c03ac7`
- Final consensus status: `APPROVED`
- Final settlement: payout finalized to the accepted developer

## Commit-bound evidence

- Repository: https://github.com/amzar1st/mergebounty-demo
- Exact reviewed commit: https://github.com/amzar1st/mergebounty-demo/commit/7ce2b69d8f5dd664c6450627fa696afd46f0bdd9
- Evidence manifest: https://raw.githubusercontent.com/amzar1st/mergebounty-demo/7ce2b69d8f5dd664c6450627fa696afd46f0bdd9/EVIDENCE.md
- Developer submission branch: https://github.com/amzar1st/mergebounty-demo/tree/developer-submission

The exact commit-bound `EVIDENCE.md` maps every immutable bounty requirement to the implementation, automated tests, and README documentation contained in the reviewed commit.

## Full live lifecycle

| Step | Result | Transaction |
| --- | --- | --- |
| Contract deployment | Finalized | `0xd336d8f089efde838fd581f808061ae0258d9198e579d527558acfe409b573b5` |
| Evidence preflight | Success | `0xab9a5dcb01aa535aa35e63d2afd468220ce34871b239ebd782c83612ef0db615` |
| Create + fund bounty | Success | `0xee4dbc5888bc6add1ae16e4e4d27afe70e40e892297b24e7c745259515fc22ab` |
| Developer accepts immutable terms | Success | `0x9ed93a119bcf680a147cf67c2f234ba39b90c7c13381ecf39bf1ecef20dc472b` |
| Submit commit-bound work | Success | `0xb4bb16220dd37512727ccabc1f966ea8d60d765a7da3c11fc6d13c618490e44b` |
| Full-consensus review | `APPROVED` | `0x4cf42ba498c4a03a3526c71231395b2c5bb60df6b3bc7677d4c6676f83b7ddca` |
| Finalize bounty + payout | Success | `0x823819926a39da43d56c48592ded003eba1cdf499e93b63edd459034ffbbc864` |

## What MergeBounty demonstrates

MergeBounty is a GEN-funded software-bounty escrow with:

- immutable sponsor requirements and terms hashing;
- explicit developer acceptance of the governing terms;
- exact Git commit binding;
- SHA-256 evidence integrity checks;
- GenLayer validator consensus over software-delivery evidence;
- `APPROVED`, `REJECTED`, and `INSUFFICIENT_EVIDENCE` outcomes;
- a bounded challenge path for non-approved verdicts;
- timeout/refund protections;
- append-only audit history; and
- automatic payout/refund settlement.

## Website

A public MergeBounty web interface will be linked here after deployment. The website is presentation and interaction infrastructure; the canonical on-chain proof remains the Studionet contract and the transactions above.

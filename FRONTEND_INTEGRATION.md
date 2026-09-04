# MergeBounty Frontend Integration Reference

This document is a frontend-oriented reference for the public methods exposed by the MergeBounty Intelligent Contract. It is intended for a generated website/dApp implementation and does not replace the canonical contract source.

## Canonical deployment

- Network: GenLayer Studionet
- Contract: `0xe382bD55151f22Cd6477Ea613F21337C8d30b1EE`

## Read methods

### `get_bounty(bounty_id)`
Returns the complete stored bounty record including sponsor, accepted developer, title, repository, immutable requirements, terms hash, reward, state timestamps, commit/evidence fields, challenge state, settlement flag and adjudication metadata.

### `get_bounty_count()`
Returns the number of created bounty IDs.

### `get_bounty_id(index)`
Returns a bounty ID by index.

### `get_adjudication(bounty_id, round_no)`
Returns a stored consensus adjudication round including verdict, score, mandatory-failure flag, evidence quality, requirement counts, summary, evidence URL/hash and creation time.

### `get_audit_count()`
Returns the total number of audit entries.

### `get_audit_entry(index)`
Returns an audit entry containing bounty ID, actor, action, timestamp and detail.

## Write lifecycle

The production contract lifecycle includes operations for:

- creating/funding a bounty;
- accepting a bounty against the expected terms hash;
- submitting exact commit-bound work;
- requesting consensus review;
- challenging a rejected/insufficient verdict once within the bounded challenge window;
- finalizing a bounty;
- cancelling an unaccepted open bounty; and
- claiming eligible timeout refunds.

## Frontend safety rules

1. Never enable a write button unless the connected wallet and current bounty state satisfy the method's role/state requirements.
2. Display the full immutable terms and `terms_hash` before developer acceptance.
3. Require the exact commit SHA and evidence SHA-256 digest to be visible before submission.
4. Do not guess transaction success. Wait for the actual connected GenLayer transaction result and surface errors.
5. Treat `REJECTED` and `INSUFFICIENT_EVIDENCE` as distinct outcomes.
6. Never represent a static demo value as a live chain read.
7. If GenLayer wallet/RPC tooling is unavailable in the generated website environment, use a verified read-only demo dashboard instead of mocked write functionality.

## Verified demo record

For a read-only proof dashboard, the canonical completed example is:

- Bounty: `mergebounty-slugify-001`
- Reward: 1 GEN
- Consensus: `APPROVED`
- Exact commit: `7ce2b69d8f5dd664c6450627fa696afd46f0bdd9`
- Evidence SHA-256: `44975f1aee71aa648481d55babbd43c6fa2a502337a831a0ea4a7a38c1c03ac7`
- Finalized payout transaction: `0x823819926a39da43d56c48592ded003eba1cdf499e93b63edd459034ffbbc864`

See `SUBMISSION_EVIDENCE.md` for the complete proof timeline.

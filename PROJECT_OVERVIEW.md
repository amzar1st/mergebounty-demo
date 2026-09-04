# MergeBounty Project Overview

## Problem

Software bounty settlement usually depends on a sponsor manually deciding whether work is acceptable. That creates ambiguity around changing requirements, mutable repository state, unsupported developer claims, and funds that can remain disputed or locked.

## Solution

MergeBounty is a GenLayer Intelligent Contract that turns software bounty settlement into an auditable evidence-and-consensus workflow.

A sponsor funds a bounty in GEN and defines immutable requirements. The contract derives a terms hash. A developer must explicitly accept that exact hash before becoming the accepted developer. Work is submitted using an exact Git commit SHA plus a public commit-bound evidence URL and SHA-256 digest. GenLayer validators independently fetch the same evidence and adjudicate it against the original requirements.

## Settlement model

Consensus may return:

- `APPROVED` — sufficiently strong evidence shows all material requirements are satisfied.
- `REJECTED` — evidence clearly demonstrates a material failure.
- `INSUFFICIENT_EVIDENCE` — the evidence is not strong enough for responsible approval or rejection.

Approved work can be finalized into developer payout. Non-approved verdicts may be challenged once within a bounded window. Timeout/refund paths prevent indefinite escrow locking.

## Key design properties

### Immutable terms
The bounty requirements and economic/window parameters are hashed into a canonical terms digest. Developer acceptance is bound to that digest.

### Exact commit binding
The submission stores a full Git commit SHA. Evidence URLs must be commit-bound rather than relying on a mutable branch head.

### Evidence integrity
The evidence body is hashed with SHA-256 and compared to the digest supplied at submission, making later content mutation detectable.

### Validator consensus
GenLayer nondeterministic execution lets validators independently retrieve and evaluate the same public evidence. Settlement-critical categorical results must agree, with bounded tolerance for subjective numeric scores.

### Bounded dispute lifecycle
A rejected or insufficient-evidence verdict can use one developer challenge. Review and submission deadlines plus refund paths keep funds from remaining locked forever.

### Auditability
Creation, acceptance, submission, consensus review, challenge and settlement events are appended to an on-chain audit log.

## Canonical live proof

- Network: GenLayer Studionet
- Contract: `0xe382bD55151f22Cd6477Ea613F21337C8d30b1EE`
- Demo bounty: `mergebounty-slugify-001`
- Reward: 1 GEN
- Reviewed commit: `7ce2b69d8f5dd664c6450627fa696afd46f0bdd9`
- Verdict: `APPROVED`
- Settlement: finalized payout

See `SUBMISSION_EVIDENCE.md` for the complete transaction trail.

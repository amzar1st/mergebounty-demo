# MergeBounty Website FAQ

## What is MergeBounty?
MergeBounty is a GenLayer-powered software bounty escrow that binds settlement to immutable requirements, exact Git commits, hashed public evidence and validator consensus.

## Why use an exact commit SHA?
A branch can change after submission. An exact commit identifies a stable repository state that reviewers can inspect later.

## Why hash the evidence?
The SHA-256 digest lets the contract detect if the public evidence bytes change after submission.

## Who decides whether the work passes?
GenLayer validators independently evaluate the supplied commit-bound evidence against the original bounty requirements and reach a consensus verdict.

## What verdicts are possible?
`APPROVED`, `REJECTED`, or `INSUFFICIENT_EVIDENCE`.

## Can a developer challenge a bad result?
A non-approved verdict can use one bounded developer challenge within the configured window.

## Can escrow remain locked forever?
The contract includes submission/review windows and timeout/refund paths designed to prevent indefinite escrow locking.

## Was the demo actually executed?
Yes. The canonical Studionet demo escrowed 1 GEN, accepted a developer, submitted exact commit-bound evidence, received an `APPROVED` consensus verdict, and finalized the payout. The complete transaction trail is recorded in `SUBMISSION_EVIDENCE.md`.

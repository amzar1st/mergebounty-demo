# MergeBounty Security Copy

## Evidence integrity

MergeBounty does not treat a developer note as proof. The submission is tied to an exact Git commit and a public evidence document whose bytes are verified against a SHA-256 digest.

## Immutable acceptance

The developer accepts the canonical bounty terms hash before submission, reducing ambiguity about which specification governs the work.

## Consensus review

GenLayer validators independently evaluate the same evidence against the same immutable requirements. Settlement-critical categorical outcomes must agree before the result is accepted.

## Bounded disagreement

A non-approved result does not create an endless dispute. The contract provides a bounded developer challenge path and explicit timeout/refund routes.

## Auditable lifecycle

Creation, acceptance, submission, adjudication, challenge and settlement actions are retained as contract state/audit history, making the bounty lifecycle inspectable after settlement.

## Precise claim

MergeBounty is designed to improve the auditability and evidence discipline of software bounty settlement. It does not claim to eliminate all software bugs, oracle risk, validator disagreement or application-layer security risk.

# MergeBounty Website Content

Use this copy as a content source for the public MergeBounty website.

## Hero

### Software bounties settled by evidence, not trust.

MergeBounty binds GEN-funded software bounties to immutable requirements, exact Git commits, SHA-256 evidence and GenLayer validator consensus.

**Primary CTA:** Explore Verified Demo  
**Secondary CTA:** View GitHub

Status label: `GenLayer Studionet • Verified live lifecycle`

## Short product explanation

Sponsors fund software work against explicit requirements. Developers accept the exact terms before submitting. Every submission points to an immutable Git commit and hashed public evidence. GenLayer validators independently evaluate that evidence against the bounty specification, then the contract converts the consensus verdict into a bounded settlement flow.

## How it works

### 1. Fund
The sponsor creates immutable requirements and escrows a non-zero GEN reward.

### 2. Accept terms
A separate developer wallet explicitly accepts the canonical terms hash before work can be submitted.

### 3. Submit exact work
The developer submits an exact Git commit SHA, a commit-bound public evidence URL and a SHA-256 digest.

### 4. Consensus review
GenLayer validators independently fetch and evaluate the same evidence against the original requirements.

### 5. Challenge if needed
A rejected or insufficient-evidence verdict may use one bounded developer challenge with additional commit-bound evidence.

### 6. Settle
Approved work pays the developer. Final non-approved outcomes return escrow according to the contract lifecycle. Timeout protections prevent indefinite locking.

## Verified demo

### Deterministic Slugify Utility

**Bounty ID:** `mergebounty-slugify-001`  
**Reward:** `1 GEN`  
**Consensus verdict:** `APPROVED`  
**Settlement:** `Finalized payout`  
**Adjudications:** `1`

The demo required a deterministic `slugify(text)` utility with six immutable requirements, including lowercase conversion, whitespace normalization, punctuation removal, hyphen normalization, automated tests and README documentation.

The accepted developer submitted exact commit:

`7ce2b69d8f5dd664c6450627fa696afd46f0bdd9`

Evidence digest:

`44975f1aee71aa648481d55babbd43c6fa2a502337a831a0ea4a7a38c1c03ac7`

GenLayer consensus reviewed the commit-bound evidence and returned `APPROVED`, after which the 1 GEN bounty was finalized to the accepted developer.

## Why commit-bound evidence matters

A normal branch URL can change after submission. MergeBounty instead requires evidence that contains the submitted exact commit SHA and verifies the evidence bytes against a stored SHA-256 digest. This gives reviewers and validators a stable evidence target and makes later evidence mutation detectable.

## Consensus section

### Independent evidence review

The leader and validators independently retrieve and evaluate the supplied evidence. Settlement-critical fields such as the categorical verdict must agree, while controlled tolerances accommodate reasonable differences in subjective scoring.

### Settlement guards

An approval must meet the configured score threshold and cannot survive a declared mandatory failure. Low-quality evidence is prevented from becoming an unsupported approval.

## Security properties

- Immutable bounty requirements and terms hash
- Explicit developer acceptance
- Exact Git commit binding
- SHA-256 evidence integrity
- Validator-based adjudication
- Bounded challenge lifecycle
- Submission and review timeouts
- Sponsor timeout/refund paths
- Append-only audit history
- Escrowed GEN settlement

## Canonical deployment

**Network:** GenLayer Studionet  
**Contract:** `0xe382bD55151f22Cd6477Ea613F21337C8d30b1EE`

Repository: https://github.com/amzar1st/mergebounty-demo

Exact reviewed commit: https://github.com/amzar1st/mergebounty-demo/commit/7ce2b69d8f5dd664c6450627fa696afd46f0bdd9

Evidence manifest: https://raw.githubusercontent.com/amzar1st/mergebounty-demo/7ce2b69d8f5dd664c6450627fa696afd46f0bdd9/EVIDENCE.md

## Footer disclaimer

MergeBounty is a Studionet demonstration of consensus-settled software bounty infrastructure. The verified demo data and transaction trail are provided for technical evaluation and should not be interpreted as production financial guarantees.

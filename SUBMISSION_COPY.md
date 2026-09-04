# MergeBounty Submission Copy

## Title

**MergeBounty: Consensus-Settled Software Bounties with Commit-Bound Evidence**

## Description

MergeBounty is a GenLayer-powered software bounty escrow that turns repository work into consensus-verifiable settlement. Sponsors escrow GEN against immutable requirements, while developers explicitly accept the governing terms hash before submitting. Each submission is bound to an exact Git commit SHA and SHA-256 evidence digest, preventing mutable web content from silently changing the proof after submission.

GenLayer validators independently fetch and evaluate the commit-bound evidence against the original bounty requirements and produce an APPROVED, REJECTED, or INSUFFICIENT_EVIDENCE verdict. The contract also supports a bounded challenge path, timeout/refund protections, audit history, and automatic settlement.

The live Studionet demo completed the full lifecycle with 1 GEN escrowed: bounty creation → developer acceptance → commit-bound submission → full-consensus review → APPROVED → finalized payout to the developer.

## Short “What did you build/change?” copy

Built and verified MergeBounty end-to-end on GenLayer Studionet. The contract provides GEN-funded software bounty escrow with immutable sponsor requirements, explicit developer acceptance via a terms hash, exact Git commit binding, SHA-256 evidence integrity, validator-based consensus adjudication, bounded verdict challenges, timeout/refund protection, audit history, and automatic payout/refund settlement. The live 1 GEN demo completed creation, developer acceptance, commit-bound submission, full-consensus APPROVED adjudication, and final payout successfully.

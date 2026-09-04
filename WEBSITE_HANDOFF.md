# MergeBounty Website Handoff

This file defines the facts the public MergeBounty website must present accurately.

## Canonical chain data

- Network: GenLayer Studionet
- Contract: `0xe382bD55151f22Cd6477Ea613F21337C8d30b1EE`
- Demo bounty ID: `mergebounty-slugify-001`
- Demo reward: 1 GEN
- Final demo verdict: `APPROVED`
- Final settlement: payout finalized to the accepted developer

## Exact reviewed submission

- Repository: https://github.com/amzar1st/mergebounty-demo
- Commit: `7ce2b69d8f5dd664c6450627fa696afd46f0bdd9`
- Evidence SHA-256: `44975f1aee71aa648481d55babbd43c6fa2a502337a831a0ea4a7a38c1c03ac7`
- Evidence URL: https://raw.githubusercontent.com/amzar1st/mergebounty-demo/7ce2b69d8f5dd664c6450627fa696afd46f0bdd9/EVIDENCE.md

## Product message

MergeBounty is a consensus-settled software bounty escrow. Sponsors fund bounties against immutable requirements. Developers explicitly accept the terms, submit an exact Git commit plus hashed evidence, and GenLayer validators independently adjudicate whether the submitted work materially satisfies the requirements. Approved work can be finalized into payout; non-approved outcomes have a bounded challenge path and timeout/refund protections.

## Required website sections

1. Hero with clear one-line value proposition.
2. "How it works" lifecycle: Fund → Accept Terms → Submit Commit → Consensus Review → Challenge if needed → Settle.
3. Live demo proof showing the completed `mergebounty-slugify-001` lifecycle.
4. Contract/evidence panel with copyable contract address, commit SHA, evidence hash and repository link.
5. Consensus verdict card showing `APPROVED` for the completed demo.
6. Transaction timeline using the seven canonical transaction hashes from `SUBMISSION_EVIDENCE.md`.
7. Architecture/security section explaining immutable terms, commit-bound evidence, SHA-256 integrity, validator consensus, bounded challenges, timeouts and audit history.
8. GitHub and evidence links.
9. Optional wallet-connected dApp controls only if they can be wired correctly to the deployed contract. Never fake successful transactions.

## UX direction

Build a polished developer/crypto product rather than a generic marketing template. Use a dark professional interface, restrained gradients, crisp typography, subtle code/consensus motifs, compact status chips, transaction cards, and clear mobile responsiveness. The page should make the trust model understandable in under a minute.

## Accuracy rules

- Do not invent additional deployments, transactions, verdicts, users, validator counts or financial metrics.
- Do not label mock UI as live.
- Do not change the canonical contract address.
- Do not alter the exact reviewed commit SHA or evidence digest.
- Keep the exact commit-bound evidence links visible.
- If wallet integration is not supported by the generated site environment, build a read-only proof dashboard rather than pretending writes work.

## Final website handoff

After the site is deployed, provide the final website ZIP/source and live URL. The repository documentation can then be updated with the site link and frontend source/evidence without changing the immutable reviewed developer commit.

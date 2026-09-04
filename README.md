# MergeBounty Demo Repository

This repository is used as controlled public evidence for the MergeBounty GenLayer demo.

## Demo task

A developer will implement a deterministic `slugify(text)` utility according to an immutable bounty specification.

The initial repository intentionally contains no implementation. The completed implementation is maintained on the `developer-submission` branch and reviewed by GenLayer against an exact commit SHA.

## Canonical GenLayer deployment

- Contract address: `0xECaF7e774B8E276Bf77B70F7FD3596f6DE488A85`
- Deployment transaction: `0x5f263dd1abec5fd222b15adbd68acca10feba819d473e485c2f7221ec8eb4b53`
- Network: GenLayer Studionet

This v3 deployment adds a zero-value `probe_evidence` preflight and removes unsupported HTTP response status-field access from the evidence-fetch path.

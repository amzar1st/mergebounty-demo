# Reviewer demo path

## Fast path: no funds required

1. Open the live dApp or run the project locally.
2. Go to **Verified Studionet Demo**.
3. Confirm bounty `mergebounty-slugify-001` shows:
   - 1 GEN reward
   - exact commit `7ce2b69d8f5dd664c6450627fa696afd46f0bdd9`
   - evidence SHA-256 `44975f1aee71aa648481d55babbd43c6fa2a502337a831a0ea4a7a38c1c03ac7`
   - verdict `APPROVED`
   - finalized payout
4. Open the transaction timeline and inspect the full-consensus review and final payout hashes.
5. Open the Evidence section and verify the pinned GitHub evidence URL.

## Live read path

1. Connect MetaMask.
2. Switch to GenLayer Studionet when prompted.
3. Open **Live dApp → Read → View Bounty**.
4. Enter `mergebounty-slugify-001`.
5. The app calls the deployed contract through GenLayerJS and renders the returned bounty record.

## Write path

Write operations are available for sponsor/developer/consensus roles, but reviewers do not need to fund a new bounty to verify the submitted project. The completed 1 GEN lifecycle already provides deployment and consensus evidence.

# MergeBounty Website Test Plan

Before publishing the generated site, verify:

## Content accuracy
- Contract address exactly matches canonical Studionet deployment.
- Reviewed commit and evidence digest match repository proof.
- All seven transaction hashes are copied correctly.
- Demo status is shown as `APPROVED` with finalized payout.
- Static verified data is not presented as live RPC state.

## UX
- All copy buttons copy the full underlying value.
- Long hashes remain usable on mobile.
- GitHub and evidence links open correctly.
- Main CTA scrolls/navigates to the verified demo.
- Keyboard focus states are visible.

## Integration
- If wallet connect exists, it must actually connect using supported GenLayer tooling.
- Failed transactions must show failure/error state rather than success UI.
- Live reads must have loading and error states.
- No secrets or private keys are bundled in frontend code.

## Build
- Clean install works.
- Production build completes.
- Responsive layouts work at common mobile and desktop sizes.
- Browser console has no material runtime errors.

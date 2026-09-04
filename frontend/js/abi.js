/**
 * MergeBounty — Intelligent Contract method metadata (display-only).
 *
 * This file is NOT a Solidity ABI. GenLayer Intelligent Contracts are called
 * through the GenLayerJS SDK by `functionName` + positional `args` (see
 * `js/genlayer.js`) — no ABI encoding happens on the client.
 *
 * What lives here is display-only metadata used by the dApp UI to render
 * one form per contract method: the method name, whether it is a read or a
 * write, whether it is payable, and the ordered list of parameter names
 * (all treated as plain Python/GenLayer values — strings, integers, etc.).
 *
 * Signatures match the deployed MergeBounty Intelligent Contract at
 * 0xe382bD55151f22Cd6477Ea613F21337C8d30b1EE on GenLayer Studionet.
 */

export const MERGEBOUNTY_ADDRESS = '0xe382bD55151f22Cd6477Ea613F21337C8d30b1EE';

/**
 * `kind`   : 'read' | 'write' | 'payable'
 * `params` : ordered list of { name, kind, hint }
 *            kind is a *display* hint, not a Solidity type:
 *              'string' | 'integer' | 'text' (multi-line string) | 'gen'
 */
export const MERGEBOUNTY_METHODS = [
  // ── writes ─────────────────────────────────────────────────────────────
  {
    name: 'create_bounty',
    kind: 'payable',
    group: 'sponsor',
    summary: 'Escrow GEN against immutable requirements and open a bounty.',
    params: [
      { name: 'bounty_id', kind: 'string' },
      { name: 'title', kind: 'string' },
      { name: 'repository_url', kind: 'string' },
      { name: 'requirements', kind: 'text' },
      { name: 'acceptance_window_seconds', kind: 'integer' },
      { name: 'submission_window_seconds', kind: 'integer' },
      { name: 'challenge_window_seconds', kind: 'integer' },
    ],
    // Value is not a normal argument — it is `msg.value` in GEN wei, sent as
    // GenLayerJS `value` on the writeContract call. UI renders it separately.
    valueField: { name: 'reward_gen', kind: 'gen' },
  },
  {
    name: 'accept_bounty',
    kind: 'write',
    group: 'developer',
    summary: 'Explicitly accept the governing terms hash.',
    params: [
      { name: 'bounty_id', kind: 'string' },
      { name: 'expected_terms_hash', kind: 'string' }, // STRING in the Python contract
    ],
  },
  {
    name: 'submit_work',
    kind: 'write',
    group: 'developer',
    summary: 'Submit an exact Git commit plus commit-bound SHA-256 evidence.',
    params: [
      { name: 'bounty_id', kind: 'string' },
      { name: 'commit_sha', kind: 'string' },     // STRING, not bytes32
      { name: 'evidence_url', kind: 'string' },
      { name: 'evidence_hash', kind: 'string' },  // STRING, not bytes32
      { name: 'submission_note', kind: 'text' },
    ],
  },
  {
    name: 'review_submission',
    kind: 'write',
    group: 'consensus',
    summary: 'Trigger a GenLayer consensus adjudication of the submission.',
    params: [{ name: 'bounty_id', kind: 'string' }],
  },
  {
    name: 'challenge_verdict',
    kind: 'write',
    group: 'developer',
    summary: 'Formally challenge a REJECTED / INSUFFICIENT_EVIDENCE verdict.',
    params: [
      { name: 'bounty_id', kind: 'string' },
      { name: 'challenge_note', kind: 'text' },
      { name: 'challenge_evidence_url', kind: 'string' },
      { name: 'challenge_evidence_hash', kind: 'string' },
    ],
  },
  {
    name: 'finalize_bounty',
    kind: 'write',
    group: 'sponsor',
    summary: 'Finalize the bounty and release escrow according to the verdict.',
    params: [{ name: 'bounty_id', kind: 'string' }],
  },
  {
    name: 'cancel_open_bounty',
    kind: 'write',
    group: 'sponsor',
    summary: 'Cancel a bounty that has not yet been accepted by a developer.',
    params: [{ name: 'bounty_id', kind: 'string' }],
  },
  {
    name: 'claim_timeout_refund',
    kind: 'write',
    group: 'sponsor',
    summary: 'Recover escrowed GEN if the bounty timed out with no settlement.',
    params: [{ name: 'bounty_id', kind: 'string' }],
  },

  // ── reads ──────────────────────────────────────────────────────────────
  {
    name: 'get_bounty',
    kind: 'read',
    group: 'read',
    summary: 'Full bounty record.',
    params: [{ name: 'bounty_id', kind: 'string' }],
  },
  {
    name: 'get_bounty_count',
    kind: 'read',
    group: 'read',
    summary: 'Total number of bounties ever created.',
    params: [],
  },
  {
    name: 'get_bounty_id',
    kind: 'read',
    group: 'read',
    summary: 'Look up a bounty_id by its creation index.',
    params: [{ name: 'index', kind: 'integer' }],
  },
  {
    name: 'get_adjudication',
    kind: 'read',
    group: 'read',
    summary: 'Read a single adjudication round for a bounty.',
    params: [
      { name: 'bounty_id', kind: 'string' },
      { name: 'round_no', kind: 'integer' },
    ],
  },
  {
    name: 'get_audit_count',
    kind: 'read',
    group: 'read',
    summary: 'Global append-only audit log length. Takes no arguments.',
    params: [],
  },
  {
    name: 'get_audit_entry',
    kind: 'read',
    group: 'read',
    summary: 'Read a single global audit entry by index.',
    params: [{ name: 'index', kind: 'integer' }],
  },
];

export function findMethod(name) {
  return MERGEBOUNTY_METHODS.find((m) => m.name === name) || null;
}

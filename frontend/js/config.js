/**
 * MergeBounty — canonical data & content configuration.
 *
 * SINGLE SOURCE OF TRUTH. All contract data, addresses, hashes, URLs and demo
 * values live in this file. Do not edit values here without updating the
 * canonical Website Builder Pack. No secrets or private keys belong here.
 */

export const CONFIG = {
  project: 'MergeBounty',
  tagline: 'Software bounties settled by evidence, not trust.',

  network: {
    name: 'GenLayer Studionet',
    status: 'Verified Demo',
  },

  contractAddress: '0xe382bD55151f22Cd6477Ea613F21337C8d30b1EE',

  demo: {
    bountyId: 'mergebounty-slugify-001',
    title: 'Deterministic Slugify Utility',
    rewardGen: '1',
    verdict: 'APPROVED',
    settlement: 'Finalized payout to the accepted developer',
    commitSha: '7ce2b69d8f5dd664c6450627fa696afd46f0bdd9',
    evidenceSha256:
      '44975f1aee71aa648481d55babbd43c6fa2a502337a831a0ea4a7a38c1c03ac7',
    adjudications: 1, // one full-consensus adjudication reached APPROVED
  },

  links: {
    repo: 'https://github.com/amzar1st/mergebounty-demo',
    commit:
      'https://github.com/amzar1st/mergebounty-demo/commit/7ce2b69d8f5dd664c6450627fa696afd46f0bdd9',
    evidence:
      'https://raw.githubusercontent.com/amzar1st/mergebounty-demo/7ce2b69d8f5dd664c6450627fa696afd46f0bdd9/EVIDENCE.md',
  },

  /** Canonical verified transaction lifecycle — order matters. */
  transactions: [
    {
      id: 'deployment',
      label: 'Deployment',
      hash: '0xd336d8f089efde838fd581f808061ae0258d9198e579d527558acfe409b573b5',
      description:
        'MergeBounty Intelligent Contract deployed to GenLayer Studionet.',
    },
    {
      id: 'preflight',
      label: 'Evidence preflight',
      hash: '0xab9a5dcb01aa535aa35e63d2afd468220ce34871b239ebd782c83612ef0db615',
      description:
        'Preflight validation of the evidence pipeline before any funds move.',
    },
    {
      id: 'create',
      label: 'Create + fund bounty',
      hash: '0xee4dbc5888bc6add1ae16e4e4d27afe70e40e892297b24e7c745259515fc22ab',
      description:
        'Bounty mergebounty-slugify-001 created; 1 GEN escrowed against immutable requirements.',
    },
    {
      id: 'accept',
      label: 'Developer accepts immutable terms',
      hash: '0x9ed93a119bcf680a147cf67c2f234ba39b90c7c13381ecf39bf1ecef20dc472b',
      description:
        'Developer explicitly accepts the governing terms hash — no silent term changes.',
    },
    {
      id: 'submit',
      label: 'Commit-bound work submission',
      hash: '0xb4bb16220dd37512727ccabc1f966ea8d60d765a7da3c11fc6d13c618490e44b',
      description:
        'Exact Git commit 7ce2b69… plus SHA-256 commit-bound public evidence submitted.',
    },
    {
      id: 'review',
      label: 'Full-consensus APPROVED review',
      hash: '0x4cf42ba498c4a03a3526c71231395b2c5bb60df6b3bc7677d4c6676f83b7ddca',
      description:
        'GenLayer validators independently adjudicate the evidence; consensus verdict: APPROVED.',
    },
    {
      id: 'finalize',
      label: 'Finalize + payout',
      hash: '0x823819926a39da43d56c48592ded003eba1cdf499e93b63edd459034ffbbc864',
      description:
        'Settlement finalized — escrow releases 1 GEN to the accepted developer.',
    },
  ],
};

export const LIFECYCLE = [
  {
    step: 'Fund Bounty',
    body: 'A sponsor escrows GEN on-chain against immutable software requirements and a governing terms hash.',
  },
  {
    step: 'Accept Immutable Terms',
    body: 'A developer explicitly accepts the exact terms hash — the rules they will be judged by cannot change afterwards.',
  },
  {
    step: 'Submit Exact Commit',
    body: 'Work is submitted as an exact Git commit plus SHA-256 commit-bound public evidence — a stable review target.',
  },
  {
    step: 'Consensus Review',
    body: 'GenLayer validators independently adjudicate whether the evidence demonstrates the requirements are met.',
  },
  {
    step: 'Challenge if needed',
    body: 'A bounded challenge window guards the verdict — disputes are explicit and time-limited, never open-ended.',
  },
  {
    step: 'Settle',
    body: 'Escrow settles on the consensus verdict: payout on APPROVED, with timeout/refund protection if review never concludes.',
  },
];

export const ARCHITECTURE = [
  {
    title: 'Immutable requirements',
    body: 'Requirements are frozen at funding time. The sponsor cannot move the goalposts after work begins.',
    icon: 'lock',
  },
  {
    title: 'Terms hashing',
    body: 'The governing terms are reduced to a single hash recorded on-chain — the canonical rulebook for adjudication.',
    icon: 'hash',
  },
  {
    title: 'Explicit developer acceptance',
    body: 'Developers transact to accept the exact terms hash, proving they were bound to these rules before submitting.',
    icon: 'pen',
  },
  {
    title: 'Exact Git commit binding',
    body: 'Submissions reference one exact commit SHA — not a branch — so the reviewed artifact can never silently change.',
    icon: 'git',
  },
  {
    title: 'SHA-256 evidence integrity',
    body: 'Commit-bound public evidence is pinned by a SHA-256 digest. Any alteration is immediately detectable.',
    icon: 'fingerprint',
  },
  {
    title: 'Independent validator review',
    body: 'GenLayer validators — not the sponsor — independently adjudicate whether the evidence satisfies the requirements.',
    icon: 'nodes',
  },
  {
    title: 'Settlement guards',
    body: 'Escrow can only move through explicit consensus-gated transitions; no party can unilaterally release or seize funds.',
    icon: 'shield',
  },
  {
    title: 'Bounded challenge',
    body: 'A defined challenge window lets parties dispute a verdict — bounded in time, never an indefinite veto.',
    icon: 'flag',
  },
  {
    title: 'Timeout / refund protection',
    body: 'If adjudication never concludes, escrowed GEN is not stuck: timeout paths return funds to the sponsor.',
    icon: 'clock',
  },
  {
    title: 'Append-only audit history',
    body: 'Every state transition is recorded append-only on-chain, producing a complete, non-rewritable audit trail.',
    icon: 'list',
  },
  {
    title: 'Escrow settlement',
    body: 'GEN settles directly from escrow on the final verdict — payout to the developer on APPROVED, refund on expiry.',
    icon: 'coin',
  },
];

export const TRUST_MODEL = [
  {
    claim: 'Sponsor cannot move the goalposts',
    why: 'Requirements and terms hash are immutable from the moment the bounty is funded.',
  },
  {
    claim: 'No dispute about what was submitted',
    why: 'An exact commit SHA plus a SHA-256 evidence digest pin the reviewed artifact precisely.',
  },
  {
    claim: 'Verdict is not the sponsor’s opinion',
    why: 'Independent GenLayer validators reach consensus on the evidence — the sponsor cannot simply refuse to pay.',
  },
  {
    claim: 'Disputes are bounded, not endless',
    why: 'A time-limited challenge window and timeout/refund paths guarantee eventual settlement in every case.',
  },
  {
    claim: 'Everything is auditable after the fact',
    why: 'Append-only on-chain history preserves the full lifecycle, as demonstrated by the seven-transaction proof trail.',
  },
];

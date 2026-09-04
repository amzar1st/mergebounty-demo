import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const paths = {
  contract: resolve(root, 'contract/mergebounty.py'),
  html: resolve(root, 'frontend/index.html'),
  config: resolve(root, 'frontend/js/config.js'),
  network: resolve(root, 'frontend/js/network.js'),
  wallet: resolve(root, 'frontend/js/wallet.js'),
  genlayer: resolve(root, 'frontend/js/genlayer.js'),
  dapp: resolve(root, 'frontend/js/dapp.js'),
};

for (const [name, path] of Object.entries(paths)) {
  const info = await stat(path);
  if (!info.isFile()) throw new Error(`${name} missing: ${path}`);
}

const [contract, html, config, network, wallet, genlayer, dapp] = await Promise.all(
  Object.values(paths).map((p) => readFile(p, 'utf8'))
);

const checks = [
  ['canonical contract address in frontend', config.includes('0xe382bD55151f22Cd6477Ea613F21337C8d30b1EE')],
  ['verified demo bounty id', config.includes('mergebounty-slugify-001')],
  ['reviewed commit pinned', config.includes('7ce2b69d8f5dd664c6450627fa696afd46f0bdd9')],
  ['evidence SHA-256 pinned', config.includes('44975f1aee71aa648481d55babbd43c6fa2a502337a831a0ea4a7a38c1c03ac7')],
  ['Studionet chain id 61999', network.includes('61999') && network.includes('0xf22f')],
  ['Studionet RPC configured', network.includes('https://studio.genlayer.com/api')],
  ['MetaMask provider used', wallet.includes('window.ethereum') && genlayer.includes('provider: window.ethereum')],
  ['GenLayerJS fee estimation', genlayer.includes('estimateTransactionFeesForWrite')],
  ['GenLayerJS writeContract', genlayer.includes('writeContract')],
  ['waitForFinalization used', genlayer.includes('waitForFinalization')],
  ['isSuccessful used', genlayer.includes('isSuccessful')],
  ['Live dApp section exists', html.includes('id="live-dapp"')],
  ['challenge_verdict UI exists', dapp.includes('challenge_verdict')],
  ['contract has zero-value evidence probe', contract.includes('def probe_evidence')],
  ['contract avoids unsupported response.status_code', !contract.includes('response.status_code')],
  ['contract has create_bounty', contract.includes('def create_bounty')],
  ['contract has review_submission', contract.includes('def review_submission')],
  ['contract has finalize_bounty', contract.includes('def finalize_bounty')],
];

let failed = 0;
for (const [label, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`);
  if (!ok) failed++;
}
if (failed) {
  console.error(`\n${failed} verification check(s) failed.`);
  process.exit(1);
}
console.log(`\nAll ${checks.length} MergeBounty source checks passed.`);

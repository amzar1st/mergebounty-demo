/**
 * MergeBounty — GenLayer client layer.
 *
 * Wraps the official `genlayer-js` SDK to talk to the deployed MergeBounty
 * Intelligent Contract at 0xe382bD55151f22Cd6477Ea613F21337C8d30b1EE on
 * GenLayer Studionet.
 *
 * Two clients are built:
 *
 *   • WALLET client (per connected address) — created with the actual
 *     EIP-1193 provider so `client.writeContract(...)` prompts MetaMask.
 *     After creation, `client.connect('studionet')` is invoked to align
 *     the wallet with Studionet (adds + switches the chain if needed).
 *   • READ client (account-free) — for public contract reads before the
 *     wallet is connected. Uses the Studionet RPC directly.
 *
 * Writes go through the fee-estimated path:
 *   estimateTransactionFeesForWrite → writeContract({..., fees})
 *     → waitForFinalization → isSuccessful()
 *
 * No ethers, no Solidity ABI, no guessed types. Args are plain GenLayer
 * values (strings / integers). Value (`msg.value`) is passed separately.
 */

import { MERGEBOUNTY_ADDRESS } from './abi.js';
import { GENLAYER_STUDIONET } from './network.js';

// v2.0.0-rc.1 exposes estimateTransactionFeesForWrite / waitForFinalization
// / isSuccessful, the exact primitives this flow requires. v1.1.8 does not.
const GENLAYER_JS_VERSION = '2.0.0-rc.1';
const GENLAYER_JS_CDN = `https://esm.sh/genlayer-js@${GENLAYER_JS_VERSION}`;
const GENLAYER_JS_CHAINS_CDN = `https://esm.sh/genlayer-js@${GENLAYER_JS_VERSION}/chains`;

let _sdkPromise = null;
async function loadSdk() {
  if (!_sdkPromise) {
    _sdkPromise = (async () => {
      const [core, chains] = await Promise.all([
        import(/* @vite-ignore */ GENLAYER_JS_CDN),
        import(/* @vite-ignore */ GENLAYER_JS_CHAINS_CDN),
      ]);
      if (!core.createClient) throw new Error('genlayer-js did not export createClient');
      if (!core.isSuccessful) throw new Error('genlayer-js did not export isSuccessful');
      if (!chains.studionet) throw new Error('genlayer-js/chains did not export studionet');

      // Runtime cross-check: SDK's studionet must match the canonical values
      // declared in network.js. If a forked / stale pin ever drifts, the UI
      // shows a real error instead of silently talking to the wrong chain.
      if (Number(chains.studionet.id) !== GENLAYER_STUDIONET.chainIdDec) {
        throw new Error(
          `genlayer-js studionet.id=${chains.studionet.id} does not match ` +
            `canonical chainIdDec=${GENLAYER_STUDIONET.chainIdDec}`
        );
      }
      return { core, chains };
    })().catch((err) => {
      _sdkPromise = null;
      throw new Error(
        `Could not load genlayer-js@${GENLAYER_JS_VERSION} from ${GENLAYER_JS_CDN}. ` +
          (err.message || String(err))
      );
    });
  }
  return _sdkPromise;
}

/* ─────────────────────────────────────────────────────────────────────────
 * Client construction
 * ────────────────────────────────────────────────────────────────────── */

/** WALLET clients are cached per-address; refetched when the account changes. */
const _walletClientCache = new Map(); // address → Promise<client>

export async function getGenLayerClient(walletAddress) {
  if (!walletAddress) throw new Error('Wallet must be connected before calling the contract.');
  if (!window.ethereum) throw new Error('MetaMask is not installed.');
  const key = walletAddress.toLowerCase();
  if (_walletClientCache.has(key)) return _walletClientCache.get(key);

  const p = (async () => {
    const { core, chains } = await loadSdk();
    // Official browser-wallet client construction — the EIP-1193 provider is
    // wired explicitly so writeContract / eth_sendTransaction / signing all
    // go through MetaMask.
    const client = core.createClient({
      chain: chains.studionet,
      account: walletAddress,
      provider: window.ethereum,
    });

    // Align the wallet with Studionet (adds + switches the chain if needed).
    // The Snap-request step inside .connect() may fail on non-Flask wallets;
    // that's fine — the chain-alignment side effect is what matters.
    try {
      await client.connect('studionet');
    } catch (err) {
      // Surface only unexpected failures. A rejected snap install is not fatal.
      if (err && err.code === 4001) {
        // user rejected — the earlier wallet_switchEthereumChain already ran
      } else {
        console.warn(
          "[genlayer] client.connect('studionet') reported an issue:",
          err && (err.message || err)
        );
      }
    }
    return client;
  })();

  _walletClientCache.set(key, p);
  return p;
}

/** Public read client (no wallet, no account) — Studionet RPC only. */
let _readClientPromise = null;
export async function getGenLayerReadClient() {
  if (!_readClientPromise) {
    _readClientPromise = (async () => {
      const { core, chains } = await loadSdk();
      return core.createClient({ chain: chains.studionet });
    })();
  }
  return _readClientPromise;
}

/** Called by the wallet layer whenever the account or chain changes. */
export function invalidateClientCache() {
  _walletClientCache.clear();
}

/* ─────────────────────────────────────────────────────────────────────────
 * READS
 * ────────────────────────────────────────────────────────────────────── */

export async function readContractMethod(
  { address = MERGEBOUNTY_ADDRESS, functionName, args = [] },
  { account } = {}
) {
  const client = account ? await getGenLayerClient(account) : await getGenLayerReadClient();
  return await client.readContract({ address, functionName, args });
}

/* ─────────────────────────────────────────────────────────────────────────
 * WRITES — real MetaMask signature + real GenLayer fee estimation +
 * real finalization + real success check via isSuccessful().
 * ────────────────────────────────────────────────────────────────────── */

/**
 * @param {object}   spec
 * @param {string}   spec.functionName
 * @param {any[]}    spec.args
 * @param {bigint}  [spec.value]        msg.value in wei (only for payable)
 * @param {string}  [spec.address]      overrides MERGEBOUNTY_ADDRESS
 * @param {object}   ctx
 * @param {string}   ctx.account
 * @param {(stage: {kind:string,message:string,txHash?:string,estimate?:any}) => void} [ctx.onStage]
 * @returns {Promise<{txHash: string, transaction: any}>}
 */
export async function writeContractMethod(spec, ctx) {
  const { account, onStage } = ctx;
  if (!account) throw new Error('Wallet must be connected before submitting a write.');
  const { core } = await loadSdk();
  const client = await getGenLayerClient(account);

  // 1. Build the exact call object used for BOTH fee estimation and submit.
  const call = {
    address: spec.address || MERGEBOUNTY_ADDRESS,
    functionName: spec.functionName,
    args: spec.args || [],
  };
  if (spec.value !== undefined && spec.value !== null) {
    call.value = spec.value; // BigInt in wei — separate from GenLayer fees
  }

  // 2. Estimate GenLayer fees. Any failure here surfaces before the wallet
  //    ever sees a signature request.
  onStage?.({ kind: 'estimating', message: 'Estimating GenLayer fees…' });
  let estimate;
  try {
    estimate = await client.estimateTransactionFeesForWrite(call);
  } catch (err) {
    throw new Error(
      `Fee estimation failed: ${err && (err.shortMessage || err.message || String(err))}`
    );
  }
  onStage?.({ kind: 'estimated', message: 'Fees estimated.', estimate });

  // 3. Submit — real MetaMask popup. Reward `value` and GenLayer `fees` are
  //    two distinct fields on the write call.
  onStage?.({ kind: 'signing', message: 'Waiting for MetaMask…' });
  const txHash = await client.writeContract({
    ...call,
    fees: {
      distribution: estimate.distribution,
      feeValue: estimate.feeValue,
    },
  });
  onStage?.({
    kind: 'submitted',
    message: 'Transaction submitted. GenLayer consensus processing…',
    txHash,
  });

  // 4. Wait for full GenLayer finalization.
  onStage?.({
    kind: 'finalizing',
    message: 'Waiting for finalization…',
    txHash,
  });
  const transaction = await client.waitForFinalization({
    hash: txHash,
    interval: 3000,
    retries: 60,
  });

  // 5. Success is authoritatively determined by the SDK helper — do NOT
  //    guess execution-result-name semantics.
  if (!core.isSuccessful(transaction)) {
    const statusName = transaction?.statusName ?? transaction?.status_name ?? 'unknown';
    const execName =
      transaction?.txExecutionResultName ?? transaction?.tx_execution_result_name ?? 'unknown';
    throw new Error(
      `Transaction did not succeed: ${statusName} / ${execName}`
    );
  }

  return { txHash, transaction };
}

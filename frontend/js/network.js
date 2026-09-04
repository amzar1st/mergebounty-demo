/**
 * GenLayer Studionet — canonical network configuration.
 *
 * Used by:
 *   • The wallet layer, to detect the correct chain and to build
 *     `wallet_addEthereumChain` params if MetaMask has not seen Studionet.
 *   • The GenLayer client layer, purely for display — the SDK's `studionet`
 *     chain (from `genlayer-js/chains`) is the authoritative source of the
 *     chain id, RPC and consensus contract addresses used at runtime.
 *
 * These values are the verified public Studionet parameters and match the
 * `studionet` object exported by `genlayer-js@1.x`.
 */

export const GENLAYER_STUDIONET = {
  chainName: 'GenLayer Studionet',

  // 61999 decimal / 0xf22f hex
  chainIdDec: 61999,
  chainIdHex: '0xf22f',

  rpcUrls: ['https://studio.genlayer.com/api'],
  blockExplorerUrls: ['https://explorer-studio.genlayer.com'],

  nativeCurrency: {
    name: 'GenLayer',
    symbol: 'GEN',
    decimals: 18,
  },
};

/** Build the exact params object MetaMask expects for `wallet_addEthereumChain`. */
export function toAddChainParams() {
  const n = GENLAYER_STUDIONET;
  return {
    chainId: n.chainIdHex,
    chainName: n.chainName,
    nativeCurrency: { ...n.nativeCurrency },
    rpcUrls: [...n.rpcUrls],
    blockExplorerUrls: [...n.blockExplorerUrls],
  };
}

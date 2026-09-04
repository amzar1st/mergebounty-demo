/**
 * MergeBounty — MetaMask wallet provider.
 *
 * Responsibilities:
 *  - Detect `window.ethereum` (EIP-1193).
 *  - Request accounts via `eth_requestAccounts`.
 *  - Track chainId + accounts via provider events.
 *  - Switch / add the GenLayer Studionet chain via
 *    `wallet_switchEthereumChain` / `wallet_addEthereumChain`.
 *  - Read the connected account's native-currency balance.
 *  - Emit a single `'change'` event with the full public state.
 *
 * This module does NOT talk to the MergeBounty Intelligent Contract; that
 * happens in `js/genlayer.js` via the official GenLayerJS SDK. This module
 * only handles the browser wallet session.
 */

import { GENLAYER_STUDIONET, toAddChainParams } from './network.js';

const LS_KEY = 'mergebounty:wallet:connected';

class WalletProvider extends EventTarget {
  constructor() {
    super();
    this.state = {
      hasProvider: false,
      connected: false,
      account: null,       // lowercase 0x…
      chainIdDec: null,
      chainIdHex: null,
      onGenLayer: false,   // chain matches GenLayer Studionet
      balanceWei: null,    // native-currency balance as hex string
    };
    this._eth = null;
    this._init();
  }

  _init() {
    const eth = window.ethereum;
    if (!eth) return;
    this._eth = eth;
    this.state.hasProvider = true;

    eth.on?.('accountsChanged', (accounts) => this._onAccounts(accounts));
    eth.on?.('chainChanged', (chainIdHex) => this._onChain(chainIdHex));
    eth.on?.('disconnect', () => this._onDisconnect());

    if (localStorage.getItem(LS_KEY) === '1') {
      this._silentReconnect();
    } else {
      this._readChain().catch(() => {});
    }
  }

  async _silentReconnect() {
    try {
      const accounts = await this._eth.request({ method: 'eth_accounts' });
      if (Array.isArray(accounts) && accounts.length > 0) {
        this.state.connected = true;
        await this._onAccounts(accounts);
      } else {
        localStorage.removeItem(LS_KEY);
        await this._readChain();
        this._emit();
      }
    } catch {
      localStorage.removeItem(LS_KEY);
    }
  }

  async _readChain() {
    if (!this._eth) return;
    const chainIdHex = await this._eth.request({ method: 'eth_chainId' });
    this._applyChain(chainIdHex);
  }

  _applyChain(chainIdHex) {
    this.state.chainIdHex = chainIdHex || null;
    this.state.chainIdDec = chainIdHex ? parseInt(chainIdHex, 16) : null;
    this.state.onGenLayer =
      typeof chainIdHex === 'string' &&
      chainIdHex.toLowerCase() === GENLAYER_STUDIONET.chainIdHex.toLowerCase();
  }

  async _onAccounts(accounts) {
    if (!accounts || accounts.length === 0) {
      this.state.connected = false;
      this.state.account = null;
      this.state.balanceWei = null;
      localStorage.removeItem(LS_KEY);
    } else {
      this.state.account = accounts[0].toLowerCase();
      this.state.connected = true;
      localStorage.setItem(LS_KEY, '1');
      await this._readChain().catch(() => {});
      await this.refreshBalance().catch(() => {});
    }
    this._emit();
  }

  _onChain(chainIdHex) {
    this._applyChain(chainIdHex);
    this.state.balanceWei = null;
    this._emit();
    if (this.state.account) this.refreshBalance().catch(() => {});
  }

  _onDisconnect() {
    this.state.balanceWei = null;
    this._emit();
  }

  _emit() {
    this.dispatchEvent(new CustomEvent('change', { detail: { ...this.state } }));
  }

  // ── Public API ────────────────────────────────────────────────────────

  async connect() {
    if (!this._eth) throw new Error('MetaMask is not installed.');
    const accounts = await this._eth.request({ method: 'eth_requestAccounts' });
    if (!accounts || accounts.length === 0) {
      throw new Error('No account returned by MetaMask.');
    }
    await this._onAccounts(accounts);
  }

  disconnect() {
    this.state.connected = false;
    this.state.account = null;
    this.state.balanceWei = null;
    localStorage.removeItem(LS_KEY);
    this._emit();
  }

  /** Switch MetaMask to GenLayer Studionet (add first if unknown). */
  async switchToGenLayer() {
    if (!this._eth) throw new Error('MetaMask is not installed.');
    const targetHex = GENLAYER_STUDIONET.chainIdHex;
    try {
      await this._eth.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: targetHex }],
      });
    } catch (err) {
      // 4902 = unrecognized chain
      if (err && (err.code === 4902 || err.code === -32603)) {
        await this._eth.request({
          method: 'wallet_addEthereumChain',
          params: [toAddChainParams()],
        });
      } else {
        throw err;
      }
    }
  }

  async refreshBalance() {
    if (!this._eth || !this.state.account) {
      this.state.balanceWei = null;
      return;
    }
    try {
      const wei = await this._eth.request({
        method: 'eth_getBalance',
        params: [this.state.account, 'latest'],
      });
      this.state.balanceWei = wei;
    } catch {
      this.state.balanceWei = null;
    }
    this._emit();
  }

  request(args) {
    if (!this._eth) throw new Error('MetaMask is not installed.');
    return this._eth.request(args);
  }

  get snapshot() {
    return { ...this.state };
  }
}

/* ── formatting helpers ───────────────────────────────────────────────── */

export function shortAddress(addr) {
  if (!addr || typeof addr !== 'string' || addr.length < 10) return '';
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function formatBalance(weiHex, decimals = 18, maxFractionDigits = 4) {
  if (weiHex === null || weiHex === undefined) return '—';
  let wei;
  try {
    wei = typeof weiHex === 'bigint' ? weiHex : BigInt(weiHex);
  } catch {
    return '—';
  }
  const base = 10n ** BigInt(decimals);
  const whole = wei / base;
  const frac = wei % base;
  if (frac === 0n) return whole.toString();
  const fracStr = frac.toString().padStart(decimals, '0').slice(0, maxFractionDigits);
  const trimmed = fracStr.replace(/0+$/, '');
  return trimmed ? `${whole}.${trimmed}` : whole.toString();
}

/** Parse a decimal GEN string ("1", "0.5") into wei (BigInt). */
export function parseGenToWei(value, decimals = 18) {
  const v = String(value ?? '').trim();
  if (!/^\d+(\.\d+)?$/.test(v)) throw new Error('Reward must be a decimal number (e.g. 1 or 0.5).');
  const [whole, fracRaw = ''] = v.split('.');
  const frac = (fracRaw + '0'.repeat(decimals)).slice(0, decimals);
  return BigInt(whole || '0') * 10n ** BigInt(decimals) + BigInt(frac || '0');
}

export const wallet = new WalletProvider();

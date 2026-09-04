/**
 * MergeBounty — Live dApp UI.
 *
 * Renders the wallet button in the nav, the wallet dropdown panel, and the
 * "Use MergeBounty" section (tabs: Sponsor / Developer / Consensus / Read).
 *
 * Every write goes through the GenLayerJS SDK:
 *   client.writeContract(...) → real MetaMask signature
 *   client.waitForTransactionReceipt({status:'ACCEPTED'})  → real consensus
 *   client.waitForTransactionReceipt({status:'FINALIZED'}) → real finalization
 * Every read goes through client.readContract(...). No state is fabricated;
 * success is only reported after the receipt's execution result confirms it.
 */

import { wallet, shortAddress, formatBalance, parseGenToWei } from './wallet.js';
import { GENLAYER_STUDIONET } from './network.js';
import { MERGEBOUNTY_ADDRESS, MERGEBOUNTY_METHODS, findMethod } from './abi.js';
import {
  readContractMethod,
  writeContractMethod,
  invalidateClientCache,
} from './genlayer.js';

const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );

const COPY_ICON = `<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M5 2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h1V2Zm8 0H7v6h6V2ZM5 4H3v7h7v-1H7a2 2 0 0 1-2-2V4Z"/></svg>`;

/* ─────────────────────────────────────────────────────────────────────────
 * WALLET BUTTON (in nav) + WALLET PANEL (dropdown)
 * ────────────────────────────────────────────────────────────────────── */

export function renderWalletButton() {
  const slot = $('#wallet-slot');
  if (!slot) return;
  const s = wallet.snapshot;

  if (!s.hasProvider) {
    slot.innerHTML = `
      <a class="wl-btn wl-btn--install"
         href="https://metamask.io/download/"
         target="_blank" rel="noopener noreferrer"
         title="MetaMask is required to interact with MergeBounty">
        <span class="wl-btn__dot wl-btn__dot--off" aria-hidden="true"></span>
        <span class="wl-btn__label">Install MetaMask</span>
      </a>`;
    return;
  }

  if (!s.connected) {
    slot.innerHTML = `
      <button class="wl-btn wl-btn--connect" type="button" id="wl-connect">
        <span class="wl-btn__dot wl-btn__dot--off" aria-hidden="true"></span>
        <span class="wl-btn__label">Connect Wallet</span>
      </button>`;
    $('#wl-connect').addEventListener('click', handleConnectClick);
    return;
  }

  const dotClass = s.onGenLayer ? 'wl-btn__dot--ok' : 'wl-btn__dot--warn';
  const netLabel = s.onGenLayer ? 'Studionet' : 'Wrong network';

  slot.innerHTML = `
    <button class="wl-btn wl-btn--connected" type="button" id="wl-open">
      <span class="wl-btn__dot ${dotClass}" aria-hidden="true"></span>
      <span class="wl-btn__net">${esc(netLabel)}</span>
      <span class="wl-btn__addr mono">${esc(shortAddress(s.account))}</span>
    </button>
    <div class="wl-panel" id="wl-panel" hidden>
      ${renderWalletPanel(s)}
    </div>`;
  $('#wl-open').addEventListener('click', toggleWalletPanel);
  wireWalletPanel();
}

function renderWalletPanel(s) {
  const balance =
    s.balanceWei !== null
      ? `${formatBalance(s.balanceWei, GENLAYER_STUDIONET.nativeCurrency.decimals)} ${esc(
          GENLAYER_STUDIONET.nativeCurrency.symbol
        )}`
      : '—';

  const networkRow = s.onGenLayer
    ? `<div class="wl-panel__row wl-panel__row--ok">
         <span>Network</span>
         <span class="mono">${esc(GENLAYER_STUDIONET.chainName)}</span>
       </div>`
    : `<div class="wl-panel__row wl-panel__row--warn">
         <span>Network</span>
         <span class="mono">${esc(
           s.chainIdDec !== null ? `chain ${s.chainIdDec}` : 'unknown'
         )}</span>
       </div>
       <button class="wl-panel__action" type="button" id="wl-switch">
         Switch to GenLayer Studionet
       </button>`;

  return `
    <div class="wl-panel__head">
      <div class="wl-panel__addrfull mono" title="${esc(s.account)}">${esc(s.account)}</div>
      <button class="copybtn" type="button" data-copy="${esc(s.account)}" aria-label="Copy address">
        ${COPY_ICON}<span>Copy</span>
      </button>
    </div>
    ${networkRow}
    <div class="wl-panel__row">
      <span>Balance</span>
      <span class="mono">${balance}</span>
    </div>
    <div class="wl-panel__row">
      <span>Contract</span>
      <span class="mono wl-panel__contract" title="${esc(MERGEBOUNTY_ADDRESS)}">${esc(
    shortAddress(MERGEBOUNTY_ADDRESS)
  )}</span>
    </div>
    <div class="wl-panel__actions">
      <button class="wl-panel__action wl-panel__action--ghost" type="button" id="wl-refresh">Refresh balance</button>
      <button class="wl-panel__action wl-panel__action--danger" type="button" id="wl-disconnect">Disconnect</button>
    </div>`;
}

function toggleWalletPanel(e) {
  e?.stopPropagation();
  const p = $('#wl-panel');
  if (!p) return;
  p.hidden = !p.hidden;
}

function wireWalletPanel() {
  const p = $('#wl-panel');
  if (!p) return;
  p.addEventListener('click', (e) => e.stopPropagation());
  $('#wl-switch')?.addEventListener('click', async () => {
    try {
      await wallet.switchToGenLayer();
    } catch (err) {
      alert(err.message || 'Could not switch network.');
    }
  });
  $('#wl-refresh')?.addEventListener('click', () => wallet.refreshBalance());
  $('#wl-disconnect')?.addEventListener('click', () => {
    wallet.disconnect();
    invalidateClientCache();
    $('#wl-panel').hidden = true;
  });
  document.addEventListener('click', () => (p.hidden = true), { once: true });
}

async function handleConnectClick() {
  try {
    await wallet.connect();
  } catch (err) {
    if (err && (err.code === 4001 || /rejected/i.test(err.message || ''))) return;
    alert(err.message || 'Could not connect to MetaMask.');
  }
}

/* ─────────────────────────────────────────────────────────────────────────
 * LIVE DAPP SECTION — tabs, forms, tx status, read results
 * ────────────────────────────────────────────────────────────────────── */

const TABS = [
  {
    id: 'sponsor',
    label: 'Sponsor',
    methods: ['create_bounty', 'finalize_bounty', 'cancel_open_bounty', 'claim_timeout_refund'],
  },
  {
    id: 'developer',
    label: 'Developer',
    methods: ['accept_bounty', 'submit_work', 'challenge_verdict'],
  },
  { id: 'consensus', label: 'Consensus', methods: ['review_submission'] },
  {
    id: 'read',
    label: 'Read',
    methods: [
      'get_bounty',
      'get_bounty_count',
      'get_bounty_id',
      'get_adjudication',
      'get_audit_count',
      'get_audit_entry',
    ],
  },
];

const FIELD_HINTS = {
  bounty_id: 'e.g. mergebounty-slugify-001',
  title: 'Short descriptive title',
  repository_url: 'https://github.com/…',
  requirements: 'Full requirements text (becomes the immutable brief)',
  acceptance_window_seconds: 'Seconds developers have to accept',
  submission_window_seconds: 'Seconds accepted developer has to submit',
  challenge_window_seconds: 'Seconds after the verdict to challenge',
  expected_terms_hash: 'The governing terms hash as returned by the contract',
  commit_sha: 'Full Git commit SHA (as a string)',
  evidence_url: 'Pinned raw URL of EVIDENCE.md',
  evidence_hash: 'SHA-256 of the pinned evidence (as a string)',
  submission_note: 'Optional note for reviewers',
  challenge_note: 'Why the verdict should be re-adjudicated',
  challenge_evidence_url: 'Additional evidence URL supporting the challenge',
  challenge_evidence_hash: 'SHA-256 of the additional evidence (as a string)',
  index: 'Zero-based index',
  round_no: 'Adjudication round number (starts at 0)',
  reward_gen: `Amount of ${GENLAYER_STUDIONET.nativeCurrency.symbol} to escrow. Decimals allowed.`,
};

let activeTab = 'sponsor';

/**
 * We keep a shallow map of last read results / open statuses per method so
 * a wallet event that triggers a full re-render doesn't wipe them.
 */
const uiState = new Map(); // methodName → { status, result, formValues }

export function renderDappSection() {
  const root = $('#live-dapp-body');
  if (!root) return;
  const s = wallet.snapshot;

  root.innerHTML = `
    <div class="dapp reveal">
      ${renderNetworkBanner(s)}
      <div class="dapp__contract">
        <div class="hashfield">
          <div class="hashfield__label">MergeBounty contract · GenLayer Studionet · chain ${GENLAYER_STUDIONET.chainIdDec}</div>
          <div class="hashfield__row mono">
            <span class="hashfield__value">${esc(MERGEBOUNTY_ADDRESS)}</span>
            <button class="copybtn" type="button" data-copy="${esc(MERGEBOUNTY_ADDRESS)}" aria-label="Copy contract address">
              ${COPY_ICON}<span>Copy</span>
            </button>
          </div>
        </div>
      </div>
      <div class="dapp__tabs" role="tablist">
        ${TABS.map(
          (t) => `
          <button type="button" role="tab"
                  class="dapp__tab ${t.id === activeTab ? 'is-active' : ''}"
                  aria-selected="${t.id === activeTab}"
                  data-tab="${t.id}">${esc(t.label)}</button>`
        ).join('')}
      </div>
      <div class="dapp__panels">
        ${TABS.map((t) => renderTabPanel(t)).join('')}
      </div>
    </div>`;

  root.querySelectorAll('.dapp__tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeTab = btn.dataset.tab;
      renderDappSection();
    });
  });

  MERGEBOUNTY_METHODS.forEach((m) => {
    const form = root.querySelector(`form[data-method="${m.name}"]`);
    if (!form) return;
    // Restore prior form values across re-renders.
    const prior = uiState.get(m.name);
    if (prior?.formValues) {
      Object.entries(prior.formValues).forEach(([name, value]) => {
        const el = form.elements[name];
        if (el) el.value = value;
      });
    }
    if (prior?.status) {
      writeStatus(form, prior.status.kind, prior.status.message, prior.status.spin, prior.status.txHash);
    }
    if (prior?.result) {
      const resultEl = form.querySelector('.dapp-result');
      resultEl.hidden = false;
      resultEl.innerHTML = prior.result;
    }
    form.addEventListener('submit', (e) => handleFormSubmit(e, m));
  });
}

function renderNetworkBanner(s) {
  if (!s.hasProvider) {
    return `<div class="dapp__banner dapp__banner--warn">
      <strong>MetaMask is required to interact with MergeBounty.</strong>
      Install it from <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer">metamask.io/download</a>,
      then reload this page.
    </div>`;
  }
  if (!s.connected) {
    return `<div class="dapp__banner">
      Connect your wallet using the button in the top-right to submit or
      read contract state. Reads work without connecting, but require your
      browser to reach the Studionet RPC.
    </div>`;
  }
  if (!s.onGenLayer) {
    return `<div class="dapp__banner dapp__banner--warn">
      <strong>Wrong network.</strong> Your wallet is on
      <span class="mono">chain ${s.chainIdDec ?? '?'}</span> — MergeBounty
      lives on GenLayer Studionet (chain ${GENLAYER_STUDIONET.chainIdDec}).
      <button class="dapp__inline-action" type="button" id="dapp-switch-inline">
        Switch to GenLayer Studionet
      </button>
    </div>`;
  }
  return '';
}

function renderTabPanel(tab) {
  return `
    <div class="dapp__panel ${tab.id === activeTab ? 'is-active' : ''}"
         id="dapp-panel-${tab.id}" role="tabpanel" ${
    tab.id === activeTab ? '' : 'hidden'
  }>
      <div class="dapp__forms">
        ${tab.methods.map(renderMethodCard).join('')}
      </div>
    </div>`;
}

function renderMethodCard(methodName) {
  const method = findMethod(methodName);
  if (!method) return '';
  const isPayable = method.kind === 'payable';
  const isRead = method.kind === 'read';

  const fields = method.params.map((p) => renderField(methodName, p)).join('');

  const rewardField = isPayable && method.valueField
    ? `
    <label class="dapp-field">
      <span class="dapp-field__label">
        ${esc(method.valueField.name)}
        <span class="dapp-field__req">payable · ${esc(GENLAYER_STUDIONET.nativeCurrency.symbol)}</span>
      </span>
      <input type="text" inputmode="decimal" class="dapp-field__input mono"
             name="__value" placeholder="1" required />
      <span class="dapp-field__hint">${esc(FIELD_HINTS[method.valueField.name] || '')}</span>
    </label>`
    : '';

  const submitLabel = isRead
    ? 'Call (read)'
    : isPayable
    ? 'Sign & escrow'
    : 'Sign & submit';
  const submitClass = isRead ? 'dapp-submit dapp-submit--read' : 'dapp-submit';

  return `
    <form class="dapp-card" data-method="${esc(methodName)}" novalidate>
      <header class="dapp-card__head">
        <div>
          <h3 class="dapp-card__title mono">${esc(methodName)}</h3>
          <p class="dapp-card__meta">${esc(method.summary || describeMethod(method))}</p>
        </div>
        <span class="chip ${
          isRead ? 'chip--done' : isPayable ? 'chip--gen' : 'chip--net'
        }">${isRead ? 'READ' : isPayable ? 'PAYABLE' : 'WRITE'}</span>
      </header>
      <div class="dapp-card__body">
        ${fields || '<p class="dapp-card__nofields">No arguments.</p>'}
        ${rewardField}
      </div>
      <div class="dapp-card__foot">
        <button type="submit" class="${submitClass}">${esc(submitLabel)}</button>
        <div class="dapp-status" data-status-for="${esc(methodName)}"></div>
      </div>
      <div class="dapp-result" data-result-for="${esc(methodName)}" hidden></div>
    </form>`;
}

function describeMethod(m) {
  const params = m.params.length
    ? m.params.map((p) => p.name).join(', ')
    : 'no arguments';
  const tag = m.kind === 'read' ? '· read' : m.kind === 'payable' ? '· payable' : '';
  return `${params} ${tag}`.trim();
}

function renderField(methodName, param) {
  const id = `f-${methodName}-${param.name}`;
  const hint = FIELD_HINTS[param.name] || '';
  const isLong = param.kind === 'text';
  const isInt = param.kind === 'integer';
  const control = isLong
    ? `<textarea id="${id}" name="${esc(param.name)}"
                 class="dapp-field__input dapp-field__input--area"
                 rows="4"></textarea>`
    : `<input id="${id}" name="${esc(param.name)}"
             class="dapp-field__input mono"
             type="text"
             ${isInt ? 'inputmode="numeric" pattern="\\d+"' : ''}
             placeholder="${esc(placeholderFor(param))}" />`;
  return `
    <label class="dapp-field" for="${id}">
      <span class="dapp-field__label">
        ${esc(param.name)}
        <span class="dapp-field__type mono">${esc(param.kind)}</span>
      </span>
      ${control}
      ${hint ? `<span class="dapp-field__hint">${esc(hint)}</span>` : ''}
    </label>`;
}

function placeholderFor(param) {
  switch (param.kind) {
    case 'integer': return '0';
    case 'string':  return '';
    case 'text':    return '';
    default:        return '';
  }
}

/* ─────────────────────────────────────────────────────────────────────────
 * Form submit → validate → real GenLayer read/write
 * ────────────────────────────────────────────────────────────────────── */

async function handleFormSubmit(e, method) {
  e.preventDefault();
  const form = e.currentTarget;
  const isRead = method.kind === 'read';
  const isPayable = method.kind === 'payable';

  // Capture form values so a mid-flight wallet re-render doesn't lose them.
  const formValues = {};
  method.params.forEach((p) => (formValues[p.name] = form.elements[p.name]?.value ?? ''));
  if (isPayable) formValues.__value = form.elements['__value']?.value ?? '';
  savePartial(method.name, { formValues });

  // Coerce args to GenLayer positional values.
  let args;
  try {
    args = method.params.map((p) => coerceArg(p, formValues[p.name]));
  } catch (err) {
    return updateStatus(form, method.name, 'error', err.message);
  }

  // Writes require MetaMask + correct chain.
  if (!isRead) {
    if (!wallet.snapshot.hasProvider) {
      return updateStatus(form, method.name, 'error', 'MetaMask is not installed.');
    }
    if (!wallet.snapshot.connected) {
      updateStatus(form, method.name, 'info', 'Connecting wallet…', true);
      try {
        await wallet.connect();
      } catch (err) {
        return updateStatus(form, method.name, 'error', err.message || 'Wallet connection was refused.');
      }
    }
    if (!wallet.snapshot.onGenLayer) {
      return updateStatus(
        form,
        method.name,
        'warn',
        `Your wallet is on chain ${wallet.snapshot.chainIdDec ?? '?'} — switch to GenLayer Studionet (${GENLAYER_STUDIONET.chainIdDec}) first.`
      );
    }
  }

  // Wipe any previous result panel for this form.
  const resultEl = form.querySelector('.dapp-result');
  resultEl.hidden = true;
  resultEl.innerHTML = '';
  savePartial(method.name, { result: null });

  if (isRead) {
    updateStatus(form, method.name, 'info', 'Reading from GenLayer…', true);
    try {
      const value = await readContractMethod(
        { functionName: method.name, args },
        wallet.snapshot.connected ? { account: wallet.snapshot.account } : {}
      );
      const html = renderReadResult(method, value);
      resultEl.hidden = false;
      resultEl.innerHTML = html;
      savePartial(method.name, { result: html });
      updateStatus(form, method.name, 'ok', 'Read complete.');
    } catch (err) {
      updateStatus(form, method.name, 'error', humanError(err));
    }
    return;
  }

  // ── WRITE ──
  let value;
  if (isPayable) {
    try {
      value = parseGenToWei(formValues.__value, GENLAYER_STUDIONET.nativeCurrency.decimals);
    } catch (err) {
      return updateStatus(form, method.name, 'error', err.message);
    }
  }

  updateStatus(form, method.name, 'info', 'Estimating GenLayer fees…', true);
  let lastTxHash = null;
  try {
    const { txHash } = await writeContractMethod(
      { functionName: method.name, args, value },
      {
        account: wallet.snapshot.account,
        onStage: (stage) => {
          if (stage.kind === 'estimating') {
            updateStatus(form, method.name, 'info', 'Estimating GenLayer fees…', true);
          } else if (stage.kind === 'estimated') {
            updateStatus(form, method.name, 'info', 'Fees estimated. Waiting for MetaMask…', true);
          } else if (stage.kind === 'signing') {
            updateStatus(form, method.name, 'info', 'Waiting for MetaMask…', true);
          } else if (stage.kind === 'submitted') {
            lastTxHash = stage.txHash;
            updateStatus(form, method.name, 'info', 'Transaction submitted. GenLayer consensus processing…', true, stage.txHash);
          } else if (stage.kind === 'finalizing') {
            lastTxHash = stage.txHash;
            updateStatus(form, method.name, 'info', 'Waiting for finalization…', true, stage.txHash);
          }
        },
      }
    );
    // writeContractMethod throws unless isSuccessful(transaction) is true, so
    // reaching this line means the transaction genuinely finalized with a
    // successful GenVM execution.
    updateStatus(form, method.name, 'ok', 'FINALIZED — SUCCESS.', false, txHash);
    wallet.refreshBalance();
  } catch (err) {
    updateStatus(form, method.name, 'error', humanError(err), false, lastTxHash);
  }
}

/* ── argument coercion — GenLayer values, not Solidity types ────────── */

function coerceArg(param, raw) {
  const v = (raw ?? '').toString();
  switch (param.kind) {
    case 'string':
    case 'text':
      return v;
    case 'integer': {
      const t = v.trim();
      if (t === '') throw new Error(`${param.name}: required.`);
      if (!/^\d+$/.test(t)) throw new Error(`${param.name}: expected a non-negative integer.`);
      // GenLayerJS accepts BigInt or number; use BigInt for large windows.
      const n = BigInt(t);
      // Down-convert to Number when safely representable (nicer for the SDK's
      // JSON path, which uses BigInt-safe encoding but small numbers as ints).
      if (n <= 9007199254740991n) return Number(n);
      return n;
    }
    case 'gen':
      // Handled by the caller via parseGenToWei.
      return v;
    default:
      return v;
  }
}

/* ── status helpers ─────────────────────────────────────────────────── */

function updateStatus(form, methodName, kind, message, spin = false, txHash = null) {
  writeStatus(form, kind, message, spin, txHash);
  savePartial(methodName, { status: { kind, message, spin, txHash } });
}

function writeStatus(form, kind, message, spin, txHash) {
  const el = form.querySelector('.dapp-status');
  if (!el) return;
  const spinner = spin ? '<span class="spinner" aria-hidden="true"></span>' : '';
  const hashRow = txHash
    ? `<div class="dapp-status__hash mono">
         <span>tx</span>
         <span class="dapp-status__hash-val">${esc(txHash)}</span>
         <button class="copybtn" type="button" data-copy="${esc(txHash)}" aria-label="Copy transaction hash">
           ${COPY_ICON}<span>Copy</span>
         </button>
       </div>`
    : '';
  el.className = `dapp-status dapp-status--${kind}`;
  el.innerHTML = `<div class="dapp-status__row">${spinner}<span>${esc(message)}</span></div>${hashRow}`;
}

function savePartial(methodName, patch) {
  const prev = uiState.get(methodName) || {};
  uiState.set(methodName, { ...prev, ...patch });
}

function humanError(err) {
  if (!err) return 'Unknown error.';
  if (err.code === 4001) return 'You rejected the request in MetaMask.';
  if (err.code === -32002) return 'A MetaMask request is already pending — open MetaMask to review it.';
  if (err.shortMessage) return err.shortMessage;
  if (err.details) return err.details;
  if (err.reason) return err.reason;
  return err.message || String(err);
}

/* ─────────────────────────────────────────────────────────────────────────
 * READ RESULT RENDERING — receive a decoded GenLayer value and display it.
 *
 * GenLayerJS returns JSON-safe values: primitives, arrays, and plain
 * objects. We render objects as key/value rows and primitives as a single
 * value block — no ABI tuple decoding.
 * ────────────────────────────────────────────────────────────────────── */

function renderReadResult(method, value) {
  const s = wallet.snapshot;
  const kvHtml = renderValueAsKV(method.name, value);

  // Role hints for get_bounty
  let roleHint = '';
  if (method.name === 'get_bounty' && s.connected && value && typeof value === 'object') {
    const sponsor = pick(value, ['sponsor', 'sponsor_address']);
    const developer = pick(value, ['developer', 'developer_address', 'accepted_developer']);
    const me = s.account?.toLowerCase();
    const chips = [];
    if (typeof sponsor === 'string' && me && sponsor.toLowerCase() === me) {
      chips.push('<span class="chip chip--net">This wallet is the bounty sponsor.</span>');
    }
    if (typeof developer === 'string' && me && developer.toLowerCase() === me) {
      chips.push('<span class="chip chip--done">This wallet is the accepted developer.</span>');
    }
    if (typeof sponsor === 'string' && typeof developer === 'string' && me) {
      const zero = /^0x0+$/.test(developer);
      if (zero && sponsor.toLowerCase() === me) {
        chips.push('<span class="chip chip--gen">The sponsor cannot accept their own bounty.</span>');
      }
    }
    if (chips.length) roleHint = `<div class="dapp-result__roles">${chips.join(' ')}</div>`;
  }

  return `
    <div class="dapp-result__head">
      <span class="dapp-result__title mono">${esc(method.name)} result</span>
      <span class="chip chip--done">LIVE gen_call</span>
    </div>
    ${roleHint}
    <div class="dapp-result__grid">${kvHtml}</div>`;
}

function pick(obj, keys) {
  for (const k of keys) if (obj && k in obj) return obj[k];
  return undefined;
}

function renderValueAsKV(rootName, value) {
  if (value === null || value === undefined) {
    return kvRow(rootName, '', '<span class="dapp-kv__empty">null</span>');
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return kvRow(rootName, 'array', '<span class="dapp-kv__empty">empty</span>');
    return value.map((v, i) => kvRow(`${rootName}[${i}]`, typeHint(v), renderScalar(rootName, v))).join('');
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) return kvRow(rootName, 'object', '<span class="dapp-kv__empty">empty</span>');
    return entries.map(([k, v]) => kvRow(k, typeHint(v), renderScalarOrNested(k, v))).join('');
  }
  return kvRow(rootName, typeHint(value), renderScalar(rootName, value));
}

function renderScalarOrNested(name, v) {
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    // Small nested objects — show inline as pretty JSON.
    const json = safeStringify(v);
    return `<span class="dapp-kv__wrap mono">${esc(json)}</span>`;
  }
  if (Array.isArray(v)) {
    const json = safeStringify(v);
    return `<span class="dapp-kv__wrap mono">${esc(json)}</span>`;
  }
  return renderScalar(name, v);
}

function renderScalar(name, v) {
  if (v === null || v === undefined) return '<span class="dapp-kv__empty">null</span>';
  if (typeof v === 'boolean') {
    return v ? '<span class="chip chip--ok">true</span>' : '<span class="chip">false</span>';
  }
  const asStr =
    typeof v === 'bigint'
      ? v.toString()
      : typeof v === 'number'
      ? String(v)
      : typeof v === 'string'
      ? v
      : safeStringify(v);

  const copyable = asStr.length >= 8 ? asStr : null;
  const copyBtn = copyable
    ? `<button class="copybtn" type="button" data-copy="${esc(copyable)}" aria-label="Copy ${esc(name)}">
         ${COPY_ICON}<span>Copy</span>
       </button>`
    : '';

  // GEN-reward display for uint-ish reward fields
  let extra = '';
  if (/reward/i.test(name) && /^\d+$/.test(asStr)) {
    try {
      const wei = BigInt(asStr);
      extra = `<span class="dapp-kv__sub mono">${esc(
        formatBalance(wei, GENLAYER_STUDIONET.nativeCurrency.decimals)
      )} ${esc(GENLAYER_STUDIONET.nativeCurrency.symbol)}</span>`;
    } catch {}
  } else if ((/deadline|timestamp/i.test(name)) && /^\d+$/.test(asStr)) {
    const n = Number(asStr);
    if (n > 0 && n < 10 ** 12) {
      extra = `<span class="dapp-kv__sub mono">${esc(new Date(n * 1000).toISOString())}</span>`;
    }
  }

  return `<span class="mono dapp-kv__wrap">${esc(asStr)}</span>${extra}${copyBtn}`;
}

function typeHint(v) {
  if (v === null || v === undefined) return 'null';
  if (Array.isArray(v)) return `array[${v.length}]`;
  if (typeof v === 'object') return 'object';
  if (typeof v === 'bigint') return 'integer';
  return typeof v;
}

function safeStringify(v) {
  try {
    return JSON.stringify(v, (_k, val) => (typeof val === 'bigint' ? val.toString() : val), 2);
  } catch {
    return String(v);
  }
}

function kvRow(label, type, valueHtml) {
  return `
    <div class="dapp-kv">
      <div class="dapp-kv__label">${esc(label)} <span class="dapp-kv__type mono">${esc(type)}</span></div>
      <div class="dapp-kv__value">${valueHtml}</div>
    </div>`;
}

/* ─────────────────────────────────────────────────────────────────────────
 * BOOT
 * ────────────────────────────────────────────────────────────────────── */

export function bootDapp() {
  renderWalletButton();
  renderDappSection();
  wallet.addEventListener('change', () => {
    // Account change invalidates the cached GenLayer client.
    invalidateClientCache();
    renderWalletButton();
    renderDappSection();
  });

  document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'dapp-switch-inline') {
      wallet.switchToGenLayer().catch((err) => alert(err.message || err));
    }
  });
}

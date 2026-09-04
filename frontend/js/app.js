/**
 * MergeBounty — application entry point.
 * Renders all sections from the canonical CONFIG, wires copy-to-clipboard,
 * scroll-reveal micro-interactions, and the one genuine live integration:
 * a client-side SHA-256 integrity check of the pinned public evidence file.
 */
import { CONFIG, LIFECYCLE, ARCHITECTURE, TRUST_MODEL } from './config.js';
import { chip, hashField, txItem, archCard, lifecycleStep, trustRow } from './components.js';
import { bootDapp } from './dapp.js';

const $ = (sel) => document.querySelector(sel);
const d = CONFIG.demo;

/* ---------------- Hero proof panel ---------------- */
function renderHeroPanel() {
  $('#hero-panel').innerHTML = `
    <div class="proof">
      <div class="proof__head">
        <span class="proof__title mono">${d.bountyId}</span>
        ${chip(d.verdict, 'ok')}
      </div>
      <div class="proof__subtitle">${d.title}</div>
      <div class="proof__flow" aria-label="Lifecycle summary">
        <span>Funded</span><i></i><span>Accepted</span><i></i><span>Submitted</span><i></i>
        <span class="is-ok">Approved</span><i></i><span class="is-ok">Paid</span>
      </div>
      <dl class="proof__kv">
        <div><dt>Reward</dt><dd class="mono">${d.rewardGen} GEN</dd></div>
        <div><dt>Reviewed commit</dt><dd class="mono">${d.commitSha.slice(0, 12)}…</dd></div>
        <div><dt>Evidence SHA-256</dt><dd class="mono">${d.evidenceSha256.slice(0, 12)}…</dd></div>
        <div><dt>Settlement</dt><dd>Finalized payout</dd></div>
      </dl>
      <div class="proof__chips">
        ${chip('STUDIONET', 'net')} ${chip(`${d.rewardGen} GEN`, 'gen')} ${chip('FINALIZED', 'done')}
      </div>
    </div>`;
}

/* ---------------- Lifecycle ---------------- */
function renderLifecycle() {
  $('#lifecycle-list').innerHTML = LIFECYCLE.map(lifecycleStep).join('');
}

/* ---------------- Verified demo dashboard ---------------- */
function renderDashboard() {
  $('#demo-dashboard').innerHTML = `
    <div class="dash">
      <div class="dash__top">
        <div>
          <div class="dash__id mono">${d.bountyId}</div>
          <h3 class="dash__title">${d.title}</h3>
        </div>
        <div class="dash__chips">
          ${chip(d.verdict, 'ok')} ${chip('FINALIZED', 'done')}
          ${chip(`${d.rewardGen} GEN`, 'gen')} ${chip('STUDIONET', 'net')}
        </div>
      </div>
      <div class="dash__cards">
        <div class="statcard"><span class="statcard__label">Reward escrowed &amp; paid</span><span class="statcard__value mono">${d.rewardGen} GEN</span></div>
        <div class="statcard"><span class="statcard__label">Consensus verdict</span><span class="statcard__value statcard__value--ok">${d.verdict}</span></div>
        <div class="statcard"><span class="statcard__label">Adjudications</span><span class="statcard__value mono">${d.adjudications}</span></div>
        <div class="statcard"><span class="statcard__label">Settlement</span><span class="statcard__value">Finalized payout</span></div>
      </div>
      <div class="dash__fields">
        ${hashField({ label: 'Exact reviewed commit', value: d.commitSha, href: CONFIG.links.commit })}
        ${hashField({ label: 'Evidence SHA-256 digest', value: d.evidenceSha256 })}
      </div>
      <p class="dash__note">${d.settlement} — one full-consensus adjudication on GenLayer Studionet.</p>
    </div>`;
}

/* ---------------- Transaction timeline ---------------- */
function renderTimeline() {
  $('#tx-timeline').innerHTML = CONFIG.transactions.map(txItem).join('');
}

/* ---------------- Evidence panel ---------------- */
function renderEvidence() {
  $('#evidence-panel').innerHTML = `
    <div class="evcard">
      ${hashField({ label: 'Contract address · GenLayer Studionet', value: CONFIG.contractAddress })}
      ${hashField({ label: 'GitHub repository', value: 'github.com/amzar1st/mergebounty-demo', href: CONFIG.links.repo, copyable: false })}
      ${hashField({ label: 'Exact reviewed commit', value: d.commitSha, href: CONFIG.links.commit })}
      ${hashField({ label: 'Evidence SHA-256', value: d.evidenceSha256 })}
      ${hashField({ label: 'Evidence URL (pinned to commit)', value: CONFIG.links.evidence, href: CONFIG.links.evidence })}
    </div>`;

  $('#integrity-check').innerHTML = `
    <div class="integrity__card" id="integrity-card">
      <div class="integrity__head">
        <h3>Live evidence integrity check</h3>
        <span class="chip chip--net">GENUINE LIVE CHECK</span>
      </div>
      <p class="integrity__body">
        Fetches <code>EVIDENCE.md</code> pinned to the reviewed commit directly from GitHub,
        computes SHA-256 locally in your browser, and compares it against the canonical
        on-chain digest. This is a real verification — with a real loading and error state.
      </p>
      <div class="integrity__status" id="integrity-status">
        <span class="spinner" aria-hidden="true"></span> Fetching pinned evidence…
      </div>
    </div>`;
}

/* Genuine live integration: fetch pinned EVIDENCE.md, hash locally, compare. */
async function runIntegrityCheck() {
  const el = $('#integrity-status');
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);
    const res = await fetch(CONFIG.links.evidence, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = await res.arrayBuffer();
    const digest = await crypto.subtle.digest('SHA-256', buf);
    const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
    const match = hex === d.evidenceSha256;
    el.className = `integrity__status integrity__status--${match ? 'ok' : 'bad'}`;
    el.innerHTML = match
      ? `<strong>✓ Integrity verified.</strong> Live SHA-256 of the pinned evidence
         <span class="mono">${hex}</span> matches the canonical on-chain digest exactly.`
      : `<strong>⚠ Digest mismatch.</strong> Computed <span class="mono">${hex}</span>
         does not equal the canonical digest <span class="mono">${d.evidenceSha256}</span>. Do not trust this evidence copy.`;
  } catch (err) {
    el.className = 'integrity__status integrity__status--error';
    el.innerHTML = `<strong>Live check unavailable.</strong> Could not fetch the pinned evidence
      (${err.name === 'AbortError' ? 'request timed out' : 'network/CORS error'}).
      The canonical digest above remains the on-chain reference — verify manually with
      <code>curl -s &lt;evidence-url&gt; | sha256sum</code>.`;
  }
}

/* ---------------- Architecture & trust ---------------- */
function renderArch() {
  $('#arch-grid').innerHTML = ARCHITECTURE.map(archCard).join('');
  $('#trust-grid').innerHTML = TRUST_MODEL.map(trustRow).join('');
}

/* ---------------- Footer ---------------- */
function renderFooter() {
  $('#footer-contract').textContent = CONFIG.contractAddress;
}

/* ---------------- Copy-to-clipboard (event delegation) ---------------- */
function wireCopy() {
  const toast = $('#toast');
  let t;
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-copy]');
    if (!btn) return;
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
    } catch {
      // Fallback for non-secure contexts
      const ta = document.createElement('textarea');
      ta.value = btn.dataset.copy;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    btn.classList.add('is-copied');
    setTimeout(() => btn.classList.remove('is-copied'), 1200);
    toast.textContent = 'Copied to clipboard';
    toast.classList.add('is-visible');
    clearTimeout(t);
    t = setTimeout(() => toast.classList.remove('is-visible'), 1600);
  });
}

/* ---------------- Scroll reveal ---------------- */
function wireReveal() {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => en.isIntersecting && en.target.classList.add('is-in')),
    { threshold: 0.12 }
  );
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
}

/* ---------------- Boot ---------------- */
renderHeroPanel();
renderLifecycle();
renderDashboard();
renderTimeline();
renderEvidence();
renderArch();
renderFooter();
wireCopy();
wireReveal();
runIntegrityCheck();
bootDapp();

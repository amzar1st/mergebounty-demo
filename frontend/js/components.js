/**
 * MergeBounty — reusable presentational components.
 * All components return HTML strings; app.js mounts them.
 */

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );

/** Compact status chip: chip('APPROVED', 'ok') */
export function chip(label, variant = 'neutral') {
  return `<span class="chip chip--${variant}">${esc(label)}</span>`;
}

const COPY_ICON = `<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M5 2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h1V2Zm8 0H7v6h6V2ZM5 4H3v7h7v-1H7a2 2 0 0 1-2-2V4Z"/></svg>`;

/**
 * Monospace hash/address field with optional link + copy-to-clipboard.
 * hashField({ label, value, href, copyable, note })
 */
export function hashField({ label, value, href = null, copyable = true, note = null }) {
  const val = href
    ? `<a class="hashfield__value hashfield__value--link" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(value)}</a>`
    : `<span class="hashfield__value">${esc(value)}</span>`;
  const copy = copyable
    ? `<button class="copybtn" type="button" data-copy="${esc(value)}" aria-label="Copy ${esc(label)}">${COPY_ICON}<span>Copy</span></button>`
    : '';
  return `
    <div class="hashfield">
      <div class="hashfield__label">${esc(label)}</div>
      <div class="hashfield__row mono">${val}${copy}</div>
      ${note ? `<div class="hashfield__note">${esc(note)}</div>` : ''}
    </div>`;
}

/** One transaction entry in the proof timeline. */
export function txItem(tx, index) {
  return `
    <li class="tx reveal" style="--i:${index}">
      <div class="tx__rail" aria-hidden="true"><span class="tx__node"></span></div>
      <div class="tx__card">
        <div class="tx__head">
          <span class="tx__index mono">${String(index + 1).padStart(2, '0')}</span>
          <h3 class="tx__label">${esc(tx.label)}</h3>
        </div>
        <p class="tx__desc">${esc(tx.description)}</p>
        <div class="tx__hash mono">
          <span class="tx__hash-text">${esc(tx.hash)}</span>
          <button class="copybtn" type="button" data-copy="${esc(tx.hash)}" aria-label="Copy transaction hash ${esc(tx.label)}">${COPY_ICON}<span>Copy</span></button>
        </div>
      </div>
    </li>`;
}

/** Architecture mechanism card. */
export function archCard(item, index) {
  return `
    <article class="archcard reveal" style="--i:${index}">
      <div class="archcard__icon" aria-hidden="true">${iconFor(item.icon)}</div>
      <h3>${esc(item.title)}</h3>
      <p>${esc(item.body)}</p>
    </article>`;
}

/** Lifecycle step node. */
export function lifecycleStep(item, index) {
  return `
    <li class="lcstep reveal" style="--i:${index}">
      <div class="lcstep__node mono" aria-hidden="true">${index + 1}</div>
      <h3>${esc(item.step)}</h3>
      <p>${esc(item.body)}</p>
    </li>`;
}

/** Trust model row (claim → why). */
export function trustRow(item, index) {
  return `
    <article class="trustrow reveal" style="--i:${index}">
      <h3>${esc(item.claim)}</h3>
      <p>${esc(item.why)}</p>
    </article>`;
}

/* ---------- inline SVG icon set (abstract, no coin/cyberpunk clichés) ---------- */
function iconFor(name) {
  const common = 'width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"';
  const icons = {
    lock: `<svg ${common}><rect x="4" y="9" width="12" height="8" rx="1.5"/><path d="M7 9V6a3 3 0 0 1 6 0v3"/></svg>`,
    hash: `<svg ${common}><path d="M7 3 5 17M15 3l-2 14M4 7h13M3 13h13"/></svg>`,
    pen: `<svg ${common}><path d="m13 3 4 4L8 16l-5 1 1-5L13 3Z"/></svg>`,
    git: `<svg ${common}><circle cx="5" cy="5" r="2"/><circle cx="5" cy="15" r="2"/><circle cx="15" cy="9" r="2"/><path d="M5 7v6M15 11c0 2-3 2-6 2"/></svg>`,
    fingerprint: `<svg ${common}><path d="M5 6a5.5 5.5 0 0 1 10 0c0 4-1 6-2 8"/><path d="M7.5 6.5a3 3 0 0 1 5 0c0 3-.5 5-1.5 7"/><path d="M10 8c0 3-.5 5-1.5 6.5"/></svg>`,
    nodes: `<svg ${common}><circle cx="4" cy="4" r="1.8"/><circle cx="16" cy="4" r="1.8"/><circle cx="10" cy="16" r="1.8"/><path d="M5.5 5.2 8.6 14.4M14.5 5.2l-3.1 9.2M5.8 4h8.4"/></svg>`,
    shield: `<svg ${common}><path d="M10 2 4 4.5v5c0 4 2.5 6.5 6 8 3.5-1.5 6-4 6-8v-5L10 2Z"/><path d="m7.5 10 1.8 1.8 3.2-3.6"/></svg>`,
    flag: `<svg ${common}><path d="M5 18V3"/><path d="M5 4h10l-2.5 3.5L15 11H5"/></svg>`,
    clock: `<svg ${common}><circle cx="10" cy="10" r="7.5"/><path d="M10 5.5V10l3 2"/></svg>`,
    list: `<svg ${common}><path d="M7 5h9M7 10h9M7 15h9"/><circle cx="4" cy="5" r="1"/><circle cx="4" cy="10" r="1"/><circle cx="4" cy="15" r="1"/></svg>`,
    coin: `<svg ${common}><rect x="3" y="6" width="14" height="9" rx="1.5"/><path d="M3 9.5h14M8 6V4.5A1.5 1.5 0 0 1 9.5 3h5"/></svg>`,
  };
  return icons[name] || icons.hash;
}

export const PRACTICE_STORE = 'chantcode.web-practice.v1';
export function storageWarning() {
  let notice = document.getElementById('web-storage-warning');
  if (!notice) {
    notice = document.createElement('p'); notice.id = 'web-storage-warning'; notice.setAttribute('role', 'alert');
    notice.textContent = 'Progress cannot be saved in this browser right now. You can keep practising, but new progress may be lost when you leave or refresh.';
    document.body.prepend(notice);
  }
}
window.addEventListener('chantcode-storage-error', storageWarning);
function keyFor(facts) { return facts.map(f => `${Number(f.left ?? f.a)}x${Number(f.right ?? f.b)}`).join(','); }
function records() {
  try { const data = JSON.parse(localStorage.getItem(PRACTICE_STORE) || '{}'); return data && typeof data === 'object' && !Array.isArray(data) ? data : {}; }
  catch { storageWarning(); return {}; }
}
export function readPractice(facts) {
  const r = records()[keyFor(facts)] || {};
  return { index: Number.isInteger(r.index) && r.index >= 0 && r.index < facts.length ? r.index : 0,
    worked: Number.isInteger(r.worked) ? Math.max(0, Math.min(facts.length, r.worked)) : 0, completed: r.completed === true };
}
export function savePractice(facts, record) {
  try { const data = records(); data[keyFor(facts)] = record; localStorage.setItem(PRACTICE_STORE, JSON.stringify(data)); }
  catch { storageWarning(); }
}
if (window.top === window.self) {
  const bar = document.createElement('aside'); bar.className = 'web-download-bar'; bar.setAttribute('aria-label', 'Get the optional ChantCode app');
  bar.innerHTML = '<a href="https://apps.apple.com/app/id6799623130">Get ChantCode Free on iPhone &amp; iPad ↗</a><a href="/free-multiplication">About this free web resource</a>';
  document.body.prepend(bar);
}

import { hasPin, checkPin } from './store.js';
import { icon, mascot } from './art.js';
import { esc } from './activities.js';
export const $ = (s, r = document) => r.querySelector(s);
let tt; export function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2600); }
export function modal(html, { dismiss = true, cls = '' } = {}) {
  const host = $('#overlay'), prev = document.activeElement, el = document.createElement('div'); el.className = 'scrim'; el.innerHTML = `<div class="dialog ${cls}" role="dialog" aria-modal="true">${html}</div>`; host.appendChild(el);
  const close = () => { el.remove(); try { prev && prev.focus(); } catch { /* */ } }; if (dismiss) el.addEventListener('click', e => { if (e.target === el) close(); });
  const dlg = $('.dialog', el); const f = dlg.querySelector('input,button'); f && f.focus();
  el.addEventListener('keydown', e => { if (e.key === 'Escape' && dismiss) close(); });
  return { el, close, q: s => $(s, el) };
}
export const confirmDialog = (msg, yes = 'نعم', no = 'لا') => new Promise(res => { const m = modal(`<p class="dlg-msg">${esc(msg)}</p><div class="row"><button class="btn" data-y>${esc(yes)}</button><button class="btn ghost" data-n>${esc(no)}</button></div>`, { dismiss: false }); m.el.onclick = e => { if (e.target.closest('[data-y]')) { m.close(); res(true); } else if (e.target.closest('[data-n]')) { m.close(); res(false); } }; });
let gateUntil = 0; export const gateOpen = () => Date.now() < gateUntil; export const closeGate = () => { gateUntil = 0; };
export function gate() {
  if (gateOpen()) return Promise.resolve(true);
  return new Promise(res => {
    const pin = hasPin(), a = 12 + Math.floor(Math.random() * 18), b = 11 + Math.floor(Math.random() * 9);
    const m = modal(`<div class="gate-head">${icon('lock', 30)}<h2>هذا الركن لولي الأمر</h2></div><p class="sub">${pin ? 'أدخل الرقم السرّي المكوّن من 4 أرقام.' : `كم يساوي <b dir="ltr">${a} + ${b}</b> ؟`}</p><input class="field" id="gin" inputmode="numeric" autocomplete="off" ${pin ? 'type="password" maxlength="4"' : 'type="text" maxlength="3"'} aria-label="${pin ? 'الرقم السرّي' : 'الإجابة'}"><p class="fb hint" id="gerr" role="alert"></p><div class="row"><button class="btn" data-ok>فتح</button><button class="btn ghost" data-no>إلغاء</button></div>${pin ? '<button class="link" data-forgot>نسيت الرقم؟</button>' : ''}`);
    const done = v => { if (v) gateUntil = Date.now() + 5 * 60e3; m.close(); res(v); };
    const tryIt = async () => { const v = m.q('#gin').value.trim(); const ok = pin ? await checkPin(v) : +v === a + b; if (ok) done(true); else { m.q('#gerr').textContent = 'غير صحيح، حاول مرة أخرى.'; m.q('#gin').value = ''; m.q('#gin').focus(); } };
    m.el.onclick = e => { if (e.target.closest('[data-ok]')) tryIt(); else if (e.target.closest('[data-no]') || e.target === m.el) done(false); else if (e.target.closest('[data-forgot]')) m.q('#gerr').textContent = 'إن نسيته: افتح إعدادات المتصفح وامسح بيانات هذا الموقع، أو أعد ضبط التطبيق من الإعدادات. سيُحذف تقدّم هذا الجهاز.'; };
    m.el.onkeydown = e => { if (e.key === 'Enter') tryIt(); if (e.key === 'Escape') done(false); };
  });
}
export const bigMascotDialog = (pose, title, text, buttons) => modal(`<div class="mdlg">${mascot(pose, 130)}<h2>${esc(title)}</h2><p>${esc(text)}</p><div class="row">${buttons}</div></div>`, { dismiss: false, cls: 'wide' });

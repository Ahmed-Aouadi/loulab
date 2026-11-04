// مرسمي: لوحة رسم حرّة. تُحفظ الرسمة في ملف الطفل على الجهاز (حتى 8 رسمات).
import { icon } from './art.js';
import { saveArt } from './store.js';
import { toast } from './ui.js';
import { sfx } from './audio.js';
const COLORS = ['#17342C', '#E53935', '#FB8C00', '#FDD835', '#43A047', '#1E88E5', '#8E24AA', '#EC407A', '#6D4C41'];
export function studio(root, close) {
  root.innerHTML = `<div class="player studio"><header class="ptop"><button class="iconbtn" data-x aria-label="خروج">${icon('close', 26)}</button><h1 class="ptitle">مرسمي</h1></header><div class="stage"><canvas id="cv" width="720" height="520" aria-label="لوحة الرسم"></canvas><div class="tools" role="toolbar" aria-label="أدوات الرسم">${COLORS.map((c, i) => `<button class="sw ${i === 1 ? 'sel' : ''}" style="background:${c}" data-c="${c}" aria-label="لون ${i + 1}"></button>`).join('')}<span class="sep"></span>${[6, 14, 28].map((s, i) => `<button class="sz ${i === 1 ? 'sel' : ''}" data-s="${s}" aria-label="حجم ${i + 1}"><i style="width:${s / 1.4 + 6}px;height:${s / 1.4 + 6}px"></i></button>`).join('')}<button class="sw er" data-er aria-label="ممحاة">${icon('retry', 20)}</button></div><div class="row"><button class="btn ghost" data-clear>${icon('trash', 20)} لوحة جديدة</button><button class="btn" data-save>${icon('check', 20)} احفظ رسمتي</button></div></div></div>`;
  const cv = root.querySelector('#cv'), x = cv.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, cv.width, cv.height);
  let col = '#E53935', size = 14, er = false, d = false, last;
  const pos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * cv.width / r.width, (e.clientY - r.top) * cv.height / r.height]; };
  const line = (a, b) => { x.strokeStyle = er ? '#fff' : col; x.lineWidth = er ? size * 1.6 : size; x.lineCap = x.lineJoin = 'round'; x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.stroke(); };
  cv.style.touchAction = 'none'; cv.onpointerdown = e => { d = true; last = pos(e); line(last, last); cv.setPointerCapture(e.pointerId); }; cv.onpointermove = e => { if (!d) return; const p = pos(e); line(last, p); last = p; }; cv.onpointerup = cv.onpointercancel = () => d = false;
  root.onclick = e => {
    const c = e.target.closest('[data-c]'), s = e.target.closest('[data-s]');
    if (c) { col = c.dataset.c; er = false; root.querySelectorAll('.sw').forEach(b => b.classList.toggle('sel', b === c)); }
    else if (e.target.closest('[data-er]')) { er = true; root.querySelectorAll('.sw').forEach(b => b.classList.toggle('sel', b.hasAttribute('data-er'))); }
    else if (s) { size = +s.dataset.s; root.querySelectorAll('.sz').forEach(b => b.classList.toggle('sel', b === s)); }
    else if (e.target.closest('[data-clear]')) { x.fillStyle = '#fff'; x.fillRect(0, 0, cv.width, cv.height); }
    else if (e.target.closest('[data-save]')) { const t = document.createElement('canvas'); t.width = 360; t.height = 260; t.getContext('2d').drawImage(cv, 0, 0, 360, 260); saveArt(t.toDataURL('image/jpeg', .72)); sfx('good'); toast('حفظنا رسمتك في حقيبتي ✔'); }
    else if (e.target.closest('[data-x]')) close();
  };
}

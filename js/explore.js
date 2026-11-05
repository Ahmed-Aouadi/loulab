// لوحة الحروف والأرقام: استكشاف حرّ، اضغط لتسمع وتكتب.
import { LET } from './content/arabic.js';
import { icon } from './art.js';
import { speak } from './audio.js';
import { esc, mount } from './activities.js';
import { modal } from './ui.js';
const NUMS = ['صفر', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة'];
const DOTS = ['⭐', '🍎', '🐟', '🎈', '🌸'];
export function explore(kind) {
  const alpha = kind !== 'numbers';
  const tiles = alpha ? LET.map((l, i) => `<button class="ltile" data-i="${i}" aria-label="حرف ${l[3]}">${l[0]}</button>`).join('') : NUMS.map((w, i) => `<button class="ltile num" data-i="${i}" aria-label="${w}">${i}</button>`).join('');
  return `<section class="explore" data-kind="${alpha ? 'a' : 'n'}"><div class="shead row between"><div><h1 class="h">${alpha ? 'لوحة الحروف' : 'عالم الأرقام'}</h1><p class="sub">اضغط ${alpha ? 'حرفاً' : 'رقماً'} لتراه وتسمعه، ثم جرّب كتابته.</p></div><a class="btn ghost" href="#/games">${icon('prev', 20)} الألعاب</a></div><div class="xcard" id="xcard" aria-live="polite"><p class="sub">اختر من الأسفل ${icon('next', 18)}</p></div><div class="ltiles">${tiles}</div></section>`;
}
export function bindExplore(root) {
  const alpha = root.querySelector('.explore').dataset.kind === 'a', card = root.querySelector('#xcard');
  root.querySelector('.ltiles').onclick = e => {
    const b = e.target.closest('.ltile'); if (!b) return; const i = +b.dataset.i; root.querySelectorAll('.ltile').forEach(x => x.classList.toggle('sel', x === b));
    if (alpha) { const [L, w, em, nm] = LET[i]; card.innerHTML = `<div class="xbig" aria-hidden="true">${L}</div><div class="xinfo"><span class="xpic" aria-hidden="true">${em}</span><b>${esc(w)}</b><small>حرف ${esc(nm)}</small></div><div class="row"><button class="btn" data-say>${icon('sound', 22)} اسمعني</button><button class="btn ghost" data-trace>اكتب الحرف</button></div>`; speak(`${nm}. ${w}`); card.dataset.glyph = L; card.dataset.text = `${nm}. ${w}`; }
    else { const w = NUMS[i], dot = DOTS[i % DOTS.length]; card.innerHTML = `<div class="xbig" aria-hidden="true">${i}</div><div class="xinfo"><span class="xdots" aria-hidden="true">${i ? dot.repeat(i) : '—'}</span><b>${w}</b></div><div class="row"><button class="btn" data-say>${icon('sound', 22)} اسمعني</button><button class="btn ghost" data-trace>اكتب الرقم</button></div>`; speak(w); card.dataset.glyph = String(i); card.dataset.text = w; }
  };
  card.onclick = e => {
    if (e.target.closest('[data-say]')) speak(card.dataset.text);
    else if (e.target.closest('[data-trace]')) { const m = modal('<div class="act"></div><div class="row center"><button class="btn ghost" data-c>إغلاق</button></div>', { cls: 'wide' }); mount(m.q('.act'), { t: 'trace', glyph: card.dataset.glyph, q: `تتبّع «${card.dataset.glyph}» بإصبعك` }, { auto: false, onDone: () => { } }); m.el.addEventListener('click', ev => { if (ev.target.closest('[data-c]')) m.close(); }); }
  };
}

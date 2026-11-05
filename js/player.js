// مشغّل التسلسلات: يعمل للدروس (يسجّل التقدّم) وللألعاب (لا يسجّل).
import { mount, esc } from './activities.js';
import { icon, mascot, starRow } from './art.js';
import { sfx, speak, stopSpeak } from './audio.js';
import { confirmDialog } from './ui.js';
const confetti = () => `<div class="confetti" aria-hidden="true">${Array.from({ length: 30 }, (_, i) => `<span style="left:${(i * 37) % 100}%;background:${['#FFC93C', '#E95D8A', '#22B573', '#4CC3F5', '#8E6BE8'][i % 5]};animation-delay:${(i % 10) / 8}s"></span>`).join('')}</div>`;
export function run({ root, items, title, goal, icon: ic, color = '#1D4ED8', intro = true, auto = false, finish, close, again }) {
  let i = 0, ok = 0;
  const shell = () => { root.innerHTML = `<div class="player" style="--sc:${color}"><header class="ptop"><button class="iconbtn" data-x aria-label="خروج">${icon('close', 26)}</button><div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="${items.length}" aria-valuenow="0"><span></span></div><span class="cnt"></span></header><div class="stage"></div><footer class="pfoot"><button class="btn big" id="next" hidden></button></footer></div>`; };
  const $ = s => root.querySelector(s);
  const bar = () => { $('.bar span').style.width = (i / items.length * 100) + '%'; $('.bar').setAttribute('aria-valuenow', i); $('.cnt').textContent = `${Math.min(i + 1, items.length)} / ${items.length}`; };
  const show = () => {
    bar(); const st = $('.stage'); st.innerHTML = '<div class="act"></div>'; const host = st.firstChild, nx = $('#next'); nx.hidden = true; stopSpeak();
    mount(host, items[i], { auto, onDone: ({ ok: o }) => { if (o) ok++; nx.textContent = i === items.length - 1 ? 'أنهيت الدرس' : 'التالي'; nx.innerHTML = `${nx.textContent} ${icon('next', 22)}`; nx.hidden = false; nx.focus({ preventScroll: true }); } });
    window.scrollTo({ top: 0 });
  };
  const end = () => { stopSpeak(); const r = finish(ok, items.length); sfx('win'); const st = r.stars || 0;
    root.innerHTML = `<div class="player result" style="--sc:${color}">${st >= 2 || r.game ? confetti() : ''}<div class="stage">${mascot(st >= 2 || r.game ? 'cheer' : 'happy', 170)}<h2>${r.game ? 'أحسنت! لعبة جميلة.' : st === 3 ? 'ما شاء الله، ممتاز!' : st === 2 ? 'أحسنت، عمل جميل!' : 'أنهيت الدرس، شكراً لمحاولتك!'}</h2>${r.game ? '' : `<div class="starsbig" aria-label="${st} من 3 نجوم">${starRow(st, 54)}</div>`}<p class="sub">أجبت إجابة صحيحة من المحاولة الأولى عن ${ok} من ${items.length}.</p>${r.sticker ? `<div class="gift" role="status"><span class="stk">${r.sticker}</span>حصلت على ملصق جديد!</div>` : ''}${(r.badges || []).map(b => `<div class="gift" role="status">${icon('trophy', 28)}وسام جديد: ${esc(b.name)}</div>`).join('')}<div class="row">${r.nextHtml || ''}${(st < 3 || r.game) && again ? '<button class="btn ghost" data-again>' + icon('retry', 20) + (r.game ? ' العب مرة أخرى' : ' أعد المحاولة') + '</button>' : ''}<button class="btn ghost" data-x>${r.closeLabel || 'العودة'}</button></div></div></div>`;
    root.onclick = e => { if (e.target.closest('[data-again]')) again(); else if (e.target.closest('[data-x]')) close(); else if (e.target.closest('[data-go]')) { location.hash = e.target.closest('[data-go]').dataset.go; } };
  };
  const start = () => { shell(); root.onclick = async e => {
    if (e.target.closest('[data-x]')) { if (await confirmDialog('هل تريد الخروج الآن؟ لن يُحفظ هذا الدرس إلا عند إنهائه.', 'نعم، أخرج', 'أكمل')) { stopSpeak(); close(); } }
    else if (e.target.closest('#next')) { i++; if (i >= items.length) end(); else show(); } };
    show(); };
  if (intro) {
    root.innerHTML = `<div class="player intro" style="--sc:${color}"><header class="ptop"><button class="iconbtn" data-x aria-label="رجوع">${icon('close', 26)}</button></header><div class="stage"><div class="bigicon" aria-hidden="true">${esc(ic || '')}</div><h1>${esc(title)}</h1><p class="goal">${esc(goal || '')}</p><button class="btn big" data-start>${icon('play', 22)} هيا نبدأ</button></div></div>`;
    root.onclick = e => { if (e.target.closest('[data-x]')) { stopSpeak(); close(); } else if (e.target.closest('[data-start]')) start(); };
    if (auto) setTimeout(() => speak(`${title}. ${goal || ''}`), 300);
  } else start();
}

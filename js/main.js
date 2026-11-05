import * as S from './store.js';
import { LESSONS, byId, subj, STORIES, BANDS, BAND_NAMES } from './content/index.js';
import { WORDS } from './content/arabic.js';
import { rng, sample, shuffle, ch, strip } from './content/util.js';
import * as V from './views.js';
import { run } from './player.js';
import { studio } from './studio.js';
import { mount, esc } from './activities.js';
import { icon, mascot, avatarHtml } from './art.js';
import { speak, stopSpeak, sfx } from './audio.js';
import { explore, bindExplore } from './explore.js';
import { $, toast, modal, confirmDialog, gate, closeGate, bigMascotDialog } from './ui.js';

const view = $('#view'), top = $('#top'), dock = $('#dock');
let route = 'home', ext = 0, blocking = false, sess = 0, lastAct = Date.now();
const NAV = [['home', 'الحديقة', 'home', '#0B7A4B'], ['learn', 'أتعلّم', 'book', '#1D4ED8'], ['games', 'ألعاب', 'puzzle', '#C2410C'], ['stories', 'حكايات', 'story', '#6D28D9'], ['bag', 'حقيبتي', 'bag', '#BE185D']];

function chrome() {
  const p = S.profile();
  top.innerHTML = `<a class="brand" href="#/home" aria-label="بُرعُم - الصفحة الرئيسية"><img src="brand/BRAND_MARK.svg" alt="" width="40" height="40"><span>بُرعُم</span></a><div class="topr"><span class="chipstar" aria-label="عدد النجوم">${icon('star', 20)} ${S.totalStars()}</span><button class="who" data-who aria-label="الأطفال والإعدادات">${avatarHtml(p.avatar)}<b>${esc(p.name)}</b></button><button class="iconbtn" data-parents aria-label="ركن الأسرة">${icon('lock', 24)}</button></div>`;
  dock.innerHTML = NAV.map(([id, t, ic, c]) => `<a href="#/${id}" class="${route === id ? 'on' : ''}" style="--tc:${c}" ${route === id ? 'aria-current="page"' : ''}><span class="dic">${icon(ic, 30)}</span><span>${t}</span></a>`).join('');
}
function setFull(on) { document.body.classList.toggle('full', on); }

function applyPrefs() { const t = S.get().settings; document.documentElement.style.setProperty('--zoom', { m: 1, l: 1.15, xl: 1.3 }[t.textSize] || 1); document.body.classList.toggle('calm', !!t.calm); document.body.classList.toggle('young', !!S.profile() && ['3-4', '5-6'].includes(S.currentBand())); }
function render() {
  applyPrefs(); stopSpeak(); const [r = 'home', a, b] = (location.hash.replace(/^#\/?/, '') || 'home').split('/'); route = r;
  const p = S.profile();
  if (!p) { setFull(true); view.innerHTML = V.welcome(); $('#wn')?.focus(); return; }
  if (S.inBedtime() && Date.now() > ext) return block('bed');
  setFull(false); view.classList.remove('flush'); chrome();
  const lim = S.get().parent.limit; if (lim && S.minutesToday() >= lim && Date.now() > ext) return block('limit');
  if (r === 'lesson') return lessonView(a);
  if (r === 'game') return gameView(a);
  if (r === 'story') return storyView(a, +b || 0);
  if (r === 'parents') return parentsView();
  if (r === 'explore') { view.innerHTML = explore(a); bindExplore(view); window.scrollTo({ top: 0 }); return; }
  const map = { home: () => V.home(), learn: () => V.learn(a), games: () => V.games(), stories: () => V.stories(), bag: () => V.bag() };
  view.innerHTML = (map[r] || map.home)(); view.focus({ preventScroll: true }); window.scrollTo({ top: 0 });
}

function lessonView(id) {
  const l = byId[id]; if (!l) { location.hash = '#/home'; return; }
  if (S.isLocked(l)) { toast('أكمل الدرس السابق أولاً'); location.hash = '#/learn/' + l.subject; return; }
  setFull(true); const s = subj(l.subject), kid = ['3-4', '5-6'].includes(S.currentBand()) && S.get().settings.autospeak;
  const nextOf = () => { const ls = S.lessonsFor(l.subject, l.band), i = ls.findIndex(x => x.id === l.id); return ls[i + 1] && !S.isLocked(ls[i + 1]) ? ls[i + 1] : null; };
  run({ root: view, items: l.items, title: l.title, goal: l.goal, icon: l.icon, color: s.c, auto: kid,
    finish: (ok, t) => { const r = S.record(l.id, ok, t), n = nextOf(); r.nextHtml = n ? `<button class="btn big" data-go="#/lesson/${n.id}">الدرس التالي ${icon('next', 22)}</button>` : ''; r.closeLabel = 'العودة للمسار'; return r; },
    close: () => { location.hash = '#/learn/' + l.subject; }, again: () => render() });
}

const EM = ['🐢', '🦊', '🐝', '🦋', '🐪', '🦉', '🐬', '🐘', '🦁', '🐸', '🌻', '🚀'];
function gameItems(id) {
  const b = S.currentBand(), r = rng(String(Math.random())), pool = k => LESSONS.filter(l => l.subject === k && l.band === b);
  if (id === 'memory') return [{ t: 'pairs', q: 'اقلب البطاقات وجد الأزواج', items: sample(EM, { '3-4': 3, '5-6': 4, '7-8': 6, '9-10': 8 }[b], r) }];
  if (id === 'sort') { const all = LESSONS.filter(l => l.subject === 'logic').flatMap(l => l.items.filter(i => i.t === 'sort')); return sample(all, 2, r); }
  if (id === 'odd') { const all = LESSONS.filter(l => l.id.startsWith('lg-odd')).flatMap(l => l.items); return sample(all, 5, r); }
  if (id === 'math') { const all = pool('math').flatMap(l => l.items.filter(i => i.t === 'choose')); return sample(all, 5, r); }
  if (id === 'words') return sample(WORDS.filter(([w]) => strip(w).length <= (b === '5-6' ? 4 : 5)), 5, r).map(([w, e]) => ({ t: 'order', q: 'رتّب الحروف لتكوّن الكلمة', items: Array.from(strip(w)), pic: e, join: true }));
  return [];
}
function gameView(id) {
  setFull(true);
  if (id === 'draw') return studio(view, () => { location.hash = '#/games'; });
  const g = V.GAMES.find(x => x.id === id), items = gameItems(id); if (!g || !items.length) { location.hash = '#/games'; return; }
  run({ root: view, items, title: g.name, intro: false, color: g.c, auto: false, finish: () => ({ game: true, closeLabel: 'الألعاب', nextHtml: '' }), close: () => { location.hash = '#/games'; }, again: () => render() });
}

function storyView(id, k) {
  const s = STORIES.find(x => x.id === id); if (!s) { location.hash = '#/stories'; return; }
  view.innerHTML = V.storyPage(id, k); window.scrollTo({ top: 0 }); view.focus({ preventScroll: true });
  const say = $('[data-say-story]', view); if (say) say.onclick = () => speak($('#rtext').textContent);
  if (k >= s.pages.length) { const [q, a, w1, w2] = s.q, act = ch(q, a, [w1, w2], rng('s' + id)), host = $('#storyQ'); mount(host, act, { auto: false, onDone: () => { S.markRead(id); toast('أحسنت! أنهيت الحكاية'); sfx('win'); host.insertAdjacentHTML('afterend', '<div class="row center"><a class="btn" href="#/stories">حكايات أخرى</a></div>'); } }); }
}

async function parentsView() {
  setFull(false); chrome(); view.innerHTML = '<section class="block"></section>';
  const ok = await gate(); if (!ok) { location.hash = '#/home'; return; }
  view.innerHTML = V.parents(); window.scrollTo({ top: 0 });
}

// ---------- نماذج ----------
function profileForm(ex) {
  return new Promise(res => {
    const m = modal(`<h2>${ex ? 'تعديل الملف' : 'إضافة طفل'}</h2><form class="form" novalidate><label class="lbl" for="pn">الاسم أو اللقب</label><input class="field" id="pn" maxlength="16" value="${ex ? esc(ex.name) : ''}" autocomplete="off"><fieldset><legend class="lbl">العمر</legend><div class="choices ages">${[3, 4, 5, 6, 7, 8, 9, 10].map(a => `<label><input type="radio" name="age" value="${a}" ${(ex ? ex.age : 6) === a ? 'checked' : ''}><span>${a}</span></label>`).join('')}</div></fieldset><fieldset><legend class="lbl">الصورة</legend><div class="choices avs">${S.AVATARS.map((a, i) => `<label><input type="radio" name="av" value="${i}" ${(ex ? ex.avatar : 0) === i ? 'checked' : ''}><span style="background:${a[1]}">${a[0]}</span></label>`).join('')}</div></fieldset><div class="row"><button class="btn" type="submit">حفظ</button><button class="btn ghost" type="button" data-c>إلغاء</button></div></form>`, { cls: 'wide' });
    const f = m.q('form'); f.onsubmit = e => { e.preventDefault(); const name = m.q('#pn').value.trim(); if (!name) { m.q('#pn').focus(); return; } m.close(); res({ name, age: +f.age.value, av: +f.av.value }); };
    m.el.addEventListener('click', e => { if (e.target.closest('[data-c]')) { m.close(); res(null); } });
  });
}
function pinForm() {
  return new Promise(res => { const m = modal(`<h2>رقم سرّي جديد</h2><p class="sub">أدخل 4 أرقام تتذكّرها.</p><input class="field" id="np" type="password" inputmode="numeric" maxlength="4" autocomplete="off" aria-label="الرقم السرّي"><p class="fb hint" id="ne" role="alert"></p><div class="row"><button class="btn" data-ok>حفظ</button><button class="btn ghost" data-c>إلغاء</button></div>`);
    m.el.onclick = e => { if (e.target.closest('[data-ok]')) { const v = m.q('#np').value; if (/^\d{4}$/.test(v)) { m.close(); res(v); } else m.q('#ne').textContent = 'يجب أن يكون الرقم 4 أرقام.'; } else if (e.target.closest('[data-c]') || e.target === m.el) { m.close(); res(null); } }; });
}

// ---------- الأحداث العامة ----------
document.addEventListener('submit', async e => {
  if (e.target.id !== 'welcomeForm') return; e.preventDefault(); const f = e.target, name = f.name.value.trim();
  if (!name) { f.name.focus(); toast('اكتب اسم الطفل أو لقبه'); return; }
  S.addProfile(name, +f.age.value, +f.av.value); location.hash = '#/home'; render();
});
document.addEventListener('click', async e => {
  const t = e.target;
  if (t.closest('[data-parents]')) { location.hash = '#/parents'; if (route === 'parents') render(); return; }
  if (t.closest('[data-who]')) return whoMenu();
  if (t.closest('[data-band]')) { if (S.get().parent.lockBand && !await gate()) return; const m = modal(`<h2>اختر المستوى</h2><div class="bands">${BANDS.map(b => `<button class="btn ${b === S.currentBand() ? '' : 'ghost'}" data-b="${b}">${BAND_NAMES[b]} <small>${b.replace('-', '–')} سنوات</small></button>`).join('')}</div>`); m.el.onclick = ev => { const b = ev.target.closest('[data-b]'); if (b) { S.setBandOverride(b.dataset.b); m.close(); render(); } }; return; }
  const da = t.closest('[data-delart]'); if (da) { if (await confirmDialog('حذف هذه الرسمة؟', 'احذف', 'ألغِ')) { S.delArt(+da.dataset.delart); render(); } return; }
  if (route !== 'parents') return;
  if (t.closest('[data-print]')) { let a = $('#printArea'); if (!a) { a = document.createElement('div'); a.id = 'printArea'; document.body.appendChild(a); } a.innerHTML = V.reportHtml(); window.print(); return; }
  if (t.closest('[data-lock]')) { closeGate(); location.hash = '#/home'; return; }
  const sw = t.closest('[data-switch]'); if (sw) { S.setActive(sw.dataset.switch); render(); return; }
  if (t.closest('[data-add]')) { const r = await profileForm(); if (r) { S.addProfile(r.name, r.age, r.av); render(); } return; }
  const ed = t.closest('[data-edit]'); if (ed) { const c = S.get().profiles.find(x => x.id === ed.dataset.edit), r = await profileForm(c); if (r) { S.updateProfile(c.id, { name: r.name, age: r.age, avatar: r.av, bandOverride: undefined }); render(); } return; }
  const dl = t.closest('[data-del]'); if (dl) { const c = S.get().profiles.find(x => x.id === dl.dataset.del); if (await confirmDialog(`حذف ملف «${c.name}» وكل تقدّمه نهائياً؟`, 'احذف', 'ألغِ')) { S.removeProfile(c.id); if (!S.profile()) { location.hash = '#/home'; } render(); } return; }
  if (t.closest('[data-pin]')) { const v = await pinForm(); if (v) { await S.setPin(v); toast('تم حفظ الرقم السرّي'); render(); } return; }
  if (t.closest('[data-nopin]')) { await S.setPin(null); toast('أُزيل الرقم السرّي'); render(); return; }
  if (t.closest('[data-export]')) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(S.get())], { type: 'application/json' })); a.download = `burum-backup-${S.todayKey()}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 500); return; }
  if (t.closest('[data-reset]')) { if (await confirmDialog('سيُحذف كل شيء: الأطفال والتقدّم والإعدادات. هل أنت متأكد؟', 'احذف كل شيء', 'ألغِ')) { S.reset(); closeGate(); location.hash = '#/home'; render(); } }
});
document.addEventListener('change', async e => {
  if (route !== 'parents') return; const t = e.target;
  if (t.matches('[data-import]')) { const f = t.files[0]; if (!f) return; try { const d = JSON.parse(await f.text()); if (d.v !== 2 || !Array.isArray(d.profiles)) throw 0; if (await confirmDialog('سيُستبدل كل ما على هذا الجهاز بمحتوى الملف. متابعة؟', 'استبدل', 'ألغِ')) { S.replaceAll(d); toast('تم الاستيراد'); render(); } } catch { toast('هذا الملف ليس نسخة صالحة من بُرعُم'); } return; }
  const k = t.dataset.set; if (!k) return; const path = k.split('.'), key = path.pop(); let o = S.get(); path.forEach(x => o = o[x]);
  o[key] = t.type === 'checkbox' ? t.checked : /^\d+$/.test(t.value) ? +t.value : t.value; S.save(); applyPrefs(); if (k === 'parent.bed.on') render();
});
function whoMenu() {
  const g = S.get(), m = modal(`<h2>من يتعلّم الآن؟</h2><ul class="plist pick">${g.profiles.map(c => `<li><button class="who2 ${c.id === g.active ? 'act' : ''}" data-pick="${c.id}">${avatarHtml(c.avatar)}<b>${esc(c.name)}</b></button></li>`).join('')}</ul><button class="btn ghost" data-parents-go>${icon('lock', 20)} ركن الأسرة</button>`);
  m.el.onclick = e => { const p = e.target.closest('[data-pick]'); if (p) { S.setActive(p.dataset.pick); m.close(); location.hash = '#/home'; render(); } else if (e.target.closest('[data-parents-go]')) { m.close(); location.hash = '#/parents'; } };
}

// ---------- الوقت والاستراحة ----------
['pointerdown', 'keydown'].forEach(ev => addEventListener(ev, () => { if (Date.now() - lastAct > 120000) sess = 0; lastAct = Date.now(); }, { passive: true }));
function block(kind) {
  if (blocking) return; blocking = true; setFull(true); stopSpeak();
  const text = kind === 'bed' ? 'حان وقت النوم. نراك غداً يا صديقي!' : 'انتهى وقت التعلّم لهذا اليوم. أحسنت!';
  const m = bigMascotDialog('sleep', kind === 'bed' ? 'تصبح على خير' : 'إلى اللقاء', text, '<button class="btn ghost" data-parent>ولي الأمر</button>');
  m.el.onclick = async e => { if (!e.target.closest('[data-parent]')) return; closeGate(); if (await gate()) { ext = Date.now() + 10 * 60e3; m.close(); blocking = false; toast('تمّ تمديد الوقت 10 دقائق'); render(); } };
}
function breakTime() {
  if (blocking) return; blocking = true; const m = bigMascotDialog('think', 'وقت استراحة قصيرة', 'قم وتحرّك قليلاً، اشرب ماءً وانظر بعيداً عن الشاشة.', '<button class="btn" data-go disabled>أكمل بعد 30 ثانية</button>'), b = m.q('[data-go]'); let n = 30;
  const iv = setInterval(() => { n--; if (n > 0) b.textContent = `أكمل بعد ${n} ثانية`; else { clearInterval(iv); b.disabled = false; b.textContent = 'أكمل التعلّم'; } }, 1000);
  b.onclick = () => { if (!b.disabled) { m.close(); blocking = false; } };
}
setInterval(() => {
  if (!S.profile() || document.visibilityState !== 'visible' || route === 'parents' || Date.now() - lastAct > 60000 || blocking) return;
  S.addMinutes(.25); sess += .25; const P = S.get().parent;
  if (S.inBedtime() && Date.now() > ext) return block('bed'); if (P.limit && S.minutesToday() >= P.limit && Date.now() > ext) return block('limit'); if (sess >= P.brk) { sess = 0; breakTime(); }
}, 15000);

S.onChange(() => { const s = $('.chipstar'); if (s && S.profile()) s.innerHTML = `${icon('star', 20)} ${S.totalStars()}`; });
addEventListener('hashchange', render);
if ('serviceWorker' in navigator) addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => { }));
render();

// محرّك الأنشطة: choose / order / sort / pairs / trace. كل نشاط ينادي onDone({ok}) مرة واحدة فقط.
import { icon, clockSvg, shapeSvg, swatch, pieSvg } from './art.js';
import { sfx, speak } from './audio.js';
import { shuffle, rng } from './content/util.js';
export const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const PIC = /^[\p{Extended_Pictographic}\uFE0F\u200D\u20E3\s]+$/u;
const PRAISE = ['أحسنت!', 'رائع!', 'ما شاء الله!', 'فكرة جميلة!', 'ممتاز!', 'أنت مبدع!'];
const TRY = ['قريب! جرّب مرة أخرى.', 'فكّر معي… حاول من جديد.', 'لا بأس، انظر جيداً وحاول مرة أخرى.'];
const rnd = a => a[Math.floor(Math.random() * a.length)];
const sayBtn = (t, lang) => t ? `<button class="say" type="button" data-say="${esc(t)}" data-lang="${lang || 'ar'}" aria-label="اسمعني">${icon('sound', 22)}</button>` : '';

export function visHtml(v) {
  if (!v) return '';
  if (Array.isArray(v)) return `<div class="vis seqv" aria-label="نمط">${v.map(t => t === '?' ? '<span class="tile q">؟</span>' : `<span class="tile">${esc(t)}</span>`).join('')}</div>`;
  if (typeof v === 'object') {
    if (v.clock) return `<div class="vis">${clockSvg(v.clock[0], v.clock[1])}</div>`;
    if (v.sw) return `<div class="vis">${swatch(v.sw)}</div>`;
    if (v.shape) return `<div class="vis">${shapeSvg(v.shape, v.c)}</div>`;
    if (v.pie) return `<div class="vis">${pieSvg(v.pie[0], v.pie[1])}</div>`;
  }
  if (typeof v === 'string' && v.includes('|')) { const [a, b] = v.split('|'); return `<div class="vis duo"><div class="grp"><small>الأولى</small><span>${esc(a)}</span></div><div class="grp"><small>الثانية</small><span>${esc(b)}</span></div></div>`; }
  const t = String(v); return `<div class="vis ${[...t].length > 8 ? 'sm' : ''}">${esc(t)}</div>`;
}

export function mount(host, act, ctx) {
  const done = ok => { if (done.d) return; done.d = true; ctx.onDone({ ok }); };
  const M = { choose, order, sort, pairs, trace }[act.t];
  host.onclick = e => { const b = e.target.closest('[data-say]'); if (b) speak(b.dataset.say, b.dataset.lang); };
  M(host, act, done, ctx);
  if (ctx.auto && (act.say || act.q) && act.t !== 'pairs') setTimeout(() => speak(act.say || act.q, act.lang || 'ar'), 350);
}

function choose(host, a, done) {
  const pics = a.opts.every(o => PIC.test(o)), big = a.big || pics;
  host.innerHTML = `${a.passage ? `<p class="passage">${esc(a.passage)}</p>` : ''}<h2 class="q">${esc(a.q)} ${sayBtn(a.say || a.q, a.lang)}</h2>${visHtml(a.vis)}<div class="opts ${pics ? 'pics' : ''} ${big ? 'big' : ''}" role="group" aria-label="الخيارات">${a.opts.map((o, i) => `<button class="opt" type="button" data-i="${i}" ${a.lang === 'en' && !pics ? 'dir="auto"' : ''}>${esc(o)}</button>`).join('')}</div><p class="fb" role="status" aria-live="polite"></p>`;
  const fb = host.querySelector('.fb'); let wrong = 0, over = false;
  host.querySelector('.opts').onclick = e => {
    const b = e.target.closest('.opt'); if (!b || over || b.disabled) return; const i = +b.dataset.i;
    if (i === a.a) { over = true; b.classList.add('ok'); sfx('good'); fb.textContent = rnd(PRAISE); fb.className = 'fb good'; host.querySelectorAll('.opt').forEach(x => x.disabled = true); done(wrong === 0); }
    else { wrong++; b.classList.add('bad'); b.disabled = true; sfx('soft');
      if (wrong >= 2 || a.opts.length - wrong <= 1) { over = true; const c = host.querySelectorAll('.opt')[a.a]; c.classList.add('ok', 'reveal'); host.querySelectorAll('.opt').forEach(x => x.disabled = true); fb.innerHTML = `الإجابة الصحيحة: <b>${esc(a.opts[a.a])}</b>. ستجدها أسهل في المرة القادمة.`; fb.className = 'fb hint'; done(false); }
      else { fb.textContent = rnd(TRY); fb.className = 'fb hint'; } }
  };
}

function order(host, a, done) {
  const r = rng('o' + a.items.join('')), n = a.items.length;
  let pool = shuffle(a.items.map((x, i) => ({ x, i })), r); if (pool.every((p, k) => p.i === k)) pool.reverse();
  let placed = [], tries = 0, over = false;
  const draw = (msg, cls) => {
    host.innerHTML = `<h2 class="q">${esc(a.q)}</h2>${a.pic ? `<div class="vis">${esc(a.pic)}</div>` : ''}<div class="slots" aria-label="الإجابة">${Array.from({ length: n }, (_, k) => placed[k] ? `<button type="button" class="tok placed" data-un="${k}" ${over ? 'disabled' : ''}>${esc(placed[k].x)}</button>` : '<span class="slot"></span>').join('')}</div>${a.join && placed.length ? `<div class="joined">${esc(placed.map(p => p.x).join(''))}</div>` : ''}<div class="pool" aria-label="الخيارات">${pool.map(p => `<button type="button" class="tok" data-pick="${p.i}" ${over ? 'disabled' : ''}>${esc(p.x)}</button>`).join('')}</div><p class="fb ${cls || ''}" role="status" aria-live="polite">${msg || ''}</p>`;
  };
  const check = () => {
    const ok = placed.every((p, k) => p.x === a.items[k]);
    if (ok) { over = true; sfx('good'); draw(rnd(PRAISE), 'good'); done(tries === 0); return; }
    tries++; sfx('soft');
    if (tries >= 2) { over = true; placed = a.items.map((x, i) => ({ x, i })); pool = []; draw('الترتيب الصحيح ظهر أمامك. تأمّله جيداً.', 'hint'); done(false); return; }
    draw(rnd(TRY), 'hint'); setTimeout(() => { if (!over) { pool = shuffle([...pool, ...placed], r); placed = []; draw(); } }, 900);
  };
  host.onclick = e => {
    const s = e.target.closest('[data-say]'); if (s) return speak(s.dataset.say, s.dataset.lang);
    if (over) return; const p = e.target.closest('[data-pick]'), u = e.target.closest('[data-un]');
    if (p) { const k = pool.findIndex(x => x.i === +p.dataset.pick); placed.push(pool.splice(k, 1)[0]); sfx('tap'); draw(); if (placed.length === n) check(); }
    else if (u) { pool.push(placed.splice(+u.dataset.un, 1)[0]); draw(); }
  };
  draw();
}

function sort(host, a, done) {
  let items = a.items.map((x, i) => ({ ...x, i, placed: false })), sel = null, wrong = 0, count = 0;
  const draw = () => {
    host.innerHTML = `<h2 class="q">${esc(a.q)}</h2><p class="sub">اختر صورة، ثم اختر السلّة المناسبة لها.</p><div class="pool">${items.filter(x => !x.placed).map(x => `<button type="button" class="tok pic ${sel === x.i ? 'sel' : ''}" data-it="${x.i}" aria-pressed="${sel === x.i}">${esc(x.x)}</button>`).join('')}</div><div class="bins">${a.bins.map((b, k) => `<button type="button" class="bin" data-bin="${k}"><b>${esc(b.n)}</b><span class="bn-e" aria-hidden="true">${esc(b.e || '')}</span><span class="in">${items.filter(x => x.placed && x.b === k).map(x => esc(x.x)).join(' ')}</span></button>`).join('')}</div><p class="fb" role="status" aria-live="polite"></p>`;
  };
  host.onclick = e => {
    const s = e.target.closest('[data-say]'); if (s) return speak(s.dataset.say, s.dataset.lang);
    const it = e.target.closest('[data-it]'), bn = e.target.closest('[data-bin]');
    if (it) { sel = +it.dataset.it; sfx('tap'); draw(); }
    else if (bn && sel !== null) { const x = items[sel], k = +bn.dataset.bin;
      if (x.b === k) { x.placed = true; sel = null; count++; sfx('good'); draw(); if (count === items.length) { host.querySelector('.fb').textContent = rnd(PRAISE); host.querySelector('.fb').className = 'fb good'; done(wrong <= 1); } }
      else { wrong++; sfx('soft'); draw(); host.querySelector('.fb').textContent = 'فكّر مرة أخرى، هل هذا هو المكان المناسب؟'; host.querySelector('.fb').className = 'fb hint'; } }
  };
  draw();
}

function pairs(host, a, done) {
  const r = rng('p' + a.items.join('')), cards = shuffle([...a.items, ...a.items].map((x, i) => ({ x, i })), r), cols = cards.length <= 6 ? 3 : 4;
  let open = [], matched = new Set(), busy = false, moves = 0;
  const draw = () => { host.innerHTML = `<h2 class="q">${esc(a.q)}</h2><p class="sub">المحاولات: <b>${moves}</b></p><div class="memgrid" style="--cols:${cols}">${cards.map((c, k) => { const on = open.includes(k) || matched.has(k); return `<button type="button" class="mcard ${on ? 'on' : ''} ${matched.has(k) ? 'match' : ''}" data-k="${k}" aria-label="${on ? esc(c.x) : 'بطاقة مقلوبة'}" ${on ? 'disabled' : ''}><span>${on ? esc(c.x) : ''}</span></button>`; }).join('')}</div><p class="fb" role="status" aria-live="polite"></p>`; };
  host.onclick = e => {
    const b = e.target.closest('[data-k]'); if (!b || busy) return; const k = +b.dataset.k; open.push(k); sfx('flip'); draw();
    if (open.length === 2) { moves++; busy = true; const [p, q] = open;
      setTimeout(() => { if (cards[p].x === cards[q].x) { matched.add(p); matched.add(q); sfx('good'); } open = []; busy = false; draw();
        if (matched.size === cards.length) { const f = host.querySelector('.fb'); f.textContent = `أحسنت! أنهيت اللعبة في ${moves} محاولة.`; f.className = 'fb good'; done(true); } }, 750); }
  };
  draw();
}

function trace(host, a, done) {
  const SZ = 320; let drawing = false, last = null, strokes = 0, finished = false;
  host.innerHTML = `<h2 class="q">${esc(a.q)} ${sayBtn(a.say || a.q)}</h2><div class="tracebox"><canvas width="${SZ}" height="${SZ}" aria-label="لوحة التتبّع"></canvas></div><div class="meter" aria-hidden="true"><span></span></div><div class="row"><button type="button" class="btn ghost" data-clear>${icon('retry', 20)} امسح</button><button type="button" class="btn ghost" data-skip>تخطَّ</button><button type="button" class="btn" data-ok>${icon('check', 20)} تمّ</button></div><p class="fb" role="status" aria-live="polite"></p>`;
  const cv = host.querySelector('canvas'), x = cv.getContext('2d'), mask = document.createElement('canvas'), sk = document.createElement('canvas'); mask.width = mask.height = sk.width = sk.height = SZ;
  const mx = mask.getContext('2d'), sx = sk.getContext('2d'); let font = '800 250px "Baloo Bhaijaan 2",Cairo,"Segoe UI",Tahoma,Arial,sans-serif', gx = SZ / 2, gy = SZ / 2;
  mx.font = font; mx.textAlign = 'center'; mx.textBaseline = 'alphabetic';
  { // نضبط الحجم والموضع بحسب حدود الحرف الفعلية ليكون في منتصف اللوحة تماماً
    const m = mx.measureText(a.glyph), w = m.actualBoundingBoxLeft + m.actualBoundingBoxRight, h = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent, k = Math.min(1.25, SZ * .72 / Math.max(w, h, 1));
    font = `800 ${Math.round(250 * k)}px "Baloo Bhaijaan 2",Cairo,"Segoe UI",Tahoma,Arial,sans-serif`; mx.font = font; const m2 = mx.measureText(a.glyph);
    gx = SZ / 2 + (m2.actualBoundingBoxLeft - m2.actualBoundingBoxRight) / 2; gy = SZ / 2 + (m2.actualBoundingBoxAscent - m2.actualBoundingBoxDescent) / 2;
  }
  mx.fillText(a.glyph, gx, gy);
  const maskData = mx.getImageData(0, 0, SZ, SZ).data; let total = 0; for (let i = 3; i < maskData.length; i += 4) if (maskData[i] > 100) total++;
  const paint = () => { x.clearRect(0, 0, SZ, SZ); x.save(); x.font = font; x.textAlign = 'center'; x.textBaseline = 'alphabetic'; x.fillStyle = '#C5D8CE'; x.fillText(a.glyph, gx, gy); x.restore(); x.drawImage(sk, 0, 0); };
  const cover = () => { const sd = sx.getImageData(0, 0, SZ, SZ).data; let hit = 0; for (let i = 3; i < maskData.length; i += 4) if (maskData[i] > 100 && sd[i] > 60) hit++; return total ? hit / total : 1; };
  const meter = () => { const c = Math.min(1, cover() / .6); host.querySelector('.meter span').style.width = Math.round(c * 100) + '%'; return cover(); };
  const pos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * SZ / r.width, (e.clientY - r.top) * SZ / r.height]; };
  const line = (p, q) => { sx.strokeStyle = '#1D8F5A'; sx.lineWidth = 30; sx.lineCap = sx.lineJoin = 'round'; sx.beginPath(); sx.moveTo(p[0], p[1]); sx.lineTo(q[0], q[1]); sx.stroke(); };
  cv.style.touchAction = 'none';
  cv.onpointerdown = e => { if (finished) return; drawing = true; last = pos(e); line(last, last); paint(); cv.setPointerCapture(e.pointerId); };
  cv.onpointermove = e => { if (!drawing) return; const p = pos(e); line(last, p); last = p; paint(); };
  const up = () => { if (!drawing) return; drawing = false; strokes++; const c = meter(); if (c >= .6) finish(true); };
  cv.onpointerup = up; cv.onpointercancel = up;
  const finish = ok => { if (finished) return; finished = true; sfx('good'); const f = host.querySelector('.fb'); f.textContent = ok ? rnd(PRAISE) : 'لا بأس، سنتدرّب مرة أخرى.'; f.className = 'fb good'; done(true); };
  host.addEventListener('click', e => {
    if (e.target.closest('[data-clear]')) { sx.clearRect(0, 0, SZ, SZ); paint(); meter(); }
    if (e.target.closest('[data-skip]')) finish(false);
    if (e.target.closest('[data-ok]')) { const c = meter(); if (c >= .35) finish(true); else { const f = host.querySelector('.fb'); f.textContent = 'تتبّع الحرف كله بإصبعك أولاً.'; f.className = 'fb hint'; } }
  });
  paint();
}

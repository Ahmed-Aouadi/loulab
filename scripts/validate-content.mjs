// يفحص كتالوج الدروس: بنية كل نشاط، تفرّد الإجابات، تفرّد المعرّفات، وتغطية المواد. يُنهي العملية بخطأ إن وُجدت مشكلة.
import { LESSONS, STORIES, SUBJECTS, BANDS } from '../js/content/index.js';
const errs = [], seen = new Set(), E = (id, m) => errs.push(`${id}: ${m}`);
let acts = 0;
for (const l of LESSONS) {
  if (seen.has(l.id)) E(l.id, 'معرّف مكرّر'); seen.add(l.id);
  if (!SUBJECTS.some(s => s.id === l.subject)) E(l.id, 'مادة غير معروفة');
  if (!BANDS.includes(l.band)) E(l.id, 'فئة عمرية غير صالحة');
  if (!l.title || !l.goal || !l.icon) E(l.id, 'حقول ناقصة');
  if (!l.items || l.items.length < 2) E(l.id, 'أقل من نشاطين');
  (l.items || []).forEach((a, i) => {
    acts++; const w = `${l.id}#${i + 1}`;
    if (a.t === 'choose') {
      if (!a.q) E(w, 'سؤال فارغ');
      if (!Array.isArray(a.opts) || a.opts.length < 2) return E(w, 'أقل من خيارين');
      if (new Set(a.opts).size !== a.opts.length) E(w, 'خيارات مكرّرة');
      if (!(a.a >= 0 && a.a < a.opts.length)) E(w, 'فهرس الإجابة خارج النطاق');
      if (a.opts.some(o => !String(o).trim())) E(w, 'خيار فارغ');
    } else if (a.t === 'order') {
      if (!a.items || a.items.length < 2) E(w, 'عناصر ترتيب قليلة');
    } else if (a.t === 'sort') {
      if (!a.bins || a.bins.length < 2 || !a.items?.length) E(w, 'تصنيف ناقص');
      else if (a.items.some(x => !(x.b >= 0 && x.b < a.bins.length))) E(w, 'سلّة غير صالحة');
    } else if (a.t === 'pairs') {
      if (!a.items || a.items.length < 3) E(w, 'أزواج قليلة');
    } else if (a.t === 'trace') {
      if (!a.glyph) E(w, 'حرف التتبّع ناقص');
    } else E(w, 'نوع نشاط غير معروف: ' + a.t);
  });
}
// رموز إيموجي حديثة (Unicode 12+) تظهر مربعات على الأجهزة الأقدم: نمنعها في المحتوى
const OLD = /[\u{1FA70}-\u{1FAFF}]|\u{1F43B}\u200D\u2744|\u{1F9D1}\u200D/u;
if (OLD.test(JSON.stringify({ LESSONS, STORIES }))) E('emoji', 'يوجد إيموجي حديث قد لا يظهر على الأجهزة القديمة');
STORIES.forEach(s => { if (!s.pages?.length || !s.q) E('story-' + s.id, 'قصة ناقصة'); });
// مواد بلا دروس لفئة عمرية: مسموح فقط لبلدي والعالم تحت 7 سنوات
for (const b of BANDS) for (const s of SUBJECTS) if (!LESSONS.some(l => l.band === b && l.subject === s.id) && !(s.id === 'country' && b === '3-4')) E(`${b}/${s.id}`, 'لا دروس');
const stats = Object.fromEntries(BANDS.map(b => [b, LESSONS.filter(l => l.band === b).length]));
console.log(`الدروس: ${LESSONS.length} | الأنشطة: ${acts} | القصص: ${STORIES.length}`);
console.log('حسب الفئة:', JSON.stringify(stats));
if (errs.length) { console.error('\nأخطاء المحتوى:\n- ' + errs.join('\n- ')); process.exit(1); }
console.log('المحتوى سليم ✔');

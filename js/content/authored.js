import { rng, ch, lesson } from './util.js';
// دروس مكتوبة يدوياً: كل سؤال [نص، الإجابة الصحيحة، خطأ، خطأ، صورة اختيارية]
export const topic = (subject, slug, band, unit, title, icon, goal, qs) => { const r = rng(slug); return lesson(subject, slug, band, unit, title, icon, goal, qs.map(([q, a, w1, w2, vis]) => ch(q, a, [w1, w2], r, vis ? { vis } : {}))); };
export const seq = (subject, slug, band, unit, title, icon, goal, lists, q = 'رتّب بالترتيب الصحيح') => lesson(subject, slug, band, unit, title, icon, goal, lists.map(items => ({ t: 'order', q, items })));

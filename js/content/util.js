// أدوات مشتركة لتوليد المحتوى بشكل ثابت (deterministic): نفس المعرّف يعطي نفس الأسئلة دائماً.
export const hash = s => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
export const rng = seed => { let a = typeof seed === 'string' ? hash(seed) : seed; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
export const shuffle = (arr, r) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const sample = (arr, n, r) => shuffle(arr, r).slice(0, n);
export const pick = (arr, r) => arr[Math.floor(r() * arr.length)];
export const int = (r, lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
export const strip = s => s.replace(/[\u064B-\u0652\u0670]/g, '');
// سؤال اختيار من متعدد: الإجابة الصحيحة + مشتتات، بترتيب ثابت.
export const ch = (q, right, wrong, r, x = {}) => {
  const w = [...new Set(wrong.map(String))].filter(o => o !== String(right));
  const opts = shuffle([String(right), ...w], r);
  return { t: 'choose', q, opts, a: opts.indexOf(String(right)), ...x };
};
// أعداد قريبة من الإجابة (مشتتات معقولة)
export const near = (r, c, lo = 0, hi = 999, k = 2) => {
  const pool = []; for (let d = -4; d <= 4; d++) { const v = c + d; if (d && v >= lo && v <= hi) pool.push(v); }
  return sample(pool, k, r);
};
export const lesson = (subject, slug, band, unit, title, icon, goal, items) => ({ id: slug, subject, band, unit, title, icon, goal, items });

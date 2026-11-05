// الحالة المحلية: ملفات الأطفال، التقدم، إعدادات الأهل. كل شيء في localStorage على هذا الجهاز فقط.
import { LESSONS, SUBJECTS, byId, lessonsOf, BANDS } from './content/index.js';
import { rng, sample } from './content/util.js';
const KEY = 'burum.v2';
export const bandOf = a => a <= 4 ? '3-4' : a <= 6 ? '5-6' : a <= 8 ? '7-8' : '9-10';
export const AVATARS = [['🦊', '#FFD9B8'], ['🐪', '#F6E3A8'], ['🐢', '#C9EFC6'], ['🦉', '#D8D2F4'], ['🦋', '#CFEAFB'], ['🐝', '#FFEFA6'], ['🐘', '#E1E4EC'], ['🐬', '#BFE6F2']];
export const STICKERS = ['🦊', '🐪', '🐢', '🦉', '🦋', '🐝', '🐘', '🐬', '🌻', '🌈', '🚀', '🍉', '🎈', '🌙', '⭐', '🦁', '🐠', '🍓', '🌴', '⛵', '🎨', '🧸', '🍀', '🏆'];
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
export const todayKey = today;
const defaults = () => ({ v: 2, active: null, profiles: [], parent: { pin: null, limit: 0, brk: 20, bed: { on: false, from: '20:00', to: '06:00' }, lockSeq: false, lockBand: true }, settings: { sound: true, speech: true, autospeak: true, calm: false, textSize: 'm' } });
const merge = (a, b) => { for (const k in b) a[k] = (a[k] && typeof a[k] === 'object' && !Array.isArray(a[k]) && b[k] && typeof b[k] === 'object') ? merge(a[k], b[k]) : b[k]; return a; };
let S = load();
function load() {
  try { const raw = localStorage.getItem(KEY); if (raw) { const d = JSON.parse(raw); if (d && d.v === 2 && Array.isArray(d.profiles)) return merge(defaults(), d); } } catch { /* بيانات تالفة: نبدأ من جديد */ }
  const d = defaults();
  try {
    const old = JSON.parse(localStorage.getItem('buroom-state') || 'null');
    if (old && typeof old.name === 'string' && old.name.trim()) {
      const p = newProfile(old.name, Math.min(10, Math.max(3, +old.age || 6)), 0);
      d.profiles.push(p); d.active = p.id;
      // احفظ النسخة الجديدة أولاً؛ لا تحذف بيانات الإصدار القديم قبل نجاح الكتابة.
      localStorage.setItem(KEY, JSON.stringify(d));
      localStorage.removeItem('buroom-state');
    }
  } catch { /* تعذّر الترحيل: نُبقي النسخة القديمة كما هي للمحاولة لاحقاً */ }
  return d;
}
const listeners = new Set();
export const onChange = f => listeners.add(f);
export function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* الذاكرة ممتلئة */ } listeners.forEach(f => f()); }
export const get = () => S;
export const replaceAll = d => { S = merge(defaults(), d); save(); };
function newProfile(name, age, av) { return { id: 'p' + Date.now().toString(36) + Math.floor(Math.random() * 1e3), name, age, avatar: av, created: today(), progress: {}, stickers: [], badges: [], minutes: {}, art: [], read: [], mission: null }; }
export const profile = () => S.profiles.find(p => p.id === S.active) || null;
export function addProfile(name, age, av) { if (S.profiles.length >= 4) return null; const p = newProfile(name.trim().slice(0, 16) || 'صديقي', +age, av); S.profiles.push(p); S.active = p.id; save(); return p; }
export function updateProfile(id, patch) { const p = S.profiles.find(x => x.id === id); if (p) { Object.assign(p, patch); save(); } }
export function removeProfile(id) { S.profiles = S.profiles.filter(p => p.id !== id); if (S.active === id) S.active = S.profiles[0]?.id || null; save(); }
export const setActive = id => { S.active = id; save(); };
export const band = () => bandOf(profile()?.age || 6);
export const setBandOverride = b => { const p = profile(); if (p) { p.bandOverride = b; save(); } };
export const currentBand = () => profile()?.bandOverride || band();
export const lessonsFor = (subject, b = currentBand()) => lessonsOf(subject, b);

// ---------- التقدّم ----------
export const prog = id => profile()?.progress[id] || null;
export const stars = id => prog(id)?.stars || 0;
export const totalStars = () => Object.values(profile()?.progress || {}).reduce((s, x) => s + x.stars, 0);
export const completedCount = () => Object.keys(profile()?.progress || {}).length;
export function record(lessonId, correct, total) {
  const p = profile(); if (!p) return { stars: 1 };
  const ratio = total ? correct / total : 1, st = ratio >= .9 ? 3 : ratio >= .6 ? 2 : 1, old = p.progress[lessonId], first = !old;
  p.progress[lessonId] = { stars: Math.max(old?.stars || 0, st), plays: (old?.plays || 0) + 1, last: today(), best: Math.max(old?.best || 0, Math.round(ratio * 100)) };
  const unlocked = [], newBadges = [];
  if (first) { const n = Object.keys(p.progress).length; if (n % 3 === 0 && p.stickers.length < STICKERS.length) { const s = STICKERS[p.stickers.length]; p.stickers.push(s); unlocked.push(s); } }
  for (const b of badgeList(p)) if (b.ok && !p.badges.includes(b.id)) { p.badges.push(b.id); newBadges.push(b); }
  save(); return { stars: st, first, sticker: unlocked[0] || null, badges: newBadges };
}
export function subjectGrowth(subject) { // 0..1
  const ls = lessonsFor(subject); if (!ls.length) return 0;
  return ls.reduce((s, l) => s + stars(l.id), 0) / (ls.length * 3);
}
export const plantStage = g => g <= 0 ? 0 : g < .2 ? 1 : g < .45 ? 2 : g < .75 ? 3 : 4;
export function nextLesson(subject) { const ls = lessonsFor(subject); return ls.find(l => !prog(l.id)) || ls.find(l => stars(l.id) < 3) || ls[0]; }
export function isLocked(l) {
  if (!S.parent.lockSeq) return false;
  const ls = lessonsFor(l.subject, l.band), i = ls.findIndex(x => x.id === l.id);
  return i > 0 && !prog(ls[i - 1].id);
}
// مهمّة اليوم: 3 دروس متنوّعة، تُفضَّل المراجعة (نجمة واحدة أو مرّ أسبوع) ثم الجديد
export function mission() {
  const p = profile(); if (!p) return { ids: [], done: [] };
  const d = today();
  if (!p.mission || p.mission.date !== d || p.mission.band !== currentBand()) {
    const r = rng(p.id + d), subs = sample(SUBJECTS.filter(s => lessonsFor(s.id).length), 3, r), ids = [];
    subs.forEach(s => { const ls = lessonsFor(s.id), fresh = ls.find(l => !prog(l.id)), weak = ls.find(l => prog(l.id) && (stars(l.id) < 2)); ids.push((fresh || weak || ls[0]).id); });
    p.mission = { date: d, band: currentBand(), ids }; save();
  }
  return { ids: p.mission.ids, done: p.mission.ids.filter(id => prog(id)?.last === d) };
}
export function reviewList() { const p = profile(); if (!p) return []; const wk = Date.now() - 7 * 864e5; return LESSONS.filter(l => p.progress[l.id] && l.band === currentBand() && (p.progress[l.id].stars < 3)).slice(0, 8); }

// ---------- الأوسمة ----------
export function badgeList(p = profile()) {
  if (!p) return [];
  const n = Object.keys(p.progress).length, three = Object.values(p.progress).filter(x => x.stars === 3).length, days = Object.keys(p.minutes).length;
  const subjDone = SUBJECTS.filter(s => { const ls = lessonsOf(s.id, p.bandOverride || bandOf(p.age)); return ls.length && ls.every(l => p.progress[l.id]); }).length;
  return [
    { id: 'first', name: 'أول درس', ok: n >= 1, hint: 'أكمل درساً واحداً' }, { id: 'n5', name: 'خمس خطوات', ok: n >= 5, hint: 'أكمل 5 دروس' },
    { id: 'n20', name: 'مستكشف', ok: n >= 20, hint: 'أكمل 20 درساً' }, { id: 'n50', name: 'بطل بُرعُم', ok: n >= 50, hint: 'أكمل 50 درساً' },
    { id: 'three', name: 'ثلاث نجوم', ok: three >= 10, hint: '10 دروس بثلاث نجوم' }, { id: 'days', name: 'زائر دائم', ok: days >= 7, hint: 'العب في 7 أيام مختلفة' },
    { id: 'subj', name: 'أتقنت مادة', ok: subjDone >= 1, hint: 'أكمل كل دروس مادة واحدة' }, { id: 'story', name: 'قارئ حكايات', ok: p.read.length >= 3, hint: 'اقرأ 3 حكايات' },
    { id: 'art', name: 'فنّان صغير', ok: p.art.length >= 1, hint: 'احفظ رسمة في مرسمي' },
  ];
}
export function markRead(id) { const p = profile(); if (p && !p.read.includes(id)) { p.read.push(id); save(); } }
export function saveArt(url) { const p = profile(); if (!p) return; p.art.unshift(url); p.art = p.art.slice(0, 8); save(); }
export function delArt(i) { const p = profile(); if (p) { p.art.splice(i, 1); save(); } }

// ---------- الوقت ----------
export const minutesToday = (p = profile()) => p?.minutes[today()] || 0;
export function addMinutes(m) { const p = profile(); if (!p) return; p.minutes[today()] = +(minutesToday(p) + m).toFixed(2); const keys = Object.keys(p.minutes).sort(); while (keys.length > 60) delete p.minutes[keys.shift()]; save(); }
export function weekMinutes(p = profile()) { const out = []; for (let i = 6; i >= 0; i--) { const d = new Date(Date.now() - i * 864e5), k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; out.push([k, Math.round(p?.minutes[k] || 0)]); } return out; }
export function inBedtime() { const b = S.parent.bed; if (!b.on) return false; const n = new Date(), t = n.getHours() * 60 + n.getMinutes(), f = v => { const [h, m] = v.split(':'); return +h * 60 + +m; }, a = f(b.from), z = f(b.to); return a > z ? (t >= a || t < z) : (t >= a && t < z); }
// ---------- PIN ----------
export async function sha(s) { const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('burum:' + s)); return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join(''); }
export const hasPin = () => !!S.parent.pin;
export async function setPin(pin) { S.parent.pin = pin ? await sha(pin) : null; save(); }
export async function checkPin(pin) { return S.parent.pin === await sha(pin); }
export function reset() { localStorage.removeItem(KEY); S = defaults(); listeners.forEach(f => f()); }

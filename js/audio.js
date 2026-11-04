// الصوت: مؤثّرات خفيفة عبر WebAudio + النطق عبر محرّك الجهاز (لا ملفات صوتية ولا خدمات خارجية).
import { get } from './store.js';
let ctx; const AC = () => ctx || (ctx = new (window.AudioContext || window.webkitAudioContext)());
function tone(freq, t0, dur, type = 'sine', vol = .12) { const c = AC(), o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.value = freq; g.gain.setValueAtTime(0, c.currentTime + t0); g.gain.linearRampToValueAtTime(vol, c.currentTime + t0 + .02); g.gain.exponentialRampToValueAtTime(.0001, c.currentTime + t0 + dur); o.connect(g).connect(c.destination); o.start(c.currentTime + t0); o.stop(c.currentTime + t0 + dur + .05); }
const SFX = { good: [[660, 0, .14], [880, .1, .22]], win: [[523, 0, .15], [659, .13, .15], [784, .26, .15], [1047, .4, .35]], soft: [[330, 0, .2, 'triangle']], tap: [[500, 0, .06, 'triangle', .08]], flip: [[420, 0, .08, 'triangle', .08]] };
export function sfx(k) { if (!get().settings.sound) return; try { const c = AC(); if (c.state === 'suspended') c.resume(); (SFX[k] || []).forEach(([f, t, d, ty, v]) => tone(f, t, d, ty, v)); } catch { /* لا صوت */ } }
let voices = []; const load = () => { try { voices = speechSynthesis.getVoices(); } catch { voices = []; } };
if ('speechSynthesis' in window) { load(); speechSynthesis.onvoiceschanged = load; }
export const canSpeak = () => 'speechSynthesis' in window;
export const hasVoice = lang => voices.some(v => v.lang.toLowerCase().startsWith(lang));
export function speak(text, lang = 'ar', onend) {
  if (!get().settings.speech || !canSpeak() || !text) { onend && onend(); return false; }
  try {
    speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text.replace(/[|؟]/g, m => m === '؟' ? '؟' : ' ')); const v = voices.find(v => v.lang.toLowerCase().startsWith(lang));
    u.lang = v ? v.lang : (lang === 'ar' ? 'ar-SA' : 'en-US'); if (v) u.voice = v; u.rate = lang === 'ar' ? .82 : .85; u.pitch = 1.1; if (onend) { u.onend = onend; u.onerror = onend; }
    speechSynthesis.speak(u); return true;
  } catch { onend && onend(); return false; }
}
export const stopSpeak = () => { try { speechSynthesis.cancel(); } catch { /* */ } };

import { arabic } from './arabic.js';
import { math } from './math.js';
import { science } from './science.js';
import { english } from './english.js';
import { logic, life } from './more.js';
import { art, country, stories } from './rest.js';
export const BANDS = ['3-4', '5-6', '7-8', '9-10'];
export const BAND_NAMES = { '3-4': 'براعم صغيرة', '5-6': 'براعم نامية', '7-8': 'براعم مزهرة', '9-10': 'براعم مثمرة' };
// لكل مادة لون قويّ (نص أبيض عليه مقروء) ولون فاتح للخلفيات
export const SUBJECTS = [
  { id: 'arabic', name: 'لغتي', sub: 'حروف وكلمات وقراءة', c: '#C2410C', t: '#FFE8DA', icon: '🔤' },
  { id: 'math', name: 'أرقامي', sub: 'عدّ وجمع وضرب وأشكال', c: '#1D4ED8', t: '#DDE9FF', icon: '🔢' },
  { id: 'science', name: 'عالمي', sub: 'نبات وحيوان وفضاء وجسم', c: '#15803D', t: '#DDF5E4', icon: '🔬' },
  { id: 'english', name: 'ألسنتي', sub: 'كلمات وجمل بالإنجليزية', c: '#6D28D9', t: '#EBE2FF', icon: '🌐' },
  { id: 'logic', name: 'أفكّر', sub: 'أنماط وذاكرة وتصنيف', c: '#B45309', t: '#FFF0CC', icon: '🧠' },
  { id: 'life', name: 'قيمي ومهاراتي', sub: 'أدب وصحة وأمان', c: '#BE185D', t: '#FFE1EE', icon: '💛' },
  { id: 'art', name: 'إبداعي', sub: 'ألوان وموسيقى ورسم', c: '#0F766E', t: '#D7F5F0', icon: '🎨' },
  { id: 'country', name: 'بلدي والعالم', sub: 'الجزائر والقارات', c: '#0E7490', t: '#D8F1F8', icon: '🗺️' },
];
export const LESSONS = [...arabic, ...math, ...science, ...english, ...logic, ...life, ...art, ...country];
export const STORIES = stories;
export const byId = Object.fromEntries(LESSONS.map(l => [l.id, l]));
export const lessonsOf = (subject, band) => LESSONS.filter(l => l.subject === subject && l.band === band);
export const subjectsOf = band => SUBJECTS.filter(s => lessonsOf(s.id, band).length);
export const subj = id => SUBJECTS.find(s => s.id === id);

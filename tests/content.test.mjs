import test from 'node:test';
import assert from 'node:assert/strict';
import { LESSONS } from '../js/content/index.js';
const choose = LESSONS.filter(l => l.subject === 'math').flatMap(l => l.items.filter(a => a.t === 'choose').map(a => [l.id, a]));
test('كل معادلة حسابية في الكتالوج إجابتها صحيحة', () => {
  let checked = 0;
  for (const [id, a] of choose) {
    const m = a.q.match(/^(\d+) ([+−×÷]) (\d+) = ؟$/); if (!m) continue;
    const [x, op, y] = [+m[1], m[2], +m[3]], v = op === '+' ? x + y : op === '−' ? x - y : op === '×' ? x * y : x / y;
    assert.equal(a.opts[a.a], String(v), `${id}: ${a.q}`); checked++;
  }
  assert.ok(checked > 80, 'عدد المعادلات المفحوصة: ' + checked);
});
test('أسئلة المحيط والمساحة والمسائل الكلامية محسوبة صحيحاً', () => {
  for (const [id, a] of choose) {
    let m = a.q.match(/طوله (\d+) سم وعرضه (\d+) سم\. ما محيطه/); if (m) assert.equal(a.opts[a.a], String(2 * (+m[1] + +m[2])), id);
    m = a.q.match(/طوله (\d+) سم وعرضه (\d+) سم\. ما مساحته/); if (m) assert.equal(a.opts[a.a], String(+m[1] * +m[2]), id);
    m = a.q.match(/اشترى \S+ (\d+) علب، وفي كل علبة (\d+) أقلام/); if (m) assert.equal(a.opts[a.a], String(+m[1] * +m[2]), id);
    m = a.q.match(/وزّعت \S+ (\d+) حبّة حلوى بالتساوي على (\d+) أطفال/); if (m) assert.equal(a.opts[a.a], String(+m[1] / +m[2]), id);
    m = a.q.match(/مع \S+ (\d+) بطاقة، وأهداه صديقه (\d+) بطاقات/); if (m) assert.equal(a.opts[a.a], String(+m[1] + +m[2]), id);
    m = a.q.match(/اشتريت لعبة بـ (\d+) دج ودفعت (\d+) دج/); if (m) assert.equal(a.opts[a.a], String(+m[2] - +m[1]), id);
  }
});
test('المحتوى ثابت: استيراده مرتين يعطي نفس الأسئلة', async () => {
  const again = await import('../js/content/index.js?again');
  assert.deepEqual(again.LESSONS.map(l => l.items), LESSONS.map(l => l.items));
});
test('لا خيار صحيحاً مكرّراً في أسئلة الاختيار', () => {
  for (const l of LESSONS) for (const a of l.items) if (a.t === 'choose') assert.equal(a.opts.filter(o => o === a.opts[a.a]).length, 1, l.id);
});

import test from 'node:test';
import assert from 'node:assert/strict';

test('ترحيل الملف القديم يحفظ بيانات الطفل قبل حذف النسخة القديمة', async () => {
  const values = new Map([['buroom-state', JSON.stringify({ name: 'ليان', age: 5, points: 20 })]]);
  const calls = [];
  globalThis.localStorage = {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { calls.push(['set', key]); values.set(key, value); },
    removeItem(key) { calls.push(['remove', key]); values.delete(key); }
  };

  const store = await import('../js/store.js?migration-test');
  assert.equal(store.profile()?.name, 'ليان');
  assert.equal(store.profile()?.age, 5);
  assert.equal(values.has('burum.v2'), true);
  assert.equal(values.has('buroom-state'), false);
  assert.deepEqual(calls.slice(0, 2), [['set', 'burum.v2'], ['remove', 'buroom-state']]);
});

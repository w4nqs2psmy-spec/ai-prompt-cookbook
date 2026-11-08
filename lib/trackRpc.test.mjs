import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveTrackRpc } from './trackRpc.ts';

const ID = '123e4567-e89b-12d3-a456-426614174000';

test('prompts and skills use the generic increment_count helper', () => {
  assert.deepEqual(resolveTrackRpc('prompt', 'view', ID), {
    fn: 'increment_count',
    args: { p_table: 'prompts', p_id: ID, p_column: 'view_count' },
  });
  assert.deepEqual(resolveTrackRpc('skill', 'copy', ID), {
    fn: 'increment_count',
    args: { p_table: 'skills', p_id: ID, p_column: 'copy_count' },
  });
});

test('codes use the dedicated code counter helpers', () => {
  assert.deepEqual(resolveTrackRpc('code', 'view', ID), {
    fn: 'increment_code_view_count',
    args: { code_id: ID },
  });
  assert.deepEqual(resolveTrackRpc('code', 'copy', ID), {
    fn: 'increment_code_copy_count',
    args: { code_id: ID },
  });
});

test('tips use the dedicated tip counter helpers', () => {
  assert.deepEqual(resolveTrackRpc('tip', 'view', ID), {
    fn: 'increment_tip_view_count',
    args: { tip_id: ID },
  });
  assert.deepEqual(resolveTrackRpc('tip', 'copy', ID), {
    fn: 'increment_tip_copy_count',
    args: { tip_id: ID },
  });
});

test('increment_count is never called with a table outside its SQL whitelist', () => {
  const whitelist = new Set(['prompts', 'skills']);
  for (const type of ['prompt', 'skill', 'code', 'tip']) {
    for (const action of ['view', 'copy']) {
      const { fn, args } = resolveTrackRpc(type, action, ID);
      if (fn === 'increment_count') assert.ok(whitelist.has(args.p_table));
    }
  }
});

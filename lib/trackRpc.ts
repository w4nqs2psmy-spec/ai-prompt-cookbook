export type TrackType = 'prompt' | 'skill' | 'code' | 'tip';
export type TrackAction = 'view' | 'copy';

export interface TrackRpc {
  fn: string;
  args: Record<string, string>;
}

/**
 * Map a tracking event to the Supabase RPC that increments its counter.
 *
 * Prompts and skills share the generic `increment_count` helper
 * (supabase/add_counters.sql), whose whitelist only allows those two tables.
 * Codes and tips have dedicated helpers (supabase/codes_table.sql,
 * supabase/tips_table.sql).
 */
export function resolveTrackRpc(type: TrackType, action: TrackAction, id: string): TrackRpc {
  switch (type) {
    case 'prompt':
    case 'skill':
      return {
        fn: 'increment_count',
        args: {
          p_table: type === 'prompt' ? 'prompts' : 'skills',
          p_id: id,
          p_column: action === 'view' ? 'view_count' : 'copy_count',
        },
      };
    case 'code':
      return { fn: `increment_code_${action}_count`, args: { code_id: id } };
    case 'tip':
      return { fn: `increment_tip_${action}_count`, args: { tip_id: id } };
  }
}

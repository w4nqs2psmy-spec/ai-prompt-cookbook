import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/* ── POST /api/like ─────────────────────────────────────────────────────────
 * Body: { item_type, item_id, user_fingerprint }
 * Toggles like on/off. Returns { liked: boolean, like_count: number }.
 */
export async function POST(req: NextRequest) {
  try {
    const { item_type, item_id, user_fingerprint } = await req.json() as {
      item_type?: string;
      item_id?: string;
      user_fingerprint?: string;
    };

    if (item_type !== 'prompt' && item_type !== 'skill') {
      return NextResponse.json({ error: 'Invalid item_type' }, { status: 400 });
    }
    if (!item_id || !UUID_RE.test(item_id)) {
      // Non-UUID = JSON seed item; just return current count without DB touch
      return NextResponse.json({ liked: false, like_count: 0 });
    }
    if (!user_fingerprint || user_fingerprint.length < 8) {
      return NextResponse.json({ error: 'Invalid user_fingerprint' }, { status: 400 });
    }

    const admin = createAdminClient();
    const p_table = item_type === 'prompt' ? 'prompts' : 'skills';

    // Check if already liked
    const { data: existing } = await admin
      .from('likes')
      .select('id')
      .eq('item_type', item_type)
      .eq('item_id', item_id)
      .eq('user_fingerprint', user_fingerprint)
      .maybeSingle();

    let liked: boolean;

    if (existing) {
      // Already liked → unlike
      await admin.from('likes').delete().eq('id', existing.id);
      await admin.rpc('decrement_like_count', { p_table, p_id: item_id });
      liked = false;
    } else {
      // Not yet liked → like
      await admin.from('likes').insert({ item_type, item_id, user_fingerprint });
      await admin.rpc('increment_like_count', { p_table, p_id: item_id });
      liked = true;
    }

    // Read the fresh count
    const { data: row } = await admin
      .from(p_table)
      .select('like_count')
      .eq('id', item_id)
      .single();

    return NextResponse.json({ liked, like_count: row?.like_count ?? 0 });
  } catch (err) {
    console.error('like POST error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

/* ── GET /api/like?item_type=…&item_id=…&user_fingerprint=… ─────────────────
 * Returns { liked: boolean } — used on page load to restore heart state.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const item_type = searchParams.get('item_type');
    const item_id = searchParams.get('item_id');
    const user_fingerprint = searchParams.get('user_fingerprint');

    if ((item_type !== 'prompt' && item_type !== 'skill') || !item_id || !user_fingerprint) {
      return NextResponse.json({ error: 'Invalid params' }, { status: 400 });
    }

    if (!UUID_RE.test(item_id)) {
      return NextResponse.json({ liked: false });
    }

    const admin = createAdminClient();
    const { data } = await admin
      .from('likes')
      .select('id')
      .eq('item_type', item_type)
      .eq('item_id', item_id)
      .eq('user_fingerprint', user_fingerprint)
      .maybeSingle();

    return NextResponse.json({ liked: !!data });
  } catch (err) {
    console.error('like GET error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

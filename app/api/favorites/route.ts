import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/* ── GET /api/favorites ───────────────────────────────────────────────────────
 * Without query params → returns { prompts: Prompt[], skills: Skill[] }
 * With ?item_type=X&item_id=Y → returns { saved: boolean }
 */
export async function GET(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const item_type = searchParams.get('item_type');
  const item_id = searchParams.get('item_id');

  /* ── Single-item check ── */
  if (item_type && item_id) {
    if (item_type !== 'prompt' && item_type !== 'skill') {
      return NextResponse.json({ error: 'Invalid item_type' }, { status: 400 });
    }
    if (!UUID_RE.test(item_id)) {
      return NextResponse.json({ saved: false });
    }
    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('item_type', item_type)
      .eq('item_id', item_id)
      .maybeSingle();

    return NextResponse.json({ saved: !!data });
  }

  /* ── Full list with item data ── */
  const { data: favs, error: favsError } = await supabase
    .from('favorites')
    .select('item_type, item_id')
    .order('created_at', { ascending: false });

  if (favsError) {
    return NextResponse.json({ error: favsError.message }, { status: 500 });
  }

  const promptIds = (favs ?? [])
    .filter((f) => f.item_type === 'prompt')
    .map((f) => f.item_id as string);
  const skillIds = (favs ?? [])
    .filter((f) => f.item_type === 'skill')
    .map((f) => f.item_id as string);

  const admin = createAdminClient();

  const [promptsRes, skillsRes] = await Promise.all([
    promptIds.length > 0
      ? admin.from('prompts').select('*').in('id', promptIds)
      : Promise.resolve({ data: [] as Record<string, unknown>[] }),
    skillIds.length > 0
      ? admin.from('skills').select('*').in('id', skillIds)
      : Promise.resolve({ data: [] as Record<string, unknown>[] }),
  ]);

  // Preserve favorites order (most recently saved first)
  const promptMap = new Map(
    (promptsRes.data ?? []).map((p) => [p.id as string, p])
  );
  const skillMap = new Map(
    (skillsRes.data ?? []).map((s) => [s.id as string, s])
  );

  const prompts = promptIds
    .map((id) => promptMap.get(id))
    .filter(Boolean);
  const skills = skillIds
    .map((id) => skillMap.get(id))
    .filter(Boolean);

  return NextResponse.json({ prompts, skills });
}

/* ── POST /api/favorites ─────────────────────────────────────────────────────
 * Body: { item_type, item_id }
 * Adds item to favorites. Returns { saved: true }.
 */
export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { item_type, item_id } = (await req.json()) as {
    item_type?: string;
    item_id?: string;
  };

  if (item_type !== 'prompt' && item_type !== 'skill') {
    return NextResponse.json({ error: 'Invalid item_type' }, { status: 400 });
  }
  if (!item_id || !UUID_RE.test(item_id)) {
    return NextResponse.json({ error: 'Invalid item_id' }, { status: 400 });
  }

  const { error } = await supabase.from('favorites').insert({
    user_id: user.id,
    item_type,
    item_id,
  });

  // 23505 = unique_violation (already saved) — treat as success
  if (error && error.code !== '23505') {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ saved: true });
}

/* ── DELETE /api/favorites ───────────────────────────────────────────────────
 * Body: { item_type, item_id }
 * Removes item from favorites. Returns { saved: false }.
 */
export async function DELETE(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { item_type, item_id } = (await req.json()) as {
    item_type?: string;
    item_id?: string;
  };

  if (item_type !== 'prompt' && item_type !== 'skill') {
    return NextResponse.json({ error: 'Invalid item_type' }, { status: 400 });
  }
  if (!item_id || !UUID_RE.test(item_id)) {
    return NextResponse.json({ error: 'Invalid item_id' }, { status: 400 });
  }

  await supabase
    .from('favorites')
    .delete()
    .eq('user_id', user.id)
    .eq('item_type', item_type)
    .eq('item_id', item_id);

  return NextResponse.json({ saved: false });
}

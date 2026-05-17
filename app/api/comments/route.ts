import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_CONTENT_LENGTH = 1000;

/* ── GET /api/comments?item_type=X&item_id=Y ─────────────────────────────────
 * Returns all comments for an item, newest first.
 * Public — no auth required.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const item_type = searchParams.get('item_type');
  const item_id = searchParams.get('item_id');

  if (item_type !== 'prompt' && item_type !== 'skill') {
    return NextResponse.json({ error: 'Invalid item_type' }, { status: 400 });
  }
  if (!item_id || !UUID_RE.test(item_id)) {
    return NextResponse.json({ comments: [] });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('comments')
    .select('id, user_id, user_display_name, content, created_at')
    .eq('item_type', item_type)
    .eq('item_id', item_id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ comments: data ?? [] });
}

/* ── POST /api/comments ──────────────────────────────────────────────────────
 * Body: { item_type, item_id, content }
 * Requires authentication. Stores display_name from user metadata / email prefix.
 * Increments comment_count on the prompt/skill.
 */
export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { item_type, item_id, content } = (await req.json()) as {
    item_type?: string;
    item_id?: string;
    content?: string;
  };

  if (item_type !== 'prompt' && item_type !== 'skill') {
    return NextResponse.json({ error: 'Invalid item_type' }, { status: 400 });
  }
  if (!item_id || !UUID_RE.test(item_id)) {
    return NextResponse.json({ error: 'Invalid item_id' }, { status: 400 });
  }
  if (!content || content.trim().length === 0) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }
  if (content.length > MAX_CONTENT_LENGTH) {
    return NextResponse.json(
      { error: `Content too long (max ${MAX_CONTENT_LENGTH} chars)` },
      { status: 400 }
    );
  }

  // Derive display name: metadata → email prefix
  const user_display_name: string =
    (user.user_metadata?.display_name as string) ||
    (user.user_metadata?.full_name as string) ||
    (user.user_metadata?.name as string) ||
    (user.email ? user.email.split('@')[0] : 'Anonyymi');

  const p_table = item_type === 'prompt' ? 'prompts' : 'skills';
  const admin = createAdminClient();

  // Insert comment (user's session client respects RLS)
  const { data: comment, error: insertError } = await supabase
    .from('comments')
    .insert({
      item_type,
      item_id,
      user_id: user.id,
      user_display_name,
      content: content.trim(),
    })
    .select('id, user_id, user_display_name, content, created_at')
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // Increment comment_count atomically
  await admin.rpc('increment_comment_count', { p_table, p_id: item_id });

  return NextResponse.json({ comment }, { status: 201 });
}

/* ── DELETE /api/comments ────────────────────────────────────────────────────
 * Body: { id }
 * Only the comment author or admin may delete.
 * Decrements comment_count on the prompt/skill.
 */
export async function DELETE(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = (await req.json()) as { id?: string };

  if (!id || !UUID_RE.test(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const admin = createAdminClient();

  // Fetch the comment to check ownership
  const { data: comment, error: fetchError } = await admin
    .from('comments')
    .select('id, user_id, item_type, item_id')
    .eq('id', id)
    .single();

  if (fetchError || !comment) {
    return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
  }

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const isAdmin = !!adminEmail && user.email === adminEmail;
  const isAuthor = comment.user_id === user.id;

  if (!isAuthor && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { error: deleteError } = await admin
    .from('comments')
    .delete()
    .eq('id', id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  const p_table = comment.item_type === 'prompt' ? 'prompts' : 'skills';
  await admin.rpc('decrement_comment_count', {
    p_table,
    p_id: comment.item_id,
  });

  return NextResponse.json({ deleted: true });
}

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, id, action } = body as { type?: string; id?: string; action?: string };

    // Validate type
    if (type !== 'prompt' && type !== 'skill' && type !== 'code' && type !== 'tip') {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    // Validate action
    if (action !== 'view' && action !== 'copy') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Skip non-UUID ids (JSON seed items like "1", "2", etc.)
    if (!id || !UUID_RE.test(id)) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const p_table =
      type === 'prompt' ? 'prompts'
      : type === 'skill' ? 'skills'
      : type === 'code' ? 'codes'
      : 'tips'; // type === 'tip'
    const p_column = action === 'view' ? 'view_count' : 'copy_count';

    const admin = createAdminClient();
    const { error } = await admin.rpc('increment_count', {
      p_table,
      p_id: id,
      p_column,
    });

    if (error) {
      console.error('increment_count error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('track route error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

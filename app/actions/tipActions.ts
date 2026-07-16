'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import type { TipFormFields } from '@/components/TipForm';

/* ── Shared helper ───────────────────────────────────────────── */

/** Map TipFormFields to the Supabase row shape. */
function toRow(data: TipFormFields, isApproved: boolean) {
  return {
    title: data.title,
    description: data.description,
    tip_text: data.tip_text,
    subject: data.subject,
    level: data.level,
    tool: data.tool,
    use_case: data.use_case,
    tags: data.tags,
    is_pro: data.is_pro,
    is_approved: isApproved,
  };
}

/* ── Admin insert ────────────────────────────────────────────── */

/**
 * Insert a new tip as admin (is_approved: true → immediately live).
 * Verifies the current session user is the configured admin.
 */
export async function insertAdminTipAction(data: TipFormFields): Promise<void> {
  // Verify caller is the admin
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (!user || !adminEmail || user.email !== adminEmail) {
    throw new Error('Ei ylläpitäjäoikeuksia.');
  }

  const admin = createAdminClient();
  const { error } = await admin.from('tips').insert(toRow(data, true));

  if (error) throw new Error('Tallennus epäonnistui: ' + error.message);

  revalidatePath('/');
  revalidatePath('/tips');
  revalidatePath('/admin');
}

/* ── Public submit ───────────────────────────────────────────── */

/**
 * Insert a new tip from the public /tips/submit page.
 * Sets is_approved: false — requires admin review before going live.
 * Tracks submitted_by from the current user.
 * is_pro is always false for public submissions.
 */
export async function insertPublicTipAction(data: TipFormFields): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Sinulla tulee olla tunnus lähettääksesi vinkkiä.');
  }

  const admin = createAdminClient();
  const { error } = await admin.from('tips').insert({
    ...toRow(data, false),
    submitted_by: user.id,
    is_pro: false, // public submissions can't self-assign Pro status
  });

  if (error) throw new Error('Lähetys epäonnistui: ' + error.message);
  // No revalidatePath — unapproved tips don't show on the main page.
}

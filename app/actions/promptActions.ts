'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import type { PromptFormFields } from '@/components/PromptForm';

/* ── Shared helper ───────────────────────────────────────────── */

/** Map PromptFormFields to the Supabase row shape. */
function toRow(data: PromptFormFields, isApproved: boolean) {
  return {
    title: data.title,
    description: data.description,
    prompt_text: data.prompt_text,
    subject: data.subject,
    level: data.level,
    tool: data.tool,
    use_case: data.use_case,
    tags: data.tags,
    example_output: data.example_output || null,
    tips: data.tips || null,
    is_pro: data.is_pro,
    is_approved: isApproved,
  };
}

/* ── Admin insert ────────────────────────────────────────────── */

/**
 * Insert a new prompt as admin (is_approved: true → immediately live).
 * Verifies the current session user is the configured admin.
 */
export async function insertAdminPromptAction(data: PromptFormFields): Promise<void> {
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
  const { error } = await admin.from('prompts').insert(toRow(data, true));

  if (error) throw new Error('Tallennus epäonnistui: ' + error.message);

  revalidatePath('/');
  revalidatePath('/admin');
}

/* ── Public submit ───────────────────────────────────────────── */

/**
 * Insert a new prompt from the public /submit page.
 * Sets is_approved: false — requires admin review before going live.
 * No auth required. is_pro is always false for public submissions.
 */
export async function insertPublicPromptAction(data: PromptFormFields): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.from('prompts').insert({
    ...toRow(data, false),
    is_pro: false, // public submissions can't self-assign Pro status
  });

  if (error) throw new Error('Lähetys epäonnistui: ' + error.message);
  // No revalidatePath — unapproved prompts don't show on the main page.
}

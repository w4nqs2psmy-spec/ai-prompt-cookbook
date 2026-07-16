'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

/**
 * Verify the currently-authenticated user is the configured admin.
 * Called at the start of every admin action — never trust the client.
 */
async function assertAdmin(): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (!user || !adminEmail || user.email !== adminEmail) {
    throw new Error('Ei ylläpitäjäoikeuksia.');
  }
}

/**
 * Approve a submitted prompt: set is_approved = true.
 * Uses service role client to bypass RLS.
 */
export async function approvePromptAction(id: string): Promise<void> {
  await assertAdmin();

  const admin = createAdminClient();
  const { error } = await admin
    .from('prompts')
    .update({ is_approved: true })
    .eq('id', id);

  if (error) throw new Error('Hyväksyntä epäonnistui: ' + error.message);

  revalidatePath('/');
  revalidatePath('/admin');
}

/**
 * Reject (delete) a submitted prompt permanently.
 * Uses service role client to bypass RLS.
 */
export async function deletePromptAction(id: string): Promise<void> {
  await assertAdmin();

  const admin = createAdminClient();
  const { error } = await admin
    .from('prompts')
    .delete()
    .eq('id', id);

  if (error) throw new Error('Poisto epäonnistui: ' + error.message);

  revalidatePath('/admin');
}

/**
 * Toggle code approval status: toggle is_approved between true and false.
 * Uses service role client to bypass RLS.
 */
export async function toggleCodeApprovalAction(id: string, approved: boolean): Promise<void> {
  await assertAdmin();

  const admin = createAdminClient();
  const { error } = await admin
    .from('codes')
    .update({ is_approved: approved })
    .eq('id', id);

  if (error) throw new Error('Hyväksynnän muutos epäonnistui: ' + error.message);

  revalidatePath('/');
  revalidatePath('/admin');
}

/**
 * Toggle tip approval status: toggle is_approved between true and false.
 * Uses service role client to bypass RLS.
 */
export async function toggleTipApprovalAction(id: string, approved: boolean): Promise<void> {
  await assertAdmin();

  const admin = createAdminClient();
  const { error } = await admin
    .from('tips')
    .update({ is_approved: approved })
    .eq('id', id);

  if (error) throw new Error('Hyväksynnän muutos epäonnistui: ' + error.message);

  revalidatePath('/');
  revalidatePath('/admin');
}

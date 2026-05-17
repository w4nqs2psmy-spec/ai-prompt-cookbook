'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import type { SkillFormFields } from '@/components/SkillForm';

/* ── Shared helper ───────────────────────────────────────────── */

function toRow(data: SkillFormFields, isApproved: boolean) {
  return {
    title: data.title,
    description: data.description,
    subject: data.subject,
    level: data.level,
    tool: data.tool,
    use_case: data.use_case,
    tags: data.tags,
    steps: data.steps,
    tips: data.tips || null,
    is_pro: data.is_pro,
    is_approved: isApproved,
  };
}

/* ── Admin insert ────────────────────────────────────────────── */

export async function insertAdminSkillAction(data: SkillFormFields): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (!user || !adminEmail || user.email !== adminEmail) {
    throw new Error('Ei ylläpitäjäoikeuksia.');
  }

  const admin = createAdminClient();
  const { error } = await admin.from('skills').insert(toRow(data, true));
  if (error) throw new Error('Tallennus epäonnistui: ' + error.message);

  revalidatePath('/skills');
  revalidatePath('/admin');
}

/* ── Public submit ───────────────────────────────────────────── */

export async function insertPublicSkillAction(data: SkillFormFields): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.from('skills').insert({
    ...toRow(data, false),
    is_pro: false,
  });
  if (error) throw new Error('Lähetys epäonnistui: ' + error.message);
}

/* ── Admin approve / delete ──────────────────────────────────── */

async function assertAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (!user || !adminEmail || user.email !== adminEmail) {
    throw new Error('Ei ylläpitäjäoikeuksia.');
  }
}

export async function approveSkillAction(id: string): Promise<void> {
  await assertAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from('skills').update({ is_approved: true }).eq('id', id);
  if (error) throw new Error('Hyväksyntä epäonnistui: ' + error.message);
  revalidatePath('/skills');
  revalidatePath('/admin');
}

export async function deleteSkillAction(id: string): Promise<void> {
  await assertAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from('skills').delete().eq('id', id);
  if (error) throw new Error('Poisto epäonnistui: ' + error.message);
  revalidatePath('/admin');
}

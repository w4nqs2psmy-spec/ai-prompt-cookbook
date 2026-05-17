'use server';

import { createClient } from '@/lib/supabase/server';

export type SubmitFormData = {
  title: string;
  description: string;
  prompt_text: string;
  subject: string;
  level: string;
  tool: string;
  use_case: string;
  tags: string;
  example_output: string;
  tips: string;
};

export async function submitPromptAction(data: SubmitFormData): Promise<void> {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Kirjaudu sisään ensin.');
  }

  // Parse comma-separated tags → clean string[]
  const tagsArray = data.tags
    ? data.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const { error: insertError } = await supabase
    .from('submitted_prompts')
    .insert({
      title: data.title,
      description: data.description,
      prompt_text: data.prompt_text,
      subject: data.subject,
      level: data.level,
      tool: data.tool,
      use_case: data.use_case,
      tags: tagsArray,
      example_output: data.example_output.trim() || null,
      tips: data.tips.trim() || null,
      is_pro: false,
      is_approved: false,
      submitted_by: user.email!,
    });

  if (insertError) {
    throw new Error('Tallennus epäonnistui: ' + insertError.message);
  }
}

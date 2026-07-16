import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';
import AdminPendingList from './AdminPendingList';
import AdminSkillPendingList from './AdminSkillPendingList';
import AdminCodesPendingList from './AdminCodesPendingList';
import AdminTipsPendingList from './AdminTipsPendingList';
import AdminCommentList from './AdminCommentList';
import type { SubmittedPrompt } from './AdminPendingList';
import type { PendingSkill } from './AdminSkillPendingList';
import type { SubmittedCode } from './AdminCodesPendingList';
import type { SubmittedTip } from './AdminTipsPendingList';
import type { AdminComment } from './AdminCommentList';
import AdminTabs from './AdminTabs';

export default async function AdminPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!user || !adminEmail || user.email !== adminEmail) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-5">🚫</div>
          <h1 className="text-2xl font-bold text-foreground mb-3">Ei käyttöoikeutta</h1>
          <p className="text-muted text-sm">
            Tämä sivu on vain ylläpitäjille.
            {!user && <> <a href="/login" className="text-teal hover:underline">Kirjaudu sisään.</a></>}
          </p>
        </div>
      </div>
    );
  }

  const admin = createAdminClient();

  /* Fetch unapproved prompts, skills, codes, tips, and recent comments in parallel */
  const [
    { data: pendingPrompts, error: promptErr },
    { data: pendingSkills, error: skillErr },
    { data: pendingCodes, error: codeErr },
    { data: pendingTips, error: tipErr },
    { data: recentComments },
  ] = await Promise.all([
    admin.from('prompts').select('*').eq('is_approved', false).order('created_at', { ascending: true }),
    admin.from('skills').select('*').eq('is_approved', false).order('created_at', { ascending: true }),
    admin.from('codes').select('*').order('created_at', { ascending: true }),
    admin.from('tips').select('*').order('created_at', { ascending: true }),
    admin
      .from('comments')
      .select('id, item_type, item_id, user_id, user_display_name, content, created_at')
      .order('created_at', { ascending: false })
      .limit(50),
  ]);

  const promptCount = pendingPrompts?.length ?? 0;
  const skillCount = pendingSkills?.length ?? 0;
  const codeCount = pendingCodes?.length ?? 0;
  const tipCount = pendingTips?.length ?? 0;
  const commentCount = recentComments?.length ?? 0;
  const totalCount = promptCount + skillCount + codeCount + tipCount;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-serif text-3xl font-bold text-foreground flex items-center gap-3">
          Tarkistusjonо
          {totalCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[2rem] h-8 px-2 text-base font-bold bg-mustard text-white rounded-full">
              {totalCount}
            </span>
          )}
        </h1>
        <span className="text-sm text-muted">{user.email}</span>
      </div>

      {/* Quick links */}
      <div className="flex gap-4 mb-8 mt-4">
        <Link href="/admin/add" className="inline-flex items-center gap-1.5 text-sm font-medium text-teal hover:text-teal-dark transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Lisää prompti
        </Link>
        <Link href="/admin/skills/add" className="inline-flex items-center gap-1.5 text-sm font-medium text-teal hover:text-teal-dark transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Lisää skill
        </Link>
        <Link href="/admin/codes/add" className="inline-flex items-center gap-1.5 text-sm font-medium text-teal hover:text-teal-dark transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Lisää koodi
        </Link>
        <Link href="/admin/tips/add" className="inline-flex items-center gap-1.5 text-sm font-medium text-teal hover:text-teal-dark transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Lisää vinkki
        </Link>
        <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors">Etusivu →</Link>
      </div>

      {(promptErr || skillErr || codeErr || tipErr) && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-600 text-sm mb-6">
          <strong>Virhe ladattaessa:</strong>{' '}
          {promptErr?.message ?? skillErr?.message ?? codeErr?.message ?? tipErr?.message}
          <p className="mt-2 text-xs text-red-500">Varmista että Supabase-schema on ajettu.</p>
        </div>
      )}

      {/* Tabs + content */}
      <AdminTabs
        promptCount={promptCount}
        skillCount={skillCount}
        codeCount={codeCount}
        tipCount={tipCount}
        commentCount={commentCount}
        promptsContent={
          <AdminPendingList initialItems={(pendingPrompts ?? []) as SubmittedPrompt[]} />
        }
        skillsContent={
          <AdminSkillPendingList initialItems={(pendingSkills ?? []) as PendingSkill[]} />
        }
        codesContent={
          <AdminCodesPendingList initialItems={(pendingCodes ?? []) as SubmittedCode[]} />
        }
        tipsContent={
          <AdminTipsPendingList initialItems={(pendingTips ?? []) as SubmittedTip[]} />
        }
        commentsContent={
          <AdminCommentList initialComments={(recentComments ?? []) as AdminComment[]} />
        }
      />
    </div>
  );
}

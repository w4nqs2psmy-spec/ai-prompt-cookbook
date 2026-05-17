'use client';

import Link from 'next/link';
import SkillForm from '@/components/SkillForm';
import { insertAdminSkillAction } from '@/app/actions/skillActions';

export default function AdminSkillAddPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">

        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm text-teal hover:text-teal-dark font-medium mb-10 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Hallintapaneeli
        </Link>

        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest text-terracotta uppercase mb-3">Hallinta</p>
          <h1 className="font-serif text-4xl font-bold text-foreground leading-tight">Lisää uusi skill</h1>
          <p className="text-sm text-muted mt-2">Admin-lisäykset julkaistaan välittömästi.</p>
        </div>

        <SkillForm
          onSubmit={insertAdminSkillAction}
          showProCheckbox
          submitLabel="Lisää skill"
          successMessage="Skill lisätty ja julkaistu!"
        />
      </div>
    </div>
  );
}

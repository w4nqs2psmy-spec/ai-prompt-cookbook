'use client';

import Link from 'next/link';
import CodeForm from '@/components/CodeForm';
import { insertAdminCodeAction } from '@/app/actions/codeActions';

export default function AdminCodeAddPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* Back link */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm text-teal hover:text-teal-dark font-medium mb-10 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Hallintapaneeli
        </Link>

        {/* Heading */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest text-terracotta uppercase mb-3">
            Hallinta
          </p>
          <h1 className="font-serif text-4xl font-bold text-foreground leading-tight">
            Lisää uusi koodi
          </h1>
          <p className="text-sm text-muted mt-2">
            Admin-lisäykset julkaistaan välittömästi.
          </p>
        </div>

        <CodeForm
          onSubmit={insertAdminCodeAction}
          isAdmin={true}
          submitLabel="Lisää koodi"
          successMessage="Koodi lisätty ja julkaistu!"
        />
      </div>
    </div>
  );
}

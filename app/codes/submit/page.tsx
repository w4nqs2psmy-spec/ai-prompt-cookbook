'use client';

import Link from 'next/link';
import CodeForm from '@/components/CodeForm';
import { insertPublicCodeAction } from '@/app/actions/codeActions';

export default function CodeSubmitPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* Back link */}
        <Link
          href="/codes"
          className="inline-flex items-center gap-1.5 text-sm text-teal hover:text-teal-dark font-medium mb-10 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Takaisin koodeihin
        </Link>

        {/* Heading */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest text-terracotta uppercase mb-3">
            Yhteisö
          </p>
          <h1 className="font-serif text-4xl font-bold text-foreground leading-tight">
            Jaa oma koodi
          </h1>
          <p className="text-base text-muted mt-3 leading-relaxed max-w-lg">
            Onko sinulla hyödyllinen koodiesimerkki, josta muutkin opettajat hyötyisivät?
            Lähetä se tarkistettavaksi — parhaat lisätään kirjastoon.
          </p>
          <div className="mt-4 flex items-start gap-2 bg-teal-light border border-teal/20 rounded-xl p-4">
            <span className="text-teal shrink-0 mt-0.5">ℹ</span>
            <p className="text-sm text-foreground leading-relaxed">
              Lähetetyt koodiesimerkkit tarkistetaan ennen julkaisua. Saat tiedon, kun koodiesimerkki hyväksytään.
            </p>
          </div>
        </div>

        <CodeForm
          onSubmit={insertPublicCodeAction}
          isAdmin={false}
          submitLabel="Lähetä tarkistettavaksi"
          successMessage="Kiitos! Koodiesimerkki on lähetetty tarkistettavaksi."
        />
      </div>
    </div>
  );
}

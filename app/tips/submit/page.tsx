'use client';

import Link from 'next/link';
import TipForm from '@/components/TipForm';
import { insertPublicTipAction } from '@/app/actions/tipActions';

export default function TipSubmitPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* Back link */}
        <Link
          href="/tips"
          className="inline-flex items-center gap-1.5 text-sm text-teal hover:text-teal-dark font-medium mb-10 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Takaisin vinkkeihin
        </Link>

        {/* Heading */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest text-terracotta uppercase mb-3">
            Yhteisö
          </p>
          <h1 className="font-serif text-4xl font-bold text-foreground leading-tight">
            Jaa oma vinkki
          </h1>
          <p className="text-base text-muted mt-3 leading-relaxed max-w-lg">
            Onko sinulla hyödyllinen opetusvinkkejä, joista muutkin opettajat hyötyisivät?
            Lähetä se tarkistettavaksi — parhaat lisätään kirjastoon.
          </p>
          <div className="mt-4 flex items-start gap-2 bg-teal-light border border-teal/20 rounded-xl p-4">
            <span className="text-teal shrink-0 mt-0.5">ℹ</span>
            <p className="text-sm text-foreground leading-relaxed">
              Lähetetyt vinkit tarkistetaan ennen julkaisua. Saat tiedon, kun vinkki hyväksytään.
            </p>
          </div>
        </div>

        <TipForm
          onSubmit={insertPublicTipAction}
          isAdmin={false}
          submitLabel="Lähetä tarkistettavaksi"
          successMessage="Kiitos! Vinkki on lähetetty tarkistettavaksi."
        />
      </div>
    </div>
  );
}

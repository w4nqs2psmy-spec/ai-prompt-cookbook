'use client';

import Link from 'next/link';
import SkillForm from '@/components/SkillForm';
import { insertPublicSkillAction } from '@/app/actions/skillActions';

export default function SkillSubmitPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">

        <Link
          href="/skills"
          className="inline-flex items-center gap-1.5 text-sm text-teal hover:text-teal-dark font-medium mb-10 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Takaisin skilleihin
        </Link>

        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest text-terracotta uppercase mb-3">
            Yhteisö
          </p>
          <h1 className="font-serif text-4xl font-bold text-foreground leading-tight">
            Jaa oma skillisi
          </h1>
          <p className="text-base text-muted mt-3 leading-relaxed max-w-lg">
            Onko sinulla monivaiheinen työnkulku tai oppimisprosessi, josta muutkin hyötyisivät?
            Lähetä se tarkistettavaksi — parhaat lisätään kirjastoon.
          </p>
          <div className="mt-4 flex items-start gap-2 bg-teal-light border border-teal/20 rounded-xl p-4">
            <span className="text-teal shrink-0 mt-0.5">ℹ</span>
            <p className="text-sm text-foreground leading-relaxed">
              Lähetetyt skillit tarkistetaan ennen julkaisua. Skill tarvitsee vähintään kaksi vaihetta.
            </p>
          </div>
        </div>

        <SkillForm
          onSubmit={insertPublicSkillAction}
          showProCheckbox={false}
          submitLabel="Lähetä tarkistettavaksi"
          successMessage="Kiitos! Skillisi on lähetetty tarkistettavaksi."
        />
      </div>
    </div>
  );
}

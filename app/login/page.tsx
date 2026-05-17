'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/';
  const authError = searchParams.get('error');

  useEffect(() => {
    if (authError === 'auth_failed') {
      setError('Kirjautuminen epäonnistui. Pyydä uusi linkki.');
    }
  }, [authError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    setLoading(false);
    if (signInError) {
      setError('Virhe sähköpostin lähettämisessä. Tarkista osoite ja yritä uudelleen.');
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-5">📬</div>
          <h1 className="text-2xl font-bold text-foreground mb-3">
            Tarkista sähköpostisi
          </h1>
          <p className="text-muted mb-2">
            Lähetimme kirjautumislinkin osoitteeseen{' '}
            <strong className="text-foreground">{email}</strong>.
          </p>
          <p className="text-sm text-muted">
            Linkki vanhenee 10 minuutissa. Tarkista myös roskapostikansio.
          </p>
          <button
            onClick={() => setSent(false)}
            className="mt-8 text-sm text-teal hover:text-teal-dark font-medium transition-colors"
          >
            ← Lähetä uudelleen eri osoitteeseen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-teal hover:text-teal-dark font-medium mb-8 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Takaisin etusivulle
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Kirjaudu sisään</h1>
          <p className="text-muted text-sm">
            Syötä sähköpostiosoitteesi. Lähetämme sinulle kirjautumislinkin — ei salasanaa tarvita.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Sähköpostiosoite
            </label>
            <input
              id="email"
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nimi@koulu.fi"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-foreground placeholder:text-muted text-base focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full py-3.5 rounded-xl bg-teal text-white font-semibold text-base hover:bg-teal-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Lähetetään...' : 'Lähetä kirjautumislinkki'}
          </button>
        </form>

        <p className="mt-6 text-xs text-muted text-center">
          Käyttämällä palvelua hyväksyt käyttöehdot ja tietosuojaselosteen.
        </p>
      </div>
    </div>
  );
}

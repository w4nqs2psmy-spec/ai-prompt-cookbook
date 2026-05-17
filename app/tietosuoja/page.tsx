import Link from 'next/link';

export const metadata = {
  title: 'Tietosuoja — AI Prompt Cookbook',
  description: 'Tietosuojaseloste ja tietoa henkilötietojen käsittelystä.',
};

/* ── Small reusable primitives ────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-serif text-xl font-semibold text-foreground mb-4 pb-2 border-b border-warm-border">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="text-sm font-semibold text-foreground mb-1.5">{title}</h3>
      {children}
    </div>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-muted leading-relaxed">{children}</p>
  );
}

function Ul({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 mt-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm text-muted leading-relaxed">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal shrink-0" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */

export default function TietosuojaPage() {
  const updated = '16.5.2026';

  return (
    <div className="max-w-[720px] mx-auto px-4 py-12">

      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-teal hover:text-teal-dark font-medium mb-10 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Etusivulle
      </Link>

      {/* Heading */}
      <h1 className="font-serif text-4xl font-bold text-foreground mb-2 leading-tight">
        Tietosuoja
      </h1>
      <p className="text-sm text-muted mb-10">Viimeksi päivitetty: {updated}</p>

      {/* ── 1 ─────────────────────────────────────────────────────── */}
      <Section title="Mitä tämä palvelu tekee">
        <Body>
          AI Prompt Cookbook on kehotekirjasto opettajille. Palvelu tarjoaa valmiita prompteja ja
          ohjeistuksia, jotka kopioit ja liität itse valitsemaasi tekoälypalveluun (esim. ChatGPT,
          Claude, Gemini). Palvelu ei itsessään lähetä mitään tietoja tekoälypalveluihin eikä
          käsittele oppilasdataa.
        </Body>
      </Section>

      {/* ── 2 ─────────────────────────────────────────────────────── */}
      <Section title="Mitä tietoja keräämme">
        <Sub title="Kirjautuminen">
          <Body>
            Voit luoda tilin Google-kirjautumisella tai sähköpostilla. Tallennamme
            sähköpostiosoitteesi, kirjautumistapasi ja tilin luontipäivän. Käytämme Supabase
            Auth -palvelua kirjautumisen hallintaan. Emme tallenna salasanojasi — ne käsitellään
            Supabasen salatun autentikaation kautta.
          </Body>
        </Sub>
        <Sub title="Käyttäjäprofiili">
          <Body>
            Jos lisäät nimimerkin tai profiilikuvan, ne tallennetaan ja näkyvät muille käyttäjille
            yhteisösivulla ja lähettämiesi promptien yhteydessä. Voit käyttää nimimerkkiä eikä
            oikean nimen käyttö ole pakollista.
          </Body>
        </Sub>
        <Sub title="Sisällöt">
          <Body>
            Kun lähetät promptin tai skillin, tallennamme sen sisällön ja yhdistämme sen
            käyttäjätiliisi. Lähetetyt sisällöt tarkistetaan ennen julkaisua.
          </Body>
        </Sub>
        <Sub title="Käyttödata">
          <Body>
            Keräämme nimettömästi tietoa promptien katselukerroista, kopioista ja tykkäyksistä
            palvelun kehittämiseksi. Tykkäykset yhdistetään selaimen tunnisteeseen (localStorage),
            ei käyttäjätiliin. Emme käytä evästeitä mainontaan tai seurantaan.
          </Body>
        </Sub>
      </Section>

      {/* ── 3 ─────────────────────────────────────────────────────── */}
      <Section title="Missä tiedot sijaitsevat">
        <Body>
          Tietosi tallennetaan Supabase-palveluun, jonka palvelimet sijaitsevat EU-alueella.
          Tietojen käsittely noudattaa EU:n yleistä tietosuoja-asetusta (GDPR).
        </Body>
      </Section>

      {/* ── 4 ─────────────────────────────────────────────────────── */}
      <Section title="Mitä emme tee">
        <Ul items={[
          'Emme lähetä tietojasi tekoälypalveluihin',
          'Emme myy tai jaa tietojasi kolmansille osapuolille',
          'Emme seuraa sinua mainostarkoituksissa',
          'Emme käsittele oppilaiden henkilötietoja',
          'Emme käytä evästeitä mainontaan',
        ]} />
      </Section>

      {/* ── 5 ─────────────────────────────────────────────────────── */}
      <Section title="Oikeutesi">
        <Body>
          GDPR:n mukaisesti sinulla on oikeus: pyytää nähdä kaikki sinusta tallennetut tiedot,
          pyytää tietojesi poistamista, pyytää tietojesi oikaisemista, ja peruuttaa suostumuksesi
          milloin tahansa.
        </Body>
        <p className="text-sm text-muted leading-relaxed mt-3">
          Tilin ja kaikkien tietojesi poistaminen onnistuu ottamalla yhteyttä ylläpitoon
          osoitteessa{' '}
          <a
            href="mailto:antti.leppilampi@gmail.com"
            className="text-teal hover:text-teal-dark underline underline-offset-2 transition-colors"
          >
            antti.leppilampi@gmail.com
          </a>
          .
        </p>
      </Section>

      {/* ── 6 ─────────────────────────────────────────────────────── */}
      <Section title="Kolmannen osapuolen palvelut">
        <Body>Palvelu käyttää seuraavia kolmannen osapuolen palveluita:</Body>
        <Ul items={[
          'Supabase — tietokanta ja autentikaatio (EU-palvelimet)',
          'Google OAuth — kirjautuminen Google-tilillä (Googlen tietosuojakäytäntö pätee)',
          'Vercel — sivuston hosting',
        ]} />
        <div className="mt-4 p-4 rounded-xl bg-mustard-light border border-mustard/30">
          <p className="text-sm text-foreground leading-relaxed">
            Kun kopioit promptin ja liität sen tekoälypalveluun (ChatGPT, Claude, Gemini,
            Copilot), kyseisen palvelun omat tietosuojakäytännöt astuvat voimaan. AI Prompt
            Cookbook ei ole vastuussa näiden palveluiden tietojenkäsittelystä.
          </p>
        </div>
      </Section>

      {/* ── 7 ─────────────────────────────────────────────────────── */}
      <Section title="Muutokset tietosuojaselosteeseen">
        <Body>
          Päivitämme tätä selostetta tarvittaessa. Olennaisista muutoksista ilmoitetaan palvelun
          etusivulla. Viimeksi päivitetty: {updated}.
        </Body>
      </Section>

    </div>
  );
}

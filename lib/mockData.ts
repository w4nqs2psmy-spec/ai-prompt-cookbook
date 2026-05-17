import { Prompt } from './types';

export const mockPrompts: Prompt[] = [
  {
    id: '1',
    title: 'Eriyttävä tehtäväsarja kolmella tasolla',
    description:
      'Luo automaattisesti kolme eritasoista tehtäväsarjaa samasta aiheesta – sopii erilaisille oppijoille.',
    prompt_text: `Toimin lukion matematiikan opettajana. Luo kolme eritasoista tehtäväsarjaa aiheesta [AIHE]:

1. Perustaso – oppilaalle, joka tarvitsee enemmän tukea
2. Keskitaso – oppilaalle, joka hallitsee perusteet
3. Haastava taso – oppilaalle, joka haluaa lisähaastetta

Jokaisessa sarjassa 5 tehtävää. Lisää jokaiseen tehtävään vihje, jonka opiskelija voi avata jos jumittaa. Merkitse vihjeet selkeästi (esim. 💡 Vihje:).`,
    subject: 'math',
    level: 'upper_secondary',
    tool: 'any',
    use_case: 'differentiation',
    tags: ['eriyttäminen', 'matematiikka', 'tasoerottelu', 'lukio'],
    example_output:
      '**Perustaso – tehtävä 1:** Laske 15 % luvusta 80.\n💡 Vihje: Muuta prosentti desimaaliksi (15 % = 0,15) ja kerro luvulla.\n\n**Keskitaso – tehtävä 1:** Tuotteen hinta nousi 15 %. Alkuperäinen hinta oli 80 €. Mikä on uusi hinta?\n💡 Vihje: Laske ensin 15 % alkuperäisestä ja lisää se alkuperäiseen.',
    tips:
      'Korvaa [AIHE] tarkalla aiheella, esim. "prosenttilaskut" tai "toisen asteen yhtälöt". Voit myös pyytää lisäämään malliratkaisut jokaisen tehtävän jälkeen.',
    is_pro: false,
    created_at: '2024-01-15',
  },
  {
    id: '2',
    title: 'Kirjoitelman palauteassistentti',
    description:
      'Saa rakentavaa, kolmitasoista palautetta oppilaan kirjoitelmasta – kannustavasti ja konkreettisesti.',
    prompt_text: `Olet yläkoulun englannin opettajan avustaja. Lue alla oleva oppilaan kirjoitelma ja anna palaute näillä kolmella tasolla:

1. ✅ Mikä on hyvin – mainitse vähintään kaksi asiaa
2. 📝 Yksi konkreettinen parannusehdotus kieliopissa
3. 💡 Yksi ehdotus sisällön syventämiseen

Käytä kannustavaa sävyä. Kirjoita palaute suomeksi, vaikka itse kirjoitelma olisi englanniksi.

Kirjoitelma:
[LIITÄ TÄHÄN]`,
    subject: 'languages',
    level: 'lower_secondary',
    tool: 'claude',
    use_case: 'feedback',
    tags: ['palaute', 'kirjoittaminen', 'englanti', 'yläkoulu'],
    example_output:
      '✅ Mikä on hyvin: Tekstissäsi on selkeä rakenne ja käytät monipuolista sanastoa. Aloituslause on erityisen tarttuva!\n\n📝 Kielioppihuomio: Kiinnitä huomiota aikamuotojen yhdenmukaisuuteen – teksti alkaa imperfektissä mutta siirtyy välillä preesensiin.\n\n💡 Syvennys: Voisit lisätä konkreettisen esimerkin tai henkilökohtaisen kokemuksen tukeaksesi pääargumenttiasi.',
    tips:
      'Toimii parhaiten Claudella, joka antaa erityisen empaattista ja vivahteikasta palautetta. Voit muokata tasoja eri oppiaineisiin.',
    is_pro: false,
    created_at: '2024-01-20',
  },
  {
    id: '3',
    title: 'Tuntisisältö oppimistuloksiksi',
    description:
      'Muuta oppitunnin aihe selkeiksi, mitattaviksi oppimistuloksiksi OPS-sanastolla.',
    prompt_text: `Olet kokenut opetussuunnitelmaosaamisen asiantuntija. Muuta alla oleva oppitunnin aihe selkeiksi, mitattaviksi oppimistuloksiksi.

Oppitunnin aihe: [AIHE]
Luokka-aste: [LUOKKA-ASTE]
Oppiaine: [OPPIAINE]

Kirjoita 3–5 oppimistulosta, jotka:
- Alkavat toimintaverbillä (tunnistaa, selittää, soveltaa, analysoida, arvioida)
- Ovat mitattavia tai havainnoitavissa
- Vastaavat oppilaan kehitystasoa
- Ovat linjassa perusopetuksen opetussuunnitelman kanssa

Lisää jokaisen oppimistuloksen jälkeen lyhyt ehdotus siitä, miten sen voi arvioida.`,
    subject: 'general',
    level: 'primary',
    tool: 'chatgpt',
    use_case: 'lesson_planning',
    tags: ['tuntisuunnittelu', 'ops', 'oppimistulokset', 'tavoitteet'],
    example_output:
      'Oppilas osaa:\n1. **Tunnistaa** yhteyttä kuvaavat lauseet tekstistä → Arviointitapa: Tekstianalyysiharjoitus\n2. **Selittää** omin sanoin, mitä konjunktio tarkoittaa → Arviointitapa: Suullinen kysymys\n3. **Soveltaa** opittuja konjunktioita omissa lauseissaan → Arviointitapa: Kirjallinen tehtävä',
    tips:
      'Käytä tätä OPS-työn pohjana tai kun suunnittelet kokonaan uutta oppituntia. Tarkista tulokset aina itse ennen käyttöä.',
    is_pro: false,
    created_at: '2024-02-01',
  },
  {
    id: '4',
    title: 'Ryhmätehtävän roolien jakaja',
    description:
      'Luo valmiit roolikortit ryhmätyöhön – jokainen oppilas tietää tarkalleen, mitä tekee.',
    prompt_text: `Autan yläkoulun opettajaa suunnittelemaan ryhmätyötä. Luo [NUMERO] erilaista roolia alla olevaan projektitehtävään.

Projektitehtävä: [TEHTÄVÄN KUVAUS]
Ryhmän koko: [NUMERO] oppilasta
Aikataulu: [AIKATAULU]

Jokaiselle roolille kirjoita:
- Roolin nimi (hauska mutta kuvaava)
- 3–4 konkreettista tehtävää tässä projektissa
- Miten tämä rooli tukee muita ryhmän jäseniä
- Yksi kysymys, johon tämä roolihenkilö vastaa esityksessä

Merkitse selkeästi, mitkä roolit sopivat johtajuudesta kiinnostuneille ja mitkä analyyttisesti ajatteleville.`,
    subject: 'general',
    level: 'lower_secondary',
    tool: 'any',
    use_case: 'group_work',
    tags: ['ryhmätyö', 'roolit', 'yhteistyö', 'projektityö'],
    example_output:
      '**🎯 Projektipäällikkö**\nTehtävät: Koordinoi aikataulua, johtaa tiimipalavereita, varmistaa että kaikki pysyvät tehtävässään, esittelee lopputuloksen\nTuki muille: Pitää ryhmän kasassa ja ratkoo ristiriitoja\nEsityskysymys: "Miten projekti eteni ja mitä opimme tiimityöstä?"',
    tips:
      'Syötä todellinen projektitehtäväsi mahdollisimman tarkasti. Voit pyytää myös arviointikriteerit kullekin roolille.',
    is_pro: false,
    created_at: '2024-02-10',
  },
  {
    id: '5',
    title: 'Luovan kirjoittamisen aloitusimpulssit',
    description:
      'Generoi monipuolisia kirjoitusaiheita ja -impulsseja, jotka sytyttävät oppilaan mielikuvituksen.',
    prompt_text: `Olet luovan kirjoittamisen opettaja, joka tuntee nuorten kiinnostuksen kohteet. Luo 10 erilaista kirjoitusimpulssia [LUOKKA-ASTEEN] oppilaille.

Teemat ja tyylilajit: [ESIM. "sci-fi, romantiikka, mysteeri, arki"]

Jokainen impulssi sisältää:
- Innostavan aloituslauseen tai tilanteen (1–2 lausetta)
- Yhden arvoituksellisen kysymyksen, joka syventää tarinaa
- Valinnaisen kuvan tai yksityiskohdan, jonka voi lisätä tarinaan

Vältä kliseitä. Pyri yllätyksellisyyteen. Tee impulsseja, joihin myös sinä itse haluaisit vastata kirjoittamalla.`,
    subject: 'languages',
    level: 'lower_secondary',
    tool: 'chatgpt',
    use_case: 'creative_tasks',
    tags: ['luova kirjoittaminen', 'äidinkieli', 'inspiraatio', 'tarinat'],
    example_output:
      '**Impulssi 3:** Löydät kaapistasi kirjeen, joka on osoitettu sinulle – mutta kirjeen päivämäärä on kymmenen vuoden päässä tulevaisuudessa. Kuka sen on kirjoittanut, ja miksi?\n🔍 Syventävä kysymys: Haluatko oikeasti tietää, mitä kirjeessä lukee?\n✨ Yksityiskohta: Kirjeen reunoilla on käsin piirrettyjä karttoja.',
    tips:
      'Sopii erityisesti oppituntien lämmittelyksi (5–10 min). Pyydä lisää impulsseja tietystä tyylilajista jos jokin resonoi luokan kanssa.',
    is_pro: false,
    created_at: '2024-02-15',
  },
  {
    id: '6',
    title: 'Koedialogi: oppilas selittää opettajalle',
    description:
      'Tehokas syvällisen ymmärryksen testausmetodi – AI pelaa tietämätöntä ja oppilas selittää.',
    prompt_text: `Sinulla ei ole aiempaa tietoa aiheesta "[AIHE]". Olet utelias opiskelija, joka haluaa oppia.

Haastattele minua (oppilasta) aiheesta esittämällä yksi kysymys kerrallaan. Aloita helposta kysymyksestä ja etene vaativampiin sen mukaan, miten hyvin vastaukseni osoittavat ymmärrystä.

Säännöt:
- Esitä aina vain yksi kysymys kerrallaan
- Jos vastaukseni on epäselvä, pyydä tarkennusta ennen seuraavaa kysymystä
- Kun olet esittänyt 5–7 kysymystä, anna lyhyt yhteenveto: mikä meni hyvin, mitä kannattaisi kertata
- Älä kerro itse vastauksia – anna minun selittää

Aloita ensimmäisellä kysymyksellä nyt.`,
    subject: 'science',
    level: 'upper_secondary',
    tool: 'claude',
    use_case: 'assessment',
    tags: ['arviointi', 'ymmärrys', 'sokraattinen', 'dialogi', 'itsearviointi'],
    example_output:
      'AI: "Kerro minulle omin sanoin, mitä tarkoittaa fotosynteesi. Mistä prosessi alkaa?"\n\nOppilas selittää → AI: "Mainitsit auringonvalon – mutta mitä tarkalleen ottaen tapahtuu, kun valo kohtaa lehden? Mitä aineita on mukana?"\n\n[5 kysymyksen jälkeen] Yhteenveto: "Selitit hyvin reaktanttien roolit, mutta energian varastoituminen ATP:hen jäi vähän epäselväksi – kannattaa palata siihen."',
    tips:
      'Erityisen tehokas kertaukseen ennen koetta. Oppilas voi käyttää itsenäisesti. Claude on tähän erityisen hyvä johtuen sen taidosta esittää täsmällisiä jatkokysymyksiä.',
    is_pro: true,
    created_at: '2024-03-01',
  },
  {
    id: '7',
    title: 'Viikoittainen uutiskirje vanhemmille',
    description:
      'Generoi lämminhenkinen, informatiivinen viikoittainen tiedote koteihin muutamalla ranskalaisella viivalla.',
    prompt_text: `Olet alkuopettaja, joka kirjoittaa viikoittaista uutiskirjettä 1.–2.-luokkalaisten vanhemmille.

Tällä viikolla tapahtui:
[LISTA ASIOISTA, ESIM:]
- Opimme kertolaskun 2- ja 5-kertaa
- Kävimme kirjastossa
- Harjoiteltiin joukkuepelejä välitunnilla
- Yksi oppilas täytti 8 vuotta

Kirjoita kirje, joka:
- On lämmin ja positiivinen
- Kertoo lyhyesti mitä opittiin ja miksi se on tärkeää
- Sisältää yhden konkreettisen kotitehtävän tai jutteluaiheen
- Päättyy innostavaan kommenttiin ensi viikosta
- On pituudeltaan max. 200 sanaa`,
    subject: 'general',
    level: 'primary',
    tool: 'any',
    use_case: 'admin',
    tags: ['tiedottaminen', 'vanhemmat', 'uutiskirje', 'alakoulu', 'viestintä'],
    example_output:
      'Hei kotiväki! 🌟\n\nTällä viikolla matematiikassa harjoittelimme kerto laskuja – 2- ja 5-kertotaulut alkavat jo sujua mukavasti! Kertotaulut ovat tärkeä perusta, jolle monet tulevat laskut rakentuvat...\n\n**Kotitehtävä:** Pyydäkää lastanne näyttämään 5-kertotaulu laulaen tai taputtaen.\n\nEnsi viikolla aloitamme kirjan lukemisen yhdessä – odottakaa kotiin tulevaa kirjasuositusta! 📚',
    tips:
      'Kirjoita tapahtumat lyhyinä ranskalaisina viivoina – AI täyttää loput. Voit lisätä myös "haasteet viikolla" jos haluat rehellisempää viestintää.',
    is_pro: false,
    created_at: '2024-03-05',
  },
  {
    id: '8',
    title: 'Historiallinen roolipeli: päätöksenteko menneisyydessä',
    description:
      'Syvennä historiaymmärrystä asettamalla oppilas historiallisen henkilön saappaisiin.',
    prompt_text: `Haluan syvätä oppilaiden historiaymmärrystä roolipelin avulla.

Tilanne: [HISTORIALLINEN TAPAHTUMA / AIKAKAUSI]
Rooli: Oppilas on [HISTORIALLINEN HENKILÖ TAI ROOLI, esim. "suomalainen talonpoika vuonna 1918"]

Sinä pelaat historian tarkkaa kuvausta: esität tilanteen, olosuhteet ja dilemman. Et kerro oikeaa vastausta.

Kulku:
1. Kuvaile tilanne elävästi (3–5 lausetta)
2. Esitä konkreettinen päätöksentekotilanne: "Mitä teet?"
3. Kun oppilas vastaa, kuvaile realistinen seuraus ja kysy: "Muuttaisitko päätöstäsi tietäen tämän?"
4. Lopuksi kerro, mitä oikeasti tapahtui ja miten se vertautuu oppilaan valintoihin

Seuraa historiallista tarkkuutta, mutta pidä kieli ymmärrettävänä yläkoululaisille.`,
    subject: 'history',
    level: 'lower_secondary',
    tool: 'chatgpt',
    use_case: 'creative_tasks',
    tags: ['historia', 'roolipeli', 'empatia', 'päätöksenteko', 'simulaatio'],
    example_output:
      'Vuosi on 1939, lokakuu. Olet helsinkiläinen perheen isä. Radio on juuri kertonut, että Neuvostoliitto vaatii Suomea luovuttamaan alueita. Hallitus on pyytänyt asevelvollisia ilmoittautumaan. Sinulla on vaimo ja kaksi lasta, 4 ja 7 vuotta. Mitä teet?\n\nA) Ilmoittaudut välittömästi\nB) Odotat lisää tietoa\nC) Harkitset perheen siirtämistä maaseudulle',
    tips:
      'Toimii hyvin kotitehtävänä ennen historian tuntia. Pyydä oppilaita kirjoittamaan roolipelikokemus ylös ja tuomaan se luokkaan keskusteltavaksi.',
    is_pro: false,
    created_at: '2024-03-10',
  },
  {
    id: '9',
    title: 'Yrittäjyysidean SWOT-analyysi',
    description:
      'Oppilaiden liikeideaa analysoidaan perusteellisesti – sopii yrittäjyyskasvatukseen.',
    prompt_text: `Olet kokenut liiketoimintavalmentaja, joka auttaa nuoria yrittäjiä. Oppilaani on kehittänyt liikeidean, jonka haluamme analysoida yhdessä.

Liikeidea: [OPPILAAN LIIKEIDEA]
Kohderyhmä: [KENELLE]
Hinta-arvio: [JOS TIEDOSSA]

Tee seuraavat asiat:
1. **SWOT-analyysi** selkeässä taulukkomuodossa (vahvuudet, heikkoudet, mahdollisuudet, uhkat)
2. **Kolme konkreettista kysymystä**, joita yrittäjän tulisi miettiä ennen lanseerausta
3. **Yksi rohkaiseva huomio** – mikä tässä ideassa on erityisen hyvää
4. **Yksi kehittämisehdotus** – yksi asia, joka tekisi ideasta vahvemman

Käytä innostavaa mutta realistista sävyä. Kohdenna vastaus lukiolaiselle.`,
    subject: 'entrepreneurship',
    level: 'upper_secondary',
    tool: 'any',
    use_case: 'assessment',
    tags: ['yrittäjyys', 'swot', 'liikeideа', 'analyysi', 'lukio'],
    example_output:
      '| | Sisäiset | Ulkoiset |\n|---|---|---|\n| **Positiiviset** | Vahvuudet: Innovatiivinen konsepti, selkeä kohderyhmä | Mahdollisuudet: Kasvava markkina, some-markkinointi |\n| **Negatiiviset** | Heikkoudet: Alkupääoman tarve, kokemusten puute | Uhkat: Kilpailu, taloustilanne |\n\n💡 Erityisen hyvää: Olet tunnistanut aidon ongelman, johon sinulla on ratkaisu.',
    tips:
      'Toimii myös vertaisarviointina – oppilaat voivat analysoida toistensa ideoita tällä promptilla.',
    is_pro: true,
    created_at: '2024-03-15',
  },
  {
    id: '10',
    title: 'Ohjelmoinnin käsitteen selittäjä analogioilla',
    description:
      'Monimutkaiset ohjelmointikäsitteet selitetään arjen analogioilla – sopii aloittelijoille.',
    prompt_text: `Olet ohjelmoinnin opettaja, joka on erittäin hyvä selittämään asioita arkipäivän analogioilla.

Selitä seuraava ohjelmointikäsite [LUOKKA-ASTEEN] oppilaalle käyttäen:
1. Arkipäivän analogiaa (ei teknistä)
2. Yksinkertaista esimerkkiä koodista (max. 10 riviä, kommentoituna)
3. Yhtä konkreettista käyttötapausta ("tätä käytetään kun...")
4. Yhtä yleistä virhettä, jota aloittelijat tekevät

Käsite: [KÄSITE, esim. "silmukka", "funktio", "taulukko", "ehtolause"]

Käytä Python-kieltä ellei toisin mainita.`,
    subject: 'computer_science',
    level: 'lower_secondary',
    tool: 'any',
    use_case: 'lesson_planning',
    tags: ['ohjelmointi', 'python', 'käsitteet', 'analogia', 'aloittelijat'],
    example_output:
      '**Funktio** on kuin resepti. Kirjoitat sen kerran ja voit käyttää sitä monta kertaa:\n\n```python\n# Resepti kahvin keittämiseen\ndef keitä_kahvi(kuppia):\n    vettä = kuppia * 150  # ml per kuppi\n    print(f"Keitetään {vettä} ml vettä")\n    return vettä\n\n# Käytetään reseptiä\nkeitä_kahvi(2)  # Kahdelle\nkeitä_kahvi(5)  # Viidelle\n```\n\n⚠️ Yleinen virhe: Unohtaa kirjoittaa `return` – funktio tekee työn mutta ei anna vastausta takaisin.',
    tips:
      'Korvaa [KÄSITE] yhdellä kerrallaan. Voit pyytää myös harjoitustehtävää perään.',
    is_pro: false,
    created_at: '2024-03-20',
  },
  {
    id: '11',
    title: 'Kuvataideanalyysin ohjaava kysymyssarja',
    description:
      'Ohjaa oppilaita analysoimaan taideteosta systemaattisesti – havainnoinnista tulkintaan.',
    prompt_text: `Olet kuvataiteen opettaja. Auta oppilaitani analysoimaan alla kuvattua taideteosta.

Teos: [TEOKSEN NIMI JA TEKIJÄ TAI KUVAUS]
Oppilaiden ikä: [IKÄ / LUOKKA-ASTE]

Luo analyysikysymyssarja, joka etenee:
1. **Havainnointi** (2–3 kysymystä): Mitä näet? Värit, muodot, sommittelu.
2. **Tulkinta** (2–3 kysymystä): Mitä teos mielestäsi kertoo tai tuntuu sanovan?
3. **Konteksti** (1–2 kysymystä): Mitä tiedät tekijästä tai ajasta, jolloin teos syntyi?
4. **Henkilökohtainen reaktio** (1 kysymys): Mitä sinulle herää?

Lisää jokaisen vaiheen jälkeen lyhyt ohje opettajalle: miten fasilitoida keskustelua tässä vaiheessa.`,
    subject: 'arts',
    level: 'primary',
    tool: 'gemini',
    use_case: 'lesson_planning',
    tags: ['kuvataide', 'analyysi', 'havainnointi', 'taide', 'visuaalisuus'],
    example_output:
      '**Havainnointi:**\n- "Mitä ensimmäisenä kiinnitit huomiota? Miksi juuri se?"\n- "Millaisia värejä taiteilija on käyttänyt – onko ne lämpimiä vai kylmiä?"\n\n👩‍🏫 Opettajalle: Pyydä oppilaita ensin katsomaan hiljaa 30 sekuntia ennen vastaamista.',
    tips:
      'Gemini osaa hakea myös kuvia netistä jos annat teoksen nimen. Voit liittää kuvan suoraan promptiin useimmissa AI-työkaluissa.',
    is_pro: false,
    created_at: '2024-04-01',
  },
  {
    id: '12',
    title: 'Tiedonhakuprojektin lähdekritiikkiharjoitus',
    description:
      'Opeta oppilaille lähdekritiikkiä käytännön harjoituksella – AI simuloi erilaisia lähteitä.',
    prompt_text: `Olet mediakasvatuksen asiantuntija. Autat opettajaa suunnittelemaan lähdekritiikki-harjoituksen.

Aihe: [TUTKITTAVA AIHE]
Luokka-aste: [LUOKKA]

Luo kolme erilaista "lähdettä" samasta aiheesta:

1. **Luotettava lähde** – akateeminen tai asiantuntijateksti, selkeästi merkitty viittein
2. **Harhaanjohtava lähde** – tekstissä on faktavirheitä tai liioittelua, mutta se näyttää luotettavalta
3. **Selvästi epäluotettava** – sensaatiohakuinen, ei lähteitä, tunnevaikuttaminen

Jokainen teksti: noin 80–100 sanaa samasta aiheesta.

Lisää lopuksi **opettajan analyysivinkki**: mitkä konkreettiset merkit paljastavat kunkin lähteen laadun?`,
    subject: 'general',
    level: 'upper_secondary',
    tool: 'claude',
    use_case: 'research',
    tags: ['lähdekritiikki', 'mediakasvatus', 'tiedonhaku', 'kriittinen ajattelu'],
    example_output:
      '**Luotettava:** "Tutkimusten mukaan (Virtanen ym., 2023) sosiaalisen median käyttö korreloi..."\n**Harhaanjohtava:** "Asiantuntijat ovat todistaneet, että some tuhoa nuorten aivot..."\n**Epäluotettava:** "JÄRKYTTÄVÄÄ! Nämä sovellukset myrkyttävät lapsesi mielen HETI!"\n\n👩‍🏫 Analyysivinkki: Kiinnitä huomio lähdeviitteisiin, verbin varmuuteen ja tunnelataukseen.',
    tips:
      'Claude luo erityisen uskottavia harhaanjohtavia tekstejä, mikä tekee harjoituksesta haastavamman ja opettavaisemman.',
    is_pro: true,
    created_at: '2024-04-10',
  },
  {
    id: '13',
    title: 'Kokeen jälkeinen reflektio-oppiminen',
    description:
      'Muuta virheelliset koevastaukset oppimismahdollisuuksiksi – oppilas ymmärtää, ei vain kopioi oikeaa vastausta.',
    prompt_text: `Olet oppimisen tukemiseen erikoistunut opettaja. Auta oppilasta oppimaan kokeessa tekemistään virheistä.

Oppiaine: [OPPIAINE]
Kysymys kokeessa: [KYSYMYS]
Oppilaan vastaus: [OPPILAAN VASTAUS]
Oikea vastaus: [OIKEA VASTAUS]

Älä vain kerro oikeaa vastausta. Sen sijaan:
1. Tunnusta, mitä oppilas ymmärsi oikein
2. Kysy yksi kysymys, joka auttaa oppilasta itse löytämään virheen
3. Jos oppilas ei löydä virhettä, anna vihje – ei vastausta
4. Kun oikea ajatus on löydetty, vahvista se ja yhdistä laajempaan kokonaisuuteen

Sävy: kärsivällinen, kannustava, ei tuomitseva.`,
    subject: 'science',
    level: 'lower_secondary',
    tool: 'any',
    use_case: 'feedback',
    tags: ['palaute', 'reflektio', 'virheistä oppiminen', 'koe', 'tukeminen'],
    example_output:
      'AI: "Mainitsit, että vesi kiehuu aina 100 asteessa – tässä on hyvä ydin! Mutta ajatellaanpa: oletko koskaan huomannut, että vuorella ruoan keittäminen kestää kauemmin? Mitä se kertoo sinulle?"\n\nOppilas: "...paine?"\n\nAI: "Juuri niin! Ilmanpaine vaikuttaa kiehumispisteeseen. Milloin 100 astetta pitää paikkansa?"',
    tips:
      'Voit käyttää tätä myös reaaliaikaisesti tunnilla tablet-laitteilla – oppilas juttelee AI:n kanssa omatoimisesti vähemmän häiriten opettajan aikaa.',
    is_pro: false,
    created_at: '2024-04-15',
  },
  {
    id: '14',
    title: 'Henkilökohtainen opiskelusuunnitelma kertaukseen',
    description:
      'Luo räätälöity kertausohjelma kokeen tai tentin lähestyessä – perustuu oppilaan itse tunnistamiin heikkouksiin.',
    prompt_text: `Olet opiskeluvalmentaja. Auta minua luomaan tehokkaan kertaussuunnitelman tulevaa tenttiä tai koetta varten.

Oppiaine: [OPPIAINE]
Koe/tentti: [KUVAUS, esim. "kemian välikoe aiheista hapot ja emäkset, reaktioyhtälöt, liukoisuus"]
Aikaa kertaukseen: [ESIM. "3 päivää, noin 1,5 h/päivä"]
Heikoimmat osa-alueet (omat arviot): [LISTAA]
Vahvimmat osa-alueet: [LISTAA]

Luo:
1. Päiväkohtainen kertausaikataulu konkreettisine tehtävineen
2. Kolme tehokkainta opiskelutekniikkaa juuri tähän aiheeseen
3. Viisi todennäköisintä tentikysymystä (oppilaan harjoiteltavaksi)
4. "Viimeisen illan" 30 minuutin pikakerttausohje`,
    subject: 'general',
    level: 'higher_education',
    tool: 'chatgpt',
    use_case: 'assessment',
    tags: ['kertaus', 'opiskelutekniikka', 'tentti', 'suunnittelu', 'korkeakoulu'],
    example_output:
      '**Päivä 1 (1,5 h):** Reaktioyhtälöt – tee 10 tasapainotusharjoitusta, käytä Anki-kortteja\n**Päivä 2 (1,5 h):** Hapot ja emäkset – pH-laskut, tee 3 omaa muistisääntöä\n**Päivä 3 (1,5 h):** Kertaa kaikki + tee harjoitustenttiä\n\n🎯 Tehokkain tekniikka tähän aineeseen: Feynman-tekniikka – selitä käsite ääneen kuin opettaisit kaverille.',
    tips:
      'Ohje toimii erityisen hyvin kun opiskelija täyttää oman heikkous-listansa rehellisesti. Mitä tarkempi, sitä parempi suunnitelma.',
    is_pro: true,
    created_at: '2024-04-20',
  },
  {
    id: '15',
    title: 'Tieteellisen artikkelin tiivistelmä ja kysymyssarja',
    description:
      'Muuta vaikea tieteellinen teksti ymmärrettäväksi tiivistelmäksi ja oppituntia varten valmiiksi kysymyssarjaksi.',
    prompt_text: `Olet korkeakoulun lehtori, joka auttaa opiskelijoita tieteellisten tekstien lukemisessa.

Alla on tieteellinen artikkeli tai sen ote. Tee siitä:

1. **Tiivistelmä** (150–200 sanaa) lukio- tai korkeakouluopiskelijalle sopivalla kielellä. Vältä jargonia tai selitä se.
2. **5 ymmärtämiskysymystä** – etene pintatasolta syvemmälle (muistaminen → ymmärtäminen → soveltaminen)
3. **2 kriittistä ajattelun kysymystä** – haasta lukija arvioimaan metodeja tai johtopäätöksiä
4. **Keskeiset käsitteet** – 5 tärkeintä termiä lyhyin selityksin
5. **Yhteydet arkielämään** – 2–3 esimerkkiä siitä, miten tutkimuksen löydökset näkyvät käytännössä

Artikkeli:
[LIITÄ ARTIKKELI TÄHÄN]`,
    subject: 'science',
    level: 'higher_education',
    tool: 'claude',
    use_case: 'research',
    tags: ['tieteellinen teksti', 'tiivistelmä', 'korkeakoulu', 'lukeminen', 'ymmärtäminen'],
    example_output:
      '**Tiivistelmä:** Tutkimuksessa selvitettiin, miten uni vaikuttaa muistiin konsolidointiin... [150 sanaa]\n\n**Ymmärtämiskysymykset:**\n1. Mitä tarkoittaa muistin konsolidointi? (muistaminen)\n2. Miksi REM-uni on tärkeää oppimiselle? (ymmärtäminen)\n3. Miten voisit soveltaa löydöksiä omaan opiskeluusi? (soveltaminen)\n\n**Kriittinen kysymys:** Tutkimuksessa käytettiin vain 18–25-vuotiaita – miten tämä rajoittaa tulosten yleistettävyyttä?',
    tips:
      'Claude on erityisen hyvä tieteellisten tekstien kanssa. Liitä koko artikkeli tai pitkä ote – Claude pystyy käsittelemään pitkiä tekstejä.',
    is_pro: true,
    created_at: '2024-05-01',
  },

  // ── BATCH 2: prompts 16–45 ──────────────────────────────────────────────

  // MATH
  {
    id: '16',
    title: 'Geometrian käsitteet arjen esimerkein',
    description:
      'Selitä alakoulun geometrian käsitteet hauskojen arkipäivän esimerkkien kautta – ei yhtään tylsää määritelmää.',
    prompt_text: `Olet innostava alakoulun matematiikan opettaja. Selitä alla olevat geometrian käsitteet 8–10-vuotiaalle lapselle käyttäen:
- Arjen esimerkki (jotain kotoa, koulusta tai leikkikentältä)
- Lyhyt tarina tai vertauskuva
- Yksi hauska muistisääntö

Käsitteet:
[KIRJOITA KÄSITTEET TÄHÄN, esim. "kolmio, nelikulmio, ympyrä, symmetria"]

Käytä yksinkertaista kieltä. Ei matemaattisia kaavoja – pelkkä intuitio ja mielikuvat.`,
    subject: 'math',
    level: 'primary',
    tool: 'any',
    use_case: 'lesson_planning',
    tags: ['geometria', 'alakoulu', 'käsitteet', 'arki', 'matematiikka'],
    example_output:
      '**Kolmio:** Kuvittele pizzapala – se on kolmio! Kolmessa kulmassa istuu kolme kaveria. Muistisääntö: "Kol-mi-o – kolme kulmaa, kolme sivua, yksi pizza."\n\n**Symmetria:** Taita paperi kahtia ja leikkaa sydän – molemmat puolet ovat täsmälleen samanlaisia. Luonto rakastaa symmetriaa: perhosella, ihmiskasvolla ja lehdillä.',
    tips:
      'Käy käsitteet läpi yksi kerrallaan tunnilla ääneen lukemalla. Voit pyytää myös piirrettävän mallikuvan jokaisen käsitteen viereen.',
    is_pro: false,
    created_at: '2024-05-05',
  },
  {
    id: '17',
    title: 'Tilastomatematiikan data-analyysitehtävä',
    description:
      'Generoi autenttiseen dataan perustuva tilastotehtävä, jossa oppilaat tekevät koko analyysiprosessin itse.',
    prompt_text: `Olet lukion pitkän matematiikan opettaja. Luo realistinen tilastoanalyysitehtävä, jossa oppilaat pääsevät tekemään koko prosessin alusta loppuun.

Aihe / data-alue: [ESIM. "suomalaisten lukiolaisten nukkumistottumukset" tai "kuntopyörän tehotason vaihtelu"]

Tehtävä sisältää:
1. Keksitty mutta realistinen datasetti (15–20 havaintoa taulukkomuodossa)
2. Viisi analyysitehtävää etenevässä vaikeustasossa:
   - Keskiluvut ja hajontaluvut
   - Histogrammin tai pistediagrammin piirtäminen
   - Korrelaatiokertoimen laskeminen (jos soveltuu)
   - Johtopäätösten kirjoittaminen datasta
   - Yksi kriittinen kysymys: "Mitä data EI kerro meille?"
3. Mallivastaukset opettajalle

Käytä SI-yksiköitä ja pyöristä data realistisesti.`,
    subject: 'math',
    level: 'upper_secondary',
    tool: 'chatgpt',
    use_case: 'assessment',
    tags: ['tilastomatematiikka', 'data-analyysi', 'lukio', 'pitkä matematiikka', 'korrelaatio'],
    example_output:
      '| Oppilas | Unen määrä (h) | Koepistemäärä (max 30) |\n|---------|---------------|------------------------|\n| 1       | 7,5           | 24                     |\n| 2       | 5,0           | 16                     |\n...\n\n**Tehtävä 1:** Laske aineiston keskiarvo, mediaani ja moodi nukkumistuntien osalta.\n**Kriittinen kysymys:** Mitä muita muuttujia pitäisi mitata, ennen kuin voisimme väittää unen parantavan arvosanoja?',
    tips:
      'Tämä sopii erinomaisesti kurssin loppuarviointiin tai ryhmätyöhön. Pyydä ChatGPT:tä myös generoimaan Excel-valmis CSV-data kopioitavaksi.',
    is_pro: true,
    created_at: '2024-05-08',
  },
  {
    id: '18',
    title: 'Algebran sanallisten tehtävien luoja',
    description:
      'Luo sanallisia algebratehtäviä oppilaan kiinnostuksen kohteen ympärille – motivaatio nousee heti.',
    prompt_text: `Olet yläkoulun matematiikan opettaja. Luo 6 sanallista algebratehtävää, joissa kaikissa esiintyy tuntematon x.

Oppilaan kiinnostuksen kohde: [ESIM. "jalkapallo", "leivonta", "pelikonsolit", "hevoset"]
Aihe algebrassa: [ESIM. "yhtälöt", "epäyhtälöt", "lausekkeet"]
Vaikeustaso: [HELPPO / KESKITASO / HAASTAVA]

Jokaisessa tehtävässä:
- Tarina tai tilanne oppilaan kiinnostusalueelta
- Selkeä kysymys, johon vastataan ratkaisemalla yhtälö
- Vastauksen tarkistusohje (sijoita x takaisin)
- Opettajan malliratkaisuvaiheet

Vältä tylsiä "Miikalla on 3 omenaa..." -tehtäviä. Tee tehtävistä aidosti innostavia.`,
    subject: 'math',
    level: 'lower_secondary',
    tool: 'any',
    use_case: 'differentiation',
    tags: ['algebra', 'sanalliset tehtävät', 'yhtälöt', 'motivaatio', 'yläkoulu'],
    example_output:
      '**Tehtävä 3 (jalkapallo):** Jalkapalloilija Sami teki viime kaudella x maalia. Tällä kaudella hän teki 7 maalia enemmän kuin puolet viime kauden maalimäärästä. Yhteensä kahdella kaudella syntyi 31 maalia. Kuinka monta maalia Sami teki viime kaudella?\n\nYhtälö: x + (x/2 + 7) = 31 → Ratkaisu: x = 16',
    tips:
      'Kysy oppilaalta etukäteen hänen kiinnostuksen kohteensa – se tekee tehtävistä henkilökohtaisia. Voit tehdä koko luokalle eri versioita samaan aikaan.',
    is_pro: false,
    created_at: '2024-05-10',
  },
  {
    id: '19',
    title: 'Integraalilaskennan esimerkkitehtäväpaketti',
    description:
      'Valmis tehtäväpaketti integraalilaskennan harjoitteluun – perusteista soveltaviin laskuihin malliratkaisuineen.',
    prompt_text: `Olet korkeakoulun matematiikan lehtori. Luo kattava harjoitustehtäväpaketti aiheesta [AIHE, esim. "määräämätön integraali", "määrätty integraali", "pinta-alan laskeminen integroimalla"].

Paketti sisältää:

**Osa A – Perustekniikat (5 tehtävää)**
Suorat integroinnit, jotka vaativat vain peruskaavoja.

**Osa B – Soveltavat tehtävät (4 tehtävää)**
Sijoitusmenetelmä tai osamurtokehitelmä mukana.

**Osa C – Mallintamistehtävä (1 tehtävä)**
Reaalielämän tilanne, jossa integrointi ratkaisee ongelman.

Jokaiselle tehtävälle: täydet malliratkaisuvaiheet, arvioitu ratkaisuaika ja yleisimmät virheet.

Vaikeustaso: yliopiston ensimmäinen vuosi / lukion pitkä matematiikka.`,
    subject: 'math',
    level: 'higher_education',
    tool: 'any',
    use_case: 'assessment',
    tags: ['integraalilasku', 'korkeakoulu', 'matematiikka', 'harjoitustehtävät', 'malliratkaisut'],
    example_output:
      '**A3.** Laske ∫(3x² + 2x − 5) dx\nRatkaisu: x³ + x² − 5x + C\nArvioitu aika: 2 min | Yleisin virhe: unohdettu vakio C\n\n**C1.** Vesisäiliön poikkileikkauspinta-ala noudattaa funktiota A(h) = 2h² + 3. Laske säiliön tilavuus, kun veden korkeus vaihtelee välillä [0, 4] metriä.',
    tips:
      'Pyydä tehtäväpaketti oppiainekohtaisesti ja määritä selkeästi, mitä tekniikoita oppilaat ovat jo oppineet. Voit pyytää myös LaTeX-muotoisen version.',
    is_pro: true,
    created_at: '2024-05-12',
  },

  // SCIENCE
  {
    id: '20',
    title: 'Kemian reaktioyhtälöiden tasapainotusharjoitus',
    description:
      'Luo vaiheistettuja reaktioyhtälöiden tasapainotustehtäviä selityksineen – ei enää tylsää ulkolukua.',
    prompt_text: `Olet lukion kemian opettaja. Luo 8 reaktioyhtälön tasapainotustehtävää vaikeustasoltaan nousevassa järjestyksessä.

Reaktiotyypit: [ESIM. "palamisreaktiot, happo-emäs, hapetus-pelkistys" tai "vain palamisreaktiot"]

Jokaiselle reaktiolle:
1. Tasapainottamaton reaktioyhtälö (lähtöaine)
2. Vaiheittaiset vihjeet tasapainottamiseen (ei suoraan vastaus)
3. Tasapainotettu yhtälö (mallianswer opettajalle)
4. Selitys: miksi tasapaino on tärkeä tässä reaktiossa

Lisää lopuksi kolme "fallen myths" -faktokorjausta (yleisiä virhekäsityksiä kemian tasapainosta).`,
    subject: 'science',
    level: 'upper_secondary',
    tool: 'claude',
    use_case: 'lesson_planning',
    tags: ['kemia', 'reaktioyhtälöt', 'tasapainottaminen', 'lukio', 'harjoitukset'],
    example_output:
      '**Tehtävä 3:** C₃H₈ + O₂ → CO₂ + H₂O\n\nVihje 1: Laske ensin hiiliatomit – vasemmalla 3, oikealla 1. Mitä pitää muuttaa?\nVihje 2: Tasapainota vety vasta lopuksi.\n\nMallianswer: C₃H₈ + 5O₂ → 3CO₂ + 4H₂O\n\n💡 Virhekäsitys: "Voi lisätä alaindeksejä tasapainottaakseen." → Ei koskaan! Vain kertoimia.',
    tips:
      'Claude on erityisen hyvä tuottamaan vaiheittaisia vihjeitä ilman että paljastaa vastausta liian aikaisin. Pyydä erikseen "opettajan vastausavain" erillisenä promptina.',
    is_pro: false,
    created_at: '2024-05-14',
  },
  {
    id: '21',
    title: 'Biologian tutkimuskysymyksen kehittäjä',
    description:
      'Auttaa oppilasta muodostamaan hyvän, testattavan tutkimuskysymyksen omasta kiinnostuksesta.',
    prompt_text: `Olet yläkoulun biologian opettaja. Auta oppilasta kehittämään hyvä tutkimuskysymys pienoistutkimusta varten.

Oppilaan alkuidea tai kiinnostuksen kohde: [ESIM. "kasvit ja musiikki", "hyttysten käyttäytyminen", "käsien pesu"]

Ohjaa oppilasta näiden vaiheiden läpi:
1. Miksi tämä kiinnostaa sinua? (motivaatio)
2. Mitä jo tiedetään tästä aiheesta? (1–2 faktaa)
3. Muotoile alustava tutkimuskysymys (Miten X vaikuttaa Y:hyn?)
4. Tarkista: Onko kysymys testattavissa koulun välineillä? Jos ei, miten yksinkertaistaa?
5. Muotoile lopullinen tutkimuskysymys ja hypoteesi

Esitä yksi vaihe kerrallaan. Odota oppilaan vastausta ennen etenemistä.`,
    subject: 'science',
    level: 'lower_secondary',
    tool: 'any',
    use_case: 'creative_tasks',
    tags: ['biologia', 'tutkimuskysymys', 'hypoteesi', 'kokeellinen', 'yläkoulu'],
    example_output:
      'AI: "Kerroit olevasi kiinnostunut siitä, kasvavatko kasvit nopeammin musiikin kuunnellessa. Miksi juuri tämä aihe kiinnostaa sinua?"\n\nOppilas vastaa → AI: "Hienoa! Tässä kaksi faktaa: kasvit reagoivat värähtelyihin... Kokeillaan muotoilla kysymys: Miten äänenvoimakkuus vaikuttaa...?"',
    tips:
      'Erinomainen kotitehtäväksi ennen laboratoriotuntia. Oppilas tulee tunnille valmiilla tutkimuskysymyksellä eikä aikaa kulu ideointiin.',
    is_pro: false,
    created_at: '2024-05-16',
  },
  {
    id: '22',
    title: 'Fysiikan laskutehtävien automaattinen tarkistaja',
    description:
      'Syötä oppilaan ratkaisu ja saat yksityiskohtaisen palautteen – virheen syy selitettynä, ei vain "väärin".',
    prompt_text: `Olet tarkka mutta kannustava fysiikan opettaja. Tarkista alla oleva oppilaan laskuratkaisu ja anna palaute.

Tehtävä: [ALKUPERÄINEN TEHTÄVÄ]
Oppilaan ratkaisu: [OPPILAAN VASTAUS VAIHEITTAIN]
Oikea vastaus (jos tiedossa): [OIKEA VASTAUS tai "tarkista itse"]

Analysoi:
1. ✅ Mikä on täysin oikein (yksikkömuunnokset, kaavat, laskuvaiheet)
2. ❌ Ensimmäinen virhe: missä kohtaa ja miksi se on virhe
3. 🔧 Miten korjata: näytä korjattu vaihe ilman koko ratkaisua
4. 💡 Fysiikan ydinajatus: mikä periaate tässä tehtävätyypissä on oleellinen

Älä anna koko oikeaa ratkaisua – anna oppilaalle mahdollisuus korjata itse.`,
    subject: 'science',
    level: 'upper_secondary',
    tool: 'chatgpt',
    use_case: 'feedback',
    tags: ['fysiikka', 'laskutehtävät', 'palaute', 'virheiden korjaus', 'lukio'],
    example_output:
      '✅ Hyvin: Käytit oikeaa kaavaa F = ma ja yksiköt ovat oikein (N = kg·m/s²).\n\n❌ Virhe kohdassa 2: Kun laskoit kiihtyvyyden, jaoit massan voimalla F/m → mutta se pitää olla m/F. Muista: a = F/m.\n\n🔧 Korjaa vaihe 2 tällä: a = 15 N ÷ 3 kg = ?\n\n💡 Ydinajatus: Newtonin 2. laki – mitä suurempi massa, sitä pienempi kiihtyvyys samalla voimalla.',
    tips:
      'Voit syöttää useita oppilaiden vastauksia peräkkäin samaan chattiin. ChatGPT muistaa tehtävän kontekstin ja vertaa jokaisen oppilaan vastausta siihen.',
    is_pro: true,
    created_at: '2024-05-18',
  },
  {
    id: '23',
    title: 'Ympäristötieteen ryhmätutkimusprojekti',
    description:
      'Valmis projektirakenne lähiympäristön tutkimiseen – sopii alakoulun ulko-oppitunneille.',
    prompt_text: `Olet alakoulun ympäristötieteen opettaja. Suunnittele 3-viikon ryhmätutkimusprojekti, jossa oppilaat tutkivat lähiympäristöään.

Kohderyhmä: [LUOKKA, esim. "3. luokka, 8-vuotiaat"]
Lähiympäristö: [ESIM. "koulun piha", "lähimetsä", "puisto"]
Tutkimusteema: [ESIM. "hyönteiset", "kasvit vuodenajan mukaan", "maaperä"]
Ryhmäkoko: [NUMERO]

Projektisuunnitelma sisältää:
- Viikko 1: Havainnointi ja kysymysten muodostaminen (2 oppituntia)
- Viikko 2: Datan kerääminen ja dokumentointi (2 ulkotuntia)
- Viikko 3: Tulosten koostaminen ja esittäminen

Jokaiselle viikolle: konkreettiset tehtävät, tarvittavat välineet (peruskoulu resurssit), arviointikriteerit.`,
    subject: 'science',
    level: 'primary',
    tool: 'any',
    use_case: 'group_work',
    tags: ['ympäristötieto', 'projekti', 'ryhmätyö', 'luonto', 'alakoulu'],
    example_output:
      '**Viikko 1 – Havainnointi:**\nTehtävä: Jokainen ryhmä valitsee 2m² alueen pihalta. Piirretään kartta ja listataan kaikki elävät olennot.\nVälineet: Suurennuslasi, vihko, värikynät\nArviointikriteeri: Löydettyjen lajien lukumäärä ja piirrostarkkuus',
    tips:
      'Lisää promptiin tarkka kuvaus koulun mahdollisuuksista (onko metsä lähellä? onko lintutorneja?) jotta suunnitelma on realistinen.',
    is_pro: false,
    created_at: '2024-05-20',
  },

  // LANGUAGES
  {
    id: '24',
    title: 'Kontekstuaalinen sanaston oppimisohjelma',
    description:
      'Opeta uusi sanasto tarinoiden ja lauseiden kautta – ei enää sanalistoja ulkoa.',
    prompt_text: `Olet kielenopettaja, joka uskoo kontekstuaaliseen oppimiseen. Luo sanasto-oppimisohjelma seuraavalle sanaryhmälle.

Kieli: [ESIM. "englanti", "ruotsi", "saksa"]
Sanat tai teema: [ESIM. "10 säähän liittyvää sanaa" tai "toimistovälineiden nimet"]
Oppilaiden taso: [ESIM. "A2", "yläkoulu alkeiskurssi"]

Ohjelma koostuu:
1. **Kontekstivirke** – jokainen sana omassa luontevassa lauseessa
2. **Mielikuvaharjoitus** – kirjoita sanasta mielleyhtymä omalla äidinkielelläsi
3. **Aukkotehtävä** – 5 lausetta, joissa puuttuu ko. sanoja
4. **Tuotantotehtävä** – kirjoita oma lause jokaisella sanalla
5. **Pari-/ryhmäkeskustelukysymys** – käytä 3 sanaa vastauksessa

Esitä ohjelman vaiheet selkeästi numeroituina, oppilas voi tehdä itsenäisesti.`,
    subject: 'languages',
    level: 'lower_secondary',
    tool: 'any',
    use_case: 'lesson_planning',
    tags: ['sanasto', 'kielet', 'kontekstuaalinen oppiminen', 'aukkotehtävät', 'yläkoulu'],
    example_output:
      '**Sana: storm (myrsky)**\n1. Kontekstivirke: "The storm knocked down several trees last night."\n2. Mielikuva: Kirjoita suomeksi: mitä näet mielessäsi sanasta "storm"?\n3. Aukkotehtävä: "We stayed indoors because of the _____."\n4. Tuotantotehtävä: "Kirjoita lause, jossa käytät sanaa storm omasta kokemuksestasi."',
    tips:
      'Pyydä lisäämään myös ääntämisohje (IPA tai selkokielinen) jos oppilaat eivät tunne kielitieteellistä merkintätapaa.',
    is_pro: false,
    created_at: '2024-05-22',
  },
  {
    id: '25',
    title: 'Suomi toisena kielenä: arjen rakenteet',
    description:
      'Luo räätälöity harjoituskokonaisuus S2-oppilaalle – kielioppi arjen kontekstissa, ei irrallisina sääntöinä.',
    prompt_text: `Olet S2-opettaja (suomi toisena kielenä) aikuiskoulutuksessa. Oppilaan äidinkieli on [ÄIDINKIELI] ja hän on tasolla [ESIM. "A2", "B1"].

Luo harjoituskokonaisuus kielioppirakenteesta: [ESIM. "omistusrakenne", "konditionaali", "partitiivin käyttö ostostilanteessa"]

Konteksti: [ESIM. "kaupassa asiointi", "lääkärissä käynti", "työpaikkahakemus"]

Kokonaisuus sisältää:
1. **Rakenne selitettynä** – yksinkertainen, ei liiaksi termejä, esimerkki oppilaan äidinkielestä jos mahdollista
2. **5 mallivirsettä** arjen kontekstissa
3. **Roolipeliharjoitus** – valmis dialogi, johon oppilas täyttää puuttuvat vuorosanansa
4. **Virheenkorjausharjoitus** – 5 arjen kirjallista viestiä, joissa on rakenne virheellisesti
5. **Tuotantotehtävä** – oppilas kirjoittaa oman viestin ko. kontekstissa

Kieli: selkeä, ei liiaksi ammattisanastoa.`,
    subject: 'languages',
    level: 'adult_education',
    tool: 'claude',
    use_case: 'differentiation',
    tags: ['S2', 'suomi toisena kielenä', 'aikuiskoulutus', 'kielioppi', 'arki'],
    example_output:
      '**Konditionaali kaupassa:**\n"Voisin ottaa...?" / "Haluaisitko...?"\n\nRoolipeli:\nMyyjä: "Mitä saisi olla?"\nOppilas: "_____ ottaa puoli kiloa juustoa." (täytä: "Voisin")\n\nVirheen korjaus: "Minä haluaa kahvi." → "Minä haluaisin kahvia."',
    tips:
      'Claude osaa tuottaa selityksiä useilla kielillä – pyydä tarvittaessa lisäämään lyhyt selitys myös oppilaan äidinkielellä.',
    is_pro: true,
    created_at: '2024-05-24',
  },
  {
    id: '26',
    title: 'Kirjallisuusanalyysin ohjauskysymykset',
    description:
      'Syväluotaavat analyysikysymykset mihin tahansa romaaniin tai novelliin – ei valmiita vastauksia.',
    prompt_text: `Olet lukion äidinkielen tai kirjallisuuden opettaja. Luo analyysikysymyssarja alla olevaan teokseen.

Teos: [KIRJAN NIMI JA KIRJAILIJA]
Luettu osuus: [ESIM. "luvut 1–5" tai "koko romaani"]
Analyysin fokus: [ESIM. "henkilöhahmot", "teemat", "kerronta", "yhteiskunnallinen konteksti"]

Luo 12 kysymystä kolmella tasolla:

**Taso 1 – Sisältökysymykset (4 kpl):**
Kysymykset, joihin löytyy vastaus tekstistä suoraan.

**Taso 2 – Tulkintakysymykset (4 kpl):**
Kysymykset, joihin vaaditaan omaa päättelyä.

**Taso 3 – Arviointikysymykset (4 kpl):**
Kysymykset, jotka yhdistävät teoksen laajempaan kontekstiin tai omaan elämään.

Lisää jokaisen kysymyksen jälkeen tagi: [tekstipohjainen] / [tulkinnallinen] / [avoin].`,
    subject: 'languages',
    level: 'upper_secondary',
    tool: 'chatgpt',
    use_case: 'assessment',
    tags: ['kirjallisuus', 'analyysi', 'lukio', 'äidinkieli', 'kysymykset'],
    example_output:
      '**Taso 1:** "Missä kaupungissa tarina sijoittuu, ja mikä vuodenaika on alussa?" [tekstipohjainen]\n\n**Taso 2:** "Miksi päähenkilö tekee päätöksen luvun 3 lopussa – mitä se kertoo hänen arvoistaan?" [tulkinnallinen]\n\n**Taso 3:** "Miten teoksen kuvaama yksinäisyys resonoi nykypäivän nuorten kokemuksiin?" [avoin]',
    tips:
      'Toimii yhtä hyvin kirjallisen esseen pohjana kuin luokkahuonekeskustelussa. Voit pyytää myös "opettajan mallivastaukset" erikseen.',
    is_pro: false,
    created_at: '2024-05-26',
  },
  {
    id: '27',
    title: 'Strukturoitu väittely vieraalla kielellä',
    description:
      'Valmis väittelyrakenne vieraan kielen tunnille – oppilaat puhuvat, ei opettaja.',
    prompt_text: `Olet yläkoulun tai lukion vieraan kielen opettaja. Suunnittele strukturoitu väittelyharjoitus, jossa oppilaat puhuvat mahdollisimman paljon.

Kieli: [ESIM. "englanti", "ruotsi"]
Väittelyn aihe: [ESIM. "Social media does more harm than good", "Koulupäivä pitäisi alkaa myöhemmin"]
Ryhmäkoko: [NUMERO]
Oppimistaso: [ESIM. "B1", "lukion 2. vuosi"]

Luo:
1. **Väittelyn rakenne** (ajat: 2 min avaus, 1 min vastaväite, jne.)
2. **Hyödylliset fraasit** puolin ja toisin (10–12 frasia väittelykielellä)
3. **Argumenttipohjat** molemmille tiimeille (3 argumenttia + tukifakta per tiimi)
4. **Arviointilomakepohja** (kieliasu, argumenttien vahvuus, kuunteleminen)
5. **Debriefing-kysymykset** tunnin lopuksi suomeksi

Tavoite: max. puheaikaa oppilaille, min. opettajan puheaikaa.`,
    subject: 'languages',
    level: 'upper_secondary',
    tool: 'any',
    use_case: 'group_work',
    tags: ['väittely', 'suullinen', 'vieraat kielet', 'puhuminen', 'englanti'],
    example_output:
      '**Hyödyllisiä fraaseja:**\n- "In my opinion..." / "I strongly believe that..."\n- "However, I would argue that..."\n- "That\'s an interesting point, but..."\n- "Could you clarify what you mean by...?"\n\n**Tiimi A – argumentti 1:** Social media causes anxiety.\nTukifakta: "Studies show 40% of teens feel worse after scrolling..."',
    tips:
      'Anna argumenttipohjat vasta kun oppilaat ovat ensin yrittäneet itse. Jos taso on matala, anna fraasit etukäteen ja harjoittele niitä ensin irrallaan.',
    is_pro: false,
    created_at: '2024-05-28',
  },

  // HISTORY
  {
    id: '28',
    title: 'Primääriaineiston lähdevertailu',
    description:
      'Kahden tai useamman historiallisen lähteen systemaattinen vertailu – kriittinen lukutaito käytäntöön.',
    prompt_text: `Olet lukion historian opettaja. Suunnittele lähdevertailuharjoitus kahdelle tai useammalle primääriaineistolle.

Historiallinen aihe / tapahtuma: [ESIM. "Talvisota 1939", "Suomen itsenäistyminen 1917", "Teollistuminen"]
Oppilaiden taso: [ESIM. "lukio 2. vuosi"]

Luo kaksi kuvitteellista mutta historiallisesti realistista primäärilähdettä samasta tapahtumasta eri näkökulmista (esim. eri osapuolet, eri sosiaaliluokat).

Jokainen lähde: ~100 sanaa, aikakaudelle tyypillisellä kielellä kirjoitettu.

Lisää vertailukehikko oppilaille:
1. Kuka kirjoitti? Milloin? Miksi? (konteksti)
2. Mitä lähde väittää tapahtuneesta?
3. Mitä lähde jättää sanomatta? (puutteet)
4. Miten lähteet eroavat toisistaan – mistä ero johtuu?
5. Kumpiko on luotettavampi? Perustele.`,
    subject: 'history',
    level: 'upper_secondary',
    tool: 'claude',
    use_case: 'research',
    tags: ['historia', 'lähdekritiikki', 'primääriaineisto', 'vertailu', 'lukio'],
    example_output:
      '**Lähde A (suomalainen upseeri, joulukuu 1939):**\n"Miehet pitävät pintansa ihailtavalla tavalla. Ylivoimaisesta vihollisesta huolimatta moraali on korkea..."\n\n**Lähde B (neuvostoliittolainen sotilasraportti, sama viikko):**\n"Eteneminen hidastuu maasto- ja ilmasto-olosuhteista johtuen. Vastustus on arvioitua kovempaa..."\n\n→ Vertailukysymys: Kumpi kuvaus vastaa paremmin historioitsijoiden myöhemmin dokumentoimaa todellisuutta?',
    tips:
      'Claude osaa tuottaa historiallisesti realistisia kuvitteellisia primäärilähteitä eri aikakausilta. Tarkista silti historialliset faktat ennen käyttöä.',
    is_pro: false,
    created_at: '2024-06-01',
  },
  {
    id: '29',
    title: 'Interaktiivinen aikajanaharjoitus',
    description:
      'Luo valmis aikajanatehtävä tapahtumineen ja selityksineen – oppilas kokoaa sen itse.',
    prompt_text: `Olet alakoulun historia- tai ympäristötiedon opettaja. Luo interaktiivinen aikajanaharjoitus.

Aihe: [ESIM. "Suomen historia pähkinänkuoressa", "Ihmisen kehitys", "Teknologian historia"]
Luokka-aste: [ESIM. "5. luokka"]
Ajanjakso: [ESIM. "1800-luvulta nykypäivään" tai "100 000 vuotta sitten – tänään"]

Luo:
1. **10–12 tapahtumaa** kronologisessa järjestyksessä, jokaisesta:
   - Vuosi/ajanjakso
   - Tapahtuman nimi (lyhyt)
   - 2–3 lauseen selitys lapsen kielellä
   - Miksi tämä oli tärkeä – mitä olisi tapahtunut ilman sitä?

2. **Sekoitettu korttipakka** (sama tieto, eri järjestyksessä) – oppilaat laittavat järjestykseen

3. **3 lisätehtävää** aikajanan valmistuttua (esim. "Mikä muutos yllätti sinut eniten?")`,
    subject: 'history',
    level: 'primary',
    tool: 'any',
    use_case: 'lesson_planning',
    tags: ['historia', 'aikajana', 'kronologia', 'alakoulu', 'interaktiivinen'],
    example_output:
      '**1917 – Suomi itsenäistyy**\nSuomi julistautui itsenäiseksi 6. joulukuuta 1917. Ennen sitä Suomi kuului Venäjälle yli sata vuotta. Ilman itsenäistymistä meillä ei olisi omaa lippua, kieltä tai presidenttiä!\n\n**Sekoitettu kortti:** "Maailman ensimmäinen sydämensiirtoleikkaus – missä kohtaa aikajanaa tämä on?"',
    tips:
      'Pyydä AI:ta tulostamaan kortit myös kuvauksettomina versioina – oppilaat voivat täyttää selitykset itse tutkimustyönä.',
    is_pro: false,
    created_at: '2024-06-03',
  },
  {
    id: '30',
    title: 'Historiallisen henkilön "podcast-haastattelu"',
    description:
      'AI pelaa historiallista henkilöä ja oppilas haastattelee – innostava tapa oppia henkilöhistoriaa.',
    prompt_text: `Pelaat historiallista henkilöä nimeltä [HENKILÖN NIMI, esim. "Miina Sillanpää", "Urho Kekkonen", "Elias Lönnrot"].

Sinulla on syvällinen tietämys tästä henkilöstä: hänen elämästään, arvoistaan, tekemisistään ja aikakaudestaan. Vastaat AINA ensimmäisessä persoonassa, kuin olisit itse kyseinen henkilö.

Säännöt:
- Pysyt roolissa koko haastattelun ajan
- Jos oppilas kysyy jotain mitä et voinut tietää (esim. tulevaisuuden tapahtumia), sano se roolissa: "En voi tietää mitä tulevaisuus tuo..."
- Korjaa hienotunteisesti jos oppilas kysyy faktavirheestä ("Hm, en muista tehneeni niin – ehkä sekoitat minut johonkin toiseen?")
- Tunnin lopussa pyydettäessä: poistu roolista ja kerro 3 asiaa, jotka oppilas oppi oikein

Aloita esittelemällä itsesi.`,
    subject: 'history',
    level: 'lower_secondary',
    tool: 'chatgpt',
    use_case: 'creative_tasks',
    tags: ['historia', 'roolipeli', 'haastattelu', 'henkilöhistoria', 'draama'],
    example_output:
      '"Hyvää päivää. Olen Elias Lönnrot, lääkäri ja kansanperinteen kerääjä. Vaelsin vuosikymmeniä Suomen ja Karjalan metsissä kuunnellakseni vanhojen laulajien runoja. Mitä haluaisit tietää Kalevalan synnystä?"\n\nOppilas: "Kuinka kauan Kalevalan kokoaminen kesti?"\nLönnrot: "Se oli elämäntyö. Ensimmäinen painos ilmestyi 1835, mutta täydentelin sitä vielä pitkään..."',
    tips:
      'ChatGPT on erityisen hyvä roolipeleihin koska se pitää roolin johdonmukaisena. Sopii myös kotitehtäväksi ennen aikakauden kertaustuntia.',
    is_pro: true,
    created_at: '2024-06-05',
  },

  // ARTS
  {
    id: '31',
    title: 'Musiikkikappaleen tunneanalyysi',
    description:
      'Ohjaa oppilaat analysoimaan musiikin tunnelatausta systemaattisesti – sanoja tunteille ja musiikillisille elementeille.',
    prompt_text: `Olet yläkoulun musiikin opettaja. Suunnittele musiikkianalyysiharjoitus, jossa oppilaat analysoivat kappaleen tunnelatausta.

Kappale (tai genre): [ESIM. "Sibeliuksen Finlandia", "jazz-improvisaatio", "oppilaat valitsevat itse"]
Luokka-aste: [LUOKKA]

Luo analyysikehikko:

**Ennen kuuntelua:**
- 3 kysymystä, jotka virittävät kuuntelun (ei johdattelevia)

**Ensimmäinen kuuntelu – tunnetaso:**
- 5 adjektiivia kuvaamaan tunnetta
- "Mitä kuvia tai muistoja musiikki herättää?"

**Toinen kuuntelu – tekniikkataso:**
- Tempo: hidas / keskinopea / nopea?
- Dynamiikka: hiljainen / voimakas / vaihteleva?
- Soittimet: mitä kuulet?
- Muoto: toistuuko jokin teema?

**Synteesikysymys:** "Miten tekniset valinnat tuottavat tunteen jonka koit?"

Lisää viisi suomenkielistä tunnesanaa, joita oppilaat voivat käyttää mutta joita ei tarvitse käyttää.`,
    subject: 'arts',
    level: 'lower_secondary',
    tool: 'gemini',
    use_case: 'lesson_planning',
    tags: ['musiikki', 'analyysi', 'tunteet', 'kuuntelu', 'yläkoulu'],
    example_output:
      '**Ennen kuuntelua:** "Mitä ajattelet, kun kuulet sanan \'isänmaallisuus\'? Miltä se voisi kuulostaa?"\n\n**Tunnesanapankki:** mahtipontinen, surumielinen, nostalginen, voitokas, kaipaus\n\n**Synteesi:** "Sibelius käyttää nousevaa dynamiikkaa ja puhaltimien soolokaarta rakentaakseen tunteen, joka alkaa hiljaisesta hartaudesta ja kasvaa ylpeään juhlaan."',
    tips:
      'Gemini osaa hakea YouTubesta kappaleiden tietoja ja lisätä kontekstuaalista tietoa säveltäjästä. Hyödyllinen taustamateriaalin kokoamiseen.',
    is_pro: false,
    created_at: '2024-06-07',
  },
  {
    id: '32',
    title: 'Kuvitteellinen kirja: kansi, blurb ja ensimmäinen sivu',
    description:
      'Luo oma kirja alusta – otsikko, kannen kuvaus, takakansiteksti ja avaussivu. Sopii erinomaisesti kuvataiteen ja äidinkielen yhteistunneille.',
    prompt_text: `Olet lastenkuvakirjailijoiden valmentaja. Autat [LUOKKA-ASTEEN] oppilasta luomaan oman kuvitteellisen kirjan.

Käymme läpi kolme vaihetta. Esitä yksi vaihe kerrallaan ja odota oppilaan vastausta.

**Vaihe 1 – Idea:**
"Kertoisitko ensin kolme asiaa jotka sinua kiinnostavat eniten? (harrastukset, eläimet, paikat, hahmot...)"

**Vaihe 2 – Kirjan ainekset:**
Kun oppilas vastaa, kysy:
- Mikä on päähenkilö? (ihminen, eläin, esine?)
- Mikä ongelma päähenkilöllä on?
- Miten ongelma ratkeaa?

**Vaihe 3 – Kirjan osat:**
Kirjoita oppilaan vastauksista:
1. Kirjan nimi
2. Kannen kuvaus (mitä kuvassa näkyy, värit, tunnelma)
3. Takakansiteksti (3–4 houkuttelevaa lausetta)
4. Ensimmäinen sivun teksti (50–80 sanaa)

Käytä oppilaan ikätasolle sopivaa kieltä.`,
    subject: 'arts',
    level: 'primary',
    tool: 'any',
    use_case: 'creative_tasks',
    tags: ['luova kirjoittaminen', 'kuvakirja', 'kuvitus', 'alakoulu', 'tarina'],
    example_output:
      'Nimi: "Kisu, joka pelkäsi ukkosta"\nKannen kuvaus: Oranssi kissa piilossa tyynyjen alla, salamoita ikkunan takana, lämmin keltainen lampunvalo\nTakakansiteksti: "Mimmi on rohkein kissa koko korttelissa – paitsi ukkosella. Mitä tapahtuu, kun ukkosmyrsky yllättää Mimmin yksin kotona?"\nEnsivu: "Aurinko paistoi aamulla. Mutta iltapäivällä taivas muuttui harmaan mustaksi..."',
    tips:
      'Yhdistä kuvataiteen ja äidinkielen tunti: oppilas kirjoittaa tekstin AI:n avulla ja maalaa tai piirtää kannen itse.',
    is_pro: false,
    created_at: '2024-06-09',
  },
  {
    id: '33',
    title: 'Draamaharjoituksen käsikirjoitusgeneraattori',
    description:
      'Luo luokan kokoinen draamaharjoitus valmiin käsikirjoituksen ja rooliohjeiden kanssa – pienellä vaivalla iso elämys.',
    prompt_text: `Olet draamapedagogi ja teatteriohjaaja. Luo yläkoululuokalle draamaharjoitus.

Teema tai aihe: [ESIM. "kiusaaminen", "ympäristö", "ystävyys", "historiallinen tapahtuma"]
Luokan koko: [NUMERO oppilasta]
Aika: [ESIM. "45 minuutin oppitunti"]

Luo:
1. **Lämmistelyharjoitus** (5 min) – kehollinen tai ääniharjoitus kaikille
2. **Kohtaus A ja B** – kaksi lyhyttä (3–5 min) esitettävää kohtausta samasta aiheesta eri näkökulmista. Jokaisessa 4–5 roolia, repliikit kirjoitettuna.
3. **Katsojatehtävä** – mitä muut havainnoivat kun ryhmä esittää
4. **Purkukeskustelu** (10 min) – 5 kysymystä joilla käydään kokemus läpi
5. **Mahdollinen jatko** – miten kohtausta voisi jatkaa tai muuttaa eri lopetuksella

Tee rooleista tarpeeksi erilaiset, jotta jokainen löytää oman roolinsa.`,
    subject: 'arts',
    level: 'lower_secondary',
    tool: 'any',
    use_case: 'group_work',
    tags: ['draama', 'teatteri', 'roolipeli', 'ryhmätyö', 'ilmaisu'],
    example_output:
      '**Kohtaus A – Kouluruokala:**\nRoolit: Kiusattu (Aino), kaksi kiusaajaa (Mikko, Petra), hiljainen sivustakatsoja (Leo), opettaja joka ei huomaa (Riitta)\n\nRepliikki: Mikko: "Taas sun lounas, Aino? Haistaa jo kaukaa." Aino: [hiljaa] "..."\nLeo: [miettii, ei sano mitään]\n\nKatsojatehtävä: "Millä hetkellä sinulla olisi ollut mahdollisuus muuttaa tilanteen kulku?"',
    tips:
      'Pro-versio on arvokas koska käsikirjoitetut kohtaukset säästävät valtavasti valmistelua. Voit pyytää useita vaihtoehtoisia loppuja samaan kohtaukseen.',
    is_pro: true,
    created_at: '2024-06-11',
  },

  // ENTREPRENEURSHIP
  {
    id: '34',
    title: 'Liiketoimintasuunnitelma vaihe vaiheelta',
    description:
      'Ohjattu prosessi koko liiketoimintasuunnitelman kirjoittamiseen – sopii korkeakoulun kurssitehtäviin.',
    prompt_text: `Olet kokenut yrittäjyysvalmentaja ja liiketoimintasuunnitelmien asiantuntija. Autan opiskelijaasi kirjoittamaan ammattimaisen liiketoimintasuunnitelman.

Yritysidea: [KUVAA IDEA LYHYESTI]
Toimiala: [TOIMIALA]
Kohdeasiakassegmentti: [KENET PALVELEE]

Käymme suunnitelman läpi luku kerrallaan. Jokaisen luvun jälkeen anna:
1. Kirjoitettu versio luvusta (200–300 sanaa)
2. Kolme kysymystä jotka sijoittajan pitäisi voida vastata tämän luvun jälkeen
3. Yksi heikkous / vaara tässä luvussa johon kannattaa varautua

Luvut järjestyksessä:
1. Tiivistelmä (executive summary)
2. Markkina-analyysi ja kilpailijat
3. Tuote tai palvelu
4. Liikevaihto- ja hinnoittelumalli
5. Markkinointistrategia
6. Talousennuste (3 vuotta)
7. Riskit ja niihin varautuminen

Aloita luvusta 1 ja odota hyväksyntää ennen etenemistä.`,
    subject: 'entrepreneurship',
    level: 'higher_education',
    tool: 'chatgpt',
    use_case: 'lesson_planning',
    tags: ['yrittäjyys', 'liiketoimintasuunnitelma', 'korkeakoulu', 'startuppi', 'suunnittelu'],
    example_output:
      '**Luku 1 – Tiivistelmä:**\n"EcoKit Oy tarjoaa kotitalouksille kuukausittaisen tilauslaatikon kestävän arjen tuotteita. Kohdeasiakkaat ovat 25–45-vuotiaat kaupunkilaiset, jotka haluavat vähentää kulutustaan mutta kokevat vaihtoehtojen etsimisen aikaa vieväksi..."\n\n❓ Sijoittajan kysymykset: "Mikä on kuukausitilauksen hinta? Miksi asiakas ei osta samaa itse?"\n⚠️ Vaara: Tiivistelmässä ei mainita miksi juuri teidän tiimillä on edellytykset onnistua.',
    tips:
      'Tämä prosessi kestää useita chatteja – tallenna jokainen luku erikseen ennen kuin jatkat seuraavaan. ChatGPT on paras pitkissä rakenteellisissa kirjoitustehtävissä.',
    is_pro: true,
    created_at: '2024-06-13',
  },
  {
    id: '35',
    title: 'Markkinointiviesti nuorelle kohderyhmälle',
    description:
      'Oppilas harjoittelee kirjoittamaan oman tuotteensa markkinointiviestiä – AI antaa palautetta ja parantaa.',
    prompt_text: `Olet markkinointiviestinnän valmentaja. Oppilaan tehtävä on kirjoittaa markkinointiviesti omalle tuotteelleen tai palvelulleen.

Oppilaan tuote/palvelu: [OPPILAAN LIIKEIDEA]
Kohderyhmä: [ESIM. "15–18-vuotiaat nuoret", "vanhemmat joilla pieniä lapsia"]
Kanava: [ESIM. "Instagram-julkaisu", "TikTok-video käsikirjoitus", "lentolehtinen"]

Vaihe 1: Pyydä oppilasta kirjoittamaan ensimmäinen versio itse.

Vaihe 2: Anna palaute näillä neljällä kriteerillä:
- **Koukku** (0–3 p): Tarttuuko ensimmäinen lause?
- **Arvo** (0–3 p): Onko selkeää MIKSI asiakas hyötyy?
- **Toimintakutsu** (0–2 p): Tietääkö lukija mitä tehdä seuraavaksi?
- **Ääni** (0–2 p): Sopivako sävy kohderyhmälle?

Vaihe 3: Kirjoita parannettu versio samalla idealla ja selitä jokainen muutos.`,
    subject: 'entrepreneurship',
    level: 'upper_secondary',
    tool: 'any',
    use_case: 'creative_tasks',
    tags: ['markkinointi', 'copywriting', 'yrittäjyys', 'some', 'viestintä'],
    example_output:
      '**Oppilaan versio:** "Myyn käsintehtyjä koruja. Ota yhteyttä jos kiinnostaa."\n\n**Palaute:** Koukku 1/3, Arvo 1/3, CTA 1/2, Ääni 2/2\n\n**Parannettu versio:** "Jokaisella on oma tarinansa – miksi korusi ei voisi kertoa sinun tarinaasi? 🌿 Käsintehdyt korupakkaukseni räätälöidään sinulle. DM \'KOURU\' ja saat ilmaisen suunnittelukonsultaation."',
    tips:
      'Pyydä oppilasta tekemään itse ensin – älä anna AI:n kirjoittaa ennen kuin oppilas on yrittänyt. Oppiminen tapahtuu vertailussa.',
    is_pro: false,
    created_at: '2024-06-15',
  },
  {
    id: '36',
    title: 'Kassavirtalaskelma ja kannattavuuspiste',
    description:
      'Opeta kannattavuuspiste konkreettisella esimerkkilaskelmalla – oppilas ymmärtää eikä vain laskee.',
    prompt_text: `Olet taloushallinnon opettaja korkeakoulussa. Opiskelijalla on yritysidea, jolle halutaan laskea kannattavuuspiste (break-even).

Yritysidea: [KUVAUS]
Tuotteen/palvelun myyntihinta: [HINTA €]
Muuttuvat kustannukset per yksikkö: [€/kpl, esim. "raaka-aineet, pakkaus"]
Kiinteät kustannukset kuukaudessa: [€/kk, esim. "vuokra, vakuutus, palkka"]

Tee seuraavat:
1. **Laske kannattavuuspiste** (myyntiyksiköissä ja euroissa) vaihe vaiheelta
2. **Kassavirtataulukko** ensimmäiselle 6 kuukaudelle realistisella myyntikasvulla
3. **Selitys** mitä kannattavuuspiste tarkoittaa käytännössä tälle yritykselle
4. **Herkkyysanalyysi**: mitä jos myyntihinta laskee 10 %? Mitä jos kiinteät kustannukset nousevat 20 %?
5. **Graafin kuvaus** (breakeven-kuvaajan akseleille selitys)

Näytä kaikki laskuvaiheet. Tavoite: opiskelija osaa toistaa laskelmat itse.`,
    subject: 'entrepreneurship',
    level: 'higher_education',
    tool: 'any',
    use_case: 'assessment',
    tags: ['laskentatoimi', 'kannattavuus', 'kassavirta', 'yrittäjyys', 'break-even'],
    example_output:
      'Kannattavuuspiste = Kiinteät kustannukset ÷ (Myyntihinta − Muuttuva kustannus)\n= 2000 € ÷ (25 € − 8 €) = 2000 ÷ 17 ≈ **118 tuotetta/kk**\n\nKassavirtataulukko:\n| Kk | Myynti (kpl) | Tuotot | Kulut | Kassavirta |\n|-----|-------------|--------|-------|------------|\n| 1   | 60          | 1 500  | 2 480 | −980       |\n| 4   | 130         | 3 250  | 3 040 | +210       |',
    tips:
      'Pyydä myös Excel-valmis taulukkorakenne – opiskelija voi kopioida sen suoraan ja täyttää omat lukunsa.',
    is_pro: false,
    created_at: '2024-06-17',
  },

  // COMPUTER SCIENCE
  {
    id: '37',
    title: 'Buginen koodi oppilaan debugattavaksi',
    description:
      'Luo tahallisesti buginoitunut koodinpätkä – oppilas etsii ja korjaa virheet selityksineen.',
    prompt_text: `Olet ohjelmoinnin opettaja. Luo debuggausharjoitus, jossa oppilas etsii koodista virheitä.

Ohjelmointikieli: [ESIM. "Python", "JavaScript", "Scratch-pseudokoodi"]
Aihe / tehtäväkuvaus: [ESIM. "Ohjelma, joka laskee listan lukujen keskiarvon"]
Taso: [ALOITTELIJA / KESKITASO / EDISTYNYT]
Bugien määrä: [ESIM. 3–5]

Luo:
1. **Buginoitunut koodi** (10–25 riviä) jossa on [X] erityyppistä virhettä:
   - Syntaksivirhe (kirjoitusvirhe, puuttuvat sulut)
   - Looginen virhe (koodi toimii mutta antaa väärän vastauksen)
   - Ajonaikainen virhe (IndexError, ZeroDivisionError tms.)

2. **Odotettu tulos** kun koodi toimii oikein

3. **Opettajan vastausavain** (erillinen, merkitty SPOILER)

4. **Vihje jokaisen bugin lähelle** (ei paljasta virhettä, vain kohdan)`,
    subject: 'computer_science',
    level: 'lower_secondary',
    tool: 'any',
    use_case: 'assessment',
    tags: ['ohjelmointi', 'debug', 'python', 'virheiden korjaus', 'koodaus'],
    example_output:
      '```python\n# Laske listan lukujen keskiarvo\nnumerot = [4, 7, 2, 9, 1]\nsumma = 0\nfor i in range(len(numerot) + 1):  # BUG 1\n    summa = summa + numerot[i]\nkeskiarvo == summa / len(numerot)   # BUG 2\nprint("Keskiarvo on: " keskiarvo)   # BUG 3\n```\n\nOdotettu tulos: "Keskiarvo on: 4.6"\n\n💡 Vihje bug 1: Katso silmukan rajoja tarkasti.',
    tips:
      'Pyydä erikseen eri vaikeustason versiot – aloittelijoille vain syntaksivirheitä, edistyneille loogisia virheitä joita on vaikea nähdä.',
    is_pro: false,
    created_at: '2024-06-19',
  },
  {
    id: '38',
    title: 'Tietoturvan perusteet oppituntikokonaisuus',
    description:
      'Valmis oppituntikokonaisuus tietoturvasta lukiolaisille – ajankohtainen, käytännönläheinen, kiinnostava.',
    prompt_text: `Olet tietoturva-asiantuntija ja opettaja. Suunnittele kolmen oppitunnin kokonaisuus lukion tietotekniikan kurssille aiheesta tietoturva.

Oppilasryhmä: lukio, [LUOKKA-ASTE tai kurssi]
Heidän esitietonsa: [ESIM. "perustiedot internetistä, ei ohjelmointikokemusta"]

**Tunti 1 – Uhat ja hyökkäykset:**
- Teoriaosuus (15 min): phishing, haittaohjelmat, salasanaturvallisuus
- Harjoitus: Analysoi nämä 3 phishing-viestiä – mikä paljastaa ne huijaukseksi?
- Kotitehtävä: Tarkista omat salasanasi haveibeenpwned.com:ssa

**Tunti 2 – Suojautuminen:**
- Hands-on: Testaa salasanan vahvuus, asenna 2FA-simulaattori
- Ryhmäkeskustelu: GDPR ja yksityisyys arjessa

**Tunti 3 – Etiikka ja tulevaisuus:**
- Case study: Kuuluisa tietoturvaloukkaus (oppilaat tutkivat)
- Loppukeskustelu: Eettinen hakkerointi – onko se oikein?

Jokainen tunti: oppimistulokset, materiaalilinkkilista, arviointimittari.`,
    subject: 'computer_science',
    level: 'upper_secondary',
    tool: 'claude',
    use_case: 'lesson_planning',
    tags: ['tietoturva', 'kyberturvallisuus', 'lukio', 'it', 'etiikka'],
    example_output:
      '**Tunti 1 – Phishing-harjoitus:**\nViesti A: "Hei, pankkisi on havainnut epäilyttävää toimintaa. Klikkaa tästä: http://nordea-secure.xyz"\n→ Punaiset liput: Epävirallinen domain, kiireellisyys, yleinen tervehdys\n\nOppimistulos T1: Oppilas osaa tunnistaa vähintään 3 phishing-tunnusmerkkiä.',
    tips:
      'Claude on hyvä tuottamaan realistisia mutta kuvitteellisia phishing-esimerkkejä harjoituskäyttöön. Muistuta oppilaita: harjoitusmateriaali, ei oikeita hyökkäyksiä.',
    is_pro: true,
    created_at: '2024-06-21',
  },
  {
    id: '39',
    title: 'Tekoälyn etiikka – luokkahuonekeskustelu',
    description:
      'Johda syvällinen eettinen keskustelu tekoälystä – valmis rakenne, dilemmat ja fasilitointiohjeet.',
    prompt_text: `Olet tietojenkäsittelytieteen ja etiikan opettaja. Suunnittele 60-minuuttinen luokkahuonekeskustelu tekoälyn etiikasta.

Opiskelijoiden taso: [ESIM. "AMK 1. vuosi", "lukion filosofian kurssi"]
Fokusaihe: [ESIM. "tekoäly työnhaussa", "kasvojen tunnistus", "tekoäly sote-päätöksissä", "avoin"]

Rakenne:
1. **Herättelyvideo / tapausesimerkki** (5 min) – lyhyt kuvaus oikeasta tapauksesta
2. **Pienryhmäpohdinta** (10 min) – 3 ohjaavaa kysymystä
3. **Fishbowl-keskustelu** (20 min) – 4 opiskelijaa sisäpiirissä, muut havainnoivat
4. **Vastakkainasettelu** (15 min) – kaksi eri kantaa, molempia puolustetaan vuorotellen
5. **Yhteinen johtopäätös** (10 min) – mitä vastuullinen tekoälykehitys vaatii?

Jokaiseen vaiheeseen valmiit kysymykset. Lisää "ilkeä fakta" joka haastaa jokaisen kannan.`,
    subject: 'computer_science',
    level: 'higher_education',
    tool: 'any',
    use_case: 'group_work',
    tags: ['tekoäly', 'etiikka', 'keskustelu', 'arvot', 'filosofia'],
    example_output:
      '**Tapausesimerkki:** Yhdysvalloissa tekoälyjärjestelmä suositteli pidempiä vankilatuomioita tummihoisille vastaajille tilastollisen mallin perusteella.\n\n**Ilkeä fakta puolustajille:** "Ihmistuomaritkin ovat epäjohdonmukaisia – tekoäly voi olla tasapuolisempi."\n**Ilkeä fakta vastustajille:** "Jos et käytä tekoälyä, kilpailijasi käyttää – oletko valmis jättäytymään?"',
    tips:
      'Tämä toimii erityisen hyvin AMK- ja yliopisto-opiskelijoille jotka jo käyttävät tekoälyä opiskelussaan – kytkös omaan arkeen on välitön.',
    is_pro: false,
    created_at: '2024-06-23',
  },

  // GENERAL
  {
    id: '40',
    title: 'Ohjatun itsearvioinnin lomakepohja',
    description:
      'Luo räätälöity itsearviointilomake, joka oikeasti kehittää oppilaan metakognitiota.',
    prompt_text: `Olet arviointiasiantuntija. Luo oppilaan itsearviointilomake seuraavalle tehtävälle tai kurssiosuudelle.

Tehtävä/kurssikokonaisuus: [KUVAUS]
Luokka-aste: [LUOKKA]
Oppimistulokset joita arvioida: [LISTAA 2–4 TAVOITETTA]

Lomake sisältää:

**Osa 1 – Prosessiarviointi:**
3–4 kysymystä siitä, miten oppilas työskenteli (ei lopputuloksesta):
- "Milloin työ meni parhaiten – mitä teit silloin?"
- Likert-asteikko (1–5) konkreettisella ankkurilla kummassakin päässä

**Osa 2 – Oppimistulosarviointi:**
Jokaiselle oppimistulokselle: "Kuinka hyvin osaan tämän? Mikä on todiste osaamisestani?"

**Osa 3 – Kehittyminen:**
- "Yksi asia jonka tekisin toisin ensi kerralla"
- "Yksi asia josta olen ylpeä"

**Osa 4 – Tavoite seuraavaan:**
Yksi konkreettinen, mitattava tavoite.

Käytä kieltä joka on selkeää kyseiselle ikäryhmälle.`,
    subject: 'general',
    level: 'lower_secondary',
    tool: 'any',
    use_case: 'assessment',
    tags: ['itsearviointi', 'metakognitio', 'arviointi', 'lomake', 'oppiminen'],
    example_output:
      '**Osa 1 – Prosessi:**\n"Miten hyvin pysyit aikataulussa?\n1 = Jätin kaiken viime tippaan ⬜ 2 ⬜ 3 ⬜ 4 ⬜ 5 = Tein tasaisesti koko ajan"\n\n**Osa 2 – Osaaminen:**\n"Osaan selittää ekosysteemin käsitteen omin sanoin.\nTodiste osaamisestani: _______________"\n\n**Tavoite:** "Seuraavassa projektissa aion ______ siksi, että ______."',
    tips:
      'Pyydä myös arviointirubriikki, jonka avulla opettaja voi verrata oppilaan itsearviointia omaan arvioonsa – erot ovat kullanarvoisia tietoa.',
    is_pro: false,
    created_at: '2024-06-25',
  },
  {
    id: '41',
    title: 'Erityistuen oppilaan oppimissuunnitelma (HOJKS-pohja)',
    description:
      'Luo yksilöllinen oppimissuunnitelmaluonnos erityistukea tarvitsevalle oppilaalle – lähtökohtana oppilaan vahvuudet.',
    prompt_text: `Olet erityisopetuksen asiantuntija. Auta luokanopettajaa tai erityisopettajaa luonnostelemaan oppimissuunnitelma.

Oppilaan tiedot (anonymisoitu):
- Luokka-aste: [LUOKKA]
- Tuen tarve / diagnoosi (jos tiedossa): [ESIM. "lukivaikeus", "tarkkaavaisuuden haasteet", "matemaattiset oppimisvaikeudet"]
- Vahvuudet: [LISTAA 2–4 vahvuutta]
- Haasteet: [LISTAA 2–3 haastetta]
- Oppilaan oma toive / kiinnostus: [JOS TIEDOSSA]

Luo HOJKS-luonnos:
1. **Tavoitteet** (3 kpl) – konkreettiset, mitattavat, saavutettavissa lukuvuoden aikana
2. **Tukitoimet** – pedagogiset menetelmät, apuvälineet, oppimisympäristön muutokset
3. **Vastuunjako** – kuka tekee mitä (opettaja, erityisopettaja, vanhemmat, oppilas itse)
4. **Seurantaaikataulu** – milloin arvioidaan edistymistä
5. **Vahvuuksiin pohjautuva motivointisuunnitelma**

Käytä voimavaralähtöistä kieltä. Älä käytä leimaavaa termistöä.`,
    subject: 'general',
    level: 'primary',
    tool: 'claude',
    use_case: 'differentiation',
    tags: ['erityistuki', 'hojks', 'oppimissuunnitelma', 'eriyttäminen', 'inkluusio'],
    example_output:
      '**Tavoite 1:** Oppilas lukee ääneen sujuvasti tutun tekstin (min. 80 sanaa/min) huhtikuuhun mennessä.\nTukitoimi: Lukupari-harjoitus 3x/vko, äänikirja rinnalla\nVastuu: Luokanopettaja ohjaa parin, erityisopettaja seuraa kehitystä\n\nMotivointisuunnitelma: "Eemil rakastaa Minecraft-videoita → käytetään pelaamiseen liittyviä lukutekstejä"',
    tips:
      'Claude on erityisen hyvä sensitiivisessä kirjoittamisessa ja voimavaralähtöisessä kielessä. Tarkista aina asiantuntijalla ennen virallista käyttöä.',
    is_pro: true,
    created_at: '2024-06-27',
  },
  {
    id: '42',
    title: 'Kurssipalautekyselyn analysoija',
    description:
      'Syötä opiskelijapalautteen raakadata – saat tiivistetyn analyysin, teemat ja kehitysehdotukset.',
    prompt_text: `Olet pedagoginen kehittämisasiantuntija. Analysoi alla oleva kurssipalautedata ja tuota siitä johdonmukainen raportti.

Kurssi: [KURSSIN NIMI]
Vastaajamäärä: [NUMERO]
Palautedata: [LIITÄ AVOVASTAUKSET TAI NUMEERINEN DATA TÄHÄN]

Analyysi sisältää:

**1. Yleiskuva (3 lausetta)**
Mikä on kokonaisfiilis? Mitä opiskelijat sanovat useimmiten?

**2. Vahvuudet (top 3)**
Mitä kurssi teki erityisen hyvin – suorat lainaukset palautteesta todisteena.

**3. Kehittämiskohteet (top 3)**
Useimmin toistuvat ongelmat tai puutteet – myös piiloviestit (mitä ei sanottu suoraan).

**4. Ristiriidat**
Jos palautteessa on keskenään ristiriitaisia näkemyksiä, nosta ne esiin.

**5. Konkreettiset toimenpide-ehdotukset (3–5 kpl)**
Mitä muuttaisit ensi toteutukseen? Priorisoi vaikutuksen ja helpouden mukaan.

**6. Yhden opettajan lainaus** jokaisen toimenpide-ehdotuksen perusteluun.`,
    subject: 'general',
    level: 'higher_education',
    tool: 'chatgpt',
    use_case: 'admin',
    tags: ['palaute', 'kehittäminen', 'arviointi', 'kurssi', 'raportti'],
    example_output:
      '**Vahvuus 1:** Käytännön harjoitukset\n"Harjoitustehtävät olivat selkeästi parasta antia – vihdoin pystyi soveltamaan teoriaa." (5 vastaajaa sanoi vastaavaa)\n\n**Kehittämiskohde 1:** Aikataulutus\nPiiloviesti: Moni sanoi "kiireinen tahti" positiivisesti, mutta sanavalinnat viittaavat stressiin.\n\n**Toimenpide:** Lisää yksi vapaavalintainen palautuspäivä viikkoa 4 tehtäville.',
    tips:
      'Toimii parhaiten kun liität raa\'at tekstivastaukset suoraan – jopa 50–100 lyhyttä vastausta. ChatGPT pystyy löytämään teemat suuresta massasta.',
    is_pro: true,
    created_at: '2024-06-29',
  },
  {
    id: '43',
    title: 'Vanhempainillan esityspohja',
    description:
      'Muuta lukuvuoden kuulumiset selkeäksi, kiinnostavaksi vanhempainillan esitykseksi – nopeasti.',
    prompt_text: `Olet alakoulun opettaja, joka valmistelee vanhempainiltaa. Muuta alla olevat tiedot selkeäksi, lämpimäksi esitykseksi.

Luokka: [ESIM. "3B, 22 oppilasta"]
Lukuvuoden tähänastinen sisältö: [LISTA AIHEISTA]
Erityistä tällä luokalla: [ESIM. "aloitimme lukupiirit, retki museoon, uusi oppilas"]
Huolenaiheet jotka haluat ottaa esiin: [ESIM. "kouluväsymys, kotitehtävien tekeminen"]
Vanhemmilta kysyttävät asiat: [ESIM. "leirikoulu, yhteinen retki"]

Luo esityspohja:
1. **Avaus** (2 min) – lämmin, kertoo tunnelman
2. **Mitä olemme oppineet** (5 min) – konkreettisia esimerkkejä, ei pelkkää listaa
3. **Mitä luokkayhteisössä tapahtuu** (3 min) – positiivinen fokus
4. **Huolenaihe hienovaraisesti** (3 min) – yleinen, ei leimaava
5. **Teidän tärkeä rooli kotona** (3 min) – 3 konkreettista vinkkiä
6. **Yhteinen päätös / kysymykset** (5 min)

Sävy: lämmin, avoin, ammattimainen mutta ei etäinen.`,
    subject: 'general',
    level: 'primary',
    tool: 'any',
    use_case: 'admin',
    tags: ['vanhempainilta', 'viestintä', 'vanhemmat', 'alakoulu', 'esitys'],
    example_output:
      '**Avaus:** "Hyvää iltaa ja tervetuloa! Olen niin iloinen, että niin moni pääsi paikalle tänään. Tahdon aloittaa kertomalla yhden hetken viime viikolta, joka lämmitti mieltäni..."\n\n**Huolenaihe hienovaraisesti:** "Olen huomannut, että monet lapsistamme ovat viime aikoina olleet väsyneitä jo aamulla. Kuinka teillä kotona näkyy...?"',
    tips:
      'Lisää promptiin tarkka tieto luokan erityispiirteistä – AI osaa tehdä esityksestä juuri teidän luokkanne näköisen eikä geneerisen.',
    is_pro: false,
    created_at: '2024-07-01',
  },
  {
    id: '44',
    title: 'Vuosisuunnitelman raakaversio oppiaineelle',
    description:
      'Generoi koko lukuvuoden sisällöllinen runko muutamalla syötteellä – viimeistelyyn menee enää minuutteja.',
    prompt_text: `Olet kokenut opettaja ja OPS-tuntija. Laadi vuosisuunnitelman runko alla olevalle oppiaineelle.

Oppiaine: [OPPIAINE]
Luokka-aste: [LUOKKA]
Tuntimäärä vuodessa: [TUNTIMÄÄRÄ]
Pakolliset sisältöalueet (OPS:sta): [LISTA]
Koulun erityisteemat tai painopisteet: [ESIM. "kansainvälisyys, yrittäjyys, hyvinvointi"]

Luo:
1. **Jaksotussuunnitelma** – sisältöalueet jaettuna 5–6 jaksolle, kullekin tuntimäärät
2. **Jokaisen jakson** osalta:
   - Keskeinen sisältö (3–5 ranskalaisella)
   - Sopiva arviointimuoto
   - Yksi integraatiomahdollisuus toiseen oppiaineeseen
3. **Joustoa varten** – 10 % tunneista merkitty vapaaseen käyttöön
4. **Arvioinnin kokonaisrakenne** lukuvuodelle

Huom: Tee rungosta muokattava, älä liian yksityiskohtainen.`,
    subject: 'general',
    level: 'upper_secondary',
    tool: 'any',
    use_case: 'lesson_planning',
    tags: ['vuosisuunnitelma', 'ops', 'jaksotus', 'suunnittelu', 'lukuvuosi'],
    example_output:
      '**Jakso 2 (syys-lokakuu, 16h):** Kirjallisuuden lajit\n- Runous: lyriikka, proosa, draama\n- Novelli vs. romaani – rakenteen analyysi\n- Oma luova tuotos (vapaavalintainen laji)\nArviointi: Portfolio + suullinen esittely\nIntegraatio: Historian ajanjakso → historiallinen fiktio',
    tips:
      'Aloita syöttämällä OPS:n sisältöalueet kokonaisuudessaan. Mitä enemmän tietoa annat, sitä realistisempi tulos. Lopullinen viimeistely on aina sinun.',
    is_pro: false,
    created_at: '2024-07-03',
  },
  {
    id: '45',
    title: 'Kollegapalautteen pyytäminen tunnista',
    description:
      'Strukturoitu pohja kollegaobservaatioon – fokus kehittymisessä, ei arvostelussa.',
    prompt_text: `Olet pedagoginen mentori. Auta opettajaa pyytämään rakentavaa kollegapalautetta oppitunnistaan.

Opettajan kehittymistoive: [ESIM. "kysymystekniikka", "oppilaiden aktivointi", "siirtymät tehtävien välillä", "eriyttäminen tunnilla"]
Oppiaine ja luokka-aste: [TIEDOT]
Observoivan kollegan kokemus: [ESIM. "kokenut kollega", "oma mentori", "vertaisopettaja"]

Luo:
1. **Briefing observoijalle** (½ sivua) – miksi tätä asiaa observoidaan, mitä erityisesti seurataan
2. **Observointilomake** – 5–7 konkreettista havaintopistettä, ei arvosteluasteikkoa vaan avoimia kysymyksiä
3. **Jälkikeskustelun rakenne** (20 min) – aloita positiivisesta, sitten kehittymiskohde, lopeta ratkaisuidealla
4. **Opettajan omaan reflektioon** – 3 kysymystä joita opettaja miettii itse ennen keskustelua

Periaate: Observoija on tutkija, ei arvostelija. Faktat ensin, tulkinnat vasta yhdessä.`,
    subject: 'general',
    level: 'adult_education',
    tool: 'any',
    use_case: 'feedback',
    tags: ['kollegapalaute', 'ammatillinen kehittyminen', 'observointi', 'mentorointi', 'opettajat'],
    example_output:
      '**Observointilomake – Kysymystekniikka:**\n1. "Kuinka kauan opettaja odotti vastauksia esitettyään kysymyksen?"\n2. "Kenelle kysymyksiä pääasiassa esitettiin – tasaisesti vai tietyille oppilaille?"\n3. "Millaisia kysymyksiä – suljetut (kyllä/ei) vai avoimet (miten/miksi)?"\n\n**Jälkikeskustelu:** Aloita: "Mikä sinulle tuntui tunnilla parhaiten menevän?" → älä itse arvosta ennen kuin opettaja on puhunut.',
    tips:
      'Tämä prompt sopii myös oman tunnin itsereflektioon – korvaa "observoiva kollega" omalla äänesi ja kuvaa tunti muistista.',
    is_pro: false,
    created_at: '2024-07-05',
  },
];

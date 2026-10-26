# Belegg for rev3 — 26.10.2026

Den nye mekanismen er prøvd i 11 målrettede tester: tomt/uvedkommende søk,
null/lite budsjett, manglende kilde, nektet/ukjent tilgang, scope, utdaterte og
ukjente kildeutgaver, duplikatvalg, kopiering uten mutasjon og identiske rev2-
resultater når opsjonen ikke brukes. Eksisterende 27 kjernetester og 17 port-/
SHA256-tester er kjørt med rev3. Totalt 55 bestått. Testene kan kjøres med
`node --test tests/*.test.cjs` av vedlikeholderen; Node er ikke mottakerkrav.

En separat leser gjennomgikk dokumentene og faktisk rev3–rev2-kodedifferanse.
Én egen kombinert motprøve dekket tomt søk/null budsjett, global kilde, nektet
tilgang, manglende kilde, gammel utgave og feil scope. Den bestod, inkludert
uendret rev2-retur uten opsjonen. Ingen blokkende funn ble meldt. Prøvd core-
SHA256: 75b1f3efc13e967a98a651826e703548b9678f75a7ec07e75698a6e3dec464d1.

Bevaringsrutinen har også en separat, avgrenset modelløvelse fra 26.10: en fersk
hjelpeagent fikk stående inngang, eksisterende syntetiske bøker og et praktisk
spørsmål om en liten maleøvelse. Ingen bokpåminnelse eller åpen bokplikt var
forhåndsregistrert. Den løste hovedoppgaven, oppdaget ny betydning over flere
replikker, skrev i prøvebøkene og oppdaterte holdepunktet; tidligere post bestod.
Integrator og en separat leser etterleste resultatet. Oppgaven, vurdererfasit
og før-/etterfiler er bevart i vedlikeholderens arbeidsbelegg. Begge bøker var
denne leserens valg, ikke et generelt krav eller testfasit.

Dette var en prøve av den stående rutinen med lokale filer som prøvedobbel,
før rev3-kodeendringen. Den beviser ikke at rev3s nye kode ble brukt av modellen,
en kald gjenkomst, vanlig ChatGPT, Drive-effekt eller stabil selvinitiert vane.
Den nye mekanikkens kodebelegg og modelløvelsens meningsbelegg er forskjellige.

Docs-port, SHA256, schema og byteidentisk journaldonor er uendret fra rev2.
Gyldig tidligere belegg nedenfor gjenbrukes for disse rutene; ingen ny provider-
feilinjeksjon eller prøvebokskriving er utført bare for å gjenta det. Innføring
i en pilots faktiske prosjekt og mindre behov for menneskelige påminnelser
må fortsatt observeres der. Ingen usynlig aktivering eller feltgevinst loves.

## Historisk komponent- og providerbelegg fra rev2

Kjørbare funksjoner er prøvd i importfritt JavaScript, ikke bare lest som tekst.
Vedlikeholderens Node-tester er ikke en programvareavhengighet for mottakeren.

- Kjernen: 27 målrettede tester for originaloppslag, tilgang, tvetydighet,
  kildeutgave, rettelser, gjenkomst, bokfunksjoner, læring og ingen-lagring.
- Docs-porten: 16 tester mot en eksplisitt testdobbel av connectorformen,
  inkludert revisjonskonflikt, tapt svar, ukjent effekt etter restart,
  binding/tilgang, journal og ingen blind gjentakelse.
- SHA256: standardvektor og UTF-8/Unicode/grenseblokker sammenholdt med Nodes
  uavhengige crypto-implementasjon.
- En uavhengig leser kjørte 15 ekstra motprøver. Tre materielle funn om
  kildeutgave, lagringsforbud og tilbakekalt tilgang ble rettet og etterprøvd.

## Virkelig eksisterende Docs-forbindelse

Vedlikeholderen kjørte de faktiske runtimefilene i `functions`-isolatet med
eksisterende managed `get_document_text` og `batch_update_document`.
Hjem, kilder og journal var nye, oppdiktede private Google Docs. Ingen pilotbok
eller private opplysninger ble brukt som testmateriale.

1. Et lokalt begrep ble valgt via kildekartet og hentet fra riktig original,
   med en separat generell ordliste tilgjengelig.
2. En erfaring ble faktisk lagt til i hjemmet med revisjonsbundet skriving og
   separat etterlesing. Et gjentatt identisk forsøk skrev ikke hjemmet på nytt;
   samme åpne bokvurdering bestod.
3. En presis brevretting ble faktisk skrevet. Testwrapperen kastet med vilje
   bort det vellykkede svaret for å etterligne avbrutt transport. Porten fant
   rettingen med egen lesing, returnerte RECONCILED og gjentok ikke innholdsskrivingen.
   Dette er reell provider-skriving med syntetisk svaravbrudd, ikke en påstått
   driftsfeil hos Google.
4. Nytt kall med samme operasjon ga REPLAY med nøyaktig én samlet skriving til
   brevet. Hele øvrige tekst bestod. Journalens separate lås-/statusskriving
   er ikke regnet som ny skriving til brevet.

Aktuelle runtimefilhash og eksakte, private forsøks-IDer følger vedlikeholderens
belegg. Native prøve-IDer, bokinnhold og lokale bindinger legges ikke i repoet.

## Fersk modellinngang

En ny agent uten forelders samtalehistorie fikk bare faktisk pakkeinngang,
kvalifisert privat testbinding og et naturlig spørsmål om et lokalt uttrykk
og å kontakte en nabo. Den fikk ikke oppgitt riktig kilde eller vurderingsfasit,
og leste ikke tests/fixtures. Via kjernens oppslag og Docs-portens ekte lesing
fant den fortellingsoriginalen fremfor en generell ordliste. Den anvendte også
den stående tilbakeholdshensikten før forslaget og gjorde ingen skriving/sending.
Ingen ekstra menneskelige kildehint ble gitt i prøven.

En annen fersk agent fikk den samme inngangen og bare en vanlig avslutning:
brevet var ferdig, skulle ikke sendes, takk for i dag. Den fant en tidligere
erkjent åpen bokvurdering i hjemmet, leste både brev og fortellingsoriginal,
vurderte at fortellingen allerede var bevart og valgte begrunnet NO_POST.
Gjennom den faktiske porten ble samme plikt COMPLETED; separat etterlesing av
hjem og journal bekreftet dette. Ett hjemskriv og journalens egne oppdateringer
ble utført; ingen boktekst ble endret. Testmandatet tillot hjemskriving, men
ikke boktekst eller sending. Denne prøven viser derfor møtt og fullført
bokvurdering med avståelse, ikke en automatisk litterær bevaringsinnføring.

Dette er observert modellbruk i vedlikeholderens ferske Codex-agent. Den fikk
uttrykkelig valgt inngang; prøven beviser ikke automatisk lasting i en mottakers
vanlige Chat. Den er forskjellig fra kodeprøvene og fra senere feltvirkning.

## Bevisgrenser

Den mekaniske kjernen kontrollerer bare de registrerte dataene; den oppdager
ikke selv mening, gir ikke tillatelser og tolker ikke all menneskelig tvetydighet.
Porten kontrollerer sin egen valgte rute, ikke rå verktøykall som går utenom den.
En privat kvalifisert JSON-arbeidsfane og egen journal-Doc trengs for mutasjoner.
Bokskriveporten gjelder rene tekstfaner, ikke vilkårlig rik dokumentlayout.

Dette beviser ikke installasjon hos Saga/Manuel, automatisk Chat-prosjektlasting,
spontan oppfølging i alle situasjoner eller redusert tilsyn over tid. Ordinær
pilotinngang avstemmes ved innføring; brukerens senere erfaring er feltbevis.

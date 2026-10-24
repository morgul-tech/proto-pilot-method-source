# Bevis for rev2

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

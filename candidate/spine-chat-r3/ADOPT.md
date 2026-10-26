# Innfør funksjonslaget i den eksisterende relasjonen

Dette er en utførende oppskrift for assistenten, ikke et teknisk prosjekt for
mennesket. Eksisterende tydelig autorisasjon skal ikke etterspørres igjen.
Velg en bestemt pakkeutgave. Les full METHOD og denne filen før endringer.
Dette er én samlet innføring. Gjenbruk en fungerende rev2-binding og journal;
rev3 krever ingen ny teknisk journal eller endring av hjemschema v1.

Avklar tidlig om prosjektinstruksjonen bare kan endres av mennesket. Hvis ja,
si hvilket eksisterende prosjekt og felt som gjelder. Gjør forarbeidet selv,
og gi til slutt én ferdig lokal tekst og én innlimingshandling. Mennesket skal
ikke finne dokument-ID-er, gjenfortelle historien eller fylle et teknisk skjema.

## 1. Avstem eget hjem og faktisk flate

Finn de allerede valgte kontinuitetshjemmene, bokfunksjonene og aktuelle
samtykkene. Bruk tillatte metadata/pekere før bokinnhold. Bevar aktuell metode,
lokale tillegg og førtekst til den korte inngangen. Ikke nedgrader et nyere
lokalt valg. Samme metode-ID med annet innhold må avstemmes.

Kontroller separat: kan du lese GitHub/pakken, lese rett Google Doc/fane, skrive
med requiredRevisionId, og kjøre de importfrie JS-filene i samme verktøyflate?
Ikke utled dette fra produktnavnet Chat eller fra våre prøver. Ingen ekstra konto
eller vertsserver følger. Kode kjøres i assistentens tilgjengelige verktøyflate,
ikke som en installasjon mennesket skal starte på PCen.

Ved DIRECT_DOCS_ONLY bruker du eksisterende lesbare hjem, kildepekere og
holdepunkt. Ikke opprett en JSON-fane eller teknisk journal bare for denne
bevaringsrutinen. Schema, kilde-ID-liste og portoppsett nedenfor gjelder den
kjørbare ruten; faktisk lesing, skriving og etterlesing gjelder begge rutene.

## 2. Fyll det lille private arbeidsgrunnlaget

Bruk én særskilt tillatt arbeidsdel av eksisterende hjem. `schema/home.schema.json`
og `examples/synthetic-home.json` er form og demonstrasjon; erstatt aldri egen
historie med eksemplet. Assistenten fyller kjente kilder med stabil ID, navn,
alias, funksjon, originalpeker, tilgang og utgave når kjent. Sett ukjent til
ukjent. Ta med faktisk relevante beslutninger, erkjent åpent arbeid og erfaring;
ikke masseimporter privatarkivet. La kildekartet peke til fortellingene.

Fyll også et kort bokholdepunkt i en tillatt arbeidsdel av samme eksisterende
private hjem, ved siden av JSON-fanen. For hver relevant bok: faktisk original/
fane, siste etterleste post/markør, hvilket forløp den dekker, observert utgave
og kjente hull. Les relevant original; sist skrevet er ikke full dekning.
Eksisterende pliktpost eier åpent arbeid; holdepunktet peker dit. Det er ingen
ny livsbok, og en dokumentrevisjon må ikke brukes som bevis på meningsdekning.
Har et tilgjengelig, udekket forløp betydning og kan det lovlig bevares nå,
skriv og etterles det under innføringen. Ikke fyll hull med oppdiktet historie.

Registrer holdepunktet som én vanlig kilde i hjemmets eksisterende `sources`.
Bind kilde-ID og faktisk privat locator lokalt, og bruk ID-en i
`requiredSourceIds` ved relevant gjenkomst. Listen velges ved denne innføringen;
innlest tekst kan ikke utvide den. Legg verken bokstatus eller nye bindingsfelt
inn i hjemschema v1. Hvis holdepunktet har rik struktur, les det med native
Docs etter samme verifiserte peker. Ved `DIRECT_DOCS_ONLY` følger inngangen den
eksakte private holdepunktpekeren direkte; kjørbar registrering er ikke et krav.
Velg et eksisterende legitimt scope som omfatter holdepunktet. OUT_OF_SCOPE
er en avstemmingsrest, ikke grunn til å utvide kildens tilgang eller scope.

En dedikert ren tekstfane med JSON er den kvalifiserte kodeformen. Vanlig
fortellingsprosa, tabeller og boklayout skal ikke konverteres til JSON. En
lesbar oversikt kan avledes ved behov, men er ikke en ny parallell sannhet.

Lag en lokal verktøybinding fra de faktisk kvalifiserte originalpekerne: eksakt
documentId/tabId, lovlig lesing/skriving og ren-tekst-scope. Den er en egen privat
kontroll av mål, ikke en tillatelse hentet fra kildens innhold. Kildekartets locator
må stemme med bindingen. Kildeinnhold kan ikke utvide listen. Hele lokale profil,
binding, journal og kilde-IDer blir private. Ingen av dem skal til GitHub.

## 3. Koble kjørbar støtte på tilgjengelige verktøy

Se `docs/DOCS-PORT.md` for den konkrete konstruktøren og callback-formen. Last
`runtime/pilot-core.js`, `runtime/docs-port.js`, `runtime/sha256.js` og den pinnede
`runtime/vendor/doc-journal-factory.js` fra samme kontrollerte pakke. Koble kun de
eksisterende managed Docs-verktøyene. Kodehash binder utgaven, ikke autorisasjonen.

Skriving gjennom porten bruker én privat teknisk journal i et eget Google Doc
under det valgte hjemmet. Den inneholder operasjonsstatus/hash, ikke boktekst.
Bruk donorens eksakte JSON-initialtilstand fra DOCS-PORT. Dette er ingen ny
livsbok eller serverdatabase. Bootstrap og mål må være tillatt og etterlest før
bruk. Journalen står i et annet dokument enn måltekstene slik at journalens
revisjoner ikke endrer måltekstens revisjon. Ingen lagring betyr ingen journal-
skriving, heller ikke ved et avvist ønske.

Behold ukjente operasjoner i et eventuelt eksisterende system. De skal avstemmes
der før samme virkning utføres via ny rute. Låser stjeles ikke etter tidsfrist.

Hvis JS-sammensetning ikke finnes: det utfylte kildekartet og direkte tillatte
Docs-rutiner kan fortsatt brukes, men rapporter `DIRECT_DOCS_ONLY`; ikke påstå
at den kodede journalen kjører. Hvis full funksjonell rute var målet, står nettopp
denne koblingen åpen. Ikke skjul dette med et generelt PASS eller krev RDC.

## 4. Bind det til vanlig samtale

Fyll ENTRY.txt med fast metodekilde, faktisk privat hjem og bokholdepunktets
presise peker. I JS-ruten angis også den lokalt valgte kilde-ID-en og
`readHome → contextBundle({requiredSourceIds:[valgtId]}) → readSource(valgtId)`.
Dette beskriver argumentene; se kontrakten for de faktiske funksjonskallene.
Plasser den på den allerede brukte prosjekt-/kontinuitetsinngangen. Bevar øvrig
instruksjonstekst og lokale valg. Hvis feltet bare kan endres av mennesket,
lever én ferdig utfylt tekst med faktiske pekere, uten tomme felt eller
alternative maler, og én presis kopieringshandling. Assistenten gjør resten.
En manuell ventende endring er ennå ikke bekreftet kobling; videre samtale må
bruke dette prosjektet. Lokale bokpekere/profiler skal aldri til offentlig repo.

Registrer i samme private hjem valgt metodepin, faktisk inngang, tilgjengelige
porter og konkret rest i det korte innføringsnotatet ved siden av JSON-fanen.
Hjemschema v1 har definerte felt; ikke legg udefinerte oppsett-/metodefelt inn i
JSON-objektet. En lenke sendt i chatten er ikke dokumentert varig
prosjektinngang. `AGENTS.md` i dette repoet gjelder vedlikeholderarbeid; den er
ikke i seg selv pilotens Chat-inngang.

## 5. Bruk en ufarlig vanlig reise

Bruk et lite syntetisk hjem med flere kilder og et lokalt begrep. La den vanlige
inngangen finne originalen uten at mennesket peker ut riktig kilde i spørsmålet.
La en allerede erkjent plikt overleve et avbrudd. Ved oppgradering fra fungerende
rev2: kontroller det nye sammenhengende stykket — valgt holdepunkt følger et
kall uten søkeord, og assistenten leser den faktiske originalen. Gjenbruk gyldig
belegg for den uendrede skriveruten. Ikke skriv prøveposter i private bøker,
kjør en lang eksamen eller krev en test fra mennesket for hver naturlige pause.
Senere ordinært arbeid viser separat om betydning oppdages og bevares bedre.

Skill installasjon, observert gjenkomst og senere hverdagsnytte. Gi ett kort
resultat om faktisk rute og rest, ikke en ny kontrollbyrde per replikk.

## Tilbakeføring og videre oppdatering

Gjenopprett bare kjent metode-/inngangspeker etter avstemming av dagens tilstand.
Bevar bøker, erfaring, hjem og åpne/ukjente operasjoner. Ikke slett journalen for
å få en ny start på et usikkert forsøk. Hjemschema v1 skal ikke automatisk
migreres ved flytende main; en endret schema trenger eksplisitt konvertering og
førbilde. Denne utgaven endrer ikke BOOT-kanalen og oppretter ingen ny generasjon.

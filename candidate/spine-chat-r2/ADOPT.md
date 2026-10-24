# Innfør funksjonslaget i den eksisterende relasjonen

Dette er en utførende oppskrift for assistenten, ikke et teknisk prosjekt for
mennesket. Eksisterende tydelig autorisasjon skal ikke etterspørres igjen.
Velg en bestemt pakkeutgave. Les full METHOD og denne filen før endringer.

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

## 2. Fyll det lille private arbeidsgrunnlaget

Bruk én særskilt tillatt arbeidsdel av eksisterende hjem. `schema/home.schema.json`
og `examples/synthetic-home.json` er form og demonstrasjon; erstatt aldri egen
historie med eksemplet. Assistenten fyller kjente kilder med stabil ID, navn,
alias, funksjon, originalpeker, tilgang og utgave når kjent. Sett ukjent til
ukjent. Ta med faktisk relevante beslutninger, erkjent åpent arbeid og erfaring;
ikke masseimporter privatarkivet. La kildekartet peke til fortellingene.

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

Fyll ENTRY.txt med fast metodekilde og det faktiske private hjemmet; plasser den
på den allerede brukte prosjekt-/kontinuitetsinngangen. Oppdater bare den felles
metodedelen. Hvis feltet bare kan endres av mennesket, gi én ferdig tekst og
én presis kopieringshandling. Assistenten gjør resten selv med kjent grunnlag.

Registrer i samme private hjem valgt metodepin, faktisk inngang, tilgjengelige
porter og konkret rest i det korte innføringsnotatet ved siden av JSON-fanen.
Hjemschema v1 har definerte felt; ikke legg udefinerte oppsett-/metodefelt inn i
JSON-objektet. En lenke sendt i chatten er ikke dokumentert varig
prosjektinngang. `AGENTS.md` i dette repoet gjelder vedlikeholderarbeid; den er
ikke i seg selv pilotens Chat-inngang.

## 5. Bruk en ufarlig vanlig reise

Bruk et lite syntetisk hjem med flere kilder og et lokalt begrep. La den vanlige
inngangen finne originalen uten at mennesket peker ut riktig kilde i spørsmålet.
La en allerede erkjent plikt overleve et avbrudd. Prøv en presis tillatt retting
og separat etterlesing på den faktiske ruten. Gjenbruk gyldige komponentprøver;
ikke gjennomfør lang eksamen eller feilinjeksjon i private bøker.

Skill installasjon, observert gjenkomst og senere hverdagsnytte. Gi ett kort
resultat om faktisk rute og rest, ikke en ny kontrollbyrde per replikk.

## Tilbakeføring og videre oppdatering

Gjenopprett bare kjent metode-/inngangspeker etter avstemming av dagens tilstand.
Bevar bøker, erfaring, hjem og åpne/ukjente operasjoner. Ikke slett journalen for
å få en ny start på et usikkert forsøk. Hjemschema v1 skal ikke automatisk
migreres ved flytende main; en endret schema trenger eksplisitt konvertering og
førbilde. Denne utgaven endrer ikke BOOT-kanalen og oppretter ingen ny generasjon.

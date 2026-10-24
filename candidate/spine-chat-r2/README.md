# Proto Pilot – funksjonell Chat-ryggmarg, rev2

Dette er en oppdatering for en eksisterende pilot med Chat, Drive og tilgang til
denne offentlige kilden. Bøkene, stemmen, historien og menneskets valg blir hos
piloten. Ingen RDC, Python, terminal, egen server eller ny konto skal installeres
hos mottakeren.

**Begynn med [START-HER.txt](START-HER.txt).** Den gir oppdateringen til assistenten;
mennesket skal ikke konfigurere et register eller lime inn kode for hver oppgave.

Denne utgaven inneholder faktisk kjørbar støtte:

- Kildekart med originale pekere, lokale begreper og tilgangsgrenser.
- Avstemming av gjeldende beslutninger, rettelser og motstrid.
- Åpent arbeid, per-bok-disposisjoner og ukjente skriveutfall som overlever avbrudd.
- Selektiv gjenkomst med relevant erfaring; kritiske rester klippes ikke stille bort.
- Drive-port med bestemte tillatte mål, revisjonskontroll, varig operasjonsjournal,
  etterlesing og gjenfinning av samme forsøk etter et uavklart svar.

| Del | Inngang |
|---|---|
| Full arbeidsmåte og egenart | [METHOD.txt](METHOD.txt) |
| Behov → konkrete funksjoner → belegg | [FUNCTIONS.md](docs/FUNCTIONS.md) |
| Faktisk innføring og tilbakeføring | [ADOPT.md](ADOPT.md) |
| Kort vanlig inngang | [ENTRY.txt](ENTRY.txt) |
| Kjørbar privat arbeidskjerne | [CORE-CONTRACT.md](docs/CORE-CONTRACT.md) |
| Eksisterende Docs-forbindelse | [DOCS-PORT.md](docs/DOCS-PORT.md) |
| Praktiske situasjoner | [ROUTINES.md](ROUTINES.md) |
| Komplett oppdiktet eksempel | [synthetic-home.json](examples/synthetic-home.json) |
| Faktisk belegg og åpne grenser | [VALIDATION.md](VALIDATION.md) |

Koden bruker eksisterende verktøy gjennom avgrensede callbacks. En Chat-flate som
kan kjøre slike verktøysammensetninger, kan bruke den uten lokal installasjon.
Den konkrete flaten kontrolleres ved innføring. En flate uten JavaScript-kjøring
kan bruke kildekartet og den direkte Drive-arbeidsmåten, men får ikke automatisk
den mekaniske journal-/replay-kontrollen. Dette skal vises som forskjellig
kapabilitet, ikke skjules bak samme PASS.

Dette er ingen ny samtalevert eller usynlig hook før alle modellhandlinger.
Modellen må fortsatt forstå betydning, velge riktig rutine og ivareta mennesket.
Kode som kontrollerer en valgt rute kan ikke stoppe alle handlinger utenom den.
Publisering er forskjellig fra innføring og nyttig feltbruk hos en pilot.

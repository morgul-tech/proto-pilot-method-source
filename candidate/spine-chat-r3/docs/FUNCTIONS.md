# Hva som faktisk er tilført

Arbeidsmåten skal hjelpe en eksisterende relasjon å finne, fullføre og lære.
En teknisk statuspost erstatter aldri en levende fortelling. Følgende er den
konkrete overføringen fra Cerebro, med forskjellige bevisnivåer beholdt.

| Behov | Kjørbar støtte | Overført grunnlag | Praktisk prøve og grense |
|---|---|---|---|
| Finne egen tidligere betydning før gjetting | `findSources`, kildealias, originalpeker, tilgang, `readSource` | Source relevans-/kildeutvalg | Fersk agent fant lokal original blant flere kilder via ekte Docs. Rangeringen er deterministisk; betydning forstås fortsatt av modellen. |
| Beholde riktig beslutning gjennom spørsmål og rettelser | `resolveDecision`, scope, kildeutgave, eksplisitt erstatning | Devkit current/supersession | Kontrasttester for spørsmål, motstrid, endret kilde og gyldig retting. Ingen tankelesing eller automatisk siste-tekst-vinner. |
| Huske erkjent arbeid ved gjenkomst | `contextBundle`, åpne plikter, separat effektstatus | Source fortsettelse og Work gjenkomst | Kritisk rest beholdes selv ved tomt visningsbudsjett. Inngangen må faktisk bli lest; pakken installerer ikke en usynlig hver-tur-hook. |
| Hente valgt bokholdepunkt uten et særskilt søk | Valgfrie `requiredSourceIds` i `contextBundle`; faktisk lesing etterpå | Lokal bevaringslæring og ordinær pilotgjenkomst | Tomt søk og lite budsjett skjuler ikke valgt kilde. Manglende/tilgang/scope/utdatert grunnlag oppgis; modellen må fortsatt kalle rutinen og forstå betydning. |
| Fullføre vurderingen for riktig bok | Per-bok-disposisjon i `applyEvent` | Work fullføring + mottak/læring | En annen ferdig oppgave kan ikke lukke uferdig bokvurdering. Begrunnet NO_POST er mulig; ingen postkvote eller logging av all prat. |
| Lære der erfaringen er relevant | Erfaringsposter, naturlige triggere og senere disposisjon | Source learning bridge | Faktisk erfaring skrevet/etterlest i syntetisk hjem. Modellen må fortsatt oppdage hva som er verdt å lære. |
| Rette uten å overskrive eller gjenta usikkert arbeid | `mutateHome`, `replaceBookText`, uavhengig målbinding, revisjonskontroll, varig journal, etterlesing | Byteidentisk Source Doc-journal + ny smal Docs-port | Ekte Docs-skriving, simulert tapt svar og gjentatt kall ga én innholdsskriving. Avgrenset til kvalifiserte rene tekstfaner; rik layout beholder egen native rute. |

Fulle kildepinner og skillet mellom direkte kopiert kode og nye tilpasninger
står i [SOURCE-LINEAGE.json](SOURCE-LINEAGE.json). Prøver og begrensninger står
i [VALIDATION.md](../VALIDATION.md). Felles bibliotekkode inneholder aldri en
pilots private kart, bok-IDer, journal eller lokale valg.

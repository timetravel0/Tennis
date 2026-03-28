# Testing Strategy

## Test presenti

- Nel workspace osservato non risultano test automatizzati.
- Non sono presenti script `test` nel `package.json`.

## Livelli di test rilevati

- Nessun test unitario rilevato.
- Nessun test di integrazione rilevato.
- Nessun test end-to-end rilevato.

## Copertura percepita

- Copertura automatica: assente o non documentata.
- Verifica del comportamento: affidata a run manuali del gioco.

## Gap principali

- Mancano test su:
  - assegnazione player
  - transizioni single-player / multiplayer
  - reset alla disconnessione
  - collisioni e punteggio
  - gestione asset e path statici

## Suggerimenti di miglioramento

- Introdurre test di smoke per build e avvio server.
- Aggiungere test di logica pura per scoring e reset in un modulo separato.
- Coprire con test di integrazione gli eventi Socket.IO principali.
- Verificare manualmente i path degli asset dopo ogni modifica al client.

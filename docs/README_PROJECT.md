# README progetto

## Scopo
Tennis è un gioco web 2.5D ispirato al tennis, con rendering 3D tramite Three.js e sincronizzazione base tra due giocatori tramite Socket.IO.

## Funzionalità principali

- rendering della campo da tennis, rete, racchette e pallina
- modalità single-player con AI semplice per il secondo giocatore
- modalità multiplayer con sincronizzazione di racchette e servizio
- punteggio interno con logica semplificata ispirata al tennis
- reset automatico della partita al disconnect di un giocatore

## Stack

- Backend: Node.js, Express, Socket.IO
- Frontend: Three.js, Socket.IO client, Babel, Webpack
- Asset: HTML statico e immagine del campo

## Struttura

- `server.js` - server e gestione eventi realtime
- `webpack.config.js` - build del client
- `public/index.html` - shell UI
- `public/js/script.js` - logica del gioco
- `public/` - asset statici

## Setup rapido

1. `npm install`
2. `npm run build`
3. `node server.js`

## Comandi principali

- `npm run build` - genera `dist/bundle.js`
- `node server.js` - avvia il server su `http://localhost:3000`

## Documenti correlati

- [AGENTS.md](../AGENTS.md)
- [Workspace overview](WORKSPACE_OVERVIEW.md)
- [Analisi funzionale](FUNCTIONAL_ANALYSIS.md)
- [Analisi tecnica](TECHNICAL_ANALYSIS.md)
- [Deployment](DEPLOYMENT.md)
- [Roadmap miglioramenti](IMPROVEMENT_ROADMAP.md)

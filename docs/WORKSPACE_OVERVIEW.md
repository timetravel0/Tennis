# Workspace Overview

## Sintesi
Il workspace contiene un solo progetto reale: una web app di tennis 2.5D con backend Node.js/Express e client Three.js. Non sono emersi sottoprogetti separati, librerie interne o microservizi aggiuntivi.

## Mappa dei progetti

| Progetto | Path | Tipo | Stack principale | Relazioni |
|---|---|---|---|---|
| Tennis | `C:\Code\github\Tennis` | full-stack web app | Node.js, Express, Socket.IO, Three.js, Webpack, Babel | Il server espone i file statici e gli eventi realtime; il client consuma Socket.IO e rende la scena 3D |

## Confini del workspace

- Codice applicativo osservato: `server.js`, `webpack.config.js`, `public/index.html`, `public/js/script.js`.
- Asset osservati: `public/tennis_court.jpg`.
- Documentazione creata o aggiornata: `README.md`, `docs/*`, `AGENTS.md`.

## Cartelle escluse dall’analisi

- `node_modules/`
- `dist/`
- `build/`
- `.git/`
- `coverage/`
- `.cache/`
- cartelle equivalenti generate o di dipendenza

## Evidenze principali

- `package.json` definisce un solo package chiamato `tennis`.
- `server.js` avvia un server HTTP su porta `3000` e integra Socket.IO.
- `webpack.config.js` compila `public/js/script.js` in `dist/bundle.js`.
- `public/index.html` carica il bundle e mostra una UI minimale con punteggio e info di gioco.
- `public/js/script.js` contiene tutta la logica del gioco, inclusa la gestione single-player e multiplayer.

## Note di classificazione

- Il progetto è classificato come `full-stack` perché unisce hosting server-side e rendering/client-side.
- Non è emersa persistenza dati: lo stato partita è mantenuto in memoria sul server e nel client.
- Alcuni riferimenti a texture nel client non corrispondono agli asset presenti nel workspace; questa incongruenza è documentata nelle analisi tecniche e funzionali.

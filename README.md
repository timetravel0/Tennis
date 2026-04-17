# Tennis

Workspace composto da un singolo progetto Node.js/Three.js per un gioco di tennis 2.5D con backend Express e comunicazione in tempo reale tramite Socket.IO.

## Struttura

- `server.js` - server HTTP/Socket.IO e hosting dei file statici.
- `webpack.config.js` - build del client da `public/js/script.js` a `dist/bundle.js`.
- `public/` - HTML, asset e codice sorgente client.
- `docs/` - documentazione tecnica e funzionale del workspace.

## Documenti principali

- [Workspace overview](docs/WORKSPACE_OVERVIEW.md)
- [Analisi funzionale](docs/FUNCTIONAL_ANALYSIS.md)
- [Analisi tecnica](docs/TECHNICAL_ANALYSIS.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Roadmap miglioramenti](docs/IMPROVEMENT_ROADMAP.md)

## Avvio rapido

1. Installare le dipendenze con `npm install`.
2. Generare il bundle client con `npm run build`.
3. Avviare il server con `node server.js`.
4. Eseguire il controllo base con `npm test`.

## Note operative

- Il client si connette a `http://localhost:3000` tramite Socket.IO.
- Il server serve sia `dist/` sia `public/`.
- `npm test` esegue un smoke test che verifica build client e avvio server.
- Le cartelle generate come `node_modules/` e `dist/` non vanno trattate come sorgente applicativa.

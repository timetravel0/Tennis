# AGENTS.md

## Scopo
Guida operativa per intervenire sul workspace "Tennis", un gioco web 2.5D con backend Express e client Three.js.

## Identità del progetto
- Nome: `tennis`
- Path root: `C:\Code\github\Tennis`
- Tipo: applicazione web full-stack
- Stack principale: Node.js, Express, Socket.IO, Three.js, Webpack, Babel

## Cartelle rilevanti
- `public/` - client, HTML e asset
- `public/js/` - logica applicativa del gioco
- `dist/` - output compilato del bundle client
- `docs/` - documentazione del workspace

## Cartelle da ignorare
- `node_modules/`
- `dist/`
- `build/`
- `.git/`
- `coverage/`
- `.cache/`
- altre cartelle generate o di dipendenza equivalenti

## Convenzioni osservate
- Il client è scritto come modulo ES in `public/js/script.js` e compilato con Webpack.
- Il server usa CommonJS in `server.js`.
- Lo stato di gioco è mantenuto in memoria, non in un database.
- La UI è minimale e vive in `public/index.html`.
- Gli eventi Socket.IO sono gestiti in modo diretto senza layer intermedi.

## Comandi utili

### Installazione
`npm install`

### Avvio locale
`npm run build`
`node server.js`

### Test
Nessun comando di test è definito nel `package.json` osservato.

### Lint / type-check
Nessun comando di lint o type-check è definito nel `package.json` osservato.

### Build
`npm run build`

## Guardrail
- Leggi prima `README.md` e i documenti in `docs/`.
- Non modificare `dist/` manualmente: è output di build.
- Non trattare `node_modules/` e file lock come sorgente funzionale.
- Verifica sempre i path degli asset prima di cambiare riferimenti in `public/js/script.js`.
- Evita di introdurre dipendenze o protocolli senza aggiornare documentazione e test manuali.

## Output attesi da futuri coding agent
1. Identificare i file coinvolti.
2. Limitare le modifiche allo scope richiesto.
3. Aggiornare la documentazione se cambiano flussi o comportamento.
4. Verificare build e avvio del server dopo ogni modifica rilevante.

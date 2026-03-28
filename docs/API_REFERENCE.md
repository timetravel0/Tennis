# API Reference

## Panoramica
Il progetto non espone una REST API formale. L’interfaccia applicativa è composta da:

- una route catch-all HTTP che serve `public/index.html`
- eventi Socket.IO per gameplay realtime

## HTTP

### `GET *`
- Implementazione: `server.js`
- Responsabilità: inviare `public/index.html` per tutte le route non statiche
- Osservazione: il server è configurato come single-page/static app server, non come API backend tradizionale

## Socket.IO

### `playerNumber`
- Emesso dal server al client alla connessione
- Contenuto: numero giocatore assegnato

### `newPlayer`
- Emesso dal server quando entra un nuovo player
- Uso osservato: il client mostra un alert e avvia il multiplayer quando il numero è `2`

### `startMultiplayerGame`
- Emesso dal server quando si raggiungono due player
- Uso: il client passa a `multiplayer` e resetta la partita

### `movePaddle`
- Emesso dal client con `player` e `position`
- Il server rilancia l’evento agli altri client con `updatePaddle`

### `updatePaddle`
- Emesso dal server verso gli altri client
- Contiene il movimento della racchetta

### `serveBall`
- Emesso dal client e rimbalza agli altri client

### `resetGame`
- Emesso dal server quando un player si disconnette e i player rimasti sono meno di due

### `playerLeft`
- Emesso dal server alla disconnessione di un client

### `gameFull`
- Emesso dal server quando ci sono già due player
- Limite dell’analisi: non è emerso un handler nel client osservato

## Pattern request/response

- Non c’è un modello request/response classico.
- Il traffico è event-driven e bidirezionale.

## Autenticazione/autorizzazione

- Non risultano meccanismi di autenticazione o autorizzazione.
- L’ingresso in partita si basa solo sull’ordine di connessione.

## Limiti dell’analisi

- Non sono presenti test o documentazione API separata.
- I payload degli eventi sono semplici oggetti JS senza schema formale.

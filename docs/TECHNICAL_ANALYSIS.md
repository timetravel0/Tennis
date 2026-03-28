# Analisi tecnica

## Stack tecnologico

- Node.js
- Express
- Socket.IO server e client
- Three.js per il rendering 3D
- Webpack 5 e Babel per la compilazione del client

## Entrypoint applicativi

- `server.js` - avvio del server HTTP e Socket.IO
- `public/js/script.js` - bootstrap del client e loop di animazione
- `public/index.html` - pagina shell che carica `bundle.js`

## Moduli principali

- `server.js`
  - serve `dist/` e `public/`
  - gestisce connessioni Socket.IO
  - mantiene in memoria l’elenco dei player connessi
- `public/js/script.js`
  - costruisce scena, camera, renderer
  - gestisce input tastiera
  - aggiorna fisica della pallina
  - gestisce AI locale
  - sincronizza stato multiplayer
- `webpack.config.js`
  - compila `public/js/script.js` in `dist/bundle.js`

## Pattern architetturali osservati

- architettura molto centralizzata, con stato concentrato in pochi file
- rendering client-side in loop `requestAnimationFrame`
- realtime messaging event-driven via Socket.IO
- assenza di layer separati per dominio, servizi o persistenza

## Flussi interni principali

1. Il browser carica `public/index.html`.
2. Il bundle Webpack viene risolto come `bundle.js` da `dist/`.
3. Il client inizializza Three.js e si connette al server Socket.IO.
4. Il server assegna un numero giocatore e gestisce gli eventi di partita.
5. Il loop `animate()` aggiorna pallina, AI e rendering.

## Integrazioni esterne

- Socket.IO per realtime networking.
- Three.js per grafica 3D.
- Nessuna integrazione con API esterne, database o servizi terzi è emersa.

## Gestione configurazione

- Non sono presenti variabili d’ambiente osservate.
- La porta del server è hardcoded a `3000`.
- L’URL Socket.IO è hardcoded a `http://localhost:3000`.
- I path degli asset sono hardcoded nel client.

## Stato qualità del codice

- Il codice è compatto ma poco modulare.
- Il client contiene logica di scena, input, fisica, AI e networking nello stesso file.
- Il server contiene logica di sessione molto semplice, senza astrazione.

## Debito tecnico

- Asset path incoerenti: il client carica `images/tennis_court.jpg` e `images/tennis_net_texture.jpg`, mentre nel workspace è presente `public/tennis_court.jpg` e non è presente la texture della rete.
- `gameFull` è emesso dal server ma non gestito lato client.
- Il multiplayer non ha gestione robusta di riconnessioni, match-making o stato autorevole.
- Mancano script `test` e `lint` nel manifest.

## Criticità tecniche

- Lo stato è in memoria e si perde a ogni riavvio.
- La fisica della pallina è semplificata e probabilmente non deterministica tra client.
- Il server si fida completamente degli eventi inviati dal client.
- `setTimeout(serveBall, 1000)` in single-player può creare transizioni poco controllate se lo stato cambia rapidamente.

## Scalabilità e manutenibilità

- L’attuale struttura è adatta a un prototipo o a un gioco piccolo.
- Per evoluzioni future serve separare dominio gioco, networking, rendering e configurazione.
- La manutenibilità è penalizzata dall’accoppiamento stretto tra stato e rendering nel client.

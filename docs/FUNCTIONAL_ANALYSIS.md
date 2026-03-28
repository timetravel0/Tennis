# Analisi funzionale

## Scopo funzionale
Il progetto implementa un gioco di tennis semplificato in ambiente 2.5D, con una modalità locale assistita da AI e una modalità multiplayer sincronizzata in tempo reale.

## Attori principali

- Giocatore 1
- Giocatore 2
- Server di gioco
- AI locale del secondo giocatore in single-player

## Casi d’uso identificabili

1. Avviare il gioco e visualizzare il campo.
2. Muovere la racchetta del giocatore assegnato.
3. Servire la pallina premendo `SPACE`.
4. Giocare contro l’AI quando `gameMode === 'singleplayer'`.
5. Sincronizzare le posizioni delle racchette in multiplayer.
6. Ricevere reset della partita quando un giocatore si disconnette.

## Flussi principali

### Avvio
- Il client crea scena, camera e renderer in `public/js/script.js`.
- Il bundle è caricato da `public/index.html`.
- Il client si collega a `http://localhost:3000` via Socket.IO.

### Single-player
- La modalità iniziale è `singleplayer`.
- La racchetta avversaria viene controllata da una AI elementare che segue la pallina lungo l’asse `z`.
- Se il giocatore in attesa è il server-side serving player 2, il servizio parte automaticamente dopo un timeout.

### Multiplayer
- Il server assegna il numero giocatore in base all’ordine di connessione.
- Alla presenza del secondo player viene emesso `startMultiplayerGame`.
- I movimenti delle racchette vengono propagati con `movePaddle`.
- Il servizio viene sincronizzato con `serveBall`.

## Regole di business deducibili

- Sono supportati al massimo due giocatori contemporanei.
- Il servizio è alternato tra i due giocatori dopo ogni punto.
- Il punteggio usa una sequenza semplificata `0, 15, 30, 40, Game`.
- Un game viene assegnato quando un giocatore raggiunge almeno 4 punti e ha margine di 2.
- La partita viene resettata quando un giocatore lascia la sessione.

## Funzionalità complete

- rendering base del terreno di gioco
- movimento delle racchette
- aggiornamento della pallina con fisica elementare
- punteggio e game count
- sincronizzazione minima multiplayer

## Funzionalità parziali o incomplete

- La rete usa una texture dichiarata ma non presente nel workspace osservato.
- La logica tennis è semplificata e non implementa set, tie-break o fault completi.
- Il client riceve `gameFull` dal server, ma non è emerso un handler lato client.
- Il server accetta eventi Socket.IO senza validazione strutturata dei payload.

## Punti oscuri o da validare

- Non esiste documentazione formale delle regole di gioco oltre al codice.
- Non è chiaro se il riferimento a `images/tennis_net_texture.jpg` sia un residuo o un asset atteso fuori workspace.
- La logica multiplayer è fragile rispetto a riconnessioni e timing di servizio.

# Data Model

## Panorama
Il progetto non usa un database o un ORM osservabile. Il modello dati è interamente in memoria e vive nel server e nel client.

## Stato server-side

- `players: []` in `server.js`
  - contiene gli `socket.id` dei giocatori connessi
  - usato per assegnare massimo due partecipanti

## Stato client-side

- `scorePlayer1`, `scorePlayer2`
- `games = [0, 0]`
- `servingPlayer`
- `ballInPlay`
- `ballSpeed`
- `playerNumber`
- `gameMode`

## Modello funzionale osservato

- il punteggio è gestito come array di valori tennistici semplificati
- i game vinti sono contatori numerici
- la posizione di pallina e racchette è rappresentata come coordinate Three.js

## Relazioni

- `players` determina la presenza dei due ruoli di gioco
- `servingPlayer` guida il lato da cui parte il servizio
- il punteggio client-side influenza UI e reset della pallina

## Dubbi o incompletezze

- Non esiste persistenza storica delle partite.
- Non sono presenti entità dominio separate per match, set o torneo.
- Lo stato multiplayer dipende dal comportamento coordinato dei client e non da un modello server autorevole completo.

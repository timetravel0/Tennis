# Security Notes

## Autenticazione e autorizzazione

- Non risultano autenticazione, sessioni o autorizzazione.
- Qualsiasi client che raggiunge il server può connettersi a Socket.IO.

## Gestione segreti e configurazione

- Non sono presenti segreti nel repository osservato.
- Non risultano variabili d’ambiente per configurazione sensibile.

## Validazione input

- I payload Socket.IO non risultano validati con schema.
- Il server rilancia gli eventi ricevuti senza controlli sostanziali sul contenuto.
- Il movimento delle racchette è guidato dal client; il server non applica verifiche di consistenza.

## Superfici di rischio

- Concorrenza tra client multipli e stato in memoria.
- Hardcoding dell’endpoint Socket.IO su `localhost:3000`.
- Possibile abuso di eventi realtime se il server venisse esposto senza protezioni aggiuntive.

## Criticità potenziali

- Nessun rate limiting.
- Nessun controllo anti-cheat o anti-spam sugli eventi di gioco.
- Nessuna separazione tra player autorizzati e connessioni generiche.

## Osservazioni

- Per un contesto locale/prototipale il rischio è contenuto.
- Per esposizione su Internet servirebbero almeno autenticazione, validation layer e controllo server-authoritative del match state.

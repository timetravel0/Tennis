# Improvement Roadmap

## TEN-ARCH-01 - Allineare i path degli asset
- Descrizione: correggere i riferimenti alle texture nel client affinché corrispondano agli asset realmente presenti nel workspace.
- Problema osservato: `public/js/script.js` carica `images/tennis_court.jpg` e `images/tennis_net_texture.jpg`, ma nel workspace è presente solo `public/tennis_court.jpg`.
- Beneficio atteso: rendering affidabile e meno errori di caricamento asset.
- Priorità: Alta
- Effort: S
- Impatto: Alto
- Area: architettura
- File/cartelle coinvolte: `public/js/script.js`, `public/`
- Dipendenze: nessuna
- Rischi: path corretti ma asset mancanti o non versionati
- Criterio di completamento: il gioco carica tutte le texture senza errori console
- Istruzioni per futuri coding agent: verificare prima gli asset presenti e poi aggiornare i path nel codice

## TEN-FUNC-01 - Gestire esplicitamente lo stato `gameFull`
- Descrizione: aggiungere lato client un feedback coerente quando il server rifiuta una terza connessione.
- Problema osservato: `server.js` emette `gameFull`, ma il client non mostra un handler dedicato.
- Beneficio atteso: UX più chiara per i giocatori in coda.
- Priorità: Alta
- Effort: S
- Impatto: Medio
- Area: funzionalità
- File/cartelle coinvolte: `server.js`, `public/js/script.js`, `public/index.html`
- Dipendenze: nessuna
- Rischi: messaggi duplicati con gli alert già presenti
- Criterio di completamento: un terzo client riceve un messaggio chiaro e non resta in stato ambiguo
- Istruzioni per futuri coding agent: non modificare la logica server di assegnazione senza aggiornare la UI

## TEN-TECH-01 - Rendere configurabile l’endpoint Socket.IO
- Descrizione: sostituire `http://localhost:3000` con una configurazione derivata dall’host corrente o da variabile di ambiente.
- Problema osservato: il client è hardcoded per l’ambiente locale.
- Beneficio atteso: facilità di deploy e test su host diversi.
- Priorità: Alta
- Effort: M
- Impatto: Alto
- Area: architettura
- File/cartelle coinvolte: `public/js/script.js`, `server.js`
- Dipendenze: eventuale nuovo schema di configurazione
- Rischi: mismatch tra client e server se la configurazione non è documentata
- Criterio di completamento: il gioco funziona anche fuori da `localhost` senza modifiche manuali al codice
- Istruzioni per futuri coding agent: mantenere la compatibilità con l’avvio locale

## TEN-FUNC-02 - Separare e documentare meglio le regole di punteggio
- Descrizione: estrarre e chiarire la logica di scoring, attualmente semplificata e distribuita nel client.
- Problema osservato: la partita usa una versione ridotta del tennis, senza set o tie-break.
- Beneficio atteso: regole più comprensibili e meno ambigue.
- Priorità: Media
- Effort: M
- Impatto: Medio
- Area: funzionalità
- File/cartelle coinvolte: `public/js/script.js`, `docs/FUNCTIONAL_ANALYSIS.md`
- Dipendenze: eventuale refactor della logica di gioco
- Rischi: rompere il bilanciamento attuale
- Criterio di completamento: le regole sono centralizzate e coerenti con la documentazione
- Istruzioni per futuri coding agent: distinguere tra semplificazione di gameplay e implementazione completa del tennis

## TEN-SEC-01 - Validare i payload Socket.IO
- Descrizione: introdurre controlli sui dati ricevuti dal server prima di rilanciare o applicare aggiornamenti.
- Problema osservato: il server accetta eventi e dati del client senza schema o validazione.
- Beneficio atteso: maggiore robustezza e minore superficie di abuso.
- Priorità: Alta
- Effort: M
- Impatto: Alto
- Area: sicurezza
- File/cartelle coinvolte: `server.js`, `public/js/script.js`
- Dipendenze: possibile refactor del formato eventi
- Rischi: introdurre regressioni se i client esistenti inviano payload non conformi
- Criterio di completamento: eventi con payload non valido vengono rifiutati o ignorati in modo esplicito
- Istruzioni per futuri coding agent: definire prima un formato evento minimale e poi applicare la validazione

## TEN-TECH-02 - Separare logica di gioco, networking e rendering
- Descrizione: dividere `public/js/script.js` in moduli dedicati.
- Problema osservato: input, fisica, AI, UI e socket vivono nello stesso file.
- Beneficio atteso: manutenzione più semplice e testabilità migliore.
- Priorità: Media
- Effort: L
- Impatto: Alto
- Area: architettura
- File/cartelle coinvolte: `public/js/script.js`, eventuale nuova struttura sotto `public/js/`
- Dipendenze: nessuna diretta
- Rischi: refactor ampio su un codice attualmente monolitico
- Criterio di completamento: funzioni di dominio riusabili e codice client più modulare
- Istruzioni per futuri coding agent: estrarre prima la logica pura, poi il rendering e infine il networking

## TEN-TEST-01 - Introdurre smoke test di build e avvio
- Descrizione: aggiungere almeno una verifica automatica che la build generi il bundle e che il server parta correttamente.
- Problema osservato: non ci sono test automatizzati.
- Beneficio atteso: regressioni più facili da intercettare.
- Priorità: Media
- Effort: M
- Impatto: Medio
- Area: test
- File/cartelle coinvolte: `package.json`, eventuali file di test
- Dipendenze: eventuali script npm nuovi
- Rischi: copertura limitata se i test restano solo smoke
- Criterio di completamento: un comando di test esegue build e un controllo di avvio base
- Istruzioni per futuri coding agent: partire da verifiche semplici e stabili, non da test UI fragili

## TEN-DOC-01 - Aggiornare la documentazione quando cambia il comportamento
- Descrizione: mantenere allineati README, analisi e AGENTS quando si modificano regole di gioco o flussi realtime.
- Problema osservato: la documentazione deve restare coerente con un codice che oggi è molto concentrato e soggetto a cambiamenti indiretti.
- Beneficio atteso: onboarding più rapido e meno ambiguità per futuri agent.
- Priorità: Bassa
- Effort: S
- Impatto: Medio
- Area: documentazione
- File/cartelle coinvolte: `README.md`, `docs/`, `AGENTS.md`
- Dipendenze: nessuna
- Rischi: documentazione ridondante se non si consolida lo stile
- Criterio di completamento: ogni change di comportamento rilevante aggiorna la documentazione corrispondente
- Istruzioni per futuri coding agent: aggiornare prima i documenti che spiegano il comportamento e poi gli eventuali riferimenti di supporto

## Note per il Prossimo Coding Agent

- Ordine suggerito di esecuzione:
  1. TEN-ARCH-01
  2. TEN-FUNC-01
  3. TEN-TECH-01
  4. TEN-SEC-01
  5. TEN-TECH-02
  6. TEN-TEST-01
  7. TEN-DOC-01
- Prerequisiti: leggere `AGENTS.md`, `docs/WORKSPACE_OVERVIEW.md`, `docs/TECHNICAL_ANALYSIS.md` e `docs/FUNCTIONAL_ANALYSIS.md`.
- Non toccare senza validazione: `dist/`, `node_modules/`, il contratto base degli eventi Socket.IO se non si aggiornano client e server insieme.
- Quick wins: sistemare i path texture, gestire `gameFull`, aggiungere script npm minimi.
- Attività ad alto rischio: refactor monolitico di `public/js/script.js` e cambio del modello multiplayer senza test.

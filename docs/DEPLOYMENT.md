# Deployment

## Prerequisiti

- Node.js compatibile con il progetto
- npm
- Browser moderno con supporto WebGL

## Configurazione rilevata

- Nessuna variabile d’ambiente osservata nel repository.
- Il server ascolta su `3000`.
- Il client Socket.IO punta a `http://localhost:3000`.

## Build

1. Installare le dipendenze con `npm install`.
2. Compilare il client con `npm run build`.
3. Verificare la presenza di `dist/bundle.js`.

## Run

1. Avviare il server con `node server.js`.
2. Aprire il browser su `http://localhost:3000`.

## Deployment

- Non sono presenti manifest di deployment, Dockerfile o pipeline CI/CD nel workspace osservato.
- Il deployment atteso è quello di una singola applicazione Node servita direttamente dal processo `server.js`.
- Il bundle client deve essere generato prima dell’avvio o prima del deploy.

## Ambienti

- Ambiente locale: supportato direttamente dal server incluso nel repository.
- Ambienti esterni: non documentati nel codice osservato.

## Note operative

- Il server serve sia `dist/` sia `public/`, quindi la build del client è parte integrante del deploy.
- Se gli asset texture non vengono allineati ai path reali, il rendering può risultare incompleto.

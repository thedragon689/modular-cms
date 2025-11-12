# 🤝 Contribuire al Progetto

Grazie per il tuo interesse a contribuire al Modular CMS! Questo documento fornisce le linee guida per contribuire al progetto.

## 📋 Come Contribuire

### Segnalare Bug

Se trovi un bug, per favore:

1. **Verifica** che non sia già stato segnalato nelle [Issues](https://github.com/thedragon689/modular-cms/issues)
2. **Crea una nuova issue** con:
   - Titolo descrittivo
   - Descrizione chiara del problema
   - Passi per riprodurre il bug
   - Comportamento atteso vs comportamento reale
   - Screenshot se applicabile
   - Informazioni sull'ambiente (OS, browser, versione Node.js, ecc.)

### Proporre Nuove Funzionalità

1. **Verifica** che la funzionalità non sia già stata proposta
2. **Crea una nuova issue** con:
   - Titolo descrittivo
   - Descrizione dettagliata della funzionalità
   - Caso d'uso e benefici
   - Mockup o esempi se applicabile

### Contribuire con Codice

1. **Fork** il repository
2. **Crea un branch** per la tua feature/fix:
   ```bash
   git checkout -b feature/nome-feature
   # oppure
   git checkout -b fix/nome-fix
   ```
3. **Fai le modifiche** seguendo le linee guida di codice
4. **Testa** le tue modifiche
5. **Commit** con messaggi chiari:
   ```bash
   git commit -m "feat: aggiunge nuova funzionalità X"
   # oppure
   git commit -m "fix: risolve bug Y"
   ```
6. **Push** al tuo fork:
   ```bash
   git push origin feature/nome-feature
   ```
7. **Apri una Pull Request** su GitHub

## 📝 Convenzioni di Codice

### Commit Messages

Usa il formato [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` per nuove funzionalità
- `fix:` per correzioni di bug
- `docs:` per modifiche alla documentazione
- `style:` per formattazione (non cambia il codice)
- `refactor:` per refactoring del codice
- `test:` per aggiungere o modificare test
- `chore:` per modifiche al build process o tooling

Esempi:
```
feat: aggiunge sistema di notifiche toast
fix: risolve problema di autenticazione JWT
docs: aggiorna README con nuove istruzioni
```

### Stile del Codice

- **JavaScript/React**: Segui le convenzioni ESLint del progetto
- **CSS**: Usa TailwindCSS quando possibile, mantieni coerenza con il design system
- **Naming**: Usa nomi descrittivi, camelCase per variabili/funzioni, PascalCase per componenti
- **Commenti**: Commenta codice complesso, ma evita commenti ovvi

### Struttura del Progetto

```
CMS/
├── backend/          # Backend Node.js/Express
├── frontend/         # Frontend React/Vite
├── docs/            # Documentazione (se presente)
└── ...
```

## 🧪 Testing

Prima di fare una Pull Request:

- [ ] Testa le tue modifiche localmente
- [ ] Verifica che non ci siano errori di linting
- [ ] Assicurati che il codice sia formattato correttamente
- [ ] Testa su diversi browser (se modifiche frontend)
- [ ] Verifica che non ci siano regressioni

## 📚 Documentazione

- Aggiorna la documentazione se aggiungi nuove funzionalità
- Aggiungi commenti JSDoc per funzioni complesse
- Aggiorna il README se necessario

## 🔍 Review Process

1. Le Pull Request verranno riviste da almeno un maintainer
2. Potrebbero essere richieste modifiche
3. Una volta approvata, la PR verrà mergiata

## 📜 Licenza

Contribuendo al progetto, accetti che le tue modifiche saranno rilasciate sotto la licenza MIT.

## ❓ Domande?

Se hai domande, apri una [Discussion](https://github.com/thedragon689/modular-cms/discussions) o una [Issue](https://github.com/thedragon689/modular-cms/issues).

---

Grazie per il tuo contributo! 🎉


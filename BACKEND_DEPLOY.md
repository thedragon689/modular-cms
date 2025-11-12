# 🚀 Deploy Backend - Guida Completa

Il backend Express deve essere deployato separatamente dal frontend. Ecco le opzioni migliori:

## 🎯 Opzioni di Deploy Backend

### 1. Railway (Consigliato) ⭐

Railway è perfetto per deploy Node.js/Express con PostgreSQL.

#### Setup Railway

1. **Crea account su [Railway](https://railway.app)**
2. **Connetti GitHub** e seleziona il repository
3. **Crea nuovo progetto** → "Deploy from GitHub repo"
4. **Seleziona il repository** `modular-cms`
5. **Configura il servizio:**
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` o `node server.js`
   - **Port**: Railway assegna automaticamente, usa `PORT` env var

6. **Aggiungi PostgreSQL:**
   - Clicca "New" → "Database" → "PostgreSQL"
   - Railway creerà automaticamente le variabili d'ambiente

7. **Configura variabili d'ambiente:**
   ```
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-change-this
   JWT_EXPIRE=7d
   DB_HOST=${{Postgres.PGHOST}}
   DB_PORT=${{Postgres.PGPORT}}
   DB_USER=${{Postgres.PGUSER}}
   DB_PASSWORD=${{Postgres.PGPASSWORD}}
   DB_NAME=${{Postgres.PGDATABASE}}
   CORS_ORIGIN=https://modular-cms-woad.vercel.app
   ```

8. **Deploy**: Railway deployerà automaticamente

9. **Ottieni URL**: Dopo il deploy, copia l'URL (es: `https://modular-cms-production.up.railway.app`)

### 2. Render

#### Setup Render

1. **Crea account su [Render](https://render.com)**
2. **New** → **Web Service**
3. **Connetti repository GitHub**
4. **Configura:**
   - **Name**: `modular-cms-backend`
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free o Paid

5. **Aggiungi PostgreSQL:**
   - **New** → **PostgreSQL**
   - Render creerà le variabili d'ambiente automaticamente

6. **Variabili d'ambiente:**
   ```
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=your-secret-key
   JWT_EXPIRE=7d
   DB_HOST=<from-postgres-service>
   DB_PORT=5432
   DB_USER=<from-postgres-service>
   DB_PASSWORD=<from-postgres-service>
   DB_NAME=<from-postgres-service>
   CORS_ORIGIN=https://modular-cms-woad.vercel.app
   ```

### 3. Heroku

#### Setup Heroku

1. **Installa Heroku CLI**
2. **Login**: `heroku login`
3. **Crea app**: `heroku create modular-cms-backend`
4. **Aggiungi PostgreSQL**: `heroku addons:create heroku-postgresql:hobby-dev`
5. **Configura variabili**:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-secret-key
   heroku config:set JWT_EXPIRE=7d
   heroku config:set CORS_ORIGIN=https://modular-cms-woad.vercel.app
   ```
6. **Deploy**: `git push heroku main`

### 4. DigitalOcean App Platform

1. **Crea account su DigitalOcean**
2. **Apps** → **Create App** → **GitHub**
3. **Seleziona repository** e configura:
   - **Type**: Web Service
   - **Source Directory**: `backend`
   - **Build Command**: `npm install`
   - **Run Command**: `npm start`
4. **Aggiungi Database**: PostgreSQL managed database
5. **Configura variabili d'ambiente**

## 🔧 Configurazione Frontend Vercel

Dopo aver deployato il backend, configura Vercel:

1. **Vai su Vercel Dashboard** → Il tuo progetto
2. **Settings** → **Environment Variables**
3. **Aggiungi:**
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
   (Sostituisci con l'URL del tuo backend)

4. **Redeploy** il frontend su Vercel

## ✅ Verifica

1. **Backend**: Verifica che l'API risponda:
   ```bash
   curl https://your-backend-url.railway.app/api/dashboard/stats
   ```

2. **Frontend**: Il frontend ora userà `VITE_API_URL` per le chiamate API

## 🔒 Sicurezza

- ✅ **CORS**: Configura `CORS_ORIGIN` con l'URL del frontend Vercel
- ✅ **JWT_SECRET**: Usa un secret forte e unico
- ✅ **Database**: Usa connection pooling per performance
- ✅ **HTTPS**: Tutti i servizi moderni usano HTTPS di default

## 📝 Note

- Il backend deve essere sempre accessibile pubblicamente
- Assicurati che il database sia accessibile dal backend
- Monitora i log per errori
- Considera di aggiungere rate limiting per produzione

---

**Raccomandazione**: Usa **Railway** per semplicità e integrazione PostgreSQL automatica.


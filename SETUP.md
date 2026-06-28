# JuwaFire — Backend Setup (auth + wallet)

This wires up Google sign-in, username/password login, and the player wallet.
Everything talks to **your own PostgreSQL database on your VPS**.

---

## 1. Create the database on your VPS

SSH into your VPS and (if Postgres isn't installed yet):

```bash
sudo apt update && sudo apt install -y postgresql
```

Create a database + user:

```bash
sudo -u postgres psql <<'SQL'
CREATE DATABASE juwafire;
CREATE USER juwafire WITH ENCRYPTED PASSWORD 'PICK_A_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE juwafire TO juwafire;
ALTER DATABASE juwafire OWNER TO juwafire;
SQL
```

To let your local machine connect during development, allow remote connections
(in `postgresql.conf` set `listen_addresses = '*'`, and add a line to
`pg_hba.conf` for your IP), then `sudo systemctl restart postgresql`.
**For production, run the app on the VPS and keep Postgres on `localhost`.**

---

## 2. Configure environment variables

Copy the template and fill it in:

```bash
cp .env.example .env.local
```

- `DATABASE_URL` → `postgres://juwafire:YOUR_PASSWORD@YOUR_VPS_IP:5432/juwafire`
- `AUTH_SECRET` → generate one: `npx auth secret` (or `openssl rand -base64 33`)
- `AUTH_URL` → `http://localhost:3000` in dev, your real domain in prod
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` → from step 4

---

## 3. Create the tables

The SQL is already generated in `drizzle/0000_init.sql`. Apply it:

```bash
npm run db:migrate
```

(or `npm run db:push` to sync the schema directly without migration files.)

Tables created: `user`, `account`, `session`, `verificationToken`,
`transaction`, `load_request`, `cashout_request`.

---

## 4. Google OAuth credentials

1. Go to <https://console.cloud.google.com> → **APIs & Services → Credentials**
2. **Create Credentials → OAuth client ID → Web application**
3. Authorized redirect URI:
   - Dev: `http://localhost:3000/api/auth/callback/google`
   - Prod: `https://YOUR_DOMAIN/api/auth/callback/google`
4. Copy the Client ID + Secret into `.env.local`

---

## 5. Run it

```bash
npm run dev
```

- **/signup** — create an account (Google or username/password)
- **/login** — log in
- **/dashboard** — wallet: Add Balance, Load to Game, Cash Out, history

> ⚠️ **Add Balance currently credits test funds** so the wallet loop is fully
> demoable. Before launch, wire a real payment provider into
> `src/app/api/wallet/deposit/route.ts`.

---

## What's where

| Concern | File |
|---|---|
| DB schema | `src/db/schema.ts` |
| DB client | `src/db/index.ts` |
| Auth config (Google + credentials) | `src/auth.ts` |
| Register API | `src/app/api/register/route.ts` |
| Wallet APIs | `src/app/api/wallet/{deposit,load,cashout}/route.ts` |
| Wallet ledger logic | `src/lib/wallet.ts` |
| Login / Signup UI | `src/app/login`, `src/app/signup` |
| Dashboard | `src/app/dashboard/page.tsx` |

The `load_request` and `cashout_request` tables capture player requests as
`pending` — a future staff/admin screen will approve and fulfil them (that's the
backstage ops layer, intentionally not built into the player site yet).

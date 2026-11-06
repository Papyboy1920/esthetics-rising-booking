# Esthetics Rising — Booking

Online booking for the **Esthetics Rising** facial specialty program at
**South Dade Technical College** (Miami, FL). Clients book services online —
no more phone tag. Staff manage everything from the back office.

## Pages
- `/` — customer booking page (pick a service → day → time → name & phone)
- `/store` — back office (bookings, services, schedule) — needs `STORE_KEY`
- `/admin` — owner kill switch — needs `ADMIN_KEY`

## How it works
- New bookings arrive as **pending**; staff confirm them in `/store`.
- Time slots have a capacity (default 3 per slot) — full slots close automatically.
- Clients can check their booking status with their booking number + phone.
- Services, prices, open days, slots and capacity are all editable in `/store`.
  Catalog edits are protected by an additive-only merge on updates.

## Run
```
npm install
node server.js
```
Env vars: `PORT`, `DATABASE_URL` (Postgres; without it, local SQLite),
`STORE_KEY`, `ADMIN_KEY`.

## Deploy
Render Blueprint (`render.yaml`) → set `DATABASE_URL` (Neon) and `ADMIN_KEY`
in the dashboard; `STORE_KEY` is generated automatically.

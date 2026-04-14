# Geography Ninja — Setup & Deployment Guide

## Stack

- **Frontend**: React 19 + Vite (in `geoninja/`) → deploy to Vercel
- **Backend**: FastAPI (`main.py` at repo root) → deploy to Railway
- **External APIs**: Anthropic (question generation) and Resend (streak-reminder emails)

The backend is a stateless proxy — there is no database. Streak state lives
in the browser via `localStorage`. The backend exists only to (a) hide the
Anthropic API key from the browser and (b) send streak-reminder emails.

---

## Repository layout

```
/
├── main.py              FastAPI backend (Railway)
├── requirements.txt     Python deps
├── geoninja/            Vite React app (Vercel)
│   ├── index.html
│   ├── package.json
│   ├── public/
│   │   ├── favicon.svg
│   │   ├── icons.svg
│   │   ├── manifest.json
│   │   └── sw.js
│   └── src/
│       ├── App.jsx
│       ├── facts.js
│       └── ...
├── ROADMAP.md           Next-phase plan (Stripe, teacher market, etc.)
├── SETUP.md             This file
└── docs/archive/        Historical drafts (kept for reference)
```

---

## 1. Backend (FastAPI on Railway)

### Environment variables (Railway dashboard)

| Var | Required | Notes |
|-----|----------|-------|
| `ANTHROPIC_API_KEY` | yes | Used by `/api/questions` |
| `RESEND_API_KEY`    | no  | If unset, `/api/email` returns ok but sends nothing |
| `RESEND_FROM`       | no  | e.g. `noreply@geographyninja.com` |
| `ALLOWED_ORIGIN`    | yes | e.g. `https://geographyninja.com`; default is `*` |

### Run locally

```bash
pip install -r requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...
uvicorn main:app --reload --port 8000
# curl http://localhost:8000/health
```

### Endpoints

- `GET /health` — status + which integrations are configured
- `POST /api/questions` — body `{"type": "capital" | "continent" | "flag"}`; returns 10 AI-generated questions
- `POST /api/email` — body `{"email": "...", "streak": 3}`; sends a streak-reminder email via Resend

### Deploy to Railway

```bash
railway login
railway link       # link to the existing project
railway up
```

Set the env vars above in the Railway dashboard. The existing project URL
(`web-production-6a34e.up.railway.app`) can continue to serve the new
backend — older endpoints (`/scores`, `/register-email`, `/streaks/...`,
`/leaderboard/...`) are gone; the Vite frontend no longer calls them.

---

## 2. Frontend (Vite on Vercel)

### Environment variables (Vercel dashboard, or `.env.local`)

| Var | Notes |
|-----|-------|
| `VITE_API_URL` | URL of the deployed FastAPI backend. Defaults to the existing Railway URL if unset. |

### Run locally

```bash
cd geoninja
npm install
npm run dev
```

### Build

```bash
npm run build      # outputs to geoninja/dist/
npm run preview    # serves the built app locally
```

### Deploy to Vercel

Root directory: `geoninja/`. Build command: `npm run build`. Output
directory: `dist`. Set `VITE_API_URL` in the Vercel project settings.

### PWA icons (one-time)

The manifest references `/icons/icon-192.png` and `/icons/icon-512.png`.
Generate them (e.g. via favicon.io from the 🥷 emoji) and drop them into
`geoninja/public/icons/`. Until they exist, the PWA install prompt will
not appear on mobile but the app still runs normally.

---

## 3. Domain

Point `geographyninja.com` at Vercel:
- A record: `76.76.21.21`
- CNAME `www` → `cname.vercel-dns.com`

---

## Launch checklist

- [ ] Railway has `ANTHROPIC_API_KEY` + `ALLOWED_ORIGIN` set; `/health` returns `ai: true`
- [ ] Resend account created; `RESEND_API_KEY` + `RESEND_FROM` set
- [ ] Vercel project points at `geoninja/`, `VITE_API_URL` set
- [ ] PWA icons generated and placed in `geoninja/public/icons/`
- [ ] Mobile test on iOS + Android
- [ ] Install prompt appears after a few visits

See `ROADMAP.md` for what comes next (Stripe paywall, question-bank
expansion, teacher-market push).

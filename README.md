# Geography Ninja

Daily geography challenge — capitals, flags, continents, borders, and more.
Build streaks, earn ninja belts, play in the browser or installed as a PWA.

## Repository layout

- **`geoninja/`** — Vite + React 19 frontend (deploys to Vercel)
- **`main.py`** + **`requirements.txt`** — FastAPI backend (deploys to Railway);
  stateless proxy for Anthropic (questions) and Resend (streak emails)
- **`SETUP.md`** — setup and deployment guide
- **`ROADMAP.md`** — next phases (Stripe paywall, question-bank expansion, teacher market)
- **`docs/archive/`** — historical drafts kept for reference

## Quick start

```bash
# Frontend
cd geoninja && npm install && npm run dev

# Backend (in another terminal, from repo root)
pip install -r requirements.txt
ANTHROPIC_API_KEY=sk-ant-... uvicorn main:app --reload --port 8000
```

See `SETUP.md` for deployment and environment variables.

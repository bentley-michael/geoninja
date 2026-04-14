# Geography Ninja — Setup & Deployment Guide

## Stack
- **Frontend**: React (Vite) → deploy to Vercel or Netlify (free)
- **Backend**: FastAPI → deploy to Railway ($5/mo) or Render (free tier)
- **Database**: Supabase (free tier — 500MB, plenty for MVP)

---

## 1. Supabase Setup (10 min)

1. Go to https://supabase.com → create a new project
2. In the SQL Editor, paste and run `schema.sql`
3. Go to Settings → API → copy:
   - `Project URL` → this is your `SUPABASE_URL`
   - `anon public key` → this is your `SUPABASE_ANON_KEY`

---

## 2. Backend Setup

### Install dependencies
```bash
pip install fastapi uvicorn supabase python-dotenv pydantic[email]
```

### Create `.env` file
```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### Run locally
```bash
uvicorn main:app --reload --port 8000
```

### Deploy to Railway
1. `railway login` → `railway init` → `railway up`
2. Set env vars in Railway dashboard
3. Your API will be live at `https://your-app.railway.app`

---

## 3. Frontend Setup

### Install and run
```bash
npm create vite@latest geoninja -- --template react
cd geoninja
npm install
# Replace src/App.jsx with GeographyNinja.jsx content
npm run dev
```

### Connect to backend (optional for MVP)
In `GeographyNinja.jsx`, the MVP uses **localStorage only** — no backend needed to launch.

To connect backend later, add this to `handleComplete`:
```js
const API = "https://your-api.railway.app";

fetch(`${API}/scores`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    user_id: getUserId(),   // UUID from localStorage
    score: score,
    game_date: new Date().toISOString().split("T")[0],
  })
});
```

### Deploy frontend to Vercel
```bash
npm run build
npx vercel --prod
```
Then add your custom domain `geographyninja.com` in Vercel dashboard.

---

## 4. Domain Setup

Point `geographyninja.com` to Vercel:
- Add A record: `76.76.21.21`
- Add CNAME: `www` → `cname.vercel-dns.com`

---

## Launch Checklist

- [ ] Supabase project created + schema.sql run
- [ ] Frontend deployed to Vercel
- [ ] Domain pointed to Vercel
- [ ] Test on mobile (iPhone + Android)
- [ ] Post to r/geography and r/trivia
- [ ] Record 30s TikTok of gameplay

---

## Phase 2 (after first 50 users)
- Add username prompt after first game
- POST scores to backend
- Show real leaderboard
- Add email capture after day 3 streak

## Phase 3 (after daily retention confirmed)
- Add Stripe ($4.99/mo)
- Unlock: hard mode, full stats, leaderboard ranking
- Add 50 more questions

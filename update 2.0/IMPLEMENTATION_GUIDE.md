# Geography Ninja — Implementation Guide
## Optimized for speed. Ordered by impact.

---

## PHASE 1 — Critical fixes (do today, ~2 hours)

### 1. Deploy the new backend/main.py to Railway

Your Railway project is already live. Just:
```bash
# In your Railway project, add these env vars:
ANTHROPIC_API_KEY=sk-ant-...   ← your real key (moves it off client)
RESEND_API_KEY=re_...           ← get free at resend.com (3k emails/mo free)
RESEND_FROM=noreply@geographyninja.com
ALLOWED_ORIGIN=https://geoninja.vercel.app

# Then push the new main.py + requirements.txt
```

### 2. Drop the new App.jsx into src/

Replace `src/App.jsx` with the new file. Key changes:
- AI questions now fetched from `/api/questions` (no key in browser)
- Email now POSTs to `/api/email` (actually sends via Resend)
- Practice Mode added with 3-free-round soft gate
- Difficulty badges on every question
- Fun facts shown on wrong answers (uses your existing facts.js)
- "Retry wrong answers" button on results screen
- Pro button placeholder wired up
- Shadow Ninja rank added at 500 correct

### 3. Add PWA files

Copy `public/manifest.json`, `public/sw.js`, and `public/index.html` into your
project's `public/` folder. The index.html replaces the one in the root.

You need two PNG icons (generate from your 🥷 emoji at favicon.io):
  public/icons/icon-192.png
  public/icons/icon-512.png

---

## PHASE 2 — Stripe paywall (1 weekend, ~4 hours)

### Option A: Stripe Checkout (recommended — no UI work)

Add to backend/main.py:
```python
import stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

@app.post("/api/checkout")
async def create_checkout(req: Request):
    body = await req.json()
    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=[{
            "price": "price_YOUR_PRICE_ID",  # create in Stripe dashboard: $2.99/mo recurring
            "quantity": 1,
        }],
        mode="subscription",
        success_url="https://geoninja.vercel.app/?pro=1",
        cancel_url="https://geoninja.vercel.app/",
    )
    return {"url": session.url}
```

In App.jsx, replace the `alert(...)` in the Pro button with:
```javascript
const res = await fetch(`${API}/api/checkout`, { method: "POST" });
const { url } = await res.json();
window.location.href = url;
```

On success, Stripe redirects to `?pro=1`. In App.jsx useEffect:
```javascript
useEffect(() => {
  if (new URLSearchParams(location.search).get("pro") === "1") {
    localStorage.setItem("geoninja_pro", "1");
  }
}, []);
```

Add to Railway env: `STRIPE_SECRET_KEY=sk_live_...`

---

## PHASE 3 — Question bank expansion (1 weekend, AI-assisted)

Use this Claude prompt to generate 100 questions at a time:

```
Generate 100 geography quiz questions as a JSON array. Each question:
{
  "id": N,
  "type": "capital" | "continent" | "flag" | "border" | "geo",
  "difficulty": 1 | 2 | 3 | 4,
  "question": "...",
  "options": ["A","B","C","D"],
  "answer": "must match one of options exactly",
  "emoji": "relevant emoji"
}

Rules:
- difficulty 1 = very easy (France, Japan), 4 = expert (Nauru, Palau)
- Mix all types evenly
- For "flag" type, also include "flagCode": ISO 3166-1 alpha-2 code (e.g. "jp")
- No duplicate questions
- All answers must be factually correct
- Return ONLY the JSON array, no markdown
```

Run this 5 times → 500 questions → 1.5 years of daily play without repeats.

---

## PHASE 4 — AI tools for growth (pick 2–3)

### Content generation
- **Claude** (you're here) — generate question banks, write social copy, create teacher lesson plans around the game
- **Perplexity** — research "best geography quiz games" to find gaps you can own in SEO

### Visuals & social
- **Canva AI** — generate OG images, social post templates, flag quiz thumbnails
- **Adobe Firefly** — generate a custom ninja mascot / character art (no copyright issues)
- **CapCut AI** — auto-generate short-form "daily geography challenge" TikTok/Reels from a template

### Distribution
- **Taplio / Tweet Hunter** — schedule 30 days of "Geography fact of the day" posts for LinkedIn/Twitter. Each post ends with "Today's challenge is live → geographyninja.com"
- **Beehiiv** — free newsletter platform. Start "The Geography Ninja Brief" — one wild country fact + link to today's challenge. Teachers subscribe for classroom use.
- **ProductHunt** — submit on a Tuesday. Write a compelling story: "I built a Wordle-style geography game with AI-generated questions." Geography Ninja is a natural PH upvote magnet.

### Monetization
- **LemonSqueezy** — simpler than Stripe for solo founders. Handles EU VAT automatically.
- **Paddle** — if you go global, handles all international tax compliance.

### Analytics
- **PostHog** (free tier) — drop one script tag, see where users drop off (hint: it'll be the "already played" wall — Practice Mode will fix this)
- **Hotjar** — session recordings to watch real users play

---

## PHASE 5 — Teacher/school market ($$$)

This is your highest-LTV path. Geography teachers actively search for quiz tools.

### What to build (minimal effort):
1. A class code system: teacher creates a "class", students enter the code
2. A teacher dashboard showing each student's streak + score
3. Custom quiz topic selector (e.g. "Only African capitals this week")

### Where to market:
- **TeachersPayTeachers (TPT)** — list a free version + paid "class pack" at $4.99/student/yr
- **r/Teachers** and **r/geography** — post genuinely helpful content first, mention the game
- **Donors Choose** — teachers can fund school subscriptions through grants
- **Twitter/X edu community** — #edtech #geographyteacher hashtags

### Pricing for schools:
- Single teacher: $9.99/mo (unlimited students, dashboard, custom topics)
- School site license: $299/yr (all teachers, IT admin panel)

---

## Quick wins checklist

- [ ] Deploy backend with ANTHROPIC_API_KEY env var (30 min)
- [ ] Sign up for Resend, get API key (5 min)
- [ ] Replace App.jsx (10 min)
- [ ] Add PWA icons via favicon.io (10 min)
- [ ] Submit to ProductHunt (1 hr writing)
- [ ] Post to r/geography: "I built a Wordle for geography" (15 min)
- [ ] Generate 200 more questions with Claude (30 min)
- [ ] Set up PostHog analytics (10 min)
- [ ] Wire Stripe checkout (2 hrs)
- [ ] Create Canva social template for daily sharing (30 min)

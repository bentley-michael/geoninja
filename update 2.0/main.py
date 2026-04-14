"""
Geography Ninja — FastAPI Backend
Deploy to Railway (same project you already have at web-production-6a34e.up.railway.app)

ENV VARS needed in Railway:
  ANTHROPIC_API_KEY   — your Anthropic key (moves it off the client)
  RESEND_API_KEY      — free tier handles 3k emails/mo (resend.com)
  RESEND_FROM         — e.g. "noreply@geographyninja.com"
  ALLOWED_ORIGIN      — e.g. "https://geoninja.vercel.app"
"""

import os, json, httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr

app = FastAPI()

ALLOWED_ORIGIN = os.getenv("ALLOWED_ORIGIN", "*")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[ALLOWED_ORIGIN],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

ANTHROPIC_KEY = os.getenv("ANTHROPIC_API_KEY", "")
RESEND_KEY    = os.getenv("RESEND_API_KEY", "")
RESEND_FROM   = os.getenv("RESEND_FROM", "noreply@geographyninja.com")

# ── AI Question Proxy ─────────────────────────────────────────────────────────

class QuizRequest(BaseModel):
    type: str  # "capital" | "continent" | "flag"

PROMPTS = {
    "capital": "Generate 10 multiple choice geography questions about world capitals. Mix easy, medium and hard difficulty. Include some obscure capitals. Use countries from all continents.",
    "continent": "Generate 10 multiple choice geography questions asking which continent a country belongs to. Include both well-known and obscure countries. Mix difficulty.",
    "flag": "Generate 10 multiple choice geography questions about country flags. Describe the flag briefly in the question (colors, symbols) instead of showing an image. Mix easy and hard.",
}

SYSTEM = """You are a geography quiz generator. Return ONLY a JSON array of exactly 10 questions.
Each object must follow this exact schema:
{"id":1,"type":"<type>","question":"...","options":["A","B","C","D"],"answer":"correct answer","emoji":"relevant emoji"}
The answer MUST be one of the 4 options exactly. No markdown, no backticks, no explanation — just the raw JSON array."""

@app.post("/api/questions")
async def generate_questions(req: QuizRequest):
    if req.type not in PROMPTS:
        raise HTTPException(400, "Invalid type")
    if not ANTHROPIC_KEY:
        raise HTTPException(503, "AI not configured")

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": ANTHROPIC_KEY,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json={
                "model": "claude-sonnet-4-20250514",
                "max_tokens": 2000,
                "system": SYSTEM.replace("<type>", req.type),
                "messages": [{"role": "user", "content": PROMPTS[req.type]}],
            },
        )

    if resp.status_code != 200:
        raise HTTPException(502, "AI service error")

    data = resp.json()
    raw  = data.get("content", [{}])[0].get("text", "[]")
    raw  = raw.strip().lstrip("```json").lstrip("```").rstrip("```").strip()

    try:
        questions = json.loads(raw)
    except Exception:
        raise HTTPException(502, "Could not parse AI response")

    return {"questions": questions}


# ── Email Capture / Streak Reminder ──────────────────────────────────────────

class EmailRequest(BaseModel):
    email: EmailStr
    streak: int = 1

@app.post("/api/email")
async def save_email(req: EmailRequest):
    if not RESEND_KEY:
        # Silently succeed if Resend not configured yet
        return {"ok": True, "note": "email service not configured"}

    # Send welcome / confirmation email via Resend
    async with httpx.AsyncClient(timeout=10) as client:
        await client.post(
            "https://api.resend.com/emails",
            headers={"Authorization": f"Bearer {RESEND_KEY}", "Content-Type": "application/json"},
            json={
                "from": RESEND_FROM,
                "to": [req.email],
                "subject": "🥷 Geography Ninja streak reminder set!",
                "html": f"""
                <div style="font-family:system-ui;max-width:480px;margin:auto;padding:32px 24px;background:#0a0e1a;color:#f1f5f9;border-radius:16px">
                  <div style="font-size:48px;text-align:center;margin-bottom:16px">🥷</div>
                  <h2 style="color:#6366f1;text-align:center;margin:0 0 8px">Geography Ninja</h2>
                  <p style="color:#94a3b8;text-align:center;margin:0 0 24px">You're on a <strong style="color:#fbbf24">{req.streak}-day streak</strong>. Let's keep it going.</p>
                  <p style="color:#64748b;font-size:13px;text-align:center">We'll remind you each day to protect your streak.</p>
                  <div style="text-align:center;margin-top:24px">
                    <a href="https://geographyninja.com" style="background:#6366f1;color:#fff;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:700">Play today's challenge →</a>
                  </div>
                </div>
                """,
            },
        )

    return {"ok": True}


# ── Health ────────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "ai": bool(ANTHROPIC_KEY), "email": bool(RESEND_KEY)}

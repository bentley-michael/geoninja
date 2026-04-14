# Geography Ninja — FastAPI Backend
# Deploy on Railway or any VPS. Uses Supabase (Postgres) for persistence.
#
# pip install fastapi uvicorn supabase python-dotenv pydantic

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime, timedelta
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

app = FastAPI(title="Geography Ninja API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://geographyninja.com", "http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Supabase ─────────────────────────────────────────────────────────────────
supabase: Client = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_ANON_KEY"],
)

# ─── Models ───────────────────────────────────────────────────────────────────
class SaveScoreRequest(BaseModel):
    user_id: str           # anonymous UUID from localStorage
    username: Optional[str] = "Ninja"
    score: int             # 0–5
    total: int = 5
    game_date: str         # YYYY-MM-DD

class RegisterEmailRequest(BaseModel):
    user_id: str
    email: EmailStr

# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "ok", "service": "Geography Ninja API"}


@app.get("/health")
def health():
    return {"status": "healthy", "time": datetime.utcnow().isoformat()}


# Save a game result + update streak
@app.post("/scores")
def save_score(req: SaveScoreRequest):
    today = req.game_date

    # Upsert into game_results table
    result = supabase.table("game_results").upsert({
        "user_id": req.user_id,
        "game_date": today,
        "score": req.score,
        "total": req.total,
        "username": req.username,
    }, on_conflict="user_id,game_date").execute()

    # Fetch or create user streak record
    streak_row = supabase.table("user_streaks").select("*").eq("user_id", req.user_id).execute()

    yesterday = (datetime.strptime(today, "%Y-%m-%d") - timedelta(days=1)).strftime("%Y-%m-%d")

    if streak_row.data:
        row = streak_row.data[0]
        last = row.get("last_played")
        current_streak = row.get("streak", 0)

        if last == yesterday:
            new_streak = current_streak + 1
        elif last == today:
            new_streak = current_streak  # already played today
        else:
            new_streak = 1

        best = max(row.get("best_streak", 0), new_streak)
        total_games = row.get("total_games", 0) + (0 if last == today else 1)
        total_correct = row.get("total_correct", 0) + (0 if last == today else req.score)

        supabase.table("user_streaks").update({
            "streak": new_streak,
            "best_streak": best,
            "last_played": today,
            "total_games": total_games,
            "total_correct": total_correct,
        }).eq("user_id", req.user_id).execute()

        return {"streak": new_streak, "best_streak": best, "total_games": total_games, "total_correct": total_correct}
    else:
        supabase.table("user_streaks").insert({
            "user_id": req.user_id,
            "streak": 1,
            "best_streak": 1,
            "last_played": today,
            "total_games": 1,
            "total_correct": req.score,
            "username": req.username,
        }).execute()
        return {"streak": 1, "best_streak": 1, "total_games": 1, "total_correct": req.score}


# Get streak info for a user
@app.get("/streaks/{user_id}")
def get_streak(user_id: str):
    row = supabase.table("user_streaks").select("*").eq("user_id", req.user_id).execute()
    if not row.data:
        return {"streak": 0, "best_streak": 0, "total_games": 0, "total_correct": 0}
    return row.data[0]


# Daily leaderboard
@app.get("/leaderboard/daily")
def daily_leaderboard():
    today = date.today().isoformat()
    result = supabase.table("game_results") \
        .select("username, score, user_id") \
        .eq("game_date", today) \
        .order("score", desc=True) \
        .limit(20) \
        .execute()
    return {"date": today, "leaderboard": result.data}


# All-time leaderboard by best_streak
@app.get("/leaderboard/alltime")
def alltime_leaderboard():
    result = supabase.table("user_streaks") \
        .select("username, best_streak, total_correct, total_games") \
        .order("best_streak", desc=True) \
        .limit(20) \
        .execute()
    return {"leaderboard": result.data}


# Register email to save streak (soft auth)
@app.post("/register-email")
def register_email(req: RegisterEmailRequest):
    supabase.table("user_streaks") \
        .update({"email": req.email}) \
        .eq("user_id", req.user_id) \
        .execute()
    return {"status": "ok", "message": "Email saved. We'll remind you to keep your streak!"}

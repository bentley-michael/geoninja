-- Geography Ninja — Supabase Schema
-- Run this in your Supabase SQL editor

-- Game results (one row per user per day)
CREATE TABLE IF NOT EXISTS game_results (
    id          BIGSERIAL PRIMARY KEY,
    user_id     TEXT NOT NULL,
    game_date   DATE NOT NULL,
    score       INT NOT NULL DEFAULT 0,
    total       INT NOT NULL DEFAULT 5,
    username    TEXT DEFAULT 'Ninja',
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, game_date)
);

-- User streaks / aggregate stats
CREATE TABLE IF NOT EXISTS user_streaks (
    id              BIGSERIAL PRIMARY KEY,
    user_id         TEXT NOT NULL UNIQUE,
    username        TEXT DEFAULT 'Ninja',
    email           TEXT,
    streak          INT DEFAULT 0,
    best_streak     INT DEFAULT 0,
    last_played     DATE,
    total_games     INT DEFAULT 0,
    total_correct   INT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_game_results_date ON game_results(game_date);
CREATE INDEX IF NOT EXISTS idx_game_results_score ON game_results(score DESC);
CREATE INDEX IF NOT EXISTS idx_user_streaks_best ON user_streaks(best_streak DESC);

-- Enable Row Level Security (RLS) — users can only read/write their own rows
ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;

-- Allow public read for leaderboard, restricted write
CREATE POLICY "Anyone can read leaderboard" ON game_results FOR SELECT USING (true);
CREATE POLICY "Users insert own scores" ON game_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Users update own scores" ON game_results FOR UPDATE USING (true);

CREATE POLICY "Anyone can read streaks" ON user_streaks FOR SELECT USING (true);
CREATE POLICY "Users manage own streak" ON user_streaks FOR ALL USING (true);

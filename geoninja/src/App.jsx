import { useState, useEffect, useCallback } from "react";
import countryFacts from "./facts.js";

const API = "https://web-production-6a34e.up.railway.app";

// ─── Question Bank ────────────────────────────────────────────────────────────
const QUESTIONS = [
  // Country → Capital
  { id: 1, type: "capital", question: "What is the capital of Japan?", options: ["Seoul", "Tokyo", "Beijing", "Bangkok"], answer: "Tokyo", emoji: "🗾" },
  { id: 2, type: "capital", question: "What is the capital of Brazil?", options: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"], answer: "Brasília", emoji: "🇧🇷" },
  { id: 3, type: "capital", question: "What is the capital of Australia?", options: ["Sydney", "Melbourne", "Brisbane", "Canberra"], answer: "Canberra", emoji: "🦘" },
  { id: 4, type: "capital", question: "What is the capital of Canada?", options: ["Toronto", "Vancouver", "Ottawa", "Montreal"], answer: "Ottawa", emoji: "🍁" },
  { id: 5, type: "capital", question: "What is the capital of Egypt?", options: ["Alexandria", "Cairo", "Giza", "Luxor"], answer: "Cairo", emoji: "🏛️" },
  { id: 6, type: "capital", question: "What is the capital of Argentina?", options: ["Córdoba", "Rosario", "Buenos Aires", "Mendoza"], answer: "Buenos Aires", emoji: "🇦🇷" },
  { id: 7, type: "capital", question: "What is the capital of South Africa?", options: ["Cape Town", "Johannesburg", "Durban", "Pretoria"], answer: "Pretoria", emoji: "🦁" },
  { id: 8, type: "capital", question: "What is the capital of India?", options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"], answer: "New Delhi", emoji: "🇮🇳" },
  { id: 9, type: "capital", question: "What is the capital of Germany?", options: ["Munich", "Hamburg", "Frankfurt", "Berlin"], answer: "Berlin", emoji: "🇩🇪" },
  { id: 10, type: "capital", question: "What is the capital of Mexico?", options: ["Guadalajara", "Monterrey", "Mexico City", "Puebla"], answer: "Mexico City", emoji: "🌮" },
  { id: 11, type: "capital", question: "What is the capital of Nigeria?", options: ["Lagos", "Kano", "Ibadan", "Abuja"], answer: "Abuja", emoji: "🇳🇬" },
  { id: 12, type: "capital", question: "What is the capital of Thailand?", options: ["Chiang Mai", "Phuket", "Bangkok", "Pattaya"], answer: "Bangkok", emoji: "🐘" },
  { id: 13, type: "capital", question: "What is the capital of Turkey?", options: ["Istanbul", "Ankara", "Izmir", "Bursa"], answer: "Ankara", emoji: "🇹🇷" },
  { id: 14, type: "capital", question: "What is the capital of Sweden?", options: ["Gothenburg", "Malmö", "Uppsala", "Stockholm"], answer: "Stockholm", emoji: "🇸🇪" },
  { id: 15, type: "capital", question: "What is the capital of New Zealand?", options: ["Auckland", "Christchurch", "Wellington", "Dunedin"], answer: "Wellington", emoji: "🥝" },
  { id: 16, type: "capital", question: "What is the capital of Saudi Arabia?", options: ["Jeddah", "Mecca", "Riyadh", "Medina"], answer: "Riyadh", emoji: "🏜️" },
  { id: 17, type: "capital", question: "What is the capital of Indonesia?", options: ["Surabaya", "Bandung", "Jakarta", "Medan"], answer: "Jakarta", emoji: "🇮🇩" },
  { id: 18, type: "capital", question: "What is the capital of Kenya?", options: ["Mombasa", "Kisumu", "Nakuru", "Nairobi"], answer: "Nairobi", emoji: "🦒" },
  { id: 19, type: "capital", question: "What is the capital of Portugal?", options: ["Porto", "Braga", "Coimbra", "Lisbon"], answer: "Lisbon", emoji: "🇵🇹" },
  { id: 20, type: "capital", question: "What is the capital of Peru?", options: ["Arequipa", "Trujillo", "Cusco", "Lima"], answer: "Lima", emoji: "🦙" },
  // Country → Continent
  { id: 21, type: "continent", question: "Which continent is Kazakhstan in?", options: ["Europe", "Asia", "Africa", "Oceania"], answer: "Asia", emoji: "🌍" },
  { id: 22, type: "continent", question: "Which continent is Morocco in?", options: ["Asia", "Europe", "South America", "Africa"], answer: "Africa", emoji: "🌍" },
  { id: 23, type: "continent", question: "Which continent is Colombia in?", options: ["North America", "Europe", "South America", "Africa"], answer: "South America", emoji: "🌎" },
  { id: 24, type: "continent", question: "Which continent is Finland in?", options: ["Asia", "North America", "Africa", "Europe"], answer: "Europe", emoji: "🌍" },
  { id: 25, type: "continent", question: "Which continent is Papua New Guinea in?", options: ["Asia", "Africa", "South America", "Oceania"], answer: "Oceania", emoji: "🌏" },
  { id: 26, type: "continent", question: "Which continent is Ethiopia in?", options: ["Asia", "Europe", "Africa", "South America"], answer: "Africa", emoji: "🌍" },
  { id: 27, type: "continent", question: "Which continent is Guatemala in?", options: ["South America", "North America", "Europe", "Asia"], answer: "North America", emoji: "🌎" },
  { id: 28, type: "continent", question: "Which continent is Uzbekistan in?", options: ["Europe", "Africa", "South America", "Asia"], answer: "Asia", emoji: "🌏" },
  { id: 29, type: "continent", question: "Which continent is Mozambique in?", options: ["Asia", "South America", "Europe", "Africa"], answer: "Africa", emoji: "🌍" },
  { id: 30, type: "continent", question: "Which continent is Iceland in?", options: ["Asia", "North America", "Africa", "Europe"], answer: "Europe", emoji: "🌍" },
  // Flag → Country (flagcdn.com — free, no API key)
  { id: 31, type: "flag", question: "Which country does this flag belong to?", flagCode: "jp", options: ["China", "Japan", "South Korea", "Taiwan"], answer: "Japan" },
  { id: 32, type: "flag", question: "Which country does this flag belong to?", flagCode: "br", options: ["Argentina", "Colombia", "Brazil", "Venezuela"], answer: "Brazil" },
  { id: 33, type: "flag", question: "Which country does this flag belong to?", flagCode: "ca", options: ["USA", "Australia", "UK", "Canada"], answer: "Canada" },
  { id: 34, type: "flag", question: "Which country does this flag belong to?", flagCode: "za", options: ["Kenya", "Nigeria", "South Africa", "Ghana"], answer: "South Africa" },
  { id: 35, type: "flag", question: "Which country does this flag belong to?", flagCode: "se", options: ["Norway", "Denmark", "Finland", "Sweden"], answer: "Sweden" },
  { id: 36, type: "flag", question: "Which country does this flag belong to?", flagCode: "tr", options: ["Iran", "Pakistan", "Turkey", "Tunisia"], answer: "Turkey" },
  { id: 37, type: "flag", question: "Which country does this flag belong to?", flagCode: "au", options: ["New Zealand", "UK", "Fiji", "Australia"], answer: "Australia" },
  { id: 38, type: "flag", question: "Which country does this flag belong to?", flagCode: "ng", options: ["Niger", "Ghana", "Ivory Coast", "Nigeria"], answer: "Nigeria" },
  { id: 39, type: "flag", question: "Which country does this flag belong to?", flagCode: "pt", options: ["Spain", "Brazil", "Portugal", "Italy"], answer: "Portugal" },
  { id: 40, type: "flag", question: "Which country does this flag belong to?", flagCode: "eg", options: ["Sudan", "Syria", "Iraq", "Egypt"], answer: "Egypt" },
  // Hard / Obscure
  { id: 41, type: "capital", question: "What is the capital of Kyrgyzstan?", options: ["Almaty", "Tashkent", "Bishkek", "Dushanbe"], answer: "Bishkek", emoji: "🏔️" },
  { id: 42, type: "capital", question: "What is the capital of Burkina Faso?", options: ["Bamako", "Ouagadougou", "Niamey", "Lomé"], answer: "Ouagadougou", emoji: "🌍" },
  { id: 43, type: "capital", question: "What is the capital of Moldova?", options: ["Minsk", "Chișinău", "Tirana", "Skopje"], answer: "Chișinău", emoji: "🇲🇩" },
  { id: 44, type: "capital", question: "What is the capital of Suriname?", options: ["Georgetown", "Paramaribo", "Cayenne", "Bridgetown"], answer: "Paramaribo", emoji: "🌿" },
  { id: 45, type: "capital", question: "What is the capital of Eritrea?", options: ["Djibouti", "Mogadishu", "Asmara", "Addis Ababa"], answer: "Asmara", emoji: "🌍" },
];

// ─── Utilities ────────────────────────────────────────────────────────────────
function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getDailyQuestions() {
  const today = getTodayKey();
  let seed = today.split("-").reduce((a, b) => a + parseInt(b), 0);
  const shuffled = [...QUESTIONS].sort((a, b) => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280 - 0.5;
  });
  return shuffled.slice(0, 10).map(q => ({
    ...q,
    options: shuffleArray(q.options),
  }));
}

function getStreak() {
  try {
    const data = JSON.parse(localStorage.getItem("geoninja_streak") || "{}");
    return data;
  } catch { return {}; }
}

function saveStreak(score) {
  const today = getTodayKey();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const existing = getStreak();
  const hasShield = localStorage.getItem("geoninja_shield") === "1";
  const missedDay = existing.lastPlayed && existing.lastPlayed !== yesterday && existing.lastPlayed !== today;
  let shieldUsed = false;
  const currentStreak = existing.lastPlayed === yesterday ? (existing.streak || 0) + 1
    : existing.lastPlayed === today ? existing.streak
    : missedDay && hasShield
      ? (existing.streak || 0)
      : 1;

  if (missedDay && hasShield) {
    localStorage.removeItem("geoninja_shield");
    shieldUsed = true;
  }

  if (score >= 7) {
    localStorage.setItem("geoninja_shield", "1");
  }

  const newData = {
    lastPlayed: today,
    streak: currentStreak,
    bestStreak: Math.max(currentStreak, existing.bestStreak || 0),
    totalGames: (existing.totalGames || 0) + 1,
    totalCorrect: (existing.totalCorrect || 0) + score,
    shieldUsed,
  };
  localStorage.setItem("geoninja_streak", JSON.stringify(newData));
  return newData;
}

function hasPlayedToday() {
  const data = getStreak();
  return data.lastPlayed === getTodayKey();
}

// ─── Components ───────────────────────────────────────────────────────────────
const NINJA_RANKS = [
  { min: 0, label: "White Belt", color: "#e2e8f0" },
  { min: 10, label: "Yellow Belt", color: "#fbbf24" },
  { min: 25, label: "Green Belt", color: "#34d399" },
  { min: 50, label: "Blue Belt", color: "#60a5fa" },
  { min: 100, label: "Red Belt", color: "#f87171" },
  { min: 200, label: "Black Belt", color: "#1a1a2e" },
];

function getRank(totalCorrect) {
  return [...NINJA_RANKS].reverse().find(r => (totalCorrect || 0) >= r.min) || NINJA_RANKS[0];
}

// ─── Screens ──────────────────────────────────────────────────────────────────

function HomeScreen({ onStart, streakData }) {
  const rank = getRank(streakData?.totalCorrect);
  const alreadyPlayed = hasPlayedToday();
  const shieldReady = localStorage.getItem("geoninja_shield") === "1";

  return (
    <div style={styles.screen}>
      <div style={styles.homeContent}>
        <div style={styles.logoWrap}>
          <div style={styles.ninjaIcon}>🥷</div>
          <h1 style={styles.logoText}>Geography <span style={styles.logoAccent}>Ninja</span></h1>
          <p style={styles.tagline}>Master the world. One question at a time.</p>
        </div>

        {streakData?.streak > 0 && (
          <div style={styles.streakBadge}>
            <span style={styles.fireEmoji}>🔥</span>
            <div>
              <div style={styles.streakNum}>{streakData.streak} day streak</div>
              <div style={styles.streakSub}>Best: {streakData.bestStreak} days</div>
            </div>
            {shieldReady && <div style={styles.homeShieldBadge}>🛡️ Shield ready</div>}
          </div>
        )}

        <div style={styles.rankCard}>
          <div style={{ ...styles.rankDot, background: rank.color }} />
          <div>
            <div style={styles.rankLabel}>Your Rank</div>
            <div style={styles.rankName}>{rank.label}</div>
          </div>
          <div style={styles.rankTotal}>{streakData?.totalCorrect || 0} correct</div>
        </div>

        {alreadyPlayed ? (
          <div style={styles.alreadyPlayed}>
            <div style={styles.checkmark}>✓</div>
            <div>
              <div style={styles.apTitle}>Challenge complete!</div>
              <div style={styles.apSub}>Come back tomorrow for a new challenge</div>
            </div>
          </div>
        ) : (
          <button style={styles.startBtn} onClick={onStart}>
            Start Daily Challenge
            <span style={styles.btnArrow}>→</span>
          </button>
        )}

        <div style={styles.statsRow}>
          <div style={styles.statItem}>
            <div style={styles.statNum}>{streakData?.totalGames || 0}</div>
            <div style={styles.statLabel}>Games</div>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.statItem}>
            <div style={styles.statNum}>{streakData?.totalCorrect || 0}</div>
            <div style={styles.statLabel}>Correct</div>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.statItem}>
            <div style={styles.statNum}>{streakData?.bestStreak || 0}</div>
            <div style={styles.statLabel}>Best Streak</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuizScreen({ questions, onComplete }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [results, setResults] = useState([]);
  const [animState, setAnimState] = useState("idle"); // idle | correct | wrong | next

  const q = questions[current];

  const handleAnswer = (option) => {
    if (selected !== null) return;
    const correct = option === q.answer;
    setSelected(option);
    setAnimState(correct ? "correct" : "wrong");

    setTimeout(() => {
      const newResults = [...results, { question: q, selected: option, correct }];
      setResults(newResults);
      if (current + 1 >= questions.length) {
        onComplete(newResults);
      } else {
        setAnimState("next");
        setTimeout(() => {
          setCurrent(c => c + 1);
          setSelected(null);
          setAnimState("idle");
        }, 300);
      }
    }, 2800);
  };

  const progress = ((current) / questions.length) * 100;

  return (
    <div style={styles.screen}>
      <div style={styles.quizContent}>
        {/* Header */}
        <div style={styles.quizHeader}>
          <div style={styles.questionCount}>{current + 1} / {questions.length}</div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progress}%` }} />
          </div>
        </div>

        {/* Question card */}
        <div style={{
          ...styles.questionCard,
          opacity: animState === "next" ? 0 : 1,
          transform: animState === "next" ? "translateY(-8px)" : "translateY(0)",
          transition: "all 0.25s ease",
        }}>
          {q.flagCode
            ? <img src={`https://flagcdn.com/w160/${q.flagCode}.png`} alt="flag" style={styles.flagImg} />
            : <div style={styles.questionEmoji}>{q.emoji}</div>
          }
          <div style={styles.questionType}>
            {q.type === "capital" ? "🏛 CAPITALS" : q.type === "continent" ? "🌍 CONTINENTS" : "🚩 FLAGS"}
          </div>
          <div style={styles.questionText}>{q.question}</div>
        </div>

        {/* Options */}
        <div style={styles.optionsGrid}>
          {q.options.map((option) => {
            let btnStyle = styles.optionBtn;
            if (selected !== null) {
              if (option === q.answer) btnStyle = { ...styles.optionBtn, ...styles.optionCorrect };
              else if (option === selected) btnStyle = { ...styles.optionBtn, ...styles.optionWrong };
              else btnStyle = { ...styles.optionBtn, ...styles.optionDimmed };
            }
            return (
              <button key={option} style={btnStyle} onClick={() => handleAnswer(option)}>
                {option}
                {selected !== null && option === q.answer && <span style={styles.optionTick}> ✓</span>}
                {selected !== null && option === selected && option !== q.answer && <span style={styles.optionX}> ✗</span>}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {selected !== null && (
          <div style={{
            ...styles.feedback,
            background: selected === q.answer ? "rgba(52,211,153,0.15)" : "rgba(248,113,113,0.15)",
            borderColor: selected === q.answer ? "#34d399" : "#f87171",
          }}>
            {selected === q.answer ? "🎯 Correct!" : `❌ The answer is ${q.answer}`}
          </div>
        )}

        {/* Fun Fact */}
        {selected !== null && (() => {
          const countryName = q.type === "flag"
            ? q.answer
            : q.question
                .replace("What is the capital of ", "")
                .replace("Which continent is ", "")
                .replace(" in?", "")
                .replace("?", "");
          const funFact = countryFacts[countryName];
          return funFact ? (
            <div style={styles.funFactBox}>
              {funFact}
            </div>
          ) : null;
        })()}
      </div>
    </div>
  );
}

function ResultsScreen({ results, streakData, onHome }) {
  const score = results.filter(r => r.correct).length;
  const total = results.length;
  const pct = Math.round((score / total) * 100);
  const rank = getRank(streakData?.totalCorrect);
  const shieldEarned = score >= 7 && localStorage.getItem("geoninja_shield") === "1";
  const [email, setEmail] = useState("");
  const [emailSaved, setEmailSaved] = useState(() => !!localStorage.getItem("geoninja_email"));
  const [emailMsg, setEmailMsg] = useState("");

  const shareText = `🥷 Geography Ninja\n${score}/${total} correct • ${pct}%\n🔥 Streak: ${streakData?.streak || 1} day${(streakData?.streak || 1) !== 1 ? "s" : ""}\nRank: ${rank.label}\ngeographyninja.com`;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
    }
    alert("Score copied! Paste it anywhere to share 🥷");
  };

  const handleEmailSave = async () => {
    if (!email.includes("@")) { setEmailMsg("Enter a valid email"); return; }
    localStorage.setItem("geoninja_email", email);
    const userId = localStorage.getItem("geoninja_uid") || crypto.randomUUID();
    localStorage.setItem("geoninja_uid", userId);
    try {
      await fetch(`${API}/register-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, email }),
      });
    } catch(e) { console.warn("API unavailable", e); }
    setEmailSaved(true);
    setEmailMsg("✓ Saved! Check your inbox for a welcome email.");
  };

  const medals = score === 5 ? "🏆" : score >= 4 ? "🥇" : score >= 3 ? "🥈" : score >= 2 ? "🥉" : "💪";

  return (
    <div style={styles.screen}>
      <div style={styles.resultsContent}>
        <div style={styles.resultsMedal}>{medals}</div>
        <h2 style={styles.resultsTitle}>
          {score === 5 ? "Perfect!" : score >= 4 ? "Great job!" : score >= 3 ? "Not bad!" : "Keep training!"}
        </h2>

        {streakData?.shieldUsed && (
          <div style={styles.shieldUsedBanner}>🛡️ Streak Shield used! Your streak was protected.</div>
        )}

        <div style={styles.scoreCircle}>
          <div style={styles.scoreNum}>{score}/{total}</div>
          <div style={styles.scorePct}>{pct}%</div>
        </div>

        <div style={styles.streakRow}>
          <span style={styles.fireEmoji}>🔥</span>
          <span style={styles.streakBig}>{streakData?.streak || 1} day streak</span>
        </div>

        {shieldEarned && <div style={styles.shieldEarnedBadge}>🛡️ Streak Shield earned!</div>}

        {/* Question breakdown */}
        <div style={styles.breakdown}>
          {results.map((r, i) => {
            return (
              <div key={i} style={styles.breakdownItem}>
                <span style={r.correct ? styles.bCorrect : styles.bWrong}>
                  {r.correct ? "✓" : "✗"}
                </span>
                <span style={styles.bText}>{r.question.question.replace("What is the capital of ", "").replace("Which continent is ", "").replace(" in?", "").replace("Which country does this flag belong to?", `Flag ${r.question.flag}`)}</span>
                {!r.correct && <span style={styles.bAnswer}>{r.question.answer}</span>}
              </div>
            );
          })}
        </div>

        {/* Email capture */}
        {!emailSaved ? (
          <div style={styles.emailCapture}>
            <div style={styles.emailTitle}>🔥 Don't lose your streak</div>
            <div style={styles.emailSub}>Get a daily reminder to keep it going</div>
            <div style={styles.emailRow}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleEmailSave()}
                style={styles.emailInput}
              />
              <button style={styles.emailBtn} onClick={handleEmailSave}>Save</button>
            </div>
            {emailMsg && <div style={styles.emailMsg}>{emailMsg}</div>}
          </div>
        ) : (
          <div style={styles.emailSavedBadge}>✓ Streak reminder saved</div>
        )}

        <button style={styles.shareBtn} onClick={handleShare}>
          Share Score 🥷
        </button>

        <button style={styles.homeBtn} onClick={onHome}>
          Back to Home
        </button>

        <div style={styles.comeTomorrow}>Come back tomorrow for a new challenge!</div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
// ─── AI Question Generator ───────────────────────────────────────────────────
async function generateAIQuestions() {
  const types = ["capital", "continent", "flag"];
  const type = types[Math.floor(Math.random() * types.length)];

  const prompts = {
    capital: "Generate 10 multiple choice geography questions about world capitals. Mix easy, medium and hard difficulty. Include obscure capitals too. Use countries from all continents.",
    continent: "Generate 10 multiple choice geography questions asking which continent a country belongs to. Include obscure and well-known countries. Mix difficulty.",
    flag: "Generate 10 multiple choice geography questions about country flags. Describe the flag briefly in the question instead of showing it. Mix easy and hard.",
  };

  const systemPrompt = `You are a geography quiz generator. Return ONLY a JSON array of exactly 10 questions.
Each question must follow this exact format:
{"id": 1, "type": "${type}", "question": "...", "options": ["A","B","C","D"], "answer": "correct answer here", "emoji": "relevant emoji"}
The answer must be one of the 4 options exactly. No markdown, no explanation, just the JSON array.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{ role: "user", content: prompts[type] }],
      }),
    });
    const data = await response.json();
    const text = data.content?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    // Shuffle options on each question
    return parsed.map((q, i) => ({ ...q, id: i + 1, options: shuffleArray(q.options) }));
  } catch (e) {
    console.warn("AI generation failed, using local questions", e);
    return null;
  }
}

export default function App() {
  const [screen, setScreen] = useState("home"); // home | loading | quiz | results
  const [questions, setQuestions] = useState([]);
  const [results, setResults] = useState([]);
  const [streakData, setStreakData] = useState(getStreak());
  const [loadingMsg, setLoadingMsg] = useState("");

  const handleStart = useCallback(async () => {
    setScreen("loading");
    const msgs = ["Summoning questions...", "Challenging the ninja...", "Loading challenge..."];
    setLoadingMsg(msgs[Math.floor(Math.random() * msgs.length)]);

    const aiQuestions = await generateAIQuestions();
    setQuestions(aiQuestions || getDailyQuestions());
    setScreen("quiz");
  }, []);

  const handleComplete = useCallback(async (res) => {
    const score = res.filter(r => r.correct).length;
    const newStreak = saveStreak(score);
    const userId = localStorage.getItem("geoninja_uid") || crypto.randomUUID();
    localStorage.setItem("geoninja_uid", userId);

    try {
      await fetch(`${API}/scores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          score: score,
          total: res.length,
          game_date: new Date().toISOString().split("T")[0],
        }),
      });
    } catch(e) { console.warn("Score save failed", e); }
    setStreakData(newStreak);
    setResults(res);
    setScreen("results");
  }, []);

  const handleHome = useCallback(() => {
    setScreen("home");
    setStreakData(getStreak());
  }, []);

  return (
    <div style={styles.app}>
      <div style={styles.bgPattern} />
      {screen === "home" && <HomeScreen onStart={handleStart} streakData={streakData} />}
      {screen === "loading" && (
        <div style={styles.loadingScreen}>
          <div style={styles.loadingNinja}>🥷</div>
          <div style={styles.loadingMsg}>{loadingMsg}</div>
          <div style={styles.loadingDots}><span>.</span><span>.</span><span>.</span></div>
        </div>
      )}
      {screen === "quiz" && <QuizScreen questions={questions} onComplete={handleComplete} />}
      {screen === "results" && <ResultsScreen results={results} streakData={streakData} onHome={handleHome} />}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  app: {
    minHeight: "100vh",
    background: "#0a0e1a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  bgPattern: {
    position: "fixed",
    inset: 0,
    background: "radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(16,185,129,0.1) 0%, transparent 50%)",
    pointerEvents: "none",
  },
  screen: {
    width: "100%",
    maxWidth: 420,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 20px",
    boxSizing: "border-box",
    position: "relative",
    zIndex: 1,
  },
  homeContent: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  logoWrap: {
    textAlign: "center",
    marginBottom: 4,
  },
  ninjaIcon: {
    fontSize: 56,
    marginBottom: 8,
    display: "block",
    filter: "drop-shadow(0 0 20px rgba(99,102,241,0.5))",
  },
  logoText: {
    fontSize: 32,
    fontWeight: 800,
    color: "#f1f5f9",
    margin: 0,
    letterSpacing: "-0.5px",
  },
  logoAccent: {
    color: "#6366f1",
    marginLeft: 6,
  },
  tagline: {
    color: "#64748b",
    fontSize: 14,
    margin: "8px 0 0",
    letterSpacing: "0.3px",
  },
  streakBadge: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "rgba(251,191,36,0.1)",
    border: "1px solid rgba(251,191,36,0.25)",
    borderRadius: 14,
    padding: "14px 18px",
  },
  fireEmoji: { fontSize: 28 },
  streakNum: { fontSize: 18, fontWeight: 700, color: "#fbbf24" },
  streakSub: { fontSize: 12, color: "#64748b" },
  homeShieldBadge: {
    marginLeft: "auto",
    color: "#60a5fa",
    fontSize: 12,
    fontWeight: 700,
    background: "rgba(96,165,250,0.15)",
    border: "1px solid #60a5fa",
    borderRadius: 999,
    padding: "4px 8px",
  },
  rankCard: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: "14px 18px",
  },
  rankDot: {
    width: 12,
    height: 12,
    borderRadius: "50%",
    flexShrink: 0,
    boxShadow: "0 0 8px currentColor",
  },
  rankLabel: { fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" },
  rankName: { fontSize: 16, fontWeight: 700, color: "#f1f5f9" },
  rankTotal: { marginLeft: "auto", fontSize: 13, color: "#64748b" },
  alreadyPlayed: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    background: "rgba(52,211,153,0.08)",
    border: "1px solid rgba(52,211,153,0.2)",
    borderRadius: 14,
    padding: "16px 20px",
  },
  checkmark: { fontSize: 24, color: "#34d399", fontWeight: 700 },
  apTitle: { fontSize: 16, fontWeight: 600, color: "#34d399" },
  apSub: { fontSize: 12, color: "#64748b", marginTop: 2 },
  startBtn: {
    width: "100%",
    padding: "18px 24px",
    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
    border: "none",
    borderRadius: 14,
    color: "#fff",
    fontSize: 17,
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    boxShadow: "0 4px 24px rgba(99,102,241,0.4)",
    letterSpacing: "0.2px",
  },
  btnArrow: { fontSize: 20 },
  statsRow: {
    display: "flex",
    alignItems: "center",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 14,
    padding: "16px 0",
  },
  statItem: { flex: 1, textAlign: "center" },
  statNum: { fontSize: 22, fontWeight: 700, color: "#f1f5f9" },
  statLabel: { fontSize: 11, color: "#64748b", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.4px" },
  statDivider: { width: 1, height: 36, background: "rgba(255,255,255,0.08)" },
  // Quiz
  quizContent: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  quizHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  questionCount: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: 600,
    minWidth: 36,
  },
  progressBar: {
    flex: 1,
    height: 6,
    background: "rgba(255,255,255,0.08)",
    borderRadius: 99,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #6366f1, #34d399)",
    borderRadius: 99,
    transition: "width 0.4s ease",
  },
  questionCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: "28px 24px",
    textAlign: "center",
  },
  questionEmoji: { fontSize: 52, marginBottom: 12, display: "block" },
  flagImg: { width: 120, height: "auto", borderRadius: 6, marginBottom: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.4)" },
  questionType: {
    fontSize: 10,
    fontWeight: 700,
    color: "#6366f1",
    letterSpacing: "1.5px",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  questionText: {
    fontSize: 19,
    fontWeight: 600,
    color: "#f1f5f9",
    lineHeight: 1.4,
  },
  optionsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },
  optionBtn: {
    padding: "16px 12px",
    background: "rgba(255,255,255,0.05)",
    border: "1.5px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    color: "#e2e8f0",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s",
    lineHeight: 1.3,
  },
  optionCorrect: {
    background: "rgba(52,211,153,0.15)",
    border: "1.5px solid #34d399",
    color: "#34d399",
  },
  optionWrong: {
    background: "rgba(248,113,113,0.15)",
    border: "1.5px solid #f87171",
    color: "#f87171",
  },
  optionDimmed: {
    opacity: 0.35,
  },
  optionTick: { color: "#34d399" },
  optionX: { color: "#f87171" },
  feedback: {
    padding: "14px 18px",
    borderRadius: 12,
    border: "1px solid",
    fontSize: 15,
    fontWeight: 600,
    color: "#f1f5f9",
    textAlign: "center",
  },
  funFactBox: {
    padding: "14px 16px",
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,0.2)",
    background: "rgba(148,163,184,0.05)",
    fontSize: 13,
    color: "#94a3b8",
    fontStyle: "italic",
    lineHeight: 1.5,
    textAlign: "center",
  },
  // Results
  resultsContent: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
  },
  resultsMedal: { fontSize: 64, filter: "drop-shadow(0 0 20px rgba(251,191,36,0.4))" },
  resultsTitle: {
    fontSize: 28,
    fontWeight: 800,
    color: "#f1f5f9",
    margin: 0,
  },
  scoreCircle: {
    width: 110,
    height: 110,
    borderRadius: "50%",
    border: "3px solid #6366f1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(99,102,241,0.1)",
    boxShadow: "0 0 32px rgba(99,102,241,0.3)",
  },
  scoreNum: { fontSize: 26, fontWeight: 800, color: "#f1f5f9" },
  scorePct: { fontSize: 13, color: "#6366f1", fontWeight: 600 },
  streakRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  streakBig: { fontSize: 18, fontWeight: 700, color: "#fbbf24" },
  shieldUsedBanner: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(96,165,250,0.15)",
    border: "1px solid #60a5fa",
    color: "#60a5fa",
    fontSize: 13,
    fontWeight: 700,
    textAlign: "center",
  },
  shieldEarnedBadge: {
    color: "#60a5fa",
    fontSize: 12,
    fontWeight: 700,
    background: "rgba(96,165,250,0.15)",
    border: "1px solid #60a5fa",
    borderRadius: 999,
    padding: "6px 10px",
  },
  breakdown: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    background: "rgba(255,255,255,0.03)",
    borderRadius: 14,
    padding: "14px 16px",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  breakdownItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 13,
  },
  bCorrect: { color: "#34d399", fontWeight: 700, fontSize: 15 },
  bWrong: { color: "#f87171", fontWeight: 700, fontSize: 15 },
  bText: { color: "#94a3b8", flex: 1 },
  bAnswer: { color: "#6366f1", fontWeight: 600, fontSize: 12 },
  shareBtn: {
    width: "100%",
    padding: "16px",
    background: "linear-gradient(135deg, #6366f1, #4f46e5)",
    border: "none",
    borderRadius: 14,
    color: "#fff",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
  },
  homeBtn: {
    width: "100%",
    padding: "14px",
    background: "transparent",
    border: "1.5px solid rgba(255,255,255,0.1)",
    borderRadius: 14,
    color: "#94a3b8",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  },
  comeTomorrow: {
    fontSize: 12,
    color: "#475569",
    textAlign: "center",
  },
  emailCapture: {
    width: "100%",
    background: "rgba(251,191,36,0.08)",
    border: "1px solid rgba(251,191,36,0.25)",
    borderRadius: 14,
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  emailTitle: { fontSize: 15, fontWeight: 700, color: "#fbbf24" },
  emailSub: { fontSize: 12, color: "#64748b" },
  emailRow: { display: "flex", gap: 8 },
  emailInput: {
    flex: 1,
    padding: "10px 14px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10,
    color: "#f1f5f9",
    fontSize: 14,
    outline: "none",
  },
  emailBtn: {
    padding: "10px 16px",
    background: "#fbbf24",
    border: "none",
    borderRadius: 10,
    color: "#0a0e1a",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
  },
  emailMsg: { fontSize: 12, color: "#34d399" },
  emailSavedBadge: {
    fontSize: 13,
    color: "#34d399",
    fontWeight: 600,
    textAlign: "center",
    padding: "10px",
    background: "rgba(52,211,153,0.08)",
    borderRadius: 10,
    width: "100%",
  },
  // Loading
  loadingScreen: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    gap: 16,
  },
  loadingNinja: {
    fontSize: 72,
    animation: "pulse 1s infinite",
    filter: "drop-shadow(0 0 24px rgba(99,102,241,0.6))",
  },
  loadingMsg: {
    fontSize: 18,
    fontWeight: 600,
    color: "#94a3b8",
    letterSpacing: "0.3px",
  },
  loadingDots: {
    fontSize: 32,
    color: "#6366f1",
    letterSpacing: 4,
  },
};

import { useState, useEffect, useCallback, useRef } from "react";
import countryFacts from "./facts.js";

// ─── Config ───────────────────────────────────────────────────────────────────
// API key is now on the backend. This is safe to expose.
const API = import.meta.env.VITE_API_URL || "https://web-production-6a34e.up.railway.app";

// ─── Question Bank (expanded — 80 questions across 4 difficulties) ────────────
// difficulty: 1=easy  2=medium  3=hard  4=expert
const QUESTIONS = [
  // ── Capitals: Easy ──────────────────────────────────────────────────────────
  { id:1,  type:"capital", difficulty:1, question:"What is the capital of Japan?",        options:["Seoul","Tokyo","Beijing","Bangkok"],           answer:"Tokyo",      emoji:"🗾" },
  { id:2,  type:"capital", difficulty:1, question:"What is the capital of France?",       options:["Lyon","Marseille","Nice","Paris"],             answer:"Paris",      emoji:"🇫🇷" },
  { id:3,  type:"capital", difficulty:1, question:"What is the capital of Brazil?",       options:["São Paulo","Rio de Janeiro","Brasília","Salvador"], answer:"Brasília", emoji:"🇧🇷" },
  { id:4,  type:"capital", difficulty:1, question:"What is the capital of Australia?",   options:["Sydney","Melbourne","Brisbane","Canberra"],     answer:"Canberra",   emoji:"🦘" },
  { id:5,  type:"capital", difficulty:1, question:"What is the capital of Canada?",      options:["Toronto","Vancouver","Ottawa","Montreal"],      answer:"Ottawa",     emoji:"🍁" },
  { id:6,  type:"capital", difficulty:1, question:"What is the capital of Egypt?",       options:["Alexandria","Cairo","Giza","Luxor"],            answer:"Cairo",      emoji:"🏛️" },
  { id:7,  type:"capital", difficulty:1, question:"What is the capital of Germany?",     options:["Munich","Hamburg","Frankfurt","Berlin"],        answer:"Berlin",     emoji:"🇩🇪" },
  { id:8,  type:"capital", difficulty:1, question:"What is the capital of Spain?",       options:["Barcelona","Seville","Valencia","Madrid"],      answer:"Madrid",     emoji:"🇪🇸" },
  { id:9,  type:"capital", difficulty:1, question:"What is the capital of Italy?",       options:["Milan","Naples","Florence","Rome"],             answer:"Rome",       emoji:"🇮🇹" },
  { id:10, type:"capital", difficulty:1, question:"What is the capital of China?",       options:["Shanghai","Guangzhou","Shenzhen","Beijing"],    answer:"Beijing",    emoji:"🇨🇳" },
  // ── Capitals: Medium ────────────────────────────────────────────────────────
  { id:11, type:"capital", difficulty:2, question:"What is the capital of Argentina?",   options:["Córdoba","Rosario","Buenos Aires","Mendoza"],   answer:"Buenos Aires",emoji:"🇦🇷" },
  { id:12, type:"capital", difficulty:2, question:"What is the capital of South Africa?",options:["Cape Town","Johannesburg","Durban","Pretoria"], answer:"Pretoria",   emoji:"🦁" },
  { id:13, type:"capital", difficulty:2, question:"What is the capital of India?",       options:["Mumbai","New Delhi","Kolkata","Chennai"],       answer:"New Delhi",  emoji:"🇮🇳" },
  { id:14, type:"capital", difficulty:2, question:"What is the capital of Mexico?",      options:["Guadalajara","Monterrey","Mexico City","Puebla"],answer:"Mexico City",emoji:"🌮" },
  { id:15, type:"capital", difficulty:2, question:"What is the capital of Nigeria?",     options:["Lagos","Kano","Ibadan","Abuja"],                answer:"Abuja",      emoji:"🇳🇬" },
  { id:16, type:"capital", difficulty:2, question:"What is the capital of Thailand?",    options:["Chiang Mai","Phuket","Bangkok","Pattaya"],      answer:"Bangkok",    emoji:"🐘" },
  { id:17, type:"capital", difficulty:2, question:"What is the capital of Turkey?",      options:["Istanbul","Ankara","Izmir","Bursa"],            answer:"Ankara",     emoji:"🇹🇷" },
  { id:18, type:"capital", difficulty:2, question:"What is the capital of Sweden?",      options:["Gothenburg","Malmö","Uppsala","Stockholm"],     answer:"Stockholm",  emoji:"🇸🇪" },
  { id:19, type:"capital", difficulty:2, question:"What is the capital of New Zealand?", options:["Auckland","Christchurch","Wellington","Dunedin"],answer:"Wellington", emoji:"🥝" },
  { id:20, type:"capital", difficulty:2, question:"What is the capital of Indonesia?",   options:["Surabaya","Bandung","Jakarta","Medan"],         answer:"Jakarta",    emoji:"🇮🇩" },
  { id:21, type:"capital", difficulty:2, question:"What is the capital of Kenya?",       options:["Mombasa","Kisumu","Nakuru","Nairobi"],          answer:"Nairobi",    emoji:"🦒" },
  { id:22, type:"capital", difficulty:2, question:"What is the capital of Portugal?",    options:["Porto","Braga","Coimbra","Lisbon"],             answer:"Lisbon",     emoji:"🇵🇹" },
  { id:23, type:"capital", difficulty:2, question:"What is the capital of Peru?",        options:["Arequipa","Trujillo","Cusco","Lima"],           answer:"Lima",       emoji:"🦙" },
  { id:24, type:"capital", difficulty:2, question:"What is the capital of Saudi Arabia?",options:["Jeddah","Mecca","Riyadh","Medina"],             answer:"Riyadh",     emoji:"🏜️" },
  { id:25, type:"capital", difficulty:2, question:"What is the capital of Poland?",      options:["Kraków","Wrocław","Gdańsk","Warsaw"],           answer:"Warsaw",     emoji:"🇵🇱" },
  // ── Capitals: Hard ──────────────────────────────────────────────────────────
  { id:26, type:"capital", difficulty:3, question:"What is the capital of Kyrgyzstan?",  options:["Almaty","Tashkent","Bishkek","Dushanbe"],       answer:"Bishkek",    emoji:"🏔️" },
  { id:27, type:"capital", difficulty:3, question:"What is the capital of Burkina Faso?",options:["Bamako","Ouagadougou","Niamey","Lomé"],          answer:"Ouagadougou",emoji:"🌍" },
  { id:28, type:"capital", difficulty:3, question:"What is the capital of Moldova?",     options:["Minsk","Chișinău","Tirana","Skopje"],           answer:"Chișinău",   emoji:"🇲🇩" },
  { id:29, type:"capital", difficulty:3, question:"What is the capital of Suriname?",    options:["Georgetown","Paramaribo","Cayenne","Bridgetown"],answer:"Paramaribo", emoji:"🌿" },
  { id:30, type:"capital", difficulty:3, question:"What is the capital of Eritrea?",     options:["Djibouti","Mogadishu","Asmara","Addis Ababa"],  answer:"Asmara",     emoji:"🌍" },
  { id:31, type:"capital", difficulty:3, question:"What is the capital of Kosovo?",      options:["Tirana","Skopje","Pristina","Podgorica"],       answer:"Pristina",   emoji:"🇽🇰" },
  { id:32, type:"capital", difficulty:3, question:"What is the capital of Bhutan?",      options:["Kathmandu","Thimphu","Colombo","Dhaka"],        answer:"Thimphu",    emoji:"🏔️" },
  { id:33, type:"capital", difficulty:3, question:"What is the capital of Benin?",       options:["Lomé","Abuja","Cotonou","Porto-Novo"],          answer:"Porto-Novo", emoji:"🌍" },
  { id:34, type:"capital", difficulty:3, question:"What is the capital of Laos?",        options:["Phnom Penh","Vientiane","Hanoi","Yangon"],      answer:"Vientiane",  emoji:"🌏" },
  { id:35, type:"capital", difficulty:3, question:"What is the capital of Montenegro?",  options:["Sarajevo","Podgorica","Pristina","Tirana"],     answer:"Podgorica",  emoji:"🇲🇪" },
  // ── Capitals: Expert ────────────────────────────────────────────────────────
  { id:36, type:"capital", difficulty:4, question:"What is the capital of Nauru?",       options:["Funafuti","Majuro","Yaren","Tarawa"],           answer:"Yaren",      emoji:"🌊" },
  { id:37, type:"capital", difficulty:4, question:"What is the capital of Palau?",       options:["Koror","Ngerulmud","Melekeok","Palikir"],       answer:"Ngerulmud",  emoji:"🌊" },
  { id:38, type:"capital", difficulty:4, question:"What is the capital of Kiribati?",    options:["Funafuti","South Tarawa","Majuro","Palikir"],   answer:"South Tarawa",emoji:"🌊" },
  { id:39, type:"capital", difficulty:4, question:"What is the capital of São Tomé and Príncipe?", options:["Malabo","Libreville","São Tomé","Bangui"], answer:"São Tomé", emoji:"🌍" },
  { id:40, type:"capital", difficulty:4, question:"What is the constitutional capital of Bolivia?", options:["La Paz","Santa Cruz","Cochabamba","Sucre"], answer:"Sucre", emoji:"🌎" },
  // ── Continents ──────────────────────────────────────────────────────────────
  { id:41, type:"continent", difficulty:1, question:"Which continent is Brazil in?",         options:["North America","Europe","South America","Africa"],   answer:"South America", emoji:"🌎" },
  { id:42, type:"continent", difficulty:1, question:"Which continent is Egypt in?",          options:["Asia","Europe","Africa","South America"],            answer:"Africa",        emoji:"🌍" },
  { id:43, type:"continent", difficulty:1, question:"Which continent is Japan in?",          options:["Africa","Oceania","Europe","Asia"],                  answer:"Asia",          emoji:"🌏" },
  { id:44, type:"continent", difficulty:2, question:"Which continent is Kazakhstan in?",     options:["Europe","Asia","Africa","Oceania"],                  answer:"Asia",          emoji:"🌍" },
  { id:45, type:"continent", difficulty:2, question:"Which continent is Morocco in?",        options:["Asia","Europe","South America","Africa"],            answer:"Africa",        emoji:"🌍" },
  { id:46, type:"continent", difficulty:2, question:"Which continent is Colombia in?",       options:["North America","Europe","South America","Africa"],   answer:"South America", emoji:"🌎" },
  { id:47, type:"continent", difficulty:2, question:"Which continent is Finland in?",        options:["Asia","North America","Africa","Europe"],            answer:"Europe",        emoji:"🌍" },
  { id:48, type:"continent", difficulty:2, question:"Which continent is Papua New Guinea in?",options:["Asia","Africa","South America","Oceania"],          answer:"Oceania",       emoji:"🌏" },
  { id:49, type:"continent", difficulty:2, question:"Which continent is Ethiopia in?",       options:["Asia","Europe","Africa","South America"],            answer:"Africa",        emoji:"🌍" },
  { id:50, type:"continent", difficulty:3, question:"Which continent is Uzbekistan in?",     options:["Europe","Africa","South America","Asia"],            answer:"Asia",          emoji:"🌏" },
  { id:51, type:"continent", difficulty:3, question:"Which continent is Mozambique in?",     options:["Asia","South America","Europe","Africa"],            answer:"Africa",        emoji:"🌍" },
  { id:52, type:"continent", difficulty:3, question:"Which continent is Greenland in?",      options:["Europe","Antarctica","Asia","North America"],        answer:"North America", emoji:"🌎" },
  { id:53, type:"continent", difficulty:3, question:"Which continent is Georgia (country) in?",options:["Europe","Middle East","Africa","Asia"],            answer:"Asia",          emoji:"🌏" },
  { id:54, type:"continent", difficulty:4, question:"Which continent is Réunion island in?", options:["Oceania","Asia","Africa","South America"],           answer:"Africa",        emoji:"🌍" },
  { id:55, type:"continent", difficulty:4, question:"Which continent is the Maldives in?",   options:["Africa","Oceania","Asia","Middle East"],             answer:"Asia",          emoji:"🌏" },
  // ── Flags ───────────────────────────────────────────────────────────────────
  { id:56, type:"flag", difficulty:1, question:"Which country does this flag belong to?", flagCode:"jp", options:["China","Japan","South Korea","Taiwan"],        answer:"Japan" },
  { id:57, type:"flag", difficulty:1, question:"Which country does this flag belong to?", flagCode:"br", options:["Argentina","Colombia","Brazil","Venezuela"],   answer:"Brazil" },
  { id:58, type:"flag", difficulty:1, question:"Which country does this flag belong to?", flagCode:"ca", options:["USA","Australia","UK","Canada"],               answer:"Canada" },
  { id:59, type:"flag", difficulty:1, question:"Which country does this flag belong to?", flagCode:"de", options:["Belgium","Hungary","Germany","Poland"],        answer:"Germany" },
  { id:60, type:"flag", difficulty:1, question:"Which country does this flag belong to?", flagCode:"fr", options:["Netherlands","France","Italy","Luxembourg"],   answer:"France" },
  { id:61, type:"flag", difficulty:2, question:"Which country does this flag belong to?", flagCode:"za", options:["Kenya","Nigeria","South Africa","Ghana"],      answer:"South Africa" },
  { id:62, type:"flag", difficulty:2, question:"Which country does this flag belong to?", flagCode:"se", options:["Norway","Denmark","Finland","Sweden"],         answer:"Sweden" },
  { id:63, type:"flag", difficulty:2, question:"Which country does this flag belong to?", flagCode:"tr", options:["Iran","Pakistan","Turkey","Tunisia"],          answer:"Turkey" },
  { id:64, type:"flag", difficulty:2, question:"Which country does this flag belong to?", flagCode:"au", options:["New Zealand","UK","Fiji","Australia"],         answer:"Australia" },
  { id:65, type:"flag", difficulty:2, question:"Which country does this flag belong to?", flagCode:"ng", options:["Niger","Ghana","Ivory Coast","Nigeria"],       answer:"Nigeria" },
  { id:66, type:"flag", difficulty:2, question:"Which country does this flag belong to?", flagCode:"pt", options:["Spain","Brazil","Portugal","Italy"],           answer:"Portugal" },
  { id:67, type:"flag", difficulty:2, question:"Which country does this flag belong to?", flagCode:"eg", options:["Sudan","Syria","Iraq","Egypt"],                answer:"Egypt" },
  { id:68, type:"flag", difficulty:3, question:"Which country does this flag belong to?", flagCode:"kz", options:["Uzbekistan","Kyrgyzstan","Kazakhstan","Tajikistan"], answer:"Kazakhstan" },
  { id:69, type:"flag", difficulty:3, question:"Which country does this flag belong to?", flagCode:"ge", options:["Armenia","Georgia","Azerbaijan","Moldova"],    answer:"Georgia" },
  { id:70, type:"flag", difficulty:3, question:"Which country does this flag belong to?", flagCode:"bt", options:["Tibet","Bhutan","Nepal","Laos"],               answer:"Bhutan" },
  { id:71, type:"flag", difficulty:3, question:"Which country does this flag belong to?", flagCode:"ls", options:["Lesotho","Eswatini","Botswana","Zimbabwe"],    answer:"Lesotho" },
  { id:72, type:"flag", difficulty:4, question:"Which country does this flag belong to?", flagCode:"ki", options:["Nauru","Kiribati","Palau","Tuvalu"],           answer:"Kiribati" },
  { id:73, type:"flag", difficulty:4, question:"Which country does this flag belong to?", flagCode:"mv", options:["Maldives","Pakistan","Saudi Arabia","Malaysia"],answer:"Maldives" },
  // ── Borders ─────────────────────────────────────────────────────────────────
  { id:74, type:"border", difficulty:2, question:"Which country does NOT border France?",  options:["Belgium","Switzerland","Austria","Germany"],          answer:"Austria",     emoji:"🗺️" },
  { id:75, type:"border", difficulty:2, question:"Which country borders both China and Russia?", options:["Kazakhstan","Mongolia","North Korea","All of these"], answer:"All of these", emoji:"🗺️" },
  { id:76, type:"border", difficulty:3, question:"How many countries does Brazil border?", options:["7","8","9","10"],                                    answer:"10",          emoji:"🌎" },
  { id:77, type:"border", difficulty:3, question:"Which is the only country that borders both the Mediterranean Sea and the Red Sea?", options:["Libya","Sudan","Egypt","Israel"], answer:"Egypt", emoji:"🗺️" },
  { id:78, type:"border", difficulty:4, question:"Which country borders the most other countries?", options:["Russia","China","Brazil","France"],          answer:"China",       emoji:"🗺️" },
  // ── Geography facts ─────────────────────────────────────────────────────────
  { id:79, type:"geo", difficulty:2, question:"What is the longest river in the world?",   options:["Amazon","Congo","Mississippi","Nile"],              answer:"Nile",        emoji:"🌊" },
  { id:80, type:"geo", difficulty:3, question:"Which country has the most natural lakes?", options:["Russia","Canada","United States","Brazil"],         answer:"Canada",      emoji:"🏞️" },
];

// ─── Utilities ────────────────────────────────────────────────────────────────
const QUESTION_TYPES = { capital:"🏛 CAPITALS", continent:"🌍 CONTINENTS", flag:"🚩 FLAGS", border:"🗺️ BORDERS", geo:"🌊 GEOGRAPHY" };
const DIFFICULTY_LABEL = { 1:"Easy", 2:"Medium", 3:"Hard", 4:"Expert" };
const DIFFICULTY_COLOR = { 1:"#34d399", 2:"#fbbf24", 3:"#f87171", 4:"#c084fc" };

function getTodayKey() { return new Date().toISOString().split("T")[0]; }

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
  const shuffled = [...QUESTIONS].sort(() => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280 - 0.5;
  });
  // Ensure a spread of difficulties in the daily 10
  const easy   = shuffled.filter(q => q.difficulty === 1).slice(0, 3);
  const medium = shuffled.filter(q => q.difficulty === 2).slice(0, 4);
  const hard   = shuffled.filter(q => q.difficulty === 3).slice(0, 2);
  const expert = shuffled.filter(q => q.difficulty === 4).slice(0, 1);
  return shuffleArray([...easy, ...medium, ...hard, ...expert]).map(q => ({
    ...q, options: shuffleArray(q.options),
  }));
}

function getPracticeQuestions(userStats) {
  // Weight towards types the user gets wrong
  const pool = shuffleArray([...QUESTIONS]).slice(0, 10);
  return pool.map(q => ({ ...q, options: shuffleArray(q.options) }));
}

function getStreak() {
  try { return JSON.parse(localStorage.getItem("geoninja_streak") || "{}"); }
  catch { return {}; }
}

function saveStreak(score) {
  const today     = getTodayKey();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const existing  = getStreak();
  const hasShield = localStorage.getItem("geoninja_shield") === "1";
  const missedDay = existing.lastPlayed && existing.lastPlayed !== yesterday && existing.lastPlayed !== today;

  let currentStreak = existing.lastPlayed === yesterday ? (existing.streak || 0) + 1
    : existing.lastPlayed === today ? existing.streak
    : missedDay && hasShield ? (existing.streak || 0)
    : 1;

  if (missedDay && hasShield) localStorage.removeItem("geoninja_shield");
  if (score >= 7) localStorage.setItem("geoninja_shield", "1");

  const newData = {
    lastPlayed: today,
    streak: currentStreak,
    bestStreak: Math.max(currentStreak, existing.bestStreak || 0),
    totalGames: (existing.totalGames || 0) + 1,
    totalCorrect: (existing.totalCorrect || 0) + score,
  };
  localStorage.setItem("geoninja_streak", JSON.stringify(newData));
  return newData;
}

function hasPlayedToday() {
  return getStreak().lastPlayed === getTodayKey();
}

function isPro() {
  return localStorage.getItem("geoninja_pro") === "1";
}

// ─── PWA helpers ─────────────────────────────────────────────────────────────
async function registerSW() {
  if ("serviceWorker" in navigator) {
    try { await navigator.serviceWorker.register("/sw.js"); } catch {}
  }
}

// ─── Backend calls ────────────────────────────────────────────────────────────
async function fetchAIQuestions() {
  const types = ["capital", "continent", "flag"];
  const type  = types[Math.floor(Math.random() * types.length)];
  try {
    const res  = await fetch(`${API}/api/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    if (!res.ok) return null;
    const { questions } = await res.json();
    return questions.map((q, i) => ({ ...q, id: i + 1, difficulty: q.difficulty || 2, options: shuffleArray(q.options) }));
  } catch { return null; }
}

async function submitEmail(email, streak) {
  try {
    await fetch(`${API}/api/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, streak }),
    });
  } catch {}
}

// ─── Rank system ─────────────────────────────────────────────────────────────
const NINJA_RANKS = [
  { min:0,   label:"White Belt",  color:"#e2e8f0" },
  { min:10,  label:"Yellow Belt", color:"#fbbf24" },
  { min:25,  label:"Green Belt",  color:"#34d399" },
  { min:50,  label:"Blue Belt",   color:"#60a5fa" },
  { min:100, label:"Red Belt",    color:"#f87171" },
  { min:200, label:"Black Belt",  color:"#a78bfa" },
  { min:500, label:"Shadow Ninja",color:"#c084fc" },
];

function getRank(totalCorrect) {
  return [...NINJA_RANKS].reverse().find(r => (totalCorrect || 0) >= r.min) || NINJA_RANKS[0];
}

// ─── HomeScreen ───────────────────────────────────────────────────────────────
function HomeScreen({ onStart, onPractice, streakData }) {
  const rank        = getRank(streakData?.totalCorrect);
  const alreadyPlayed = hasPlayedToday();
  const shieldReady = localStorage.getItem("geoninja_shield") === "1";
  const pro         = isPro();

  return (
    <div style={styles.screen}>
      <div style={styles.homeContent}>
        <div style={styles.logoWrap}>
          <h1 style={styles.logoHeading}>
            <img
              src="/geography-ninja-logo.png"
              alt="Geography Ninja"
              style={styles.logoImage}
            />
          </h1>
          <p style={styles.tagline}>Master the world. One question at a time.</p>
        </div>

        {streakData?.streak > 0 && (
          <div style={styles.streakBadge}>
            <span style={styles.fireEmoji}>🔥</span>
            <div>
              <div style={styles.streakNum}>{streakData.streak} day streak</div>
              <div style={styles.streakSub}>Best: {streakData.bestStreak} days</div>
            </div>
            {shieldReady && <div style={styles.homeShieldBadge}>🛡️ Shield</div>}
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
            Start Daily Challenge <span style={styles.btnArrow}>→</span>
          </button>
        )}

        {/* Practice Mode — free users see it but get a soft gate after 3 rounds */}
        <button style={styles.practiceBtn} onClick={onPractice}>
          {pro ? "🎯 Practice Mode (Pro)" : "🎯 Practice Mode"}
          <span style={{ fontSize:12, color:"#64748b", marginLeft:6 }}>
            {pro ? "Unlimited" : "3 free rounds"}
          </span>
        </button>

        {!pro && (
          <button style={styles.proBtn} onClick={() => alert("Stripe checkout coming soon!\n\nNinja Pro — $2.99/mo\n✓ Unlimited practice\n✓ Hard & Expert modes\n✓ No ads\n✓ Custom quiz topics")}>
            ⚡ Go Ninja Pro — $2.99/mo
          </button>
        )}

        <div style={styles.statsRow}>
          {[
            { num: streakData?.totalGames   || 0, label:"Games" },
            { num: streakData?.totalCorrect || 0, label:"Correct" },
            { num: streakData?.bestStreak   || 0, label:"Best Streak" },
          ].map((s, i, arr) => (
            <div key={s.label} style={{ display:"flex", flex:1, alignItems:"center" }}>
              {i > 0 && <div style={styles.statDivider}/>}
              <div style={styles.statItem}>
                <div style={styles.statNum}>{s.num}</div>
                <div style={styles.statLabel}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── QuizScreen ───────────────────────────────────────────────────────────────
function QuizScreen({ questions, onComplete, mode }) {
  const [current,   setCurrent]   = useState(0);
  const [selected,  setSelected]  = useState(null);
  const [results,   setResults]   = useState([]);
  const [animState, setAnimState] = useState("idle");
  const [timer,     setTimer]     = useState(null);

  const q        = questions[current];
  const progress = (current / questions.length) * 100;

  // Extract country name from question for fun fact lookup
  const countryMatch = q.question.match(/capital of ([^?]+)\?/) ||
                        q.question.match(/continent is ([^?]+) in\?/) ||
                        q.question.match(/country does this flag/);
  const countryKey   = countryMatch?.[1] || q.answer;
  const funFact      = countryFacts[countryKey] || countryFacts[q.answer] || null;

  const handleAnswer = useCallback((option) => {
    if (selected !== null) return;
    const correct = option === q.answer;
    setSelected(option);
    setAnimState(correct ? "correct" : "wrong");

    const t = setTimeout(() => {
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
    }, funFact && !correct ? 1800 : 1100);
    setTimer(t);
  }, [selected, q, results, current, questions, onComplete, funFact]);

  return (
    <div style={styles.screen}>
      <div style={styles.quizContent}>
        {/* Header */}
        <div style={styles.quizHeader}>
          <div style={styles.questionCount}>{current + 1}/{questions.length}</div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width:`${progress}%` }}/>
          </div>
          {mode === "practice" && (
            <div style={{ fontSize:11, color:"#6366f1", fontWeight:700, marginLeft:6 }}>PRACTICE</div>
          )}
        </div>

        {/* Question card */}
        <div style={{
          ...styles.questionCard,
          opacity: animState === "next" ? 0 : 1,
          transform: animState === "next" ? "translateY(-8px)" : "translateY(0)",
          transition: "all 0.25s ease",
        }}>
          {/* Difficulty badge */}
          <div style={{ marginBottom:8 }}>
            <span style={{
              fontSize:10, fontWeight:700, letterSpacing:"1px",
              color: DIFFICULTY_COLOR[q.difficulty] || "#64748b",
              border: `1px solid ${DIFFICULTY_COLOR[q.difficulty] || "#64748b"}`,
              borderRadius:99, padding:"2px 8px",
            }}>
              {DIFFICULTY_LABEL[q.difficulty] || "Medium"}
            </span>
          </div>

          {q.flagCode
            ? <img src={`https://flagcdn.com/w160/${q.flagCode}.png`} alt="flag" style={styles.flagImg}/>
            : <div style={styles.questionEmoji}>{q.emoji}</div>
          }
          <div style={styles.questionType}>{QUESTION_TYPES[q.type] || "❓ QUIZ"}</div>
          <div style={styles.questionText}>{q.question}</div>
        </div>

        {/* Options */}
        <div style={styles.optionsGrid}>
          {q.options.map(option => {
            let btnStyle = styles.optionBtn;
            if (selected !== null) {
              if (option === q.answer)      btnStyle = { ...styles.optionBtn, ...styles.optionCorrect };
              else if (option === selected) btnStyle = { ...styles.optionBtn, ...styles.optionWrong };
              else                          btnStyle = { ...styles.optionBtn, ...styles.optionDimmed };
            }
            return (
              <button key={option} style={btnStyle} onClick={() => handleAnswer(option)}>
                {option}
                {selected !== null && option === q.answer  && <span style={styles.optionTick}> ✓</span>}
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

        {/* Fun fact on wrong answer */}
        {selected !== null && selected !== q.answer && funFact && (
          <div style={styles.funFactBox}>💡 {funFact}</div>
        )}
      </div>
    </div>
  );
}

// ─── ResultsScreen ────────────────────────────────────────────────────────────
function ResultsScreen({ results, streakData, onHome, onPractice, mode }) {
  const score      = results.filter(r => r.correct).length;
  const total      = results.length;
  const pct        = Math.round((score / total) * 100);
  const rank       = getRank(streakData?.totalCorrect);
  const [email,    setEmail]    = useState("");
  const [emailSaved, setEmailSaved] = useState(() => !!localStorage.getItem("geoninja_email"));
  const [emailMsg, setEmailMsg] = useState("");
  const wrongAnswers = results.filter(r => !r.correct);

  const shareText = `🥷 Geography Ninja\n${score}/${total} correct • ${pct}%\n🔥 ${streakData?.streak || 1} day streak\nRank: ${rank.label}\ngeographyninja.com`;

  const handleShare = () => {
    navigator.clipboard?.writeText(shareText);
    alert("Score copied! Paste anywhere to share 🥷");
  };

  const handleEmailSave = async () => {
    if (!email.includes("@")) { setEmailMsg("Enter a valid email"); return; }
    localStorage.setItem("geoninja_email", email);
    setEmailSaved(true);
    setEmailMsg("✓ Saved! We'll remind you to keep your streak.");
    await submitEmail(email, streakData?.streak || 1);
  };

  const medals = score === total ? "🏆" : score >= total * 0.8 ? "🥇" : score >= total * 0.6 ? "🥈" : score >= total * 0.4 ? "🥉" : "💪";

  return (
    <div style={styles.screen}>
      <div style={styles.resultsContent}>
        <div style={styles.resultsMedal}>{medals}</div>
        <h2 style={styles.resultsTitle}>
          {score === total ? "Perfect!" : score >= total * 0.8 ? "Great job!" : score >= total * 0.6 ? "Not bad!" : "Keep training!"}
        </h2>

        <div style={styles.scoreCircle}>
          <div style={styles.scoreNum}>{score}/{total}</div>
          <div style={styles.scorePct}>{pct}%</div>
        </div>

        {mode !== "practice" && (
          <div style={styles.streakRow}>
            <span style={styles.fireEmoji}>🔥</span>
            <span style={styles.streakBig}>{streakData?.streak || 1} day streak</span>
          </div>
        )}

        {/* Breakdown */}
        <div style={styles.breakdown}>
          {results.map((r, i) => (
            <div key={i} style={styles.breakdownItem}>
              <span style={r.correct ? styles.bCorrect : styles.bWrong}>{r.correct ? "✓" : "✗"}</span>
              <span style={styles.bText}>
                {r.question.question
                  .replace("What is the capital of ","")
                  .replace("Which continent is ","")
                  .replace(" in?","")
                  .replace("Which country does this flag belong to?", r.question.flagCode?.toUpperCase() || "Flag")}
              </span>
              {!r.correct && <span style={styles.bAnswer}>{r.question.answer}</span>}
            </div>
          ))}
        </div>

        {/* Practice wrong answers */}
        {wrongAnswers.length > 0 && (
          <button style={styles.practiceBtn} onClick={() => onPractice(wrongAnswers.map(r => r.question))}>
            🔁 Retry wrong answers ({wrongAnswers.length})
          </button>
        )}

        {/* Email capture — now actually wires to backend */}
        {!emailSaved && mode !== "practice" ? (
          <div style={styles.emailCapture}>
            <div style={styles.emailTitle}>🔥 Don't lose your streak</div>
            <div style={styles.emailSub}>Get a daily reminder to keep it going</div>
            <div style={styles.emailRow}>
              <input
                type="email" placeholder="your@email.com" value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleEmailSave()}
                style={styles.emailInput}
              />
              <button style={styles.emailBtn} onClick={handleEmailSave}>Save</button>
            </div>
            {emailMsg && <div style={styles.emailMsg}>{emailMsg}</div>}
          </div>
        ) : emailSaved && (
          <div style={styles.emailSavedBadge}>✓ Streak reminder active</div>
        )}

        <button style={styles.shareBtn} onClick={handleShare}>Share Score 🥷</button>
        <button style={styles.homeBtn}  onClick={onHome}>Back to Home</button>
        {mode !== "practice" && (
          <div style={styles.comeTomorrow}>Come back tomorrow for a new challenge!</div>
        )}
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen,     setScreen]     = useState("home");
  const [questions,  setQuestions]  = useState([]);
  const [results,    setResults]    = useState([]);
  const [streakData, setStreakData] = useState(getStreak);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [mode,       setMode]       = useState("daily"); // "daily" | "practice"
  const practiceCount = useRef(parseInt(localStorage.getItem("geoninja_practice_count") || "0"));

  useEffect(() => { registerSW(); }, []);

  const handleStart = useCallback(async () => {
    setMode("daily");
    setScreen("loading");
    const msgs = ["Summoning the ninja…","Preparing your challenge…","Loading questions…"];
    setLoadingMsg(msgs[Math.floor(Math.random() * msgs.length)]);
    const aiQuestions = await fetchAIQuestions();
    setQuestions(aiQuestions || getDailyQuestions());
    setScreen("quiz");
  }, []);

  const handlePractice = useCallback((customPool = null) => {
    const pro = isPro();
    practiceCount.current += 1;
    localStorage.setItem("geoninja_practice_count", practiceCount.current);

    if (!pro && practiceCount.current > 3) {
      // Soft gate — show pro upsell
      if (confirm("You've used your 3 free practice rounds!\n\nGo Ninja Pro ($2.99/mo) for unlimited practice + hard mode.\n\nPress OK to learn more.")) {
        alert("Stripe checkout coming soon! Check back shortly.");
      }
      return;
    }

    setMode("practice");
    setQuestions(customPool || getPracticeQuestions(streakData));
    setScreen("quiz");
  }, [streakData]);

  const handleComplete = useCallback((res) => {
    const score = res.filter(r => r.correct).length;
    if (mode === "daily") {
      const newStreak = saveStreak(score);
      setStreakData(newStreak);
    }
    setResults(res);
    setScreen("results");
  }, [mode]);

  const handleHome = useCallback(() => {
    setScreen("home");
    setStreakData(getStreak());
  }, []);

  return (
    <div style={styles.app}>
      <div style={styles.bgPattern}/>
      {screen === "home"    && <HomeScreen    onStart={handleStart} onPractice={() => handlePractice()} streakData={streakData}/>}
      {screen === "loading" && (
        <div style={styles.loadingScreen}>
          <div style={styles.loadingNinja}>🥷</div>
          <div style={styles.loadingMsg}>{loadingMsg}</div>
          <div style={styles.loadingDots}><span>.</span><span>.</span><span>.</span></div>
        </div>
      )}
      {screen === "quiz"    && <QuizScreen    questions={questions} onComplete={handleComplete} mode={mode}/>}
      {screen === "results" && <ResultsScreen results={results} streakData={streakData} onHome={handleHome} onPractice={handlePractice} mode={mode}/>}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  app:{ minHeight:"100vh", background:"#0a0e1a", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Segoe UI',system-ui,sans-serif", position:"relative", overflow:"hidden" },
  bgPattern:{ position:"fixed", inset:0, background:"radial-gradient(ellipse at 20% 20%,rgba(99,102,241,.15) 0%,transparent 50%),radial-gradient(ellipse at 80% 80%,rgba(16,185,129,.1) 0%,transparent 50%)", pointerEvents:"none" },
  screen:{ width:"100%", maxWidth:420, minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px 20px", boxSizing:"border-box", position:"relative", zIndex:1 },
  homeContent:{ width:"100%", display:"flex", flexDirection:"column", gap:16 },
  logoWrap:{ textAlign:"center", marginBottom:4 },
  logoHeading:{ margin:0 },
  logoImage:{ width:"min(100%, 320px)", height:"auto", display:"block", margin:"0 auto 12px", filter:"drop-shadow(0 12px 24px rgba(0,0,0,.35))" },
  tagline:{ color:"#64748b", fontSize:14, margin:"8px 0 0", letterSpacing:"0.3px" },
  streakBadge:{ display:"flex", alignItems:"center", gap:12, background:"rgba(251,191,36,.1)", border:"1px solid rgba(251,191,36,.25)", borderRadius:14, padding:"14px 18px" },
  fireEmoji:{ fontSize:28 },
  streakNum:{ fontSize:18, fontWeight:700, color:"#fbbf24" },
  streakSub:{ fontSize:12, color:"#64748b" },
  homeShieldBadge:{ marginLeft:"auto", color:"#60a5fa", fontSize:12, fontWeight:700, background:"rgba(96,165,250,.15)", border:"1px solid #60a5fa", borderRadius:999, padding:"4px 8px" },
  rankCard:{ display:"flex", alignItems:"center", gap:12, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:14, padding:"14px 18px" },
  rankDot:{ width:12, height:12, borderRadius:"50%", flexShrink:0, boxShadow:"0 0 8px currentColor" },
  rankLabel:{ fontSize:11, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.5px" },
  rankName:{ fontSize:16, fontWeight:700, color:"#f1f5f9" },
  rankTotal:{ marginLeft:"auto", fontSize:13, color:"#64748b" },
  alreadyPlayed:{ display:"flex", alignItems:"center", gap:14, background:"rgba(52,211,153,.08)", border:"1px solid rgba(52,211,153,.2)", borderRadius:14, padding:"16px 20px" },
  checkmark:{ fontSize:24, color:"#34d399", fontWeight:700 },
  apTitle:{ fontSize:16, fontWeight:600, color:"#34d399" },
  apSub:{ fontSize:12, color:"#64748b", marginTop:2 },
  startBtn:{ width:"100%", padding:"18px 24px", background:"linear-gradient(135deg,#6366f1,#4f46e5)", border:"none", borderRadius:14, color:"#fff", fontSize:17, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10, boxShadow:"0 4px 24px rgba(99,102,241,.4)", letterSpacing:"0.2px" },
  practiceBtn:{ width:"100%", padding:"14px 20px", background:"rgba(99,102,241,.08)", border:"1.5px solid rgba(99,102,241,.3)", borderRadius:14, color:"#a5b4fc", fontSize:15, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 },
  proBtn:{ width:"100%", padding:"14px", background:"linear-gradient(135deg,#7c3aed,#6366f1)", border:"none", borderRadius:14, color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 20px rgba(124,58,237,.35)" },
  btnArrow:{ fontSize:20 },
  statsRow:{ display:"flex", alignItems:"center", background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.06)", borderRadius:14, padding:"16px 0" },
  statItem:{ flex:1, textAlign:"center" },
  statNum:{ fontSize:22, fontWeight:700, color:"#f1f5f9" },
  statLabel:{ fontSize:11, color:"#64748b", marginTop:2, textTransform:"uppercase", letterSpacing:"0.4px" },
  statDivider:{ width:1, height:36, background:"rgba(255,255,255,.08)" },
  quizContent:{ width:"100%", display:"flex", flexDirection:"column", gap:18 },
  quizHeader:{ display:"flex", alignItems:"center", gap:12 },
  questionCount:{ fontSize:13, color:"#64748b", fontWeight:600, minWidth:36 },
  progressBar:{ flex:1, height:6, background:"rgba(255,255,255,.08)", borderRadius:99, overflow:"hidden" },
  progressFill:{ height:"100%", background:"linear-gradient(90deg,#6366f1,#34d399)", borderRadius:99, transition:"width 0.4s ease" },
  questionCard:{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:20, padding:"24px 20px", textAlign:"center" },
  questionEmoji:{ fontSize:52, marginBottom:12, display:"block" },
  flagImg:{ width:120, height:"auto", borderRadius:6, marginBottom:12, boxShadow:"0 2px 12px rgba(0,0,0,.4)" },
  questionType:{ fontSize:10, fontWeight:700, color:"#6366f1", letterSpacing:"1.5px", marginBottom:12, textTransform:"uppercase" },
  questionText:{ fontSize:18, fontWeight:600, color:"#f1f5f9", lineHeight:1.4 },
  optionsGrid:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 },
  optionBtn:{ padding:"16px 12px", background:"rgba(255,255,255,.05)", border:"1.5px solid rgba(255,255,255,.1)", borderRadius:12, color:"#e2e8f0", fontSize:14, fontWeight:600, cursor:"pointer", transition:"all 0.15s", lineHeight:1.3 },
  optionCorrect:{ background:"rgba(52,211,153,.15)", border:"1.5px solid #34d399", color:"#34d399" },
  optionWrong:{ background:"rgba(248,113,113,.15)", border:"1.5px solid #f87171", color:"#f87171" },
  optionDimmed:{ opacity:0.35 },
  optionTick:{ color:"#34d399" },
  optionX:{ color:"#f87171" },
  feedback:{ padding:"14px 18px", borderRadius:12, border:"1px solid", fontSize:15, fontWeight:600, color:"#f1f5f9", textAlign:"center" },
  funFactBox:{ padding:"14px 16px", borderRadius:12, border:"1px solid rgba(148,163,184,.2)", background:"rgba(148,163,184,.05)", fontSize:13, color:"#94a3b8", fontStyle:"italic", lineHeight:1.5, textAlign:"center" },
  resultsContent:{ width:"100%", display:"flex", flexDirection:"column", alignItems:"center", gap:16 },
  resultsMedal:{ fontSize:64, filter:"drop-shadow(0 0 20px rgba(251,191,36,.4))" },
  resultsTitle:{ fontSize:28, fontWeight:800, color:"#f1f5f9", margin:0 },
  scoreCircle:{ width:110, height:110, borderRadius:"50%", border:"3px solid #6366f1", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"rgba(99,102,241,.1)", boxShadow:"0 0 32px rgba(99,102,241,.3)" },
  scoreNum:{ fontSize:26, fontWeight:800, color:"#f1f5f9" },
  scorePct:{ fontSize:13, color:"#6366f1", fontWeight:600 },
  streakRow:{ display:"flex", alignItems:"center", gap:8 },
  streakBig:{ fontSize:18, fontWeight:700, color:"#fbbf24" },
  breakdown:{ width:"100%", display:"flex", flexDirection:"column", gap:8, background:"rgba(255,255,255,.03)", borderRadius:14, padding:"14px 16px", border:"1px solid rgba(255,255,255,.06)" },
  breakdownItem:{ display:"flex", alignItems:"center", gap:10, fontSize:13 },
  bCorrect:{ color:"#34d399", fontWeight:700, fontSize:15 },
  bWrong:{ color:"#f87171", fontWeight:700, fontSize:15 },
  bText:{ color:"#94a3b8", flex:1 },
  bAnswer:{ color:"#6366f1", fontWeight:600, fontSize:12 },
  shareBtn:{ width:"100%", padding:"16px", background:"linear-gradient(135deg,#6366f1,#4f46e5)", border:"none", borderRadius:14, color:"#fff", fontSize:16, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 20px rgba(99,102,241,.35)" },
  homeBtn:{ width:"100%", padding:"14px", background:"transparent", border:"1.5px solid rgba(255,255,255,.1)", borderRadius:14, color:"#94a3b8", fontSize:15, fontWeight:600, cursor:"pointer" },
  comeTomorrow:{ fontSize:12, color:"#475569", textAlign:"center" },
  emailCapture:{ width:"100%", background:"rgba(251,191,36,.08)", border:"1px solid rgba(251,191,36,.25)", borderRadius:14, padding:"16px", display:"flex", flexDirection:"column", gap:8 },
  emailTitle:{ fontSize:15, fontWeight:700, color:"#fbbf24" },
  emailSub:{ fontSize:12, color:"#64748b" },
  emailRow:{ display:"flex", gap:8 },
  emailInput:{ flex:1, padding:"10px 14px", background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.12)", borderRadius:10, color:"#f1f5f9", fontSize:14, outline:"none" },
  emailBtn:{ padding:"10px 16px", background:"#fbbf24", border:"none", borderRadius:10, color:"#0a0e1a", fontWeight:700, fontSize:14, cursor:"pointer" },
  emailMsg:{ fontSize:12, color:"#34d399" },
  emailSavedBadge:{ fontSize:13, color:"#34d399", fontWeight:600, textAlign:"center", padding:"10px", background:"rgba(52,211,153,.08)", borderRadius:10, width:"100%" },
  loadingScreen:{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"100vh", gap:16 },
  loadingNinja:{ fontSize:72, filter:"drop-shadow(0 0 24px rgba(99,102,241,.6))" },
  loadingMsg:{ fontSize:18, fontWeight:600, color:"#94a3b8", letterSpacing:"0.3px" },
  loadingDots:{ fontSize:32, color:"#6366f1", letterSpacing:4 },
};

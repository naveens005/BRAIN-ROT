# 🛡️ FocusGuard — Attention Fragmentation Detection & Reversal

> A scientific, privacy-first system to help students and knowledge workers detect early patterns of attention fragmentation caused by short-form digital overconsumption and systematically reverse them.

```
   ███████╗ ██████╗  ██████╗██╗   ██╗███████╗ ██████╗ ██╗   ██╗ █████╗ ██████╗ ██████╗ 
   ██╔════╝██╔═══██╗██╔════╝██║   ██║██╔════╝██╔════╝ ██║   ██║██╔══██╗██╔══██╗██╔══██╗
   █████╗  ██║   ██║██║     ██║   ██║███████╗██║  ███╗██║   ██║███████║██████╔╝██║  ██║
   ██╔══╝  ██║   ██║██║     ██║   ██║╚════██║██║   ██║██║   ██║██╔══██║██╔══██╗██║  ██║
   ██║     ╚██████╔╝╚██████╗╚██████╔╝███████║╚██████╔╝╚██████╔╝██║  ██║██║  ██║██████╔╝
   ╚═╝      ╚═════╝  ╚═════╝ ╚═════╝ ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ 
                      Cognitive Science & Habit Analytics Platform
```

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Scoring Tests](https://img.shields.io/badge/Scoring%20Tests-100%25%20Passing-emerald.svg)](./packages/scoring/test/scoring.test.ts)
[![Compliance: DPDP Act 2023](https://img.shields.io/badge/Compliance-DPDP%20Act%202023-purple.svg)](./docs/THREAT_MODEL.md)
[![Localization](https://img.shields.io/badge/i18n-English%20%7C%20%E0%AE%A4%E0%AE%AE%E0%AE%BF%E0%AE%B4%E0%AF%8D-cyan.svg)](./apps/mobile/src/i18n)

---

## 🔬 Core Mission & Guardrails

FocusGuard is built upon three empirical sources of truth:
1. **Passive Telemetry:** Android `UsageStatsManager` / `UsageEvents` measuring total screen exposure, short-form video minutes, task-switching frequency (app switches/hr), and late-night pickups (00:00–05:00).
2. **Active Cognitive Tasks:** Six mobile-optimized tasks measuring Sustained Attention, Reaction Time Consistency, Cognitive Error Rates, Impulse Inhibition, Mental Fatigue Slopes, and Focus Session Completion.
3. **Subjective Reflection:** Weekly 60-second check-in combining standardized Cognitive Failures Questionnaire (CFQ) items with an empirical Reading-Focus distraction latency timer.

### Hard Ethical Guardrails
- **Self-Awareness, Not Diagnosis:** "Brain rot" is an informal cultural term, not a clinical disorder. FocusGuard never diagnoses ADHD or claims "% cognitive decline". Disclaimers are displayed prominently.
- **Personal 14-Day Baseline ($Z$-Scores via Median/MAD):** Scores are computed relative to the user's personal rolling baseline. The app displays `"Calibrating (Day X/14)"` until a 14-day history is formed.
- **100% Explainable:** Every risk calculation reveals the top 3 contributing factors with real raw units.
- **Local-First Privacy:** All raw sensor data and cognitive reaction times remain in encrypted local SQLite (`SQLCipher` / AES-256). Zero third-party tracking or ad SDKs.

---

## 📂 Monorepo Structure

```
focusguard/
├── apps/
│   ├── mobile/         # React Native + Custom Kotlin Android Modules (UsageStats, Notifications, WorkManager)
│   └── web/            # Read-only Companion Dashboard (React + Vite + Tailwind)
├── packages/
│   └── scoring/        # Isomorphic TypeScript Scoring Engine (Median, MAD, Winsorization, 14-day rolling baseline)
├── services/
│   └── api/            # Optional FastAPI + PostgreSQL backend (Zero-knowledge E2EE sync, DPDP account erasure)
└── docs/               # Scientific Validation Protocol, Permissions Rationale, Threat Model
```

---

## 🧠 The Six Validated Cognitive Tasks

| Test | Paradigm | Metric Measured |
|---|---|---|
| **1. Continuous Performance Task (CPT)** | Rapid shape stream target detection | Hit Rate, Lapses, $d'$ Sensitivity |
| **2. Psychomotor Vigilance Task (PVT)** | Random ISI millisecond counter reaction | Mean RT, Reaction Time CV, Lapses $>500$ ms |
| **3. Stroop & 2-Back Interference** | Color-word semantic conflict | Interference Error Rate, Inhibition Cost |
| **4. Go / No-Go & Delay Discounting** | Pre-potent motor inhibition + choice delay | Commission Errors on No-Go, Discount Rate $k$ |
| **5. Vigilance Decrement** | Line orientation discrimination across blocks | Slope of reaction time decline over time-on-task |
| **6. In-App Focus Session** | Dedicated countdown timer | Uninterrupted duration, Task Completion Rate |

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- Python 3.10+ (for optional FastAPI backend)

### Build & Run Tests
```bash
# 1. Install dependencies in scoring package
cd packages/scoring
npm install
npm test            # Runs 11 Vitest unit & simulation tests (100% pass)
npm run build       # Compiles TypeScript declarations

# 2. Build Web Companion Dashboard
cd ../../apps/web
npm install
npm run build       # Compiles static production bundle
npm run dev         # Starts local development server on http://localhost:5173
```

---

## 🌐 Localization (English & தமிழ்)

FocusGuard supports complete localization from day one:
- **English (`en`)**
- **Tamil (`ta` / தமிழ்)**

Language preference can be toggled instantly from the dashboard header or user settings.

---

## 📜 Regulatory Compliance & License

- **India's DPDP Act 2023**: Granular consent, purpose limitation, zero-knowledge sync, and 1-click complete data erasure.
- **GDPR**: Privacy by design, Article 15 Data Portability (JSON export), Article 17 Right to Erasure.
- **License**: [MIT License](./LICENSE)

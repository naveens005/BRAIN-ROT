# FocusGuard Pilot Validation Study Protocol

## 1. Study Title & Objective
**Title:** Longitudinal Validation of the FocusGuard Rot Risk Index Against Standardized Cognitive Failure and Digital Overuse Measures in Young Adults.  
**Primary Objective:** To determine whether the FocusGuard Rot Risk Index (0-100), calculated using robust personal baseline normalization ($Z$-scores via Median/MAD) across passive mobile telemetry and 6 active cognitive tasks, exhibits statistically significant concordance with validated psychological instruments.

---

## 2. Participant Cohort & Inclusion Criteria
- **Sample Size:** 25–30 volunteers (university students and early-career knowledge professionals, aged 18–28).
- **Duration:** 4 weeks (28 consecutive days).
  - *Phase 1 (Days 1–14):* Calibration baseline period.
  - *Phase 2 (Days 15–28):* Active monitoring and guided habit reversal interventions.
- **Inclusion Criteria:**
  - Primary Android smartphone user (>3 hours self-reported daily screen time).
  - Willingness to complete brief daily cognitive tasks (3–5 min total).
  - Informed digital consent provided under India's Digital Personal Data Protection (DPDP) Act 2023.

---

## 3. Reference Validation Instruments
1. **Cognitive Failures Questionnaire (CFQ-25)**: Administered on Day 1, Day 14, and Day 28 to measure self-reported lapses in perception, memory, and motor control.
2. **Bergen Social Media Addiction Scale (BSMAS)**: Evaluates core components of problematic digital consumption (salience, mood modification, tolerance, withdrawal, conflict, relapse).
3. **Pittsburgh Sleep Quality Index (PSQI)**: Evaluates sleep latency and subjective sleep quality, cross-referenced with FocusGuard's late-night usage sensor (00:00–05:00).

---

## 4. Key Hypotheses & Statistical Analysis Plan
- **Hypothesis 1 (Convergent Validity):** A higher FocusGuard Rot Risk Index during Days 15–28 will demonstrate a strong positive Pearson correlation ($r \ge 0.50$, $p < 0.01$) with CFQ-25 total scores.
- **Hypothesis 2 (Sensitivity to Sleep Deprivation):** Participants exhibiting late-night phone pickups (>60 min past midnight) will demonstrate statistically significant elevation in Psychomotor Vigilance Task (PVT) reaction time coefficient of variation ($t$-test, $p < 0.05$) and lapse count ($>500$ ms).
- **Hypothesis 3 (Intervention Efficacy):** Daily engagement with FocusGuard's habit reversal interventions (scheduled box breathing pauses and bedtime digital-free zones) will yield a statistically significant reduction in 4th-week app-switching frequency ($p < 0.05$).

---

## 5. Ethical Protections & Data Sovereignty
- **Voluntary & Non-Punitive:** Participants may withdraw at any time.
- **On-Device Cryptographic Sovereignty:** All telemetry remains encrypted on the participant's device (`SQLCipher` / AES-256). Study exports are anonymized with cryptographic research tokens.
- **Provisional Thresholds Disclaimer:** The application transparently displays a disclaimer stating that risk index thresholds are provisional research constructs undergoing continuous scientific refinement.

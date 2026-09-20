# FocusGuard Threat Model & Security Specification

This document details the threat modeling (STRIDE methodology) and regulatory compliance controls (India's DPDP Act 2023 and GDPR) implemented across the FocusGuard ecosystem.

---

## 1. System Assets & Boundaries
- **Asset A (Device Raw Telemetry):** Precise millisecond-level app foreground/background timestamps and reaction time logs.
- **Asset B (Personal Baseline Model):** Rolling 14-day median, MAD, and personal cognitive vulnerability factors.
- **Asset C (User Export Archive):** Local decrypted JSON exports generated for user data sovereignty.

---

## 2. STRIDE Threat Analysis & Mitigations

| STRIDE Threat | Potential Vulnerability | FocusGuard Architectural Mitigation |
|---|---|---|
| **Spoofing** | Malicious app attempts to inject fraudulent sensor logs into local DB | Database is stored in sandboxed app storage using SQLCipher AES-256 with key derived from Android KeyStore Hardware-Backed Master Key (`KeyGenParameterSpec`). |
| **Tampering** | Interception or modification of cloud sync payloads | Zero-knowledge end-to-end encryption (E2EE) using AES-GCM-256 with client-generated cryptographic keys. Server has zero decryption capability. |
| **Repudiation** | User questions accuracy of high risk scores | Full explainability trace: every score is mathematically linked to specific raw metrics with exact baseline comparison deltas. |
| **Information Disclosure** | Third-party analytics or crash reporting SDKs exfiltrating usage habits | **Zero third-party trackers or ad SDKs included in codebase.** No Firebase Analytics, no Facebook SDK, no Google Ads. |
| **Denial of Service** | Corrupted database or malformed usage event causing continuous app crash | SQLite migrations are atomic; scoring engine employs robust Winsorization ($[-3.0, +3.0]$) and handles empty/missing sensor inputs without throwing runtime exceptions. |
| **Elevation of Privilege** | Malicious app attempting to read NotificationListenerService stream | Listener extracts solely numerical counter increments (`prefs.putInt(today, count + 1)`); notification message bodies are discarded in-memory immediately. |

---

## 3. Regulatory Compliance: DPDP Act 2023 & GDPR

### India's Digital Personal Data Protection Act 2023
- **Section 6 (Consent Notice):** Clear, itemized, plain-language consent presented in both English and Tamil before requesting Android Usage Access.
- **Section 8 (Data Minimization & Erasure):** Raw event logs older than 30 days are automatically purged from local device storage.
- **Right to Grievance Redressal & Erasure:** 1-click in-app *"Erase All Data"* action immediately drops SQLite tables and wipes shared preferences.

### General Data Protection Regulation (GDPR)
- **Article 15 (Right of Access):** 1-tap complete data export in standardized JSON format.
- **Article 17 (Right to Erasure):** Local and remote deletion confirmed with zero-residual tombstoning.
- **Article 25 (Privacy by Design and by Default):** Local-first architecture ensures 100% core functionality remains offline with zero mandatory server connectivity.

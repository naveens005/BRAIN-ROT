# FocusGuard Android Permissions Rationale & Security Architecture

FocusGuard is built on a strict **principle of data minimization**. We request only the bare minimum Android system permissions necessary to observe objective behavioral patterns, with zero access to your private conversations, browsing history, or media files.

---

## 1. `PACKAGE_USAGE_STATS` (Android Usage Access)
- **Official System Capability:** Managed under `Settings.ACTION_USAGE_ACCESS_SETTINGS`.
- **Why We Need It:**
  1. To calculate total daily screen time and passive video consumption.
  2. To compute task-switching frequency (number of times you transition between apps per hour), which serves as a proxy for attention fragmentation.
  3. To identify late-night screen exposure between 00:00 and 05:00.
- **What We CANNOT See:**
  - FocusGuard **never** reads screen content, keystrokes, messages, or web page URLs. We only receive system event timestamps (e.g. `App X entered foreground at 14:02:15`).
- **If You Deny This Permission:**
  - The app continues to operate. You can log focus sessions manually, and all 6 cognitive assessment tasks remain 100% accessible.

---

## 2. `BIND_NOTIFICATION_LISTENER_SERVICE` (Notification Volume Listener)
- **Official System Capability:** Notification Access settings.
- **Why We Need It:**
  - To quantify incoming notification volume spikes and analyze whether frequent alert barrages correlate with reaction time lapses on your cognitive tests.
- **Privacy Protections:**
  - Our code captures **only an integer counter** (e.g., `notificationCount + 1`).
  - We explicitly discard notification titles, message bodies, sender names, and icons.
- **If You Deny This Permission:**
  - Notification counts are omitted from the passive habit model without affecting other scores.

---

## 3. Battery & Doze Optimization (`WorkManager`)
- FocusGuard executes heavy 24-hour aggregations via Android Jetpack `WorkManager` when the device is idle or charging overnight.
- Daily battery consumption is rigorously budgeted at **under 2% per 24 hours**.

---

## 4. Permissions Summary Table

| Permission | Android Level | Sensitive Data Accessed? | Revocable at Any Time? |
|---|---|---|---|
| `PACKAGE_USAGE_STATS` | Special App Access | NO (Timestamps & package names only) | YES (Settings ➔ Special Access) |
| Notification Listener | Special App Access | NO (Integer counter only) | YES (Settings ➔ Notification Access) |
| Location | NOT REQUESTED | — | — |
| Contacts / Phone | NOT REQUESTED | — | — |
| Camera / Mic | NOT REQUESTED | — | — |

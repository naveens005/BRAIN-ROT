export interface DailyUsageRecord {
  id: string;
  date: string;
  totalScreenTimeMinutes: number;
  shortFormVideoMinutes: number;
  socialMediaMinutes: number;
  gamingMinutes: number;
  messagingMinutes: number;
  unlockCount: number;
  longestSessionMinutes: number;
  appSwitchesPerHour: number;
  lateNightUsageMinutes: number;
  notificationCount: number;
  createdAt: number;
}

export interface CognitiveSessionRecord {
  id: string;
  testType: string;
  startedAt: number;
  endedAt: number;
  rawMetric1: number;
  rawMetric2: number;
  jankDiscardedTrials: number;
  totalTrials: number;
  deviceFps: number;
  metadataJson?: string;
}

export interface FocusSessionRecord {
  id: string;
  targetTask: string;
  plannedMinutes: number;
  actualSeconds: number;
  completedWithoutExit: boolean;
  interruptionCount: number;
  createdAt: number;
}

export interface WeeklyCheckinRecord {
  id: string;
  date: string;
  emotionalStateScore: number;
  urgeToCheckScore: number;
  memorySlipCount: number;
  readingPassageId?: string;
  readingInterruptedTimeMs?: number;
  cfqScore: number;
  createdAt: number;
}

// In-memory / persistent mockable local storage contract compatible with SQLite / Expo SQLite
class FocusGuardDatabase {
  private usageTable: Map<string, DailyUsageRecord> = new Map();
  private cognitiveTable: Map<string, CognitiveSessionRecord> = new Map();
  private focusTable: Map<string, FocusSessionRecord> = new Map();
  private checkinTable: Map<string, WeeklyCheckinRecord> = new Map();
  private isInitialized = false;

  async init(): Promise<void> {
    if (this.isInitialized) return;
    try {
      if (typeof localStorage !== 'undefined') {
        const usageData = localStorage.getItem('focusguard_db_usage');
        if (usageData) {
          const arr: DailyUsageRecord[] = JSON.parse(usageData);
          arr.forEach((item) => this.usageTable.set(item.date, item));
        }
      }
    } catch {
      // Memory fallback
    }
    this.isInitialized = true;
  }

  async saveDailyUsage(record: DailyUsageRecord): Promise<void> {
    await this.init();
    this.usageTable.set(record.date, record);
    this.persist('usage', Array.from(this.usageTable.values()));
  }

  async getDailyUsageHistory(days: number = 30): Promise<DailyUsageRecord[]> {
    await this.init();
    return Array.from(this.usageTable.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-days);
  }

  async saveCognitiveSession(record: CognitiveSessionRecord): Promise<void> {
    await this.init();
    this.cognitiveTable.set(record.id, record);
    this.persist('cognitive', Array.from(this.cognitiveTable.values()));
  }

  async getCognitiveSessions(testType?: string): Promise<CognitiveSessionRecord[]> {
    await this.init();
    const all = Array.from(this.cognitiveTable.values());
    if (testType) {
      return all.filter((s) => s.testType === testType);
    }
    return all;
  }

  async saveFocusSession(record: FocusSessionRecord): Promise<void> {
    await this.init();
    this.focusTable.set(record.id, record);
    this.persist('focus', Array.from(this.focusTable.values()));
  }

  async saveWeeklyCheckin(record: WeeklyCheckinRecord): Promise<void> {
    await this.init();
    this.checkinTable.set(record.id, record);
    this.persist('checkin', Array.from(this.checkinTable.values()));
  }

  async exportAllDataAsJson(): Promise<string> {
    await this.init();
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
        usage: Array.from(this.usageTable.values()),
        cognitiveSessions: Array.from(this.cognitiveTable.values()),
        focusSessions: Array.from(this.focusTable.values()),
        weeklyCheckins: Array.from(this.checkinTable.values()),
      },
      null,
      2
    );
  }

  async wipeAllData(): Promise<void> {
    this.usageTable.clear();
    this.cognitiveTable.clear();
    this.focusTable.clear();
    this.checkinTable.clear();
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('focusguard_db_usage');
        localStorage.removeItem('focusguard_db_cognitive');
        localStorage.removeItem('focusguard_db_focus');
        localStorage.removeItem('focusguard_db_checkin');
      }
    } catch {
      // Ignored
    }
  }

  private persist(key: string, data: unknown): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(`focusguard_db_${key}`, JSON.stringify(data));
      }
    } catch {
      // In-memory only
    }
  }
}

export const db = new FocusGuardDatabase();

export interface TreatmentSummary {
    expected: number;
    taken: number;
    perfect: boolean;
    missedDays: { date: string; missed: number; expected: number }[];
    dismissed: boolean;
}

export interface DayAdherence {
    date: string;
    expected: number;
    taken: number;
}

export interface MedicationHistory {
    medicationId: number;
    startDate: string;
    endDate: string | null;
    days: DayAdherence[];
    expected: number;
    taken: number;
}

export interface Medication {
id: string;
    name: string;
    dosage: string;
    category: 'pill' | 'drop' | 'vitamin';
    form?: string | null;
    color?: string | null;
    scheduleType: 'fixed' | 'interval' | 'weekly';
    intervalHours: number | null;
    fixedTime: string | null;
    daysOfWeek?: number[] | null;
    lastTakenAt?: string | null;
    nextDoseAt?: string;
    durationDays?: number | null;
    completed?: boolean;
    treatmentSummary?: TreatmentSummary | null;
    today?: { expected: number; taken: number };
}
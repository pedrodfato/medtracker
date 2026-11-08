export interface TreatmentSummary {
    expected: number;
    taken: number;
    perfect: boolean;
    missedDays: { date: string; missed: number; expected: number }[];
    dismissed: boolean;
}

export interface Medication {
id: string;
    name: string;
    dosage: string;
    category: 'pill' | 'drop' | 'vitamin';
    scheduleType: 'fixed' | 'interval' | 'weekly';
    intervalHours: number | null;
    fixedTime: string | null;
    daysOfWeek?: number[] | null;
    lastTakenAt?: string | null;
    nextDoseAt?: string;
    durationDays?: number | null;
    completed?: boolean;
    treatmentSummary?: TreatmentSummary | null;
}
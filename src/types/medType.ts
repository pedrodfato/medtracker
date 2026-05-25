export interface Medication {
id: string;
    name: string;
    dosage: string;
    category: 'pill' | 'drop' | 'vitamin';
    scheduleType: 'fixed' | 'interval';
    intervalHours: number | null;
    fixedTime: string | null;
    nextDoseAt?: string; 
}
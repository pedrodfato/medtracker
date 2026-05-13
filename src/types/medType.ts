export interface Medication {
  nextDoseAt: string | number | Date;
  id: string;
  name: string;
  dosage: string;
  totalPills: number;
  frequencyHours: number;
  startDate: Date;
  category: "pills" | "liquids" | "other";
}
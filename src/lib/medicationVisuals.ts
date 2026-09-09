export type MedicationCategory = 'pill' | 'drop' | 'vitamin';

const VISUALS: Record<MedicationCategory, { emoji: string; bgClass: string }> = {
  pill: { emoji: '💊', bgClass: 'bg-blue-100' },
  drop: { emoji: '💧', bgClass: 'bg-orange-100' },
  vitamin: { emoji: '☀️', bgClass: 'bg-yellow-100' },
};

export function getMedicationVisual(category: MedicationCategory) {
  return VISUALS[category];
}

import type { Medication } from "../types/medType";
import { getMedicationVisual, type MedicationCategory } from "../lib/medicationVisuals";

type Props = {
    medications: Medication[];
    selectedId: string | null;
    onSelect: (id: string) => void;
};

type TodayStatus = "done" | "partial" | "pending" | "off";

function todayStatus(med: Medication): TodayStatus {
    const expected = med.today?.expected ?? 0;
    const taken = med.today?.taken ?? 0;
    if (expected === 0) return "off";
    if (taken >= expected) return "done";
    if (taken > 0) return "partial";
    return "pending";
}

export function TodayStrip({ medications, selectedId, onSelect }: Props) {
    const active = medications.filter((m) => !m.completed);
    const completed = medications.filter((m) => m.completed);
    const scheduledToday = active.filter((m) => todayStatus(m) !== "off");
    const doneToday = scheduledToday.filter((m) => todayStatus(m) === "done");

    const renderItem = (med: Medication, isCompleted: boolean) => {
        const visual = getMedicationVisual(med.category as MedicationCategory);
        const status = todayStatus(med);
        const isSelected = String(med.id) === String(selectedId);
        const tone = isCompleted
            ? `${visual.bgClass} opacity-60`
            : status === "done" || status === "partial"
                ? visual.bgClass
                : status === "pending"
                    ? "bg-gray-200 grayscale"
                    : "bg-gray-100 grayscale opacity-50";

        return (
            <button
                key={med.id}
                type="button"
                onClick={() => onSelect(med.id)}
                aria-pressed={isSelected}
                className="flex flex-col items-center gap-1 w-16 shrink-0"
            >
                <div
                    className={`relative w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border-2 transition-colors ${
                        isSelected ? "border-primary" : "border-transparent"
                    } ${tone}`}
                >
                    {visual.emoji}
                    {!isCompleted && status === "partial" && med.today && (
                        <span className="absolute -top-1.5 -right-1.5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                            {med.today.taken}/{med.today.expected}
                        </span>
                    )}
                </div>
                <span className="w-full truncate text-center text-xs text-gray-700">{med.name}</span>
                {isCompleted ? (
                    <span className="text-[10px] text-green-700">Concluído</span>
                ) : status === "off" ? (
                    <span className="text-[10px] text-gray-400">sem dose hoje</span>
                ) : null}
            </button>
        );
    };

    return (
        <section className="p-4 rounded-[24px] bg-white/70 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col gap-3 text-start">
            <h2 className="text-lg font-semibold text-gray-900">
                Hoje{" "}
                <span className="text-sm font-normal text-gray-500">
                    · {doneToday.length} de {scheduledToday.length} tomados
                </span>
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-1">
                {active.map((med) => renderItem(med, false))}
                {active.length > 0 && completed.length > 0 && (
                    <div className="w-px self-stretch bg-gray-200 shrink-0" aria-hidden="true" />
                )}
                {completed.map((med) => renderItem(med, true))}
            </div>
        </section>
    );
}

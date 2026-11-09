import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { Medication } from "../types/medType";
import { MedicationIcon } from "./medicationIcon";
import { appearanceOf } from "../lib/medicationAppearance";
import { GlassCard } from "./glassCard";

function timeOf(med: Medication): string {
    if (med.scheduleType !== "interval" && med.fixedTime) return med.fixedTime;
    if (med.nextDoseAt) {
        return new Date(med.nextDoseAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    }
    return "—";
}

function statusOf(med: Medication): { label: string; className: string } {
    const expected = med.today?.expected ?? 0;
    const taken = med.today?.taken ?? 0;
    if (taken >= expected) return { label: "Tomado", className: "bg-emerald-100 text-emerald-700" };
    if (taken > 0) return { label: `${taken}/${expected}`, className: "bg-primary/25 text-[#4d6b00]" };
    return { label: "Pendente", className: "bg-gray-900/5 text-gray-600" };
}

type Props = { medications: Medication[]; className?: string };

export function TodaySchedule({ medications, className }: Props) {
    const items = medications
        .filter((m) => !m.completed && (m.today?.expected ?? 0) > 0)
        .map((m) => ({ med: m, time: timeOf(m) }))
        .sort((a, b) => a.time.localeCompare(b.time));

    return (
        <GlassCard className={cn("flex flex-col gap-3 text-start", className)}>
            <div className="flex items-center justify-between">
                <h2 className="m-0 text-lg font-semibold text-gray-900">Agenda de hoje</h2>
                <Link to="/list" className="text-sm font-medium text-gray-500 hover:text-gray-900">Ver todos</Link>
            </div>
            {items.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhuma dose prevista para hoje.</p>
            ) : (
                <ul className="flex flex-col divide-y divide-gray-900/5">
                    {items.map(({ med, time }) => {
                        const status = statusOf(med);
                        return (
                            <li key={med.id} className="flex items-center gap-3 py-3">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/80">
                                    <MedicationIcon {...appearanceOf(med)} size={34} />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-gray-900">{med.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {med.dosage}
                                        {med.scheduleType === "interval" && med.intervalHours ? ` · a cada ${med.intervalHours}h` : ""}
                                    </p>
                                </div>
                                <span className="text-sm font-medium tabular-nums text-gray-700">{time}</span>
                                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>{status.label}</span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </GlassCard>
    );
}

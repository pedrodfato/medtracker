import { cn } from "@/lib/utils";
import type { Medication } from "../types/medType";
import { useMedicationHistory } from "../hooks/useMedicationHistory";
import { AdherenceHeatmap } from "./adherenceHeatmap";
import { GlassCard } from "./glassCard";

type Props = { medication: Medication | null; selectedId: string | null; className?: string };

export function HistoryCard({ medication, selectedId, className }: Props) {
    const { history, failed } = useMedicationHistory(selectedId);
    return (
        <GlassCard className={cn("flex flex-col gap-3 text-start", className)}>
            <h2 className="m-0 text-lg font-semibold text-gray-900">
                Histórico{medication ? ` · ${medication.name}` : ""}
            </h2>
            {failed ? (
                <p className="text-sm text-gray-500">Não foi possível carregar o histórico.</p>
            ) : history ? (
                <AdherenceHeatmap key={history.medicationId} days={history.days} expected={history.expected} taken={history.taken} />
            ) : (
                <p className="text-sm text-gray-500">Carregando...</p>
            )}
        </GlassCard>
    );
}

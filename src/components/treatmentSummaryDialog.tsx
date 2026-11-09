import type { TreatmentSummary } from "../types/medType";
import { Button } from "./button";

type Props = {
    medicationName: string;
    summary: TreatmentSummary;
    isDismissing: boolean;
    onDismiss: () => void;
};

const formatDay = (date: string) =>
    new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" });

export function TreatmentSummaryDialog({ medicationName, summary, isDismissing, onDismiss }: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30 backdrop-blur-sm p-6">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="treatment-summary-title"
                className="w-full max-w-sm max-h-[85vh] overflow-y-auto glass-strong rounded-[24px] p-6 flex flex-col gap-4"
            >
                <h2 id="treatment-summary-title" className="m-0 text-lg font-semibold text-gray-900">
                    Tratamento concluído: {medicationName}
                </h2>

                <div className="rounded-2xl bg-white/60 p-4 text-center">
                    <p className="text-4xl font-semibold text-gray-900">
                        {summary.taken}/{summary.expected}
                    </p>
                    <p className="text-sm text-gray-500">doses tomadas no período</p>
                </div>

                {summary.perfect ? (
                    <p className="text-gray-700">
                        Você tomou o remédio corretamente em todos os dias. Parabéns!
                    </p>
                ) : (
                    <>
                        <p className="text-gray-700">
                            Você não tomou todas as doses. Estes foram os dias com doses perdidas:
                        </p>
                        <ul className="flex flex-col gap-1">
                            {summary.missedDays.map((day) => (
                                <li key={day.date} className="flex justify-between text-sm text-gray-700">
                                    <span className="capitalize">{formatDay(day.date)}</span>
                                    <span className="text-gray-500">
                                        {day.missed} de {day.expected} {day.expected === 1 ? "dose" : "doses"}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                <Button className="w-full" onClick={onDismiss} disabled={isDismissing}>
                    Entendi
                </Button>
            </div>
        </div>
    );
}

import { useEffect, useState } from "react";
import { API_URL } from "../lib/api";
import { getMedicationVisual, type MedicationCategory } from "../lib/medicationVisuals";

type DoseLogEntry = {
    id: number;
    medicationId: number;
    medicationName: string;
    dosage: string;
    category: MedicationCategory;
    takenAt: string;
};

function isSameDay(a: Date, b: Date): boolean {
    return a.toDateString() === b.toDateString();
}

function dayLabel(date: Date, today: Date): string {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (isSameDay(date, today)) return "Hoje";
    if (isSameDay(date, yesterday)) return "Ontem";
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
}

export function Progress() {
    const [doses, setDoses] = useState<DoseLogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDoses = async () => {
            try {
                const response = await fetch(`${API_URL}/doses`, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (!response.ok) throw new Error('Failed to fetch doses');
                const responseData = await response.json();
                setDoses(responseData.data);
            } catch (error) {
                console.error('Error fetching dose history:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadDoses();
    }, []);

    const today = new Date();
    const groups: { label: string; entries: DoseLogEntry[] }[] = [];
    doses.forEach((dose) => {
        const label = dayLabel(new Date(dose.takenAt), today);
        const lastGroup = groups[groups.length - 1];
        if (lastGroup && lastGroup.label === label) {
            lastGroup.entries.push(dose);
        } else {
            groups.push({ label, entries: [dose] });
        }
    });

    return (
        <main className="bg-linear-to-b from-[#eef1f4] to-[#f7f8fa] to-35% min-h-screen p-6 flex flex-col gap-6">
            <h1 className="text-4xl font-heading text-gray-900 mt-8 mb-2 text-start">Progresso</h1>

            {isLoading ? (
                <p className="text-gray-500 text-center">Carregando...</p>
            ) : groups.length === 0 ? (
                <div className="bg-white p-6 rounded-[24px] text-center border border-dashed border-gray-300">
                    <p className="text-gray-500">Nenhuma dose registrada ainda. Toda vez que você confirmar um remédio, ele aparece aqui.</p>
                </div>
            ) : (
                groups.map((group, groupIndex) => (
                    <div key={group.label} className="flex flex-col gap-3">
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{group.label}</h2>
                        <div className="relative flex flex-col gap-4 pl-6">
                            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gray-200" aria-hidden="true" />
                            {group.entries.map((dose, entryIndex) => {
                                const visual = getMedicationVisual(dose.category);
                                const isFirstToday = groupIndex === 0 && entryIndex === 0 && group.label === "Hoje";
                                return (
                                    <div
                                        key={dose.id}
                                        className="relative flex items-center gap-3 animate-in fade-in slide-in-from-left-2"
                                        style={{ animationDelay: `${entryIndex * 60}ms`, animationFillMode: 'backwards' }}
                                    >
                                        <div className="absolute -left-6 top-1/2 -translate-y-1/2 flex items-center justify-center">
                                            {isFirstToday && (
                                                <span className="absolute w-4 h-4 rounded-full bg-primary/40 animate-ping" />
                                            )}
                                            <span className={`relative w-3.5 h-3.5 rounded-full border-2 border-white ${isFirstToday ? 'bg-primary' : 'bg-gray-300'}`} />
                                        </div>
                                        <div className="flex-1 flex items-center gap-3 bg-white/70 rounded-2xl p-3 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                                            <div className={`w-10 h-10 rounded-xl ${visual.bgClass} flex items-center justify-center text-xl shrink-0`}>
                                                {visual.emoji}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900 text-sm">{dose.medicationName}</p>
                                                <p className="text-xs text-gray-500">{dose.dosage}</p>
                                            </div>
                                            <p className="text-sm font-medium text-gray-700">
                                                {new Date(dose.takenAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))
            )}
        </main>
    );
}

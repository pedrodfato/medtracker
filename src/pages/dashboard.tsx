import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Medication } from "../types/medType";
import { API_URL } from "../lib/api";
import { authClient } from "../lib/auth-client";
import { getMedicationVisual, type MedicationCategory } from "../lib/medicationVisuals";

type Stats = {
    currentStreak: number;
    dosesTaken: number;
    weeklyAdherenceRate: number;
    missedDoses: number;
};

export function Dashboard() {
    const navigate = useNavigate();
    const { data: session } = authClient.useSession();
    const [medications, setMedications] = useState<Medication[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);

    const fetchMedications = async () => {
        try {
            const response = await fetch(`${API_URL}/medications`, {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to fetch medications');
            const responseData = await response.json();
            setMedications(responseData.data);
        } catch (error) {
            console.error('Error fetching medications:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch(`${API_URL}/stats`, {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to fetch stats');
            const responseData = await response.json();
            setStats(responseData.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    useEffect(() => {
        fetchMedications();
        fetchStats();
    }, []);

    const nextMedication = medications.length > 0
        ? [...medications].sort((a, b) => {
            if (!a.nextDoseAt) return 1;
            if (!b.nextDoseAt) return -1;
            return new Date(a.nextDoseAt).getTime() - new Date(b.nextDoseAt).getTime();
        })[0]
        : null;

    const handleTakeMedication = async (medId: string) => {
        try {
            await fetch(`${API_URL}/medication/${medId}/take`, {
                method: "POST",
                credentials: 'include',
            });
            fetchMedications();
            fetchStats();
        } catch (error) {
            console.error(error);
        }
    };

    const openReminder = () => {
        if (nextMedication) navigate("/reminder", { state: { medication: nextMedication } });
    };

    const hoursUntilNextDose = nextMedication?.nextDoseAt
        ? Math.max(0, Math.round((new Date(nextMedication.nextDoseAt).getTime() - Date.now()) / (1000 * 60 * 60)))
        : null;

    return (
        <main className="bg-linear-to-b from-[#eef1f4] to-[#f7f8fa] to-35% min-h-screen p-6 gap-5 flex flex-col">
            <h1 className="text-4xl font-heading text-gray-900 mt-8 mb-2 text-start">
                Bom dia, {session?.user?.name ?? "..."}
            </h1>

            <div className="p-4 rounded-[24px] bg-white/70 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col items-start gap-3">
                <h2 className="text-lg font-semibold text-gray-900">Streak de Remédios</h2>
                <div className="w-full flex justify-between text-sm text-gray-600">
                    <span>Sequência Atual</span>
                    <span className="font-medium text-gray-900">{stats?.currentStreak ?? 0} dias</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${Math.min(100, (stats?.currentStreak ?? 0) * 10)}%` }} />
                </div>

                <div className="w-full flex justify-between text-sm text-gray-600">
                    <span>Doses Tomadas</span>
                    <span className="font-medium text-gray-900">{stats?.dosesTaken ?? 0}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${Math.min(100, (stats?.dosesTaken ?? 0))}%` }} />
                </div>

                <div className="w-full flex justify-between text-sm text-gray-600">
                    <span>Próxima Dose em</span>
                    <span className="font-medium text-gray-900">{hoursUntilNextDose !== null ? `${hoursUntilNextDose}h` : "-"}</span>
                </div>
            </div>

            <div className="p-4 rounded-[24px] bg-white/70 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col items-start">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Próxima Dose</h2>
                {nextMedication ? (
                        <>
                        <button onClick={openReminder} className="flex gap-4 items-center mb-4 w-full text-left">
                            <div className={`rounded-2xl p-2 w-20 h-20 flex items-center justify-center shrink-0 text-3xl ${getMedicationVisual(nextMedication.category as MedicationCategory).bgClass}`}>
                                {getMedicationVisual(nextMedication.category as MedicationCategory).emoji}
                            </div>
                            <div className="flex flex-col flex-1 items-start">
                                <h3 className="text-black font-semibold text-2xl">{nextMedication.name}</h3>
                                <div className="flex gap-4 mt-1">
                                    <div>
                                        <p className="text-[#7B7F82] text-xs text-start">Dosagem</p>
                                        <p className="text-gray-800 font-medium text-start text-2xl">{nextMedication.dosage}</p>
                                    </div>
                                    <div>
                                        <p className="text-[#7B7F82] text-xs text-start">Horário</p>
                                        <p className="text-gray-800 font-medium text-start text-2xl">
                                            {nextMedication.nextDoseAt
                                                ? new Date(nextMedication.nextDoseAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                                                : "Aguardando"
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </button>
                        <button
                            onClick={() => handleTakeMedication(nextMedication.id)}
                            className="w-full py-3 bg-[#F2F3F5] hover:bg-[#E5E7EB] text-black font-medium rounded-xl transition-colors active:scale-[0.98]"
                        >
                            Confirmar dose
                        </button>
                        </>
                ) : (
                    <div className="bg-white p-6 rounded-[24px] text-center border border-dashed border-gray-300 w-full">
                        <p className="text-gray-500 mb-4">Você não tem remédios pendentes.</p>
                    </div>
                )}
            </div>

            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Insights de Adesão</h2>
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-[20px] bg-white/70 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                        <p className="text-xs text-gray-500">Adesão da semana</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats?.weeklyAdherenceRate ?? 0}%</p>
                    </div>
                    <div className="p-4 rounded-[20px] bg-white/70 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                        <p className="text-xs text-gray-500">Doses perdidas</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats?.missedDoses ?? 0}</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
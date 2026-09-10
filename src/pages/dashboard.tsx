import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import type { Medication } from "../types/medType";
import { API_URL } from "../lib/api";
import { authClient } from "../lib/auth-client";
import { getMedicationVisual, type MedicationCategory } from "../lib/medicationVisuals";
import { Button } from "../components/button";

type Stats = {
    currentStreak: number;
    dosesTaken: number;
    weeklyAdherenceRate: number;
    missedDoses: number;
    missedByMedication: { medicationId: number; missedCount: number }[];
};

type DashboardStats = {
    overall: Stats;
    perMedication: Record<string, Stats>;
};

export function Dashboard() {
    const navigate = useNavigate();
    const { data: session } = authClient.useSession();
    const [medications, setMedications] = useState<Medication[]>([]);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [activeMedicationIndex, setActiveMedicationIndex] = useState(0);

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

    const sortedMedications = [...medications].sort((a, b) => {
        if (!a.nextDoseAt) return 1;
        if (!b.nextDoseAt) return -1;
        return new Date(a.nextDoseAt).getTime() - new Date(b.nextDoseAt).getTime();
    });

    const activeMedication = sortedMedications[activeMedicationIndex] ?? null;
    const activeStats = activeMedication ? stats?.perMedication[activeMedication.id] : undefined;

    const handleTakeMedication = async (medId: string) => {
        try {
            const response = await fetch(`${API_URL}/medication/${medId}/take`, {
                method: "POST",
                credentials: 'include',
            });
            if (!response.ok) {
                const data = await response.json().catch(() => null);
                console.error('Erro ao confirmar dose:', data?.error ?? response.status);
                return;
            }
            fetchMedications();
            fetchStats();
        } catch (error) {
            console.error(error);
        }
    };

    const openReminder = () => {
        if (activeMedication) navigate("/reminder", { state: { medication: activeMedication } });
    };

    const hoursUntilNextDose = activeMedication?.nextDoseAt
        ? Math.max(0, Math.round((new Date(activeMedication.nextDoseAt).getTime() - Date.now()) / (1000 * 60 * 60)))
        : null;

    const canTakeMedicationNow = (med: Medication) =>
        !med.lastTakenAt || !med.nextDoseAt || new Date(med.nextDoseAt).getTime() <= Date.now();

    return (
        <main className="bg-linear-to-b from-[#eef1f4] to-[#f7f8fa] to-35% min-h-screen p-6 gap-5 flex flex-col">
            <h1 className="text-4xl font-heading text-gray-900 mt-8 mb-2 text-start">
                Bom dia, {session?.user?.name ?? "..."}
            </h1>

            <div className="p-4 rounded-[24px] bg-white/70 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col items-start gap-3">
                <h2 className="text-lg font-semibold text-gray-900">Streak de Remédios</h2>
                <div className="w-full flex justify-between text-sm text-gray-600">
                    <span>Sequência Atual</span>
                    <span className="font-medium text-gray-900">{activeStats?.currentStreak ?? 0} dias</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${Math.min(100, (activeStats?.currentStreak ?? 0) * 10)}%` }} />
                </div>

                <div className="w-full flex justify-between text-sm text-gray-600">
                    <span>Doses Tomadas</span>
                    <span className="font-medium text-gray-900">{activeStats?.dosesTaken ?? 0}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${Math.min(100, (activeStats?.dosesTaken ?? 0))}%` }} />
                </div>

                <div className="w-full flex justify-between text-sm text-gray-600">
                    <span>Próxima Dose em</span>
                    <span className="font-medium text-gray-900">{hoursUntilNextDose !== null ? `${hoursUntilNextDose}h` : "-"}</span>
                </div>
            </div>

            <div className="p-4 rounded-[24px] bg-white/70 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col items-start">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Próxima Dose</h2>
                {sortedMedications.length > 0 ? (
                    <Swiper
                        modules={[Pagination]}
                        pagination={{ clickable: true }}
                        onSlideChange={(swiper) => setActiveMedicationIndex(swiper.activeIndex)}
                        className="w-full pb-8"
                    >
                        {sortedMedications.map((med) => (
                            <SwiperSlide key={med.id}>
                                <button onClick={openReminder} className="flex gap-4 items-center mb-4 w-full text-left">
                                    <div className={`rounded-2xl p-2 w-20 h-20 flex items-center justify-center shrink-0 text-3xl ${getMedicationVisual(med.category as MedicationCategory).bgClass}`}>
                                        {getMedicationVisual(med.category as MedicationCategory).emoji}
                                    </div>
                                    <div className="flex flex-col flex-1 items-start">
                                        <h3 className="text-black font-semibold text-2xl">{med.name}</h3>
                                        <div className="flex gap-4 mt-1">
                                            <div>
                                                <p className="text-[#7B7F82] text-xs text-start">Dosagem</p>
                                                <p className="text-gray-800 font-medium text-start text-2xl">{med.dosage}</p>
                                            </div>
                                            <div>
                                                <p className="text-[#7B7F82] text-xs text-start">Horário</p>
                                                <p className="text-gray-800 font-medium text-start text-2xl">
                                                    {med.nextDoseAt
                                                        ? new Date(med.nextDoseAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                                                        : "Aguardando"
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                                {med.lastTakenAt && (
                                    <p className="text-xs text-gray-400 mb-3 -mt-2">
                                        Última dose: {new Date(med.lastTakenAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                )}
                                <Button
                                    variant="secondary"
                                    onClick={() => handleTakeMedication(med.id)}
                                    disabled={!canTakeMedicationNow(med)}
                                    className="w-full"
                                >
                                    {canTakeMedicationNow(med) ? "Confirmar dose" : "Próxima dose ainda não disponível"}
                                </Button>
                            </SwiperSlide>
                        ))}
                    </Swiper>
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
                        <p className="text-2xl font-semibold text-gray-900">{stats?.overall.weeklyAdherenceRate ?? 0}%</p>
                    </div>
                    <div className="p-4 rounded-[20px] bg-white/70 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                        <p className="text-xs text-gray-500">Doses perdidas</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats?.overall.missedDoses ?? 0}</p>
                        {stats?.overall.missedByMedication && stats.overall.missedByMedication.length > 0 && (
                            <div className="mt-2 flex flex-col gap-0.5">
                                {stats.overall.missedByMedication.map((entry) => {
                                    const med = medications.find((m) => m.id === String(entry.medicationId));
                                    return (
                                        <p key={entry.medicationId} className="text-xs text-gray-500 truncate">
                                            {med?.name ?? "Remédio"}: {entry.missedCount}
                                        </p>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
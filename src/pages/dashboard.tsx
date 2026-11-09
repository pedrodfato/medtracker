import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { CalendarCheck, Flame, Plus, TrendingUp, TriangleAlert } from "lucide-react";
import type { Medication } from "../types/medType";
import { API_URL } from "../lib/api";
import { authClient } from "../lib/auth-client";
import { MedicationIcon } from "../components/medicationIcon";
import { appearanceOf } from "../lib/medicationAppearance";
import { formatTimeUntilNextDose } from "../lib/formatTimeUntilNextDose";
import { Button } from "../components/button";
import { buttonClasses } from "../components/buttonStyles";
import { GlassCard } from "../components/glassCard";
import { StatCard } from "../components/statCard";
import { TodayStrip } from "../components/todayStrip";
import { TodaySchedule } from "../components/todaySchedule";
import { HistoryCard } from "../components/historyCard";
import { TreatmentSummaryDialog } from "../components/treatmentSummaryDialog";

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

function greetingFor(date: Date): string {
    const hour = date.getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
}

export function Dashboard() {
    const navigate = useNavigate();
    const { data: session } = authClient.useSession();
    const [medications, setMedications] = useState<Medication[]>([]);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [activeMedicationIndex, setActiveMedicationIndex] = useState(0);
    const [undoTarget, setUndoTarget] = useState<Medication | null>(null);
    const [isUndoing, setIsUndoing] = useState(false);
    const [isDismissingSummary, setIsDismissingSummary] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

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

    const sortedMedications = medications
        .filter((m) => !m.completed)
        .sort((a, b) => {
            if (!a.nextDoseAt) return 1;
            if (!b.nextDoseAt) return -1;
            return new Date(a.nextDoseAt).getTime() - new Date(b.nextDoseAt).getTime();
        });

    // One summary popup at a time; the next one shows after this is dismissed.
    const summaryTarget = medications.find((m) => m.treatmentSummary && !m.treatmentSummary.dismissed) ?? null;

    // The list shrinks when a treatment completes, so keep the index inside it.
    const activeMedication = sortedMedications[Math.min(activeMedicationIndex, sortedMedications.length - 1)] ?? null;

    // History shows the strip's selection, defaulting to the first active medication.
    const historyId = selectedId ?? (sortedMedications[0]?.id ?? medications[0]?.id ?? null);
    const historyMedication = medications.find((m) => String(m.id) === String(historyId)) ?? null;

    const scheduledToday = medications.filter((m) => !m.completed && (m.today?.expected ?? 0) > 0);
    const dosesExpectedToday = scheduledToday.reduce((sum, m) => sum + (m.today?.expected ?? 0), 0);
    const dosesTakenToday = scheduledToday.reduce(
        (sum, m) => sum + Math.min(m.today?.taken ?? 0, m.today?.expected ?? 0),
        0,
    );

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

    const handleUndoMedication = async (medId: string) => {
        setIsUndoing(true);
        try {
            const response = await fetch(`${API_URL}/medication/${medId}/take`, {
                method: "DELETE",
                credentials: 'include',
            });
            if (!response.ok) {
                const data = await response.json().catch(() => null);
                console.error('Erro ao desfazer dose:', data?.error ?? response.status);
                return;
            }
            fetchMedications();
            fetchStats();
        } catch (error) {
            console.error(error);
        } finally {
            setIsUndoing(false);
            setUndoTarget(null);
        }
    };

    const handleDismissSummary = async (medId: string) => {
        setIsDismissingSummary(true);
        try {
            const response = await fetch(`${API_URL}/medications/${medId}/summary/dismiss`, {
                method: "POST",
                credentials: 'include',
            });
            if (!response.ok) {
                const data = await response.json().catch(() => null);
                console.error('Erro ao dispensar resumo:', data?.error ?? response.status);
                return;
            }
            await fetchMedications();
        } catch (error) {
            console.error(error);
        } finally {
            setIsDismissingSummary(false);
        }
    };

    const openReminder = () => {
        if (activeMedication) navigate("/reminder", { state: { medication: activeMedication } });
    };

    const timeUntilNextDose = formatTimeUntilNextDose(activeMedication?.nextDoseAt ?? null);

    const canTakeMedicationNow = (med: Medication) =>
        !med.lastTakenAt || !med.nextDoseAt || new Date(med.nextDoseAt).getTime() <= Date.now();

    const now = new Date();
    const firstName = session?.user?.name?.split(" ")[0] ?? "...";
    const todayLabel = now.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });

    return (
        <main className="flex min-h-screen flex-col gap-5 p-5 text-start lg:min-h-0 lg:p-0">
            <header className="flex items-end justify-between gap-4 pt-6 lg:pt-2">
                <div>
                    <p className="text-sm capitalize text-gray-500">{todayLabel}</p>
                    <h1 className="m-0 font-heading text-3xl font-semibold tracking-tight text-gray-900 lg:text-4xl">
                        {greetingFor(now)}, {firstName}
                    </h1>
                </div>
                <Link to="/add" className={buttonClasses("primary", "hidden lg:inline-flex")}>
                    <Plus className="size-[18px]" />
                    Adicionar remédio
                </Link>
            </header>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
                <StatCard
                    icon={CalendarCheck}
                    label="Doses de hoje"
                    value={`${dosesTakenToday}/${dosesExpectedToday}`}
                    hint={timeUntilNextDose ? `Próxima em ${timeUntilNextDose}` : undefined}
                    tone="lime"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Adesão da semana"
                    value={`${stats?.overall.weeklyAdherenceRate ?? 0}%`}
                    tone="mint"
                />
                <StatCard
                    icon={Flame}
                    label="Sequência"
                    value={`${stats?.overall.currentStreak ?? 0} ${stats?.overall.currentStreak === 1 ? "dia" : "dias"}`}
                    tone="amber"
                />
                <StatCard
                    icon={TriangleAlert}
                    label="Doses perdidas"
                    value={`${stats?.overall.missedDoses ?? 0}`}
                    hint="Últimos 7 dias"
                    tone="rose"
                />
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                <GlassCard className="flex min-w-0 flex-col lg:col-span-7">
                    <h2 className="m-0 mb-3 text-lg font-semibold text-gray-900">Próxima dose</h2>
                    {sortedMedications.length > 0 ? (
                        <Swiper
                            modules={[Pagination]}
                            pagination={{ clickable: true }}
                            onSlideChange={(swiper) => setActiveMedicationIndex(swiper.activeIndex)}
                            className="w-full"
                            style={{ paddingBottom: '2rem' }}
                        >
                            {sortedMedications.map((med) => (
                                <SwiperSlide key={med.id}>
                                    <button onClick={openReminder} className="mb-4 flex w-full items-center gap-4 text-left">
                                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/80">
                                            <MedicationIcon {...appearanceOf(med)} size={66} />
                                        </div>
                                        <div className="flex flex-1 flex-col items-start">
                                            <h3 className="m-0 text-2xl font-semibold text-gray-900">{med.name}</h3>
                                            <div className="mt-1 flex gap-6">
                                                <div>
                                                    <p className="text-xs text-gray-500">Dosagem</p>
                                                    <p className="text-xl font-medium text-gray-800">{med.dosage}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Horário</p>
                                                    <p className="text-xl font-medium text-gray-800">
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
                                        <p className="-mt-2 mb-3 text-xs text-gray-500">
                                            Última dose: {new Date(med.lastTakenAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    )}
                                    <Button
                                        variant={canTakeMedicationNow(med) ? "primary" : "secondary"}
                                        onClick={() => handleTakeMedication(med.id)}
                                        disabled={!canTakeMedicationNow(med)}
                                        className="w-full"
                                    >
                                        {canTakeMedicationNow(med) ? "Confirmar dose" : "Próxima dose ainda não disponível"}
                                    </Button>
                                    {med.lastTakenAt && (
                                        <button
                                            onClick={() => setUndoTarget(med)}
                                            className="mt-2 w-full text-center text-sm text-gray-500 underline"
                                        >
                                            Marquei por engano? Desfazer última dose
                                        </button>
                                    )}
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-gray-900/15 p-6 text-center">
                            <p className="mb-4 text-gray-500">Você não tem remédios pendentes.</p>
                            <Link to="/add" className={buttonClasses("secondary")}>Adicionar remédio</Link>
                        </div>
                    )}
                </GlassCard>

                <TodaySchedule className="lg:col-span-5" medications={medications} />

                {medications.length > 0 && (
                    <>
                        <TodayStrip
                            className="lg:col-span-5"
                            medications={medications}
                            selectedId={historyId}
                            onSelect={setSelectedId}
                        />
                        <HistoryCard className="lg:col-span-7" medication={historyMedication} selectedId={historyId} />
                    </>
                )}
            </div>

            {summaryTarget?.treatmentSummary && (
                <TreatmentSummaryDialog
                    medicationName={summaryTarget.name}
                    summary={summaryTarget.treatmentSummary}
                    isDismissing={isDismissingSummary}
                    onDismiss={() => handleDismissSummary(summaryTarget.id)}
                />
            )}

            {undoTarget && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30 p-6 backdrop-blur-sm"
                    onClick={() => !isUndoing && setUndoTarget(null)}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="undo-dose-title"
                        className="glass-strong flex w-full max-w-sm flex-col gap-4 rounded-[24px] p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 id="undo-dose-title" className="m-0 text-lg font-semibold text-gray-900">
                            Desfazer última dose?
                        </h2>
                        <p className="text-gray-600">
                            O registro da última dose de <strong>{undoTarget.name}</strong> será removido.
                        </p>
                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1" onClick={() => setUndoTarget(null)} disabled={isUndoing}>
                                Não
                            </Button>
                            <Button className="flex-1" onClick={() => handleUndoMedication(undoTarget.id)} disabled={isUndoing}>
                                Sim
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

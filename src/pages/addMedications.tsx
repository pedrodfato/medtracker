import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "../components/button";
import { API_URL } from "../lib/api";
import type { Medication } from "../types/medType";

const WEEKDAYS: { label: string; value: number }[] = [
    { label: "Dom", value: 0 },
    { label: "Seg", value: 1 },
    { label: "Ter", value: 2 },
    { label: "Qua", value: 3 },
    { label: "Qui", value: 4 },
    { label: "Sex", value: 5 },
    { label: "Sab", value: 6 },
];

export function AddMedication() {
    const navigate = useNavigate();
    const location = useLocation();
    const editingMedication = (location.state as { medication?: Medication } | null)?.medication;
    const isEditMode = !!editingMedication;

    const [name, setName] = useState(editingMedication?.name ?? "");
    const [dosage, setDosage] = useState(editingMedication?.dosage ?? "");
    const [category, setCategory] = useState<"pill" | "drop" | "vitamin">(editingMedication?.category ?? "pill");
    const [scheduleType, setScheduleType] = useState<"fixed" | "weekly" | "interval">(editingMedication?.scheduleType ?? "fixed");
    const [daysOfWeek, setDaysOfWeek] = useState<number[]>(editingMedication?.daysOfWeek ?? [1, 3, 5]);
    const [fixedTime, setFixedTime] = useState(editingMedication?.fixedTime ?? "08:00");
    const [intervalHours, setIntervalHours] = useState(editingMedication?.intervalHours?.toString() ?? "8");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const toggleDay = (day: number) => {
        setDaysOfWeek((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort((a, b) => a - b)
        );
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg("");

        if (scheduleType === "weekly" && daysOfWeek.length === 0) {
            setErrorMsg("Selecione pelo menos um dia da semana.");
            return;
        }

        const parsedIntervalHours = parseInt(intervalHours, 10);
        if (scheduleType === "interval" && (!parsedIntervalHours || parsedIntervalHours < 1)) {
            setErrorMsg("Informe um intervalo válido, em horas.");
            return;
        }

        setIsLoading(true);
        try {
            const url = isEditMode
                ? `${API_URL}/medications/${editingMedication!.id}`
                : `${API_URL}/medications`;

            const body: Record<string, unknown> = {
                name,
                dosage,
                category,
                scheduleType,
                startDate: new Date().toISOString(),
            };

            if (scheduleType === "fixed") {
                body.fixedTime = fixedTime;
            } else if (scheduleType === "weekly") {
                body.fixedTime = fixedTime;
                body.daysOfWeek = daysOfWeek;
            } else {
                body.intervalHours = parsedIntervalHours;
            }

            const response = await fetch(url, {
                method: isEditMode ? "PATCH" : "POST",
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!response.ok) throw new Error(isEditMode ? "Falha ao atualizar" : "Falha ao salvar");
            navigate("/list");

        } catch (error) {
            console.error('Erro ao salvar remédio:', error);
            setErrorMsg(isEditMode ? "Erro ao atualizar remédio." : "Erro ao adicionar remédio.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="bg-[#F7F8FA] min-h-screen py-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-md bg-white p-6 rounded-[24px] shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? "Editar Medicamento" : "Novo Medicamento"}</h1>
                    <Link to="/list" className="text-sm text-gray-500 hover:text-black">Cancelar</Link>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Medicamento</label>
                        <Input required placeholder="Ex: Ritalina" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dosagem</label>
                        <Input required placeholder="Ex: 10mg" value={dosage} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDosage(e.target.value)} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                        <div className="flex gap-2">
                            <button type="button" onClick={() => setCategory("pill")} className={`flex-1 py-2 rounded-lg text-sm transition-colors border ${category === "pill" ? "bg-primary/20 border-primary text-green-800 font-medium" : "bg-gray-50 border-gray-200 text-gray-500"}`}>💊 Pílula</button>
                            <button type="button" onClick={() => setCategory("drop")} className={`flex-1 py-2 rounded-lg text-sm transition-colors border ${category === "drop" ? "bg-orange-100 border-orange-400 text-orange-800 font-medium" : "bg-gray-50 border-gray-200 text-gray-500"}`}>💧 Gota</button>
                            <button type="button" onClick={() => setCategory("vitamin")} className={`flex-1 py-2 rounded-lg text-sm transition-colors border ${category === "vitamin" ? "bg-yellow-100 border-yellow-400 text-yellow-800 font-medium" : "bg-gray-50 border-gray-200 text-gray-500"}`}>☀️ Vitamina</button>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <label className="block text-sm font-medium text-gray-700 mb-3">Frequência e Horário</label>

                        <div className="flex gap-2 mb-4">
                            <button
                                type="button"
                                onClick={() => setScheduleType("fixed")}
                                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors border ${scheduleType === "fixed" ? "bg-primary/20 border-primary text-green-800" : "bg-white border-gray-200 text-gray-500"}`}
                            >
                                Todo dia
                            </button>
                            <button
                                type="button"
                                onClick={() => setScheduleType("weekly")}
                                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors border ${scheduleType === "weekly" ? "bg-primary/20 border-primary text-green-800" : "bg-white border-gray-200 text-gray-500"}`}
                            >
                                Dias específicos
                            </button>
                            <button
                                type="button"
                                onClick={() => setScheduleType("interval")}
                                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors border ${scheduleType === "interval" ? "bg-primary/20 border-primary text-green-800" : "bg-white border-gray-200 text-gray-500"}`}
                            >
                                A cada X horas
                            </button>
                        </div>

                        {scheduleType === "weekly" && (
                            <div className="flex justify-between gap-1 mb-4">
                                {WEEKDAYS.map(({ label, value }) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => toggleDay(value)}
                                        className={`flex-1 py-2 rounded-full text-xs font-medium transition-colors ${
                                            daysOfWeek.includes(value)
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-gray-200 text-gray-500"
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {(scheduleType === "fixed" || scheduleType === "weekly") && (
                            <>
                                <label className="block text-xs text-gray-500 mb-1">Horário</label>
                                <Input required type="time" value={fixedTime} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFixedTime(e.target.value)} />
                            </>
                        )}

                        {scheduleType === "interval" && (
                            <>
                                <label className="block text-xs text-gray-500 mb-1">Repetir a cada quantas horas?</label>
                                <div className="flex items-center gap-2">
                                    <Input required type="number" min={1} max={24} value={intervalHours} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIntervalHours(e.target.value)} className="max-w-24" />
                                    <span className="text-sm text-gray-500">horas</span>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-3 bg-tertiary rounded-xl p-4">
                        <span className="text-2xl" aria-hidden="true">🤖</span>
                        <p className="text-sm text-tertiary-foreground">Precisa de ajuda para configurar sua dosagem? Só perguntar!</p>
                    </div>

                    {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}

                    <Button type="submit" disabled={isLoading} className="w-full mt-2">
                        {isLoading ? "Salvando..." : isEditMode ? "Salvar Alterações" : "Salvar Medicamento"}
                    </Button>
                </form>
            </div>
        </main>
    );
}
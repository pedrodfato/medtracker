import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "../components/button";
import { API_URL } from "../lib/api";
import type { Medication } from "../types/medType";
import { CalendarDays, Clock, FlaskConical, Pill, Repeat } from "lucide-react";
import { GlassCard } from "../components/glassCard";
import { Field } from "../components/field";
import { SegmentedControl } from "../components/segmentedControl";

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
    const [durationDays, setDurationDays] = useState(editingMedication?.durationDays?.toString() ?? "");
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

        // Na edição, deixar vazio mantém a duração atual (remédios antigos não têm uma).
        const parsedDuration = durationDays.trim() === "" ? null : Number(durationDays);
        if (parsedDuration === null && !isEditMode) {
            setErrorMsg("Informe por quantos dias você vai tomar o remédio.");
            return;
        }
        if (parsedDuration !== null && (!Number.isInteger(parsedDuration) || parsedDuration < 1 || parsedDuration > 365)) {
            setErrorMsg("A duração deve ser um número inteiro de 1 a 365 dias.");
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

            if (parsedDuration !== null) {
                body.durationDays = parsedDuration;
            }

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
        <main className="flex min-h-screen justify-center p-5 lg:min-h-0 lg:p-0">
            <GlassCard className="w-full max-w-md p-6 lg:max-w-4xl lg:p-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="m-0 font-heading text-2xl font-semibold tracking-tight text-gray-900 lg:text-3xl">
                            {isEditMode ? "Editar Medicamento" : "Novo Medicamento"}
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">Preencha conforme a receita.</p>
                    </div>
                    <Link to="/list" className="text-sm font-medium text-gray-500 hover:text-gray-900">Cancelar</Link>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="flex flex-col gap-5">
                            <Field label="Medicamento" htmlFor="med-name" icon={Pill}>
                                <Input id="med-name" required placeholder="Ex: Ritalina" className="pl-11" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
                            </Field>
                            <Field label="Dosagem" htmlFor="med-dosage" icon={FlaskConical}>
                                <Input id="med-dosage" required placeholder="Ex: 10mg" className="pl-11" value={dosage} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDosage(e.target.value)} />
                            </Field>
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[13px] font-medium text-gray-700">Categoria</span>
                                <SegmentedControl
                                    ariaLabel="Categoria"
                                    value={category}
                                    onChange={setCategory}
                                    options={[
                                        { value: "pill", label: "💊 Pílula" },
                                        { value: "drop", label: "💧 Gota" },
                                        { value: "vitamin", label: "☀️ Vitamina" },
                                    ]}
                                />
                            </div>
                            <Field label="Por quantos dias?" htmlFor="med-duration" icon={CalendarDays} hint="Conforme a receita. Hoje conta como o dia 1.">
                                <Input
                                    id="med-duration"
                                    required={!isEditMode}
                                    type="number"
                                    min={1}
                                    max={365}
                                    placeholder="Ex: 10"
                                    className="pl-11"
                                    value={durationDays}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDurationDays(e.target.value)}
                                />
                            </Field>
                        </div>

                        <div className="flex flex-col gap-5 rounded-[20px] bg-white/40 p-5">
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[13px] font-medium text-gray-700">Frequência e horário</span>
                                <SegmentedControl
                                    ariaLabel="Frequência"
                                    value={scheduleType}
                                    onChange={setScheduleType}
                                    options={[
                                        { value: "fixed", label: "Todo dia" },
                                        { value: "weekly", label: "Dias específicos" },
                                        { value: "interval", label: "A cada X horas" },
                                    ]}
                                />
                            </div>

                            {scheduleType === "weekly" && (
                                <div className="flex justify-between gap-1.5">
                                    {WEEKDAYS.map(({ label, value }) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => toggleDay(value)}
                                            aria-pressed={daysOfWeek.includes(value)}
                                            className={`h-10 flex-1 rounded-xl text-xs font-semibold transition-all ${
                                                daysOfWeek.includes(value)
                                                    ? "bg-primary text-primary-foreground shadow-[0_6px_16px_rgba(163,217,17,0.35)]"
                                                    : "bg-white/70 text-gray-500 hover:text-gray-800"
                                            }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {(scheduleType === "fixed" || scheduleType === "weekly") && (
                                <Field label="Horário" htmlFor="med-time" icon={Clock}>
                                    <Input id="med-time" required type="time" className="pl-11" value={fixedTime} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFixedTime(e.target.value)} />
                                </Field>
                            )}

                            {scheduleType === "interval" && (
                                <Field label="Repetir a cada quantas horas?" htmlFor="med-interval" icon={Repeat}>
                                    <Input id="med-interval" required type="number" min={1} max={24} className="pl-11" value={intervalHours} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIntervalHours(e.target.value)} />
                                </Field>
                            )}

                            <div className="mt-auto flex items-center gap-3 rounded-2xl bg-tertiary/70 p-4">
                                <span className="text-2xl" aria-hidden="true">🤖</span>
                                <p className="text-sm text-tertiary-foreground">Precisa de ajuda para configurar sua dosagem? Só perguntar!</p>
                            </div>
                        </div>
                    </div>

                    {errorMsg && <p className="text-center text-sm text-red-500">{errorMsg}</p>}

                    <Button type="submit" disabled={isLoading} className="w-full lg:ml-auto lg:w-64">
                        {isLoading ? "Salvando..." : isEditMode ? "Salvar Alterações" : "Salvar Medicamento"}
                    </Button>
                </form>
            </GlassCard>
        </main>
    );
}

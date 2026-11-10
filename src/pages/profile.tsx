import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";
import { setSessionHint } from "../lib/sessionHint";
import { Input } from "@/components/ui/input";
import { Button } from "../components/button";
import { inputClasses } from "@/components/ui/input";

const TIMEZONE_OPTIONS = [
    { value: "America/Sao_Paulo", label: "Horário de Brasília (SP)" },
    { value: "America/Manaus", label: "Manaus (AM)" },
    { value: "America/Rio_Branco", label: "Acre (AC)" },
    { value: "America/Noronha", label: "Fernando de Noronha" },
];

const REMINDER_LEAD_OPTIONS = [
    { value: 0, label: "Na hora" },
    { value: 5, label: "5 minutos antes" },
    { value: 10, label: "10 minutos antes" },
    { value: 15, label: "15 minutos antes" },
    { value: 30, label: "30 minutos antes" },
    { value: 60, label: "1 hora antes" },
];

export function Profile() {
    const navigate = useNavigate();
    const { data: session, refetch } = authClient.useSession();
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameInput, setNameInput] = useState("");
    const [isEditingTimezone, setIsEditingTimezone] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const userTimezone = (session?.user as { timezone?: string } | undefined)?.timezone ?? "America/Sao_Paulo";
    const timezoneLabel = TIMEZONE_OPTIONS.find((tz) => tz.value === userTimezone)?.label ?? "Horário de Brasília (SP)";

    const reminderUser = session?.user as { reminderEnabled?: boolean; reminderLeadMinutes?: number } | undefined;
    const reminderEnabled = reminderUser?.reminderEnabled ?? true;
    const reminderLeadMinutes = reminderUser?.reminderLeadMinutes ?? 10;

    const startEditingName = () => {
        setNameInput(session?.user?.name ?? "");
        setIsEditingName(true);
    };

    const saveName = async () => {
        if (!nameInput.trim()) return;
        setIsSaving(true);
        try {
            await authClient.updateUser({ name: nameInput.trim() });
            await refetch?.();
            setIsEditingName(false);
        } catch (error) {
            console.error('Erro ao atualizar nome:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const changeTimezone = async (value: string) => {
        setIsSaving(true);
        try {
            await authClient.updateUser({ timezone: value });
            await refetch?.();
            setIsEditingTimezone(false);
        } catch (error) {
            console.error('Erro ao atualizar fuso horário:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const updateReminders = async (data: { reminderEnabled?: boolean; reminderLeadMinutes?: number }) => {
        setIsSaving(true);
        try {
            await authClient.updateUser(data);
            await refetch?.();
        } catch (error) {
            console.error('Erro ao atualizar lembretes:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = async () => {
        await authClient.signOut();
        setSessionHint(false);
        navigate("/");
    };

    const initials = (session?.user?.name ?? "?")
        .split(" ")
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <main className="flex min-h-screen flex-col gap-5 p-5 text-start lg:min-h-0 lg:p-0">
            <h1 className="m-0 pt-6 font-heading text-3xl font-semibold tracking-tight text-gray-900 lg:pt-2 lg:text-4xl">Perfil</h1>

            <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
            <div className="p-4 glass rounded-[24px] flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-semibold shrink-0">
                    {initials}
                </div>
                <div className="flex-1 min-w-0">
                    {isEditingName ? (
                        <div className="flex flex-col gap-2">
                            <Input
                                value={nameInput}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNameInput(e.target.value)}
                                placeholder="Seu nome"
                            />
                            <div className="flex gap-2">
                                <Button variant="primary" className="flex-1" onClick={saveName} disabled={isSaving}>
                                    Salvar
                                </Button>
                                <Button variant="secondary" className="flex-1" onClick={() => setIsEditingName(false)} disabled={isSaving}>
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-lg font-semibold text-gray-900 truncate">{session?.user?.name ?? "..."}</h2>
                            <p className="text-sm text-gray-500 truncate">{session?.user?.email ?? ""}</p>
                        </>
                    )}
                </div>
                {!isEditingName && (
                    <button onClick={startEditingName} className="text-sm text-primary font-medium shrink-0">
                        Editar
                    </button>
                )}
            </div>

            <div className="flex flex-col gap-3">
                <button
                    onClick={startEditingName}
                    className="p-4 glass rounded-[24px] flex items-center gap-3 text-left"
                >
                    <div className="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center text-lg shrink-0">
                        👤
                    </div>
                    <span className="font-medium text-gray-900">Meus Dados</span>
                </button>

                <div className="p-4 glass rounded-[24px] flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center text-lg shrink-0">
                            🔔
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-gray-900">Lembretes por e-mail</p>
                            <p className="text-xs text-gray-500">{reminderEnabled ? "Ligados" : "Desligados"}</p>
                        </div>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={reminderEnabled}
                            aria-label="Receber lembretes por e-mail"
                            onClick={() => updateReminders({ reminderEnabled: !reminderEnabled })}
                            disabled={isSaving}
                            className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${reminderEnabled ? "bg-primary" : "bg-gray-300"}`}
                        >
                            <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${reminderEnabled ? "translate-x-5" : ""}`} />
                        </button>
                    </div>
                    <label className="text-xs text-gray-500 mt-2" htmlFor="reminder-lead">Avisar com antecedência de</label>
                    <select
                        id="reminder-lead"
                        value={reminderLeadMinutes}
                        onChange={(e) => updateReminders({ reminderLeadMinutes: Number(e.target.value) })}
                        disabled={isSaving || !reminderEnabled}
                        className={inputClasses}
                    >
                        {REMINDER_LEAD_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>

                <div className="p-4 glass rounded-[24px] flex flex-col gap-2">
                    <button
                        onClick={() => setIsEditingTimezone((prev) => !prev)}
                        className="flex items-center gap-3 text-left w-full"
                    >
                        <div className="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center text-lg shrink-0">
                            🕐
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-gray-900">Fuso Horário</p>
                            <p className="text-xs text-gray-500">{timezoneLabel}</p>
                        </div>
                    </button>
                    {isEditingTimezone && (
                        <select
                            value={userTimezone}
                            onChange={(e) => changeTimezone(e.target.value)}
                            disabled={isSaving}
                            className={`${inputClasses} mt-2`}
                        >
                            {TIMEZONE_OPTIONS.map((tz) => (
                                <option key={tz.value} value={tz.value}>{tz.label}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            </div>

            <button onClick={handleLogout} className="text-red-500 font-medium text-center mt-2">
                Sair da conta
            </button>
        </main>
    );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "../components/button";

const TIMEZONE_OPTIONS = [
    { value: "America/Sao_Paulo", label: "Horário de Brasília (SP)" },
    { value: "America/Manaus", label: "Manaus (AM)" },
    { value: "America/Rio_Branco", label: "Acre (AC)" },
    { value: "America/Noronha", label: "Fernando de Noronha" },
];

export function Profile() {
    const navigate = useNavigate();
    const { data: session, refetch } = authClient.useSession();
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameInput, setNameInput] = useState("");
    const [isEditingTimezone, setIsEditingTimezone] = useState(false);
    const [showAlertNotice, setShowAlertNotice] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const userTimezone = (session?.user as { timezone?: string } | undefined)?.timezone ?? "America/Sao_Paulo";
    const timezoneLabel = TIMEZONE_OPTIONS.find((tz) => tz.value === userTimezone)?.label ?? "Horário de Brasília (SP)";

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

    const handleLogout = async () => {
        await authClient.signOut();
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
        <main className="bg-linear-to-b from-[#eef1f4] to-[#f7f8fa] to-35% min-h-screen p-6 flex flex-col gap-6">
            <h1 className="text-4xl font-heading text-gray-900 mt-8 mb-2 text-start">Perfil</h1>

            <div className="p-4 rounded-[24px] bg-white/70 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex items-center gap-4">
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
                    className="p-4 rounded-[20px] bg-white/70 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex items-center gap-3 text-left"
                >
                    <div className="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center text-lg shrink-0">
                        👤
                    </div>
                    <span className="font-medium text-gray-900">Meus Dados</span>
                </button>

                <button
                    onClick={() => setShowAlertNotice(true)}
                    className="p-4 rounded-[20px] bg-white/70 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex items-center gap-3 text-left"
                >
                    <div className="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center text-lg shrink-0">
                        🔔
                    </div>
                    <span className="font-medium text-gray-900 flex-1">Preferências de Alerta</span>
                    {showAlertNotice && <span className="text-xs text-gray-400">Em breve</span>}
                </button>

                <div className="p-4 rounded-[20px] bg-white/70 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col gap-2">
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
                            className="mt-2 w-full rounded-full border border-input px-4 py-2 text-sm bg-transparent"
                        >
                            {TIMEZONE_OPTIONS.map((tz) => (
                                <option key={tz.value} value={tz.value}>{tz.label}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            <button onClick={handleLogout} className="text-red-500 font-medium text-center mt-2">
                Sair da conta
            </button>
        </main>
    );
}

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "../components/button";

export function AddMedication() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [dosage, setDosage] = useState("");
    const [category, setCategory] = useState<"pill" | "drop" | "vitamin">("pill");
    
    // NOVOS ESTADOS DO TEMPO
    const [scheduleType, setScheduleType] = useState<"fixed" | "interval">("interval");
    const [intervalHours, setIntervalHours] = useState("");
    const [fixedTime, setFixedTime] = useState("");
    
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/medications`, {
                method: "POST",
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    dosage,
                    category,
                    scheduleType,
                    intervalHours: scheduleType === "interval" ? Number(intervalHours) : null,
                    fixedTime: scheduleType === "fixed" ? fixedTime : null,
                    startDate: new Date().toISOString(),
                }),
            });

            if (!response.ok) throw new Error("Falha ao salvar");
            navigate("/List"); 

        } catch (error) {
            console.error('Erro ao adicionar remédio:', error);
        } finally {
            setIsLoading(false); 
        }
    }

    return (
        <main className="bg-[#F7F8FA] min-h-screen py-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-md bg-white p-6 rounded-[24px] shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Novo Medicamento</h1>
                    <Link to="/List" className="text-sm text-gray-500 hover:text-black">Cancelar</Link>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                 
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Medicamento</label>
                        <Input required placeholder="Ex: Ritalina" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dosagem</label>
                        <Input required placeholder="Ex: 10mg" value={dosage} onChange={(e) => setDosage(e.target.value)} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                        <div className="flex gap-2">
                            <button type="button" onClick={() => setCategory("pill")} className={`flex-1 py-2 rounded-lg text-sm transition-colors border ${category === "pill" ? "bg-[#ABD43A]/20 border-[#ABD43A] text-green-800 font-medium" : "bg-gray-50 border-gray-200 text-gray-500"}`}>💊 Pílula</button>
                            <button type="button" onClick={() => setCategory("drop")} className={`flex-1 py-2 rounded-lg text-sm transition-colors border ${category === "drop" ? "bg-orange-100 border-orange-400 text-orange-800 font-medium" : "bg-gray-50 border-gray-200 text-gray-500"}`}>💧 Gota</button>
                            <button type="button" onClick={() => setCategory("vitamin")} className={`flex-1 py-2 rounded-lg text-sm transition-colors border ${category === "vitamin" ? "bg-yellow-100 border-yellow-400 text-yellow-800 font-medium" : "bg-gray-50 border-gray-200 text-gray-500"}`}>☀️ Vitamina</button>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <label className="block text-sm font-medium text-gray-700 mb-3">Rotina do Remédio</label>
                        <div className="flex bg-gray-200 p-1 rounded-lg mb-4">
                            <button type="button" onClick={() => setScheduleType("interval")} className={`flex-1 py-1.5 text-sm rounded-md transition-all ${scheduleType === "interval" ? "bg-white shadow-sm font-medium text-black" : "text-gray-500"}`}>⏳ Intervalo</button>
                            <button type="button" onClick={() => setScheduleType("fixed")} className={`flex-1 py-1.5 text-sm rounded-md transition-all ${scheduleType === "fixed" ? "bg-white shadow-sm font-medium text-black" : "text-gray-500"}`}>⏰ Horário Fixo</button>
                        </div>

                        {scheduleType === "interval" ? (
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">A cada quantas horas?</label>
                                <Input required type="number" min="1" placeholder="Ex: 8" value={intervalHours} onChange={(e) => setIntervalHours(e.target.value)} />
                                <p className="text-xs text-gray-400 mt-2">Ex: Se atrasar a dose, o próximo horário será empurrado para frente.</p>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Que horas todos os dias?</label>
                                <Input required type="time" value={fixedTime} onChange={(e) => setFixedTime(e.target.value)} />
                                <p className="text-xs text-gray-400 mt-2">Ex: O horário se mantém sempre o mesmo, não importa o atraso.</p>
                            </div>
                        )}
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full mt-2">
                        {isLoading ? "Salvando..." : "Adicionar Medicamento"}
                    </Button>
                </form>
            </div>
        </main>
    );
}
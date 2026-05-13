import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "../components/button";

export function AddMedication() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [dosage, setDosage] = useState("");
    const [frequencyHours, setFrequencyHours] = useState("");
    // NOVO ESTADO DA CATEGORIA
    const [category, setCategory] = useState<"pill" | "drop" | "vitamin">("pill");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/medications`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    dosage,
                    frequencyHours: Number(frequencyHours),
                    category, 
                    totalPills: 30,
                    startDate: new Date().toISOString(),
                }),
            });

            if (!response.ok) {
                throw new Error("Falha ao salvar o medicamento");
            }

            console.log("Medicamento criado com sucesso!");
            
          
            navigate("/List"); 

        } catch (error) {
            console.error('Erro ao adicionar remédio:', error);
        } finally {
            setIsLoading(false); 
        }
    }

    return (
        <main className="bg-[#F7F8FA] min-h-screen py-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-md p-4 rounded-[24px]">
                <h1 className="text-2xl font-regular text-center mb-6 text-black">Adicionar Medicamento</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <Input placeholder="Nome do medicamento" value={name} onChange={(e) => setName(e.target.value)} />
                    <Input placeholder="Dosagem" value={dosage} onChange={(e) => setDosage(e.target.value)} />
                    <Input placeholder="Frequência (horas)" value={frequencyHours} onChange={(e) => setFrequencyHours(e.target.value)} />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setCategory("pill")}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${
                                    category === "pill" 
                                    ? "bg-[#ABD43A]/20 border-[#ABD43A] text-green-800" 
                                    : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                                }`}
                            >
                                💊 Pílula
                            </button>
                            <button
                                type="button"
                                onClick={() => setCategory("drop")}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${
                                    category === "drop" 
                                    ? "bg-orange-100 border-orange-400 text-orange-800" 
                                    : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                                }`}
                            >
                                💧 Gota
                            </button>
                            <button
                                type="button"
                                onClick={() => setCategory("vitamin")}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${
                                    category === "vitamin" 
                                    ? "bg-yellow-100 border-yellow-400 text-yellow-800" 
                                    : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                                }`}
                            >
                                ☀️ Vitamina
                            </button>
                        </div>
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full mt-4">
                        {isLoading ? "Salvando..." : "Adicionar Medicamento"}
                    </Button>
                </form>
            </div>
        </main>
    );
}
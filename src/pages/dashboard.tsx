import { useEffect, useState } from "react";
import type { Medication } from "../types/medType";


export function Dashboard() {
    const [medications, setMedications] = useState<Medication[]>([]);
  
    const fetchMedications = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/medications`, {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Failed to fetch medications');
            }
            const responseData = await response.json();
            setMedications(responseData.data);
        } catch (error) {
            console.error('Error fetching medications:', error);
        }
    };

    useEffect(() => {
        const fetchMedications = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/medications`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch medications');
                }
                const responseData = await response.json();
                setMedications(responseData.data);
            } catch (error) {
                console.error('Error fetching medications:', error);
            }
        };
        fetchMedications();
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
            await fetch(`${import.meta.env.VITE_API_URL}/medication/${medId}/take`, {
                method: "POST",
                credentials: 'include',
            });
            console.log("Dose registrada!");
            fetchMedications(); 
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <main className="bg-linear-to-b from-[#eef1f4] to-[#f7f8fa] to-35% min-h-screen p-6 gap-5 flex  flex-col">
            <h1 className="text-4xl font-serif text-gray-900 mt-8 mb-2 text-start">
                Bom dia, Pedro
            </h1>
            <div className="p-4 rounded-[24px] bg-white/70 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col items-start">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Streak Remédios</h2>
            </div>
            <div className="p-4 rounded-[24px] bg-white/70 shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex flex-col items-start">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Próxima Dose</h2>
            {nextMedication ? (
                    <>
                    <div className="flex gap-4 items-center mb-4 w-full">
                        <div className={`rounded-2xl p-2 w-20 h-20 flex items-center justify-center shrink-0 ${
                            nextMedication.category === 'drop' ? 'bg-orange-100' : 'bg-blue-100'
                        }`}>
                            <span className="text-2xl">
                                {nextMedication.category === 'drop' ? '💧' : '💊'}
                            </span>
                        </div>
                        <div className="flex flex-col flex-1 items-start">
                            <h3 className="text-black font-semibold text-2xl ">{nextMedication.name}</h3>
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
                    </div>
                    <button 
                        onClick={() => handleTakeMedication(nextMedication.id)}
                        className="w-full py-3 bg-[#F2F3F5] hover:bg-[#E5E7EB] text-black font-medium rounded-xl transition-colors active:scale-[0.98]"
                    >
                        Tomei Hoje?
                    </button>
                    </>
            ) : (
                <div className="bg-white p-6 rounded-[24px] text-center border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">Você não tem remédios pendentes.</p>
                </div>
            )}
            </div>
        </main>
    );
}
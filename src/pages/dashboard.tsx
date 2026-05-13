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
        <main className="bg-[#F7F8FA] min-h-screen p-6">
            <h1 className="text-3xl font-serif text-gray-900 mt-8 mb-6">
                Bom dia,<br/>Pedro
            </h1>

            <h2 className="text-lg font-semibold text-gray-900 mb-3">Próxima Dose</h2>

            {nextMedication ? (
              
                <div className="bg-white p-4 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="flex gap-4 items-center mb-4">
                      
                        <div className={`rounded-2xl p-2 w-16 h-16 flex items-center justify-center shrink-0 ${
                            nextMedication.category === 'liquids' ? 'bg-orange-100' : 'bg-blue-100'
                        }`}>
                            <span className="text-2xl">
                                {nextMedication.category === 'liquids' ? '💧' : '💊'}
                            </span>
                        </div>

                        {/* Textos */}
                        <div className="flex flex-col flex-1">
                            <h3 className="text-black font-bold text-lg">{nextMedication.name}</h3>
                            <div className="flex gap-4 mt-1">
                                <div>
                                    <p className="text-gray-400 text-xs">Dosagem</p>
                                    <p className="text-gray-900 font-medium">{nextMedication.dosage}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs">Horário</p>
                                    <p className="text-gray-900 font-medium">
                                        {/* Formata a data para ex: 08:00 AM */}
                                        {nextMedication.nextDoseAt 
                                            ? new Date(nextMedication.nextDoseAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) 
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
                        Confirm taking it
                    </button>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-[24px] text-center border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">Você não tem remédios pendentes.</p>
                </div>
            )}
        </main>
    );
}
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react"
import type { Medication } from "../types/medType";
import pill from "../assets/pill-1.webp"
import { EllipsisVertical, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";


export function MedicationList() {
    const [medications, setMedications] = useState<Medication[]>([])

    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const toggleMenu = (id: string) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };



    useEffect(() => {
        const LoadMedications = async () => {
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
        LoadMedications();
    }, []);

    return (
        <div className="flex flex-col bg-linear-to-b from-[#eef1f4] to-[#f7f8fa] to-35% min-h-screen items-center justify-start w-full px-4 gap-7 pt-15">
            <Search className="absolute top-18 left-10 opacity-50" />
            <div className="flex relative w-full">
                <Input className="pl-15" placeholder="Procurar remédios..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                {medications.map((med) => {
                    return (
                        <div key={med.id} className="flex p-4 rounded-3xl shadow gap-3 relative bg-white/70 shadow-[0_4px_20px_rgba(0,0,0,0.06)] backdrop-blur-md">
                            <div className="w-18 h-18 rounded-2xl
  bg-[#d8e9f2]
  flex items-center justify-center
  shadow-inner"><img src={pill} width={70} alt={med.name} className="w-10 drop-shadow-[0_6px_10px_rgba(0,0,0,0.18)]" /></div>
                            <div className="flex flex-col items-start">
                                <h3 className="text-[18px] font-semibold tracking-tight">{med.name}</h3>
                                <p className="text-gray-600">{med.dosage}
                                </p>
                                <p className="text-gray-600">{med.scheduleType === 'fixed'
                                    ? 'Daily'
                                    : `${med.intervalHours} - ${med.intervalHours} hours`
                                }</p>
                            </div>
                            <div className="flex flex-1 flex-col items-end justify-between"><button onClick={() => toggleMenu(med.id)}><EllipsisVertical className="" /></button>
                            {openMenuId === med.id && (
                                    <div className="absolute right-0 top-8 mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10 animate-in fade-in slide-in-from-top-2 duration-200">
                                        
                                        <button 
                                            onClick={() => {/* Lógica de Editar */}}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <Pencil size={16} />
                                            Editar
                                        </button>
                                
                                        <button 
                                            onClick={() => {/* Lógica de Excluir */}}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                            Excluir
                                        </button>
                                    </div>
                                )}
                                <p className="text-gray-600 capitalize">Próximo: {med.nextDoseAt ? new Date(med.nextDoseAt).toLocaleTimeString("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true
}) : "Aguardando"} </p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <Link to="/add">
                <Plus className="fixed bottom-28 right-6
w-14 h-14
rounded-full
bg-[#B7E13A]
text-black
p-3
shadow-[0_10px_30px_rgba(0,0,0,0.12)]
backdrop-blur-xl
transition-all
active:scale-95 z-50" /></Link>
        </div>
    )
}
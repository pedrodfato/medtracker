import { Input } from "@/components/ui/input";
import {useState, useEffect} from "react"
import type { Medication } from "../types/medType";
import pill from "../assets/pill-1.webp"
import { EllipsisVertical, Search } from "lucide-react";


export function MedicationList() {
    const [medications, setMedications] = useState<Medication[]>([])

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

    return(
        <div className="flex flex-col bg-linear-to-b from-[#F2F3F8] to-[#FFFFFF] to-35% min-h-screen items-center justify-start w-full px-4 gap-7 pt-15">
            <Search className="absolute top-18 left-10 opacity-50" />
            <div className="flex relative w-full">
            <Input className="pl-15" placeholder="Procurar remédios..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                {medications.map((med) => (
                    <div key={med.id} className="flex bg-white p-4 rounded-lg shadow gap-5 relative">
                        <img src={pill} width={70} alt={med.name} className="rounded-lg bg-red-500 p-3" />
                        <div className="flex flex-col items-start">
                        <h3 className="text-lg font-bold">{med.name}</h3>
                        <p className="text-gray-600">{med.dosage}</p>
                        <p className="text-gray-600">{med.frequencyHours} hours</p>
                        </div>
                        <div className="flex flex-1 flex-col items-end justify-between"><EllipsisVertical className="" />
                        <p className="text-gray-600">Next 09:00am</p>                       
                        </div>
                        {/* <EllipsisVertical className="absolute top-4 right-4" /> */}
                    </div>
                ))}
            </div>
        </div>
    )
}
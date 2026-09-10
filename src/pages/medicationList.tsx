import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react"
import type { Medication } from "../types/medType";
import { EllipsisVertical, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../lib/api";
import { getMedicationVisual, type MedicationCategory } from "../lib/medicationVisuals";
import { Button } from "../components/button";

const CATEGORY_FILTERS: { label: string; value: MedicationCategory }[] = [
    { label: "Pílulas", value: "pill" },
    { label: "Líquidos", value: "drop" },
    { label: "Outros", value: "vitamin" },
];

export function MedicationList() {
    const navigate = useNavigate();
    const [medications, setMedications] = useState<Medication[]>([])
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState<MedicationCategory | null>(null);
    const [medicationToDelete, setMedicationToDelete] = useState<Medication | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const toggleMenu = (id: string) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    useEffect(() => {
        const LoadMedications = async () => {
            try {
                const response = await fetch(`${API_URL}/medications`, {
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

    const handleEdit = (med: Medication) => {
        setOpenMenuId(null);
        navigate("/add", { state: { medication: med } });
    };

    const handleDelete = async () => {
        if (!medicationToDelete) return;
        setIsDeleting(true);
        setDeleteError("");
        try {
            const response = await fetch(`${API_URL}/medications/${medicationToDelete.id}`, {
                method: "DELETE",
                credentials: 'include',
            });
            if (!response.ok) throw new Error("Falha ao excluir");
            setMedications((prev) => prev.filter((m) => m.id !== medicationToDelete.id));
            setMedicationToDelete(null);
        } catch (error) {
            console.error('Erro ao excluir remédio:', error);
            setDeleteError("Não foi possível excluir. Tente novamente.");
        } finally {
            setIsDeleting(false);
        }
    };

    const closeDeleteDialog = () => {
        setMedicationToDelete(null);
        setDeleteError("");
    };

    const filteredMedications = medications.filter((med) => {
        const matchesSearch = med.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeCategory === null || med.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="flex flex-col bg-linear-to-b from-[#eef1f4] to-[#f7f8fa] to-35% min-h-screen items-center justify-start w-full px-4 gap-4 pt-15">
            <div className="flex relative w-full">
                <Search className="absolute top-1/2 -translate-y-1/2 left-4 opacity-50" size={18} />
                <Input
                    className="pl-11"
                    placeholder="Procurar remédios..."
                    value={search}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                />
            </div>

            <div className="flex gap-2 w-full overflow-x-auto">
                <button
                    onClick={() => setActiveCategory(null)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        activeCategory === null ? "bg-primary text-primary-foreground" : "bg-white text-gray-500"
                    }`}
                >
                    Todos
                </button>
                {CATEGORY_FILTERS.map(({ label, value }) => (
                    <button
                        key={value}
                        onClick={() => setActiveCategory(value)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                            activeCategory === value ? "bg-primary text-primary-foreground" : "bg-white text-gray-500"
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                {filteredMedications.map((med) => {
                    const visual = getMedicationVisual(med.category as MedicationCategory);
                    return (
                        <div key={med.id} className="flex p-4 rounded-3xl shadow gap-3 relative bg-white/70 shadow-[0_4px_20px_rgba(0,0,0,0.06)] backdrop-blur-md">
                            <div className={`w-18 h-18 rounded-2xl ${visual.bgClass} flex items-center justify-center shrink-0 text-3xl`}>
                                {visual.emoji}
                            </div>
                            <div className="flex flex-col items-start">
                                <h3 className="text-[18px] font-semibold tracking-tight">{med.name}</h3>
                                <p className="text-gray-600">{med.dosage}</p>
                                <p className="text-gray-600">{med.scheduleType === 'fixed'
                                    ? 'Daily'
                                    : med.scheduleType === 'weekly'
                                        ? 'Semanal'
                                        : `${med.intervalHours} - ${med.intervalHours} hours`
                                }</p>
                            </div>
                            <div className="flex flex-1 flex-col items-end justify-between"><button onClick={() => toggleMenu(med.id)}><EllipsisVertical className="" /></button>
                            {openMenuId === med.id && (
                                    <div className="absolute right-0 top-8 mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10 animate-in fade-in slide-in-from-top-2 duration-200">

                                        <button
                                            onClick={() => handleEdit(med)}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <Pencil size={16} />
                                            Editar
                                        </button>

                                        <button
                                            onClick={() => { setOpenMenuId(null); setMedicationToDelete(med); }}
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
bg-primary
text-primary-foreground
p-3
shadow-[0_10px_30px_rgba(0,0,0,0.12)]
backdrop-blur-xl
transition-all
active:scale-95 z-50" /></Link>

            {medicationToDelete && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Excluir remédio?</h2>
                        <p className="text-gray-600 text-sm mb-6">
                            Tem certeza que deseja excluir <strong>{medicationToDelete.name}</strong>? Essa ação não pode ser desfeita.
                        </p>
                        {deleteError && <p className="text-red-500 text-sm mb-4">{deleteError}</p>}
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="secondary"
                                className="flex-1"
                                onClick={closeDeleteDialog}
                                disabled={isDeleting}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="button"
                                variant="inverted"
                                className="flex-1 bg-red-600 text-white"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Excluindo..." : "Excluir"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/button";
import { API_URL } from "../lib/api";
import { getMedicationVisual, type MedicationCategory } from "../lib/medicationVisuals";
import type { Medication } from "../types/medType";

export function Reminder() {
    const location = useLocation();
    const navigate = useNavigate();
    const medication = (location.state as { medication?: Medication } | null)?.medication;
    const [now, setNow] = useState(new Date());
    const [snoozed, setSnoozed] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!medication) {
            navigate("/dashboard");
        }
    }, [medication, navigate]);

    if (!medication) return null;

    const visual = getMedicationVisual(medication.category as MedicationCategory);

    const handleTaken = async () => {
        await fetch(`${API_URL}/medication/${medication.id}/take`, {
            method: "POST",
            credentials: 'include',
        });
        navigate("/dashboard");
    };

    const handleSnooze = () => {
        setSnoozed(true);
        setTimeout(() => setSnoozed(false), 5 * 60 * 1000);
    };

    const timeLabel = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    return (
        <main className="flex flex-col min-h-screen items-center justify-around bg-white px-8 text-center">
            <p className="text-5xl font-bold text-neutral">{timeLabel}</p>

            <div className="relative flex items-center justify-center">
                <span className="absolute w-48 h-48 rounded-full bg-primary/10 animate-ping" />
                <span className="absolute w-36 h-36 rounded-full bg-primary/20" />
                <div className={`relative w-28 h-28 rounded-full ${visual.bgClass} flex items-center justify-center text-5xl`}>
                    {visual.emoji}
                </div>
            </div>

            <div>
                <h1 className="text-2xl font-bold text-neutral">{medication.name}</h1>
                <p className="text-gray-500">Tomar 1 dose ({medication.dosage})</p>
            </div>

            <div className="w-full flex flex-col gap-3">
                <Button variant="primary" className="w-full" onClick={handleTaken}>
                    Tomei
                </Button>
                <Button variant="secondary" className="w-full" onClick={handleSnooze} disabled={snoozed}>
                    {snoozed ? "Vou lembrar em 5 min" : "Lembrar em 5 min"}
                </Button>
            </div>
        </main>
    );
}

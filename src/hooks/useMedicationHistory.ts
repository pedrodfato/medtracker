import { useEffect, useState } from "react";
import { API_URL } from "../lib/api";
import type { MedicationHistory } from "../types/medType";

// Loads the selected medication's history. Results for a previous selection are
// ignored, and a failure only counts for the medication that failed.
export function useMedicationHistory(selectedId: string | null) {
    const [history, setHistory] = useState<MedicationHistory | null>(null);
    const [failedId, setFailedId] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedId) return;
        let cancelled = false;
        const load = async () => {
            try {
                const response = await fetch(`${API_URL}/medications/${selectedId}/history`, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (!response.ok) throw new Error('Failed to fetch history');
                const responseData = await response.json();
                if (!cancelled) setHistory(responseData.data);
            } catch (error) {
                console.error('Error fetching medication history:', error);
                if (!cancelled) setFailedId(String(selectedId));
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, [selectedId]);

    const isCurrent = history !== null && String(history.medicationId) === String(selectedId);
    return {
        history: isCurrent ? history : null,
        failed: !isCurrent && failedId !== null && failedId === String(selectedId),
    };
}

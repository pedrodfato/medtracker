import { useEffect, useState } from "react";

export function useTimedOut(active: boolean, ms: number): boolean {
    const [timedOut, setTimedOut] = useState(false);

    useEffect(() => {
        if (!active) {
            setTimedOut(false);
            return;
        }
        const id = setTimeout(() => setTimedOut(true), ms);
        return () => clearTimeout(id);
    }, [active, ms]);

    return timedOut;
}

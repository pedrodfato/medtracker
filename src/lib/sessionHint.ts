import { useEffect } from "react";

// A device-local note that this browser had a valid session last time. It holds
// no credentials: the cookie still decides access, the hint only lets the route
// guards render right away instead of waiting for the session check (which can
// take seconds when the API is cold).
const KEY = "medtracker:signed-in";

export function hasSessionHint(): boolean {
    try {
        return localStorage.getItem(KEY) === "1";
    } catch {
        return false;
    }
}

export function setSessionHint(signedIn: boolean) {
    try {
        if (signedIn) localStorage.setItem(KEY, "1");
        else localStorage.removeItem(KEY);
    } catch {
        // Storage unavailable (private mode etc.): guards just wait for the check.
    }
}

/** Keeps the hint in sync once the real session check settles. */
export function useSyncSessionHint(signedIn: boolean, isPending: boolean, failed: boolean) {
    useEffect(() => {
        // A network error says nothing about the session, so keep the old hint.
        if (isPending || failed) return;
        setSessionHint(signedIn);
    }, [signedIn, isPending, failed]);
}

import { authClient } from "../lib/auth-client"
import { Navigate } from "react-router-dom"
import { hasSessionHint, useSyncSessionHint } from "../lib/sessionHint"

export const OpenRoute = ({ children }: { children: React.ReactNode }) => {
    const {data: session, isPending, error} = authClient.useSession();
    useSyncSessionHint(!!session, isPending, !!error);

    // Likely signed in: head to the dashboard, whose guard renders right away.
    // Otherwise show the public page while the check runs; a session that turns
    // up later still redirects.
    if (session || (isPending && hasSessionHint())) {
        return <Navigate to="/dashboard"/>
    }

    return <>{children}</>
}

export default OpenRoute;

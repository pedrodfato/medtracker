import { authClient } from "../lib/auth-client"
import { Navigate } from "react-router-dom"
import { useTimedOut } from "../hooks/useTimedOut"
import { Button } from "./button"
import { SplashScreen } from "./splashScreen"
import { hasSessionHint, useSyncSessionHint } from "../lib/sessionHint"

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const {data: session, isPending, error} = authClient.useSession();
    useSyncSessionHint(!!session, isPending, !!error);
    // Signed in on this device before: show the page now and let the check
    // finish in the background (an expired session still redirects below).
    const optimistic = isPending && hasSessionHint();
    const timedOut = useTimedOut(isPending && !optimistic, 45000);

    if (isPending && timedOut) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
                <p className="text-gray-600">Não foi possível verificar sua sessão. Verifique sua conexão.</p>
                <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
            </div>
        )
    }

    if (optimistic) {
        return <>{children}</>
    }

    if (isPending) {
        return <SplashScreen />
    }

    if (!session) {
        return <Navigate to="/"/>
    }

    return <>{children}</>
}

export default PrivateRoute;
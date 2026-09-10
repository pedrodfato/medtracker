import { authClient } from "../lib/auth-client"
import { Navigate } from "react-router-dom"
import { useTimedOut } from "../hooks/useTimedOut"
import { Button } from "./button"

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const {data: session, isPending} = authClient.useSession();
    const timedOut = useTimedOut(isPending, 45000);

    if (isPending && timedOut) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
                <p className="text-gray-600">Não foi possível verificar sua sessão. Verifique sua conexão.</p>
                <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
            </div>
        )
    }

    if (isPending) {
        return <div>Carregando...</div>
    }

    if (!session) {
        return <Navigate to="/"/>
    }

    return <>{children}</>
}

export default PrivateRoute;
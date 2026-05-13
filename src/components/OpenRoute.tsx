import { authClient } from "../lib/auth-client"
import { Navigate } from "react-router-dom"

export const OpenRoute = ({ children }: { children: React.ReactNode }) => {
    const {data: session, isPending} = authClient.useSession();

    if (isPending) {
        return <div>Loading...</div>
    }

    if (session) {
        return <Navigate to="/dashboard"/>
    }

    return <>{children}</>
}

export default OpenRoute;
import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"
import { API_URL } from "./api"

export const authClient = createAuthClient({
    baseURL: API_URL,
    fetchOptions: {
        // Bounds signIn/signUp/signOut calls, which have no timeout otherwise.
        // useSession()'s internal fetch manages its own AbortController, so this
        // option doesn't apply there — see useTimedOut in PrivateRoute/OpenRoute.
        timeout: 25000,
    },
    plugins: [
        inferAdditionalFields({
            user: {
                timezone: {
                    type: "string",
                    required: false,
                },
            },
        }),
    ],
})

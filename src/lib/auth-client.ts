import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"
import { API_URL } from "./api"

export const authClient = createAuthClient({
    // API_URL has a path (/backend), and Better Auth treats a path in baseURL
    // as the full auth base, so the /api/auth part must be explicit.
    baseURL: `${API_URL}/api/auth`,
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
                reminderEnabled: {
                    type: "boolean",
                    required: false,
                },
                reminderLeadMinutes: {
                    type: "number",
                    required: false,
                },
            },
        }),
    ],
})

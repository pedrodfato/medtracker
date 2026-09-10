import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"
import { API_URL } from "./api"

export const authClient = createAuthClient({
    baseURL: API_URL,
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

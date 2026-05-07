import { createAuthClient } from "better-auth/react"
import 'dotenv/config'

const globalProcess = (globalThis as any).process
const authClient: ReturnType<typeof createAuthClient> = createAuthClient({
    baseURL: globalProcess?.env?.apiURL
})

export default authClient;
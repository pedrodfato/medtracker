// The API is reached through this site's own origin (`/backend`, proxied by
// vercel.json in production and by Vite in dev), so the session cookie is
// first-party and survives browsers that block third-party cookies.
const configured = import.meta.env.VITE_API_URL || "/backend";

export const API_URL = new URL(configured, window.location.origin).toString().replace(/\/+$/, "");

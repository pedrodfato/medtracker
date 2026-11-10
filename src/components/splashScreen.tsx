import { Logo } from "./logo";

export function SplashScreen() {
    return (
        <div role="status" aria-label="Carregando" className="flex min-h-svh flex-col items-center justify-center gap-6">
            <Logo className="animate-pulse text-2xl" />
            <span className="h-6 w-6 animate-spin rounded-full border-[3px] border-[#A3D911]/30 border-t-[#5c7d00]" />
        </div>
    );
}

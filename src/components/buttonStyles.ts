import { cn } from "@/lib/utils";

export type ButtonVariant = 'primary' | 'secondary' | 'inverted' | 'outline';

const VARIANTS: Record<ButtonVariant, string> = {
    primary: 'bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(163,217,17,0.35)] hover:brightness-105',
    secondary: 'glass text-gray-800 hover:bg-white/75',
    inverted: 'bg-gray-900 text-white hover:bg-gray-800',
    outline: 'border border-gray-900/15 bg-white/40 text-gray-900 hover:bg-white/70',
};

export function buttonClasses(variant: ButtonVariant, className = ""): string {
    return cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-[15px] font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
        VARIANTS[variant],
        className,
    );
}

import type { LucideIcon } from "lucide-react";
import { GlassCard } from "./glassCard";

const TONES = {
    lime: "bg-primary/25 text-[#4d6b00]",
    mint: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    rose: "bg-rose-100 text-rose-600",
};

type StatCardProps = {
    icon: LucideIcon;
    label: string;
    value: string;
    hint?: string;
    tone?: keyof typeof TONES;
};

export function StatCard({ icon: Icon, label, value, hint, tone = "lime" }: StatCardProps) {
    return (
        <GlassCard className="flex flex-col gap-3 p-4 text-start">
            <div className="flex items-center gap-3">
                <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${TONES[tone]}`}>
                    <Icon className="size-5" />
                </span>
                <p className="text-sm text-gray-600">{label}</p>
            </div>
            <p className="font-heading text-2xl font-semibold tracking-tight text-gray-900">{value}</p>
            {hint && <p className="text-xs text-gray-500">{hint}</p>}
        </GlassCard>
    );
}

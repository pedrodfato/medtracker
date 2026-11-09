import type { LucideIcon } from "lucide-react";

type FieldProps = {
    label: string;
    htmlFor: string;
    icon?: LucideIcon;
    hint?: string;
    error?: string;
    children: React.ReactNode;
};

// Label above, optional icon inside the control (give the input `pl-11`), hint or error below.
export function Field({ label, htmlFor, icon: Icon, hint, error, children }: FieldProps) {
    return (
        <div className="flex flex-col gap-1.5 text-start">
            <label htmlFor={htmlFor} className="text-[13px] font-medium text-gray-700">{label}</label>
            <div className="relative">
                {Icon && (
                    <Icon aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-gray-400" />
                )}
                {children}
            </div>
            {error ? (
                <p className="text-xs text-red-500">{error}</p>
            ) : hint ? (
                <p className="text-xs text-gray-500">{hint}</p>
            ) : null}
        </div>
    );
}

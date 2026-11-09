type Option<T extends string> = { value: T; label: React.ReactNode };

type SegmentedControlProps<T extends string> = {
    value: T;
    onChange: (value: T) => void;
    options: Option<T>[];
    ariaLabel: string;
};

export function SegmentedControl<T extends string>({ value, onChange, options, ariaLabel }: SegmentedControlProps<T>) {
    return (
        <div
            role="radiogroup"
            aria-label={ariaLabel}
            className="grid gap-1 rounded-2xl bg-gray-900/5 p-1"
            style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
        >
            {options.map((option) => {
                const active = option.value === value;
                return (
                    <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => onChange(option.value)}
                        className={`h-10 rounded-xl px-2 text-[13px] font-medium transition-all ${
                            active
                                ? "bg-white text-gray-900 shadow-[0_2px_8px_rgba(16,24,40,0.08)]"
                                : "text-gray-500 hover:text-gray-800"
                        }`}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}

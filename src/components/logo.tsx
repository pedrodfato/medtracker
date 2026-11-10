import mark from "../assets/logo-mark.svg";

/** Symbol + wordmark; scale it with a text-size class (e.g. text-2xl). */
export function Logo({ className = "" }: { className?: string }) {
    return (
        <span className={`inline-flex items-center gap-[0.35em] ${className}`}>
            <img src={mark} alt="" className="h-[1.9em] w-[1.9em]" />
            <span className="font-heading font-bold leading-none tracking-tight text-[#10191A]">MedTracker</span>
        </span>
    );
}

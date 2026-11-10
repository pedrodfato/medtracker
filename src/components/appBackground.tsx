export function AppBackground() {
    return (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#F3F6EE]">
            {/* Kept faint so text and the logo keep their contrast. */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute -top-40 -left-32 h-[520px] w-[520px] rounded-full bg-[#A3D911]/60 blur-[110px]" />
                <div className="absolute top-1/3 -right-40 h-[560px] w-[560px] rounded-full bg-[#7FE0B0]/55 blur-[120px]" />
                <div className="absolute -bottom-48 left-1/4 h-[480px] w-[480px] rounded-full bg-[#2F9E5B]/35 blur-[130px]" />
            </div>
        </div>
    );
}

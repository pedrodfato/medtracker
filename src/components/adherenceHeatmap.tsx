import { useEffect, useRef, useState } from "react";
import type { DayAdherence } from "../types/medType";

type Props = {
    days: DayAdherence[];
    expected: number;
    taken: number;
};

const ROW_LABELS = ["", "Seg", "", "Qua", "", "Sex", ""];

const toDate = (date: string) => new Date(`${date}T12:00:00`);

function cellClass(day: DayAdherence | null): string {
    if (!day) return "bg-transparent";
    if (day.expected === 0) return day.taken > 0 ? "bg-green-600" : "bg-gray-100";
    if (day.taken >= day.expected) return "bg-green-600";
    if (day.taken > 0) return "bg-green-300";
    return "bg-white border border-gray-300";
}

function describe(day: DayAdherence): string {
    if (day.expected === 0) {
        return day.taken > 0
            ? `sem dose prevista, ${day.taken} ${day.taken === 1 ? "tomada" : "tomadas"}`
            : "sem dose prevista";
    }
    return `${day.taken} de ${day.expected} ${day.expected === 1 ? "dose" : "doses"}`;
}

export function AdherenceHeatmap({ days, expected, taken }: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [selected, setSelected] = useState<DayAdherence | null>(null);

    // Opens on the most recent days.
    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }, [days]);

    if (days.length === 0) {
        return <p className="text-sm text-gray-500">O tratamento ainda não começou.</p>;
    }

    // Weeks start on Sunday, like GitHub; pad the first and last week.
    const cells: (DayAdherence | null)[] = [
        ...Array<null>(toDate(days[0]!.date).getDay()).fill(null),
        ...days,
    ];
    while (cells.length % 7 !== 0) cells.push(null);
    const weeks: (DayAdherence | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

    let lastMonth = -1;
    const monthLabels = weeks.map((week) => {
        const first = week.find((d) => d !== null);
        if (!first) return "";
        const month = toDate(first.date).getMonth();
        if (month === lastMonth) return "";
        lastMonth = month;
        return toDate(first.date).toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
    });

    const rate = expected === 0 ? null : Math.round((taken / expected) * 100);

    return (
        <div className="flex flex-col gap-3">
            <div className="flex gap-1">
                <div className="flex flex-col gap-1 pt-5 pr-1 text-[10px] text-gray-500">
                    {ROW_LABELS.map((label, i) => (
                        <span key={i} className="h-3.5 leading-[14px]">{label}</span>
                    ))}
                </div>
                <div ref={scrollRef} className="overflow-x-auto pb-1">
                    <div className="flex gap-1">
                        {weeks.map((week, w) => (
                            <div key={w} className="flex flex-col gap-1">
                                <span className="h-4 whitespace-nowrap text-[10px] capitalize text-gray-500">
                                    {monthLabels[w]}
                                </span>
                                {week.map((day, d) =>
                                    day ? (
                                        <button
                                            key={d}
                                            type="button"
                                            onClick={() => setSelected(day)}
                                            aria-label={`${day.date}: ${describe(day)}`}
                                            className={`w-3.5 h-3.5 rounded-[3px] ${cellClass(day)} ${
                                                selected?.date === day.date ? "ring-2 ring-gray-900" : ""
                                            }`}
                                        />
                                    ) : (
                                        <div key={d} className="w-3.5 h-3.5" />
                                    ),
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <p className="min-h-5 text-sm text-gray-700">
                {selected
                    ? `${toDate(selected.date).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}: ${describe(selected)}`
                    : "Toque num dia para ver os detalhes."}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                    {rate === null ? "Nenhuma dose prevista ainda" : `${taken} de ${expected} doses · ${rate}%`}
                </span>
                <span className="flex items-center gap-1">
                    Menos
                    <span className="w-3 h-3 rounded-[3px] bg-gray-100" />
                    <span className="w-3 h-3 rounded-[3px] bg-white border border-gray-300" />
                    <span className="w-3 h-3 rounded-[3px] bg-green-300" />
                    <span className="w-3 h-3 rounded-[3px] bg-green-600" />
                    Mais
                </span>
            </div>
        </div>
    );
}

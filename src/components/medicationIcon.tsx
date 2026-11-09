import { useId } from "react";
import type { MedicationForm } from "../lib/medicationAppearance";

function mix(hex: string, target: string, amount: number): string {
    const parse = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const a = parse(hex);
    const b = parse(target);
    return `#${a
        .map((v, i) => Math.round(v + ((b[i] ?? v) - v) * amount).toString(16).padStart(2, "0"))
        .join("")}`;
}

const tint = (c: string, t: number) => mix(c, "#ffffff", t);
const shade = (c: string, t: number) => mix(c, "#000000", t);

type Props = {
    form: MedicationForm;
    color: string;
    size?: number;
    className?: string;
};

// Volumetric medication icons drawn in SVG, recolored from a single base color.
export function MedicationIcon({ form, color, size = 56, className }: Props) {
    const id = useId().replace(/[^a-zA-Z0-9]/g, "");
    const g = (name: string) => `${id}-${name}`;
    const url = (name: string) => `url(#${g(name)})`;

    return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true">
            <defs>
                {/* Cylinder shading across the short axis of the object. */}
                <linearGradient id={g("body")} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor={tint(color, 0.5)} />
                    <stop offset="0.45" stopColor={color} />
                    <stop offset="1" stopColor={shade(color, 0.3)} />
                </linearGradient>
                <linearGradient id={g("bodyX")} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor={shade(color, 0.25)} />
                    <stop offset="0.35" stopColor={tint(color, 0.25)} />
                    <stop offset="0.7" stopColor={color} />
                    <stop offset="1" stopColor={shade(color, 0.35)} />
                </linearGradient>
                <radialGradient id={g("top")} cx="0.38" cy="0.32" r="0.8">
                    <stop offset="0" stopColor={tint(color, 0.55)} />
                    <stop offset="0.6" stopColor={color} />
                    <stop offset="1" stopColor={shade(color, 0.12)} />
                </radialGradient>
                <linearGradient id={g("side")} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor={shade(color, 0.35)} />
                    <stop offset="0.5" stopColor={shade(color, 0.12)} />
                    <stop offset="1" stopColor={shade(color, 0.4)} />
                </linearGradient>
                <linearGradient id={g("white")} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#ffffff" />
                    <stop offset="0.5" stopColor="#f1f3f5" />
                    <stop offset="1" stopColor="#c9cfd6" />
                </linearGradient>
                <linearGradient id={g("whiteX")} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#c9cfd6" />
                    <stop offset="0.4" stopColor="#ffffff" />
                    <stop offset="1" stopColor="#bfc6ce" />
                </linearGradient>
                <filter id={g("blur")} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2.4" />
                </filter>
                <filter id={g("soft")} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.2" />
                </filter>
            </defs>

            <ellipse cx="50" cy="88" rx="30" ry="4.5" fill="#1f2d14" opacity="0.18" filter={url("blur")} />

            {form === "tablet_round" && (
                <g>
                    <path d="M14 48 v9 a36 17 0 0 0 72 0 v-9 z" fill={url("side")} />
                    <ellipse cx="50" cy="48" rx="36" ry="17" fill={url("top")} />
                    <ellipse cx="50" cy="48" rx="36" ry="17" fill="none" stroke={shade(color, 0.2)} strokeOpacity="0.35" />
                    <path d="M22 48.5 Q50 51 78 48.5" fill="none" stroke={shade(color, 0.3)} strokeOpacity="0.45" strokeWidth="1.8" strokeLinecap="round" />
                    <ellipse cx="38" cy="41" rx="14" ry="4.5" fill="#fff" opacity="0.6" filter={url("soft")} />
                </g>
            )}

            {form === "tablet_oval" && (
                <g transform="rotate(-22 50 52)">
                    <path d="M10 48 v8 a40 14 0 0 0 80 0 v-8 z" fill={url("side")} />
                    <ellipse cx="50" cy="48" rx="40" ry="14" fill={url("top")} />
                    <ellipse cx="50" cy="48" rx="40" ry="14" fill="none" stroke={shade(color, 0.2)} strokeOpacity="0.35" />
                    <path d="M50 36 Q51.5 48 50 60" fill="none" stroke={shade(color, 0.3)} strokeOpacity="0.4" strokeWidth="1.6" strokeLinecap="round" />
                    <ellipse cx="34" cy="42" rx="15" ry="3.5" fill="#fff" opacity="0.6" filter={url("soft")} />
                </g>
            )}

            {form === "capsule" && (
                <g transform="rotate(-38 50 50)">
                    <path d="M50 35 H27 A15 15 0 0 0 27 65 H50 Z" fill={url("body")} />
                    <path d="M50 35 H73 A15 15 0 0 1 73 65 H50 Z" fill={url("white")} />
                    <rect x="47.5" y="35" width="5" height="30" fill={shade(color, 0.08)} opacity="0.25" />
                    <line x1="50" y1="35" x2="50" y2="65" stroke={shade(color, 0.35)} strokeOpacity="0.35" strokeWidth="1" />
                    <rect x="20" y="39" width="60" height="5" rx="2.5" fill="#fff" opacity="0.6" filter={url("soft")} />
                </g>
            )}

            {form === "drops" && (
                <g>
                    <path d="M36 44 Q36 35 44 34 H56 Q64 35 64 44 Z" fill={url("bodyX")} />
                    <rect x="30" y="42" width="40" height="44" rx="10" fill={url("bodyX")} />
                    <rect x="41" y="22" width="18" height="14" rx="3" fill={url("whiteX")} />
                    <path d="M45 23 Q50 8 55 23 Z" fill={url("whiteX")} />
                    <rect x="30" y="56" width="40" height="17" fill="#fff" opacity="0.88" />
                    <rect x="36" y="61" width="28" height="3" rx="1.5" fill={shade(color, 0.15)} opacity="0.8" />
                    <rect x="36" y="66" width="18" height="2.5" rx="1.25" fill={shade(color, 0.15)} opacity="0.5" />
                    <rect x="34" y="45" width="5" height="38" rx="2.5" fill="#fff" opacity="0.45" filter={url("soft")} />
                    <path d="M81 20 C81 20 73 30 73 35.5 a8 8 0 0 0 16 0 C89 30 81 20 81 20 Z" fill={url("top")} />
                    <ellipse cx="78.5" cy="34" rx="2" ry="3" fill="#fff" opacity="0.7" />
                </g>
            )}

            {form === "syrup" && (
                <g>
                    <rect x="40" y="26" width="20" height="12" fill={url("bodyX")} />
                    <rect x="37" y="14" width="26" height="14" rx="3" fill={url("whiteX")} />
                    {[42, 47, 52, 57].map((x) => (
                        <line key={x} x1={x} y1="16" x2={x} y2="26" stroke="#aeb6bf" strokeWidth="1" opacity="0.6" />
                    ))}
                    <rect x="27" y="36" width="46" height="50" rx="9" fill={url("bodyX")} />
                    <rect x="27" y="52" width="46" height="22" fill="#fff" opacity="0.9" />
                    <rect x="33" y="58" width="30" height="3.5" rx="1.75" fill={shade(color, 0.15)} opacity="0.8" />
                    <rect x="33" y="64" width="20" height="2.5" rx="1.25" fill={shade(color, 0.15)} opacity="0.5" />
                    <rect x="31" y="39" width="5" height="44" rx="2.5" fill="#fff" opacity="0.4" filter={url("soft")} />
                    <path d="M8 70 H28 L25 88 H11 Z" fill="#fff" opacity="0.75" />
                    <path d="M9.5 79 H26.5 L25 88 H11 Z" fill={color} opacity="0.85" />
                    <path d="M8 70 H28 L25 88 H11 Z" fill="none" stroke="#b9c1ca" strokeWidth="1" />
                </g>
            )}

            {form === "injection" && (
                <g transform="rotate(-40 50 50)">
                    <rect x="3" y="39" width="5" height="22" rx="2" fill="#c3cad2" />
                    <rect x="7" y="47" width="18" height="6" fill={url("white")} />
                    <rect x="21" y="36" width="4" height="28" rx="1.5" fill="#c3cad2" />
                    <rect x="24" y="41" width="44" height="18" rx="3" fill="#fff" opacity="0.75" />
                    <rect x="34" y="43" width="34" height="14" fill={url("body")} />
                    <rect x="24" y="41" width="44" height="18" rx="3" fill="none" stroke="#aab3bd" strokeWidth="1.2" />
                    {[38, 44, 50, 56, 62].map((x) => (
                        <line key={x} x1={x} y1="41" x2={x} y2="46" stroke="#7d8792" strokeWidth="1" />
                    ))}
                    <rect x="68" y="44" width="8" height="12" rx="2" fill={shade(color, 0.2)} />
                    <rect x="76" y="49" width="20" height="2" fill="#a9b2bc" />
                    <rect x="27" y="43" width="38" height="3" rx="1.5" fill="#fff" opacity="0.7" />
                </g>
            )}

            {form === "ointment" && (
                <g transform="rotate(-28 50 52)">
                    <path d="M16 36 H64 Q75 38 77 45 V55 Q75 62 64 64 H16 Z" fill={url("body")} />
                    <rect x="9" y="33" width="10" height="34" rx="1.5" fill={shade(color, 0.12)} />
                    {[38, 43, 48, 53, 58, 63].map((y) => (
                        <line key={y} x1="10" y1={y} x2="18" y2={y} stroke={shade(color, 0.35)} strokeOpacity="0.4" strokeWidth="1" />
                    ))}
                    <rect x="77" y="42" width="15" height="16" rx="3" fill={url("white")} />
                    <rect x="27" y="42" width="32" height="16" rx="2" fill="#fff" opacity="0.88" />
                    <rect x="32" y="47" width="22" height="3" rx="1.5" fill={shade(color, 0.15)} opacity="0.8" />
                    <rect x="22" y="38.5" width="48" height="3.5" rx="1.75" fill="#fff" opacity="0.6" filter={url("soft")} />
                </g>
            )}

            {form === "sachet" && (
                <g transform="rotate(-10 50 50)">
                    <rect x="22" y="16" width="56" height="68" rx="4" fill={url("bodyX")} />
                    <path
                        d="M22 16 H78 V25 l-3.5 -2.5 -3.5 2.5 -3.5 -2.5 -3.5 2.5 -3.5 -2.5 -3.5 2.5 -3.5 -2.5 -3.5 2.5 -3.5 -2.5 -3.5 2.5 -3.5 -2.5 -3.5 2.5 -3.5 -2.5 -3.5 2.5 -3.5 -2.5 -3.5 2.5 Z"
                        fill={shade(color, 0.15)}
                        opacity="0.55"
                    />
                    <path
                        d="M22 84 H78 V75 l-3.5 2.5 -3.5 -2.5 -3.5 2.5 -3.5 -2.5 -3.5 2.5 -3.5 -2.5 -3.5 2.5 -3.5 -2.5 -3.5 2.5 -3.5 -2.5 -3.5 2.5 -3.5 -2.5 -3.5 2.5 -3.5 -2.5 -3.5 2.5 -3.5 -2.5 Z"
                        fill={shade(color, 0.15)}
                        opacity="0.55"
                    />
                    <rect x="31" y="38" width="38" height="24" rx="4" fill="#fff" opacity="0.88" />
                    <rect x="37" y="45" width="26" height="3.5" rx="1.75" fill={shade(color, 0.2)} opacity="0.8" />
                    <rect x="37" y="51" width="16" height="2.5" rx="1.25" fill={shade(color, 0.2)} opacity="0.5" />
                    <path d="M27 28 L40 28 L27 70 Z" fill="#fff" opacity="0.25" />
                </g>
            )}
        </svg>
    );
}

export function formatTimeUntilNextDose(nextDoseAt: string | null): string | null {
    if (!nextDoseAt) return null;

    const diffMs = new Date(nextDoseAt).getTime() - Date.now();
    if (diffMs <= 0) return "Disponível agora";

    const hours = diffMs / (1000 * 60 * 60);
    if (hours < 24) return `${Math.round(hours)}h`;

    const days = Math.round(hours / 24);
    return days === 1 ? "1 dia" : `${days} dias`;
}

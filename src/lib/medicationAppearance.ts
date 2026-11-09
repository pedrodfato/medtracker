export type MedicationForm =
    | "tablet_round"
    | "tablet_oval"
    | "capsule"
    | "drops"
    | "syrup"
    | "injection"
    | "ointment"
    | "sachet";

export const MEDICATION_FORMS: { value: MedicationForm; label: string }[] = [
    { value: "tablet_round", label: "Comprimido" },
    { value: "tablet_oval", label: "Comprimido oval" },
    { value: "capsule", label: "Cápsula" },
    { value: "drops", label: "Gotas" },
    { value: "syrup", label: "Xarope" },
    { value: "injection", label: "Injeção" },
    { value: "ointment", label: "Pomada" },
    { value: "sachet", label: "Sachê" },
];

export const MEDICATION_COLORS: { value: string; label: string }[] = [
    { value: "#F2F2EE", label: "Branco" },
    { value: "#F6D365", label: "Amarelo" },
    { value: "#FFB070", label: "Laranja" },
    { value: "#F4A6B8", label: "Rosa" },
    { value: "#E5534B", label: "Vermelho" },
    { value: "#B79CF2", label: "Roxo" },
    { value: "#7DB9F5", label: "Azul" },
    { value: "#A3D911", label: "Verde" },
];

type Category = "pill" | "drop" | "vitamin";

// Keeps the list's category filter (Pílulas / Líquidos / Outros) meaningful.
export function categoryForForm(form: MedicationForm): Category {
    if (form === "tablet_round" || form === "tablet_oval" || form === "capsule") return "pill";
    if (form === "drops" || form === "syrup") return "drop";
    return "vitamin";
}

// Medications saved before forms existed only have a category.
export function appearanceOf(med: { form?: string | null; color?: string | null; category?: string }): {
    form: MedicationForm;
    color: string;
} {
    const known = MEDICATION_FORMS.find((f) => f.value === med.form)?.value;
    if (known) return { form: known, color: med.color ?? "#F2F2EE" };
    if (med.category === "drop") return { form: "drops", color: "#FFB070" };
    if (med.category === "vitamin") return { form: "capsule", color: "#F6D365" };
    return { form: "tablet_round", color: "#F2F2EE" };
}

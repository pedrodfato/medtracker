import { cn } from "@/lib/utils";

type GlassCardProps = React.HTMLAttributes<HTMLElement> & {
    as?: "section" | "div" | "article" | "aside";
};

export function GlassCard({ as: Tag = "section", className, ...rest }: GlassCardProps) {
    return <Tag className={cn("glass rounded-[24px] p-5", className)} {...rest} />;
}

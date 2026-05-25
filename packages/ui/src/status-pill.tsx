import { mergeClasses } from "./utils";

type Tone = "emerald" | "amber" | "sky" | "rose";

type StatusPillProps = {
    label: string;
    tone?: Tone;
};

const toneClasses: Record<Tone, string> = {
    emerald: "bg-emerald-500/15 text-emerald-300",
    amber: "bg-amber-500/15 text-amber-300",
    sky: "bg-sky-500/15 text-sky-300",
    rose: "bg-rose-500/15 text-rose-300",
};

export function StatusPill({ label, tone = "emerald" }: StatusPillProps) {
    return (
        <span
            className={mergeClasses(
                "inline-flex rounded-full px-3 py-1 text-xs font-medium transition-colors duration-150",
                toneClasses[tone],
            )}
        >
            {label}
        </span>
    );
}

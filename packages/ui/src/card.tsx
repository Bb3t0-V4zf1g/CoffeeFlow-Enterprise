import type { ReactNode } from "react";
import { mergeClasses } from "./utils";

type MetricCardProps = {
    title: string;
    value: string;
    detail?: string;
    className?: string;
    children?: ReactNode;
};

export function MetricCard({
    title,
    value,
    detail,
    className,
    children,
}: MetricCardProps) {
    return (
        <article
            className={mergeClasses(
                "rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/10",
                className,
            )}
        >
            <p className="text-sm text-slate-400">{title}</p>
            <div className="mt-2 text-3xl font-semibold text-white">
                {value}
            </div>
            {detail ? (
                <p className="mt-2 text-sm text-slate-300">{detail}</p>
            ) : null}
            {children}
        </article>
    );
}

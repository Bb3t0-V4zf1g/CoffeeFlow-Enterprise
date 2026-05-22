import type { ButtonHTMLAttributes, ReactNode } from "react";
import { mergeClasses } from "./utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    fullWidth?: boolean;
    children: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-emerald-500 text-slate-950 hover:bg-emerald-400",
    secondary: "bg-white/10 text-white hover:bg-white/15",
    ghost: "bg-transparent text-slate-200 hover:bg-white/10",
};

export function Button({
    variant = "primary",
    fullWidth = false,
    className,
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            className={mergeClasses(
                "inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-400/60 disabled:cursor-not-allowed disabled:opacity-50",
                variantClasses[variant],
                fullWidth && "w-full",
                className,
            )}
            {...props}
        >
            {children}
        </button>
    );
}

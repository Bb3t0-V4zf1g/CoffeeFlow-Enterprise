"use client";

import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

const STORAGE_KEY = "coffeeflow-theme";

function getPreferredTheme(): ThemeMode {
    if (typeof window === "undefined") {
        return "light";
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
        return stored;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

function applyTheme(theme: ThemeMode) {
    document.documentElement.dataset.theme = theme;
}

export function ThemeToggle({
    className = "",
    label = "Modo oscuro",
}: {
    className?: string;
    label?: string;
}) {
    const [theme, setTheme] = useState<ThemeMode>("light");

    useEffect(() => {
        const initial = getPreferredTheme();
        setTheme(initial);
        applyTheme(initial);
    }, []);

    const isDark = theme === "dark";

    return (
        <button
            type="button"
            onClick={() => {
                const next = isDark ? "light" : "dark";
                setTheme(next);
                applyTheme(next);
                window.localStorage.setItem(STORAGE_KEY, next);
            }}
            className={`theme-toggle-button inline-flex min-h-10 items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold shadow-sm transition-transform transform-gpu will-change-transform hover:-translate-y-0.5 ${isDark ? "border-slate-700 bg-slate-800 text-slate-200" : "border-slate-300 bg-white text-slate-700"} ${className}`}
            aria-label={label}
            title={label}
        >
            <span aria-hidden>{isDark ? "🌙" : "☀️"}</span>
            <span>{isDark ? "Modo claro" : "Modo oscuro"}</span>
        </button>
    );
}

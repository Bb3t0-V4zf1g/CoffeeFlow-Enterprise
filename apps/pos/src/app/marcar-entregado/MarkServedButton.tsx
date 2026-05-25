"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function MarkServedButton({ orderId }: { orderId: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleClick() {
        if (loading) return;
        setLoading(true);
        try {
            const res = await fetch("/api/mark-served", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId }),
            });
            const data = await res.json();
            if (!data?.success) {
                alert(`Error: ${data?.message ?? "falló la operación"}`);
            }
            router.refresh();
        } catch (err: any) {
            alert(`Error inesperado: ${err?.message ?? String(err)}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-400/60 disabled:cursor-not-allowed disabled:opacity-50 bg-slate-950 text-white hover:bg-slate-800"
        >
            {loading ? "Procesando..." : "Marcar entregado"}
        </button>
    );
}

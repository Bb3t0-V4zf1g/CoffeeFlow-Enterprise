"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@coffeeflow/ui";

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
                alert(`Error: ${data?.message ?? 'falló la operación'}`);
            }
            router.refresh();
        } catch (err: any) {
            alert(`Error inesperado: ${err?.message ?? String(err)}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button onClick={handleClick} disabled={loading} variant="primary">
            {loading ? "Procesando..." : "Marcar entregado"}
        </Button>
    );
}

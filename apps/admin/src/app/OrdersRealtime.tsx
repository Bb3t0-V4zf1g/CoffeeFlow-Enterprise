"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@coffeeflow/database";

export default function OrdersRealtime() {
    const router = useRouter();

    useEffect(() => {
        const supabase = createSupabaseBrowserClient();

        const subscription = supabase
            .channel("public:orders")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "orders" },
                (payload) => {
                    // eslint-disable-next-line no-console
                    console.debug("Admin OrdersRealtime event:", payload);
                    router.refresh();
                },
            )
            .subscribe();

        const interval = setInterval(() => {
            router.refresh();
        }, 3000);

        return () => {
            clearInterval(interval);
            supabase.removeChannel(subscription);
        };
    }, [router]);

    return null;
}

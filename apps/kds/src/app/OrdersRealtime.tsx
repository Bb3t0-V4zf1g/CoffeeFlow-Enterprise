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
                    // debug log and refresh the page data when orders change
                    // eslint-disable-next-line no-console
                    console.debug("OrdersRealtime event:", payload);
                    router.refresh();
                },
            )
            .subscribe();

        // Fallback polling: refresh every 3s to guarantee updates if realtime misses events
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

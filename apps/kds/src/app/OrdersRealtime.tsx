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
                () => {
                    // refresh the page data when orders change
                    router.refresh();
                },
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [router]);

    return null;
}

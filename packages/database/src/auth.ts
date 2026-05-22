import { createSupabaseServerClient } from "./supabase";

export type CoffeeFlowRole = "admin" | "cashier" | "barista";

type CookieMethods = Parameters<
    typeof createSupabaseServerClient
>[0]["cookies"];

export async function getCurrentUserRole(cookies: CookieMethods) {
    const client = createSupabaseServerClient({ cookies });
    const {
        data: { user },
    } = await client.auth.getUser();

    if (!user) {
        return null;
    }

    const { data } = await client
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    return (data?.role as CoffeeFlowRole | undefined) ?? null;
}

import { createBrowserClient, createServerClient } from "@supabase/ssr";
import type { CookieMethodsServer, CookieOptions } from "@supabase/ssr";
import { getRequiredEnv } from "./env";

export function createSupabaseBrowserClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        throw new Error(
            "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
        );
    }

    return createBrowserClient(url, key);
}

type ServerClientOptions = {
    cookies: CookieMethodsServer;
    cookieOptions?: CookieOptions;
};

export function createSupabaseServerClient({
    cookies,
    cookieOptions,
}: ServerClientOptions) {
    return createServerClient(
        getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
        getRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
        {
            cookies,
            cookieOptions,
        },
    );
}

import { createBrowserClient, createServerClient } from "@supabase/ssr";
import type { CookieMethodsServer, CookieOptions } from "@supabase/ssr";
import { getRequiredEnv } from "./env";

export function createSupabaseBrowserClient() {
    return createBrowserClient(
        getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
        getRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    );
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

"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/types/database";

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function createClient() {
  if (client) return client;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    // During build / prerender env vars are not available.
    // Return a dummy proxy that throws only when actually used at runtime.
    return new Proxy({} as ReturnType<typeof createBrowserClient<Database>>, {
      get(_target, prop) {
        if (prop === "auth") {
          return new Proxy(
            {},
            {
              get() {
                return () => {
                  throw new Error(
                    "Supabase client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
                  );
                };
              },
            }
          );
        }
        return () => {
          throw new Error(
            "Supabase client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
          );
        };
      },
    });
  }

  client = createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

  return client;
}

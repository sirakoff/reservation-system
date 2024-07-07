import { createBrowserClient } from "@supabase/ssr";
//@ts-ignore
import { Database } from "@/supabase.ts";

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

// packages/core/src/supabase.ts
import { createBrowserClient } from "@supabase/ssr";

export const createSupabaseClient = (url: string, key: string) => {
  return createBrowserClient(url, key);
};
import { createClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://ufkrhdjoxokghsvoqcyd.supabase.co";
const DEFAULT_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dummy";

export function getSupabaseClient() {
  const supabaseUrl = (
    process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
  ).trim();
  
  const supabaseAnonKey = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    DEFAULT_ANON_KEY
  ).trim();

  return createClient(supabaseUrl, supabaseAnonKey);
}
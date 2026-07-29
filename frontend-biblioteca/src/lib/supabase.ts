import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://trkoyzcmgoflfrwleboo.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRya295emNtZ29mbGZyd2xlYm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNDk2NzIsImV4cCI6MjA1NzYyNTY3Mn0.a45vW-9tS09g1-9494";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

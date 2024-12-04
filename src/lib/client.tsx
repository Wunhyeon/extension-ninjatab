import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

export function supabaseClient() {
  return createClient<Database>(
    "https://nfdelfyxebuifwbtothm.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mZGVsZnl4ZWJ1aWZ3YnRvdGhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4NjkxMDgsImV4cCI6MjA0ODQ0NTEwOH0.lKs1J_5dNcaZka8uVufm_QaOGe8X28Oe3mKd6phP_HE"
  );
}

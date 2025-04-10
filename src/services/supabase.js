import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://ghwikrmfofgaubrmapjd.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdod2lrcm1mb2ZnYXVicm1hcGpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0OTY4OTcsImV4cCI6MjA1MzA3Mjg5N30.ycawWx1on0lMRr5rE8DQZUXw0Qe0psHFig_BNN24zLs";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

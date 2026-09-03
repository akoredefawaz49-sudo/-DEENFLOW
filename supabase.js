const SUPABASE_URL = "https://aotxnbycfbvsgklvvusv.supabase.co";

const SUPABASE_KEY = "YOUR_SB_PUBLISHABLE_KEY_HERE";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

/**
 * =========================================================================
 * HotelPro - Supabase Cloud Database Configuration
 * =========================================================================
 * To connect your Supabase database:
 * 1. Log in to https://supabase.com and create a project.
 * 2. In your Supabase Dashboard: Click Project Settings (gear icon) -> API
 * 3. Copy the "Project URL" and paste into SUPABASE_URL below.
 * 4. Copy the "Project API anon public key" and paste into SUPABASE_ANON_KEY below.
 * =========================================================================
 */

const SUPABASE_CONFIG = {
  // Example: "https://xyzcompany.supabase.co"
  SUPABASE_URL: "https://zhfjrusacgvbrliimirh.supabase.co",

  // Example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoZmpydXNhY2d2YnJsaWltaXJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1NjgxOTQsImV4cCI6MjExMDE0NDE5NH0.WLL2JqC2YO3Quuj4ZjQqzf0xr6TQp1Db8AzZ2BiYKHo"
};

// Helper: Checks if real credentials have been provided
function isSupabaseConfigured() {
  return (
    typeof SUPABASE_CONFIG !== "undefined" &&
    SUPABASE_CONFIG.SUPABASE_URL &&
    SUPABASE_CONFIG.SUPABASE_URL.startsWith("https://") &&
    SUPABASE_CONFIG.SUPABASE_ANON_KEY &&
    SUPABASE_CONFIG.SUPABASE_ANON_KEY.length > 20
  );
}

// Initialize Supabase Cloud client
let supabaseClient = null;

function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  if (typeof supabase !== "undefined" && isSupabaseConfigured()) {
    try {
      supabaseClient = supabase.createClient(
        SUPABASE_CONFIG.SUPABASE_URL,
        SUPABASE_CONFIG.SUPABASE_ANON_KEY
      );
      console.log("★ Connected to Supabase Cloud Database!");
      return supabaseClient;
    } catch (err) {
      console.warn("Could not initialize Supabase client:", err.message);
    }
  }
  return null;
}


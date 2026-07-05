// Main config — supabase + founder access (public values only)
window.KIRA_CONFIG = {
  // Supabase — shared BAM project
  supabase_url:     'https://wwwqltetjjwoodiwbabq.supabase.co',
  supabase_anon:    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3d3FsdGV0amp3b29kaXdiYWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMDA0NzcsImV4cCI6MjA5MTc3NjQ3N30.Jy8BlFPnqo6a-EIah4xWbS2zWKYltSOCMSjcrKMoQ_8',

  // Checkout goes through /api/create-checkout with type 'agency' | 'bundle';
  // price IDs live server-side in PRICE_MAP.

  // Set to false once the Supabase project (wwwqltetjjwoodiwbabq) is restored —
  // it's currently paused/deleted so auth, checkout and course access are all dead.
  MAINTENANCE_MODE: true,
};

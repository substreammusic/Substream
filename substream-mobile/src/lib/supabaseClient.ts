import { createClient } from '@supabase/supabase-js';

// your real credentials
const SUPABASE_URL = 'https://owjpufrfwszsokxmzkix.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93anB1ZnJmd3N6c29reG16a2l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0OTA4MTYsImV4cCI6MjA3NzA2NjgxNn0.e3e2RCorDRGkgIlLWzK0nMs_heXCRdt4ndSeoe7J-PQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

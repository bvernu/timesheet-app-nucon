import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aebabhsyvxejcodouilk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlYmFiaHN5dnhlamNvZG91aWxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NzA5NzYsImV4cCI6MjA3OTE0Njk3Nn0.TrwYtN-DrLxeWAtga36hsUIm9JHoxvR3AGN5HWzI278';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
// Quick Supabase connection test
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jafbkmwaqxyszzccwsls.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphZmJrbXdhcXh5c3p6Y2N3c2xzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MTU3NjQsImV4cCI6MjA4NjQ5MTc2NH0.nUJr_6cMH88BglZqmkKUnYNBzacH86cp6hfgB3fAIks';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('Testing Supabase connection...');

// Test anonymous sign-in
const { data, error } = await supabase.auth.signInAnonymously();

if (error) {
  console.error('❌ Error:', error.message);
} else {
  console.log('✅ Success! User ID:', data.user.id);
}

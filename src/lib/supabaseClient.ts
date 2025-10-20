import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://foohzjxonqxoettmwhgk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvb2h6anhvbnF4b2V0dG13aGdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NzkwMjIsImV4cCI6MjA3NjM1NTAyMn0.GRVSDHsVyrAG4WeE9XUbftisGw3nnMrRTVoZ4gBX_Yk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

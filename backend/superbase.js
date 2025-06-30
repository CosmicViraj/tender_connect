import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://your-project.supabase.co',
  'your-supabase-api-key' // service role key for upload
);

export default supabase;

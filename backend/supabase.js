import { createClient } from '@supabase/supabase-js';
import supabase from "../supabase.js";


const supabase = createClient(
  'https://your-project.supabase.co',
  'your-supabase-api-key' // service role key for upload
);

export default supabase;

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL ?? `https://vuifjgsxyfslmhjrrhin.supabase.co`;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

export const supabaseAdmin = () => createClient(SUPABASE_URL, SERVICE_KEY);

export const BUCKET = 'application-docs';

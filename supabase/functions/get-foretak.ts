import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

interface ForetakResponse {
  search: Array<{
    navn: string;
    orgnr: number;
  }>;
}

export async function getForetak(letters: string): Promise<{ orgnr: number; navn: string }[]> {
  const { data, error } = await supabase.rpc('get_foretak', { p_letter: letters });

  if (error) {
    console.error('Error calling get_foretak:', error);
    throw error;
  }

  const response = (data ?? {}) as ForetakResponse;
  return response.search ?? [];
}

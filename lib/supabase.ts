import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// TypeScript Typen für unsere Datenbank
export interface Client {
  id: string;
  name: string;
  hourly_rate: number;
  created_at: string;
}

export interface Project {
  id: string;
  client_id: string;
  name: string;
  hourly_rate: number | null; // Optional - überschreibt Kunden-Rate
  created_at: string;
  // Joined data
  client?: Client;
}

export interface TimeEntry {
  id: string;
  client_id: string;
  date: string;
  hours: number;
  description: string | null;
  created_at: string;
  // Joined data
  client?: Client;
}

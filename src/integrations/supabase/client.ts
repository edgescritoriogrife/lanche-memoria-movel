// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://twcencdzvortesotlybr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3Y2VuY2R6dm9ydGVzb3RseWJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNTY0MjQsImV4cCI6MjA2MDkzMjQyNH0.b7RWaSAfUC5E1fqgE7RDcvxa9R3PpkLGOiWQKyrdKbk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
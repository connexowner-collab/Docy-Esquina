import { createClient } from '@supabase/supabase-js'

/**
 * Cliente Supabase com service role key.
 * Bypassa RLS — usar APENAS em rotas de API server-side (nunca no browser).
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

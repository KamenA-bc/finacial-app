-- ==============================================================================
-- Migration: Harden error_logs table RLS policies
-- Drops unauthenticated anonymous insert access.
-- ==============================================================================

-- Drop the overly permissive policy that allowed anon keyholders to flood error_logs
DROP POLICY IF EXISTS "Allow insert for client error telemetry" ON public.error_logs;

-- Allow only authenticated users to insert client telemetry logs directly
CREATE POLICY "Authenticated users can insert error logs"
    ON public.error_logs FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL);

/*
# Harden set_updated_at trigger function search_path

Sets an explicit `search_path` on the `public.set_updated_at` function to
satisfy the Supabase database linter (function_search_path_mutable).
No behavior change; only hardens the function against search_path hijacking.
*/

DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS trg_hazards_updated_at ON public.hazards;
DROP TRIGGER IF EXISTS trg_hazard_reports_updated_at ON public.hazard_reports;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_hazards_updated_at BEFORE UPDATE ON public.hazards
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_hazard_reports_updated_at BEFORE UPDATE ON public.hazard_reports
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

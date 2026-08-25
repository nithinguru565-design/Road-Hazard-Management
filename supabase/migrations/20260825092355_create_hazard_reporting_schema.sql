/*
# Create Hazard Reporting Platform Schema

## Overview
Full schema for a road-hazard reporting platform. Citizens report road hazards
(potholes, broken signage, flooding, etc.), authorities are assigned to resolve
them, and the resolution is verified. Includes location tracking, status history,
and repair verifications.

## Tables Created
1. `users` - public profile data linked to auth.users (one row per auth user)
2. `hazards` - reported road hazards
3. `hazard_images` - photos attached to a hazard
4. `authorities` - municipal/road authorities that handle hazards
5. `hazard_assignments` - links a hazard to an authority + assignee
6. `hazard_status_history` - audit trail of status changes per hazard
7. `road_alerts` - live alerts broadcast for active hazards
8. `hazard_reports` - citizen-submitted reports (distinct from hazard creation flow)
9. `repair_verifications` - confirmation that a repair was completed correctly
10. `user_locations` - last known location per user

## Security
- RLS enabled on every table.
- Owner-scoped CRUD policies for user-owned data (users, hazard_reports, user_locations).
- Hazard reporting is citizen-driven: authenticated users can insert hazards and
  read all hazards (community-visible). Updates/deletes restricted to owner or
  assigned authority via policies.
- Storage bucket `hazard-images` created for image uploads, public read.
*/

-- ============================================================
-- 1. USERS (public profile mirror of auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  avatar_url text,
  phone text,
  role text NOT NULL DEFAULT 'citizen' CHECK (role IN ('citizen','authority','admin')),
  authority_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_users" ON public.users;
CREATE POLICY "select_users" ON public.users
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_user" ON public.users;
CREATE POLICY "insert_own_user" ON public.users
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_user" ON public.users;
CREATE POLICY "update_own_user" ON public.users
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============================================================
-- 2. AUTHORITIES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.authorities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  jurisdiction text,
  contact_email text,
  contact_phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.authorities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_authorities" ON public.authorities;
CREATE POLICY "select_authorities" ON public.authorities
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_authorities" ON public.authorities;
CREATE POLICY "insert_authorities" ON public.authorities
  FOR INSERT TO authenticated WITH CHECK (auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin','authority')));

DROP POLICY IF EXISTS "update_authorities" ON public.authorities;
CREATE POLICY "update_authorities" ON public.authorities
  FOR UPDATE TO authenticated USING (auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin','authority'))) WITH CHECK (true);

-- Add FK to users.authority_id now that authorities exists
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'users_authority_id_fkey') THEN
    ALTER TABLE public.users ADD CONSTRAINT users_authority_id_fkey
      FOREIGN KEY (authority_id) REFERENCES public.authorities(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ============================================================
-- 3. HAZARDS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.hazards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES public.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'other' CHECK (category IN ('pothole','flooding','signage','lighting','debris','vegetation','other')),
  severity text NOT NULL DEFAULT 'medium' CHECK (severity IN ('low','medium','high','critical')),
  status text NOT NULL DEFAULT 'reported' CHECK (status IN ('reported','assigned','in_progress','resolved','verified','rejected')),
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  address text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.hazards ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_hazards_user_id ON public.hazards(user_id);
CREATE INDEX IF NOT EXISTS idx_hazards_status ON public.hazards(status);
CREATE INDEX IF NOT EXISTS idx_hazards_created_at ON public.hazards(created_at DESC);

-- Anyone authenticated can read (community visibility)
DROP POLICY IF EXISTS "select_hazards" ON public.hazards;
CREATE POLICY "select_hazards" ON public.hazards
  FOR SELECT TO authenticated USING (true);

-- Owner inserts (user_id defaulted to auth.uid())
DROP POLICY IF EXISTS "insert_own_hazards" ON public.hazards;
CREATE POLICY "insert_own_hazards" ON public.hazards
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Owner or authority/admin can update
DROP POLICY IF EXISTS "update_hazards" ON public.hazards;
CREATE POLICY "update_hazards" ON public.hazards
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin','authority')))
  WITH CHECK (true);

-- Owner or admin can delete
DROP POLICY IF EXISTS "delete_hazards" ON public.hazards;
CREATE POLICY "delete_hazards" ON public.hazards
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin'));

-- ============================================================
-- 4. HAZARD_IMAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.hazard_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hazard_id uuid NOT NULL REFERENCES public.hazards(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.hazard_images ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_hazard_images_hazard_id ON public.hazard_images(hazard_id);

DROP POLICY IF EXISTS "select_hazard_images" ON public.hazard_images;
CREATE POLICY "select_hazard_images" ON public.hazard_images
  FOR SELECT TO authenticated USING (true);

-- Insert allowed if the parent hazard belongs to the user
DROP POLICY IF EXISTS "insert_hazard_images" ON public.hazard_images;
CREATE POLICY "insert_hazard_images" ON public.hazard_images
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.hazards h WHERE h.id = hazard_id AND h.user_id = auth.uid()));

DROP POLICY IF EXISTS "delete_hazard_images" ON public.hazard_images;
CREATE POLICY "delete_hazard_images" ON public.hazard_images
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.hazards h WHERE h.id = hazard_id AND (h.user_id = auth.uid() OR auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin'))));

-- ============================================================
-- 5. HAZARD_ASSIGNMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.hazard_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hazard_id uuid NOT NULL REFERENCES public.hazards(id) ON DELETE CASCADE,
  authority_id uuid NOT NULL REFERENCES public.authorities(id) ON DELETE CASCADE,
  assigned_to uuid REFERENCES public.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','completed','cancelled')),
  assigned_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);
ALTER TABLE public.hazard_assignments ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_assignments_hazard_id ON public.hazard_assignments(hazard_id);
CREATE INDEX IF NOT EXISTS idx_assignments_authority_id ON public.hazard_assignments(authority_id);

DROP POLICY IF EXISTS "select_assignments" ON public.hazard_assignments;
CREATE POLICY "select_assignments" ON public.hazard_assignments
  FOR SELECT TO authenticated USING (true);

-- Authority/admin inserts
DROP POLICY IF EXISTS "insert_assignments" ON public.hazard_assignments;
CREATE POLICY "insert_assignments" ON public.hazard_assignments
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin','authority')));

DROP POLICY IF EXISTS "update_assignments" ON public.hazard_assignments;
CREATE POLICY "update_assignments" ON public.hazard_assignments
  FOR UPDATE TO authenticated
  USING (auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin','authority')) OR assigned_to = auth.uid())
  WITH CHECK (true);

DROP POLICY IF EXISTS "delete_assignments" ON public.hazard_assignments;
CREATE POLICY "delete_assignments" ON public.hazard_assignments
  FOR DELETE TO authenticated
  USING (auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin'));

-- ============================================================
-- 6. HAZARD_STATUS_HISTORY
-- ============================================================
CREATE TABLE IF NOT EXISTS public.hazard_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hazard_id uuid NOT NULL REFERENCES public.hazards(id) ON DELETE CASCADE,
  changed_by uuid NOT NULL DEFAULT auth.uid() REFERENCES public.users(id) ON DELETE CASCADE,
  previous_status text,
  new_status text NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.hazard_status_history ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_status_history_hazard_id ON public.hazard_status_history(hazard_id);

DROP POLICY IF EXISTS "select_status_history" ON public.hazard_status_history;
CREATE POLICY "select_status_history" ON public.hazard_status_history
  FOR SELECT TO authenticated USING (true);

-- Anyone authenticated can insert a status change for a hazard (audit)
DROP POLICY IF EXISTS "insert_status_history" ON public.hazard_status_history;
CREATE POLICY "insert_status_history" ON public.hazard_status_history
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = changed_by);

-- ============================================================
-- 7. ROAD_ALERTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.road_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hazard_id uuid REFERENCES public.hazards(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text,
  alert_type text NOT NULL DEFAULT 'info' CHECK (alert_type IN ('info','warning','danger','critical')),
  latitude double precision,
  longitude double precision,
  active boolean NOT NULL DEFAULT true,
  created_by uuid NOT NULL DEFAULT auth.uid() REFERENCES public.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz
);
ALTER TABLE public.road_alerts ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_road_alerts_active ON public.road_alerts(active);
CREATE INDEX IF NOT EXISTS idx_road_alerts_created_at ON public.road_alerts(created_at DESC);

DROP POLICY IF EXISTS "select_road_alerts" ON public.road_alerts;
CREATE POLICY "select_road_alerts" ON public.road_alerts
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_road_alerts" ON public.road_alerts;
CREATE POLICY "insert_road_alerts" ON public.road_alerts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "update_road_alerts" ON public.road_alerts;
CREATE POLICY "update_road_alerts" ON public.road_alerts
  FOR UPDATE TO authenticated
  USING (auth.uid() = created_by OR auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin','authority')))
  WITH CHECK (true);

DROP POLICY IF EXISTS "delete_road_alerts" ON public.road_alerts;
CREATE POLICY "delete_road_alerts" ON public.road_alerts
  FOR DELETE TO authenticated
  USING (auth.uid() = created_by OR auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin'));

-- ============================================================
-- 8. HAZARD_REPORTS (citizen-submitted reports, owner-scoped)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.hazard_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES public.users(id) ON DELETE CASCADE,
  hazard_id uuid REFERENCES public.hazards(id) ON DELETE SET NULL,
  report_type text NOT NULL DEFAULT 'general' CHECK (report_type IN ('general','complaint','inquiry','feedback')),
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','reviewing','closed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.hazard_reports ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_hazard_reports_user_id ON public.hazard_reports(user_id);

DROP POLICY IF EXISTS "select_own_hazard_reports" ON public.hazard_reports;
CREATE POLICY "select_own_hazard_reports" ON public.hazard_reports
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin','authority')));

DROP POLICY IF EXISTS "insert_own_hazard_reports" ON public.hazard_reports;
CREATE POLICY "insert_own_hazard_reports" ON public.hazard_reports
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_hazard_reports" ON public.hazard_reports;
CREATE POLICY "update_own_hazard_reports" ON public.hazard_reports
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin','authority')))
  WITH CHECK (true);

DROP POLICY IF EXISTS "delete_own_hazard_reports" ON public.hazard_reports;
CREATE POLICY "delete_own_hazard_reports" ON public.hazard_reports
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin'));

-- ============================================================
-- 9. REPAIR_VERIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.repair_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hazard_id uuid NOT NULL REFERENCES public.hazards(id) ON DELETE CASCADE,
  verified_by uuid NOT NULL DEFAULT auth.uid() REFERENCES public.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  notes text,
  verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.repair_verifications ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_repair_verifications_hazard_id ON public.repair_verifications(hazard_id);

DROP POLICY IF EXISTS "select_repair_verifications" ON public.repair_verifications;
CREATE POLICY "select_repair_verifications" ON public.repair_verifications
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_repair_verifications" ON public.repair_verifications;
CREATE POLICY "insert_repair_verifications" ON public.repair_verifications
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = verified_by);

DROP POLICY IF EXISTS "update_repair_verifications" ON public.repair_verifications;
CREATE POLICY "update_repair_verifications" ON public.repair_verifications
  FOR UPDATE TO authenticated
  USING (auth.uid() = verified_by OR auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin','authority')))
  WITH CHECK (true);

DROP POLICY IF EXISTS "delete_repair_verifications" ON public.repair_verifications;
CREATE POLICY "delete_repair_verifications" ON public.repair_verifications
  FOR DELETE TO authenticated
  USING (auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin'));

-- ============================================================
-- 10. USER_LOCATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES public.users(id) ON DELETE CASCADE,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  accuracy double precision,
  recorded_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.user_locations ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_user_locations_user_id ON public.user_locations(user_id);

DROP POLICY IF EXISTS "select_own_locations" ON public.user_locations;
CREATE POLICY "select_own_locations" ON public.user_locations
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_locations" ON public.user_locations;
CREATE POLICY "insert_own_locations" ON public.user_locations
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_locations" ON public.user_locations;
CREATE POLICY "delete_own_locations" ON public.user_locations
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- updated_at trigger helper
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_hazards_updated_at ON public.hazards;
CREATE TRIGGER trg_hazards_updated_at BEFORE UPDATE ON public.hazards
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_hazard_reports_updated_at ON public.hazard_reports;
CREATE TRIGGER trg_hazard_reports_updated_at BEFORE UPDATE ON public.hazard_reports
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- STORAGE BUCKET for hazard images (public read)
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('hazard-images', 'hazard-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "select_hazard_images_bucket" ON storage.objects;
CREATE POLICY "select_hazard_images_bucket" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'hazard-images');

DROP POLICY IF EXISTS "insert_hazard_images_bucket" ON storage.objects;
CREATE POLICY "insert_hazard_images_bucket" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'hazard-images');

DROP POLICY IF EXISTS "update_hazard_images_bucket" ON storage.objects;
CREATE POLICY "update_hazard_images_bucket" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'hazard-images' AND owner = auth.uid())
  WITH CHECK (bucket_id = 'hazard-images');

DROP POLICY IF EXISTS "delete_hazard_images_bucket" ON storage.objects;
CREATE POLICY "delete_hazard_images_bucket" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'hazard-images' AND owner = auth.uid());

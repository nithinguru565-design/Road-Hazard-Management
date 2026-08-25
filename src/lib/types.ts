export type UserRole = 'citizen' | 'authority' | 'admin';

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  phone: string | null;
  role: UserRole;
  authority_id: string | null;
  created_at: string;
  updated_at: string;
}

export type HazardCategory =
  | 'pothole'
  | 'flooding'
  | 'signage'
  | 'lighting'
  | 'debris'
  | 'vegetation'
  | 'other';

export type HazardSeverity = 'low' | 'medium' | 'high' | 'critical';

export type HazardStatus =
  | 'reported'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'verified'
  | 'rejected';

export interface Hazard {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: HazardCategory;
  severity: HazardSeverity;
  status: HazardStatus;
  latitude: number;
  longitude: number;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface HazardImage {
  id: string;
  hazard_id: string;
  storage_path: string;
  url: string;
  created_at: string;
}

export interface Authority {
  id: string;
  name: string;
  jurisdiction: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  created_at: string;
}

export interface HazardAssignment {
  id: string;
  hazard_id: string;
  authority_id: string;
  assigned_to: string | null;
  status: 'active' | 'completed' | 'cancelled';
  assigned_at: string;
  completed_at: string | null;
}

export interface HazardStatusHistory {
  id: string;
  hazard_id: string;
  changed_by: string;
  previous_status: HazardStatus | null;
  new_status: HazardStatus;
  note: string | null;
  created_at: string;
}

export interface RoadAlert {
  id: string;
  hazard_id: string | null;
  title: string;
  message: string | null;
  alert_type: 'info' | 'warning' | 'danger' | 'critical';
  latitude: number | null;
  longitude: number | null;
  active: boolean;
  created_by: string;
  created_at: string;
  expires_at: string | null;
}

export interface HazardReport {
  id: string;
  user_id: string;
  hazard_id: string | null;
  report_type: 'general' | 'complaint' | 'inquiry' | 'feedback';
  subject: string;
  message: string;
  status: 'open' | 'reviewing' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface RepairVerification {
  id: string;
  hazard_id: string;
  verified_by: string;
  status: 'pending' | 'approved' | 'rejected';
  notes: string | null;
  verified: boolean;
  created_at: string;
}

export interface UserLocation {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  recorded_at: string;
}

export const HAZARD_CATEGORIES: { value: HazardCategory; label: string }[] = [
  { value: 'pothole', label: 'Pothole' },
  { value: 'flooding', label: 'Flooding' },
  { value: 'signage', label: 'Signage' },
  { value: 'lighting', label: 'Lighting' },
  { value: 'debris', label: 'Debris' },
  { value: 'vegetation', label: 'Vegetation' },
  { value: 'other', label: 'Other' },
];

export const HAZARD_SEVERITIES: { value: HazardSeverity; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'text-brand-300 bg-brand-500/15 border-brand-500/30' },
  { value: 'medium', label: 'Medium', color: 'text-warn-400 bg-warn-500/15 border-warn-500/30' },
  { value: 'high', label: 'High', color: 'text-orange-400 bg-orange-500/15 border-orange-500/30' },
  { value: 'critical', label: 'Critical', color: 'text-danger-400 bg-danger-500/15 border-danger-500/30' },
];

export const HAZARD_STATUSES: { value: HazardStatus; label: string; color: string }[] = [
  { value: 'reported', label: 'Reported', color: 'text-ink-200 bg-white/10 border-white/20' },
  { value: 'assigned', label: 'Assigned', color: 'text-accent-300 bg-accent-500/15 border-accent-500/30' },
  { value: 'in_progress', label: 'In Progress', color: 'text-warn-400 bg-warn-500/15 border-warn-500/30' },
  { value: 'resolved', label: 'Resolved', color: 'text-brand-300 bg-brand-500/15 border-brand-500/30' },
  { value: 'verified', label: 'Verified', color: 'text-brand-300 bg-brand-500/20 border-brand-500/40' },
  { value: 'rejected', label: 'Rejected', color: 'text-danger-400 bg-danger-500/15 border-danger-500/30' },
];

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://<your-render-app-name>.onrender.com/api/v1';

export interface AdminUserSession {
  access_token: string;
  username: string;
  full_name: string;
  role: string;
}

export interface DashboardStats {
  total_recruits: number;
  active_notices: number;
  total_feedbacks: number;
  recent_feedbacks_count: number;
}

export interface NoticeItem {
  id: number;
  title: string;
  message: string;
  category: string;
  is_active: boolean;
  created_at: string;
}

export interface FeedbackItem {
  id: number;
  roll_number: string;
  recruit_name?: string;
  feedback_text: string;
  created_at: string;
}

// 1. Admin Login
export async function adminLogin(username: string, password: string): Promise<AdminUserSession> {
  const res = await fetch(`${BASE_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Login failed. Please check your credentials.');
  }

  return await res.json();
}

// 2. Fetch Dashboard KPI Metrics
export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${BASE_URL}/admin/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return await res.json();
}

// 3. Fetch All Notices (Active & Archived)
export async function getAllNotices(): Promise<NoticeItem[]> {
  const res = await fetch(`${BASE_URL}/notices/`);
  if (!res.ok) return [];
  return await res.json();
}

// 4. Create Notice
export async function createNotice(payload: { title: string; message: string; category: string }): Promise<NoticeItem> {
  const res = await fetch(`${BASE_URL}/notices/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, is_active: true }),
  });
  if (!res.ok) throw new Error('Failed to publish notice');
  return await res.json();
}

// 5. Toggle Notice Status
export async function toggleNotice(id: number): Promise<NoticeItem> {
  const res = await fetch(`${BASE_URL}/notices/${id}/toggle`, {
    method: 'PATCH',
  });
  if (!res.ok) throw new Error('Failed to toggle notice status');
  return await res.json();
}

// 6. Delete Notice
export async function deleteNotice(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/notices/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete notice');
}

// 7. Fetch All Feedbacks
export async function getAllFeedbacks(): Promise<FeedbackItem[]> {
  const res = await fetch(`${BASE_URL}/feedback/`);
  if (!res.ok) return [];
  return await res.json();
}

// 8. Fetch Recruits Roster
export async function getRecruitsList(): Promise<any[]> {
  const res = await fetch(`${BASE_URL}/recruits/`);
  if (!res.ok) return [];
  return await res.json();
}
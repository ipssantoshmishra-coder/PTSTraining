import { API_BASE_URL } from '../config/constants';

const BASE = API_BASE_URL.replace(/\/+$/, '');

export async function fetchLatestNoticeApi() {
  try {
    const res = await fetch(`${BASE}/notices/latest`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.log('Error fetching latest notice:', e.message);
    return null;
  }
}

export async function fetchAllActiveNoticesApi() {
  try {
    const res = await fetch(`${BASE}/notices/`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.log('Error fetching notices:', e.message);
    return [];
  }
}

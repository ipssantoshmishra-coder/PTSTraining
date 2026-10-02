import { API_BASE_URL } from '../config/constants';

const BASE = API_BASE_URL.replace(/\/+$/, '');

// 1. Submit a leave application
export async function submitLeaveApi(payload) {
  const response = await fetch(`${BASE}/leaves/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'आवेदन जमा करने में विफल (Failed to submit leave)');
  }

  return await response.json();
}

// 2. Fetch past leave history for this recruit
export async function fetchRecruitLeavesApi(rollNumber) {
  try {
    const response = await fetch(`${BASE}/leaves/recruit/${rollNumber}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) return [];
    return await response.json();
  } catch (err) {
    console.log('Error fetching recruit leaves:', err.message);
    return [];
  }
}
import { API_BASE_URL } from '../config/constants';
const BASE = API_BASE_URL.replace(/\/+$/, '');

export async function loginRecruit(rollNumber, credential) {
  const res = await fetch(`${BASE}/recruits/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      roll_number: rollNumber,
      credential: credential,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'लॉगिन विफल (Login failed)');
  }

  return await res.json();
}

export async function setRecruitPinApi(rollNumber, pin) {
  const res = await fetch(`${BASE}/recruits/set-pin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      roll_number: rollNumber,
      pin: pin,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to update PIN');
  }

  return await res.json();
}
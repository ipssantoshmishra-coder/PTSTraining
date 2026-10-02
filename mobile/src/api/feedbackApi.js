import { API_BASE_URL } from '../config/constants';

// Remove potential trailing slash from base url
const BASE = API_BASE_URL.replace(/\/+$/, '');

export async function submitFeedbackApi(rollNumber, recruitName, feedbackText) {
  const url = `${BASE}/feedback/`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      roll_number: String(rollNumber),
      recruit_name: recruitName || 'Trainee',
      feedback_text: feedbackText.trim(),
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.detail 
      ? (typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail))
      : `Server returned status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export async function fetchRecruitFeedbacksApi(rollNumber) {
  const url = `${BASE}/feedback/recruit/${rollNumber}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to load past feedbacks');
  }

  return await response.json();
}
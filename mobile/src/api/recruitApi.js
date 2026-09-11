import { API_BASE_URL } from '../config/constants';

export const loginRecruit = async (rollNumber, dob) => {
  try {
    const response = await fetch(`${API_BASE_URL}/recruits/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roll_number: rollNumber.trim(),
        dob: dob.trim(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Server error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Login API Error:", error);
    throw error;
  }
};
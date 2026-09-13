// mobile/src/api/recruitApi.js
import { API_BASE_URL } from '../config/constants';

export const loginRecruit = async (rollNumber, dob) => {
  const targetUrl = `${API_BASE_URL}/recruits/login`;
  console.log("➡️ SENDING LOGIN REQUEST TO:", targetUrl); // <-- Verify in Metro terminal

  try {
    const response = await fetch(targetUrl, {
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
    console.log("Login API Error:", error);
    throw error;
  }
};
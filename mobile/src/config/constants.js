// mobile/src/config/constants.js
import { Platform } from 'react-native';

// Set your Mac's active Wi-Fi IP here once
export const DEV_MAC_IP = "192.168.31.32";

export const API_BASE_URL = Platform.OS === 'android'
  ? `http://${DEV_MAC_IP}:8000/api/v1`
  : `http://${DEV_MAC_IP}:8000/api/v1`;

export const APP_CONFIG = {
  APP_NAME: "POLICE TRAINING PORTAL",
  APP_SUBTITLE: "प्रशिक्षु पोर्टल (Trainee Portal)",
  LOGO_EMOJI: "🛡️",
};
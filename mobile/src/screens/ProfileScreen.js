import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { setRecruitPinApi } from '../api/recruitApi';

export default function ProfileScreen({ route, navigation }) {
  const { recruit } = route.params || {};

  const [newPin, setNewPin] = useState('');
  const [savingPin, setSavingPin] = useState(false);

  const profileFields = [
    { label: 'पूरा नाम (Full Name)', value: recruit?.full_name || 'N/A' },
    { label: 'रोल नंबर (Roll Number)', value: recruit?.roll_number || 'N/A' },
    { label: 'गृह जनपद (Home District)', value: recruit?.home_district || 'N/A' },
    { label: 'होस्टल का नाम (Hostel)', value: recruit?.hostel_name || 'N/A' },
    { label: 'बैरक / बेड संख्या (Bed No.)', value: `${recruit?.barrack_no || ''} - Bed ${recruit?.bed_no || 'N/A'}` },
    { label: 'कक्षा / कमरा नं. (Indoor Room)', value: `Batch ${recruit?.indoor_batch_no || ''} • Room ${recruit?.indoor_room_no || 'N/A'}` },
    { label: 'कंपनी व प्लाटून (Outdoor)', value: `${recruit?.outdoor_company || ''} - Platoon ${recruit?.outdoor_platoon || 'N/A'}` },
    { label: 'संपर्क नंबर (Mobile)', value: recruit?.phone_number || 'N/A' },
  ];

  const handleSetPin = async () => {
    const cleanPin = newPin.trim();

    if (!cleanPin) {
      Alert.alert('त्रुटि (Error)', 'कृपया नया 4 या 6 अंकों का पिन दर्ज करें।');
      return;
    }

    if (!/^\d{4}$/.test(cleanPin) && !/^\d{6}$/.test(cleanPin)) {
      Alert.alert('त्रुटि (Invalid PIN)', 'सुरक्षा पिन केवल 4 या 6 अंकों की संख्या होनी चाहिए।');
      return;
    }

    if (!recruit?.roll_number) {
      Alert.alert('त्रुटि (Error)', 'प्रशिक्षु रोल नंबर नहीं मिला।');
      return;
    }

    setSavingPin(true);
    try {
      await setRecruitPinApi(recruit.roll_number, cleanPin);
      Alert.alert(
        'सफलता (Success)',
        'सुरक्षा पिन सफलतापूर्वक सेट हो गया है! अब आप अगली बार सीधे इस पिन से लॉगिन कर सकते हैं।'
      );
      setNewPin('');
    } catch (err) {
      Alert.alert('पिन अपडेट विफल', err.message || 'पिन सेट करने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setSavingPin(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Avatar & Basic Info */}
        <View style={styles.avatarCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {recruit?.full_name ? recruit.full_name[0].toUpperCase() : 'T'}
            </Text>
          </View>
          <Text style={styles.avatarName}>{recruit?.full_name || 'Trainee'}</Text>
          <Text style={styles.avatarRoll}>Roll No: {recruit?.roll_number}</Text>
        </View>

        {/* Set / Change PIN Card */}
        <View style={styles.pinCard}>
          <Text style={styles.pinTitle}>लॉगिन पिन बनाएं / बदलें (Set Quick PIN)</Text>
          <Text style={styles.pinSubtitle}>
            अगली बार जन्म तिथि के स्थान पर सीधे 4 या 6 अंकों के पिन से आसानी से लॉगिन करें:
          </Text>

          <View style={styles.pinRow}>
            <TextInput
              style={styles.pinInput}
              placeholder="4 या 6-अंकीय पिन"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              maxLength={6}
              secureTextEntry
              value={newPin}
              onChangeText={setNewPin}
            />
            <TouchableOpacity
              style={[styles.pinSaveBtn, savingPin && { opacity: 0.7 }]}
              onPress={handleSetPin}
              disabled={savingPin}
              activeOpacity={0.8}
            >
              {savingPin ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.pinSaveText}>सेव करें (Save)</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Trainee Details List */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardHeader}>प्रशिक्षु विवरण (Profile Information)</Text>
          {profileFields.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => navigation.replace('Login')}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>लॉग आउट (Logout)</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  avatarCard: {
    backgroundColor: '#0F3964',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F3964',
  },
  avatarName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  avatarRoll: {
    fontSize: 14,
    color: '#93C5FD',
    marginTop: 2,
  },
  /* PIN Setup Card */
  pinCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  pinTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F3964',
    marginBottom: 4,
  },
  pinSubtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 12,
  },
  pinRow: {
    flexDirection: 'row',
    gap: 10,
  },
  pinInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: '#F8FAFC',
    color: '#0F172A',
  },
  pinSaveBtn: {
    backgroundColor: '#0F3964',
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 110,
  },
  pinSaveText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  /* Details Card */
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  cardHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F3964',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  label: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  logoutBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
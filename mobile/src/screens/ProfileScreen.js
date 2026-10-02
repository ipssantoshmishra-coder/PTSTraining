import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export default function ProfileScreen({ route, navigation }) {
  const { recruit } = route.params || {};

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {recruit?.full_name ? recruit.full_name[0].toUpperCase() : 'T'}
            </Text>
          </View>
          <Text style={styles.avatarName}>{recruit?.full_name || 'Trainee'}</Text>
          <Text style={styles.avatarRoll}>Roll No: {recruit?.roll_number}</Text>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.cardHeader}>प्रशिक्षु विवरण (Profile Information)</Text>
          {profileFields.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          ))}
        </View>

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
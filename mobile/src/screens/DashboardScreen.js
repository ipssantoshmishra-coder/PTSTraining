import React from 'react';
import {
  StyleSheet, Text, View, SafeAreaView, ScrollView,
  TouchableOpacity, StatusBar
} from 'react-native';

export default function DashboardScreen({ route, navigation }) {
  const { recruit } = route.params || {};

  const modules = [
    { title: 'आवास (Lodging)', icon: '🛏️', screen: 'Lodging', subtitle: `${recruit?.hostel_name || 'N/A'} - ${recruit?.bed_no || ''}` },
    { title: 'मेस (Fooding)', icon: '🍽️', screen: 'Fooding', subtitle: recruit?.mess_name || 'Central Mess' },
    { title: 'अंत: कक्ष (Indoor)', icon: '📚', screen: 'Indoor', subtitle: `${recruit?.indoor_batch_no || 'Batch'} • ${recruit?.indoor_room_no || 'Room'}` },
    { title: 'वाह्य कक्ष (Outdoor)', icon: '🏃', screen: 'Outdoor', subtitle: recruit?.outdoor_company || 'Company' },
    { title: 'अवकाश (Leave Portal)', icon: '📝', screen: 'LeavePortal', subtitle: 'आवेदन एवं स्थिति' },
    { title: 'परीक्षा (Exam Portal)', icon: '📅', screen: 'ExamPortal', subtitle: 'समय सारिणी व अंक' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B2545" />

      {/* Trainee Profile Bar */}
      <View style={styles.profileHeader}>
        <View style={styles.profileRow}>
          <View>
            <Text style={styles.nameText}>{recruit?.full_name || 'Trainee'}</Text>
            <Text style={styles.metaText}>रोल नंबर: {recruit?.roll_number} | गृह जनपद: {recruit?.home_district}</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => navigation.replace('Login')}
          >
            <Text style={styles.logoutText}>लॉग आउट</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeLabel}>Company: {recruit?.outdoor_company || 'N/A'}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeLabel}>Platoon: {recruit?.outdoor_platoon || 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* 6 Feature Buttons Grid */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionHeader}>प्रशिक्षण एवं सुविधाएं (Modules)</Text>

        <View style={styles.grid}>
          {modules.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.tile}
              onPress={() => navigation.navigate(item.screen, { recruit })}
            >
              <Text style={styles.tileIcon}>{item.icon}</Text>
              <Text style={styles.tileTitle}>{item.title}</Text>
              <Text style={styles.tileSubtitle} numberOfLines={1}>{item.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  profileHeader: { backgroundColor: '#0B2545', padding: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  profileRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nameText: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  metaText: { fontSize: 13, color: '#CBD5E1', marginTop: 3 },
  logoutBtn: { backgroundColor: '#DC2626', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  logoutText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  badgeRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  badge: { backgroundColor: 'rgba(255,255,255,0.14)', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  badgeLabel: { color: '#E2E8F0', fontSize: 12, fontWeight: '500' },
  contentContainer: { padding: 18 },
  sectionHeader: { fontSize: 13, fontWeight: '700', color: '#64748B', marginBottom: 14, textTransform: 'uppercase' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tileIcon: { fontSize: 28, marginBottom: 8 },
  tileTitle: { fontSize: 14, fontWeight: 'bold', color: '#0F172A' },
  tileSubtitle: { fontSize: 11, color: '#64748B', marginTop: 4 },
});
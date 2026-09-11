import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, StatusBar } from 'react-native';

export default function ExamPortalScreen({ route }) {
  const dummySchedules = [
    { id: 1, subject: 'IPC & CrPC (भारतीय दंड संहिता)', type: 'Indoor', date: '25/09/2026', time: '10:00 AM', venue: 'Hall 2' },
    { id: 2, subject: 'Weapon Handling (शस्त्र प्रशिक्षण)', type: 'Outdoor', date: '28/09/2026', time: '07:00 AM', venue: 'Firing Range' },
    { id: 3, subject: 'Police Modern Science (फोरेंसिक)', type: 'Indoor', date: '02/10/2026', time: '10:00 AM', venue: 'Hall 1' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B2545" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>आगामी परीक्षा समय सारिणी (Exam Timetable)</Text>

        {dummySchedules.map((item) => (
          <View key={item.id} style={styles.examCard}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{item.type}</Text>
            </View>
            <Text style={styles.subject}>{item.subject}</Text>
            <Text style={styles.meta}>📅 दिनांक: {item.date} | ⏰ समय: {item.time}</Text>
            <Text style={styles.meta}>📍 स्थान / कक्ष: {item.venue}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16 },
  header: { fontSize: 15, fontWeight: 'bold', color: '#1E293B', marginBottom: 14 },
  examCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 6,
  },
  typeText: { fontSize: 11, fontWeight: '700', color: '#0369A1' },
  subject: { fontSize: 15, fontWeight: 'bold', color: '#0F172A', marginBottom: 4 },
  meta: { fontSize: 12, color: '#475569', marginTop: 3 },
});
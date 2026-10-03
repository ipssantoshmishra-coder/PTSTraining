import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, StatusBar } from 'react-native';

export default function ExamPortalScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B2545" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>परीक्षा एवं मूल्यांकन (Exam & Evaluation)</Text>

        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>📋</Text>
          </View>
          <Text style={styles.title}>समय सारिणी शीघ्र उपलब्ध होगी</Text>
          <Text style={styles.subTitle}>
            प्रशिक्षण पाठ्यक्रम के अनुसार प्रथम आंतरिक मूल्यांकन परीक्षा की समय सारिणी प्रशासन द्वारा शीघ्र घोषित की जाएगी।
          </Text>
          <View style={styles.divider} />
          <Text style={styles.footerNote}>
            📢 परीक्षा संबंधी सभी आधिकारिक तिथियां एवं कक्ष आवंटन सूचना बोर्ड (Notices) में भी प्रसारित की जाएंगी।
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 18 },
  header: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  iconText: { fontSize: 28 },
  title: { fontSize: 16, fontWeight: '700', color: '#0F172A', textAlign: 'center', marginBottom: 8 },
  subTitle: { fontSize: 13, color: '#475569', textAlign: 'center', lineHeight: 20 },
  divider: { width: '100%', height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 },
  footerNote: { fontSize: 12, color: '#64748B', textAlign: 'center', lineHeight: 18 },
});
import React, { useLayoutEffect, useState,useEffect } from 'react';
import { fetchLatestNoticeApi } from '../api/noticeApi';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

export default function DashboardScreen({ route, navigation }) {
  const { recruit } = route.params || {};

  // Notice board content
const [notice, setNotice] = useState({
  title: 'वर्तमान में कोई नई सूचना उपलब्ध नहीं है।',
  timestamp: '',
});

useEffect(() => {
  async function loadNotice() {
    const data = await fetchLatestNoticeApi();
    if (data) {
      const formattedDate = new Date(data.created_at).toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      setNotice({
        title: data.message || data.title,
        timestamp: formattedDate,
      });
    }
  }
  loadNotice();
}, [])


  
  // 4 Primary Training Tabs (Clean red capsules matching the screenshot)
  const trainingModules = [
    { title: 'रहने का स्थान (Lodging)', screen: 'Lodging' },
    { title: 'भोजनालय (Fooding)', screen: 'Fooding' },
    { title: 'अंत: कक्ष प्रशिक्षण (InDoor Training)', screen: 'Indoor' },
    { title: 'बाह्य प्रशिक्षण (OutDoor Training)', screen: 'Outdoor' },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerStyle: {
        backgroundColor: '#FFFFFF',
        elevation: 0,
        shadowOpacity: 0,
      },
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.replace('Login')}
          style={styles.headerLogoutBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.headerLogoutText}>LOGOUT</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section - Exact Screenshot Replication */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeName}>
            Welcome  {recruit?.full_name || 'Sachin Verma'}
          </Text>
          <Text style={styles.metaLine}>
            Roll Number: {recruit?.roll_number || '3870223'}
          </Text>
          <Text style={styles.metaLine}>
            Home District: {recruit?.home_district || 'Ambedkar Nagar'}
          </Text>
        </View>

        {/* Notice Board Section */}
        <Text style={styles.noticeHeading}>महत्वपूर्ण सूचना</Text>
        <View style={styles.noticeCard}>
          <Text style={styles.noticeBody}>{notice.title}</Text>
          <Text style={styles.noticeTime}>{notice.timestamp}</Text>
        </View>

        {/* Training Information Header */}
        <Text style={styles.sectionHeading}>Training Information</Text>

        {/* 4 Solid Red Action Buttons */}
        <View style={styles.moduleContainer}>
          {trainingModules.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.trainingBtn}
              onPress={() => navigation.navigate(item.screen, { recruit })}
              activeOpacity={0.85}
            >
              <Text style={styles.trainingBtnText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Bar: Profile First */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate('Profile', { recruit })}
          activeOpacity={0.7}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#EEF2FF' }]}>
            <Text style={styles.tabIcon}>👤</Text>
          </View>
          <Text style={[styles.tabLabel, { color: '#4F46E5' }]}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate('FeedbackPortal', { recruit })}
          activeOpacity={0.7}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#ECFDF5' }]}>
            <Text style={styles.tabIcon}>💬</Text>
          </View>
          <Text style={[styles.tabLabel, { color: '#059669' }]}>Feedback</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate('LeavePortal', { recruit })}
          activeOpacity={0.7}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#FFFBEB' }]}>
            <Text style={styles.tabIcon}>📝</Text>
          </View>
          <Text style={[styles.tabLabel, { color: '#D97706' }]}>Leave</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate('ExamPortal', { recruit })}
          activeOpacity={0.7}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#FEF2F2' }]}>
            <Text style={styles.tabIcon}>📅</Text>
          </View>
          <Text style={[styles.tabLabel, { color: '#DC2626' }]}>Exam</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F0F8', // Soft neutral sky background from screenshot
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 95,
  },

  /* Header Logout (Clean, Prominent Red Pill) */
  headerLogoutBtn: {
    backgroundColor: '#E11D48',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 10,
  },
  headerLogoutText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  /* Welcome Section (Exact Screenshot Typography & Spacing) */
  welcomeSection: {
    paddingTop: 4,
    paddingBottom: 16,
    paddingHorizontal: 4,
  },
  welcomeName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1D70B8',          // Vibrant cerulean / sky blue from reference
    letterSpacing: 0.2,
    marginBottom: 8,           // Spacing between name and roll number
  },
  metaLine: {
    fontSize: 18,
    fontWeight: '400',
    color: '#1E3A8A',          // Deep classic navy matching entire line uniformly
    letterSpacing: 0.2,
    marginBottom: 4,           // Compact natural gap between metadata rows
  },

  /* Notice Board Section */
  noticeHeading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#E11D48',          // Clean coral red title
    textAlign: 'center',
    marginBottom: 12,
  },
  noticeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    minHeight: 140,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 26,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  noticeBody: {
    fontSize: 15,
    color: '#1E293B',
    lineHeight: 24,
    fontWeight: '500',
  },
  noticeTime: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'right',
    marginTop: 12,
    fontWeight: '500',
  },

  /* Training Section Header */
  sectionHeading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F2C59',          // Deep authoritative training header
    textAlign: 'center',
    marginBottom: 18,
  },
  moduleContainer: {
    width: '100%',
    gap: 12,
  },

  /* 4 Action Buttons (Red Pill Bars Matching Reference Screenshot) */
  trainingBtn: {
    backgroundColor: '#FF1E1E', // Vibrant police red
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  trainingBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  /* Bottom Navigation Bar */
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 74,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingBottom: 6,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  tabIcon: {
    fontSize: 20,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
});
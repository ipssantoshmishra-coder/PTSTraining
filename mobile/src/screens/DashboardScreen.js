import React, { useLayoutEffect, useState, useCallback, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Animated,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchAllActiveNoticesApi } from '../api/noticeApi';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

export default function DashboardScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { recruit } = route.params || {};

  const [notices, setNotices] = useState([]);
  const [loadingNotices, setLoadingNotices] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Red glow pulsing animation for the latest notice
  const glowAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.4,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [glowAnim]);

  // Fetch all active notices and keep top 5
  const loadNotices = useCallback(async () => {
    try {
      const data = await fetchAllActiveNoticesApi();
      if (Array.isArray(data)) {
        // Take up to 5 latest notices
        setNotices(data.slice(0, 5));
      }
    } catch (err) {
      console.log('Notice load error:', err.message);
    } finally {
      setLoadingNotices(false);
      setRefreshing(false);
    }
  }, []);

  // Auto-refresh: runs on focus AND polls every 15s (no logout needed)
  useFocusEffect(
    useCallback(() => {
      loadNotices();
      const interval = setInterval(loadNotices, 15000);
      return () => clearInterval(interval);
    }, [loadNotices])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadNotices();
  };

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

  const formatNoticeTime = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 110 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeName}>
            Welcome  {recruit?.full_name || 'Trainee'}
          </Text>
          <Text style={styles.metaLine}>
            Roll Number: {recruit?.roll_number || 'N/A'}
          </Text>
          <Text style={styles.metaLine}>
            Home District: {recruit?.home_district || 'N/A'}
          </Text>
        </View>

        {/* Notice Board Heading */}
        <Text style={styles.noticeHeading}>महत्वपूर्ण सूचना</Text>

        {/* Scrollable Notice Container */}
        <View style={styles.noticeContainer}>
          <ScrollView
            style={styles.noticeInnerScroll}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
          >
            {loadingNotices ? (
              <ActivityIndicator color="#DC2626" style={{ marginVertical: 24 }} />
            ) : notices.length === 0 ? (
              <Text style={styles.noNoticeText}>
                वर्तमान में कोई नई सूचना उपलब्ध नहीं है।
              </Text>
            ) : (
              notices.map((item, index) => {
                const isLatest = index === 0;

                return (
                  <View
                    key={item.id || index}
                    style={[
                      styles.noticeItem,
                      isLatest ? styles.latestNoticeItem : styles.pastNoticeItem,
                      index === notices.length - 1 && { borderBottomWidth: 0 },
                    ]}
                  >
                    {/* Glowing Accent Indicator for Latest */}
                    {isLatest && (
                      <View style={styles.latestHeaderRow}>
                        <Animated.View
                          style={[
                            styles.glowDot,
                            { opacity: glowAnim },
                          ]}
                        />
                        <Text style={styles.latestBadgeText}>नवीनतम सूचना (NEW)</Text>
                      </View>
                    )}

                    {/* Numbered Notice: 1. xxxxx */}
                    <Text
                      style={[
                        styles.noticeText,
                        isLatest ? styles.latestNoticeText : styles.pastNoticeText,
                      ]}
                    >
                      {`${index + 1}. ${item.message || item.title}`}
                    </Text>

                    {/* Timestamp */}
                    <Text
                      style={[
                        styles.noticeTime,
                        isLatest && { color: '#B91C1C' },
                      ]}
                    >
                      {formatNoticeTime(item.created_at)}
                    </Text>
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>

        {/* Training Section Header */}
        <Text style={styles.sectionHeading}>Training Information</Text>

        {/* 4 Action Buttons */}
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

      {/* Bottom Bar: Profile first, high visibility tabs */}
      <View style={[styles.bottomBar,{ 
                  paddingBottom: Math.max(insets.bottom, Platform.OS === 'android' ? 16 : 8),
                  height: (Platform.OS === 'android' ? 68 : 58) + insets.bottom,
             }]}>
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
    backgroundColor: '#E8F0F8',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 95,
  },
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

  /* Welcome Section */
  welcomeSection: {
    paddingTop: 4,
    paddingBottom: 14,
    paddingHorizontal: 4,
  },
  welcomeName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1D70B8',
    letterSpacing: 0.2,
    marginBottom: 6,
  },
  metaLine: {
    fontSize: 18,
    fontWeight: '400',
    color: '#1E3A8A',
    letterSpacing: 0.2,
    marginBottom: 4,
  },

  /* Notice Board Section */
  noticeHeading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#E11D48',
    textAlign: 'center',
    marginBottom: 10,
  },
  noticeContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    maxHeight: 240, // Keeps the notice board neatly scrollable
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  noticeInnerScroll: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  noNoticeText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    paddingVertical: 20,
  },

  /* Notice Item Styles */
  noticeItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  latestNoticeItem: {
    backgroundColor: '#FEF2F2',
    marginHorizontal: -8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#DC2626',
    marginBottom: 6,
  },
  pastNoticeItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#CBD5E1',
    paddingLeft: 10,
  },

  /* Glowing Alert on Latest Notice */
  latestHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  glowDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#DC2626',
    marginRight: 6,
  },
  latestBadgeText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  noticeText: {
    fontSize: 14,
    lineHeight: 21,
  },
  latestNoticeText: {
    fontWeight: '700',
    color: '#991B1B', // Bold red for latest
  },
  pastNoticeText: {
    fontWeight: '500',
    color: '#334155', // Regular slate for previous
  },
  noticeTime: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'right',
    marginTop: 4,
    fontWeight: '500',
  },

  /* Training Information */
  sectionHeading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F2C59',
    textAlign: 'center',
    marginBottom: 16,
  },
  moduleContainer: {
    width: '100%',
    gap: 12,
  },
  trainingBtn: {
    backgroundColor: '#FF1E1E',
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
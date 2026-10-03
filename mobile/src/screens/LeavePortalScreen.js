import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { submitLeaveApi, fetchRecruitLeavesApi } from '../api/leaveApi';

export default function LeavePortalScreen({ route }) {
  const { recruit } = route.params || {};

  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [reason, setReason] = useState('');

  const [loading, setLoading] = useState(false);
  const [pastLeaves, setPastLeaves] = useState([]);
  const [fetchingHistory, setFetchingHistory] = useState(true);

  // Load recruit's past applications
  const loadHistory = useCallback(async () => {
    if (!recruit?.roll_number) return;
    setFetchingHistory(true);
    const data = await fetchRecruitLeavesApi(recruit.roll_number);
    setPastLeaves(data);
    setFetchingHistory(false);
  }, [recruit?.roll_number]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Handle contact input: only allow digits up to 10 digits
  const handleContactChange = (text) => {
    const numericOnly = text.replace(/[^0-9]/g, '');
    setEmergencyContact(numericOnly);
  };

  // Convert DD/MM/YYYY into a real Date object & ISO string (YYYY-MM-DD)
  const parseAndValidateDate = (dateStr) => {
    const cleaned = dateStr.trim();
    const parts = cleaned.split(/[\/\-\.]/);
    if (parts.length !== 3) return null;

    let day = parseInt(parts[0], 10);
    let month = parseInt(parts[1], 10);
    let year = parseInt(parts[2], 10);

    if (parts[2].length === 2) year = 2000 + year;

    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    if (month < 1 || month > 12 || day < 1 || day > 31 || year < 2026 || year > 2030) return null;

    // JavaScript Date constructor (month is 0-indexed)
    const dateObj = new Date(year, month - 1, day);
    if (
      dateObj.getFullYear() !== year ||
      dateObj.getMonth() !== month - 1 ||
      dateObj.getDate() !== day
    ) {
      return null;
    }

    const isoStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return { dateObj, isoStr };
  };

  const handleApply = async () => {
    // 1. Mandatory Fields Check
    if (!fromDate.trim() || !toDate.trim() || !reason.trim() || !emergencyContact.trim()) {
      Alert.alert('त्रुटि (Error)', 'कृपया सभी अनिवार्य विवरण भरें (Please fill all fields).');
      return;
    }

    // 2. Mobile Number Validation (Strict 10 digits, starts with 6-9)
    if (!/^[6-9]\d{9}$/.test(emergencyContact.trim())) {
      Alert.alert(
        'अमान्य मोबाइल नंबर (Invalid Mobile)',
        'कृपया 10 अंकों का मान्य भारतीय मोबाइल नंबर दर्ज करें (शुरुआत 6, 7, 8 या 9 से हो)।'
      );
      return;
    }

    // 3. Date Format Validation
    const parsedStart = parseAndValidateDate(fromDate);
    const parsedEnd = parseAndValidateDate(toDate);

    if (!parsedStart || !parsedEnd) {
      Alert.alert(
        'गलत दिनांक (Invalid Date)',
        'कृपया दिनांक सही प्रारूप DD/MM/YYYY में दर्ज करें (उदा. 15/10/2026)।'
      );
      return;
    }

    // 4. Back-Date Validation
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (parsedStart.dateObj < today) {
      Alert.alert(
        'अमान्य प्रारंभ तिथि (Back Date Not Allowed)',
        'अवकाश प्रारंभ तिथि आज या भविष्य की तिथि होनी चाहिए। पूर्व तिथि (Back-date) मान्य नहीं है।'
      );
      return;
    }

    // 5. Date Range Logical Check (To Date >= From Date)
    if (parsedEnd.dateObj < parsedStart.dateObj) {
      Alert.alert(
        'अमान्य दिनांक क्रम (Invalid Date Range)',
        'अंतिम तिथि (To Date) प्रारंभ तिथि (From Date) से पहले की नहीं हो सकती।'
      );
      return;
    }

    setLoading(true);

    try {
      await submitLeaveApi({
        roll_number: String(recruit?.roll_number || ''),
        recruit_name: recruit?.full_name || 'Trainee',
        company: recruit?.outdoor_company || '',
        leave_type: leaveType,
        start_date: parsedStart.isoStr,
        end_date: parsedEnd.isoStr,
        reason: reason.trim(),
        emergency_contact: emergencyContact.trim(),
      });

      Alert.alert('सफलता (Success)', 'अवकाश आवेदन सफलतापूर्वक जमा हो गया है!');
      setFromDate('');
      setToDate('');
      setReason('');
      setEmergencyContact('');
      loadHistory();
    } catch (err) {
      Alert.alert('आवेदन विफल (Submission Failed)', err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || 'PENDING').toUpperCase();
    if (s === 'APPROVED') {
      return { text: 'स्वीकृत (APPROVED)', bg: '#DCFCE7', color: '#15803D' };
    }
    if (s === 'REJECTED') {
      return { text: 'अस्वीकृत (REJECTED)', bg: '#FEE2E2', color: '#B91C1C' };
    }
    return { text: 'प्रक्रियाधीन (PENDING)', bg: '#FEF3C7', color: '#B45309' };
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Form Header */}
        <Text style={styles.heading}>अवकाश हेतु आवेदन (Apply for Leave)</Text>

        {/* Leave Type Selector */}
        <Text style={styles.label}>प्रकार (Leave Type)</Text>
        <View style={styles.typeRow}>
          {['Casual Leave', 'Medical Leave', 'Emergency'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.typeBtn, leaveType === type && styles.typeBtnActive]}
              onPress={() => setLeaveType(type)}
            >
              <Text style={[styles.typeBtnText, leaveType === type && styles.typeBtnTextActive]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date Inputs */}
        <View style={styles.dateRow}>
          <View style={styles.dateCol}>
            <Text style={styles.label}>प्रारंभ तिथि (From)</Text>
            <TextInput
              style={styles.input}
              value={fromDate}
              onChangeText={setFromDate}
              placeholder="DD/MM/YYYY"
              keyboardType="numbers-and-punctuation"
              maxLength={10}
            />
          </View>
          <View style={styles.dateCol}>
            <Text style={styles.label}>अंतिम तिथि (To)</Text>
            <TextInput
              style={styles.input}
              value={toDate}
              onChangeText={setToDate}
              placeholder="DD/MM/YYYY"
              keyboardType="numbers-and-punctuation"
              maxLength={10}
            />
          </View>
        </View>

        {/* Emergency Contact */}
        <Text style={styles.label}>आपातकालीन संपर्क नंबर (10-Digit Mobile No.)</Text>
        <TextInput
          style={styles.input}
          value={emergencyContact}
          onChangeText={handleContactChange}
          placeholder="e.g. 9876543210"
          keyboardType="numeric"
          maxLength={10}
        />

        {/* Reason */}
        <Text style={styles.label}>कारण (Reason for Leave)</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          value={reason}
          onChangeText={setReason}
          multiline
          textAlignVertical="top"
          placeholder="छुट्टी का स्पष्ट कारण दर्ज करें..."
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.btn, loading && { opacity: 0.6 }]}
          onPress={handleApply}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.btnText}>आवेदन भेजें (Submit Application)</Text>
          )}
        </TouchableOpacity>

        {/* Past Leaves History Section */}
        <View style={styles.historyContainer}>
          <Text style={styles.historyHeading}>आवेदन स्थिति (Leave History & Status)</Text>

          {fetchingHistory ? (
            <ActivityIndicator color="#0B2545" style={{ marginVertical: 14 }} />
          ) : pastLeaves.length === 0 ? (
            <Text style={styles.emptyText}>कोई पूर्व अवकाश आवेदन नहीं मिला।</Text>
          ) : (
            pastLeaves.map((item) => {
              const badge = getStatusBadge(item.status);
              return (
                <View key={item.id} style={styles.historyCard}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardType}>{item.leave_type}</Text>
                    <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                      <Text style={[styles.badgeText, { color: badge.color }]}>{badge.text}</Text>
                    </View>
                  </View>

                  <Text style={styles.cardDates}>
                    अवधि: {item.start_date} से {item.end_date}
                  </Text>
                  <Text style={styles.cardReason}>कारण: {item.reason}</Text>

                  {item.admin_remarks ? (
                    <Text style={styles.remarksText}>
                      अधिकारी टिप्पणी (Remarks): {item.admin_remarks}
                    </Text>
                  ) : null}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 18, paddingBottom: 60 },
  heading: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '700', color: '#334155', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 14,
    color: '#0F172A',
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  typeBtnActive: {
    backgroundColor: '#0B2545',
    borderColor: '#0B2545',
  },
  typeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  typeBtnTextActive: {
    color: '#FFFFFF',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateCol: {
    flex: 1,
  },
  btn: {
    backgroundColor: '#0B2545',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
    elevation: 2,
  },
  btnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  historyContainer: {
    marginTop: 26,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 18,
  },
  historyHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    paddingVertical: 14,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardType: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  cardDates: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
    marginBottom: 4,
  },
  cardReason: {
    fontSize: 13,
    color: '#1E293B',
  },
  remarksText: {
    fontSize: 12,
    color: '#D97706',
    marginTop: 6,
    fontWeight: '600',
  },
});
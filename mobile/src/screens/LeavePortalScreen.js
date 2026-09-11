import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';

export default function LeavePortalScreen({ route }) {
  const { recruit } = route.params;
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');

  const handleApply = () => {
    if (!fromDate || !toDate || !reason) {
      Alert.alert('त्रुटि (Error)', 'कृपया सभी विवरण भरें (Please fill all fields).');
      return;
    }
    Alert.alert('सफलता (Success)', `अवकाश आवेदन जमा हो गया है!\nRecruit ID: ${recruit?.roll_number}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>अवकाश हेतु आवेदन (Apply for Leave)</Text>

        <Text style={styles.label}>प्रकार (Leave Type)</Text>
        <TextInput
          style={styles.input}
          value={leaveType}
          onChangeText={setLeaveType}
          placeholder="Casual Leave / Medical Leave"
        />

        <Text style={styles.label}>प्रारंभ तिथि (From Date: DD/MM/YYYY)</Text>
        <TextInput
          style={styles.input}
          value={fromDate}
          onChangeText={setFromDate}
          placeholder="DD/MM/YYYY"
        />

        <Text style={styles.label}>अंतिम तिथि (To Date: DD/MM/YYYY)</Text>
        <TextInput
          style={styles.input}
          value={toDate}
          onChangeText={setToDate}
          placeholder="DD/MM/YYYY"
        />

        <Text style={styles.label}>कारण (Reason)</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          value={reason}
          onChangeText={setReason}
          multiline
          placeholder="कारण का विवरण दें..."
        />

        <TouchableOpacity style={styles.btn} onPress={handleApply}>
          <Text style={styles.btnText}>आवेदन भेजें (Submit Application)</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 18 },
  heading: { fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '700', color: '#334155', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
  },
  btn: {
    backgroundColor: '#0B2545',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
});
import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import InfoCard from '../components/InfoCard';

export default function IndoorScreen({ route }) {
  const { recruit } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B2545" />
      <ScrollView contentContainerStyle={styles.content}>
        <InfoCard icon="🏷️" title="बैच संख्या (Batch No)" value={recruit?.indoor_batch_no} />
        <InfoCard icon="🏫" title="कक्षा / हॉल (Room No)" value={recruit?.indoor_room_no} />
        <InfoCard
          icon="👨‍🏫"
          title="अंत: कक्ष प्रशिक्षक (Indoor Incharge)"
          value={recruit?.indoor_incharge_name}
          phone={recruit?.indoor_incharge_phone}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16 },
});
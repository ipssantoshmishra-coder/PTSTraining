import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import InfoCard from '../components/InfoCard';

export default function LodgingScreen({ route }) {
  const { recruit } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B2545" />
      <ScrollView contentContainerStyle={styles.content}>
        <InfoCard icon="🏢" title="होस्टल का नाम (Hostel)" value={recruit?.hostel_name} />
        <InfoCard icon="🚪" title="बैरेक नंबर (Barrack No)" value={recruit?.barrack_no} />
        <InfoCard icon="🛏️" title="बेड नंबर (Bed No)" value={recruit?.bed_no} />
        <InfoCard
          icon="👮"
          title="बैरेक प्रभारी (Barrack Incharge)"
          value={recruit?.barrack_incharge_name}
          phone={recruit?.barrack_incharge_phone}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16 },
});
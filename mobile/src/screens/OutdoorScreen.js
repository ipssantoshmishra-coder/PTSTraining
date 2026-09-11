import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import InfoCard from '../components/InfoCard';

export default function OutdoorScreen({ route }) {
  const { recruit } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B2545" />
      <ScrollView contentContainerStyle={styles.content}>
        <InfoCard icon="🚩" title="कंपनी (Company)" value={recruit?.outdoor_company} />
        <InfoCard icon="👥" title="प्लाटून (Platoon)" value={recruit?.outdoor_platoon} />
        <InfoCard
          icon="🎖️"
          title="ड्रिल मास्टर / प्रभारी (Drill Master)"
          value={recruit?.outdoor_incharge_name}
          phone={recruit?.outdoor_incharge_phone}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16 },
});
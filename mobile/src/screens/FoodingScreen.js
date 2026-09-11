import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import InfoCard from '../components/InfoCard';

export default function FoodingScreen({ route }) {
  const { recruit } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B2545" />
      <ScrollView contentContainerStyle={styles.content}>
        <InfoCard icon="🍽️" title="मेस का नाम (Assigned Mess)" value={recruit?.mess_name} />
        <InfoCard
          icon="👨‍🍳"
          title="मेस प्रभारी (Mess Incharge)"
          value={recruit?.mess_incharge_name}
          phone={recruit?.mess_incharge_phone}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16 },
});
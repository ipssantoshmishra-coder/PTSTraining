import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

export default function CustomHeader({ title, onBack, isLogout = false }) {
  return (
    <View style={globalStyles.topHeader}>
      <TouchableOpacity onPress={onBack} style={globalStyles.backButton}>
        <Text style={globalStyles.backButtonText}>{isLogout ? '🚪 Logout' : '← Back'}</Text>
      </TouchableOpacity>
      <Text style={globalStyles.topHeaderTitle}>{title}</Text>
      <View style={{ width: 60 }} />
    </View>
  );
}
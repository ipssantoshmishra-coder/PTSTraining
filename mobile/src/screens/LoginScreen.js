// mobile/src/screens/LoginScreen.js
import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  SafeAreaView, StatusBar, Alert, ActivityIndicator, Image,
} from 'react-native';
import { loginRecruit } from '../api/recruitApi';
import { ASSETS } from '../config/assets';
import { COLORS, SPACING, RADIUS } from '../styles/theme';
import { globalStyles } from '../styles/globalStyles';

export default function LoginScreen({ navigation }) {
  const [rollNumber, setRollNumber] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const cleanRoll = rollNumber.trim();
    const cleanPin = pin.trim();

    if (!cleanRoll) {
      Alert.alert('त्रुटि (Error)', 'कृपया अपना रोल नंबर दर्ज करें (Please enter Roll Number).');
      return;
    }

    if (!cleanPin || cleanPin.length < 4) {
      Alert.alert(
        'त्रुटि (Error)',
        'कृपया 4-अंकीय पिन दर्ज करें।\nप्रथम बार लॉगिन हेतु अपना जन्म वर्ष (उदा. 1998, 2002) दर्ज करें।'
      );
      return;
    }

    setLoading(true);
    try {
      const recruitData = await loginRecruit(cleanRoll, cleanPin);
      navigation.replace('Dashboard', { recruit: recruitData });
    } catch (error) {
      Alert.alert(
        'लॉगिन विफल (Login Failed)',
        error.message || 'रोल नंबर या पिन गलत है। (प्रथम लॉगिन हेतु जन्म वर्ष जैसे 1998 दर्ज करें)'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[globalStyles.safeArea, { backgroundColor: COLORS.color6 }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.backgroundColor} />

      {/* Police Insignia & Header */}
      <View style={styles.header}>
        <Image
          source={ASSETS.POLICE_LOGO}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appTitle}>PTS KALPI POLICE TRAINING PORTAL</Text>
        <Text style={styles.appSubtitle}>प्रशिक्षु लॉगिन (Trainee Login)</Text>
      </View>

      {/* Form Sheet */}
      <View style={styles.sheetContainer}>
        <Text style={globalStyles.loginInputLabel}>ROLL NUMBER (रोल नंबर)</Text>
        <TextInput
          style={globalStyles.textInput}
          placeholder="उदा. 3870223"
          keyboardType="numeric"
          value={rollNumber}
          onChangeText={setRollNumber}
          autoCapitalize="none"
        />

        <Text style={globalStyles.loginInputLabel}>
          SECURITY PIN (सुरक्षा पिन)
        </Text>
        <TextInput
          style={globalStyles.textInput}
          placeholder="4-अंकीय पिन (डिफ़ॉल्ट: जन्म वर्ष उदा. 1998)"
          keyboardType="numeric"
          maxLength={6}
          secureTextEntry
          value={pin}
          onChangeText={setPin}
        />
        <Text style={styles.hintText}>
          ℹ️ प्रथम लॉगिन हेतु डिफ़ॉल्ट पिन आपका 4-अंकीय जन्म वर्ष (उदा. 1998, 2004) है।
        </Text>

        <TouchableOpacity
          style={[globalStyles.primaryButton, loading && { opacity: 0.6 }]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.textLight} />
          ) : (
            <Text style={globalStyles.primaryButtonText}>प्रवेश करें (LOGIN)</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
  },
  logo: {
    width: 130,
    height: 130,
    marginBottom: SPACING.sm,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textLight,
    letterSpacing: 0.5,
  },
  appSubtitle: {
    fontSize: 14,
    color: COLORS.textLightMuted,
    marginTop: 4,
  },
  sheetContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  hintText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: -8,
    marginBottom: 20,
    lineHeight: 16,
  },
});
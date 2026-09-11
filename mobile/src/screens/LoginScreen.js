// mobile/src/screens/LoginScreen.js
import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  SafeAreaView, StatusBar, Alert, ActivityIndicator, Image,
  useColorScheme
} from 'react-native';
import { loginRecruit } from '../api/recruitApi';
import { ASSETS } from '../config/assets';
import { COLORS, SPACING, RADIUS } from '../styles/theme';
import { globalStyles } from '../styles/globalStyles';

export default function LoginScreen({ navigation }) {
  const [rollNumber, setRollNumber] = useState('3870223');
  const [dob, setDob] = useState('15/08/1998');
  const [loading, setLoading] = useState(false);

  const handleDobChange = (text) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    let formatted = cleaned;
    if (cleaned.length > 2 && cleaned.length <= 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    }
    setDob(formatted);
  };

  const handleLogin = async () => {
    if (!rollNumber.trim() || dob.length !== 10) {
      Alert.alert('Validation Error', 'Please enter valid Roll Number and DOB (DD/MM/YYYY).');
      return;
    }
    setLoading(true);
    try {
      const recruitData = await loginRecruit(rollNumber, dob);
      navigation.replace('Dashboard', { recruit: recruitData });
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Check Roll Number and DOB.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[globalStyles.safeArea, { backgroundColor: COLORS.color6 }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.backgroundColor} />

      {/* Header with centralized logo */}
      <View style={styles.header}>
        <Image
          source={ASSETS.POLICE_LOGO}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appTitle}>PTS KALPI POLICE TRAINING PORTAL</Text>
        <Text style={styles.appSubtitle}>प्रशिक्षु लॉगिन (Trainee Login)</Text>
      </View>

      {/* Sheet Form using Global Input & Button Styles */}
      <View style={styles.sheetContainer}>
        <Text style={globalStyles.loginInputLabel}>ROLL NUMBER (रोल नंबर)</Text>
        <TextInput
          style={globalStyles.textInput}
          placeholder="e.g. 3870223"
          keyboardType="numeric"
          value={rollNumber}
          onChangeText={setRollNumber}
        />

        <Text style={globalStyles.loginInputLabel}>DATE OF BIRTH (जन्म तिथि: DD/MM/YYYY)</Text>
        <TextInput
          style={globalStyles.textInput}
          placeholder="DD/MM/YYYY"
          keyboardType="numeric"
          maxLength={10}
          value={dob}
          onChangeText={handleDobChange}
        />

        <TouchableOpacity
          style={[globalStyles.primaryButton, loading && { opacity: 0.6 }]}
          onPress={handleLogin}
          disabled={loading}
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
    width: 200,
    height: 200,
    marginBottom: SPACING.sm,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textLight,
    letterSpacing: 1,
  },
  appSubtitle: {
    fontSize: 15,
    color: COLORS.textLightMuted,
    marginTop: 4,
  },
  sheetContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
});
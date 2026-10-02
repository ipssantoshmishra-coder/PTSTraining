import React, { useState, useEffect, useCallback } from 'react';
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { submitFeedbackApi, fetchRecruitFeedbacksApi } from '../api/feedbackApi';

export default function FeedbackScreen({ route }) {
  const { recruit } = route?.params || {};
  const [feedbackText, setFeedbackText] = useState('');
  const [loading, setLoading] = useState(false);
  const [pastFeedbacks, setPastFeedbacks] = useState([]);
  const [fetchingHistory, setFetchingHistory] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Compute word count
  const wordCount = feedbackText.trim() === '' 
    ? 0 
    : feedbackText.trim().split(/\s+/).length;

  const loadPastFeedbacks = useCallback(async () => {
    if (!recruit?.roll_number) return;
    try {
      const data = await fetchRecruitFeedbacksApi(recruit.roll_number);
      setPastFeedbacks(data || []);
    } catch (err) {
      console.log('Error loading feedback history:', err.message);
    } finally {
      setFetchingHistory(false);
      setRefreshing(false);
    }
  }, [recruit?.roll_number]);

  useEffect(() => {
    loadPastFeedbacks();
  }, [loadPastFeedbacks]);

  const onRefresh = () => {
    setRefreshing(true);
    loadPastFeedbacks();
  };

  const handleApply = async () => {
    if (wordCount < 5) {
      Alert.alert(
        'Feedback Incomplete',
        `Please write at least 5 words.\nCurrent word count: ${wordCount}`
      );
      return;
    }

    setLoading(true);
    try {
      await submitFeedbackApi(
        recruit?.roll_number,
        recruit?.full_name,
        feedbackText
      );

      Alert.alert(
        'सफलता (Success)',
        'आपका फीडबैक सफलतापूर्वक दर्ज कर लिया गया है।'
      );
      setFeedbackText('');
      // Reload history list so the new feedback shows immediately
      loadPastFeedbacks();
    } catch (error) {
      Alert.alert('Submission Error', error.message || 'फीडबैक सबमिट नहीं हो सका।');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* 1. Trainee Profile Header Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>प्रशिक्षु विवरण (Trainee Info)</Text>
            <Text style={styles.infoName}>{recruit?.full_name || 'Trainee'}</Text>
            <Text style={styles.infoMeta}>
              रोल नं: {recruit?.roll_number || 'N/A'} | कंपनी: {recruit?.outdoor_company || 'N/A'}
            </Text>
          </View>

          {/* 2. New Feedback Card */}
          <View style={styles.formCard}>
            <Text style={styles.sectionHeading}>नया फीडबैक दर्ज करें (New Feedback)</Text>
            <Text style={styles.sectionSubtitle}>
              आवास, मेस, क्लास या परेड से संबंधित अपनी राय या समस्या लिखें।
            </Text>

            <TextInput
              style={styles.textInput}
              value={feedbackText}
              onChangeText={setFeedbackText}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              placeholder="यहाँ अपना फीडबैक कम से कम 5 शब्दों में लिखें..."
              placeholderTextColor="#94A3B8"
            />

            <View style={styles.counterRow}>
              <Text
                style={[
                  styles.counterText,
                  wordCount < 5 ? styles.counterPending : styles.counterSuccess,
                ]}
              >
                {wordCount}/5 शब्द {wordCount >= 5 ? '✓' : ''}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.submitBtn,
                wordCount < 5 && styles.submitBtnDisabled,
              ]}
              onPress={handleApply}
              disabled={loading || wordCount < 5}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.submitBtnText}>Submit Feedback (जमा करें)</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* 3. Past Feedbacks Section */}
          <View style={styles.historySection}>
            <Text style={styles.historyHeading}>
              पूर्व में भेजे गए फीडबैक (My Past Feedbacks)
            </Text>

            {fetchingHistory ? (
              <ActivityIndicator color="#0B2545" style={{ marginTop: 20 }} />
            ) : pastFeedbacks.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>आपने अभी तक कोई फीडबैक नहीं दिया है।</Text>
              </View>
            ) : (
              pastFeedbacks.map((item) => (
                <View key={item.id} style={styles.historyCard}>
                  <View style={styles.historyCardHeader}>
                    <Text style={styles.historyDate}>{formatDate(item.created_at)}</Text>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>दर्ज (Received)</Text>
                    </View>
                  </View>
                  <Text style={styles.historyBody}>{item.feedback_text}</Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 60,
  },
  infoCard: {
    backgroundColor: '#0B2545',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  infoTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#93C5FD',
    textTransform: 'uppercase',
  },
  infoName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  infoMeta: {
    fontSize: 13,
    color: '#CBD5E1',
    marginTop: 2,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 12,
    minHeight: 110,
    backgroundColor: '#FAFAFA',
    fontSize: 15,
    color: '#0F172A',
    lineHeight: 20,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 6,
    marginBottom: 12,
  },
  counterText: {
    fontSize: 12,
    fontWeight: '600',
  },
  counterPending: {
    color: '#DC2626',
  },
  counterSuccess: {
    color: '#16A34A',
  },
  submitBtn: {
    backgroundColor: '#0B2545',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  submitBtnText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  historySection: {
    marginTop: 22,
  },
  historyHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 10,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  historyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 6,
  },
  historyDate: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  statusBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    color: '#0369A1',
    fontSize: 11,
    fontWeight: '700',
  },
  historyBody: {
    fontSize: 14,
    color: '#1E293B',
    lineHeight: 20,
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 13,
  },
});
// mobile/src/components/InfoCard.js
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { COLORS, SPACING, FONTS } from '../styles/theme';

export default function InfoCard({ icon, title, value, phone }) {
  return (
    <View style={globalStyles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={globalStyles.inputLabel}>{title}</Text>
      </View>
      <Text style={[globalStyles.itemTitle, styles.valueIndent]}>{value || 'N/A'}</Text>

      {phone && phone !== 'N/A' && (
        <TouchableOpacity
          style={styles.callBtn}
          onPress={() => Linking.openURL(`tel:${phone}`)}
        >
          <Text style={styles.callBtnText}>📞 कॉल करें ({phone})</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  icon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  valueIndent: {
    marginLeft: 28,
  },
  callBtn: {
    marginTop: SPACING.sm,
    marginLeft: 28,
    backgroundColor: '#EFF6FF',
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  callBtnText: {
    color: COLORS.secondary,
    fontWeight: '700',
    fontSize: FONTS.sm,
  },
});
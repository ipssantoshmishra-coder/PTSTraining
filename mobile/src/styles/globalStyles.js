// mobile/src/styles/globalStyles.js
import { StyleSheet } from 'react-native';
import { COLORS, SPACING, FONTS, RADIUS } from './theme';

export const globalStyles = StyleSheet.create({
  // Layout containers
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    padding: SPACING.lg,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Card styles
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // Form elements
  inputLabel: {
    fontSize: FONTS.sm,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
  },
  loginInputLabel: {
    fontSize: FONTS.md,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
  },
  textInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    fontSize: FONTS.regular,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },

  // Primary action buttons
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: COLORS.textLight,
    fontSize: FONTS.regular,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  // Typography helpers
  sectionTitle: {
    fontSize: FONTS.sm,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    marginBottom: SPACING.md,
  },
  itemTitle: {
    fontSize: FONTS.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  itemSubtitle: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});
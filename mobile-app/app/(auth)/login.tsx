import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BaseInput } from '../../src/components/atoms/BaseInput';
import { BaseButton } from '../../src/components/atoms/BaseButton';
import { useAuthStore } from '../../src/stores/authStore';
import { getPostAuthAppHref } from '../../src/utils/postAuthNavigation';
import { colors, spacing, fontSize, borderRadius } from '../../src/theme';

export default function LoginScreen() {
  const { requestOtp, verifyOtp, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleRequestOtp = async () => {
    clearError();
    if (!email.trim()) return;
    const success = await requestOtp({ email });
    if (success) setOtpSent(true);
  };

  const handleVerifyOtp = async () => {
    clearError();
    if (!code.trim()) return;
    const success = await verifyOtp({ email, code });
    if (success) {
      const { user } = useAuthStore.getState();
      router.replace(getPostAuthAppHref(user?.groupId));
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.logo}>Together</Text>
            <Text style={styles.subtitle}>
              Gérez les tâches du quotidien ensemble
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Connexion</Text>

            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {!otpSent ? (
              <>
                <BaseInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="votre@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <BaseButton
                  title="Recevoir un code"
                  onPress={handleRequestOtp}
                  loading={isLoading}
                  fullWidth
                  size="lg"
                />
              </>
            ) : (
              <>
                <Text style={styles.otpInfo}>
                  Un code à 6 chiffres a été envoyé à {email}
                </Text>
                <BaseInput
                  label="Code OTP"
                  value={code}
                  onChangeText={setCode}
                  placeholder="123456"
                  keyboardType="number-pad"
                  maxLength={6}
                />
                <BaseButton
                  title="Se connecter"
                  onPress={handleVerifyOtp}
                  loading={isLoading}
                  fullWidth
                  size="lg"
                />
                <TouchableOpacity onPress={() => { setOtpSent(false); clearError(); }}>
                  <Text style={styles.resendLink}>Renvoyer le code</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <TouchableOpacity
            onPress={() => router.push('/(auth)/register')}
            style={styles.footer}
          >
            <Text style={styles.footerText}>
              Pas encore de compte ?{' '}
              <Text style={styles.footerLink}>S'inscrire</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  logo: {
    fontSize: fontSize.xxxl,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: colors.errorLight,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  errorText: {
    color: colors.error,
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
  otpInfo: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  resendLink: {
    color: colors.primary,
    fontSize: fontSize.sm,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  footer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  footerLink: {
    color: colors.primary,
    fontWeight: '600',
  },
});

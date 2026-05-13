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

export default function RegisterScreen() {
  const { register, verifyOtp, isLoading, error, clearError } = useAuthStore();
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'form' | 'otp'>('form');

  const handleRegister = async () => {
    clearError();
    const success = await register({ nom, prenom, pseudo, email });
    if (success) setStep('otp');
  };

  const handleVerifyOtp = async () => {
    clearError();
    const success = await verifyOtp({ email, code });
    if (success) {
      const { user } = useAuthStore.getState();
      router.replace(getPostAuthAppHref(user?.groupId));
    }
  };

  if (step === 'otp') {
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
            <View style={styles.card}>
              <Text style={styles.title}>Vérification</Text>
              <Text style={styles.otpInfo}>
                Un code à 6 chiffres a été envoyé à {email}
              </Text>

              {error && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <BaseInput
                label="Code OTP"
                value={code}
                onChangeText={setCode}
                placeholder="123456"
                keyboardType="number-pad"
                maxLength={6}
              />
              <BaseButton
                title="Valider"
                onPress={handleVerifyOtp}
                loading={isLoading}
                fullWidth
                size="lg"
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

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
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Inscription</Text>

            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <BaseInput label="Nom" value={nom} onChangeText={setNom} placeholder="Votre nom" />
            <BaseInput label="Prénom" value={prenom} onChangeText={setPrenom} placeholder="Votre prénom" />
            <BaseInput label="Pseudo" value={pseudo} onChangeText={setPseudo} placeholder="Votre pseudo" />
            <BaseInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="votre@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <BaseButton
              title="S'inscrire"
              onPress={handleRegister}
              loading={isLoading}
              fullWidth
              size="lg"
            />
          </View>

          <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.footer}>
            <Text style={styles.footerText}>
              Déjà un compte ?{' '}
              <Text style={styles.footerLink}>Se connecter</Text>
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
  header: { alignItems: 'center', marginBottom: spacing.xxl },
  logo: {
    fontSize: fontSize.xxxl,
    fontWeight: '700',
    color: colors.primary,
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
  footer: { marginTop: spacing.xl, alignItems: 'center' },
  footerText: { fontSize: fontSize.md, color: colors.textSecondary },
  footerLink: { color: colors.primary, fontWeight: '600' },
});

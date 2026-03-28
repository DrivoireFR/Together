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
import { authRepository } from '../../src/repositories/authRepository';
import { DataSuccess } from '../../src/utils/DataResult';
import { colors, spacing, fontSize, borderRadius } from '../../src/theme';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError('Email requis');
      return;
    }
    setIsLoading(true);
    setError('');
    const result = await authRepository.requestPasswordReset({ email });
    setIsLoading(false);
    if (result instanceof DataSuccess) {
      setIsSent(true);
    } else {
      setError(result.message);
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
          <View style={styles.card}>
            <Text style={styles.title}>Mot de passe oublié</Text>

            {isSent ? (
              <View>
                <Text style={styles.successText}>
                  Un email de réinitialisation a été envoyé à {email}
                </Text>
                <BaseButton
                  title="Retour à la connexion"
                  onPress={() => router.replace('/(auth)/login')}
                  fullWidth
                  size="lg"
                />
              </View>
            ) : (
              <View>
                <Text style={styles.description}>
                  Entrez votre email pour recevoir un lien de réinitialisation.
                </Text>

                {error ? (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                <BaseInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="votre@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <BaseButton
                  title="Envoyer"
                  onPress={handleSubmit}
                  loading={isLoading}
                  fullWidth
                  size="lg"
                />
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            style={styles.footer}
          >
            <Text style={styles.footerText}>
              <Text style={styles.footerLink}>Retour à la connexion</Text>
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
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  description: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
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
  successText: {
    fontSize: fontSize.md,
    color: colors.success,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  footer: { marginTop: spacing.xl, alignItems: 'center' },
  footerText: { fontSize: fontSize.md, color: colors.textSecondary },
  footerLink: { color: colors.primary, fontWeight: '600' },
});

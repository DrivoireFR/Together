import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BaseInput } from '../../../../src/components/atoms/BaseInput';
import { BaseButton } from '../../../../src/components/atoms/BaseButton';
import { AvatarDisplay } from '../../../../src/components/atoms/AvatarDisplay';
import { useAuthStore } from '../../../../src/stores/authStore';
import { Avatar } from '../../../../src/types';
import { colors, spacing, fontSize, borderRadius } from '../../../../src/theme';

const AVATAR_OPTIONS = Object.values(Avatar);

export default function ProfileScreen() {
  const { user, updateProfile, isLoading, resendConfirmation } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [nom, setNom] = useState(user?.nom ?? '');
  const [prenom, setPrenom] = useState(user?.prenom ?? '');
  const [pseudo, setPseudo] = useState(user?.pseudo ?? '');
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | undefined>(
    user?.avatar,
  );

  const handleSave = async () => {
    const success = await updateProfile({
      nom: nom.trim(),
      prenom: prenom.trim(),
      pseudo: pseudo.trim(),
      avatar: selectedAvatar,
    });
    if (success) setIsEditing(false);
  };

  const handleCancel = () => {
    setNom(user?.nom ?? '');
    setPrenom(user?.prenom ?? '');
    setPseudo(user?.pseudo ?? '');
    setSelectedAvatar(user?.avatar);
    setIsEditing(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Profil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarSection}>
          <AvatarDisplay
            avatar={isEditing ? selectedAvatar : user?.avatar}
            name={user?.pseudo}
            size={80}
          />
          <Text style={styles.userName}>{user?.pseudo}</Text>
          {user?.email && (
            <Text style={styles.userEmail}>{user.email}</Text>
          )}
          {user && !user.emailVerified && (
            <View style={styles.unverifiedBanner}>
              <Text style={styles.unverifiedText}>Email non vérifié</Text>
              <BaseButton
                title="Renvoyer"
                variant="ghost"
                size="sm"
                onPress={() => user.email && resendConfirmation(user.email)}
              />
            </View>
          )}
        </View>

        {isEditing ? (
          <View style={styles.form}>
            <BaseInput
              label="Nom"
              value={nom}
              onChangeText={setNom}
            />
            <BaseInput
              label="Prénom"
              value={prenom}
              onChangeText={setPrenom}
            />
            <BaseInput
              label="Pseudo"
              value={pseudo}
              onChangeText={setPseudo}
            />

            <Text style={styles.label}>Avatar</Text>
            <View style={styles.avatarGrid}>
              {AVATAR_OPTIONS.map((av: Avatar) => (
                <TouchableOpacity
                  key={av as string}
                  onPress={() => setSelectedAvatar(av)}
                  style={[
                    styles.avatarOption,
                    selectedAvatar === av && styles.avatarOptionSelected,
                  ]}
                >
                  <AvatarDisplay avatar={av} name={av} size={44} />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.actions}>
              <BaseButton
                title="Annuler"
                variant="outline"
                onPress={handleCancel}
              />
              <BaseButton
                title="Enregistrer"
                onPress={handleSave}
                loading={isLoading}
              />
            </View>
          </View>
        ) : (
          <View style={styles.info}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Nom</Text>
              <Text style={styles.infoValue}>{user?.nom}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Prénom</Text>
              <Text style={styles.infoValue}>{user?.prenom}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Pseudo</Text>
              <Text style={styles.infoValue}>{user?.pseudo}</Text>
            </View>
            <BaseButton
              title="Modifier"
              variant="outline"
              onPress={() => setIsEditing(true)}
              fullWidth
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  backButton: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: '500',
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
  },
  scrollContent: { padding: spacing.xl },
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  userName: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
  },
  userEmail: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  unverifiedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  unverifiedText: {
    fontSize: fontSize.sm,
    color: colors.warning,
    fontWeight: '500',
  },
  form: { marginTop: spacing.md },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  avatarOption: {
    padding: 2,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarOptionSelected: {
    borderColor: colors.primary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
    marginBottom: spacing.xxxl,
  },
  info: { gap: spacing.md },
  infoItem: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
  },
  infoLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.text,
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGroupStore } from '../../../../../src/stores/groupStore';
import { useAuthStore } from '../../../../../src/stores/authStore';
import { BaseButton } from '../../../../../src/components/atoms/BaseButton';
import { BaseCard } from '../../../../../src/components/atoms/BaseCard';
import { AvatarDisplay } from '../../../../../src/components/atoms/AvatarDisplay';
import { colors, spacing, fontSize } from '../../../../../src/theme';
import * as Clipboard from 'expo-clipboard';

export default function SettingsTab() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currentGroup, leaveGroup } = useGroupStore();
  const { user, logout } = useAuthStore();
  const [copied, setCopied] = useState(false);

  const handleCopyInvite = async () => {
    if (currentGroup) {
      const inviteText = `Rejoins mon groupe "${currentGroup.nom}" sur Together ! Code : ${currentGroup.code}`;
      try {
        await Clipboard.setStringAsync(inviteText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Clipboard may not be available
      }
    }
  };

  const handleLeaveGroup = () => {
    Alert.alert(
      'Quitter le groupe',
      'Êtes-vous sûr de vouloir quitter ce groupe ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Quitter',
          style: 'destructive',
          onPress: async () => {
            const success = await leaveGroup(parseInt(id, 10));
            if (success) router.replace('/(app)/groups');
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Paramètres</Text>

        <BaseCard title="Le groupe" style={styles.card}>
          <Text style={styles.groupName}>{currentGroup?.nom}</Text>

          <BaseButton
            title={copied ? 'Copié !' : "Copier le code d'invitation"}
            variant={copied ? 'secondary' : 'outline'}
            onPress={handleCopyInvite}
            fullWidth
            size="sm"
          />

          <Text style={styles.membersTitle}>Membres</Text>
          <View style={styles.membersGrid}>
            {(currentGroup?.users as { id: number; pseudo: string; avatar?: string | null }[] | undefined)?.map((member) => (
              <View key={member.id} style={styles.memberItem}>
                <AvatarDisplay
                  avatar={member.avatar}
                  name={member.pseudo}
                  size={40}
                />
                <Text style={styles.memberName} numberOfLines={1}>
                  {member.pseudo}
                </Text>
              </View>
            ))}
          </View>
        </BaseCard>

        <BaseCard title="Compte" style={styles.card}>
          <View style={styles.accountActions}>
            <BaseButton
              title="Quitter le groupe"
              variant="danger"
              onPress={handleLeaveGroup}
              fullWidth
              size="sm"
            />

            <BaseButton
              title="Déconnexion"
              variant="ghost"
              onPress={logout}
              fullWidth
              size="sm"
            />
          </View>
        </BaseCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  card: { marginBottom: spacing.lg },
  groupName: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  membersTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  membersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  memberItem: {
    alignItems: 'center',
    width: 60,
  },
  memberName: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  accountActions: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
});

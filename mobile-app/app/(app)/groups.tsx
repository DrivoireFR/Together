import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/stores/authStore';
import { useGroupStore } from '../../src/stores/groupStore';
import { BaseInput } from '../../src/components/atoms/BaseInput';
import { BaseButton } from '../../src/components/atoms/BaseButton';
import { BaseModal } from '../../src/components/atoms/BaseModal';
import { GroupCard } from '../../src/components/molecules/GroupCard';
import { LoadingSpinner } from '../../src/components/atoms/LoadingSpinner';
import { colors, spacing, fontSize, borderRadius } from '../../src/theme';

export default function GroupsScreen() {
  const { user, logout } = useAuthStore();
  const {
    groups,
    searchResults,
    isLoading,
    isSearching,
    getUserGroups,
    searchGroupsByName,
    clearSearchResults,
    createGroup,
    joinGroup,
    navigateToGroup,
    showGroupCreatedModal,
    closeModals,
    skipGroupSetup,
    startStarterPackSetup,
    createdGroupData,
  } = useGroupStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [joinGroupId, setJoinGroupId] = useState<number | null>(null);

  useEffect(() => {
    if (user?.id) getUserGroups(user.id);
  }, [user?.id]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim()) {
      searchGroupsByName(text);
    } else {
      clearSearchResults();
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    const success = await createGroup({ nom: newGroupName.trim() });
    if (success) {
      setShowCreateModal(false);
      setNewGroupName('');
      if (user?.id) getUserGroups(user.id);
    }
  };

  const handleJoinGroup = async () => {
    if (!joinCode.trim() || !joinGroupId) return;
    const success = await joinGroup({ groupId: joinGroupId, code: joinCode.trim() });
    if (success) {
      setShowJoinModal(false);
      setJoinCode('');
      setJoinGroupId(null);
      if (user?.id) getUserGroups(user.id);
      navigateToGroup(joinGroupId);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Together</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => user?.id && getUserGroups(user.id)}
          />
        }
      >
        <BaseButton
          title="+ Créer un groupe"
          onPress={() => setShowCreateModal(true)}
          fullWidth
          size="lg"
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rechercher un groupe</Text>
          <BaseInput
            placeholder="Nom du groupe..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchResults.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              currentUser={user}
              onPress={() => {
                const isMember = group.users?.some((u) => u.id === user?.id);
                if (isMember) {
                  navigateToGroup(group.id);
                } else {
                  setJoinGroupId(group.id);
                  setShowJoinModal(true);
                }
              }}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mes groupes</Text>
          {groups.length === 0 && !isLoading ? (
            <Text style={styles.emptyText}>
              Vous ne faites partie d'aucun groupe. Créez-en un ou rejoignez un
              groupe existant !
            </Text>
          ) : (
            groups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                currentUser={user}
                onPress={() => navigateToGroup(group.id)}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Create Group Modal */}
      <BaseModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Créer un groupe"
      >
        <BaseInput
          label="Nom du groupe"
          value={newGroupName}
          onChangeText={setNewGroupName}
          placeholder="Mon groupe"
        />
        <BaseButton
          title="Créer"
          onPress={handleCreateGroup}
          loading={isLoading}
          fullWidth
        />
      </BaseModal>

      {/* Join Group Modal */}
      <BaseModal
        visible={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        title="Rejoindre le groupe"
      >
        <BaseInput
          label="Code d'invitation"
          value={joinCode}
          onChangeText={setJoinCode}
          placeholder="ABCD1234"
          autoCapitalize="characters"
        />
        <BaseButton
          title="Rejoindre"
          onPress={handleJoinGroup}
          loading={isLoading}
          fullWidth
        />
      </BaseModal>

      {/* Group Created Modal */}
      <BaseModal
        visible={showGroupCreatedModal}
        onClose={() => closeModals()}
        title="Groupe créé !"
      >
        {createdGroupData && (
          <View>
            <Text style={styles.createdGroupName}>
              {createdGroupData.group.nom}
            </Text>
            <Text style={styles.createdGroupCode}>
              Code : {createdGroupData.group.code}
            </Text>
            <View style={styles.modalActions}>
              <BaseButton
                title="Configurer avec le starter pack"
                onPress={startStarterPackSetup}
                fullWidth
              />
              <BaseButton
                title="Passer"
                variant="ghost"
                onPress={skipGroupSetup}
                fullWidth
              />
            </View>
          </View>
        )}
      </BaseModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.primary,
  },
  logoutText: {
    fontSize: fontSize.sm,
    color: colors.error,
    fontWeight: '500',
  },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  section: { marginTop: spacing.xxl },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: spacing.xl,
  },
  createdGroupName: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  createdGroupCode: {
    fontSize: fontSize.lg,
    color: colors.primary,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: spacing.xl,
  },
  modalActions: { gap: spacing.md },
});

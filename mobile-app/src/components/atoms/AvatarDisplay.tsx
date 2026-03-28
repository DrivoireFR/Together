import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, fontSize } from '../../theme';
import type { Avatar } from '../../types';

interface AvatarDisplayProps {
  avatar?: Avatar;
  name?: string;
  size?: number;
}

const AVATAR_COLORS: Record<string, string> = {
  Man1: '#4F46E5',
  Man2: '#2563EB',
  Man3: '#7C3AED',
  Man4: '#0891B2',
  Man5: '#059669',
  Man6: '#D97706',
  Woman1: '#EC4899',
  Woman2: '#F43F5E',
  Woman3: '#A855F7',
  Woman4: '#14B8A6',
  Woman5: '#F97316',
  Woman6: '#8B5CF6',
};

export function AvatarDisplay({ avatar, name, size = 40 }: AvatarDisplayProps) {
  const bgColor = avatar ? AVATAR_COLORS[avatar] || colors.primary : colors.primary;
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bgColor,
        },
      ]}
    >
      <Text style={[styles.initials, { fontSize: size * 0.4 }]}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.white,
    fontWeight: '700',
  },
});

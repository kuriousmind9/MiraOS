import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function ThemeToggle({ theme, onToggle }) {
  return (
    <TouchableOpacity accessibilityLabel={`Switch to ${theme.mode === 'dark' ? 'light' : 'dark'} mode`} onPress={onToggle} style={{ width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.panelAlt, borderWidth: 1, borderColor: theme.border }}>
      <Ionicons name={theme.mode === 'dark' ? 'sunny-outline' : 'moon-outline'} size={20} color={theme.text} />
    </TouchableOpacity>
  );
}

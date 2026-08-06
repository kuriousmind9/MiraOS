import { useEffect, useState } from 'react';
import { Appearance, Platform } from 'react-native';
import { themes } from './themes';

const KEY = 'mira-theme-mode';

export function useThemeMode() {
  const [mode, setMode] = useState(() => {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') return localStorage.getItem(KEY) || Appearance.getColorScheme() || 'dark';
    return Appearance.getColorScheme() || 'dark';
  });
  useEffect(() => { if (Platform.OS === 'web' && typeof localStorage !== 'undefined') localStorage.setItem(KEY, mode); }, [mode]);
  return { theme: themes[mode] || themes.dark, mode, toggleTheme: () => setMode((value) => value === 'dark' ? 'light' : 'dark') };
}

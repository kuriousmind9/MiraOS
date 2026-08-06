import React from 'react';
import { View } from 'react-native';

export function Surface({ theme, style, children }) {
  return <View style={[{ backgroundColor: theme.panel, borderColor: theme.border, borderWidth: 1, borderRadius: theme.radius.medium }, style]}>{children}</View>;
}

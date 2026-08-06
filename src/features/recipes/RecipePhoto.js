import React from 'react';
import { Image, View } from 'react-native';
import { MEAL_ATLAS } from '../../../assets/mealAtlas';

export default function RecipePhoto({ index = 0, size = 120, radius = 18, style }) {
  const x = index % 2;
  const y = Math.floor(index / 2);
  return (
    <View style={[{ width: size, height: size, borderRadius: radius, overflow: 'hidden', backgroundColor: '#142430' }, style]}>
      <Image source={{ uri: MEAL_ATLAS }} style={{ position: 'absolute', width: size * 2, height: size * 2, left: -x * size, top: -y * size }} />
    </View>
  );
}

import React, { ReactElement } from 'react';
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import theme from '../../configs/theme';
import type { Type as Icon } from './Icon';

const filledColor = theme.colors.$onPrimary;
const unfilledColor = theme.colors.$primary;
const size = theme.space.$6;

type Props = {
  icon: Icon;
  onPress?: () => void;
  filled: boolean;
};

export default function getIcon({
  icon,
  onPress,
  filled = false,
}: Props): ReactElement {
  const color = filled ? filledColor : unfilledColor;

  if (icon.pack === 'AntDesign') {
    return (
      <AntDesign
        name={icon.name as any}
        size={size}
        onPress={onPress}
        color={color}
      />
    );
  }
  if (icon.pack === 'Feather') {
    return (
      <Feather
        name={icon.name as any}
        size={size}
        onPress={onPress}
        color={color}
      />
    );
  }
  if (icon.pack === 'Ionicons') {
    return (
      <Ionicons
        name={icon.name as any}
        size={size}
        onPress={onPress}
        color={color}
      />
    );
  }
  if (icon.pack === 'MaterialIcons') {
    return (
      <MaterialIcons
        name={icon.name as any}
        size={size}
        onPress={onPress}
        color={color}
      />
    );
  }

  // No matching case
  return <React.Fragment />;
}

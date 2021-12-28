import React, { ReactElement } from 'react';
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import theme from '../../configs/theme';
import type { Type as Icon } from './Icon';

const size = theme.space.$6;

type Props = {
  icon: Icon;
  onPress?: () => void;
  color: string;
};

export default function getIcon({ icon, color, onPress }: Props): ReactElement {
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

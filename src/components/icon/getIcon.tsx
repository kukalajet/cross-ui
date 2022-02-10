import React, { ReactElement } from 'react';
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import { theme } from '../../configs';
import type { Type as Icon } from './Icon';

const defaultSize = theme.space.$6;

type Props = {
  icon: Icon;
  size?: number;
  color?: string;
  onPress?: () => void;
};

export default function getIcon({
  icon,
  size,
  color,
  onPress,
}: Props): ReactElement {
  if (icon.pack === 'AntDesign') {
    return (
      <AntDesign
        name={icon.name as any}
        size={size || defaultSize}
        onPress={onPress}
        color={color}
      />
    );
  }
  if (icon.pack === 'Feather') {
    return (
      <Feather
        name={icon.name as any}
        size={size || defaultSize}
        onPress={onPress}
        color={color}
      />
    );
  }
  if (icon.pack === 'Ionicons') {
    return (
      <Ionicons
        name={icon.name as any}
        size={size || defaultSize}
        onPress={onPress}
        color={color}
      />
    );
  }
  if (icon.pack === 'MaterialIcons') {
    return (
      <MaterialIcons
        name={icon.name as any}
        size={size || defaultSize}
        onPress={onPress}
        color={color}
      />
    );
  }

  // No matching case
  return <React.Fragment />;
}

import React from 'react';
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import theme from '../../configs/theme';

const filledColor = theme.colors.$onPrimary;
const unfilledColor = theme.colors.$primary;
const size = theme.space.$6;

const getIcon = (
  icon: IconType,
  onPress?: () => void,
  filled: boolean = false
) => {
  const color = filled ? filledColor : unfilledColor;

  if (icon.package === 'AntDesign') {
    return (
      <AntDesign
        name={icon.name as any}
        size={size}
        onPress={onPress}
        color={color}
      />
    );
  }
  if (icon.package === 'Feather') {
    return (
      <Feather
        name={icon.name as any}
        size={size}
        onPress={onPress}
        color={color}
      />
    );
  }
  if (icon.package === 'Ionicons') {
    return (
      <Ionicons
        name={icon.name as any}
        size={size}
        onPress={onPress}
        color={color}
      />
    );
  }
  if (icon.package === 'MaterialIcons') {
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
};

export default getIcon;

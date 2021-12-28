import React from 'react';
import { styled, View } from 'dripsy';

import getIcon from './getIcon';
import type { Type as Button } from '../button';

type IconPack = 'Feather' | 'AntDesign' | 'Ionicons' | 'MaterialIcons';
export type Type = {
  pack: IconPack;
  name: string;
};

type Props = {
  icon: Type;
  type: Button;
  onPress?: () => void;
};

const Icon = ({ icon, type, onPress }: Props) => {
  const child = getIcon({
    icon,
    onPress,
    filled: type === 'filled' || type === 'tonal',
  });

  return <Container>{!!child && child}</Container>;
};

const Container = styled(View)(() => ({
  margin: '$4',
}));

export default Icon;

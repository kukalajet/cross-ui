import React from 'react';
import { styled, View } from 'dripsy';
import getIcon from './getIcon';

type Props = {
  icon: IconType;
  type: ButtonType;
  onPress?: () => void;
};

const Icon = ({ icon, type, onPress }: Props) => {
  const child = getIcon(icon, onPress, type === 'filled' || type === 'tonal');

  return <Container>{!!child && child}</Container>;
};

const Container = styled(View)(() => ({
  margin: '$4',
}));

export default Icon;

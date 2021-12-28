import React from 'react';
import { styled, View } from 'dripsy';
import getIcon from './getIcon';

type Orientation = 'start' | 'end' | 'center';
type IconPack = 'Feather' | 'AntDesign' | 'Ionicons' | 'MaterialIcons';
export type Position = 'start' | 'end';
export type Type = {
  pack: IconPack;
  name: string;
};

type Props = {
  icon: Type;
  color: string;
  orientation?: Orientation;
  onPress?: () => void;
};

const Icon = ({ icon, color, orientation = 'center', onPress }: Props) => {
  const child = getIcon({ icon, color, onPress });

  return <Container orientation={orientation}>{!!child && child}</Container>;
};

type ContainerProps = { orientation: Orientation };
const Container = styled(View)(({ orientation }: ContainerProps) => ({
  marginY: '$2',
  marginBottom: orientation === 'center' ? '$4' : '$0',
  marginTop: orientation === 'center' ? '$4' : '$0',
  marginRight: getMarginRight(orientation),
  marginLeft: getMarginLeft(orientation),
}));

function getMarginRight(orientation: Orientation): string {
  if (orientation === 'end' || orientation === 'center') return '$4';
  return '$0';
}

function getMarginLeft(orientation: Orientation): string {
  if (orientation === 'start' || orientation === 'center') return '$4';
  return '$0';
}

export default Icon;

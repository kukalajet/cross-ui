import React from 'react';
import { StyleSheet } from 'react-native';
import { styled, useSx, View } from 'dripsy';
import type { SxProp } from 'dripsy';
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
  size?: number;
  orientation?: Orientation;
  minimumMargins?: boolean;
  containerSx?: SxProp;
  onPress?: () => void;
};

// TODO: Generalize margins for other applications. @Jeton
const Icon = ({
  icon,
  color,
  size,
  orientation = 'center',
  minimumMargins,
  containerSx,
  onPress,
}: Props) => {
  const child = getIcon({ icon, size, color, onPress });

  return (
    <Container
      orientation={orientation}
      hasMinimumMargin={!!minimumMargins}
      containerSx={containerSx}
    >
      {!!child && child}
    </Container>
  );
};

type ContainerProps = {
  orientation: Orientation;
  hasMinimumMargin?: boolean;
  containerSx?: SxProp;
};
const Container = styled(View)(
  ({ orientation, hasMinimumMargin, containerSx }: ContainerProps) => {
    const sx = useSx();

    return StyleSheet.flatten([
      {
        justifyContent: 'center',
        marginVertical: getMarginVertical(orientation, hasMinimumMargin),
        marginRight: getMarginRight(orientation),
        marginLeft: getMarginLeft(orientation),
      },
      !!containerSx && sx(containerSx),
    ]);
  }
);

function getMarginVertical(
  orientation: Orientation,
  hasMinimumMargin?: boolean
): string | string[] {
  if (hasMinimumMargin) return '$0';
  if (orientation === 'center') return ['$4', '$5', '$5'];
  return '$2';
}

function getMarginRight(
  orientation: Orientation,
  hasMinimumMargin?: boolean
): string | string[] {
  if (hasMinimumMargin) return '$0';
  if (orientation === 'end' || orientation === 'center') {
    return ['$4', '$5', '$5'];
  }

  return '$0';
}

function getMarginLeft(
  orientation: Orientation,
  hasMinimumMargin?: boolean
): string | string[] {
  if (hasMinimumMargin) return '$0';
  if (orientation === 'start' || orientation === 'center') {
    return ['$4', '$5', '$5'];
  }

  return '$0';
}

export default Icon;

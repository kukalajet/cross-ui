import React, { useCallback, useState } from 'react';
import { Pressable as DripsyPressable, styled, Text } from 'dripsy';
import { colord } from 'colord';
import theme from '../../configs/theme';
import Icon from '../icon';

const borderWidth = 1.25;
const borderRadius = theme.space?.$6;
const elevation = theme.space.$1;
const shadowRadius = theme.space.$1;
const shadowColor = theme.colors.$onSecondary;
const shadowOpacity = 0.125;
const filledColor = colord(theme.colors.$primary).toHex();
const unfilledColor = colord(theme.colors.$surface).toHex();
const hoveredFilledColor = colord(theme.colors.$primary).alpha(0.75).toHex();
const hoveredUnfilledColor = colord(theme.colors.$primary).alpha(0.1).toHex();
const pressedFilledColor = colord(theme.colors.$primaryVariant).toHex();
const pressedUnfilledColor = colord(theme.colors.$primaryVariant)
  .alpha(0.25)
  .toHex();

type Props = {
  type?: ButtonType;
  label?: string;
  icon?: IconType;
  width?: string | number;
  height?: string | number;
  onPress: () => void;
};
const Button = ({
  type = 'filled',
  label,
  icon,
  width,
  height,
  onPress,
}: Props) => {
  const [pressed, setPressed] = useState<boolean>(false);
  const [hovered, setHovered] = useState<boolean>(false);

  const handleOnPress = useCallback(() => {
    onPress();
  }, [onPress]);

  const handleOnPressIn = useCallback(() => {
    setPressed(true);
  }, []);

  const handleOnPressOut = useCallback(() => {
    setPressed(false);
  }, []);

  return (
    <Pressable
      type={type}
      width={width}
      height={height}
      pressed={pressed}
      hovered={hovered}
      onPress={handleOnPress}
      onPressIn={handleOnPressIn}
      onPressOut={handleOnPressOut}
      // @ts-expect-error: Wrong Pressable typing.
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {!!label && <Label type={type}>{label}</Label>}
      {!!icon && <Icon type={type} icon={icon} />}
    </Pressable>
  );
};

type PressableProps = {
  type: ButtonType;
  width?: string | number;
  height?: string | number;
  hovered: boolean;
  pressed: boolean;
};
const Pressable = styled(DripsyPressable)(
  ({ type, width, height, hovered, pressed }: PressableProps) => ({
    width,
    height,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: getBackgroundColor(type, hovered, pressed),
    borderWidth: type === 'outlined' ? borderWidth : 0,
    borderColor: type === 'outlined' ? '$primary' : null,
    borderRadius: borderRadius,
    alignSelf: 'baseline',
    shadowColor: shadowColor,
    shadowOffset: { width: theme.space.$0, height: theme.space.$1 },
    shadowOpacity: shadowOpacity,
    shadowRadius: shadowRadius,
    elevation: elevation,
  })
);

type LabelProps = {
  type: ButtonType;
};
const Label = styled(Text)(({ type }: LabelProps) => ({
  color: getColor(type),
  marginY: '$3',
  marginX: ['$3', '$4', '$4'],
  fontSize: ['$2', '$3', '$3'],
}));

const getBackgroundColor = (
  type: ButtonType,
  hovered: boolean,
  pressed: boolean
): string => {
  if (type === 'filled') {
    if (pressed) return pressedFilledColor;
    if (hovered) return hoveredFilledColor;
    return filledColor;
  }

  if (pressed) return pressedUnfilledColor;
  if (hovered) return hoveredUnfilledColor;
  return unfilledColor;
};

const getColor = (type: ButtonType) => {
  if (type === 'filled') return filledColor;
  return unfilledColor;
};

export default Button;

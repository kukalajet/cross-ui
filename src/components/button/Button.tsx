import React, { ReactElement, useCallback, useState } from 'react';
import { H3, Pressable as DripsyPressable, styled } from 'dripsy';
import { colord } from 'colord';
import Icon from '../icon';
import type { Type as IconType, Position as IconPosition } from '../icon';
import { theme } from '../../configs';

export type Type = 'elevated' | 'filled' | 'tonal' | 'outlined' | 'text';

type Props = {
  type?: Type;
  label?: string;
  icon?: IconType;
  iconPosition?: IconPosition;
  width?: string | number;
  height?: string | number;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
};

const Button = ({
  type = 'filled',
  label,
  icon,
  iconPosition = 'start',
  width,
  height,
  onPress,
  textColor,
  backgroundColor,
}: Props): ReactElement<Props> => {
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
      backgroundColor={backgroundColor}
      onPress={handleOnPress}
      onPressIn={handleOnPressIn}
      onPressOut={handleOnPressOut}
      // @ts-expect-error: Wrong Pressable typing.
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {!!icon && iconPosition === 'start' && (
        <Icon
          icon={icon}
          color={textColor || getTextColor(type)}
          orientation={!!label ? 'start' : 'center'}
          containerSx={{
            marginRight: !!label ? ['$1', '$2', '$2'] : ['$4', '$5', '$5'],
          }}
        />
      )}
      {!!label && (
        /* @ts-ignore: probably a bug in H5 types */
        <Label
          type={type}
          textColor={textColor}
          iconPosition={iconPosition}
          hasIcon={!!icon}
        >
          {label}
        </Label>
      )}
      {!!icon && iconPosition === 'end' && (
        <Icon
          icon={icon}
          color={textColor || getTextColor(type)}
          orientation={!!label ? 'end' : 'center'}
          containerSx={{ marginLeft: ['$4', '$5', '$5'] }}
        />
      )}
    </Pressable>
  );
};

type PressableProps = {
  type: Type;
  width?: string | number;
  height?: string | number;
  hovered: boolean;
  pressed: boolean;
  backgroundColor?: string;
};
const Pressable = styled(DripsyPressable)(
  ({
    type,
    width,
    height,
    hovered,
    pressed,
    backgroundColor,
  }: PressableProps) => ({
    width,
    height,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: getBackgroundColor(
      type,
      hovered,
      pressed,
      backgroundColor
    ),
    borderWidth: type === 'outlined' ? 1.25 : 0,
    borderColor: type === 'outlined' ? '$primary' : null,
    borderRadius: theme.space.$7,
    alignSelf: 'baseline',
    ...getShadow(type),
  })
);

type LabelProps = {
  type: Type;
  textColor?: string;
  iconPosition: IconPosition;
  hasIcon: boolean;
};
const Label = styled(H3)(
  ({ type, textColor, iconPosition, hasIcon }: LabelProps) => ({
    color: textColor || getTextColor(type),
    marginY: '$3',
    marginRight:
      iconPosition === 'end' && hasIcon
        ? ['$2', '$1', '$1']
        : ['$4', '$5', '$5'],
    marginLeft:
      iconPosition === 'start' && hasIcon
        ? ['$2', '$1', '$1']
        : ['$4', '$5', '$5'],
    fontSize: '$4',
  })
);

/**
 *
 * @param type Type of the button.
 * @param hovered True when hovering the button otherwise false.
 * @param pressed True when pressing the button otherwise false.
 * @param defaultColor Default color for the button.
 * @returns The color of the background in hex value.
 */
function getBackgroundColor(
  type: Type,
  hovered: boolean,
  pressed: boolean,
  defaultColor?: string
): string | undefined {
  if (type === 'text' || type === 'outlined') {
    const color = colord(theme.colors.$surface);
    if (pressed) return color?.darken(0.25).toHex();
    if (hovered) return color?.darken(0.1).toHex();
    return color?.toHex();
  }

  let color;
  if (defaultColor) color = colord(defaultColor);
  else if (type === 'elevated') color = colord(theme.colors.$secondary);
  else if (type === 'filled') color = colord(theme.colors.$primary);
  else if (type === 'tonal') color = colord(theme.colors.$primary).alpha(0.5);

  if (pressed) return color?.darken(0.2).toHex();
  if (hovered) return color?.alpha(0.8).toHex();
  return color?.toHex();
}

type Offset = { width: number; height: number };
type Shadow = {
  shadowColor?: string;
  shadowOffset?: Offset;
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number;
};
/**
 * @param type Type of the button
 * @returns A data structure representing the shadow.
 */
function getShadow(type: Type): Shadow | undefined {
  if (type !== 'elevated') return undefined;

  const shadowOpacity = 0.5;
  const shadowColor = theme.colors.$onSurface;
  const shadowRadius = theme.space.$1;
  const elevation = theme.space.$2;
  const shadowOffset: Offset = {
    width: theme.space.$0,
    height: theme.space.$1,
  };

  return {
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
    elevation,
  };
}

/**
 *
 * @param type Type of the button
 * @returns The text color.
 */
function getTextColor(type: Type): string {
  if (type === 'elevated') return theme.colors.$primary;
  if (type === 'filled') return theme.colors.$onPrimary;
  if (type === 'outlined') return theme.colors.$primary;
  if (type === 'text') return theme.colors.$primary;
  if (type === 'tonal')
    return colord(theme.colors.$primary).darken(0.25).toHex();

  return theme.colors.$primary;
}

export default Button;

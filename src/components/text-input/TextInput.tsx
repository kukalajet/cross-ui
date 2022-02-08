import React, { useCallback, useEffect, useState } from 'react';
import { TextInput as RNTextInput } from 'react-native';
import { H4, H5, Pressable, styled, View } from 'dripsy';
import { Platform } from 'react-native';
import { colord } from 'colord';
import theme from '../../configs';
import Icon from '../icon';
import type { Type as IconType } from '../icon';
import type {
  View as ReactNativeView,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
  TextInputFocusEventData,
} from 'react-native';

type State = 'default' | 'error' | 'disabled';

type TextInputProps = {
  /** An interface for changing `value` from parent. Overrindes current the `value`. */
  value?: string;
  label?: string;
  initialValue?: string;
  placeholder?: string;
  error?: string;
  height?: string | number;
  width?: string | number;
  disabled?: boolean;
  multiline?: boolean;
  pressable?: boolean;
  leadingIcon?: IconType;
  trailingIcon?: IconType;
  onChangeText?: (value: string) => void;
  onContainerPress?: () => void;
};

const TextInput = React.forwardRef<ReactNativeView, TextInputProps>(
  (
    {
      value: parentValue,
      label,
      initialValue,
      placeholder,
      error,
      height,
      width = '100%',
      disabled,
      multiline,
      pressable = true,
      leadingIcon,
      trailingIcon,
      onChangeText,
      onContainerPress,
    },
    ref
  ) => {
    const [state, setState] = useState<State>('default');
    const [focused, setFocused] = useState<boolean>(false);
    const [hovered, setHovered] = useState<boolean>(false);
    const [value, setValue] = useState<string | undefined>(initialValue);
    const [containerHeight, setContainerHeight] = useState<
      number | string | undefined
    >(height);

    useEffect(() => {
      if (disabled) {
        setState('disabled');
        return;
      }
      if (error) {
        setState('error');
        return;
      }
      setState('default');
    }, [disabled, error]);

    useEffect(() => {
      setValue(parentValue);
    }, [parentValue]);

    const handleOnChangeText = useCallback((value: string) => {
      setValue(value);
      if (onChangeText) {
        onChangeText(value);
      }
    }, []);

    const handleOnFocus = useCallback(
      (_: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setFocused(true);
        setHovered(true);
      },
      []
    );

    const handleOnBlur = useCallback(
      (_: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setFocused(false);
        setHovered(false);
      },
      []
    );

    const handleOnContainerSizeChange = (
      event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
    ) => {
      if (multiline && Platform.OS === 'web') {
        setContainerHeight(event.nativeEvent.contentSize.height);
      }
    };

    return (
      <Container
        ref={ref}
        width={width}
        onPress={onContainerPress}
        // @ts-expect-error
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* @ts-ignore: probably a bug in H4 types */}
        {!!label && <Label disabled={disabled}>{label}</Label>}
        <InputContainer
          state={state}
          focused={focused}
          hovered={hovered}
          pointerEvents={pressable ? 'auto' : 'none'}
        >
          {!!leadingIcon && (
            <Icon
              icon={leadingIcon}
              color={getBorderColor(state, focused, hovered)}
              minimumMargins
              containerSx={{
                marginRight: '$1',
                marginLeft: '$2',
              }}
            />
          )}
          <Input
            value={value}
            placeholder={placeholder}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
            onChangeText={handleOnChangeText}
            onContentSizeChange={handleOnContainerSizeChange}
            multiline={multiline}
            editable={!disabled}
            scrollEnabled={false}
            hasLeadingIcon={!!leadingIcon}
            hasTrailingIcon={!!trailingIcon}
            containerHeight={containerHeight}
          />
          {!!trailingIcon && (
            <Icon
              icon={trailingIcon}
              color={getBorderColor(state, focused, hovered)}
              minimumMargins
              containerSx={{
                marginRight: '$2',
                marginLeft: '$1',
              }}
            />
          )}
        </InputContainer>
        {/* @ts-ignore: probably a bug in H5 types */}
        {!!error && <Error>{error}</Error>}
      </Container>
    );
  }
);

type ContainerProps = { width?: string | number };
const Container = styled(Pressable)(({ width }: ContainerProps) => ({
  width,
  justifyContent: 'center',
}));

type LabelProps = { disabled?: boolean };
const Label = styled(H4)(({ disabled }: LabelProps) => ({
  paddingBottom: '$1',
  color: disabled
    ? theme.colors.$disable
    : colord(theme.colors.$onSurface).alpha(0.9).toHex(),
}));

const Error = styled(H5)(() => ({
  fontSize: '$1',
  paddingTop: '$1',
  color: colord(theme.colors.$error).alpha(0.9).toHex(),
}));

type InputContainerProps = {
  state: State;
  focused: boolean;
  hovered: boolean;
};

const InputContainer = styled(View)(
  ({ state, focused, hovered }: InputContainerProps) => ({
    flexDirection: 'row',
    borderRadius: theme.space.$2,
    backgroundColor: theme.colors.$surface,
    borderWidth: focused
      ? [Platform.OS === 'web' ? 2 : 1.5, theme.space.$1, theme.space.$1]
      : 1,
    borderColor: getBorderColor(state, focused, hovered),
    shadowColor: theme.colors.$onSurface,
    shadowOffset: { width: theme.space.$0, height: theme.space.$1 },
    shadowOpacity: 0.2,
    shadowRadius: theme.space.$1,
    elevation: theme.space.$1,
  })
);

type InputProps = {
  containerHeight?: string | number;
  hasLeadingIcon?: boolean;
  hasTrailingIcon?: boolean;
};

const Input = styled(RNTextInput)(
  ({ containerHeight, hasLeadingIcon, hasTrailingIcon }: InputProps) => ({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: containerHeight,
    paddingTop: Platform.OS === 'android' ? theme.space.$3 : theme.space.$4,
    paddingBottom: Platform.OS === 'android' ? theme.space.$3 : theme.space.$4,
    paddingStart: hasLeadingIcon
      ? theme.space.$1
      : [theme.space.$3, theme.space.$3, theme.space.$4],
    paddingEnd: hasTrailingIcon
      ? theme.space.$1
      : [theme.space.$3, theme.space.$3, theme.space.$4],
    ...Platform.select({
      web: { outlineWidth: theme.space.$0 },
    }),
  })
);

const getBorderColor = (
  state?: State,
  focused?: boolean,
  hovered?: boolean
) => {
  const colors = theme.colors;

  if (state === 'error') {
    if (focused) return colors.$error;
    if (hovered) return colord(colors.$error).alpha(0.9).toHex();
    return colord(colors.$error).alpha(0.8).toHex();
  }

  if (state === 'disabled') return colord(colors.$surface).darken(0.3).toHex();
  if (focused) return colord(colors.$primary).toHex();
  if (hovered) return colord(colors.$primary).alpha(0.5).toHex();

  return colord(colors.$onSurface).alpha(0.6).toHex();
};

export default TextInput;

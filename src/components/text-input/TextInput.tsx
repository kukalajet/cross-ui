import React, { useCallback, useEffect, useState } from 'react';
import { TextInput as RNTextInput } from 'react-native';
import { Pressable, styled, Text, View } from 'dripsy';
import {
  NativeSyntheticEvent,
  Platform,
  TextInputContentSizeChangeEventData,
  TextInputFocusEventData,
} from 'react-native';
import { colord } from 'colord';
import theme from '../../configs';

type State = 'default' | 'error' | 'disabled';

type TextInputProps = {
  label?: string;
  initialValue?: string;
  placeholder?: string;
  error?: string;
  height?: string | number;
  width?: string | number;
  disabled?: boolean;
  multiline?: boolean;
  pressable?: boolean;
  leadingIcon?: React.ReactElement;
  trailingIcon?: React.ReactElement;
  onChangeText?: (value: string) => void;
};

const TextInput = ({
  label,
  initialValue,
  placeholder,
  error,
  height,
  width = '100%',
  disabled,
  multiline,
  pressable,
  leadingIcon,
  trailingIcon,
  onChangeText,
}: TextInputProps) => {
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
      width={width}
      // @ts-expect-error
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {!!label && <Label disabled={disabled}>{label}</Label>}
      <InputContainer
        state={state}
        focused={focused}
        hovered={hovered}
        pointerEvents={pressable ? 'auto' : 'none'}
      >
        {!!leadingIcon && <Icon>{leadingIcon}</Icon>}
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
        {!!trailingIcon && <Icon>{leadingIcon}</Icon>}
      </InputContainer>
      {!!error && <Error>{error}</Error>}
    </Container>
  );
};

type ContainerProps = { width?: string | number };
const Container = styled(Pressable)(({ width }: ContainerProps) => ({
  width,
  justifyContent: 'center',
}));

// H4
type LabelProps = { disabled?: boolean };
const Label = styled(Text)(({ disabled }: LabelProps) => ({
  paddingBottom: '$2',
  color: disabled ? theme.colors.$disable : undefined,
}));

// H5
const Error = styled(Text)(() => ({
  fontSize: '$1',
  paddingTop: ['$1', '$2', '$2'],
  color: '$error',
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
    borderColor: getBorderColor(state, focused, hovered),
    borderWidth: [1, 1.5, 1.5],
    shadowColor: theme.colors.$onSurface,
    shadowOffset: { width: theme.space.$0, height: theme.space.$1 },
    shadowOpacity: 0.5,
    shadowRadius: theme.space.$1,
    elevation: theme.space.$1,
  })
);

const Icon = styled(View)(() => ({ padding: '$3' }));

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
    paddingTop: theme.space.$4,
    paddingBottom: theme.space.$4,
    paddingStart: !!hasLeadingIcon
      ? [theme.space.$3, theme.space.$3, theme.space.$4]
      : [theme.space.$2, theme.space.$3, theme.space.$4],
    paddingEnd: hasTrailingIcon
      ? [theme.space.$3, theme.space.$3, theme.space.$4]
      : [theme.space.$2, theme.space.$2, theme.space.$3],
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

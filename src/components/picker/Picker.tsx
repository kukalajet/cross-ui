import React, { useCallback, useMemo, useState } from 'react';
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  LayoutRectangle,
  StyleSheet,
} from 'react-native';
import { Pressable, styled, SxProp, Text, useSx, View } from 'dripsy';
import { Portal } from '@gorhom/portal';
import { colord } from 'colord';
import theme from '../../configs';

type Layout = { width: number; height: number };
type Props = {
  onPress: (event: GestureResponderEvent) => void;
  targetLayout: LayoutRectangle;
};

const Select = ({ onPress, targetLayout }: Props) => {
  const [layout, setLayout] = useState<Layout>({
    width: 0,
    height: 0,
  });

  const popoverPosition = useMemo(
    () => ({
      opacity: layout.height === 0 || layout.width === 0 ? 0 : 1,
      top: targetLayout.y + targetLayout.height,
      left: targetLayout.x + targetLayout.width / 2 - layout.width / 2,
    }),
    [layout, targetLayout]
  );

  const handleLayoutChange = useCallback(
    ({
      nativeEvent: {
        layout: { height, width },
      },
    }: LayoutChangeEvent) => {
      setLayout((state) => {
        if (state.height === height && state.width === width) return state;
        return { width, height };
      });
    },
    []
  );

  return (
    <Portal name="select">
      {/* @ts-expect-error: Wrong Pressable typing */}
      <Container onPress={onPress}>
        <Popover onLayout={handleLayoutChange} containerSx={popoverPosition}>
          <Text>Simple Popover</Text>
        </Popover>
      </Container>
    </Portal>
  );
};

const Container = styled(Pressable)(() => ({
  ...StyleSheet.absoluteFillObject,
}));

type PopoverProps = { containerSx?: SxProp };
const Popover = styled(View)(({ containerSx }: PopoverProps) => {
  const sx = useSx();

  return StyleSheet.flatten([
    {
      position: 'absolute',
      alignSelf: 'center',
      paddingY: '$5',
      paddingX: '$5',
      backgroundColor: '$surface',

      // shadow
      shadowColor: '$onSurface',
      shadowOpacity: 0.5,
      shadowRadius: theme.space.$1,
      elevation: theme.space.$2,
      shadowOffset: {
        width: theme.space.$0,
        height: theme.space.$1,
      },
    },
    !!containerSx && sx(containerSx),
  ]);
});

export default Select;

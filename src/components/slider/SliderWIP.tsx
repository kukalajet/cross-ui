import React from 'react';
import { StyleSheet } from 'react-native';
import { styled, useSx, View } from 'dripsy';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { theme } from '../../configs';
import type { SxProp } from 'dripsy';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';

type Props = { width?: number | string; containerSx?: SxProp };
const Slider = ({ width = '100%', containerSx }: Props) => {
  const x = useSharedValue<number>(0);

  const translatedKnobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  const onKnobGestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { offsetX: number }
  >({
    onStart: (_, ctx) => {
      ctx.offsetX = x.value;
    },
    onActive: (event, ctx) => {
      x.value = event.translationX + ctx.offsetX;
    },
  });

  return (
    <Container width={width} containerSx={containerSx}>
      <PanGestureHandler onGestureEvent={onKnobGestureHandler}>
        <Knob style={translatedKnobStyle} />
      </PanGestureHandler>
    </Container>
  );
};

type ContainerProps = { width: number | string; containerSx?: SxProp };
const Container = styled(View)(({ width, containerSx }: ContainerProps) => {
  const sx = useSx();
  const flattened = StyleSheet.flatten([
    {
      width,
      justifyContent: 'center',
      backgroundColor: '$primary',
    },
    !!containerSx && sx(containerSx),
  ]);

  return flattened;
});

const Knob = styled(Animated.View)(() => ({
  height: 24,
  width: 24,
  borderRadius: 12,
  backgroundColor: theme.colors.$onPrimary,
}));

export default Slider;

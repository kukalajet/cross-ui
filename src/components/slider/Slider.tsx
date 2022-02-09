import React from 'react';
import { View, styled, useSx } from 'dripsy';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import type { SxProp } from 'dripsy';
import type { PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import theme from '../../configs/theme';

const KNOB_WIDTH = 72;

type SliderProps = { width?: number | string };
const Slider = ({ width = '100%' }: SliderProps) => {
  const translateX = useSharedValue<number>(0);
  const sliding = useSharedValue<boolean>(false);

  const scrollTranslationStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  const progressStyle = useAnimatedStyle(() => ({
    width: translateX.value + KNOB_WIDTH,
  }));

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { offsetX: number }
  >({
    onStart: (_, ctx) => {
      ctx.offsetX = translateX.value;
    },
    onActive: (event, ctx) => {
      sliding.value = true;
      translateX.value = event.translationX + ctx.offsetX;
    },
    onEnd: () => {
      sliding.value = false;
    },
  });

  return (
    <Container width={width}>
      <Progress containerSx={progressStyle} />
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Knob containerSx={scrollTranslationStyle} />
      </PanGestureHandler>
    </Container>
  );
};

type ContainerProps = { width: number | string };
const Container = styled(View)(({ width }: ContainerProps) => ({
  height: KNOB_WIDTH,
  width,
  justifyContent: 'center',
  borderRadius: KNOB_WIDTH / 2,
  backgroundColor: '$primary',
}));

type ProgressProps = { containerSx?: SxProp };
const Progress = styled(Animated.View)(({ containerSx }: ProgressProps) => {
  const sx = useSx();

  const flattened = StyleSheet.flatten([
    StyleSheet.absoluteFillObject,
    { backgroundColor: theme.colors.$secondary, borderRadius: KNOB_WIDTH / 2 },
    !!containerSx && sx(containerSx),
  ]);

  return flattened;
});

type KnobProps = { containerSx?: SxProp };
const Knob = styled(Animated.View)(({ containerSx }: KnobProps) => {
  const sx = useSx();

  const flattened = StyleSheet.flatten([
    {
      height: KNOB_WIDTH,
      width: KNOB_WIDTH,
      borderRadius: KNOB_WIDTH / 2,
      backgroundColor: theme.colors.$onSecondary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    !!containerSx && sx(containerSx),
  ]);

  return flattened;
});

export default Slider;

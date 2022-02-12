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

const KNOB_WIDTH = 32;

type SliderProps = {
  width?: number | string;
  containerSx?: SxProp;
};
const Slider = ({ width = '100%', containerSx }: SliderProps) => {
  const translateX = useSharedValue<number>(0);
  const sliding = useSharedValue<boolean>(false);
  const pressed = useSharedValue<boolean>(false);

  const scrollTranslationStyle = useAnimatedStyle(() => ({
    backgroundColor: pressed.value
      ? theme.colors.$primaryVariant
      : theme.colors.$secondaryVariant,
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
      pressed.value = true;
    },
    onActive: (event, ctx) => {
      if (event.translationX > ctx.offsetX) {
        sliding.value = true;
        translateX.value = event.translationX + ctx.offsetX;
      }
    },
    onEnd: () => {
      sliding.value = false;
      pressed.value = false;
    },
  });

  return (
    <Container width={width} containerSx={containerSx}>
      <Progress style={progressStyle} />
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Knob style={scrollTranslationStyle} />
      </PanGestureHandler>
    </Container>
  );
};

type ContainerProps = { width: number | string; containerSx?: SxProp };
const Container = styled(View)(({ width, containerSx }: ContainerProps) => {
  const sx = useSx();

  return StyleSheet.flatten([
    {
      width,
      height: KNOB_WIDTH,
      justifyContent: 'center',
      borderRadius: KNOB_WIDTH / 2,
      backgroundColor: '$primary',
    },
    !!containerSx && sx(containerSx),
  ]);
});

const Progress = styled(Animated.View)(() => {
  const flattened = StyleSheet.flatten([
    StyleSheet.absoluteFillObject,
    { backgroundColor: theme.colors.$secondary, borderRadius: KNOB_WIDTH / 2 },
  ]);

  return flattened;
});

const Knob = styled(Animated.View)(() => ({
  height: KNOB_WIDTH,
  width: KNOB_WIDTH,
  borderRadius: KNOB_WIDTH / 2,
  backgroundColor: theme.colors.$onSecondary,
  justifyContent: 'center',
  alignItems: 'center',
}));

export default Slider;

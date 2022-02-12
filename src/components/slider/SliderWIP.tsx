import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { styled, useSx, View } from 'dripsy';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { theme } from '../../configs';
import type { SxProp } from 'dripsy';
import type { LayoutChangeEvent } from 'react-native';

const KNOB_WIDTH = 24;

function withPointers(value: number, points: number[]): number {
  'worklet';

  const differencePoint = (point: number) => Math.abs(value - point);
  const deltas = points.map((point: number) => differencePoint(point));
  const minDelta = Math.min.apply(null, deltas);
  const point = points.reduce((accumulator: number, point: number) =>
    differencePoint(point) === minDelta ? point : accumulator
  );

  return point;
}

function generatePointers(
  minimum: number,
  maximum: number,
  length: number
): number[] {
  const points = [minimum];
  const interval = (maximum - minimum) / (length - 1);

  for (let i = 1; i < length - 1; i++) points.push(minimum + interval * i);
  points.push(maximum);

  return points;
}

type Props = { width?: number | string; containerSx?: SxProp };
const Slider = ({ width = '100%', containerSx }: Props) => {
  const x = useSharedValue<number>(-KNOB_WIDTH / 2);
  const [containerWidth, setContainerWidth] = useState<number | undefined>();

  const points: number[] = useMemo(() => {
    const points = generatePointers(
      -KNOB_WIDTH / 2,
      containerWidth! - KNOB_WIDTH / 2,
      10
    );

    return points;
  }, [containerWidth]);

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
    onEnd: (_, ctx) => {
      x.value = withTiming(withPointers(x.value, points));
      ctx.offsetX = x.value;
    },
  });

  const handleTrackOnLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  }, []);

  return (
    <Container width={width} containerSx={containerSx}>
      <Track onLayout={handleTrackOnLayout} />
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
      paddingHorizontal: KNOB_WIDTH / 2,
      justifyContent: 'center',
    },
    !!containerSx && sx(containerSx),
  ]);

  return flattened;
});

const Knob = styled(Animated.View)(() => ({
  height: KNOB_WIDTH,
  width: KNOB_WIDTH,
  borderRadius: KNOB_WIDTH / 2,
  backgroundColor: theme.colors.$secondary,
}));

const Track = styled(View)(() => ({
  position: 'absolute',
  left: KNOB_WIDTH / 2,
  right: KNOB_WIDTH / 2,
  height: KNOB_WIDTH / 5,
  backgroundColor: '$primary',
}));

export default Slider;

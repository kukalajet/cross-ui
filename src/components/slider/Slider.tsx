import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { styled, useSx, View, H4 } from 'dripsy';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
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

// API
// minimum: string;
// maximum: string;
// steps: number;

type Props = {
  label: string;
  minimum: number;
  maximum: number;
  steps: number;
  width?: number | string;
  containerSx?: SxProp;
};
const Slider = ({
  label,
  minimum = 0,
  maximum = 100,
  steps = 10,
  width = '100%',
  containerSx,
}: Props) => {
  const [trackWidth, setTrackWidth] = useState<number>(0);
  const x = useSharedValue<number>(-KNOB_WIDTH / 2);

  const points: number[] = useMemo(() => {
    const minimum = -KNOB_WIDTH / 2;
    const maximum = trackWidth - KNOB_WIDTH / 2;
    const points = generatePointers(minimum, maximum, steps + 1);
    return points;
  }, [steps, trackWidth]);

  // WIP
  // const test = useDerivedValue(() => {
  //   return x.value;
  // });

  const animatedKnobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  const animatedSelectionStyle = useAnimatedStyle(() => ({
    right: trackWidth - x.value,
  }));

  const onKnobGestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { offsetX: number }
  >({
    onStart: (_, ctx) => {
      ctx.offsetX = x.value;
    },
    onActive: (event, ctx) => {
      const value = event.translationX + ctx.offsetX;
      if (value < -KNOB_WIDTH + 2 || value > trackWidth + KNOB_WIDTH) {
        return;
      }
      x.value = value;
    },
    onEnd: (_, ctx) => {
      x.value = withTiming(withPointers(x.value, points));
      ctx.offsetX = x.value;
    },
  });

  const handleTrackOnLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setTrackWidth(width);
  }, []);

  return (
    <React.Fragment>
      <Label>{label}</Label>
      <SliderContainer width={width} containerSx={containerSx}>
        <Track onLayout={handleTrackOnLayout} />
        <Selection style={animatedSelectionStyle} />
        <PanGestureHandler onGestureEvent={onKnobGestureHandler}>
          <Knob style={animatedKnobStyle} />
        </PanGestureHandler>
      </SliderContainer>
    </React.Fragment>
  );
};

const Label = styled(H4)(() => ({
  px: KNOB_WIDTH / 2,
  py: '$2',
}));

type SliderContainerProps = { width: number | string; containerSx?: SxProp };
const SliderContainer = styled(View)(
  ({ width, containerSx }: SliderContainerProps) => {
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
  }
);

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
  borderRadius: theme.space.$2,
  backgroundColor: '$primary',
}));

const Selection = styled(Animated.View)(() => ({
  position: 'absolute',
  left: KNOB_WIDTH / 2,
  right: KNOB_WIDTH / 2,
  height: KNOB_WIDTH / 4,
  borderRadius: theme.space.$2,
  backgroundColor: '$secondaryVariant',
}));

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
  'worklet';

  const points = [minimum];
  const interval = (maximum - minimum) / (length - 1);

  for (let i = 1; i < length - 1; i++) points.push(minimum + interval * i);
  points.push(maximum);

  return points;
}

function getClosestValue(points: number[], current: number): number | null {
  'worklet';

  const indexes = points.map((item) => Math.abs(item - current));
  const minimum = Math.min.apply(Math, indexes);
  const closest = points[indexes.indexOf(minimum)];
  return closest;
}

export default Slider;

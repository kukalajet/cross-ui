import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { styled, useSx, View, H4, Text } from 'dripsy';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedReaction,
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
  const [currentValue, setCurrentValue] = useState<number | undefined>();
  const [trackWidth, setTrackWidth] = useState<number>(0);
  const x = useSharedValue<number>(-KNOB_WIDTH / 2);
  const secondaryX = useSharedValue<number>(trackWidth - KNOB_WIDTH / 2);

  const values: number[] = useMemo(() => {
    const interval = (maximum - minimum) / steps;
    const values = [];
    for (let i = 0; i <= steps; i++) {
      values.push(minimum + interval * i);
    }

    return values;
  }, [minimum, maximum, steps]);

  const points: number[] = useMemo(() => {
    const minimum = -KNOB_WIDTH / 2;
    const maximum = trackWidth - KNOB_WIDTH / 2;
    const points = generatePointers(minimum, maximum, steps + 1);
    return points;
  }, [steps, trackWidth]);

  const handleSliderValueChanged = useCallback((index: number) => {
    const value = values[index];
    setCurrentValue(value);
  }, []);

  useAnimatedReaction(
    () => x.value,
    (value) => setClosestValue(points, value, handleSliderValueChanged)
  );

  const animatedKnobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  const animatedSecondaryKnobStyle = useAnimatedStyle(() => ({
    // removing KNOB_WIDTH here removes the padding applied around the parent
    transform: [{ translateX: trackWidth - KNOB_WIDTH - secondaryX.value }],
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
      if (value < -KNOB_WIDTH + 2 || value > trackWidth + KNOB_WIDTH) return;
      x.value = value;
    },
    onEnd: (_, ctx) => {
      x.value = withTiming(withPointers(x.value, points));
      ctx.offsetX = x.value;
    },
  });

  const onSecondaryKnobGestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { offsetX: number }
  >({
    onStart: (_, ctx) => {
      ctx.offsetX = secondaryX.value;
    },
    onActive: (event, ctx) => {
      const value = ctx.offsetX - event.translationX;
      if (value < -KNOB_WIDTH || value > trackWidth + KNOB_WIDTH - 2) return;
      secondaryX.value = value;
    },
    onEnd: (_, ctx) => {
      secondaryX.value = withTiming(withPointers(secondaryX.value, points));
      ctx.offsetX = secondaryX.value;
    },
  });

  const handleTrackOnLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setTrackWidth(width);
  }, []);

  return (
    <React.Fragment>
      <Header>
        <Label>{label}</Label>
        <Value>{currentValue}</Value>
      </Header>
      <SliderContainer width={width} containerSx={containerSx}>
        <Track onLayout={handleTrackOnLayout} />
        <Selection style={animatedSelectionStyle} />
        <PanGestureHandler onGestureEvent={onKnobGestureHandler}>
          <Knob style={animatedKnobStyle} />
        </PanGestureHandler>
        <PanGestureHandler onGestureEvent={onSecondaryKnobGestureHandler}>
          <Knob style={animatedSecondaryKnobStyle} />
        </PanGestureHandler>
      </SliderContainer>
    </React.Fragment>
  );
};

const Header = styled(View)(() => ({
  px: KNOB_WIDTH / 2,
  py: '$2',
  flexDirection: 'row',
  justifyContent: 'space-between',
}));

const Label = styled(H4)(() => ({}));
const Value = styled(H4)(() => ({}));

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

function setClosestValue(
  points: number[],
  current: number,
  callback: (value: number) => void
) {
  'worklet';
  const indexes = points.map((item) => Math.abs(item - current));
  const minimum = Math.min.apply(Math, indexes);
  const index = indexes.indexOf(minimum);
  runOnJS(callback)(index);
}

export default Slider;

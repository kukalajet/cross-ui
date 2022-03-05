import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { styled, useSx, View, H4 } from 'dripsy';
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

type Selection = number | { leading: number; trailing: number };

type Props = {
  label: string;
  minimum: number;
  maximum: number;
  steps: number;
  width?: number | string;
  bounding?: boolean;
  onChangeSelection: (value: Selection) => void;
  containerSx?: SxProp;
};

const Slider = ({
  label,
  minimum = 0,
  maximum = 100,
  steps: _steps,
  width = '100%',
  bounding = false,
  onChangeSelection,
  containerSx,
}: Props) => {
  const [trackWidth, setTrackWidth] = useState<number>(0);
  const [leadingValue, setLeadingValue] = useState<number | undefined>();
  const [trailingValue, setTrailingValue] = useState<number | undefined>();
  const leadingPosition = useSharedValue<number>(0);
  const trailingPosition = useSharedValue<number>(trackWidth);

  const steps: number = useMemo(() => {
    if (_steps) return _steps;
    const steps = Math.round(maximum - minimum);
    return steps;
  }, [_steps, minimum, maximum]);

  const values: number[] = useMemo(() => {
    const interval = (maximum - minimum) / steps;
    const values = [];
    for (let i = 0; i <= steps; i++) {
      values.push(minimum + interval * i);
    }

    return values;
  }, [minimum, maximum, steps]);

  const interval = useMemo(() => {
    const minimum = 0;
    const maximum = trackWidth;
    const length = steps;
    const interval = (maximum - minimum) / length;
    return interval;
  }, [steps, trackWidth]);

  const points: number[] = useMemo(() => {
    const minimum = 0;
    const maximum = trackWidth;
    const points = generatePointers(minimum, maximum, steps + 1);
    return points;
  }, [steps, trackWidth]);

  useEffect(() => {
    if (!bounding) {
      if (!leadingValue) return;
      handleChangeSelection(leadingValue);
      return;
    }

    if (!leadingValue || !trailingValue) return;
    handleChangeSelection({ leading: leadingValue, trailing: trailingValue });
  }, [leadingValue, trailingValue]);

  const handleSliderValueChanged = useCallback(
    (index: number, set: (value: number) => void) => {
      const value = values[index];
      set(value);
    },
    []
  );

  const handlePrimarySliderValue = useCallback((value: number) => {
    handleSliderValueChanged(value, setLeadingValue);
  }, []);

  const handleSecondarySliderValue = useCallback((value: number) => {
    handleSliderValueChanged(value, (value) => {
      const actual = maximum - (value - minimum);
      setTrailingValue(actual);
    });
  }, []);

  const handleChangeSelection = useCallback(
    (value: Selection) => {
      onChangeSelection(value);
    },
    [onChangeSelection]
  );

  useAnimatedReaction(
    () => leadingPosition.value,
    (value) => setClosestValue(points, value, handlePrimarySliderValue)
  );

  useAnimatedReaction(
    () => trailingPosition.value,
    (value) => setClosestValue(points, value, handleSecondarySliderValue)
  );

  const animatedLeadingKnobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: leadingPosition.value }],
  }));

  const animatedTrailingKnobStyle = useAnimatedStyle(() => ({
    // removing KNOB_WIDTH here removes the padding applied around the parent
    transform: [{ translateX: trackWidth - trailingPosition.value }],
  }));

  const animatedSelectionStyle = useAnimatedStyle(() => {
    if (bounding) {
      const left =
        Platform.OS === 'web'
          ? leadingPosition.value + KNOB_WIDTH / 2
          : leadingPosition.value;
      const right =
        Platform.OS === 'web'
          ? trailingPosition.value + KNOB_WIDTH / 2
          : trailingPosition.value;

      return { right, left };
    }

    const right =
      Platform.OS === 'web'
        ? trackWidth - leadingPosition.value + KNOB_WIDTH / 2
        : trackWidth - leadingPosition.value;
    const left =
      Platform.OS === 'web'
        ? trackWidth - trailingPosition.value + KNOB_WIDTH / 2
        : trackWidth - trailingPosition.value;

    return { right, left };
  });

  const animatedLeadingValuePosition = useAnimatedStyle(() => {
    const left =
      Platform.OS === 'web'
        ? leadingPosition.value + KNOB_WIDTH / 2
        : leadingPosition.value + KNOB_WIDTH / 8;
    return { left };
  });

  const animatedTrailingValuePosition = useAnimatedStyle(() => {
    const right =
      Platform.OS === 'web'
        ? trailingPosition.value + KNOB_WIDTH / 2
        : trailingPosition.value + KNOB_WIDTH / 8;
    return { right };
  });

  const onLeadingKnobGestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { offsetX: number }
  >({
    onStart: (_, ctx) => {
      ctx.offsetX = leadingPosition.value;
    },
    onActive: (event, ctx) => {
      const value = event.translationX + ctx.offsetX;

      const trailingKnobBound =
        bounding &&
        value > trackWidth - trailingPosition.value - interval + KNOB_WIDTH / 2;
      const trackBound = value < -KNOB_WIDTH || value > trackWidth + KNOB_WIDTH;
      if (trailingKnobBound || trackBound) return;

      leadingPosition.value = value;
    },
    onEnd: (_, ctx) => {
      leadingPosition.value = withTiming(
        withPointers(leadingPosition.value, points)
      );
      ctx.offsetX = leadingPosition.value;
    },
  });

  const onTrailingKnobGestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { offsetX: number }
  >({
    onStart: (_, ctx) => {
      ctx.offsetX = trailingPosition.value;
    },
    onActive: (event, ctx) => {
      const value = ctx.offsetX - event.translationX;

      const leadingKnobBound =
        bounding &&
        value > trackWidth - leadingPosition.value - interval + KNOB_WIDTH / 2;
      const trackBound = value < -KNOB_WIDTH || value > trackWidth + KNOB_WIDTH;
      if (leadingKnobBound || trackBound) return;

      trailingPosition.value = value;
    },
    onEnd: (_, ctx) => {
      trailingPosition.value = withTiming(
        withPointers(trailingPosition.value, points)
      );
      ctx.offsetX = trailingPosition.value;
    },
  });

  const handleTrackOnLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    const trackWidth = Platform.OS === 'web' ? width - KNOB_WIDTH : width;
    setTrackWidth(trackWidth);
  }, []);

  return (
    <React.Fragment>
      <Label>{label}</Label>
      <SliderContainer width={width} containerSx={containerSx}>
        <Track onLayout={handleTrackOnLayout} />
        {bounding && <Selection style={animatedSelectionStyle} />}
        <PanGestureHandler onGestureEvent={onLeadingKnobGestureHandler}>
          <Knob style={animatedLeadingKnobStyle} />
        </PanGestureHandler>
        {bounding && (
          <PanGestureHandler onGestureEvent={onTrailingKnobGestureHandler}>
            <Knob style={animatedTrailingKnobStyle} />
          </PanGestureHandler>
        )}
      </SliderContainer>
      <ValueContainer width={width}>
        <Value style={animatedLeadingValuePosition}>{leadingValue}</Value>
        {bounding && (
          <Value style={animatedTrailingValuePosition}>{trailingValue}</Value>
        )}
      </ValueContainer>
    </React.Fragment>
  );
};

const Label = styled(H4)(() => ({
  px: KNOB_WIDTH / 2,
  py: '$4',
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
        zIndex: 1,
      },
      !!containerSx && sx(containerSx),
    ]);

    return flattened;
  }
);

type ValueContainerProps = { width: number | string };
const ValueContainer = styled(View)(({ width }: ValueContainerProps) => ({
  width,
  py: '$5',
  justifyContent: 'center',
}));

const Knob = styled(Animated.View)(() => ({
  position: 'absolute',
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

const Value = styled(Animated.Text)(() => ({
  top: '$4',
  position: 'absolute',
  textAlign: 'center',
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

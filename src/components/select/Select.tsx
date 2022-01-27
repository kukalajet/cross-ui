import React, {
  RefObject,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react';
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  LayoutRectangle,
  StyleSheet,
  View as NativeView,
} from 'react-native';
import { View, Pressable, styled, SxProp, useSx, Text } from 'dripsy';
import theme from '../../configs';
import { Portal } from '@gorhom/portal';
import type { ListRenderItem } from 'react-native';
import type { ReactElement } from 'react';

type Props<T, S> = {
  renderExhibitor: (
    ref: RefObject<S>,
    selected: T | T[],
    handleMountPress: () => void
  ) => ReactElement;
  data: Data<T>[];
  renderItem: ListRenderItem<T>;
};
type Data<T> = { id: string; value: string } & keyof T;
type Layout = { width: number; height: number };
type TargetLayout = { x: number; y: number } & Layout;
type Position = { opacity: number; top: number; left: number };

const Select = <T, S extends NativeView>({
  data,
  renderExhibitor,
  renderItem,
}: Props<T, S>) => {
  console.log(data);
  console.log(renderItem);

  const ref = useRef<S>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [targetLayout, setTargetLayout] = useState<TargetLayout>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const handleMountPress = useCallback(() => {
    ref.current?.measureInWindow((x, y, width, height) => {
      setTargetLayout({
        x,
        y,
        width,
        height,
      });
      setVisible((state) => !state);
    });
  }, []);

  const handleDismissPopoverPress = useCallback(() => {
    setVisible((state) => !state);
  }, []);

  const Exhibitor = useMemo(
    () => renderExhibitor(ref, [], handleMountPress),
    []
  );

  return (
    <Container>
      {Exhibitor}
      {visible && (
        <Portal>
          <Popover
            targetLayout={targetLayout}
            onPress={handleDismissPopoverPress}
          />
        </Portal>
      )}
    </Container>
  );
};

const Container = styled(View)(() => ({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  alignContent: 'center',
}));

type PopoverProps1 = {
  targetLayout: LayoutRectangle;
  onPress: (event: GestureResponderEvent) => void;
};
const Popover = ({ targetLayout, onPress }: PopoverProps1) => {
  const [layout, setLayout] = useState<Layout>({ width: 0, height: 0 });
  const position = useMemo<Position>(
    () => ({
      opacity: layout.height === 0 || layout.width === 0 ? 0 : 1,
      top: targetLayout.y + targetLayout.height + 8,
      left: targetLayout.x + targetLayout.width / 2 - layout.width / 2,
    }),
    [layout, targetLayout]
  );

  const handleOnLayout = useCallback(
    ({
      nativeEvent: {
        layout: { height, width },
      },
    }: LayoutChangeEvent) => {
      setLayout((state) => {
        if (state.height === height && state.width === width) {
          return state;
        }

        return { height, width };
      });
    },
    []
  );

  return (
    // @ts-expect-error: Wrong Pressable types
    <ButtonContainer onPress={onPress}>
      <BackdropContainer>
        <Container1 onLayout={handleOnLayout} containerSx={position}>
          <Text>SIMPLE POPOVER</Text>
        </Container1>
      </BackdropContainer>
    </ButtonContainer>
  );
};

const ButtonContainer = styled(Pressable)(() => ({
  ...StyleSheet.absoluteFillObject,
}));
const BackdropContainer = styled(View)(() => ({
  ...StyleSheet.absoluteFillObject,
  backgroundColor: '#0001',
}));
type Container1Props = { containerSx?: SxProp };
const Container1 = styled(View)(({ containerSx }: Container1Props) => {
  const sx = useSx();
  const containerStyle = {
    position: 'absolute',
    alignSelf: 'center',
    paddingY: '$5',
    paddingX: '$5',
    backgroundColor: '$surface',
    shadowColor: '$onSurface',
    shadowOpacity: 0.5,
    shadowRadius: theme.space.$1,
    elevation: theme.space.$2,
    shadowOffset: {
      width: theme.space.$0,
      height: theme.space.$1,
    },
  };
  const flattened = StyleSheet.flatten([
    containerStyle,
    !!containerSx && sx(containerSx),
  ]);

  return flattened;
});

export default Select;

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Pressable, styled, SxProp, useSx, View } from 'dripsy';
import { Portal } from '@gorhom/portal';
import { colord } from 'colord';
import theme from '../../configs';
import type { ReactElement, RefObject } from 'react';
import type {
  GestureResponderEvent,
  LayoutChangeEvent,
  LayoutRectangle,
  View as ReactNativeView,
} from 'react-native';

type Layout = { width: number; height: number };
type TargetLayout = { x: number; y: number } & Layout;
type Position = { opacity: number; top: number; left: number };

type Props<T> = {
  renderExhibitor: (
    ref: RefObject<T>,
    handleMountPress: () => void
  ) => ReactElement;
  children: ReactElement;
  backdropOpacity?: number;
  backdropBackgroundColor?: string;
};

const Popover = <T extends ReactNativeView>({
  renderExhibitor,
  children,
  backdropOpacity,
  backdropBackgroundColor,
}: Props<T>) => {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [targetLayout, setTargetLayout] = useState<TargetLayout>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const handleMountPress = useCallback(() => {
    ref.current?.measureInWindow((x, y, width, height) => {
      setTargetLayout({ x, y, width, height });
      setVisible((state) => !state);
    });
  }, []);

  const handleDismissPopoverPress = useCallback(() => {
    setVisible((state) => !state);
  }, []);

  const Exhibitor = useMemo(() => {
    const element = renderExhibitor(ref, handleMountPress);
    return element;
  }, []);

  return (
    <Container>
      {Exhibitor}
      {visible && (
        <Portal>
          <ChildrenContainer
            targetLayout={targetLayout}
            onPress={handleDismissPopoverPress}
            backdropOpacity={backdropOpacity}
            backdropBackgroundColor={backdropBackgroundColor}
          >
            {children}
          </ChildrenContainer>
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

type ChildrenProps = {
  children: ReactElement;
  onPress: (event: GestureResponderEvent) => void;
  targetLayout: LayoutRectangle;
  backdropOpacity?: number;
  backdropBackgroundColor?: string;
};
const ChildrenContainer = ({
  children,
  onPress,
  targetLayout,
  backdropBackgroundColor,
  backdropOpacity,
}: ChildrenProps) => {
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
    <BottomContainer onPress={onPress}>
      <BackdropContainer
        backgroundColor={backdropBackgroundColor || theme.colors.$onSurface}
        opacity={backdropOpacity || 0.1}
      >
        <PopoverContainer onLayout={handleOnLayout} containerSx={position}>
          {children}
        </PopoverContainer>
      </BackdropContainer>
    </BottomContainer>
  );
};

const BottomContainer = styled(Pressable)(() => ({
  ...StyleSheet.absoluteFillObject,
}));

type BackdropContainerProps = { backgroundColor: string; opacity?: number };
const BackdropContainer = styled(View)(
  ({ backgroundColor, opacity }: BackdropContainerProps) => ({
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colord(backgroundColor)
      .alpha(opacity || 0.2)
      .toHex(),
  })
);

type PopoverContainerProps = { containerSx?: SxProp };
const PopoverContainer = styled(Pressable)(
  ({ containerSx }: PopoverContainerProps) => {
    const sx = useSx();
    const containerStyle = {
      position: 'absolute',
      alignSelf: 'center',
      backgroundColor: '$surface',
      shadowColor: '$onSurface',
      shadowOpacity: 0.2,
      shadowRadius: theme.space.$1,
      elevation: theme.space.$1,
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
  }
);

export default Popover;

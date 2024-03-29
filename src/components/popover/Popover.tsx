import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Pressable, styled, SxProp, useSx, View } from 'dripsy';
import { Portal } from '@gorhom/portal';
import { colord } from 'colord';
import { theme } from '../../configs';
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

type Props<T, S> = {
  /** Optional `data` created in the parent to be passed to the `Exhibitor` */
  data?: Data<S> | Data<S>[];
  renderExhibitor: (
    ref: RefObject<T>,
    handleMountPress: () => void,
    /** Optional `data` created in the parent to be passed to the `Exhibitor` */
    data?: Data<S> | Data<S>[]
  ) => ReactElement;
  children: ReactElement;
  backdropOpacity?: number;
  backdropBackgroundColor?: string;
  containerPositionTopOffset?: number;
  containerSx?: SxProp;
};

const Popover = <T extends ReactNativeView, S = void>({
  data,
  renderExhibitor,
  children,
  backdropOpacity,
  backdropBackgroundColor,
  containerPositionTopOffset,
  containerSx,
}: Props<T, S>) => {
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
    const element = renderExhibitor(ref, handleMountPress, data);
    return element;
  }, [renderExhibitor, data]);

  return (
    <Container containerSx={containerSx}>
      {Exhibitor}
      {visible && (
        <Portal>
          <ChildrenContainer
            targetLayout={targetLayout}
            onPress={handleDismissPopoverPress}
            backdropOpacity={backdropOpacity}
            backdropBackgroundColor={backdropBackgroundColor}
            positionTopOffset={containerPositionTopOffset}
          >
            {children}
          </ChildrenContainer>
        </Portal>
      )}
    </Container>
  );
};

type ContainerProps = { containerSx?: SxProp };
const Container = styled(View)(({ containerSx }: ContainerProps) => {
  const sx = useSx();

  return StyleSheet.flatten([
    {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
    },
    !!containerSx && sx(containerSx),
  ]);
});

type ChildrenProps = {
  children: ReactElement;
  onPress: (event: GestureResponderEvent) => void;
  targetLayout: LayoutRectangle;
  backdropOpacity?: number;
  backdropBackgroundColor?: string;
  positionTopOffset?: number;
};
const ChildrenContainer = ({
  children,
  onPress,
  targetLayout,
  backdropBackgroundColor,
  positionTopOffset = 4,
}: ChildrenProps) => {
  const [layout, setLayout] = useState<Layout>({ width: 0, height: 0 });
  const position = useMemo<Position>(
    () => ({
      opacity: layout.height === 0 || layout.width === 0 ? 0 : 1,
      top: targetLayout.y + targetLayout.height + positionTopOffset,
      left: targetLayout.x + targetLayout.width / 2 - layout.width / 2,
    }),
    [layout, targetLayout]
  );
  const containerStyle = useMemo(() => {
    const widthContainerStyle = { width: targetLayout.width };
    const styles = [position, widthContainerStyle];
    const flatten = StyleSheet.flatten(styles);
    return flatten;
  }, [position, targetLayout]);

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
      >
        <PopoverContainer
          onLayout={handleOnLayout}
          containerSx={containerStyle}
        >
          {children}
        </PopoverContainer>
      </BackdropContainer>
    </BottomContainer>
  );
};

const BottomContainer = styled(Pressable)(() => ({
  ...StyleSheet.absoluteFillObject,
}));

type BackdropContainerProps = { backgroundColor: string };
const BackdropContainer = styled(View)(
  ({ backgroundColor }: BackdropContainerProps) => ({
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colord(backgroundColor).alpha(0.1).toHex(),
  })
);

type PopoverContainerProps = { containerSx?: SxProp };
const PopoverContainer = styled(Pressable)(
  ({ containerSx }: PopoverContainerProps) => {
    const sx = useSx();
    const containerStyle = {
      height: '35%',
      position: 'absolute',
      alignSelf: 'center',
      backgroundColor: theme.colors.$surface,
      shadowColor: theme.colors.$onSurface,
      shadowOpacity: 0.2,
      borderTopLeftRadius: theme.space.$1,
      borderTopRightRadius: theme.space.$1,
      borderBottomLeftRadius: theme.space.$3,
      borderBottomRightRadius: theme.space.$3,
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

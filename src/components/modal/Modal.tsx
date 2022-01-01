import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { H3, H4, View, styled } from 'dripsy';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ModalProps, ModalSize } from './types';
import theme from '../../configs';
import Icon from '../icon';

type Props = { withScrollView?: boolean } & ModalProps;
const Modal = ({
  open,
  children,
  label,
  description,
  size = 'medium',
  withScrollView = false,
  onDismiss,
  onRemove,
}: Props) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => getSnapPoints(size), []);
  const { bottom } = useSafeAreaInsets();

  useEffect(() => {
    if (open) bottomSheetRef.current?.present();
    if (!open) bottomSheetRef.current?.dismiss();
  }, [open]);

  const handleOnDismiss = useCallback(() => {
    if (!!onDismiss) onDismiss();
  }, []);

  // @ts-ignore
  const handleOnRemove = useCallback(() => {
    if (onRemove) onRemove();
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="close"
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      onDismiss={handleOnDismiss}
      backdropComponent={renderBackdrop}
      bottomInset={bottom}
      index={snapPoints.length - 1}
      keyboardBehavior="interactive"
    >
      <React.Fragment>
        <Header>
          {/* @ts-ignore: probably a bug in H3 types */}
          {!!label && <H3>{label}</H3>}
          {!!onRemove && (
            <Icon
              icon={{ pack: 'Feather', name: 'x' }}
              orientation="center"
              color={theme.colors.$onSurface}
              onPress={handleOnDismiss}
              containerSx={{ marginRight: '$0' }}
            />
          )}
          {/* @ts-ignore: probably a bug in H4 types */}
          {!!description && <H4>{description}</H4>}
        </Header>
      </React.Fragment>
      {withScrollView ? (
        <BottomSheetScrollView>{children}</BottomSheetScrollView>
      ) : (
        children
      )}
    </BottomSheetModal>
  );
};

const Header = styled(View)(() => ({
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'row',
  marginX: '$5',
}));

function getSnapPoints(size: ModalSize): string[] {
  switch (size) {
    case 'small':
      return ['30%', '50%'];
    case 'medium':
      return ['35%', '70%'];
    case 'large':
      return ['45%', '90%'];
    default:
      return ['75%'];
  }
}

export default Modal;

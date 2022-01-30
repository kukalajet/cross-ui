import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { styled, Pressable, View, H3, H4 } from 'dripsy';
import { Portal } from '@gorhom/portal';
import { colord } from 'colord';
import type { ModalProps, ModalSize } from './types';
import theme from '../../configs';
import Icon from '../icon';

const Modal = ({
  open,
  children,
  label,
  description,
  size = 'large',
  onDismiss,
  onRemove,
}: ModalProps) => {
  const handleOnDismiss = useCallback(() => {
    if (onDismiss) onDismiss();
  }, [onDismiss]);

  const handleOnRemove = useCallback(() => {
    if (onRemove) onRemove();
  }, [onRemove]);

  return (
    <React.Fragment>
      {open && (
        <Portal>
          <Backdrop onPress={handleOnRemove}>
            <Container size={size}>
              {(!!onRemove || !!label) && (
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
                </Header>
              )}
              {!!description && (
                <Description>
                  {/* @ts-ignore: probably a bug in H4 types */}
                  <H4>{description}</H4>
                </Description>
              )}
              <React.Fragment>{children}</React.Fragment>
            </Container>
          </Backdrop>
        </Portal>
      )}
    </React.Fragment>
  );
};

const Backdrop = styled(Pressable)(() => ({
  ...StyleSheet.absoluteFillObject,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: colord(theme.colors.$background)
    .darken(0.5)
    .alpha(0.5)
    .toHex(),
}));

type ContainerProps = { size: ModalSize };
const Container = styled(Pressable)(({ size }: ContainerProps) => ({
  minWidth: 384,
  minHeight: 576,
  width: getWidth(size),
  height: getHeight(size),
  backgroundColor: '$surface',
  borderRadius: theme.space.$5,
}));

const Header = styled(View)(() => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: '$5',
  paddingTop: '$3',
}));

const Description = styled(View)(() => ({
  paddingX: '$1',
  paddingY: '$5',
}));

const mediumWidth = ['75%', '65%', '50%'];
const largeWidth = ['90%', '75%', '65%'];
const getWidth = (size: ModalSize): string[] => {
  switch (size) {
    case 'medium':
      return mediumWidth;
    case 'large':
      return largeWidth;
    default:
      return largeWidth;
  }
};

const getHeight = (size: ModalSize): string => {
  switch (size) {
    case 'medium':
      return '75%';
    case 'large':
      return '90%';
    default:
      return '90%';
  }
};

export default Modal;

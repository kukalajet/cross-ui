import React, { ReactNode } from 'react';
import { DripsyProvider } from 'dripsy';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { PortalProvider } from '@gorhom/portal';
import theme from '../configs';

type CrossProviderProps = {
  children: ReactNode;
};

const CrossProvider = ({ children }: CrossProviderProps) => (
  <DripsyProvider theme={theme}>
    <BottomSheetModalProvider>
      <PortalProvider>{children}</PortalProvider>
    </BottomSheetModalProvider>
  </DripsyProvider>
);

export default CrossProvider;

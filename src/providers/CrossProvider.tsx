import React, { ReactNode } from 'react';
import { DripsyProvider } from 'dripsy';
import theme from '../configs';

type CrossProviderProps = {
  children: ReactNode;
};

const CrossProvider = ({ children }: CrossProviderProps) => (
  <DripsyProvider theme={theme}>
    {/* <BottomSheetModalProvider> */}
    {/* <PortalProvider> */}
    {children}
    {/* </PortalProvider> */}
    {/* </BottomSheetModalProvider> */}
  </DripsyProvider>
);

export default CrossProvider;

import React, { ReactNode } from 'react';
import { DripsyProvider } from 'dripsy';
import theme from '../configs';

type CrossProviderProps = {
  children: ReactNode;
};

const CrossProvider = ({ children }: CrossProviderProps) => (
  // <SafeAreaProvider>
  <DripsyProvider theme={theme}>
    {/* <BottomSheetModalProvider> */}
    {/* <PortalProvider> */}
    {children}
    {/* </PortalProvider> */}
    {/* </BottomSheetModalProvider> */}
  </DripsyProvider>
  // </SafeAreaProvider>
);

export default CrossProvider;

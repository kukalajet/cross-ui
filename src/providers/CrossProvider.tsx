import React, { ReactNode } from 'react';
import { DripsyProvider } from 'dripsy';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { PortalProvider } from '@gorhom/portal';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { theme } from '../configs';

type CrossProviderProps = {
  children: ReactNode;
};

const CrossProvider = ({ children }: CrossProviderProps) => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <DripsyProvider theme={theme}>
      <BottomSheetModalProvider>
        <PortalProvider>
          <SafeAreaProvider>{children}</SafeAreaProvider>
        </PortalProvider>
      </BottomSheetModalProvider>
    </DripsyProvider>
  </GestureHandlerRootView>
);

export default CrossProvider;

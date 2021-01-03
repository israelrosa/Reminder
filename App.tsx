import {
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { Raleway_400Regular } from '@expo-google-fonts/raleway';
import { AppLoading } from 'expo';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';

import { databaseInit } from './src/database/init';
import Router from './src/routes';
import { theme } from './src/styles/theme';

const App: React.FC = () => {
  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Raleway_400Regular,
  });

  useEffect(() => {
    databaseInit();
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <>
      <ThemeProvider theme={theme}>
        <Router />
      </ThemeProvider>
      <StatusBar backgroundColor="#7E84FF" style="light" />
    </>
  );
};

export default App;

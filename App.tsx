// import * as eva from '@eva-design/eva';
// import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import useCachedResources from './src/hook/useCachedResources';
import NavigationApp from './src/Index';
import configureStore from './src/Store/ConfigureStore';

const store = configureStore();
export default function App(props:any) {

  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider store={store}>
        <SafeAreaProvider>
          <NavigationApp />
          <StatusBar style="auto" hidden={true} />
        </SafeAreaProvider>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

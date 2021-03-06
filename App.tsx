import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, Text, Button, Dimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import * as MediaLibrary from 'expo-media-library';
import useCachedResources from './src/hook/useCachedResources';
import NavigationApp from './src/Index';
import configureStore from './src/Store/ConfigureStore';

const store = configureStore();
export default function App(props: any) {

  React.useEffect(() => {

    MediaLibrary.requestPermissionsAsync();

  }, [])

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

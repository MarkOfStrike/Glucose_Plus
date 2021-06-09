// import * as eva from '@eva-design/eva';
// import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import {usePermissions, CAMERA} from 'expo-permissions';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import useCachedResources from './src/hook/useCachedResources';
import NavigationApp from './src/Index';
import configureStore from './src/Store/ConfigureStore';

const store = configureStore();
export default function App(props:any) {

  // const [permission, askForPermission] = usePermissions(CAMERA, { ask: true });

  // if (!permission || permission.permissions !== 'granted') {
  //   return (
  //     <View>
  //       <Text>Permission is not granted</Text>
  //       <Button title="Grant permission" onPress={askForPermission} />
  //     </View>
  //   );
  // }


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

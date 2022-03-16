import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Ionicons from 'react-native-vector-icons/Ionicons';
// eslint-disable-next-line import/extensions,import/no-unresolved
import {MainStackNavigator} from './navigation2/MainStackNavigator';

// TODO: replace here with the frontend
function AppWrapper() {
  return (
    <NavigationContainer>
      <MainStackNavigator />
    </NavigationContainer>
  );
}

export default AppWrapper;

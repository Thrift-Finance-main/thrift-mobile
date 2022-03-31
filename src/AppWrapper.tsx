import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {AuthenticationStackNavigation} from "./navigation/Routes";

function AppWrapper() {
  return (
      <NavigationContainer>
          <AuthenticationStackNavigation />
      </NavigationContainer>
  );
}

export default AppWrapper;

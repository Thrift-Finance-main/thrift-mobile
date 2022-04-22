import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Welcome from "../view/screens/welcome";
import MainTabNavigation from "./MainTabNavigation";

const Stack = createStackNavigator();

const MainStackNavigator = () => {
  return (
        <Stack.Navigator>
          <Stack.Screen
              name="Welcome"
              component={Welcome}
              options={{ headerShown: false }}
          />
          <Stack.Screen name="Main" component={MainTabNavigation} options={{ headerShown:false}}/>
        </Stack.Navigator>
  );
};

export { MainStackNavigator };

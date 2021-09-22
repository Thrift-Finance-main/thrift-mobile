import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MainTabNavigation from "./MainTabNavigation";
import Home from "../view/screens/home/Component";
import Settings from "../view/screens/settings/Component";

const Stack = createStackNavigator();

const HomeStackNavigator = () => {
  return (
        <Stack.Navigator>
          <Stack.Screen
              name="Home2"
              component={Home}
              options={{ headerShown: false }}
          />
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
  );
};

export { HomeStackNavigator };

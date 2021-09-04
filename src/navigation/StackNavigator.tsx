import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../view/screens/home/Component";
import Settings from "../view/screens/settings/Component";

const Stack = createStackNavigator();

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: "#9AC4F8",
  },
    headerShown: false,
  headerTintColor: "white",
  headerBackTitle: "Back",
};

const MainStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
};


export { MainStackNavigator };

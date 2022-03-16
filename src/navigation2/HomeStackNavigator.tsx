import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MainTabNavigation from "./MainTabNavigation";
import Home from "../view/screens/home/Component";
import Settings from "../view/screens/settings/Component";
import {useTranslation} from "react-i18next";

const Stack = createStackNavigator();

const HomeStackNavigator = () => {
    const { t, i18n, ready } = useTranslation();
    const settingsName = t('routes.settings');
    const homeName = t('routes.home');
  return (
        <Stack.Navigator>
          <Stack.Screen
              name={homeName}
              component={Home}
              options={{ headerShown: false }}
          />
          <Stack.Screen name={settingsName} component={Settings} options={{headerBackTitleVisible:false}}/>
        </Stack.Navigator>
  );
};

export { HomeStackNavigator };

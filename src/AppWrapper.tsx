import React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {createStackNavigator} from "@react-navigation/stack";
import {View, Text} from "react-native";
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTranslation} from "react-i18next";
import Home from "./view/screens/home/Component";
import Settings from "./view/screens/settings/Component";

const Tab = createBottomTabNavigator();



function AppWrapper() {
    // const { t, i18n } = useTranslation();
    const { t, i18n, ready } = useTranslation();
    // @ts-ignore
    const homeName = t('navBottomTabs.home');
    console.log(homeName);
    const settingsName = t('navBottomTabs.settings');
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === homeName) {
                            iconName = focused
                                ? 'ios-home'
                                : 'ios-home';
                        } else if (route.name === settingsName) {
                            iconName = focused ? 'ios-settings' : 'ios-settings';
                        }

                        // You can return any component that you like here!
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: 'tomato',
                    tabBarInactiveTintColor: 'gray',
                })}
            >
                <Tab.Screen name={homeName} component={Home} />
                <Tab.Screen name={settingsName} component={Settings} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default AppWrapper;

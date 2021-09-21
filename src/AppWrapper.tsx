import React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTranslation} from "react-i18next";
import {MainStackNavigator} from "./navigation/MainStackNavigator";

const Tab = createBottomTabNavigator();

function AppWrapper() {
    // const { t, i18n } = useTranslation();
    const { t, i18n, ready } = useTranslation();
    const homeName = t('navBottomTabs.home');
    const settingsName = t('navBottomTabs.settings');
    const movementsName = t('navBottomTabs.movements');
    const analyticsName = t('navBottomTabs.analytics');
    const servicesName = t('navBottomTabs.services');

    return (
        <NavigationContainer>
           <MainStackNavigator/>
        </NavigationContainer>
    );
}

export default AppWrapper;

import React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTranslation} from "react-i18next";
import {TabNavigation} from "./TabNavigation";
import Movements from "../view/screens/movements/Component";
import Analytics from "../view/screens/analytics/Component";
import Settings from "../view/screens/settings/Component";
import Home from "../view/screens/home/Component";

const Tab = createBottomTabNavigator();

function MainTabNavigation() {
    // const { t, i18n } = useTranslation();
    const { t, i18n, ready } = useTranslation();
    const homeName = t('navBottomTabs.home');
    const settingsName = t('navBottomTabs.settings');
    const movementsName = t('navBottomTabs.movements');
    const analyticsName = t('navBottomTabs.analytics');
    const servicesName = t('navBottomTabs.services');

    return (
            <Tab.Navigator tabBar={props => <TabNavigation {...props} />}>
                <Tab.Screen key={homeName} name={homeName} component={Home} />
                <Tab.Screen key={movementsName} name={movementsName} component={Movements} />
                <Tab.Screen key={analyticsName} name={analyticsName} component={Analytics} />
                <Tab.Screen key={servicesName} name={servicesName} component={Analytics} />
                <Tab.Screen key={settingsName} name={settingsName} component={Settings} />
            </Tab.Navigator>
    );
}

export default MainTabNavigation;

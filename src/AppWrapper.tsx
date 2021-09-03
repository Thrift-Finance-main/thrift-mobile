import React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTranslation} from "react-i18next";
import Home from "./view/screens/home/Component";
import Settings, {RootTabParamList} from "./view/screens/settings/Component";
import Movements from "./view/screens/movements/Component";
import Analytics from "./view/screens/analytics/Component";
import {TabBar} from "./navigation/TabBar";

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
            <Tab.Navigator tabBar={props => <TabBar {...props} />}>
                <Tab.Screen key={homeName} name={homeName} component={Home} />
                <Tab.Screen key={movementsName} name={movementsName} component={Movements} />
                <Tab.Screen key={analyticsName} name={analyticsName} component={Analytics} />
                <Tab.Screen key={servicesName} name={servicesName} component={Analytics} />
                <Tab.Screen key={settingsName} name={settingsName} component={Settings} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default AppWrapper;

import React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {createStackNavigator} from "@react-navigation/stack";
import {View, Text, Button} from "react-native";
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTranslation} from "react-i18next";
import Home from "./view/screens/home/Component";
import Settings, {RootTabParamList} from "./view/screens/settings/Component";
import Movements from "./view/screens/movements/Component";
import Analytics from "./view/screens/analytics/Component";

const Tab = createBottomTabNavigator();

// @ts-ignore
function DetailsScreen({ navigation }) {
    console.log('navigation:')
    console.log(typeof navigation);
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Details Screen</Text>
            <Button
                title="Go to Details... again"
                onPress={() => navigation.push('Details')}
            />
            <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
            <Button title="Go back" onPress={() => navigation.goBack()} />
            <Button
                title="Go back to first screen in stack"
                onPress={() => navigation.popToTop()}
            />
        </View>
    );
}

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
            <Tab.Navigator
                initialRouteName={homeName}
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === homeName) {
                            iconName = focused
                                ? 'ios-home'
                                : 'ios-home';
                        } else if (route.name === settingsName) {
                            iconName = focused ? 'ios-settings' : 'ios-settings';
                        } else if (route.name === movementsName) {
                            iconName = focused ? 'ios-wallet' : 'ios-wallet';
                        } else if (route.name === analyticsName) {
                            iconName = focused ? 'ios-pie-chart' : 'ios-pie-chart';
                        } else if (route.name === servicesName) {
                            iconName = focused ? 'ios-cart' : 'ios-cart';
                        }

                        // You can return any component that you like here!
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: 'tomato',
                    tabBarInactiveTintColor: 'gray',
                })}
            >
                <Tab.Screen name={homeName} component={Home} />
                <Tab.Screen name={movementsName} component={Movements} />
                <Tab.Screen name={analyticsName} component={Analytics} />
                <Tab.Screen name={servicesName} component={Analytics} />
                <Tab.Screen name={settingsName} component={Settings} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default AppWrapper;

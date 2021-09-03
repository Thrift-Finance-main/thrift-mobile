import React from 'react';
import {View, Text, TouchableOpacity} from "react-native";
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTranslation} from "react-i18next";

// @ts-ignore
export function TabBar({ state, descriptors, navigation }) {
    const { t, i18n, ready } = useTranslation();
    const homeName = t('navBottomTabs.home');
    const settingsName = t('navBottomTabs.settings');
    const movementsName = t('navBottomTabs.movements');
    const analyticsName = t('navBottomTabs.analytics');
    const servicesName = t('navBottomTabs.services');

    return (
        <View style={{ flexDirection: 'row',height:50, marginBottom: 10,justifyContent:"center",alignItems:"center" }}>
            {state.routes.map((route: { key: string | number; name: string; }, index: number) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                        ? options.title
                        : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                let iconName;
                const focused = options.focused;

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

                return (
                    <TouchableOpacity
                        accessibilityRole="button"
                        // @ts-ignore
                        accessibilityStates={isFocused ? ['selected'] : []}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={{ flex: 1, alignItems:"center" }}
                        key={route.key}
                    >
                        <Ionicons name={iconName} size={25} color={ isFocused ? 'tomato' : 'gray' } />
                        <Text style={{ color: isFocused ? 'tomato' : 'gray', fontSize: 10 }}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

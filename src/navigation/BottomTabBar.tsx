import * as React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import Colors from '../constants/CustomColors';
import WalletFocus from '../assets/WalletFocus.svg'
import WalletUnFocus from '../assets/WalletUnFocus.svg'
import SmartFiFocus from '../assets/SmartFiFocus.svg'
import SmartFiUnFocus from '../assets/SmartFiUnFocus.svg'
import SettingsFocus from '../assets/SettingsFocus.svg'
import SettingsUnFocus from '../assets/SettingsUnFocus.svg'

import WalletDarkFocus from '../assets/WalletDarkFocus.svg'
import DarkSmartFiUnfocus from '../assets/DarkSmartFiUnfocus.svg'
import SettingDarkUnfocus from '../assets/SettingDarkUnfocus.svg'

import { heightPercentageToDP, widthPercentageToDP } from '../utils/dimensions';
import { useSelector } from 'react-redux';

const BottomTabBar = ({ state, descriptors, navigation }) => {
    const isBlackTheme = useSelector((state) => state.Reducers.isBlackTheme);

    const focusedOptions = descriptors[state.routes[state.index].key].options;
    console.log(focusedOptions?.tabBarStyle);

    if (focusedOptions?.tabBarStyle?.display === "none") {
        return null;
    }

    return (
        <View style={{
            ...styles.tabBarContainer, backgroundColor:
                isBlackTheme ? Colors.blackTheme :
                    '#F9F9F9',
        }}>
            {state.routes.map((route: any, index: number) => {
                const { options } = descriptors[route.key];
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
                return (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={1}
                        accessibilityRole="button"
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={
                            index === 2 ? () => navigation.navigate("Settings")

                                :
                                onPress}
                        onLongPress={onLongPress}
                        style={{ flex: 1, alignItems: 'center' }}>
                        {index == 0 ? (
                            <>
                                {isFocused ?
                                    isBlackTheme ? <WalletDarkFocus /> :
                                        <WalletFocus
                                        /> :
                                    <WalletUnFocus />
                                }
                            </>
                        ) : index == 1 ? (
                            <>
                                {isFocused ?

                                    <SmartFiFocus
                                    /> :
                                    isBlackTheme ? <DarkSmartFiUnfocus /> :
                                        <SmartFiUnFocus />
                                }
                            </>
                        ) :
                            <>
                                {isFocused ?
                                    <SettingsFocus
                                    /> :
                                    isBlackTheme ? <SettingDarkUnfocus /> :
                                        <SettingsUnFocus />
                                }

                            </>
                        }
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};
export default BottomTabBar;
const styles = StyleSheet.create({
    tabBarContainer: {
        height: heightPercentageToDP(10),
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: widthPercentageToDP(0.5),
        alignSelf: "center"
    },
});

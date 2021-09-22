import React from 'react';
import {NavigationContainer} from "@react-navigation/native";
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import {MainStackNavigator} from "./navigation/MainStackNavigator";

function AppWrapper() {
    return (
        <NavigationContainer>
           <MainStackNavigator/>
        </NavigationContainer>
    );
}

export default AppWrapper;

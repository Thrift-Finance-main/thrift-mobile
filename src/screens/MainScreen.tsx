import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {FC, useEffect, useState} from 'react'
import SplashScreen from 'react-native-splash-screen';
import { useDispatch, useSelector } from 'react-redux';
import Language from '../components/Language'
import { setTheme } from '../store/Action';
import {getCurrentLang, getCurrentLanguage, LANGUAGES_LIST, LANGUAGES_NAMES, translate} from "../i18n";
import i18next from "i18next";
import {withTranslation} from "react-i18next";
import {getKeyByValue} from "../utils";
import {SafeAreaView} from "react-native-safe-area-context";
import Colors from "../constants/CustomColors";
import {StyleSheet, Text, View} from "react-native";
import DropDownMenu from "../components/Common/DropDownMenu";
import {heightPercentageToDP, widthPercentageToDP} from "../utils/dimensions";
import Button from "../components/Common/Button";
import LanguageModal from "../components/PopUps/LanguageModal";
import {ENTRY_WITCH_ROUTE} from "../config/routes";

interface RouteHandlerProps {
    navigate: (n:string) => void,
    entryRoute: any
}
const RouteHandler: FC<RouteHandlerProps> = (props) => {

    switch (props.entryRoute) {
        case ENTRY_WITCH_ROUTE.LANGUAGE:
            props.navigate("Language");
            break;
        case ENTRY_WITCH_ROUTE.HOME_PAGE:
            props.navigate("DashboardTab");
            break;
        default:
            props.navigate("DashboardTab");
            break;
    }

    return (
        <SafeAreaView >
        </SafeAreaView>
    );
}

const MainScreen = ({ navigation }) => {
    const entryRoute = useSelector((state) => state.Reducers.entryRoute);
    const navigateTo = (navigate:string) => {
        navigation.navigate(navigate)
    }
    return (
        <RouteHandler
            navigate ={(n:string) => navigateTo(n)}
            entryRoute={entryRoute}
        />
    )
}

export default withTranslation()(MainScreen)

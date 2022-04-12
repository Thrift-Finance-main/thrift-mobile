import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {FC, useEffect, useRef, useState} from 'react'
import SplashScreen from 'react-native-splash-screen';
import { useDispatch, useSelector } from 'react-redux';
import Language from '../components/Language'
import { setTheme } from '../store/Action';
import {getCurrentLang, getCurrentLanguage, LANGUAGES_LIST, LANGUAGES_NAMES, translate} from "../i18n";
import i18next from "i18next";
import {withTranslation} from "react-i18next";
import {delay, getKeyByValue} from "../utils";
import {SafeAreaView} from "react-native-safe-area-context";
import Colors from "../constants/CustomColors";
import {StyleSheet, Text, View} from "react-native";
import DropDownMenu from "../components/Common/DropDownMenu";
import {heightPercentageToDP, widthPercentageToDP} from "../utils/dimensions";
import Button from "../components/Common/Button";
import LanguageModal from "../components/PopUps/LanguageModal";
import {ENTRY_WITCH_ROUTE} from "../config/routes";
import {apiDb} from "../db/LocalDb";
import {fetchBlockfrost} from "../api/Blockfrost";

interface RouteHandlerProps {
    navigate: (n:string) => void,
    entryRoute: any,
    currentAccount: any
}
const RouteHandler: FC<RouteHandlerProps> = (props) => {

    console.log('props');
    console.log(props);
    console.log(props.currentAccount);
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
    const currentAccount = useSelector((state) => state.Reducers.currentAccount);
    console.log('currentAccount 222222');
    console.log(currentAccount);

    const navigateTo = (navigate:string) => {
        navigation.navigate(navigate)
    }

    const useIsMounted = () => {
        const isMounted = useRef(false);
        // @ts-ignore
        useEffect(() => {
            isMounted.current = true;
            return () => (isMounted.current = false);
        }, []);
        return isMounted;
    };

    const isMounted = useIsMounted();


    // apiDb.removeDb().then(r=>{});
    useEffect(() =>{


        const fetchData = async () => {
            await delay(2000);
            console.log('fetchData');
            console.log('currentAccount');
            console.log(currentAccount);
            let saddress = currentAccount && currentAccount.rewardAddress;
            if (saddress) {
                saddress = "accounts/" + saddress
                console.log('saddress');
                console.log(saddress);
                const data = await fetchBlockfrost(saddress);
                console.log('data');
                console.log(data);
            } else {
                console.log("Not current account in store");
            }
        }

        if (isMounted.current) {
            // call the function
            fetchData()
                // make sure to catch any error
                .catch(console.error);
        }

    }, [currentAccount]);

    return (
        <RouteHandler
            navigate ={(n:string) => navigateTo(n)}
            entryRoute={entryRoute}
        />
    )
}

export default withTranslation()(MainScreen)

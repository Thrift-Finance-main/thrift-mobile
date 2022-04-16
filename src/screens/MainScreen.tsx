
import React, {FC, useEffect, useRef, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Language from '../components/Language';
import {withTranslation} from "react-i18next";
import {SafeAreaView} from "react-native-safe-area-context";
import {ENTRY_WITCH_ROUTE} from "../config/routes";
import {apiDb} from "../db/LiteDb";

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
            props.navigate("Load");
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

    // TODO: Move all useEffect to WalletScreen, MainScreen appear always


    //apiDb.removeDb().then(r=>{});
    return (
        <RouteHandler
            navigate ={(n:string) => navigateTo(n)}
            entryRoute={entryRoute}
        />
    )
}

export default withTranslation()(MainScreen)

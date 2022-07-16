import React, { useEffect, useState } from 'react'
import SplashScreen from 'react-native-splash-screen'
import Wallet from '../components/Wallet';
import Dijed from '../assets/Dijed.svg';
import COTI from '../assets/Coti.svg';
import Ada from '../assets/Ada.svg'
import Dana from '../assets/Dana.svg'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import { connect, useDispatch, useSelector } from 'react-redux';
import {setTheme, setWalletRoute} from "../store/Action"
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Blockfrost, fetchBlockfrost} from "../api/Blockfrost";
import {Alert, BackHandler} from "react-native";

const WalletScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const isBlackTheme = useSelector((state) => state.Reducers.isBlackTheme);
    const currentAccount = useSelector((state) => state.Reducers.currentAccount);
    const walletRoute = useSelector((state) => state.Reducers.walletRoute);

    const [receiveTokenModal, setReceiveTokenModal] = useState<boolean>(false)
    const [transactionDetailsModal, setTransactionDetailsModal] = useState<boolean>(false)

    useEffect(() => {
        SplashScreen.hide();
    }, [])
    useEffect(() => {
        const backAction = () => {
            BackHandler.exitApp()
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => backHandler.remove();
    }, []);
    const onContinuePress = (route:string) => {
        navigation.navigate(route, {fromRoute: "DashboardTab"});
    }

    const hideShowReceiveTokenModal = () => {
        setReceiveTokenModal(!receiveTokenModal)

    }
    const handleBackPress = () => {

        BackHandler.exitApp()
    }
    const hideShowTransactionDetailsModal = () => {
        setTransactionDetailsModal(!transactionDetailsModal)

    }
    const showCreateTokenScreen = () => {
        navigation.navigate("CreateToken");
    }
    const onTabOptionPress = (route:string) => {
        dispatch(setWalletRoute(route));
    }

    const onDarkThemePresss = async () => {
        AsyncStorage.setItem('isBlackTheme', !isBlackTheme == true ? "0" : "1");
        dispatch(setTheme(!isBlackTheme));
    };
    return (
        <Wallet
            receiveTokenModal={receiveTokenModal}
            hideShowReceiveTokenModal={hideShowReceiveTokenModal}
            transactionDetailsModal={transactionDetailsModal}
            hideShowTransactionDetailsModal={hideShowTransactionDetailsModal}
            showCreateTokenScreen={showCreateTokenScreen}
            walletRoute={walletRoute}
            onTabOptionPress={(route:string) => onTabOptionPress(route)}
            onDarkThemePresss={onDarkThemePresss}
            isBlackTheme={isBlackTheme}
            onContinuePress={(route:string) => onContinuePress(route)}
        />
    )
}

export default WalletScreen

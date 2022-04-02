import React, { useEffect, useState } from 'react'
import SplashScreen from 'react-native-splash-screen'
import Wallet from '../components/Wallet';
import Dijed from '../assets/Dijed.svg';
import COTI from '../assets/Coti.svg';
import Ada from '../assets/Ada.svg'
import Dana from '../assets/Dana.svg'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import { connect, useDispatch, useSelector } from 'react-redux';
import { setTheme } from "../store/Action"
import AsyncStorage from '@react-native-async-storage/async-storage';

const WalletScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const isBlackTheme = useSelector((state) => state.Reducers.isBlackTheme);

    const List = [
        {
            icon: <Dijed

            />,
            title: "Djed",
        },
        {
            icon: <COTI />,
            title: "COTI",
        },
        {
            icon: <Ada />,
            title: "ADA",
        },
        {
            icon: <Dana />,
            title: "DANA",
        },
    ]
    const transactionList = [{
        icon: <AntDesignIcon
            name="arrowup"
            color="red"
            size={22}
        />,
        title: "addrlq95e.....addrlq95ead",
    },
    {
        icon: <AntDesignIcon
            name="arrowdown"
            color="green"
            size={22}
        />,
        title: "addrlq95e.....addrlq95ead",
    },]
    const [receiveTokenModal, setReceiveTokenModal] = useState<boolean>(false)
    const [transactionDetailsModal, setTransactionDetailsModal] = useState<boolean>(false)
    const [showAssets, setShowAssets] = useState<boolean>(true)
    const [showTransaction, setShowTransaction] = useState<boolean>(false)

    useEffect(() => {
        SplashScreen.hide()
    }, [])
    const onContinuePress = () => {
        navigation.navigate("CreateAccount")
    }

    const hideShowReceiveTokenModal = () => {
        setReceiveTokenModal(!receiveTokenModal)

    }
    const hideShowTransactionDetailsModal = () => {
        setTransactionDetailsModal(!transactionDetailsModal)

    }
    const showCreateTokenScreen = () => {
        navigation.navigate("CreateToken")
    }
    const onAssetsPress = () => {
        setShowAssets(true)
        setShowTransaction(false)
    }
    const onTransactionPress = () => {
        setShowAssets(false)
        setShowTransaction(true)
    }

    const onDarkThemePresss = async () => {
        AsyncStorage.setItem('isBlackTheme', !isBlackTheme == true ? "0" : "1");

        dispatch(setTheme(!isBlackTheme));

        console.log("djddjj", isBlackTheme);

    };
    return (
        <Wallet
            List={List}
            receiveTokenModal={receiveTokenModal}
            hideShowReceiveTokenModal={hideShowReceiveTokenModal}
            transactionDetailsModal={transactionDetailsModal}
            hideShowTransactionDetailsModal={hideShowTransactionDetailsModal}
            showCreateTokenScreen={showCreateTokenScreen}
            transactionList={transactionList}
            showAssets={showAssets}
            onAssetsPress={onAssetsPress}
            showTransaction={showTransaction}
            onTransactionPress={onTransactionPress}
            onDarkThemePresss={onDarkThemePresss}
            isBlackTheme={isBlackTheme}
        />
    )
}

export default WalletScreen

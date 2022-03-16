import React, { useState } from 'react'
import Settings from '../components/Settings';
import DarkMode from '../assets/DarkMode.svg'
import Security from './Security.svg'
import Notification from '../assets/Notification.svg'
import Language from '../assets/Language.svg'
import About from '../assets/About.svg'
import Terms from '../assets/Terms.svg'
import { useSelector } from 'react-redux';

const SettingsScreen = ({ navigation }) => {
    const isBlackTheme = useSelector((state) => state.Reducers.isBlackTheme);
    const [pushVisible, setPushVisible] = useState<boolean>(false)
    const [currencyVisible, setCurrencyVisible] = useState<boolean>(false)
    const MenuList = [
        {
            icon: <Security />,
            title: "Security",
        },
        {
            icon: <Notification />,
            title: "Push Notification",
        },
        {
            icon: <Notification />,
            title: "Currency Converter",
        },
        {
            icon: <Language />,
            title: "Language",
        },
        {
            icon: <About />,
            title: "About",
        },
        {
            icon: <Terms />,
            title: "Terms & Condition",
        },
    ]
    const onContinuePress = () => {
        navigation.navigate("CreateAccount")
    }
    const onBackIconPress = () => {
        navigation.goBack()
    }
    const onSecurityPress = () => {
        navigation.navigate("Security")
    }
    const onPushNotoficationPress = () => {
        setPushVisible(true)
    }
    const hidePushModal = () => {
        setPushVisible(false)
    }
    const hideShowCurrencyModal = () => {
        setCurrencyVisible(!currencyVisible);
    }
    return (
        <Settings
            MenuList={MenuList}
            onBackIconPress={onBackIconPress}
            onSecurityPress={onSecurityPress}
            isBlackTheme={isBlackTheme}
            navigation={navigation}
            onPushNotoficationPress={onPushNotoficationPress}
            pushVisible={pushVisible}
            hidePushModal={hidePushModal}
            hideShowCurrencyModal={hideShowCurrencyModal}
            currencyVisible={currencyVisible}
        />
    )
}

export default SettingsScreen

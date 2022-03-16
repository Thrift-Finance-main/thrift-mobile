import React, { useState } from 'react'
import Security from '../components/Security';
import FingerPrint from '../assets/FingerPrint.svg'
import Unlock from '../assets/Unlock.svg'
import Keys from '../assets/Keys.svg'
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';
const SecurityScreen = ({ navigation }) => {
    const [visible, setVisible] = useState<boolean>(false);
    const isBlackTheme = useSelector((state) => state.Reducers.isBlackTheme);

    const hideModal = () => {
        setVisible(false)
        navigation.navigate("ThumbPrint")
    }
    const MenuList = [{
        icon: <Unlock />,
        title: "Set unlock code",
    },
    {
        icon: <Keys />,
        title: "Change Password",
    },
    {
        icon: <FingerPrint />,
        title: "Fingerprint",
    },

    ]
    const onContinuePress = () => {
        navigation.navigate("CreateAccount")
    }
    const onBackIconPress = () => {
        navigation.goBack()
    }
    const onChangePasswordPress = () => {
        navigation.navigate("ChangePassword")
    }

    const unlockCodePress = () => {
        navigation.navigate("CreatePin")
    }

    const onFingerPrintPress = () => {
        setVisible(true);
    }
    return (
        <Security
            MenuList={MenuList}
            onBackIconPress={onBackIconPress}
            onChangePasswordPress={onChangePasswordPress}
            unlockCodePress={unlockCodePress}
            visible={visible}
            hideModal={hideModal}
            onFingerPrintPress={onFingerPrintPress}
            isBlackTheme={isBlackTheme}
        />

    )
}

export default SecurityScreen

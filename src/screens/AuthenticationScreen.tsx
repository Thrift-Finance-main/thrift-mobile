import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import Authentication from '../components/Authentication'

const AuthenticationScreen = ({ navigation }) => {
    const isBlackTheme = useSelector((state) => state.Reducers.isBlackTheme);

    const onCreateAccountPress = () => {
        //hideShowLanguageModal();
        navigation.navigate("Welcome")
    }
    const onRestoreAccountPress = () => {
        navigation.navigate("CreateAccount", {
            fromScreen: "RestoreAccount"
        })
    }

    return (
        <Authentication
            onCreateAccountPress={onCreateAccountPress}
            onRestoreAccountPress={onRestoreAccountPress}
            isBlackTheme={isBlackTheme}

        />
    )
}

export default AuthenticationScreen






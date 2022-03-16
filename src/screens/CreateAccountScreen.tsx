import React from 'react'
import { useSelector } from 'react-redux';
import CreateAccount from '../components/CreateAccount'

const CreateAccountScreen = ({ navigation, route }) => {
    const isBlackTheme = useSelector((state) => state.Reducers.isBlackTheme);

    const { fromScreen } = route.params
    const onContinuePress = () => {
        navigation.navigate(fromScreen == "CreateAccount" ? "Terms" : "RestoreWallet")
    }
    const onBackIconPress = () => {
        navigation.goBack()
    }

    return (
        <CreateAccount
            onContinuePress={onContinuePress}
            onBackIconPress={onBackIconPress}
            fromScreen={fromScreen}
            isBlackTheme={isBlackTheme}
        />
    )
}

export default CreateAccountScreen

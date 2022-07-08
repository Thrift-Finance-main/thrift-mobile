import React from 'react'
import { useSelector } from 'react-redux';
import Send from '../components/Send'

const SendScreen = ({ navigation, route }) => {
    const isBlackTheme = useSelector((state) => state.Reducers.isBlackTheme);

    console.log('data CreateTokenScreen');
    console.log(route.params);
    // const { fromScreen } = route.params
    // const onContinuePress = () => {
    //     navigation.navigate(fromScreen == "CreateAccount" ? "Terms" : "RestoreWallet")
    // }
    const onBackIconPress = () => {
        navigation.goBack()
    }
    const onContinuePress = (route) => {
        navigation.navigate(route)
    }

    return (
        <Send
            // onContinuePress={onContinuePress}
            onBackIconPress={onBackIconPress}
            onContinuePress={(route) => onContinuePress(route)}
            isBlackTheme={isBlackTheme}
            address={route.params}
        // fromScreen={fromScreen}
        />
    )
}

export default SendScreen

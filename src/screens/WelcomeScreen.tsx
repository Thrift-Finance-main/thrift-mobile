import React from 'react'
import { useSelector } from 'react-redux';
import Welcome from '../components/Welcome'
const WelcomeScreen = ({ navigation }) => {
    const isBlackTheme = useSelector((state) => state.Reducers.isBlackTheme);

    const onContinuePress = () => {
        navigation.navigate("CreateAccount", {
            fromScreen: "CreateAccount"
        })
    }

    return (
        <Welcome
            onContinuePress={onContinuePress}
            isBlackTheme={isBlackTheme}
        />
    )
}

export default WelcomeScreen

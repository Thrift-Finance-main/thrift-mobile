import React from 'react'
import { useSelector } from 'react-redux';
import SmartFi from '../components/SmartFi'
const SmartFiScreen = ({ navigation }) => {
    const isBlackTheme = useSelector((state) => state.Reducers.isBlackTheme);

    const onContinuePress = () => {
        navigation.navigate("CreateAccount")
    }
    const onBackIconPress = () => {
        navigation.goBack()
    }

    const onCreateTargetPress = () => {
        navigation.navigate("CreateTarget")
    }
    const onSavingsPress = () => {
        navigation.navigate("Savings")
    }
    return (
        <SmartFi
            // onContinuePress={onContinuePress}
            isBlackTheme={isBlackTheme}
            onBackIconPress={onBackIconPress}
            onCreateTargetPress={onCreateTargetPress}
            onSavingsPress={onSavingsPress}
        />
    )
}

export default SmartFiScreen

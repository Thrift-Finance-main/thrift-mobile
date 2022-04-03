import React from 'react'
import { useSelector } from 'react-redux';
import CreateToken from '../components/CreateToken'

const CreateTokenScreen = ({ navigation, route }) => {
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

    return (
        <CreateToken
            // onContinuePress={onContinuePress}
            onBackIconPress={onBackIconPress}
            isBlackTheme={isBlackTheme}
            address={route.params}
        // fromScreen={fromScreen}
        />
    )
}

export default CreateTokenScreen

import React, {useMemo} from 'react'
import { useSelector } from 'react-redux';
import CreateAccount from '../components/CreateAccount';
import {useQuery} from "../db/models/Project";

const CreateAccountScreen = ({ navigation, route }) => {
    const isBlackTheme = useSelector((state) => state.Reducers.isBlackTheme);

    console.log('route.params')
    console.log(route.params)
    const { fromScreen, data} = route.params;

    const onContinuePress = (payload: any) => {
        console.log('payload');
        console.log(payload);
        navigation.navigate(fromScreen == "CreateAccount" ? "Terms" : "RestoreWallet", payload)
    }
    const onBackIconPress = () => {
        navigation.goBack()
    }

    return (
        <CreateAccount
            onContinuePress={(payload) => onContinuePress(payload)}
            onBackIconPress={onBackIconPress}
            fromScreen={fromScreen}
            isBlackTheme={isBlackTheme}
            data={data}
        />
    )
}

export default CreateAccountScreen

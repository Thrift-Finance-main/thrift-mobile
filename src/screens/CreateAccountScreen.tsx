import React, {useMemo} from 'react'
import { useSelector } from 'react-redux';
import CreateAccount from '../components/CreateAccount';
import {useQuery} from "../db/models/Project";

const CreateAccountScreen = ({ navigation, route }) => {
    const isBlackTheme = useSelector((state) => state.Reducers.isBlackTheme);

    const { fromScreen, data} = route.params;

    const onContinuePress = (payload: any) => {
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

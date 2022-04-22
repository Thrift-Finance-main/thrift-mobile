import React, { useState } from 'react'
import {useDispatch, useSelector} from 'react-redux';
import RestoreWallet from '../components/RestoreWallet'
import {createAccount} from "../lib/account";
import {apiDb} from "../db/LiteDb";
import {Alert} from "react-native";
import {setCurrentAccount} from "../store/Action";

const RestoreWalletScreen = ({ navigation, route }) => {
    const isBlackTheme = useSelector((state) => state.Reducers.isBlackTheme);
    const dispatch = useDispatch();

    const [visible, setVisible] = useState<boolean>(false);
    const [seed, setSeed] = useState<string>('');

    const hideModal = () => {
        setVisible(false);
        const payload = {
            fromScreen: 'RestoreWallet'
        };
        // Check if pincode in config
        apiDb.getCurrentConfig().then(config => {
            if (!config || !config.pinhash.length){
                navigation.navigate("CreatePin", payload);
            } else {
                navigation.navigate("DashboardTab");
            }
        });

    }
    const onRestoreWalletPress = () => {

        createAccount(seed, route.params.name,route.params.passwd).then(createdAccount => {
            apiDb.addAccount(createdAccount).then(r => {
                if (r && r.error){
                    // Alert.alert("Error:", r.error);
                } else {
                    apiDb.setCurrentAccount(createdAccount.accountName).then(r => {
                        dispatch(setCurrentAccount(createdAccount));
                        setVisible(true);
                    });
                }
            });
        });


    }
    const onBackIconPress = () => {
        navigation.goBack()
    }

    const handleSeed = (seed:string) => {
        setSeed(seed);
    }

    return (
        <RestoreWallet
            onRestoreWalletPress={onRestoreWalletPress}
            onBackIconPress={onBackIconPress}
            visible={visible}
            hideModal={hideModal}
            isBlackTheme={isBlackTheme}
            handleSeed={(seed:string) => handleSeed(seed)}
        />
    )
}

export default RestoreWalletScreen

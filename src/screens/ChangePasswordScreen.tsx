import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import ChangePassword from '../components/ChangePassword'
import {decryptData, encryptData} from "../lib/cryptoLib";
import {Alert} from "react-native";
import {apiDb} from "../db/LocalDb";

const ChangePasswordScreen = ({ navigation }) => {
    const isBlackTheme = useSelector((state) => state.Reducers.isBlackTheme);
    const currentAccount = useSelector((state) => state.Reducers.currentAccount);

    const [visible, setVisible] = useState<boolean>(false);
    const [oldPassword, setOldPassword] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const onContinuePress = () => {

        // Change password
        // Check old pass
        const encryptedPublicKeyHex = currentAccount.encryptedPublicKeyHex;
        const publicKeyHex = currentAccount.publicKeyHex;

        console.log('publicKeyHex');
        console.log(publicKeyHex);
        console.log('encryptedPublicKeyHex');
        console.log(encryptedPublicKeyHex);
        try {
            decryptData(encryptedPublicKeyHex, oldPassword).then(decryptedPublicKey => {
                console.log('decryptedPublicKey');
                console.log(decryptedPublicKey);
                if (decryptedPublicKey === publicKeyHex){
                    // Old password correct
                    console.log("Old password is correct");
                    const encryptedMasterKey = currentAccount.encryptedMasterKey;
                    decryptData(encryptedMasterKey, oldPassword).then(decryptedMasterKey => {
                        console.log('decryptedMasterKey');
                        console.log(decryptedMasterKey);
                        encryptData(decryptedMasterKey,password).then(newEncryptedMasterKey => {
                            console.log('newEncryptedMasterKey');
                            console.log(newEncryptedMasterKey);
                            encryptData(publicKeyHex,password).then(newEncryptedPublicKeyHex => {
                                console.log('newEncryptedPublicKeyHex');
                                console.log(newEncryptedPublicKeyHex);
                                apiDb.getAccount(currentAccount.accountName).then(account => {
                                    console.log('account');
                                    console.log(account);
                                   let updatedAccount = account;
                                    updatedAccount.encryptedMasterKey = newEncryptedMasterKey;
                                    updatedAccount.encryptedPublicKeyHex = newEncryptedPublicKeyHex;
                                    console.log('updatedAccount');
                                    console.log(updatedAccount);
                                    apiDb.updateAccount(updatedAccount).then(r => {
                                        // navigation.goBack()
                                        setVisible(true)
                                    });
                                });
                            });
                        });
                    });

                } else {
                    Alert.alert("Wrong old password");
                }
            });
        } catch (e) {
            Alert.alert("Error on encrypt: "+e);
        }

        // setVisible(true);

    }
    const onBackIconPress = () => {
        navigation.goBack()
    }

    const hideModal = () => {
        setVisible(false)
        navigation.goBack()

    }
    return (
        <ChangePassword
            onChangeOldPassword={(text => setOldPassword(text))}
            onChangePassword={(text => setPassword(text))}
            onChangeConfirmPassword={(text => setConfirmPassword(text))}
            onContinuePress={onContinuePress}
            onBackIconPress={onBackIconPress}
            visible={visible}
            hideModal={hideModal}
            isBlackTheme={isBlackTheme}
            valid={(password !== '' && confirmPassword === password) && oldPassword.length}
        />
    )
}

export default ChangePasswordScreen

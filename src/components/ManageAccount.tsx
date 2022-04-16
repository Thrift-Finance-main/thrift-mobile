import React, {FC, useEffect, useMemo, useRef, useState} from 'react'
import {View, Text, StyleSheet, Image, ScrollView, TouchableOpacity} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '../../src/constants/CustomColors';
import { heightPercentageToDP, widthPercentageToDP } from '../utils/dimensions'
import Button from './Common/Button'
import Back from '../../src/assets/back.svg';
import DarkBack from '../../src/assets/DarkBack.svg';
import Key from "../assets/Key.svg";
import User from "../assets/user.svg";
import RemoveIcon from "../assets/remove.svg";
import {useDispatch, useSelector} from "react-redux";
import {apiDb} from "../db/LiteDb";
import {addressSlice} from "../utils";
import {setCurrentAccount} from "../store/Action";
import CustomModal from "./PopUps/CustomModal";

interface CreateAccountProps {
    onBackIconPress: () => void
    onContinuePress: () => void
    onCreateAccountPress: () => void
    onRestoreAccountPress: () => void
    fromScreen: any
    isBlackTheme: boolean
    navigation: any
}
const ManageAccount: FC<CreateAccountProps> = (props) => {
    const dispatch = useDispatch();
    const [accounts, setAccounts] = useState([]);
    const [removeModal, setRemoveModal] = useState(false);
    const [accountToRemove, setAccountToRemove] = useState('');
    const currentAccount = useSelector(state => state.Reducers.currentAccount);
    const [currentAccountName, setCurrentAccountName] = useState(currentAccount.accountName);

    const useIsMounted = () => {
        const isMounted = useRef(false);
        // @ts-ignore
        useEffect(() => {
            isMounted.current = true;
            return () => (isMounted.current = false);
        }, []);
        return isMounted;
    };

    const isMounted = useIsMounted();


    useEffect(() =>{
        const getAccounts = async () => {
            console.log('getAccounts in ManageAccount')
            const accs = await apiDb.getAllAccounts();
            setAccounts(accs);
        }

        if (isMounted.current) {
            // call the function
            getAccounts()
                // make sure to catch any error
                .catch(console.error);
        }
    }, []);

    const onSelectAccount = (account:IAccount) => {
        apiDb.setCurrentAccount(account.accountName).then(r => {
            dispatch(setCurrentAccount(account));
            setCurrentAccountName(account.accountName);
        });
    }

    const hideModal1 = () => {
        apiDb.removeAccount(accountToRemove).then(accountName => {
            apiDb.getAllAccounts().then(allAccs =>{
                if (allAccs.length === 0){
                    apiDb.removeDb().then(r =>{
                        props.navigation.navigate("Language");
                    });
                }
                else if (allAccs.length && currentAccount.accountName === accountToRemove){
                    const firstAccountArray = allAccs[0];
                    const firstAccount = firstAccountArray[1];
                    const acc = JSON.parse(firstAccount);
                    apiDb.setCurrentAccount(acc.accountName).then(r => {
                        dispatch(setCurrentAccount(acc));
                        setCurrentAccountName(acc.accountName);
                    });
                }
                setAccounts(allAccs);
                setRemoveModal(false);
            });
        });
    }
    const onRemoveAccount = (accountName) => {
        setAccountToRemove(accountName);
        setRemoveModal(true);
    }

    return (
        <SafeAreaView
            style={{
                ...styles.mainContainer,
                backgroundColor: props.isBlackTheme
                    ? Colors.blackTheme
                    : Colors.inputFieldBackground,
            }}>
            <ScrollView>
                <View style={styles.secondaryContainer}>
                    {props.isBlackTheme ? (
                        <DarkBack
                            style={{marginTop: heightPercentageToDP(3)}}
                            onPress={props.onBackIconPress}
                        />
                    ) : (
                        <Back
                            style={{marginTop: heightPercentageToDP(3)}}
                            onPress={props.onBackIconPress}
                        />
                    )}
                    <View
                        style={{
                            paddingVertical: heightPercentageToDP(2),
                            marginTop: heightPercentageToDP(2),
                        }}>

                    </View>
                    {
                        accounts.map((acc, index) => {
                            const account = JSON.parse(acc[1]);
                            return <TouchableOpacity
                                        onPress={() => onSelectAccount(account)}
                                        onLongPress={() => onRemoveAccount(account.accountName)}
                                        style={{...styles.accountsContainer }} key={index}>
                                            <View style={{
                                                padding: 10,
                                                borderRadius: 10,
                                                flex:1,
                                                flexDirection: 'row',
                                                backgroundColor:
                                                    account.accountName === currentAccountName ?
                                                        '#eaeaea' :
                                                        (props.isBlackTheme
                                                            ? Colors.blackTheme
                                                            : Colors.inputFieldBackground)}}>
                                                <Key />
                                                <Text style={styles.termsText}>
                                                    {account.accountName}
                                                </Text>
                                                <Text style={styles.termsText}>
                                                    {addressSlice(account.publicKeyHex, 10)}
                                                </Text>
                                            </View>
                                    </TouchableOpacity>
                        })
                    }

                    <View style={{height: heightPercentageToDP(2)}} />
                    <View
                        style={{
                            paddingVertical: heightPercentageToDP(14),
                            paddingHorizontal: heightPercentageToDP(4),
                            marginTop: heightPercentageToDP(2),
                            bottom: 0
                        }}>
                        <Button
                            backgroundColor={Colors.primaryButton}
                            buttonTitle='Create Account'
                            onPress={props.onCreateAccountPress}
                            titleTextColor={props.isBlackTheme ? Colors.black : Colors.white}

                        />
                        <View
                            style={{ height: heightPercentageToDP(2) }}
                        />
                        <Button
                            backgroundColor={Colors.primaryButtonColor2}
                            buttonTitle='Restore Account'
                            onPress={props.onRestoreAccountPress}

                        />
                    </View>

                </View>
            </ScrollView>
            <CustomModal
                isBlackTheme={props.isBlackTheme}
                visible={removeModal}
                hideModal={hideModal1}
                modalText='Remove account'
            />
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        width: '100%',
    },
    secondaryContainer: {
        paddingHorizontal: widthPercentageToDP(6),
    },
    imageStyle: {
        width: widthPercentageToDP(100),
        height: heightPercentageToDP(10),
        alignSelf: 'center',
    },
    accountsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: widthPercentageToDP(3),
        paddingVertical: widthPercentageToDP(5),
    },
    termsText: {
        color: Colors.hintsColor,
        fontSize: 14,
        paddingHorizontal: widthPercentageToDP(4),
        lineHeight: 20,
    },
    buttonStyle: {
        width: widthPercentageToDP(80),
        height: heightPercentageToDP(8),
        borderRadius: 9,
        justifyContent: "center",
        alignSelf: "center",
        marginTop: 20
    },
    buttonTitleStyle: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 12
    }
});
export default ManageAccount;

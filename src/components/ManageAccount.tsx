import React, {FC, useEffect, useMemo, useState} from 'react'
import {View, Text, StyleSheet, Image, ScrollView, TouchableOpacity} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '../../src/constants/CustomColors';
import { heightPercentageToDP, widthPercentageToDP } from '../utils/dimensions'
import Button from './Common/Button'
import Back from '../../src/assets/back.svg';
import DarkBack from '../../src/assets/DarkBack.svg';
import Key from "../assets/Key.svg";
import User from "../assets/user.svg";
import Caution from "../assets/Caution.svg";
import {useDispatch, useSelector} from "react-redux";
import {apiDb} from "../db/LocalDb";
import {addressSlice} from "../utils";
import {setCurrentAccount} from "../store/Action";

interface CreateAccountProps {
    onBackIconPress: () => void
    onCreateAccountPress: () => void
    onRestoreAccountPress: () => void
    fromScreen: any
    isBlackTheme: boolean
}
const ManageAccount: FC<CreateAccountProps> = (props) => {
    const dispatch = useDispatch();
    const [accounts, setAccounts] = useState([]);
    const currentAccount = useSelector(state => state.Reducers.currentAccount);
    const [currentPublicHex, setCurrentPublicHex] = useState(currentAccount.publicKeyHex);


    useEffect(() =>{
        apiDb.getAllAccounts().then(allAccs =>{
            setAccounts(allAccs);
        })
    }, []);

    const onSelectAccount = (account:IAccount) => {
        apiDb.setCurrentAccount(account.accountName).then(r => {
            dispatch(setCurrentAccount(account));
            setCurrentPublicHex(account.publicKeyHex);
        });
    }

    console.log('ManageAccount');
    console.log(currentAccount);
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
                                        style={{...styles.accountsContainer }} key={index}>
                                            <View style={{
                                                padding: 10,
                                                borderRadius: 10,
                                                flex:1,
                                                flexDirection: 'row',
                                                backgroundColor:
                                                    account.publicKeyHex === currentPublicHex ?
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

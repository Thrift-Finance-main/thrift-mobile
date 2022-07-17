import React, {FC, useEffect, useMemo, useRef, useState} from 'react'
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '../../src/constants/CustomColors';
import { heightPercentageToDP, widthPercentageToDP } from '../utils/dimensions'
import Button from './Common/Button'
import Back from '../../src/assets/back.svg';
import DarkBack from '../../src/assets/DarkBack.svg';

import InputField from './Common/InputField';
import {translate} from "../i18n";

interface CreateAccountProps {
    onContinuePress: (p: { passwd: string; name: string }) => void
    onBackIconPress: () => void
    fromScreen: any
    isBlackTheme: any
}
const CreateAccount: FC<CreateAccountProps> = (props) => {
    const [name, setName] = useState('');
    const [passwd, setPasswd] = useState('');
    const [confirmPasswd, setConfirmPassd] = useState('');

    console.log('name');
    console.log(name);

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

        const execMethod = async () => {

        }

        if (isMounted.current) {
            // call the function
            execMethod()
                // make sure to catch any error
                .catch(console.error);
        }

    }, []);


    return (
        <SafeAreaView style={{
            ...styles.mainContainer, backgroundColor:
                props.isBlackTheme ? Colors.blackTheme :
                    Colors.white,
        }}>
            <ScrollView>
                <View style={styles.secondaryContainer}>
                    {
                        props.isBlackTheme ?
                            <DarkBack
                                style={{ marginTop: heightPercentageToDP(3) }}
                                onPress={props.onBackIconPress}
                            />
                            : <Back
                                style={{ marginTop: heightPercentageToDP(3) }}
                                onPress={props.onBackIconPress}
                            />
                    }

                    <Text
                        style={{
                            ...styles.topTitle, color:
                                props.isBlackTheme ? Colors.white :
                                    Colors.black,
                        }}
                    >{translate("CreateAccount.CreateAccount")}</Text>
                    <Text
                        style={{
                            ...styles.filedHeader, color:

                                props.isBlackTheme ? Colors.white :
                                    Colors.black,
                        }}
                    >{translate("CreateAccount.Name")}</Text>
                    <InputField
                        onChangeText={(n:string) => setName(n || '')}
                        backgroundColor={props.isBlackTheme ? Colors.darkInput : Colors.inputFieldBackground}
                        placeholderTextColor={props.isBlackTheme ? Colors.white : Colors.black}
                        placeHolder={translate("CreateAccount.Name")}
                    />
                    <Text
                        style={{
                            ...styles.filedHeader, color:

                                props.isBlackTheme ? Colors.white :
                                    Colors.black,
                        }}
                    >{translate("CreateAccount.CreatePassword")}</Text>

                    <InputField
                        secureText={true}
                        backgroundColor={props.isBlackTheme ? Colors.darkInput : Colors.inputFieldBackground}
                        placeholderTextColor={props.isBlackTheme ? Colors.white : Colors.black}
                        onChangeText={(p:string) => setPasswd(p)}
                        placeHolder={translate("Common.Password")}/>
                    <Text
                        style={styles.hintStyle}
                    >{translate("ChangeSpendingPassword.Requirements")}</Text>
                    <Text
                        style={{
                            ...styles.filedHeader, color:

                                props.isBlackTheme ? Colors.white :
                                    Colors.black,
                        }}
                    >{translate("CreateAccount.ConfirmPassword")}</Text>
                    <InputField
                        secureText={true}
                        backgroundColor={props.isBlackTheme ? Colors.darkInput : Colors.inputFieldBackground}
                        placeholderTextColor={props.isBlackTheme ? Colors.white : Colors.black}
                        onChangeText={(p:string) => setConfirmPassd(p)}
                        placeHolder={translate("Common.PasswordAgain")}/>
                    <Text
                        style={styles.hintStyle}
                    >{translate("ChangeSpendingPassword.Requirements")}</Text>
                    <View
                        style={{ height: heightPercentageToDP(5) }}
                    />
                    <Button
                        disabled={passwd !== confirmPasswd && passwd !== ''}
                        backgroundColor={"#603EDA"}
                        buttonTitle={translate("Common.Continue")}
                        titleTextColor={props.isBlackTheme ? Colors.black : Colors.white}
                        onPress={() => props.onContinuePress({name, passwd})}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        width: "100%"
    },
    imageStyle: {
        width: widthPercentageToDP(100),
        height: heightPercentageToDP(30),
        alignSelf: "center"
    },
    secondaryContainer: {
        paddingHorizontal: widthPercentageToDP(6)
    },
    topTitle: {
        fontSize: 18,
        fontFamily: 'AvenirNextCyr-Demi',
        marginTop: heightPercentageToDP(5),
        letterSpacing: 1,
        paddingHorizontal: widthPercentageToDP(2.5)
    },
    filedHeader: {
        fontSize: 14,
        marginTop: heightPercentageToDP(2.5),
        letterSpacing: 1,
        paddingHorizontal: widthPercentageToDP(2.5),
        paddingVertical: heightPercentageToDP(2.5),
        fontFamily: 'AvenirNextCyr-Demi',
    },
    hintStyle: {
        color: Colors.hintsColor,
        fontSize: 10,
        paddingHorizontal: widthPercentageToDP(2),
        marginTop: heightPercentageToDP(2),
        fontFamily: 'AvenirNextCyr-Medium',
    }

})
export default CreateAccount;

import React, {FC, useState} from 'react'
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { heightPercentageToDP, widthPercentageToDP } from '../utils/dimensions'
import CustomColors from '../constants/CustomColors';
import Back from '../assets/back.svg'
import DarkBack from '../assets//DarkBack.svg'

import InputField from './Common/InputField'
import {Colors, TextField } from 'react-native-ui-lib'
import {Button} from "react-native-ui-lib/core";
interface CreateAccountProps {
    onContinuePress: (data:any) => void
    onBackIconPress: () => void
    fromScreen: any
    data: any
    isBlackTheme: any
}
const CreateAccount: FC<CreateAccountProps> = (props) => {
    console.log('CreateAccount props');
    console.log(props);
    const [name, setName] = useState('');
    const [paswd, setPasswd] = useState('');
    const [confirmPasswd, setConfirmPassd] = useState('');
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
                    >Create Account</Text>
                    <Text
                        style={{
                            ...styles.filedHeader, color:

                                props.isBlackTheme ? Colors.white :
                                    Colors.black,
                        }}
                    >Name</Text>
                    <TextField
                        placeholder={'Name'}
                        floatingPlaceholder
                        onChangeText={(n:string) => setName(n)}
                        maxLength={20}
                        fieldStyle={styles.inputField}
                        color={props.isBlackTheme ? Colors.white :
                            Colors.black}
                        floatingPlaceholderColor={{
                            focus: '#3656EB',
                            default: 'grey'
                        }}
                        containerStyle={styles.inputFieldContainer}
                        migrate
                    />
                    <Text
                        style={{
                            ...styles.filedHeader, color:

                                props.isBlackTheme ? Colors.white :
                                    Colors.black,
                        }}
                    >Create Password</Text>
                    <TextField
                        placeholder={'Password'}
                        floatingPlaceholder
                        onChangeText={(p:string) => setPasswd(p)}
                        maxLength={20}
                        fieldStyle={styles.inputField}
                        color={props.isBlackTheme ? Colors.white :
                            Colors.black}
                        floatingPlaceholderColor={{
                            focus: '#3656EB',
                            default: 'grey'
                        }}
                        containerStyle={styles.inputFieldContainer}
                        labelColor={{default: 'green',focus: 'black'}}
                        migrate
                    />
                    <Text
                        style={styles.hintStyle}
                    >Password should containt a number and alphabet</Text>
                    <Text
                        style={{
                            ...styles.filedHeader, color:

                                props.isBlackTheme ? Colors.white :
                                    Colors.black,
                        }}
                    >Confirm Password</Text>
                    <TextField
                        placeholder={'Enter password again'}
                        floatingPlaceholder
                        onChangeText={(p:string) => setConfirmPassd(p)}
                        maxLength={20}
                        fieldStyle={styles.inputField}
                        color={props.isBlackTheme ? Colors.white :
                            Colors.black}
                        floatingPlaceholderColor={{
                            focus: '#3656EB',
                            default: 'grey'
                        }}
                        containerStyle={styles.inputFieldContainer}
                        labelColor={{default: 'green',focus: 'black'}}
                        migrate
                    />
                    <View
                        style={{ height: heightPercentageToDP(2) }}
                    />
                    <Button
                        label="Continue"
                        borderRadius={5}
                        size={Button.sizes.large}
                        text60
                        labelStyle={{fontWeight: '800', letterSpacing: 4}}
                        style={{marginBottom: 1, marginTop: 25}}
                        backgroundColor={CustomColors.primaryButton}
                        disabled={false}
                        enableShadow
                        animateLayout
                        onPress={() => props.onContinuePress({name, paswd})}
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
        fontWeight: "bold",
        marginTop: heightPercentageToDP(5),
        letterSpacing: 1,
        paddingHorizontal: widthPercentageToDP(2.5)
    },
    filedHeader: {
        fontSize: 20,
        marginTop: heightPercentageToDP(2.5),
        letterSpacing: 1,
        paddingHorizontal: widthPercentageToDP(1.25),
        paddingVertical: heightPercentageToDP(2.5),
        fontWeight: "bold"
    },
    hintStyle: {
        color: Colors.blue1,
        fontSize: 10,
        paddingHorizontal: widthPercentageToDP(2),
        marginTop: heightPercentageToDP(2)
    },
    inputField: {
        borderColor: 'black',
        borderBottomWidth: 1,
        paddingBottom: 4,
    },
    inputFieldContainer: {
        paddingLeft: 5,
        paddingRight: 5,
    }

})
export default CreateAccount;

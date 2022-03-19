import React, { FC } from 'react'
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '../constants/Colors'
import { heightPercentageToDP, widthPercentageToDP } from '../utils/dimensions'
import Button from './Common/Button'
import Back from '../assets/back.svg'
import DarkBack from '../assets//DarkBack.svg'

import InputField from './Common/InputField'
import { TextField } from 'react-native-ui-lib'
interface CreateAccountProps {
    onContinuePress: () => void
    onBackIconPress: () => void
    fromScreen: any
    isBlackTheme: any
}
const CreateAccount: FC<CreateAccountProps> = (props) => {
    console.log('CreateAccount props');
    console.log(props);
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
                    <InputField
                        backgroundColor={props.isBlackTheme ? Colors.darkInput : Colors.inputFieldBackground}
                     placeHolder={'Name'} placeholderTextColor={''} secureText={false}/>
                    <Text
                        style={{
                            ...styles.filedHeader, color:

                                props.isBlackTheme ? Colors.white :
                                    Colors.black,
                        }}
                    >Create Password</Text>
                    <TextField
                        placeholder={'Placeholder'}
                        floatingPlaceholder
                        onChangeText={() => console.log('changed')}
                        enableErrors
                        validate={['required', 'email', (value) => value.length > 6]}
                        validationMessage={['Field is required', 'Email is invalid', 'Password is too short']}
                        showCharCounter
                        maxLength={20}
                        color={props.isBlackTheme ? Colors.white :
                            Colors.black}
                    />

                    <InputField
                        secureText={true}
                        placeholderTextColor={''}
                        placeHolder={'Password'}
                        backgroundColor={props.isBlackTheme ? Colors.darkInput : Colors.inputFieldBackground}

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
                    <InputField
                        secureText={true}
                        placeholderTextColor={''}
                        placeHolder={'Confirm password'}
                        backgroundColor={props.isBlackTheme ? Colors.darkInput : Colors.inputFieldBackground}

                    />
                    <Text
                        style={styles.hintStyle}
                    >Password should containt a number and alphabet</Text>
                    <View
                        style={{ height: heightPercentageToDP(5) }}
                    />
                    <Button
                        backgroundColor={Colors.primaryButton}
                        buttonTitle={props.fromScreen == "CreateAccount" ? "Continue" : "Now Set"}
                        onPress={props.onContinuePress}
                        titleTextColor={props.isBlackTheme ? Colors.black : Colors.white}
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
        fontSize: 14,
        marginTop: heightPercentageToDP(2.5),
        letterSpacing: 1,
        paddingHorizontal: widthPercentageToDP(2.5),
        paddingVertical: heightPercentageToDP(2.5),
        fontWeight: "bold"
    },
    hintStyle: {
        color: Colors.hintsColor,
        fontSize: 10,
        paddingHorizontal: widthPercentageToDP(2),
        marginTop: heightPercentageToDP(2)
    }

})
export default CreateAccount;

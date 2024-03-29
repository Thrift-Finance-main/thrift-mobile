import React, { FC } from 'react'
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import OTPTextView from 'react-native-otp-textinput'
import Colors from '../constants/CustomColors'
import { heightPercentageToDP, widthPercentageToDP } from '../utils/dimensions'
import Back from '../assets/back.svg'
import DarkBack from '../assets//DarkBack.svg'
import CustomModal from './PopUps/CustomModal'
import CustomColors from "../constants/CustomColors";
import { Button } from 'react-native-ui-lib'
import {translate} from "../i18n";

interface CreatePinProps {
    onConfirmPress: () => void,
    onBackIconPress: () => void,
    setPincode: (pincode:string) => void,
    setOldPincode?: (oldPincode:string) => void,
    setConfirmedPincode: (confirmedPincode:string) => void,
    pincode: string,
    confirmedPincode: string,
    visible: boolean,
    hideModal: () => void,
    isBlackTheme: any,
    validate: boolean,
    oldpin?: string,
    title: string
}
const CreatePin: FC<CreatePinProps> = (props) => {
    return <SafeAreaView style={{
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
                >{translate("CreatePin.CreatePin")}</Text>
                {
                    props.oldpin ? <>
                        <Text
                            style={{
                                ...styles.filedHeader, color:
                                    props.isBlackTheme ? Colors.white :
                                        Colors.black,
                            }}
                        >{translate("CreatePin.ConfirmCurrentPin")}</Text>
                        <View
                            style={{ paddingHorizontal: widthPercentageToDP(2.5) }}
                        >
                            <OTPTextView
                                autoFocusOnLoad={true}
                                autoFocus={true}
                                handleTextChange={(e) => props.setOldPincode(e)}
                                textInputStyle={{
                                    ...styles.roundedTextInput, backgroundColor: props.isBlackTheme ? Colors.darkInput :
                                        Colors.otpBackground,
                                    color: props.isBlackTheme ? Colors.white : Colors.black
                                }}
                                inputCount={4}
                                tintColor={"transparent"}
                                offTintColor={"transparent"}
                                secureTextEntry={true}

                            />
                        </View>
                    </> : null
                }
                <Text
                    style={{
                        ...styles.filedHeader, color:
                            props.isBlackTheme ? Colors.white :
                                Colors.black,
                    }}
                >{translate("CreatePin.CreatePin")}</Text>
                <View
                    style={{ paddingHorizontal: widthPercentageToDP(2.5) }}
                >
                    <OTPTextView
                        autoFocusOnLoad={true}
                        autoFocus={true}
                        handleTextChange={(e) => props.setPincode(e)}
                        textInputStyle={{
                            ...styles.roundedTextInput, backgroundColor: props.isBlackTheme ? Colors.darkInput :
                                Colors.otpBackground,
                                color: props.isBlackTheme ? Colors.white : Colors.black
                        }}
                        inputCount={4}
                        tintColor={"transparent"}
                        offTintColor={"transparent"}
                        secureTextEntry={true}

                    />
                </View>
                <Text
                    style={styles.hintStyle}
                >{translate("CreatePin.Requirements")}</Text>
                <Text
                    style={{
                        ...styles.filedHeader, color:
                            props.isBlackTheme ? Colors.white :
                                Colors.black,
                    }}
                >{translate("CreatePin.ConfirmPin")}</Text>
                <View
                    style={{ paddingHorizontal: widthPercentageToDP(2.5) }}
                >
                    <OTPTextView
                        autoFocusOnLoad={true}

                        handleTextChange={(e) => props.setConfirmedPincode(e)}
                        textInputStyle={{
                            ...styles.roundedTextInput, backgroundColor: props.isBlackTheme ? Colors.darkInput :
                                Colors.otpBackground,
                                color: props.isBlackTheme ? Colors.white : Colors.black
                        }}
                        inputCount={4}
                        tintColor={"transparent"}
                        offTintColor={"transparent"}
                        secureTextEntry={true}

                    />
                </View>
                <Text
                    style={styles.hintStyle}
                >{translate("CreatePin.Requirements")}</Text>


                <View
                    style={{ height: heightPercentageToDP(14) }}
                />

                <Button
                    label={translate("Common.Confirm")}
                    borderRadius={5}
                    size={Button.sizes.large}
                    color={props.isBlackTheme ? Colors.black : Colors.white}
                    text60
                    labelStyle={{fontSize: 14, fontWeight: 'bold', letterSpacing: 2, textAlign: "center"}}
                    style={styles.buttonStyle}
                    backgroundColor="#603EDA"
                    disabled={!props.validate}
                    enableShadow
                    animateLayout
                    onPress={props.onConfirmPress}
                />
                <View
                    style={{ height: heightPercentageToDP(4) }}
                />
            </View>
        </ScrollView>
        <CustomModal
            isBlackTheme={props.isBlackTheme}
            visible={props.visible}
            hideModal={props.hideModal}
            modalText={props.oldpin ? translate("CreatePin.Updated") : translate("CreatePin.Successful")}
            buttonTitle={"Continue"}
        />
    </SafeAreaView>
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        width: "100%"
    },
    buttonStyle: {
        width: widthPercentageToDP(80),
        height: heightPercentageToDP(8),
        borderRadius: 9,
        justifyContent: "center",
        alignSelf: "center"
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
        paddingHorizontal: widthPercentageToDP(4)
    },
    filedHeader: {
        fontSize: 14,
        marginTop: heightPercentageToDP(2.5),
        letterSpacing: 1,
        paddingHorizontal: widthPercentageToDP(4),
        paddingVertical: heightPercentageToDP(2.5),
        fontFamily: 'AvenirNextCyr-Demi',
    },
    hintStyle: {
        color: Colors.hintsColor,
        fontSize: 10,
        paddingHorizontal: widthPercentageToDP(4),
        marginTop: heightPercentageToDP(1),
        fontFamily: 'AvenirNextCyr-Medium',
    },
    roundedTextInput: {
        borderRadius: 8,
        borderWidth: 2,
        borderBottomWidth: 2,
        // borderColor: "#EBEBEB",
        width: widthPercentageToDP(15),
        height: heightPercentageToDP(8),

    },
})
export default CreatePin;

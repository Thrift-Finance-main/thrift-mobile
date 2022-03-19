import React, { FC } from 'react'
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import OTPTextView from 'react-native-otp-textinput'
import Colors from '../constants/CustomColors'
import { heightPercentageToDP, widthPercentageToDP } from '../utils/dimensions'
import Button from './Common/Button'
import Back from '../assets/back.svg'
import DarkBack from '../assets//DarkBack.svg'
import CustomModal from './PopUps/CustomModal'
interface CreatePinProps {
    onConfirmPress: () => void
    onBackIconPress: () => void
    visible: boolean,
    hideModal: () => void,
    isBlackTheme: any
}
const CreatePin: FC<CreatePinProps> = (props) => {
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
                    >Create Pin</Text>
                    <Text
                        style={{
                            ...styles.filedHeader, color:
                                props.isBlackTheme ? Colors.white :
                                    Colors.black,
                        }}
                    >Create Pin</Text>
                    <View
                        style={{ paddingHorizontal: widthPercentageToDP(2.5) }}
                    >
                        <OTPTextView
                            autoFocusOnLoad={true}
                            autoFocus={true}
                            handleTextChange={(e) => {
                                console.log(e)
                            }}
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
                    >Four number pin</Text>
                    <Text
                        style={{
                            ...styles.filedHeader, color:
                                props.isBlackTheme ? Colors.white :
                                    Colors.black,
                        }}
                    >Confirm Pin</Text>
                    <View
                        style={{ paddingHorizontal: widthPercentageToDP(2.5) }}
                    >
                        <OTPTextView
                            autoFocusOnLoad={true}

                            handleTextChange={(e) => {
                                console.log(e)
                            }}
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
                    >Four number pin</Text>


                    <View
                        style={{ height: heightPercentageToDP(14) }}
                    />
                    <Button
                        backgroundColor={Colors.primaryButton}
                        buttonTitle='Confirm'
                        onPress={props.onConfirmPress}
                        titleTextColor={props.isBlackTheme ? Colors.black : Colors.white}
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
                modalText='Pin created successfully'
            />
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
        paddingHorizontal: widthPercentageToDP(4)
    },
    filedHeader: {
        fontSize: 14,
        marginTop: heightPercentageToDP(2.5),
        letterSpacing: 1,
        paddingHorizontal: widthPercentageToDP(4),
        paddingVertical: heightPercentageToDP(2.5),
        fontWeight: "bold"
    },
    hintStyle: {
        color: Colors.hintsColor,
        fontSize: 10,
        paddingHorizontal: widthPercentageToDP(4),
        marginTop: heightPercentageToDP(1)
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

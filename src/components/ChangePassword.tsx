import React, { FC } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '../constants/CustomColors'
import { heightPercentageToDP, widthPercentageToDP } from '../utils/dimensions'
import Button from './Common/Button'
import OTPTextView from 'react-native-otp-textinput'
import InputField from './Common/InputField'
import CustomModal from './PopUps/CustomModal'
interface ChangePasswordProps {
    onContinuePress: () => void
    onBackIconPress: () => void
    visible: boolean,
    hideModal: () => void,
    isBlackTheme: any
}
const ChangePassword: FC<ChangePasswordProps> = (props) => {
    return (
        <SafeAreaView style={{
            ...styles.mainContainer, backgroundColor:
                props.isBlackTheme ? Colors.blackTheme :
                    Colors.white,
        }}>
            <ScrollView>
                <View style={styles.secondaryContainer}>

                    <Text
                        style={{
                            ...styles.topTitle, color: props.isBlackTheme ? Colors.white :
                                Colors.black,
                        }}
                    >Change Spending Password</Text>
                    <Text
                        style={{
                            ...styles.filedHeader, color:
                                props.isBlackTheme ? Colors.white :
                                    Colors.black,
                        }}
                    >Enter Pin</Text>
                    <View
                    // style={{ paddingHorizontal: widthPercentageToDP(2.5) }}
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
                            }} inputCount={4}
                            tintColor={"transparent"}
                            offTintColor={"transparent"}
                            secureTextEntry={true}

                        />
                    </View>
                    <Text
                        style={{
                            ...styles.filedHeader, color:
                                props.isBlackTheme ? Colors.white :
                                    Colors.black,
                        }}
                    >Old Password</Text>
                    <InputField
                        backgroundColor={props.isBlackTheme ? Colors.darkInput : Colors.inputFieldBackground}

                        secureText={true}
                    />
                    <Text
                        style={styles.hintStyle}
                    >Password should containt a number and alphabet</Text>
                    <Text
                        style={{
                            ...styles.filedHeader, color:
                                props.isBlackTheme ? Colors.white :
                                    Colors.black,
                        }}                    >New Password</Text>
                    <InputField
                        backgroundColor={props.isBlackTheme ? Colors.darkInput : Colors.inputFieldBackground}

                        secureText={true}
                    />
                    <Text
                        style={styles.hintStyle}
                    >Password should containt a number and alphabet</Text>
                    <Text
                        style={{
                            ...styles.filedHeader, color:
                                props.isBlackTheme ? Colors.white :
                                    Colors.black,
                        }}                    >Confirm New Password</Text>
                    <InputField
                        backgroundColor={props.isBlackTheme ? Colors.darkInput : Colors.inputFieldBackground}

                        secureText={true}
                    />
                    <View
                        style={{ height: heightPercentageToDP(5) }}
                    />
                    <Button
                        backgroundColor={Colors.primaryButton}
                        buttonTitle={"Set New Password"}
                        onPress={props.onContinuePress}
                        titleTextColor={props.isBlackTheme ? Colors.black : Colors.white}

                    />
                </View>
            </ScrollView>
            <CustomModal
                isBlackTheme={props.isBlackTheme}
                visible={props.visible}
                hideModal={props.hideModal}
                modalText='Password channged successfully'
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
        paddingHorizontal: widthPercentageToDP(2.5),
        textAlign: "center"
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
        paddingHorizontal: widthPercentageToDP(2),
        marginTop: heightPercentageToDP(2)
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
export default ChangePassword;

import React, { FC } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '../constants/CustomColors'
import { heightPercentageToDP, widthPercentageToDP } from '../utils/dimensions'
import { Button } from 'react-native-ui-lib';
import InputField from './Common/InputField'
import CustomModal from './PopUps/CustomModal'
import CustomColors from "../constants/CustomColors";
interface ChangePasswordProps {
    onContinuePress: () => void
    onBackIconPress: () => void
    onChangeOldPassword: (text:string) => void
    onChangePassword: (text:string) => void
    onChangeConfirmPassword: (text:string) => void
    visible: boolean,
    hideModal: () => void,
    isBlackTheme: any,
    valid: boolean
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
                                Colors.black, fontFamily: 'AvenirNextCyr-Medium',
                        }}
                    >Change Spending Password</Text>
                    <Text
                        style={{
                            ...styles.filedHeader, color:
                                props.isBlackTheme ? Colors.white :
                                    Colors.black,
                        }}
                    >Old Password</Text>
                    <InputField
                        backgroundColor={props.isBlackTheme ? Colors.darkInput : Colors.inputFieldBackground}
                        onChangeText={(text:string) => props.onChangeOldPassword(text)}
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
                        onChangeText={(text:string) => props.onChangePassword(text)}
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
                        onChangeText={(text) => props.onChangeConfirmPassword(text)}
                        secureText={true}
                    />
                    <View
                        style={{ height: heightPercentageToDP(5) }}
                    />

                    <Button
                        label="Set New Password"
                        borderRadius={5}
                        size={Button.sizes.large}
                        color={props.isBlackTheme ? Colors.black : Colors.white}
                        text60
                        labelStyle={{fontSize: 14, fontWeight: 'bold', letterSpacing: 2, textAlign: "center", fontFamily: 'AvenirNextCyr-Demi',}}
                        style={styles.buttonStyle}
                        backgroundColor={CustomColors.primaryButton}
                        disabled={!props.valid}
                        enableShadow
                        animateLayout
                        onPress={props.onContinuePress}
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
        fontFamily: 'AvenirNextCyr-Demi',
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
        fontFamily: 'AvenirNextCyr-Demi',
    },
    hintStyle: {
        color: Colors.hintsColor,
        fontSize: 10,
        fontFamily: 'AvenirNextCyr-Medium',
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
    buttonStyle: {
        width: widthPercentageToDP(80),
        height: heightPercentageToDP(8),
        borderRadius: 9,
        justifyContent: "center",
        alignSelf: "center"
    },

})
export default ChangePassword;

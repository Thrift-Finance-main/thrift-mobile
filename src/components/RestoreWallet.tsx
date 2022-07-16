import React, { FC } from 'react'
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '../constants/CustomColors'
import { heightPercentageToDP, widthPercentageToDP } from '../utils/dimensions'
import Button from './Common/Button'
import Back from '../assets/back.svg'
import Bulb from '../assets/Bulb.svg'
import CustomModal from './PopUps/CustomModal'
import DarkBack from '../assets//DarkBack.svg'

interface RestoreWalletProps {
    onRestoreWalletPress: () => void
    handleSeed: (seed:string) => void
    onBackIconPress: () => void
    visible: boolean,
    hideModal: () => void,
    isBlackTheme: any
}
const RestoreWallet: FC<RestoreWalletProps> = (props) => {
    return (
        <SafeAreaView style={{
            ...styles.mainContainer, backgroundColor:
                props.isBlackTheme ? Colors.blackTheme :
                    Colors.inputFieldBackground,
        }}>
            <ScrollView>
                <View style={styles.secondaryContainer}>
                    {
                        props.isBlackTheme ?
                            <DarkBack
                                style={{ marginTop: heightPercentageToDP(2.5) }}
                                onPress={props.onBackIconPress}
                            />
                            : <Back
                                style={{ marginTop: heightPercentageToDP(2.5) }}
                                onPress={props.onBackIconPress}
                            />
                    }
                    <View
                        style={styles.topContainer}
                    >
                        <Text
                            style={{
                                ...styles.topTitle, color:
                                    props.isBlackTheme ? Colors.white :
                                        Colors.black,
                            }}
                        >Restore Wallet</Text>
                        <Text
                            style={{
                                ...styles.filedHeader, color:
                                    props.isBlackTheme ? Colors.white :
                                        Colors.black,
                            }}
                        >To restore wallet, please provide the 15 or 24 words recovery phrase genereated when you created your wallet for the first time.</Text>
                    </View>
                    <View
                        style={{
                            ...styles.verifyContainer,
                            borderColor:
                                props.isBlackTheme ? "rgba(100, 125, 236, 0.19)" :

                                    "rgba(100, 125, 236, 0.1)",
                        }}
                    >

                        <TextInput
                            onChangeText={(text) => props.handleSeed(text.trim().replace(/ +(?= )/g,'').replace(/\n/g, " "))}
                            style={{...styles.VerifiedtagsContainer, color: props.isBlackTheme ? Colors.white : Colors.black}}
                            multiline={true}
                        />
                    </View>


                    <View
                        style={{ ...styles.accountsContainer, marginTop: heightPercentageToDP(12) }}
                    >
                        <Bulb />
                        <Text
                            style={styles.termsText}
                        >
                            It is advisable for you to backup or{"\n"}save your recovery phrase{"\n"}somewhere
                        </Text>
                    </View>
                    <View
                        style={{ height: heightPercentageToDP(4) }}
                    />
                    <Button
                        backgroundColor="#603EDA"
                        buttonTitle='Restore Wallet'
                        onPress={props.onRestoreWalletPress}
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
                buttonTitle={"Continue"}
                modalText='You have successfully restored your account'
            />
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        width: "100%"
    },
    secondaryContainer: {
        paddingHorizontal: widthPercentageToDP(6)
    },
    filedHeader: {
        fontSize: 12,
        letterSpacing: 0.7,
        lineHeight: 17,
        fontFamily: 'AvenirNextCyr-Medium',
        paddingVertical: heightPercentageToDP(2),
    },
    tagsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: heightPercentageToDP(3),
        flexWrap: 'wrap',
    },
    topContainer: {
        paddingHorizontal: widthPercentageToDP(2),
        borderRadius: 6,
        alignSelf: "center",
        marginTop: heightPercentageToDP(5)
    },
    accountsContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: widthPercentageToDP(3)
    },
    termsText: {
        color: Colors.hintsColor,
        fontSize: 14,
        paddingHorizontal: widthPercentageToDP(8),
        lineHeight: 20,
        fontFamily: 'AvenirNextCyr-Medium',
    },
    topTitle: {
        fontSize: 16,
        fontFamily: 'AvenirNextCyr-Demi',
        letterSpacing: 1,
    },
    verifyContainer: {
        paddingHorizontal: widthPercentageToDP(3),
        borderRadius: 6,
        width: "95%",
        alignSelf: "center",
        minHeight: heightPercentageToDP(22),
        borderColor: "rgba(100, 125, 236, 0.1)",
        borderWidth: 1.5
    },
    VerifiedtagsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
})
export default RestoreWallet;

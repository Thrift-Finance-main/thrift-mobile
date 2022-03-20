import React, { FC } from 'react'
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '../constants/CustomColors'
import { heightPercentageToDP, widthPercentageToDP } from '../utils/dimensions'
import Back from '../assets/back.svg'
import Bulb from '../assets/Bulb.svg'
import DarkBack from '../assets//DarkBack.svg'
import {shuffle} from "../utils";
import CustomColors from "../constants/CustomColors";
import { Button } from 'react-native-ui-lib'

interface VerifyPhraseProps {
    onContinuePress: () => void
    onBackIconPress: () => void
    onTapPhrasePress: (item: any) => void
    verifyPhrase: any
    verifiedPhrases: any
    isBlackTheme: any,
    validated: boolean
}
const VerifyPhrase: FC<VerifyPhraseProps> = (props) => {

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
                        >Confrim Keyphrase</Text>
                        <Text
                            style={{
                                ...styles.filedHeader, color:
                                    props.isBlackTheme ? Colors.white :
                                        Colors.black,
                            }}
                        >Please tap the correct order of the words to verify your recovery phrase</Text>
                    </View>
                    <View
                        style={{
                            ...styles.verifyContainer,
                            borderColor:
                                props.isBlackTheme ? "rgba(100, 125, 236, 0.19)" :

                                    "rgba(100, 125, 236, 0.1)",

                        }}
                    >

                        <View style={styles.VerifiedtagsContainer}>
                            {props.verifiedPhrases?.map((item: any, index: number) => {
                                return (
                                    <View key={index} style={styles.VerifiedbottomButtons}

                                    >
                                        <Text style={{
                                            ...styles.tagText, color:
                                                props.isBlackTheme ? Colors.white :
                                                    Colors.black,
                                        }}>
                                            {index + 1}{". "}{item}
                                        </Text>

                                    </View>
                                );
                            })}
                        </View>
                    </View>
                    <View style={styles.tagsContainer}>
                        {shuffle(props.verifyPhrase).map((item: any, index: number) => {
                            return (
                                <TouchableOpacity key={index} style={{
                                    ...styles.bottomButtons,
                                    borderColor: props.isBlackTheme ? Colors.white : Colors.black
                                }}
                                    onPress={() => props.onTapPhrasePress(item)}
                                >
                                    <Text style={{
                                        ...styles.tagText, fontWeight: "bold",
                                        color:
                                            props.isBlackTheme ? Colors.white :
                                                Colors.black,
                                    }}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <View
                        style={{ ...styles.termsContainer, marginTop: heightPercentageToDP(1.5) }}
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
                        label="Confirm"
                        borderRadius={5}
                        size={Button.sizes.large}
                        color={props.isBlackTheme ? Colors.black : Colors.white}
                        text60
                        labelStyle={{fontSize: 14, fontWeight: 'bold', letterSpacing: 2, textAlign: "center"}}
                        style={styles.buttonStyle}
                        backgroundColor={CustomColors.primaryButton}
                        disabled={props.validated}
                        enableShadow
                        animateLayout
                        onPress={props.onContinuePress}
                    />
                    <View
                        style={{ height: heightPercentageToDP(4) }}
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
    secondaryContainer: {
        paddingHorizontal: widthPercentageToDP(6)
    },
    filedHeader: {
        fontSize: 12,
        letterSpacing: 0.7,
        lineHeight: 17,
        paddingVertical: heightPercentageToDP(2),
    },
    buttonStyle: {
        width: widthPercentageToDP(80),
        height: heightPercentageToDP(8),
        borderRadius: 9,
        justifyContent: "center",
        alignSelf: "center"
    },
    bottomButtons: {
        borderRadius: 6,
        paddingHorizontal: widthPercentageToDP(5),
        paddingVertical: heightPercentageToDP(1.4),
        borderWidth: 1,
        marginBottom: heightPercentageToDP(2),
        marginLeft: widthPercentageToDP(4),
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
        width: widthPercentageToDP(81),
        alignSelf: "center",
        marginTop: heightPercentageToDP(5)
    },
    tagText: {
        fontSize: 10,
    },
    termsContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: widthPercentageToDP(3)
    },
    termsText: {
        color: Colors.hintsColor,
        fontSize: 14,
        paddingHorizontal: widthPercentageToDP(8),
        lineHeight: 20
    },
    topTitle: {
        fontSize: 16,
        fontWeight: "bold",
        letterSpacing: 1,
    },
    verifyContainer: {
        paddingHorizontal: widthPercentageToDP(3),
        borderRadius: 6,
        width: widthPercentageToDP(81),
        alignSelf: "center",
        minHeight: heightPercentageToDP(10),
        borderWidth: 1.5
    },
    VerifiedbottomButtons: {
        borderRadius: 6,
        paddingVertical: heightPercentageToDP(1.5),
        marginLeft: widthPercentageToDP(4),
    },
    VerifiedtagsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
})
export default VerifyPhrase;

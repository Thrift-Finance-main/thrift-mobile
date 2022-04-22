import React, { FC } from 'react'
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '../constants/CustomColors'
import { heightPercentageToDP, widthPercentageToDP } from '../utils/dimensions'
import Button from './Common/Button'
import Back from '../assets/back.svg'
import Bulb from '../assets/Bulb.svg'
import CopyClip from '../assets/CopyClip.svg'
import Modal from 'react-native-modal'
import DarkBack from '../assets//DarkBack.svg'

interface CopyPhraseProps {
    onContinuePress: () => void
    onBackIconPress: () => void
    phraseTags: any
    onShowQRPress: () => void
    onCopyPress: () => void
    showCopyNotification: boolean
    isBlackTheme: any,
    account: any,
    error: string,
}
const CopyPhrase: FC<CopyPhraseProps> = (props) => {
    return (
        <SafeAreaView style={{
            ...styles.mainContainer,
            backgroundColor:
                props.isBlackTheme ? Colors.blackTheme :
                    Colors.inputFieldBackground,
        }}>
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
                <View
                    style={styles.topContainer}
                >
                    <Text
                        style={{
                            ...styles.filedHeader, color:
                                props.isBlackTheme ? Colors.white :
                                    Colors.black,
                        }}
                    >Don’t ever share your recovery phrase with{"\n"}any one or third party.</Text>
                </View>
                <View style={styles.tagsContainer}>
                    {props.phraseTags.map((item: any, index: number) => {
                        return (
                            <View key={index} style={{ ...styles.bottomButtons, borderColor: props.isBlackTheme ? Colors.white : Colors.black }}>
                                <Text style={{
                                    ...styles.tagText, color:
                                        props.isBlackTheme ? Colors.white :
                                            Colors.black,
                                }}>
                                    {index+1}. {item}
                                </Text>
                            </View>
                        );
                    })}
                </View>

                {
                    /*
                    props.isBlackTheme ?
                        <View
                            style={styles.copyQRContainer}
                        >
                            <TouchableOpacity
                                onPress={props.onCopyPress}
                            >
                                <CopyDark /></TouchableOpacity>

                            <TouchableOpacity
                                onPress={props.onShowQRPress}
                            >
                                <QrDark /></TouchableOpacity>
                        </View> :
                        <View
                            style={styles.copyQRContainer}
                        >
                            <TouchableOpacity
                                onPress={props.onCopyPress}
                            >
                                <Copy /></TouchableOpacity>

                            <TouchableOpacity
                                onPress={props.onShowQRPress}
                            >
                                <ShowQR /></TouchableOpacity>
                        </View>
                     */
                }


                <View
                    style={{ ...styles.accountsContainer, marginTop: heightPercentageToDP(5) }}
                >
                    <Bulb />
                    <Text
                        style={styles.termsText}
                    >
                        Thrift finance team will never ask you {"\n"}for your recovery phrase.
                    </Text>
                </View>
                <View
                    style={{ height: heightPercentageToDP(3.5) }}
                />
                <Button
                    backgroundColor={Colors.primaryButton}
                    buttonTitle='I’ve Written it Down'
                    onPress={props.onContinuePress}
                    titleTextColor={props.isBlackTheme ? Colors.black : Colors.white}
                />
                {props.error && props.error.length ? <Text
                    style={styles.errorText}
                >
                    {props.error}
                </Text> : null}
                <Modal
                    isVisible={props.showCopyNotification}
                    style={{ margin: -1, justifyContent: 'flex-end', paddingBottom: heightPercentageToDP(5), alignItems: 'center' }}
                >
                    <CopyClip
                        height={heightPercentageToDP(5)}
                    />
                </Modal>
            </View>
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
        backgroundColor: Colors.copyPhrase,
        paddingHorizontal: widthPercentageToDP(3),
        borderRadius: 6,
        width: widthPercentageToDP(81),
        alignSelf: "center",
        marginTop: heightPercentageToDP(3.5)
    },
    tagText: {
        fontSize: 10,
        fontWeight: "bold"
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
        lineHeight: 20
    },
    errorText: {
        color: Colors.error,
        fontSize: 9,
        alignSelf: "center",
        paddingHorizontal: widthPercentageToDP(8),
        lineHeight: 20,
    },
    copyQRContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        marginTop: heightPercentageToDP(0.5)
    }
})
export default CopyPhrase;

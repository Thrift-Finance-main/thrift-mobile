import React, {FC, useEffect, useState} from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '../constants/CustomColors'
import { heightPercentageToDP, widthPercentageToDP } from '../utils/dimensions'
import Forward from '../assets/Forward.svg'
import DarkForward from '../assets/DarkForward.svg'

import Back from '../assets/back.svg'
import Toggle from '../assets/Toggle.svg'
import DarkBack from '../assets//DarkBack.svg'
import LanguageModal from './PopUps/LanguageModal'
import PushNotificationModal from './PopUps/PushNotificationModal'
import CurrencyConvertorModal from './PopUps/CurrencyConvertorModal'
import {apiDb} from "../db/LiteDb";
import {setCurrentAccount} from "../store/Action";
import {changeLang, LANGUAGES_MODAL, LANGUAGES_NAMES_INVERT} from "../i18n";


interface SettingsProps {
    MenuList: any
    onBackIconPress: () => void
    onSecurityPress: () => void
    isBlackTheme: any
    onPushNotoficationPress: () => void
    hidePushModal: () => void
    pushVisible: boolean
    currencyVisible: boolean
    hideShowCurrencyModal: () => void
}
const Settings: FC<SettingsProps> = (props) => {
    const [languageModal, setLanguageModal] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState('English');

    useEffect(() =>{
        apiDb.getCurrentLanguage().then(lang =>{
            setCurrentLanguage(LANGUAGES_NAMES_INVERT[lang]);
        });
    }, []);

    const updateCurrentLanguage = (lang:string) => {
        apiDb.setCurrentLanguage(lang).then(r => {
            changeLang(lang).then(r => {
                setCurrentLanguage(LANGUAGES_NAMES_INVERT[lang]);
                setLanguageModal(false);
            });
        });
    }

    const renderItemMenuList = ({ item, index }) => {
        return (
            <>
                <TouchableOpacity
                    style={styles.renderTopContainer}
                    activeOpacity={1}
                    onPress={index == 0 ? props.onSecurityPress : index === 3 ? () => setLanguageModal(true) : index == 1 ? props.onPushNotoficationPress :
                        index == 2 ? props.hideShowCurrencyModal :
                            () => console.log()
                    }
                >
                    <View
                        style={styles.renderIconContainer}
                    >
                        <View
                            style={styles.renderIcon}>
                            {item.icon}

                        </View>
                        <Text
                            style={{
                                ...styles.renderTitle, color:
                                    props.isBlackTheme ? Colors.white : Colors.black,
                            }}
                        >{item.title}</Text>
                    </View>
                    {index == 3 ?
                        <Text
                            style={{
                                ...styles.renderSubTitle, color:
                                    props.isBlackTheme ? Colors.white :
                                        Colors.black,
                            }}
                        >{currentLanguage}</Text>
                        :
                        props.isBlackTheme ? <DarkForward
                            style={{ paddingHorizontal: widthPercentageToDP(5) }}

                        /> :
                            <Forward
                                style={{ paddingHorizontal: widthPercentageToDP(5) }}
                            />
                    }



                </TouchableOpacity>
                {
                    index == 3 ? <View
                        style={{ height: heightPercentageToDP(4) }}
                    /> : null
                }
            </>

        )
    }
    return (
        <SafeAreaView style={{
            ...styles.mainContainer, backgroundColor:
                props.isBlackTheme ? Colors.blackTheme :
                    Colors.white,
        }}>
            <View style={styles.secondaryContainer}>
                <View
                    style={{ flexDirection: "row", alignItems: "center" }}
                >
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
                            ...styles.topTitle, color: props.isBlackTheme ? Colors.white :
                                Colors.black
                        }}
                    >Settings</Text>
                </View>
                <View>
                    <FlatList
                        style={{ marginTop: heightPercentageToDP(2), }}
                        scrollEnabled={true}
                        data={props.MenuList}
                        renderItem={renderItemMenuList}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
                <View
                    style={{ height: heightPercentageToDP(13) }}
                />
            </View>
            <LanguageModal
                Data={LANGUAGES_MODAL}
                selectedLang ={currentLanguage}
                visible={languageModal}
                hideModal={() => setLanguageModal(false)}
                proceed={(lang) => updateCurrentLanguage(lang)}
                isBlackTheme={props.isBlackTheme}
            />
            <PushNotificationModal
                visible={props.pushVisible}
                hideModal={props.hidePushModal}
                isBlackTheme={props.isBlackTheme}

            />
            <CurrencyConvertorModal
                visible={props.currencyVisible}
                hideModal={props.hideShowCurrencyModal}
                isBlackTheme={props.isBlackTheme}
            />
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    secondaryContainer: {
        paddingHorizontal: widthPercentageToDP(6)
    },
    topTitle: {
        fontSize: 18,
        fontFamily: 'AvenirNextCyr-Demi',
        textAlign: "center",
        letterSpacing: 1,
        marginTop: heightPercentageToDP(3),
        paddingHorizontal: widthPercentageToDP(4),
    },
    renderTopContainer: {
        marginTop: heightPercentageToDP(4),
        flexDirection: "row",
        justifyContent: "space-between", alignItems: "center",
    },
    renderIconContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: widthPercentageToDP(2)
    },
    renderIcon: {
        backgroundColor: Colors.settingsContainerBack,
        width: widthPercentageToDP(12)
        , height: heightPercentageToDP(6),
        borderRadius: 10,
        justifyContent: "center", alignItems: "center",
    },
    renderTitle: {
        fontSize: 15,
        fontWeight: "500",
        fontFamily: 'AvenirNextCyr-Medium',
        paddingHorizontal: widthPercentageToDP(3),
        textAlign: "center"
    },
    renderSubTitle: {
        paddingHorizontal: widthPercentageToDP(4),
        fontSize: 12,
        fontFamily: 'AvenirNextCyr-Regular',
    }
})
export default Settings;

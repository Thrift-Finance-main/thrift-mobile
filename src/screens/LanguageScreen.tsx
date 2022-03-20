import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react'
import SplashScreen from 'react-native-splash-screen';
import { useDispatch, useSelector } from 'react-redux';
import Language from '../components/Language'
import { setTheme } from '../store/Action';
import {getCurrentLang, getCurrentLanguage, LANGUAGES_LIST, LANGUAGES_NAMES} from "../i18n";
import realmDb from "../db/RealmConfig";
import i18next from "i18next";
import {withTranslation} from "react-i18next";
import {getKeyByValue} from "../utils";
const LanguageScreen = ({ navigation }) => {
    const isBlackTheme = useSelector((state) => state.Reducers.isBlackTheme);
    const dispatch = useDispatch();

    const [dropDownVisible, setDropDownVisible] = useState<boolean>(false);
    const [languageModal, setLanguageModal] = useState<boolean>(false)

    const [languageList, setLanguageList] = useState<any>(LANGUAGES_LIST);
    const [dropDownText, setDropDownText] = useState<string>(LANGUAGES_LIST[0])

    useEffect(() => {
        SplashScreen.hide();
        checkTheme();
    }, [])

    const hideDropDownMenu = () => {
        setDropDownVisible(false)
    }
    const showDropDownMenu = () => {
        setDropDownVisible(true)
    }
    const updateDropDownText = (lan: string) => {
        setDropDownText(lan)
        setDropDownVisible(false)
    }
    const onContinuePress = () => {
        navigation.navigate("Authentication")
    }
    const hideShowLanguageModal = () => {
        setLanguageModal(!languageModal)
        //navigation.navigate("Welcome")
    }
    const proceed = (lan:string) => {
        setDropDownText(lan);
        // @ts-ignore
        realmDb.setLanguage(LANGUAGES_NAMES[lan]).then(r => {});
        // @ts-ignore
        i18next.changeLanguage(LANGUAGES_NAMES[lan]).then(r => {});

        setLanguageModal(!languageModal);
    }
    const checkTheme = async () => {
        let isBlackTheme = await AsyncStorage.getItem('isBlackTheme');
        console.log("shhshs", isBlackTheme);

        if (isBlackTheme == null)
            dispatch(setTheme(false))
        else
            dispatch(setTheme(isBlackTheme == "0"))
    }
    return (
        <Language
            dropDownVisible={dropDownVisible}
            languageList={languageList}
            dropDownText={dropDownText}
            showDropDownMenu={showDropDownMenu}
            updateDropDownText={updateDropDownText}
            hideDropDownMenu={hideDropDownMenu}
            onContinuePress={onContinuePress}
            languageModal={languageModal}
            hideShowLanguageModal={hideShowLanguageModal}
            proceed={proceed}
            isBlackTheme={isBlackTheme}
        />
    )
}

export default withTranslation()(LanguageScreen)

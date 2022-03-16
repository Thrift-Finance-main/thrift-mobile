import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react'
import SplashScreen from 'react-native-splash-screen';
import { useDispatch, useSelector } from 'react-redux';
import Language from '../components/Language'
import { setTheme } from '../store/Action';
const LanguageScreen = ({ navigation }) => {
    const isBlackTheme = useSelector((state) => state.Reducers.isBlackTheme);
    const dispatch = useDispatch();

    const [dropDownVisible, setDropDownVisible] = useState<boolean>(false);
    const [languageModal, setLanguageModal] = useState<boolean>(false)

    const [languageList, setLanguageList] = useState<any>([
        {
            id: 0,
            title: "English"
        },
        {
            id: 2,
            title: "French"
        },
        {
            id: 1,
            title: "Spanish"
        },
        {
            id: 0,
            title: "Porteguess"
        },
    ]);
    const [dropDownText, setDropDownText] = useState<string>(languageList[0].title)

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
    const updateDropDownText = (title: string, id?: number) => {
        setDropDownText(title)
        setDropDownVisible(false)
    }
    const onContinuePress = () => {
        navigation.navigate("Authentication")
    }
    const hideShowLanguageModal = () => {
        setLanguageModal(!languageModal)
        //navigation.navigate("Welcome")


    }
    const proceed = (title) => {
        setDropDownText(title)

        setLanguageModal(!languageModal)

    }
    const checkTheme = async () => {
        let isBlackTheme = await AsyncStorage.getItem('isBlackTheme');
        console.log("shhshs", isBlackTheme);

        if (isBlackTheme == null)
            dispatch(setTheme(false))
        else
            dispatch(setTheme(isBlackTheme == "0" ? true : false))


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

export default LanguageScreen

import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import CreateTarget from '../components/CreateTarget';
import Savings from '../components/Savings';
const SavingsScreen = ({ navigation }) => {
    const isBlackTheme = useSelector((state) => state.Reducers.isBlackTheme);
    const [dropDownVisible, setDropDownVisible] = useState<boolean>(false);
    const [pickerModal, setPickerModal] = useState<boolean>(false)
    const [dropDownVisible1, setDropDownVisible1] = useState<boolean>(false);
    const [pickerModal1, setPickerModal1] = useState<boolean>(false)
    const [languageList, setLanguageList] = useState<any>([
        {
            id: 0,
            title: "Select Yields"
        },

    ]);
    const [dropDownText, setDropDownText] = useState<string>(languageList[0].title)

    const [dropDownText1, setDropDownText1] = useState<string>("Select");


    const onBackIconPress = () => {
        navigation.goBack()
    }
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

    const hideShowLanguageModal = () => {
        setPickerModal(!pickerModal)
        //navigation.navigate("Welcome")


    }
    const proceed = (title: any) => {
        setDropDownText(title)
        setPickerModal(!pickerModal)
    }







    const hideDropDownMenu1 = () => {
        setDropDownVisible1(false)
    }
    const showDropDownMenu1 = () => {
        setDropDownVisible1(true)
    }
    const updateDropDownText1 = (title: string, id?: number) => {
        setDropDownText1(title)
        setDropDownVisible1(false)
    }

    const hideShowLanguageModal1 = () => {
        setPickerModal1(!pickerModal1)


    }
    const proceed1 = (title: any) => {
        setDropDownText1(title)
        setPickerModal1(!pickerModal1)
    }


    return (
        <Savings
            // onContinuePress={onContinuePress}
            isBlackTheme={isBlackTheme}
            onBackIconPress={onBackIconPress}
            dropDownVisible={dropDownVisible}
            pickerModal={pickerModal}
            hideShowLanguageModal={hideShowLanguageModal}
            proceed={proceed}
            hideDropDownMenu={hideDropDownMenu}
            showDropDownMenu={showDropDownMenu}
            updateDropDownText={updateDropDownText}
            languageList={languageList}
            dropDownText={dropDownText}
            dropDownVisible1={dropDownVisible1}
            pickerModal1={pickerModal1}
            dropDownText1={dropDownText1}
            hideDropDownMenu1={hideDropDownMenu1}
            showDropDownMenu1={showDropDownMenu1}
            updateDropDownText1={updateDropDownText1}
            hideShowLanguageModal1={hideShowLanguageModal1}
            proceed1={proceed1}
        />
    )
}

export default SavingsScreen

import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import CreateTarget from '../components/CreateTarget';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const CreateTargetScreen = ({ navigation }) => {
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
    const [imageUrl, setImageUrl] = useState<any>(
        null
    );

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
    const onPressedCameraIcon = () => {
        let options = {
            skipBackup: true,
            path: 'images',
            maxWidth: 70,
            maxHeight: 70,
            includeBase64: true,
            mediaType: 'photo',
        };

        launchImageLibrary(options, res => {
            console.log('response', res);

            if (res.didCancel) {
                console.log('User cancelled image picker');
            } else if (res.errorCode) {
                console.log
                    ('Unable to upload the image');
            } else {
                setImageUrl(res.assets[0].uri);

                console.log('assets', res);
            }
        });
    };

    const onSetTargetPress = () => {
        navigation.navigate("Wallet")
    }

    return (
        <CreateTarget
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
            onPressedCameraIcon={onPressedCameraIcon}
            imageUrl={imageUrl}
            onSetTargetPress={onSetTargetPress}
        />
    )
}

export default CreateTargetScreen


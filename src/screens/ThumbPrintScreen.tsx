import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import ThumbPrint from '../components/ThumbPrint';
const ThumbPrintScreen = ({ navigation }) => {
    const isBlackTheme = useSelector((state) => state.Reducers.isBlackTheme);

    const [visible, setVisible] = useState<boolean>(false);

    const hideModal = () => {
        setVisible(false)
        navigation.navigate("Wallet")
    }

    const onConfirmPress = () => {
        setVisible(true);
    }

    const onBackIconPress = () => {
        navigation.goBack()
    }

    return (
        <ThumbPrint
            onConfirmPress={onConfirmPress}
            onBackIconPress={onBackIconPress}
            hideModal={hideModal}
            visible={visible}
            isBlackTheme={isBlackTheme}
            navigation={navigation}
        />
    )
}

export default ThumbPrintScreen

import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import RestoreWallet from '../components/RestoreWallet'

const RestoreWalletScreen = ({ navigation }) => {

    const isBlackTheme = useSelector((state) => state.Reducers.isBlackTheme);

    const [visible, setVisible] = useState<boolean>(false);
    const hideModal = () => {
        setVisible(false);
        navigation.navigate("CreatePin")
    }
    const onRestoreWalletPress = () => {
        setVisible(true)
    }
    const onBackIconPress = () => {
        navigation.goBack()
    }

    return (
        <RestoreWallet
            onRestoreWalletPress={onRestoreWalletPress}
            onBackIconPress={onBackIconPress}
            visible={visible}
            hideModal={hideModal}
            isBlackTheme={isBlackTheme}
        />
    )
}

export default RestoreWalletScreen

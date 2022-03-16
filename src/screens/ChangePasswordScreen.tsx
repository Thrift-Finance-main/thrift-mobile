import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import ChangePassword from '../components/ChangePassword'

const ChangePasswordScreen = ({ navigation }) => {
    const isBlackTheme = useSelector((state) => state.Reducers.isBlackTheme);

    const [visible, setVisible] = useState<boolean>(false)

    const onContinuePress = () => {
        setVisible(true)
    }
    const onBackIconPress = () => {
        navigation.goBack()
    }

    const hideModal = () => {
        setVisible(false)
        navigation.goBack()

    }
    return (
        <ChangePassword
            onContinuePress={onContinuePress}
            onBackIconPress={onBackIconPress}
            visible={visible}
            hideModal={hideModal}
            isBlackTheme={isBlackTheme}
        />
    )
}

export default ChangePasswordScreen

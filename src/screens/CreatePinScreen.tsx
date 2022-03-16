import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import CreatePin from '../components/CreatePin'

const CreatePinScreen = ({ navigation }) => {
    const isBlackTheme = useSelector((state) => state.Reducers.isBlackTheme);

    const [visible, setVisible] = useState<boolean>(false);
    const hideModal = () => {
        setVisible(false)
        navigation.navigate("DashboardTab")

    }
    const onConfirmPress = () => {
        setVisible(true);
    }
    const onBackIconPress = () => {
        navigation.goBack()
    }

    return (
        <CreatePin
            onConfirmPress={onConfirmPress}
            onBackIconPress={onBackIconPress}
            hideModal={hideModal}
            visible={visible}
            isBlackTheme={isBlackTheme}
        />
    )
}

export default CreatePinScreen

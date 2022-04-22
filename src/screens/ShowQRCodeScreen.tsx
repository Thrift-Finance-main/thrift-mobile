import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import ShowQRCode from '../components/ShowQRCode'

const ShowQRCodeScreen = ({ navigation }) => {

    const isBlackTheme = useSelector((state) => state.Reducers.isBlackTheme);


    const onBackIconPress = () => {
        navigation.goBack()
    }

    return (
        <ShowQRCode
            onBackIconPress={onBackIconPress}
            isBlackTheme={isBlackTheme}
        />
    )
}

export default ShowQRCodeScreen

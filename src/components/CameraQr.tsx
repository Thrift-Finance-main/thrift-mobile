import React, {useMemo} from 'react'
import { useSelector } from 'react-redux';
import CreateAccount from '../components/CreateAccount';
import {useQuery} from "../db/models/Project";
import QRCodeScanner from "react-native-qrcode-scanner";
import {Linking, View} from "react-native";

const CameraQr = ({ navigation, route }) => {

    const onSuccess = e => {
        const addr = e.data;
        console.log('e');
        console.log(e);
        Linking.openURL(e.data).catch(err =>
            console.error('An error occured', err)
        );
    };

    const renderCamera = () => {
        //const isFocused = this.props.navigation.isFocused();
        const isFocused = navigation.isFocused();

        if (!isFocused) {
            return null;
        } else if (isFocused) {
            return (
                <QRCodeScanner
                    onRead={onSuccess}
                />
            )
        }
    }
    return (
        <View style={{ flex: 1 }}>
            {renderCamera()}
        </View>
    )
}

export default CameraQr

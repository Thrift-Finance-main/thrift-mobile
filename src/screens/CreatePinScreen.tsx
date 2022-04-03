import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import CreatePin from '../components/CreatePin';
import {sha256} from "../utils";
import {apiDb} from "../db/LocalDb";
import {Alert} from "react-native";

const CreatePinScreen = ({ navigation }) => {
    const isBlackTheme = useSelector((state) => state.Reducers.isBlackTheme);

    const [visible, setVisible] = useState<boolean>(false);
    const [pincode, setPincode] = useState<string>('');
    const [confirmedPincode, setConfirmedPincode] = useState<string>('');
    const hideModal = () => {
        setVisible(false)
        navigation.navigate("DashboardTab")
    }
    const onConfirmPress = () => {
        // set pincode
        let pin = sha256(pincode);

        console.log('pin');
        console.log(pin);

        apiDb.setPincode(pin).then(r => {
            if (r && r.error){
                Alert.alert("Error Creating Pincode", r.error);
            } else {
                setVisible(true);
            }
        });
    }
    const onBackIconPress = () => {
        navigation.goBack()
    }

    return (
        <CreatePin
            pincode={pincode}
            confirmedPincode={confirmedPincode}
            onConfirmPress={onConfirmPress}
            onBackIconPress={onBackIconPress}
            hideModal={hideModal}
            setPincode={(pincode) => setPincode(pincode)}
            setConfirmedPincode={(confirmedPincode) => setConfirmedPincode(confirmedPincode)}
            visible={visible}
            isBlackTheme={isBlackTheme}
            validate={pincode !== '' && pincode === confirmedPincode}
        />
    )
}
export default CreatePinScreen

import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import CreatePin from '../components/CreatePin';
import {sha256} from "../utils";
import {apiDb} from "../db/LocalDb";
import {Alert} from "react-native";

const CreatePinScreen = ({ navigation, route }) => {
    const isBlackTheme = useSelector((state) => state.Reducers.isBlackTheme);

    const [visible, setVisible] = useState<boolean>(false);
    const [pincode, setPincode] = useState<string>('');
    const [oldPincode, setOldPincode] = useState<string>('');
    const [confirmedPincode, setConfirmedPincode] = useState<string>('');

    const hideModal = () => {
        setVisible(false)
        navigation.navigate("DashboardTab")
    }
    const onConfirmPress = () => {

        if (route.params.fromScreen === "Settings" && oldPincode.length){
            let oldpin = sha256(oldPincode);
            apiDb.getPincode().then(pinc => {
                if (pinc === oldpin){
                    // set pincode
                    let pin = sha256(pincode);

                    apiDb.setPincode(pin).then(r => {
                        if (r && r.error){
                            // Alert.alert("Error Creating Pincode:", r.error);
                        } else {
                            setVisible(true);
                        }
                    });
                } else {
                    // Alert.alert("Incorrect old pincode");
                }
            });
        } else {
            apiDb.setPincode(sha256(pincode)).then(r => {
                if (r && r.error){
                    // Alert.alert("Error Creating Pincode:", r.error);
                    console.log('error');
                    console.log(r.error);
                } else {
                    setVisible(true);
                    navigation.navigate("DashboardTab");
                }
            });
        }
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
            setPincode={(pincode:string) => setPincode(pincode)}
            setConfirmedPincode={(confirmedPincode:string) => setConfirmedPincode(confirmedPincode)}
            visible={visible}
            isBlackTheme={isBlackTheme}
            validate={route.params.fromScreen === "Settings" ? oldPincode.length && pincode !== '' && pincode === confirmedPincode : pincode !== '' && pincode === confirmedPincode}
            title={"Create Pin"}
            oldpin={route.params.fromScreen === "Settings"}
            setOldPincode={(oldPincode:string) => setOldPincode(oldPincode)}
        />
    )
}
export default CreatePinScreen

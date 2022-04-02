import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import CreatePin from '../components/CreatePin';

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
        let pin = pincode;

        /*
        realmDb.setPinCode(pincode).then(r => {
            console.log('r');
            console.log(r);
            if (!(r && r.error)){
                setVisible(true);
            }
        });
        */
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

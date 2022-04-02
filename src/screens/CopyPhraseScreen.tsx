import React, { useState } from 'react'
import CopyPhrase from '../components/CopyPhrase'
import Clipboard from '@react-native-community/clipboard';
import { useSelector } from 'react-redux';
import {createAccount, generateAdaMnemonic} from "../lib/account";
import { Toast } from 'react-native-ui-lib';
const CopyPhraseScreen = ({ navigation, route }) => {
    const isBlackTheme = useSelector((state) => state.Reducers.isBlackTheme);

    const [copiedText, setCopiedText] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [seed, setSeed] = useState<string>(generateAdaMnemonic());
    const [showCopyNotification, setCopyNotification] = useState<boolean>(false)

    const onContinuePress = () => {
        console.log('\nonContinuePress');
        console.log('route.params');
        console.log(route.params);
        // createAcc(route.params).then(r => {});
        navigation.navigate("VerifyPhrase", {...{seed, name: route.params.name, passwd: route.params.passwd }})
    }
    const onBackIconPress = () => {
        navigation.goBack()
    }

    const onShowQRPress = () => {
        navigation.navigate("ShowQRCode")
    }

    const onCopyPress = (data:string) => {
        setCopyNotification(true)
        Clipboard.setString(data);
        setTimeout(() => {
            setCopyNotification(false)
            navigation.navigate("VerifyPhrase")
        }, 2000);
    }

    const renderToast = (message:string) => {
        console.log('renderToast');
        console.log(message);
        return (
            <Toast
                visible={true}
                position={'bottom'}
                message={message}
                autoDismiss={3500}
                // backgroundColor={Colors.green70}
                // icon={Assets.icons.demo.add}
                // iconColor={Colors.green20}
                // style={{borderWidth: 1, borderColor: Colors.grey30}}
                // messageStyle={Typography.text80BO}
            />
        );
    };




    console.log('seed')
    console.log(seed)
    return (
        <CopyPhrase
            phraseTags={seed.split(' ')}
            onContinuePress={onContinuePress}
            onBackIconPress={onBackIconPress}
            onShowQRPress={onShowQRPress}
            onCopyPress={() => onCopyPress(seed)}
            showCopyNotification={showCopyNotification}
            isBlackTheme={isBlackTheme}
            account={route.params}
            error={error}
        />
    )
}

export default CopyPhraseScreen

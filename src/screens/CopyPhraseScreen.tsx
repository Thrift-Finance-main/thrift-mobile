import React, { useState } from 'react'
import CopyPhrase from '../components/CopyPhrase'
import Clipboard from '@react-native-community/clipboard';
import { useSelector } from 'react-redux';
import realmDb from "../db/RealmConfig";
import {createAccount, generateAdaMnemonic} from "../lib/account";
import {IAccount} from "../db/model/AccountModel";
import { Toast } from 'react-native-ui-lib';
const CopyPhraseScreen = ({ navigation, route }) => {
    const isBlackTheme = useSelector((state) => state.Reducers.isBlackTheme);

    const [phraseTags, setPhraseTags] = useState<any>([{
        title: "1. Lounch"
    }
        ,
    {
        title: "2. Enumirate"
    }
        , {
        title: "3. Complete"
    }

        ,
    {
        title: "4. Lounch"
    }
        ,
    {
        title: "5. Enumirate"
    }
        , {
        title: "6. Complete"
    }

        ,
    {
        title: "7. Lounch"
    }
        ,
    {
        title: "8. Enumirate"
    },
    {
        title: "9. Enumirate"
    },
    {
        title: "10. Enumirate"
    },
    {
        title: "11. Enumirate"
    },
    {
        title: "12. Enumirate"
    },

    ])
    const [copiedText, setCopiedText] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [seed, setSeed] = useState<string>(generateAdaMnemonic());
    const [showCopyNotification, setCopyNotification] = useState<boolean>(false)
    const onContinuePress = () => {
        console.log('onContinuePress');
        console.log('route.params');
        console.log(route.params);
        createAcc(route.params).then(r => {});
    }
    const onBackIconPress = () => {
        navigation.goBack()
    }

    const onShowQRPress = () => {
        navigation.navigate("ShowQRCode")
    }

    const onCopyPress = () => {
        setCopyNotification(true)
        Clipboard.setString('hello world');
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

    const createAcc = async (accData:any) => {
        setError('');
        const accountData = accData;
        console.log('\ncreateAcc');
        console.log('accountData');
        console.log(accountData);

        const name = accountData.name;
        const passwd = accountData.passwd;
        if (name.length) {
            const accInState = await realmDb.getAllAccounts();
            console.log(accInState);
            const acc: IAccount = await createAccount(
                seed,
                name,
                passwd
            );
            console.log('acc');
            console.log(JSON.stringify(acc, null, 2));

            const accAdded =  await realmDb.addAccount(acc);
            console.log('accAdded');
            console.log(accAdded);
            if (accAdded && accAdded.error) {
                // handle error
                console.log('error');
                setError(accAdded.error);
                renderToast(accAdded.error);
                navigation.navigate("VerifyPhrase", seed)
            } else {
                console.log('navigate to verify');
                navigation.navigate("VerifyPhrase")
            }
        }
    }


    console.log('seed')
    console.log(seed)
    return (
        <CopyPhrase
            phraseTags={seed.split(' ')}
            onContinuePress={onContinuePress}
            onBackIconPress={onBackIconPress}
            onShowQRPress={onShowQRPress}
            onCopyPress={onCopyPress}
            showCopyNotification={showCopyNotification}
            isBlackTheme={isBlackTheme}
            account={route.params}
            error={error}
        />
    )
}

export default CopyPhraseScreen

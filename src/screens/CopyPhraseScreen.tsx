import React, { useState } from 'react'
import CopyPhrase from '../components/CopyPhrase'
import Clipboard from '@react-native-community/clipboard';
import { useSelector } from 'react-redux';
import realmDb from "../db/RealmConfig";
import {createAccount, generateAdaMnemonic} from "../lib/account";
import {IAccount} from "../db/model/AccountModel";
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
    const [showCopyNotification, setCopyNotification] = useState<boolean>(false)
    const onContinuePress = () => {
        console.log('onContinuePress');
        const name = route.params.name;
        const passwd = route.params.passwd;
        createAcc({name, passwd}).then(r => {});
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

    const createAcc = async (accData:any) => {
        const accountData = accData;
        console.log('\ncreateAcc');
        console.log('accountData');
        console.log(accountData);

        const name = accountData.name;
        const passwd = accountData.passwd;
        if (name.length) {
            const accInState = await realmDb.getAllAccounts();
            console.log(accInState);
            const seed: string = generateAdaMnemonic();
            const acc: IAccount = await createAccount(
                seed,
                name,
                passwd
            );
            console.log('acc');
            console.log(JSON.stringify(acc, null, 2));

            const accAdded =  await realmDb.addAccount(acc);
            if (accAdded && accAdded.error) {
                // handle error
            } else {
                navigation.navigate("VerifyPhrase")
            }
        }
    }

    console.log('navigation');
    console.log(route.params);
    return (
        <CopyPhrase
            phraseTags={phraseTags}
            onContinuePress={onContinuePress}
            onBackIconPress={onBackIconPress}
            onShowQRPress={onShowQRPress}
            onCopyPress={onCopyPress}
            showCopyNotification={showCopyNotification}
            isBlackTheme={isBlackTheme}
            account={route.params}
        />
    )
}

export default CopyPhraseScreen

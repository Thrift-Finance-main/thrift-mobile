import React, { useState } from 'react'
import CopyPhrase from '../components/CopyPhrase'
import Clipboard from '@react-native-community/clipboard';
import { useSelector } from 'react-redux';
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
        navigation.navigate("VerifyPhrase")
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
        />
    )
}

export default CopyPhraseScreen

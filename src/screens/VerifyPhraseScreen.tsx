import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import VerifyPhrase from '../components/VerifyPhrase'

const VerifyPhraseScreen = ({ navigation }) => {
    const isBlackTheme = useSelector((state) => state.Reducers.isBlackTheme);

    const [verifyPhrase, setVerifyPhrase] = useState<any>([{
        id: 1,
        title: "Lounch"
    }
        ,
    {
        id: 2,

        title: "Enumirate"
    }
        , {
        id: 3,
        title: "Complete"
    }

        ,
    {
        id: 4,
        title: "Lounch"
    }
        ,
    {
        id: 5,
        title: "Enumirate"
    }
        , {
        id: 6,
        title: "Complete"
    }

        ,
    {
        id: 7,
        title: "Lounch"
    }
        ,
    {
        id: 8,
        title: "Enumirate"
    }
        ,
    {
        id: 7,
        title: "Lounch"
    }
        ,
    {
        id: 8,
        title: "Enumirate"
    },
    {
        id: 7,
        title: "Lounch"
    }
        ,
    {
        id: 8,
        title: "Enumirate"
    }
    ])
    const [verifiedPhrases, setVerifiedPhrases] = useState<any>([])
    const onContinuePress = () => {
        navigation.navigate("CreatePin")
    }
    const onBackIconPress = () => {
        navigation.goBack()
    }

    const onTapPhrasePress = (item: any) => {
        let temp = [...verifiedPhrases];
        let val = temp.find((Item) => Item === item);
        if (val === undefined) {
            temp = [...temp, item];
            setVerifiedPhrases(temp)
        }

        console.log(item);

    }
    return (
        <VerifyPhrase
            verifyPhrase={verifyPhrase}
            onContinuePress={onContinuePress}
            onBackIconPress={onBackIconPress}
            verifiedPhrases={verifiedPhrases}
            onTapPhrasePress={onTapPhrasePress}
            isBlackTheme={isBlackTheme}
        />
    )
}

export default VerifyPhraseScreen

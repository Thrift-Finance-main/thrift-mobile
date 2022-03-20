import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import VerifyPhrase from '../components/VerifyPhrase'
import {shuffle} from "../utils";

const VerifyPhraseScreen = ({ navigation, route }) => {
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
    const [verifiedPhrases, setVerifiedPhrases] = useState<string[]>([]);
    const [verifyPhrases, setVerifyPhrases] = useState<string[]>(route.params.split(' '));
    const onContinuePress = () => {
        navigation.navigate("CreatePin")
    }
    const onBackIconPress = () => {
        navigation.goBack()
    }

    const validateSeed = () => {
        return route.params !== verifiedPhrases.join(' ');
    }

    const onTapPhrasePress = (item: any) => {
        console.log('\nonTapPhrasePress');
        console.log(item);
        let temp = [...verifiedPhrases];
        let val = temp.find((Item) => Item === item);
        if (val === undefined) {
            temp = [...temp, item];
            setVerifiedPhrases(temp)
        }

        console.log('\nverifiedPhrases');
        console.log(verifiedPhrases);
        let updatedVerifyPhrases;

        console.log('verifyPhrases');
        console.log(verifyPhrases);
        updatedVerifyPhrases = verifyPhrases.filter(x => x !== item);
        console.log('updatedVerifyPhrases');
        console.log(updatedVerifyPhrases);
        setVerifyPhrases(updatedVerifyPhrases);
    }
    console.log('navigation');
    console.log(route.params);

    return (
        <VerifyPhrase
            verifyPhrase={verifyPhrases}
            verifiedPhrases={verifiedPhrases}
            onContinuePress={onContinuePress}
            onBackIconPress={onBackIconPress}
            onTapPhrasePress={onTapPhrasePress}
            isBlackTheme={isBlackTheme}
            validated={validateSeed()}
        />
    )
}

export default VerifyPhraseScreen

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
    const [verifyPhrases, setVerifyPhrases] = useState<string[]>(route.params ? route.params.split(' ') : []);
    const onContinuePress = () => {
        navigation.navigate("CreatePin")
    }
    const onBackIconPress = () => {
        navigation.goBack()
    }

    const validateSeed = () => {
        //return route.params !== verifiedPhrases.join(' '); TODO
        return false;
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

        let updatedVerifyPhrases;

        updatedVerifyPhrases = verifyPhrases.filter(x => x !== item);
        setVerifyPhrases(updatedVerifyPhrases);
    }
    const onTapVerifiedPhrasePress = (item: any) => {
        console.log('\nonTapVerifiedPhrasePress');
        console.log(item);
        let temp = verifiedPhrases.filter(p => p !== item);
        setVerifiedPhrases(temp)
        let updatedVerifyPhrases = verifyPhrases;
        updatedVerifyPhrases.push(item);
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
            onTapVerifiedPhrasePress={onTapVerifiedPhrasePress}
            isBlackTheme={isBlackTheme}
            validated={validateSeed()}
        />
    )
}

export default VerifyPhraseScreen

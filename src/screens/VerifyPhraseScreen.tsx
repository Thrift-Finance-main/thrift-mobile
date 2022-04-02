import React, {useCallback, useMemo, useState, useContext, useEffect} from 'react'
import { useSelector } from 'react-redux';
import VerifyPhrase from '../components/VerifyPhrase'
import {createAccount} from "../lib/account";
import {Alert} from "react-native";
import {apiDb} from "../db/LocalDb";

function VerifyPhraseScreen ({ navigation, route }) {

    const isBlackTheme = useSelector((state) => state.Reducers.isBlackTheme);

    console.log('navigation in VerifyPhraseScreen');
    console.log(route.params);
    const [error, setError] = useState<string>('');
    const [verifiedPhrases, setVerifiedPhrases] = useState<string[]>([]);
    const [verifyPhrases, setVerifyPhrases] = useState<string[]>(route.params && route.params.seed ? route.params.seed.split(' ') : []);

    useEffect(() =>{

    }, []);
    // const result = useQuery("Account");

    const onContinuePress = () => {
        console.log('onContinuePress in VerifyPhraseScreen');
            // navigation.navigate("CreatePin");
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

    const createAcct2 = (data: {seed:string, name:string, passwd:string}) => {
        createAccount(data.seed,data.name,data.passwd).then(createdAccount => {
            console.log('createdAccount');
            console.log(createdAccount);

            const name = data.name;

            apiDb.addAccount(createdAccount).then(r => {
                if (r && r.error){
                    Alert.alert("Error:", r.error);
                }
            });
        });
    }

    console.log('navigation in VerifyPhraseScreen');
    console.log(route.params);

    return (
        <VerifyPhrase
            verifyPhrase={verifyPhrases}
            verifiedPhrases={verifiedPhrases}
            onContinuePress={() => createAcct2(route.params)}
            onBackIconPress={onBackIconPress}
            onTapPhrasePress={onTapPhrasePress}
            onTapVerifiedPhrasePress={onTapVerifiedPhrasePress}
            isBlackTheme={isBlackTheme}
            validated={validateSeed()}
        />
    )
}

export default VerifyPhraseScreen

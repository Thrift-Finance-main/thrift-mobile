import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import VerifyPhrase from '../components/VerifyPhrase'
import {shuffle} from "../utils";
import realmDb from "../db/RealmConfig";
import {IAccount} from "../db/model/AccountModel";
import {createAccount} from "../lib/account";

const VerifyPhraseScreen = ({ navigation, route }) => {
    const isBlackTheme = useSelector((state) => state.Reducers.isBlackTheme);

    console.log('navigation in VerifyPhraseScreen');
    console.log(route.params);
    const [error, setError] = useState<string>('');
    const [verifiedPhrases, setVerifiedPhrases] = useState<string[]>([]);
    const [verifyPhrases, setVerifyPhrases] = useState<string[]>(route.params && route.params.seed ? route.params.seed.split(' ') : []);
    const onContinuePress = () => {
        console.log('onContinuePress in VerifyPhraseScreen');
        createAcc(route.params).then(r => {
            console.log('Account');
            console.log(r);
            navigation.navigate("CreatePin");
        });
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

    const createAcc = async (accData:any) => {
        setError('');
        const accountData = accData;
        console.log('\ncreateAcc');
        console.log('accountData');
        console.log(accountData);

        const name = accountData.name;
        const passwd = accountData.passwd;
        const seed = route.params.seed;

        console.log('seed');
        console.log(seed);

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
                navigation.navigate("VerifyPhrase", seed)
            } else {
                console.log('navigate to verify');
                navigation.navigate("VerifyPhrase")
            }
        }
    }

    console.log('navigation in VerifyPhraseScreen');
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

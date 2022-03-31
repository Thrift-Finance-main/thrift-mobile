import React, {useMemo, useState} from 'react'
import { useSelector } from 'react-redux';
import VerifyPhrase from '../components/VerifyPhrase'
import {createAccount} from "../lib/account";
import {useQuery, useRealm} from "../db/models/Project";
import {Account, ACCOUNT_TABLE} from "../db/models/Account";
import {Alert} from "react-native";

const VerifyPhraseScreen = ({ navigation, route }) => {
    const isBlackTheme = useSelector((state) => state.Reducers.isBlackTheme);
    const realm = useRealm();

    console.log('navigation in VerifyPhraseScreen');
    console.log(route.params);
    const [error, setError] = useState<string>('');
    const [verifiedPhrases, setVerifiedPhrases] = useState<string[]>([]);
    const [verifyPhrases, setVerifyPhrases] = useState<string[]>(route.params && route.params.seed ? route.params.seed.split(' ') : []);

    const result = useQuery("Account");

    const onContinuePress = () => {
        console.log('onContinuePress in VerifyPhraseScreen');
        createAcc(route.params).then(r => {
            console.log('Account');
            console.log(r);
            // navigation.navigate("CreatePin");
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
        console.log('name');
        console.log(name);
        console.log('passwd');
        console.log(passwd);



        try {

            realm.write(() => {
                // check for account
                const query = `accountName == '${name}'`;
                let accountsResults = realm.objects(ACCOUNT_TABLE).filtered(query);

                console.log('accountsResults');
                console.log(accountsResults);

                if (!accountsResults.length){
                    // create account
                    createAccount(seed,name,passwd).then(createdAccount => {
                        realm.write(() => {
                            realm.create(ACCOUNT_TABLE, Account.generate({
                                accountName: createdAccount.accountName,
                                balance: createdAccount.balance,
                                tokens: createdAccount.tokens,
                                encryptedMasterKey: createdAccount.encryptedMasterKey,
                                publicKeyHex: createdAccount.publicKeyHex,
                                rewardAddress: createdAccount.rewardAddress,
                                internalPubAddress: createdAccount.internalPubAddress,
                                externalPubAddress: createdAccount.externalPubAddress,
                            }));
                            console.log('createdAccount');
                            console.log(createdAccount);
                        });
                    });
                    /*
                    let accountsResults2 = realm.objects(ACCOUNT_TABLE).filtered(query);

                    console.log('accountsResults2');
                    console.log(accountsResults2);
                     */
                }
            });
        } catch (e) {
            console.log(e);
            Alert.alert("Error Creating Account", e.message);
        }


        if (name.length) {
            /*
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

             */
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

import React, {useCallback, useMemo, useState, useContext, useEffect} from 'react'
import { useSelector } from 'react-redux';
import VerifyPhrase from '../components/VerifyPhrase'
import {createAccount} from "../lib/account";
import {realmConfig, useQuery, useRealm} from "../db/models/Project";
import {Account, ACCOUNT_TABLE} from "../db/models/Account";

function VerifyPhraseScreen ({ navigation, route }) {
    const [realm, setRealm] = React.useState(useRealm());
    const isBlackTheme = useSelector((state) => state.Reducers.isBlackTheme);

    console.log('navigation in VerifyPhraseScreen');
    console.log(route.params);
    const [error, setError] = useState<string>('');
    const [verifiedPhrases, setVerifiedPhrases] = useState<string[]>([]);
    const [verifyPhrases, setVerifyPhrases] = useState<string[]>(route.params && route.params.seed ? route.params.seed.split(' ') : []);

    useEffect(() =>{

    }, [realm]);
    // const result = useQuery("Account");

    const onContinuePress = () => {
        console.log('onContinuePress in VerifyPhraseScreen');
        createAcct2(route.params);
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

    const createAcct2 = useCallback(
        (data) => {
            createAccount(data.seed,data.name,data.passwd).then(createdAccount => {
                console.log('createdAccount');
                console.log(createdAccount);

                const name = data.name;
                const passwd = data.passwd;
                const seed = data.seed;

                realm.write(() => {
                    console.log('realm hola');
                    // check for account
                    const query = `accountName == '${name}'`;
                    let accountsResults = realm.objects(ACCOUNT_TABLE).filtered(query);
                    const e = 'oinfs';
                    const query2 = `accountName != '${e}'`;
                    let accountsResults2 = realm.objects(ACCOUNT_TABLE).filtered(query2);

                    console.log('accountsResults');
                    console.log(accountsResults);
                    console.log('accountsResults2');
                    console.log(accountsResults2);
                    // Normally when updating a record in a NoSQL or SQL database, we have to type
                    // a statement that will later be interpreted and used as instructions for how
                    // to update the record. But in RealmDB, the objects are "live" because they are
                    // actually referencing the object's location in memory on the device (memory mapping).
                    // So rather than typing a statement, we modify the object directly by changing
                    // the property values. If the changes adhere to the schema, Realm will accept
                    // this new version of the object and wherever this object is being referenced
                    // locally will also see the changes "live".
                    console.log('in realm.write');
                });
            });
            // Alternatively if passing the ID as the argument to handleToggleTaskStatus:
            // realm?.write(() => {
            //   const task = realm?.objectForPrimaryKey('Task', id); // If the ID is passed as an ObjectId
            //   const task = realm?.objectForPrimaryKey('Task', Realm.BSON.ObjectId(id));  // If the ID is passed as a string
            //   task.isComplete = !task.isComplete;
            // });
        },
        [realm]
    );


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

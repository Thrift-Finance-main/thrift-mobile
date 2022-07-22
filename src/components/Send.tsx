import React, {FC, useEffect, useRef, useState} from 'react'
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {SafeAreaView} from 'react-native-safe-area-context';
import {heightPercentageToDP, widthPercentageToDP} from '../utils/dimensions'
import Back from '../assets/back.svg'
import DarkBack from '../assets//DarkBack.svg'
import {useDispatch, useSelector} from "react-redux";
import {Button, Chip, Colors, Dialog, PanningProvider, Picker, PickerProps, TextField} from "react-native-ui-lib";
import swapIcon from "../assets/plus.png";
import removeIcon from "../assets/remove.png";
import {
    buildTransaction, classifyTx, dictToAssetsList,
    mergeAssetsFromOutputs,
    mergeAssetsFromUtxos,
    removeAssetNameFromKey, SELF_TX, SEND_TX,
    validOutputs
} from "../lib/transactions";
import {fetchBlockfrost, getProtocolParams, getTxUTxOsByAddress} from "../api/Blockfrost";
import {validateAddress} from "../lib/account";
import {addressSlice, isDictEmpty} from "../utils";
import BigNumber from "bignumber.js";
import CustomModal from "./PopUps/CustomModal";
import {apiDb} from "../db/LiteDb";
import {setCurrentAccount} from "../store/Action";
import moment from "moment";
import {ERROR_TRANSACTION} from "../constants/error";
import {translate} from "../i18n";
import Toast from "react-native-toast-message";


interface SendProps {
    // onContinuePress: () => void
    onBackIconPress: () => void
    onContinuePress: (route:string) => void
    // fromScreen: any
    isBlackTheme: any
    address?: string
}

const Send: FC<SendProps> = (props) => {
    const dispatch = useDispatch();

    const currentAccount = useSelector((state) => state.Reducers.currentAccount);
    const [availableAda, setAvailableAda] = useState(currentAccount.balance);
    const [assets, setAssets] = useState(currentAccount.assets || []);
    const [accountState, setAccountState] = useState({});
    const [utxos, setUtxos] = useState(currentAccount.utxos);
    const [availableTags, setAvailableTags] = useState([]);
    const [onClickNotTagged, setOnClickNotTagged] = useState(false);

    const [selectNotTagged, setSelectNotTagged] = useState(false);

    const [mergedUtxos, setMergedUtxos] = useState({});
    const [mergedOutputs, setMergedOutputs] = useState({});
    const [amount, setAmount] = useState('6');
    const [amountError, setAmountError] = useState(false);
    const [activeTab, setActiveTab] = useState('1');

    const [currentFee, setCurrentFee] = useState('0');
    const [password, setPassword] = useState('0');
    const [hideModal, setHideModal] = useState(true);
    const [sendTxSuccess, setSendTxSuccess] = useState(false);

    const [txError, setTxError] = useState('0');

    const [totalNotTagged, setTotalNotTagged] = useState('0');

    const selectAddr = currentAccount.externalPubAddress.filter(a => a.address === currentAccount.selectedAddress.address);  // TODO: refactor

    const [selectedTags, setSelectedTags] = useState(selectAddr[0].tags);
    const [outputs, setOutputs] = useState([
        {
            toAddress: '',
            validAddress: true,
            assets: {lovelace: '0'},
            fromTags: selectedTags,
            notTagged: selectNotTagged,
            valid: true,
            label: '1'
        }
    ])
    /*
    const [outputs, setOutputs] = useState([
        {
            toAddress: 'addr_test1qpwj2v4q7w5y9cqp4v8yvn8n0ly872aulxslq2vzckt7jdyg6rs5upesk5wzeg55yx69rn5ygh899q6lxku9h7435g0qu8ly5u',
            validAddress: true,
            assets: {lovelace: '2000000'},
            fromTags: selectedTags,
            notTagged: selectNotTagged,
            valid: true,
            label: '1'
        },
        {
            toAddress: 'addr_test1qp5ycdwcjjtpu8q4xd6x2xpj05qn0s46mqptyn0s0s7v4jep8y473768ey400nc8zyhjgaahg0k0vqgscf7mm0q08cjquwlfjh',
            validAddress: true,
            assets: {lovelace: '3000000'},
            fromTags: selectedTags,
            notTagged: selectNotTagged,
            valid: true,
            label: '2'
        }
    ]);
     */

    let currentTabData = outputs.filter(output => output.label === activeTab);
    currentTabData = currentTabData[0];

    let currentAmountInput = new BigNumber(
            currentTabData
            && currentTabData.assets
            && currentTabData.assets.lovelace || '0'
          ).dividedBy(1000000).toString();
    currentAmountInput = currentAmountInput === '0' ? '' : currentAmountInput;

    const fromTags = currentTabData && currentTabData.fromTags;
    const notTagged = currentTabData && currentTabData.notTagged;

    const isBlackTheme = props.isBlackTheme;

    const fee = new BigNumber(
        currentFee
    ).dividedBy(1000000).toString();

    const modalType = sendTxSuccess ? 'success':'password';

  // TODO: Get utxos from currentAccount, set in wallet
    const useIsMounted = () => {
        const isMounted = useRef(false);
        // @ts-ignore
        useEffect(() => {
            isMounted.current = true;
            return () => (isMounted.current = false);
        }, []);
        return isMounted;
    };

    const isMounted = useIsMounted();

    useEffect(() =>{

        if (currentAccount.utxos && currentAccount.utxos.length){
            const updatedUtxos = currentAccount.utxos.map(utxo => {
                const data = getAddrData(utxo.address, [...currentAccount.externalPubAddress, ...currentAccount.internalPubAddress]);
                if (data){
                    utxo = {...utxo, ...data};
                    return utxo;
                }
            }).filter(r => r !== undefined);
            setUtxos(updatedUtxos);

            const mergedAssetsFromUtxos = mergeAssetsFromUtxos(updatedUtxos);

            setMergedUtxos(mergedAssetsFromUtxos);

            let tags = [];   // TODO: show all tags even with no assets
            currentAccount.externalPubAddress.map(addr => {
                if (addr.tags && addr.tags.length){
                    tags = [...tags,...addr.tags]
                }
            })
            setAvailableTags(tags);

        }
        const fetchData = async () => {

            console.log('fetchData');

            let endpoint = "accounts/" + currentAccount.rewardAddress;
            let accountState = await fetchBlockfrost(endpoint);
            setAccountState(accountState);
            endpoint = endpoint + "/addresses";
            const relatedAddresses = await fetchBlockfrost(endpoint);
            if (relatedAddresses.error){
                return;
            }
            const utxos = await Promise.all(
                relatedAddresses.map(async a => {
                    const utxos = await getTxUTxOsByAddress(a.address);
                    if (utxos && !utxos.error){
                        a.utxos = utxos;
                        return a;
                    }
                })
            );

            let updatedUtxos = utxos.map(utxo => {
                const data = getAddrData(utxo.address, [...currentAccount.externalPubAddress, ...currentAccount.internalPubAddress]);
                if (data){
                    utxo = {...utxo, ...data};
                    return utxo;
                }
            }).filter(r => r !== undefined && r.utxos.length);

            console.log('\n\nupdatedUtxos');
            console.log(updatedUtxos);
            setUtxos(updatedUtxos);

            const mergedAssetsFromUtxos = mergeAssetsFromUtxos(updatedUtxos);

            console.log('\n\nmergedUtxos');
            console.log(mergedAssetsFromUtxos);

            console.log(mergedUtxos);

            let tags = [];   // TODO: show all tags even with no assets
            currentAccount.externalPubAddress.map(addr => {
                if (addr.tags && addr.tags.length){
                    tags = [...tags,...addr.tags]
                }
            });
            setAvailableTags(Array.from(tags));

            // Get/show tags based on addresses in utxos array
            // Select tags from where get the ada and assets,
            // verify in enough amount in selected utxos, alert

            await mergeAssets();
            const notTaggedUtxos = updatedUtxos.filter((utxo) => utxo && utxo.tags && !utxo.tags.length && utxo.utxos);
            setTotalNotTagged(notTaggedUtxos.length.toString());
        }

        if (isMounted.current) {
            // call the function
            fetchData()
                // make sure to catch any error
                .catch(console.error);
        }

    }, []);

    const getAddrData = (address, addresses) => {
        for (let i = 0; i < addresses.length; i++) {
           if (address === addresses[i].address){
               return addresses[i];
           }
        }
    }

    const validateDecimals= (text, decimals) => {
        if (text.includes('.')) {
            text = text.split('.');
            return text[text.length-1].length <= decimals // get last element
        }
        return true;
    }

    const validateOutputs = () => {

        console.log('\n\nvalidateOutputs');

        let updatedOutputs = [];
        for (let output of outputs) {
            // outputs that have tags in common
            const commonOutputs = outputs.filter(out => out.fromTags.some(tag => output.fromTags.includes(tag)) || (output.notTagged && out.notTagged === output.notTagged));
            // utxos from currentOutput
            let filterUtxosFromCurrentOutput = utxos.filter(utxo => utxo.tags.some(tag => output.fromTags.includes(tag)));
            if (output.notTagged){
                const notTaggedUtxos = utxos.filter((utxo) => !utxo.tags.length);
                filterUtxosFromCurrentOutput = [...filterUtxosFromCurrentOutput,...notTaggedUtxos]
            }

            const mergedAssetsFromUtxosCurrentOutput = mergeAssetsFromUtxos(filterUtxosFromCurrentOutput);
            // TODO: fix validation
            const isolatedOutputIsValid = validOutputs(mergedAssetsFromUtxosCurrentOutput, output.assets);

            if (!isolatedOutputIsValid){
                output.valid = false;
            } else {

                let filterUtxos = utxos.filter(utxo => utxo.tags.some(tag => commonOutputs.some(out => out.fromTags.includes(tag))));

                // utxos from commonOutputs

                const mergedAssetsFromCommonOutputs = mergeAssetsFromOutputs(commonOutputs);
                // if the current output has notTagged selected

                let includeNoTagged = commonOutputs.some(out => out.notTagged);
                if (includeNoTagged){
                    const notTaggedUtxos = utxos.filter((utxo) => !utxo.tags.length);
                    filterUtxos = [...filterUtxos,...notTaggedUtxos]
                }

                const mergedAssetsFromUtxos = mergeAssetsFromUtxos(filterUtxos);
                const outputsAreValid = validOutputs(mergedAssetsFromUtxos, mergedAssetsFromCommonOutputs);
                output.valid = outputsAreValid;
            }
            updatedOutputs.push(output)
        }
        setOutputs(updatedOutputs);
    }
    const updateOutput = async (output) => {
        let updatedOutputs = outputs.map(out =>{
            if (out.label === output.label){
                out = output;
            }
            return out;
        });
        setOutputs(updatedOutputs);

        validateOutputs();

        if (outputsAreValid()){
            await buildTx();
        }
    }

    const outputsAreValid = () => {
        const txNotValid = txError.length > 1;
        console.log('txNotValid');
        console.log(txNotValid);
        const outputsAreValid = !txNotValid && !(outputs.some(out => !out.valid) || new BigNumber(mergedOutputs.lovelace || 0).dividedBy(1000000).toString() === '0');
        console.log('outputsAreValid');
        console.log(outputsAreValid);
        return outputsAreValid;
    }
    const mergeAssets = async () => {

        console.log('\n\n\nmergeAssets');
        setTxError('');

        const updatedUtxos = currentAccount.utxos.map(utxo => {
            const data = getAddrData(utxo.address, [...currentAccount.externalPubAddress, ...currentAccount.internalPubAddress]);
            if (data){
                utxo = {...utxo, ...data};
                return utxo;
            }
        }).filter(r => r !== undefined);

        const taggedUtxos = updatedUtxos.filter((utxo) => utxo.tags.length);

        console.log('taggedUtxos');
        console.log(taggedUtxos);
        console.log('updatedUtxos');
        console.log(updatedUtxos);

        const utxosFromSelectedTag = taggedUtxos.filter((utxo) => utxo.tags.length && utxo.tags.some(t =>
            currentTabData && currentTabData.fromTags.includes(t)
        ));

        console.log('utxosFromSelectedTag');
        console.log(utxosFromSelectedTag);

        let joinUtxos = utxosFromSelectedTag;
        if (currentTabData && currentTabData.notTagged){
            const notTaggedUtxos = utxos.filter((utxo) => !utxo.tags.length);
            joinUtxos = [...joinUtxos,...notTaggedUtxos];
        }

        const mergedAssetsFromUtxos = mergeAssetsFromUtxos(joinUtxos);

        setMergedUtxos(mergedAssetsFromUtxos);
        let availableAdaOnSelectedUtxos =
            mergedAssetsFromUtxos
            && mergedAssetsFromUtxos.lovelace
            && mergedAssetsFromUtxos.lovelace.length
            && mergedAssetsFromUtxos.lovelace !== '0' ?
            new BigNumber(mergedAssetsFromUtxos.lovelace || 0).dividedBy(1000000).toString() : '0';

        setAvailableAda(availableAdaOnSelectedUtxos)

        const filterOutputs = outputs.map(output => {
            output.assets = Object.entries(output.assets).reduce((acc, [k, v]) => v ? {...acc, [k]:v} : acc , {})
            return output;
        }).filter(output => !isDictEmpty(output.assets));
        const mergedAssetsFromOutputs = mergeAssetsFromOutputs(filterOutputs);
        setMergedOutputs(mergedAssetsFromOutputs);

        validateOutputs();

        if (outputsAreValid()){
            await buildTx();
        }

    }
    const buildTx = async () => {
        console.log('buildTx');
        setTxError('');
        const protocolParameters =  await getProtocolParams();
        // Remove empty assets and filter outputs with no assets
        const filterOutputs = outputs.map(output => {
            output.assets = Object.entries(output.assets).reduce((acc, [k, v]) => v ? {...acc, [k]:v} : acc , {})
            return output;
        }).filter(output => !isDictEmpty(output.assets));

        console.log('\n\n\nsendTransaction');

        let filterUtxos = utxos.filter((utxo) => utxo.tags.length && utxo.tags.some(t =>
            outputs.some(out => out.fromTags.includes(t))
        ));

        if (outputs.some(out => out.notTagged)){
            const notTaggedUtxos = utxos.filter((utxo) => !utxo.tags.length);
            filterUtxos = [...filterUtxos,...notTaggedUtxos]
        }
        const tx = await buildTransaction(currentAccount, accountState, filterUtxos, filterOutputs, protocolParameters);
        if (tx && tx.error){
            console.log('tx.error');
            console.log(tx.error);
            setTxError(tx.error);
            return;
        } else {
            setTxError('');
        }

        console.log('buildTx fee');
        setCurrentFee(tx.fee);

        console.log('buildTx ends');
    }
    const confirmTransaction = async () => {
        const protocolParameters =  await getProtocolParams();
        // Remove empty assets and filter outputs with no assets
        const filterOutputs = outputs.map(output => {
            output.assets = Object.entries(output.assets).reduce((acc, [k, v]) => v ? {...acc, [k]:v} : acc , {})
            return output;
        }).filter(output => !isDictEmpty(output.assets));

        console.log('\n\n\nsendTransaction');

        let filterUtxos = utxos.filter((utxo) => utxo.tags.length && utxo.tags.some(t =>
            outputs.some(out => out.fromTags.includes(t))
        ));

        if (outputs.some(out => out.notTagged)){
            const notTaggedUtxos = utxos.filter((utxo) => !utxo.tags.length);
            filterUtxos = [...filterUtxos,...notTaggedUtxos]

        }
        const pass = password || null;
        console.log('pass');
        console.log(pass);
        const currAcc = currentAccount;
        const tx = await buildTransaction(currAcc, accountState, filterUtxos, filterOutputs, protocolParameters, pass);
        if (tx && tx.error){
            console.log("Error on send tx")
            console.log(tx.error);
            setSendTxSuccess(false);
            return;
        } else {
            console.log('tx.mergedOutputs');
            console.log(tx.mergedOutputs);
            setSendTxSuccess(true);
            addTxToDb(currAcc, tx, filterUtxos, filterOutputs).then(()=>
            {
                setTimeout(
                    () => {
                        handleHideModal();
                        props.onContinuePress("Wallet");
                    },
                    4000
                );
            });
        }

    }
    const sendTransaction = async () => {
        setTxError('');
        handleHideModal();
    };
    const addTxToDb = async (currAcc, tx, inputs, outputs) => {

        console.log('\n\naddTxToDb');
        let account = await apiDb.getAccount(currAcc.accountName);
        let pendingTxs = account.pendingTxs || [];
        console.log('tx');
        console.log(tx);

        const allAddresses = [...currentAccount.externalPubAddress,...currentAccount.internalPubAddress]
        console.log("Inputs");
        let otherAddressesInput: { address: any; amount: {}; }[] = [];
        let usedAddressesInput: { address: any; amount: { quantity: string; unit: string; }[]; }[] = [];

        inputs.map(input => {
            const isOwnAddress = allAddresses.some(addr => addr.address === input.address);
            console.log('input.assets');
            console.log(input.assets);
            const amount = input.assets && Object.keys(input.assets).length ? dictToAssetsList(input.assets) : {};
            if (isOwnAddress){
                usedAddressesInput.push({
                    address: input.address,
                    amount
                });
            } else {
                otherAddressesInput.push({
                    address: input.toAddress,
                    amount
                });
            }
        });

        let otherAddressesOutput: { address: any; amount: { quantity: string; unit: string; }[]; }[] = [];
        let usedAddressesOutput: { address: any; amount: { quantity: string; unit: string; }[]; }[] = [];
        console.log("Outputs");
        outputs.map(output => {
            const isOwnAddress = allAddresses.some(addr => addr.address === output.toAddress);
            const assets = output.assets || {};
            const amount = dictToAssetsList(assets);
            if (isOwnAddress){
                usedAddressesOutput.push({
                    address: output.toAddress,
                    amount
                });
            } else {
                otherAddressesOutput.push({
                    address: output.toAddress,
                    amount
                });
            }
        });

        let type = SELF_TX;
        if (!otherAddressesInput.length && otherAddressesOutput.length){
            type = SEND_TX
        }

        let pendingTx = {
            txHash: tx.txHash,
            blockTime: moment().utc(),
            fees: tx.fee,
            status: "pending",
            inputs: {
                otherAddresses: otherAddressesInput,
                usedAddresses: usedAddressesInput
            },
            outputs: {
                otherAddresses: otherAddressesOutput,
                usedAddresses: usedAddressesOutput
            },
            amount: {
                lovelace: tx.mergedOutputs["lovelace"]
            },
            type
        }

        console.log('pendingTx');
        console.log(pendingTx);
        console.log('otherAddressesInput');
        console.log(otherAddressesInput);
        console.log('\n\n\n---------------------------------------');
        console.log('\n\n\nusedAddressesInput');
        console.log(usedAddressesInput);
        console.log('otherAddressesOutput');
        console.log(otherAddressesOutput);
        console.log('usedAddressesOutput');
        console.log(usedAddressesOutput);

        pendingTxs.push(pendingTx);

        account.pendingTxs = pendingTxs;
        await apiDb.updateAccount(account);
        dispatch(setCurrentAccount(account));
    };
    const handleSetPassword = async (pass:string) => {
        setPassword(pass);
    };
    const updateSelectedAssets = async asset => {
        let outputAux = outputs.filter(output => output.label === activeTab);
        outputAux = outputAux[0];
        outputAux.assets[asset.unit] = '';
        const updatedOutputs = outputs.map(output => {
            if (output.label === activeTab){
                output = outputAux;
            }
            return output;
        })

        setOutputs(updatedOutputs);
    };
    const updateQuantityFromSelectedAsset = async (unit, quantity) => {

        if (amount === ''){
            return;
        }
        let q = new BigNumber(quantity);
        const validAmount = !q.isNaN() && q.isFinite();
        const validDecimals = validateDecimals(quantity,6);

        if (!validAmount || !validDecimals){
            let currentTab = currentTabData;
            currentTab.valid = false;
            await updateOutput(currentTab);
            return;
        }

        let outputAux = outputs.filter(output => output.label === activeTab);
        outputAux = outputAux[0];

        const updatedAssets = Object.entries(outputAux.assets).map(keyValuePair => {
            if (keyValuePair[0] === unit) {
                keyValuePair[1] = quantity;
            }
            return keyValuePair;
        });
        const dict = {};
        updatedAssets.map(asset =>{
            dict[asset[0]] = asset[1];
        })

        outputAux.assets = dict;
        outputs.map(output => {
            if (output.label === activeTab){
                output = outputAux;
            }
            return output;
        });
        setOutputs(outputs);
        await mergeAssets();
    };
    const removeSelectedAssets = async unit => {

        let outputAux = outputs.filter(output => output.label === activeTab);
        outputAux = outputAux[0];
        const updatedAssets = Object.entries(outputAux.assets).filter(keyValuePair => {
            return keyValuePair[0] !== unit;
        });
        const dict = {};
        updatedAssets.map(asset =>{
            dict[asset[0]] = asset[1];
        })
        outputAux.assets = dict;

        const updatedOutputs = outputs.map(output => {
            if (output.label === activeTab){
                output = outputAux;
            }
            return output;
        });
        setOutputs(updatedOutputs);
        validateOutputs();
    };

    useEffect(() => {
        mergeAssets().then(()=>{});
    }, [fromTags, notTagged, selectedTags.length, selectNotTagged, outputs.length]);

    const onSelectTag = (tag) => {
        const updatedOutputs = outputs.map(out => {
            if (out.label === activeTab){
                out.fromTags = [tag]
            }
            return out;
        })
        setOutputs(updatedOutputs);
    };

    const copyToClipboard = async text => {
        await Clipboard.setString(text);
    };
    const onPressLongTag = (tag) => {
        let address = currentAccount.externalPubAddress.filter(addr => addr.tags.includes(tag));
        address = address[0];
        copyToClipboard(address.address).then(r=>{
            Toast.show({
                type: 'info',
                text1: tag+' Address Copied '+addressSlice(address.address, 10),
                autoHide: true,
                visibilityTime: 2500
            });
        })
    };

    const onSelectNotTagged = () => {
        const updatedOutputs = outputs.map(out => {
            if (out.label === activeTab && totalNotTagged > 0){
                out.notTagged = !out.notTagged;
            }
            return out;
        })
        mergeAssets().then(()=>  setOutputs(updatedOutputs));
    };
    const onAddRecipient = () => {
        if (outputs.length < 12){
            let newLabel = outputs[outputs.length-1];
            // setTabs(tabs);
            const obj = {
                label: (parseInt(newLabel.label)+1).toString(),
                validAddress: true,
                assets: {lovelace: ''},
                fromTags: (outputs.filter(out => out.label === newLabel.label))[0].fromTags,
                notTagged: (outputs.filter(out => out.label === newLabel.label))[0].notTagged,
                valid: true,
                toAddress: 'addr_test1qpwj2v4q7w5y9cqp4v8yvn8n0ly872aulxslq2vzckt7jdyg6rs5upesk5wzeg55yx69rn5ygh899q6lxku9h7435g0qu8ly5u'
            };

            setOutputs(prevTabs => ([...prevTabs, ...[
                obj
            ]]));
            setActiveTab((parseInt(newLabel.label)+1).toString());
        }
    };
    const onRemoveRecipient = (label:string) => {
        if (label !== '1' || outputs.length > 1){
            let updatedOutputs = outputs.filter(tab => tab.label !== label);
            for(let i=0; i < updatedOutputs.length; i++){
                updatedOutputs[i].label = (i+1).toString();
            }
            let nextTab;

            if (activeTab !== label){
                if (label === '1'){
                    nextTab = (parseInt(activeTab)-1).toString()
                } else {
                    if (activeTab < label){
                        nextTab = activeTab
                    } else {
                        nextTab = (parseInt(activeTab)-1).toString()
                    }
                }
            }
            else if (activeTab === label && activeTab === '1'){
                nextTab = '1'
            } else  {
                nextTab = (parseInt(label)-1).toString();
            }
            setActiveTab(nextTab);
            setOutputs(updatedOutputs);
        }
    };
    const setToAddr = async (address) => {

        // add new tx template to tx list
        //  '1st 2nd 3rd 4th'.
        const validAddress = await validateAddress(address);
        let outputAux = outputs.filter(output => output.label === activeTab);
        outputAux = outputAux[0];
        if (!validAddress && address !== ''){
            outputAux.validAddress = false;
        } else {
            outputAux.validAddress = true;
        }
        outputAux.toAddress = address;
        outputs.map(output => {
            if (output.label === activeTab){
                output = outputAux;
            }
            return output;
        });
        setOutputs(outputs);
    };
    const setInputAmount= (amount) => {
        if (amount === ''){
            return;
        }
        if (amount.includes('.')){
            let c = amount.split('.');
            if (c[1].length > 6){
                // Get current tab
                let currentTab = currentTabData;
                currentTab.valid = false;
                updateOutput(currentTab).then(()=>{});
                return;
            }
        }
        let f = new BigNumber(amount);
        const validAmount = !f.isNaN(amount) && f.isFinite(amount);

        if (!validAmount && amount !== ''){
            setAmountError(true);
        } else {
            setAmountError(false);
            let outputAux = outputs.filter(output => output.label === activeTab);
            outputAux = outputAux[0];
            try {
                 // patch remove zero in the left
                const float = f.multipliedBy(1000000).toString();
                outputAux.assets.lovelace = float;
                outputs.map(output => {
                    if (output.label === activeTab){
                        output = outputAux;
                    }
                    return output;
                });
                setOutputs(outputs);

            } catch (e) {

            }
        }
        mergeAssets().then(()=>{});
    };

    const handleHideModal = () => {
        setHideModal(!hideModal);
    }

    const renderDialog: PickerProps['renderCustomModal'] = modalProps => {
        const {visible, children, toggleModal, onDone} = modalProps;

        return (
            <Dialog
                visible={visible}
                onDismiss={() => {
                    onDone();
                    toggleModal(false);
                }}
                width="100%"
                height="25%"
                bottom
                useSafeArea
                containerStyle={{backgroundColor: props.isBlackTheme ? Colors.black : Colors.white }}
                panDirection={PanningProvider.Directions.DOWN}
                pannableHeaderProps={{}}
            >
                <ScrollView>
                    <Text style={{...styles.addressList, ...styles.addressListTitle, color: props.isBlackTheme ? Colors.white : Colors.black}}>
                        {translate("Send.SelectAsset")}
                    </Text>
                    <View
                        style={{
                            borderBottomColor: 'grey',
                            borderBottomWidth: 1,
                        }}
                    />
                    {children}
                </ScrollView>
            </Dialog>
        );
    };

    const mergedLovelace =  new BigNumber(mergedUtxos.lovelace || 0).dividedBy(1000000).toString();

    const listOfAssets = Object.entries(mergedUtxos).filter(a => a[0] !== 'lovelace');
    const filterAssets = assets && assets.length && assets.filter(a => listOfAssets.some(l => l[0] === a.unit)) || [];
    return (
        <SafeAreaView style={{
            ...styles.mainContainer, backgroundColor:
                props.isBlackTheme ? Colors.black :
                    Colors.white,
        }}>
            <ScrollView>
                <View style={styles.secondaryContainer}>
                    {
                        props.isBlackTheme ?
                            <DarkBack
                                style={{ marginTop: heightPercentageToDP(3) }}
                                onPress={props.onBackIconPress}
                            />
                            : <Back
                                style={{ marginTop: heightPercentageToDP(3) }}
                                onPress={props.onBackIconPress}
                            />
                    }

                    {/*
                    <Text
                        style={{
                            ...styles.topTitle, color: props.isBlackTheme ? Colors.white : Colors.black,
                        }}
                    >Send Assets</Text>
                    */}
                    <View
                        style={{}}
                    >
                        <Text
                            style={{
                                ...styles.fromAccount, color: props.isBlackTheme ? Colors.white :
                                    Colors.black,
                            }}
                            onPress={() => setAmount(mergedLovelace)}
                        > {translate("Send.From")} <Text style={{fontFamily: 'AvenirNextCyr-Demi', fontSize: 18}}>{currentAccount.accountName} {mergedLovelace}</Text> Ada</Text>
                        <View
                            style={{flexDirection:'row', flexWrap:'wrap', marginTop: 8, marginLeft: 12}}
                        >
                            <Chip
                                key={'all'}
                                label={translate("Send.NotTagged")}
                                onPress={onSelectNotTagged}
                                containerStyle={{
                                    marginRight: 4,
                                    marginVertical: 2,
                                    backgroundColor: 'white',
                                    borderWidth:  currentTabData && currentTabData.notTagged ? 2 : 1,
                                    borderColor:
                                        currentTabData && currentTabData.notTagged ? '#603EDA' : 'gray',
                                }}
                                badgeProps={{
                                    label: totalNotTagged || '0',
                                    backgroundColor: '#603EDA',
                                }}
                                labelStyle={{fontFamily: 'AvenirNextCyr-Medium', fontSize: 14}}
                            />
                            {
                                availableTags.map((tag,index) => {
                                   return <Chip
                                       key={tag+index}
                                       label={tag}
                                       onPress={() => onSelectTag(tag)}
                                       onLongPress={() => onPressLongTag(tag)}
                                       containerStyle={{
                                           marginVertical: 2,
                                           marginRight: 4,
                                           backgroundColor: 'white',
                                           borderWidth: currentTabData && currentTabData.fromTags.includes(tag) ? 2 : 1,
                                           borderColor: currentTabData && currentTabData.fromTags.includes(tag) ? '#F338C2' : 'black',
                                       }}
                                       labelStyle={{fontFamily: 'AvenirNextCyr-Medium', fontSize: 14}}
                                   />
                               })

                            }
                        </View>

                    </View>


                    <View style={styles._tabs_main}>
                        {
                            outputs.map(tab =>{
                                return <TouchableOpacity
                                    style={
                                        activeTab === tab.label ? styles._active_tab : styles._tab
                                    }
                                    onLongPress={() => onRemoveRecipient(tab.label)}
                                    onPress={() => setActiveTab(tab.label)}>
                                    <Text
                                        style={{...
                                                activeTab === tab.label
                                                    ? styles._active_tab_text
                                                    : styles._tab_text,
                                            fontSize: !tab.valid ? 16 : 14,
                                            color: !tab.valid ? 'red' : 'black',
                                            fontFamily: 'AvenirNextCyr-Medium'
                                        }}>
                                        {tab.label}
                                    </Text>
                                </TouchableOpacity>
                            })
                        }
                        {
                            outputs.length < 12 ?
                                <TouchableOpacity
                                    style={activeTab === 'AddRecipient' ? styles._active_tab : styles._tab}
                                    onPress={() => onAddRecipient()}>
                                    <Text
                                        style={{...
                                                activeTab === 'AddRecipient'
                                                    ? styles._active_tab_text
                                                    : styles._tab_text,
                                                fontFamily: 'AvenirNextCyr-Medium'
                                        }}
                                    >
                                        {outputs.length < 8 ? translate("Send.New") : '' }✚
                                    </Text>
                                </TouchableOpacity>
                            : null
                        }
                    </View>

                    <Text
                        style={{
                            ...styles.filedHeader, color: props.isBlackTheme ? Colors.white :
                                Colors.black,
                        }}
                    >{translate("Send.To")}</Text>
                    <TextField
                        text70
                        containerStyle={{marginBottom: 1, marginLeft: 12}}
                        style={{
                                textAlign: 'center',
                                marginLeft: 20,
                                marginRight: 20,
                                fontSize: 10,
                                fontFamily: 'AvenirNextCyr-Medium',
                                color: props.isBlackTheme ? Colors.white : Colors.black
                        }}
                        value={currentTabData && currentTabData.toAddress || null}
                        placeholder={"Address"}
                        onChangeText={(text) =>{setToAddr(text).then(r => {})}}
                        useBottomErrors
                        validate={[(text) => currentTabData && currentTabData.validAddress]}
                        errorMessage={"Invalid address"}
                        selectTextOnFocus={true}
                        rightButtonProps={{
                            //iconSource: pasteIcon,
                            //onPress: () => fetchCopiedText(),
                            accessibilityLabel: 'TextField Info',
                            iconColor: Colors.black
                        }}
                    />
                    <Text
                        style={{
                            ...styles.filedHeader, color: props.isBlackTheme ? Colors.white :
                                Colors.black,
                        }}
                    >{translate("Send.Amount")}</Text>
                    <TextField
                        text70
                        containerStyle={{marginBottom: 1, marginLeft: 12}}
                        style={{
                            textAlign: 'center',
                            fontSize: 28,
                            fontFamily: 'AvenirNextCyr-Medium',
                            color: props.isBlackTheme ? Colors.white : Colors.black
                        }}
                        value={currentAmountInput || null}
                        placeholder={'$Ada'}
                        onChangeText={(text) => {setInputAmount(text)}}
                        useBottomErrors
                        validate={['required', (text) => !isNaN(text), (text) => parseFloat(amount)*1000000, (text) => validateDecimals(text,6)]}
                        errorMessage={"Invalid amount"}
                    />
                    <Text
                        style={{
                            ...styles.filedHeader,
                            color: props.isBlackTheme ? Colors.white :
                                Colors.black,
                        }}                    >{translate("Send.Assets")}</Text>
                    <View
                        style={{marginBottom: 1, marginLeft: 12}}
                    >
                        <Picker
                            placeholder={filterAssets && filterAssets.length ? translate("Send.AddAsset")+'('+filterAssets.length+')' : translate("Send.NoAssets")}
                            onChange={item => {
                                updateSelectedAssets(item).then(r => {})
                            }}
                            mode={Picker.modes.SINGLE}
                            rightIconSource={swapIcon}
                            renderCustomModal={renderDialog}
                            editable={filterAssets && filterAssets.length > 0}
                            style={{color: 'black', fontSize: 14, textAlign: 'center', marginLeft: 28, fontFamily: 'AvenirNextCyr-Medium'}}
                        >
                            {filterAssets && filterAssets.length ? filterAssets.map((asset,index) => (
                                <Picker.Item
                                    key={asset+index}
                                    value={asset}
                                    label={''}
                                    labelStyle={styles.addressList}
                                    renderItem={(a, props) => {
                                        const assetName = asset.asset_name;
                                        return (
                                            <View style={{
                                                flex: 1,
                                                height: 46
                                            }}>

                                                <Text style={{
                                                    ...styles.addressList,
                                                    color: isBlackTheme? Colors.white : Colors.black
                                                }}>

                                                    {Buffer.from(assetName, 'hex').toString()}
                                                </Text>
                                                <Text style={{
                                                    ...styles.addressListTags,
                                                    color: isBlackTheme ? Colors.white : Colors.black
                                                }}>
                                                    {asset.quantity}
                                                </Text>
                                            </View>
                                        );
                                    }}
                                />
                            ))
                            : null}
                        </Picker>
                    </View>

                    {   currentTabData && currentTabData.assets ?
                        Object.entries(currentTabData.assets).map(keyValuePair => {
                            if (keyValuePair[0] !== 'lovelace')
                            {
                                const assetName =  keyValuePair[0].slice(56,keyValuePair[0].length)
                                const unit = keyValuePair[0];


                                    return <View
                                        style={{flexDirection:'row', flexWrap:'wrap', paddingHorizontal: widthPercentageToDP(3)}}
                                    >
                                        <TextField
                                            containerStyle={{width: 330, marginHorizontal: 6,  fontFamily: 'AvenirNextCyr-Medium'}}
                                            floatingPlaceholder
                                            placeholder={Buffer.from(assetName, 'hex').toString() }
                                            value={keyValuePair[1]}
                                            onChangeText={(value) => updateQuantityFromSelectedAsset(unit, value)}
                                            helperText="this is an helper text"
                                            rightButtonProps={{
                                                iconSource: removeIcon,
                                                onPress: () => removeSelectedAssets(unit),
                                                accessibilityLabel: 'TextField Info',
                                                iconColor: Colors.red10
                                            }}
                                            useBottomErrors
                                            validate={['required']}
                                            errorMessage={"Invalid amount"}
                                        />

                                    </View>
                                }
                            })
                            : null
                    }
                    <View
                        style={{ height: heightPercentageToDP(4)}}
                    />

                    <Text style={{color: 'black', padding:4, textAlign: 'center', fontSize: 12, fontWeight: 'bold'}}>
                        {txError.length > 1 ? txError : ''}
                    </Text>

                        <Button
                            backgroundColor={"#F338C2"}
                            onPress={() => sendTransaction()}
                            disabled={!outputsAreValid()}
                        >
                            <Text style={{color: 'white', padding:4, fontSize: 16,  fontFamily: 'AvenirNextCyr-Medium'}}>
                                <Text style={{color: 'white', padding:4, textAlign: 'center', fontSize: 20, fontWeight: 'bold'}}>
                                    {translate("Send.Send")}{'\n'}
                                </Text>
                                <Text style={{color: 'white', padding:4, fontSize: 16,  fontFamily: 'AvenirNextCyr-Medium'}}>
                                    Ada{' '}{new BigNumber(mergedOutputs.lovelace || 0).dividedBy(1000000).toString()}{' | '}
                                </Text>
                                {
                                    Object.keys(mergedOutputs).length-1 > 0 ?
                                        <Text style={{color: 'white', padding:4, fontSize: 16,  fontFamily: 'AvenirNextCyr-Medium'}}>
                                            {translate("Send.Assets")}{' ('}{Object.keys(mergedOutputs).length-1}{') | '}
                                        </Text>
                                    : null
                                }
                                <Text style={{color: 'white', padding:4, fontSize: 16, fontFamily: 'AvenirNextCyr-Medium'}}>
                                    {translate("TransactionDetails.Fee")} {fee}
                                </Text>

                            </Text>
                        </Button>
                    </View>
                    <View
                        style={{height: heightPercentageToDP(4)}}
                    />
                    <CustomModal
                        isBlackTheme={props.isBlackTheme}
                        visible={!hideModal}
                        hideModal={() => confirmTransaction()}
                        justHideModal={() => setHideModal(true)}
                        security={modalType}
                        inputText={modalType !== 'success'}
                        typePassword={true}
                        buttonDisabled={modalType === 'success'}
                        placeholder={"IntroduceSpendingPassword"}
                        error={txError}
                        handleInputText={(pass:string) => handleSetPassword(pass)}
                        showCancel={true}
                    />
            </ScrollView>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        width: "100%"
    },
    imageStyle: {
        width: widthPercentageToDP(100),
        height: heightPercentageToDP(30),
        alignSelf: "center"
    },
    secondaryContainer: {
        paddingHorizontal: widthPercentageToDP(6)
    },
    topTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: heightPercentageToDP(5),
        letterSpacing: 1,
        paddingHorizontal: widthPercentageToDP(2.5),
        fontFamily: 'AvenirNextCyr-Medium'
    },
    filedHeader: {
        fontSize: 14,
        letterSpacing: 1,
        paddingHorizontal: widthPercentageToDP(2.5),
        paddingVertical: heightPercentageToDP(1.5),
        fontFamily: 'AvenirNextCyr-Demi'
    },
    fromAccount: {
        fontSize: 14,
        marginTop: heightPercentageToDP(2.5),
        letterSpacing: 1,
        paddingHorizontal: widthPercentageToDP(2.5),
        fontFamily: 'AvenirNextCyr-Medium'
    },
    hintStyle: {
        color: Colors.hintsColor,
        fontSize: 10,
        paddingHorizontal: widthPercentageToDP(2),
        marginTop: heightPercentageToDP(2),
        fontFamily: 'AvenirNextCyr-Medium'
    },
    addressList: {
        textAlign: 'center',
        fontSize: 12,
        marginTop: heightPercentageToDP(1),
        fontFamily: 'AvenirNextCyr-Medium'
    },
    addressListTags: {
        textAlign: 'center',
        fontSize: 10,
        opacity: 0.8,
        marginBottom: heightPercentageToDP(2),
        fontFamily: 'AvenirNextCyr-Medium'
    },
    addressListTitle: {
        marginBottom: heightPercentageToDP(1),
        fontFamily: 'AvenirNextCyr-Demi'
    },
    _tabs_main: {
        backgroundColor: '#e9eeff',
        marginTop: 10,
        borderRadius: 100,
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    _active_tab: {
        backgroundColor: '#fff',
        elevation: 1,
        borderRadius: 100,
        height: 30,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    _active_tab_text: {
        color: '#000',
        textTransform: 'uppercase',
        fontSize: 12,
        fontFamily: 'AvenirNextCyr-Heavy'
    },
    _tab: {
        backgroundColor: '#e9eeff',
        borderRadius: 100,
        height: 30,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    _tab_text: {
        color: 'gray',
        textTransform: 'uppercase',
        fontSize: 12,
        fontFamily: 'AvenirNextCyr-Demi'
    }
})
export default Send;

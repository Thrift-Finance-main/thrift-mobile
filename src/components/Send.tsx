import React, {FC, useEffect, useRef, useState} from 'react'
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {SafeAreaView} from 'react-native-safe-area-context';
import {heightPercentageToDP, widthPercentageToDP} from '../utils/dimensions'
import Back from '../assets/back.svg'
import DarkBack from '../assets//DarkBack.svg'
import {useSelector} from "react-redux";
import {Button, Chip, Colors, Dialog, PanningProvider, Picker, PickerProps, TextField} from "react-native-ui-lib";
import swapIcon from "../assets/plus.png";
import removeIcon from "../assets/remove.png";
import {buildTransaction, mergeAssetsFromOutputs, mergeAssetsFromUtxos, validOutputs} from "../lib/transactions";
import {fetchBlockfrost, getProtocolParams, getTxUTxOsByAddress} from "../api/Blockfrost";
import {validateAddress} from "../lib/account";
import {isDictEmpty} from "../utils";
import BigNumber from "bignumber.js";


interface CreateTokenProps {
    // onContinuePress: () => void
    onBackIconPress: () => void
    // fromScreen: any
    isBlackTheme: any
    address?: string
}

const Send: FC<CreateTokenProps> = (props) => {
    const currentAccount = useSelector((state) => state.Reducers.currentAccount);
    const [availableAda, setAvailableAda] = useState(currentAccount.balance);
    const [assets, setAssets] = useState(currentAccount.assets || []);
    const [selectedAssets, setSelectedAssets] = useState([]);
    const [accountState, setAccountState] = useState({});
    const [utxos, setUtxos] = useState(currentAccount.utxos);
    const [availableTags, setAvailableTags] = useState([]);

    const [selectAll, setSelectAll] = useState(false);
    const [selectNotTagged, setSelectNotTagged] = useState(false);

    const [mergedUtxos, setMergedUtxos] = useState({});
    const [mergedOutputs, setMergedOutputs] = useState({});
    const [mergedDiff, setMergedDiff] = useState({});

    const [toAddress, setToAddress] = useState('addr_test1qpwj2v4q7w5y9cqp4v8yvn8n0ly872aulxslq2vzckt7jdyg6rs5upesk5wzeg55yx69rn5ygh899q6lxku9h7435g0qu8ly5u');
    const [toAddressError, setToAddressError] = useState(false);
    const [amount, setAmount] = useState('6');
    const [amountError, setAmountError] = useState(false);
    const [activeTab, setActiveTab] = useState('1');

    let totalUtxos = 0;
    utxos.map(acc => {
        if (acc.utxos && acc.utxos.length){
            totalUtxos++;
        }
    })
    const notTaggedUtxos = (utxos.filter((utxo) => !utxo.tags.length)).length;
    const [totalNotTagged, setTotalNotTagged] = useState(notTaggedUtxos);
    /*
         1. if Selected address has tag, show and select its tag. Change from selected address and others(if selected) to selected address.
         2. if Selected address has NOOO tag, show and select Global tag. Change from global & others(if selected) to global.
         3.

         modelar los merged outputs para que ir construyendo el input-output
         construir los ooutputs-receipt con su origen
     */

    const selectAddr = currentAccount.externalPubAddress.filter(a => a.address === currentAccount.selectedAddress.address);  // TODO: refactor

    const [selectedTags, setSelectedTags] = useState(selectAddr[0].tags);
    const [outputs, setOutputs] = useState([
        {
            toAddress: 'addr_test1qpwj2v4q7w5y9cqp4v8yvn8n0ly872aulxslq2vzckt7jdyg6rs5upesk5wzeg55yx69rn5ygh899q6lxku9h7435g0qu8ly5u',
            validAddress: true,
            assets: {lovelace: ''},
            fromTags: selectedTags,
            notTagged: selectNotTagged,
            valid: true,
            label: '1'
        }
    ]);

    let currentTabData = outputs.filter(output => output.label === activeTab);
    currentTabData = currentTabData[0];

    let currentAmountInput = new BigNumber(
            currentTabData
            && currentTabData.assets
            && currentTabData.assets.lovelace || '0'
          ).dividedBy(1000000).toString();
    currentAmountInput = currentAmountInput === '0' ? '' : currentAmountInput;

    console.log('currentAmountInput');
    console.log(currentAmountInput);

    console.log('currentTabData');
    console.log(currentTabData);

    const isBlackTheme = props.isBlackTheme;

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

        const updatedUtxos = currentAccount.utxos.map(utxo => {
            const data = getAddrData(utxo.address, [...currentAccount.externalPubAddress, ...currentAccount.internalPubAddress]);
            if (data){
                utxo = {...utxo, ...data};
                return utxo;
            }
        }).filter(r => r !== undefined);
        setUtxos(updatedUtxos);

        const mergedAssetsFromUtxos = mergeAssetsFromUtxos(updatedUtxos);

        setMergedUtxos(currentUtxos => ({...currentUtxos, ...mergedAssetsFromUtxos}));

        let tags = [];   // TODO: show all tags even with no assets
        currentAccount.externalPubAddress.map(addr => {
            if (addr.tags && addr.tags.length){
                tags = [...tags,...addr.tags]
            }
        })
        setAvailableTags(Array.from(tags));

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

            const updatedUtxos = utxos.map(utxo => {
                const data = getAddrData(utxo.address, [...currentAccount.externalPubAddress, ...currentAccount.internalPubAddress]);
                if (data){
                    utxo = {...utxo, ...data};
                    return utxo;
                }
            }).filter(r => r !== undefined || r.utxos.length);
            setUtxos(updatedUtxos);

            const mergedAssetsFromUtxos = mergeAssetsFromUtxos(updatedUtxos);

            setMergedUtxos(currentUtxos => ({...currentUtxos, mergedAssetsFromUtxos}));

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

            mergeAssets();
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
        for (const output of outputs) {
            validateOutput(output)
        }
    }
    const updateOutput = (output) => {
        let updatedOutputs = outputs.map(out =>{
            if (out.label === output.label){
                out = output;
            }
            return out;
        });
        setOutputs(updatedOutputs);
    }
    const validateOutput = (output) => {
        let commonOutputs = outputs.filter(out => out.fromTags.some(tag => output.fromTags.includes(tag)) || (output.notTagged && out.notTagged === output.notTagged));

        let filterUtxos = utxos.filter(utxo => utxo.tags.some(tag => commonOutputs.some(out => out.fromTags.includes(tag))));
        if (output.notTagged){
            const notTaggedUtxos = utxos.filter((utxo) => !utxo.tags.length);
            filterUtxos = [...filterUtxos,...notTaggedUtxos]
        }
        const mergedAssetsFromUtxos = mergeAssetsFromUtxos(filterUtxos);
        const mergedAssetsFromOutputs = mergeAssetsFromOutputs(commonOutputs);
        const outputsAreValid = validOutputs(mergedAssetsFromUtxos,mergedAssetsFromOutputs);
        output.valid = outputsAreValid;

        updateOutput(output);
    };
    const mergeAssets = () => {

        //console.log('\n\nmergeAssets');
        //console.log('utxos');
        //console.log(utxos);


        // TODO:
        let currentOutput = (outputs.filter(output => output.label === activeTab))[0];
        //console.log('currentOutput');
        //console.log(currentOutput);

        const taggedUtxos = utxos.filter((utxo) => utxo.tags.length);
        //console.log('taggedUtxos');
        //console.log(taggedUtxos);
        const utxosFromSelectedTag = taggedUtxos.filter((utxo) => utxo.tags.length && utxo.tags.some(t =>
            currentOutput.fromTags.includes(t)
        ));

        //console.log('utxosFromSelectedTag');
        //console.log(utxosFromSelectedTag);
        let joinUtxos = utxosFromSelectedTag;
        if (currentOutput.notTagged){
            const notTaggedUtxos = utxos.filter((utxo) => !utxo.tags.length);
            joinUtxos = [...joinUtxos,...notTaggedUtxos];
        }
        //console.log('joinUtxos');
        //console.log(joinUtxos);

        const mergedAssetsFromUtxos = mergeAssetsFromUtxos(joinUtxos);
        //console.log('mergedAssetsFromUtxos');
        //console.log(mergedAssetsFromUtxos);

        setMergedUtxos(mergedAssetsFromUtxos);
        let availableAdaOnSelectedUtxos =
            mergedAssetsFromUtxos
            && mergedAssetsFromUtxos.lovelace
            && mergedAssetsFromUtxos.lovelace.length
            && mergedAssetsFromUtxos.lovelace !== '0' ?
            new BigNumber(mergedAssetsFromUtxos.lovelace || 0).dividedBy(1000000).toString() : '0';

        //console.log('availableAdaOnSelectedUtxos');
        //console.log(availableAdaOnSelectedUtxos);
        setAvailableAda(availableAdaOnSelectedUtxos)

        const filterOutputs = outputs.map(output => {
            output.assets = Object.entries(output.assets).reduce((acc, [k, v]) => v ? {...acc, [k]:v} : acc , {})
            return output;
        }).filter(output => !isDictEmpty(output.assets));
        const mergedAssetsFromOutputs = mergeAssetsFromOutputs(filterOutputs);
        setMergedOutputs(mergedAssetsFromOutputs);

        validateOutputs();

    }
    const sendTransaction = async () => {
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
            console.log(tx.error);
        }
    };
    const updateSelectedAssets = async asset => {
        let outputAux = outputs.filter(output => output.label === activeTab);
        outputAux = outputAux[0];
        outputAux.assets[asset.unit+'.'+asset.asset_name] = '';
        const updatedOutputs = outputs.map(output => {
            if (output.label === activeTab){
                output = outputAux;
            }
            return output;
        })

        setOutputs(updatedOutputs);
    };
    const updateQuantityFromSelectedAsset = async (asset, quantity) => {

        let outputAux = outputs.filter(output => output.label === activeTab);
        outputAux = outputAux[0];

        const updatedAssets = Object.entries(outputAux.assets).map(keyValuePair => {
            if (keyValuePair[0] === asset.unit+'.'+asset.asset_name) {
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
        mergeAssets();
    };
    const removeSelectedAssets = async asset => {

        let outputAux = outputs.filter(output => output.label === activeTab);
        outputAux = outputAux[0];
        const updatedAssets = Object.entries(outputAux.assets).filter(keyValuePair => {
            return keyValuePair[0] !== asset.unit+'.'+asset.asset_name;
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

    };
    const fetchCopiedText = async () => {
        const text = await Clipboard.getString();
        const validAddress = await validateAddress(text);
        if (validAddress){
            setToAddressError(false)
            await setToAddr(text);
        } else {
            setToAddressError(true);
        }
    };

    useEffect(() => {
        mergeAssets();
    }, [currentTabData.fromTags, selectedTags.length, selectNotTagged, outputs.length]);

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
        copyToClipboard(address.address).then(r=>{})
    };

    const onSelectNotTagged = () => {
        const updatedOutputs = outputs.map(out => {
            if (out.label === activeTab){
                out.notTagged = !out.notTagged;
            }
            return out;
        })
        setOutputs(updatedOutputs);
        mergeAssets();
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
                toAddress: ''
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
            let nextTab = '1';

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
            setToAddressError(true);
            outputAux.validAddress = false;
        } else {
            setToAddressError(false);
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
                mergeAssets();
            } catch (e) {

            }
        }
    };
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
                        Select Asset
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
    const filterAssets = assets.filter(a => listOfAssets.some(l => l[0] === a.unit));
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
                        >From <Text style={{fontFamily: 'AvenirNextCyr-Demi', fontSize: 18}}>{currentAccount.accountName} {mergedLovelace}</Text> Ada</Text>
                        <View
                            style={{flexDirection:'row', flexWrap:'wrap', marginTop: 8, marginLeft: 12}}
                        >
                            <Chip
                                key={'all'}
                                label={'Not Tagged'}
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
                                    label: totalNotTagged,
                                    backgroundColor: '#603EDA',
                                }}
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
                                       labelStyle={{fontFamily: 'AvenirNextCyr-Medium'}}
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
                                        {outputs.length < 8 ? 'New' : '' }✚
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
                    >Send to</Text>
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
                    >Amount</Text>
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
                        }}                    >Assets</Text>
                    <View
                        style={{marginBottom: 1, marginLeft: 12}}
                    >
                        <Picker
                            placeholder={filterAssets && filterAssets.length ? 'Add Asset('+filterAssets.length+')' : 'No Assets'}
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
                                const assetName =  keyValuePair[0].includes('.') ? keyValuePair[0].split('.')[1] : keyValuePair[0];
                                const unit = keyValuePair[0].includes('.') ? keyValuePair[0].split('.')[0] : keyValuePair[0];

                                if (assetName !== 'lovelace')
                                {
                                    return <View
                                        style={{flexDirection:'row', flexWrap:'wrap', paddingHorizontal: widthPercentageToDP(3)}}
                                    >
                                        <TextField
                                            containerStyle={{width: 330, marginHorizontal: 6,  fontFamily: 'AvenirNextCyr-Medium'}}
                                            floatingPlaceholder
                                            placeholder={Buffer.from(assetName, 'hex').toString() }
                                            onChangeText={(text) => updateQuantityFromSelectedAsset({asset_name: assetName, unit}, text)}
                                            helperText="this is an helper text"
                                            rightButtonProps={{
                                                iconSource: removeIcon,
                                                onPress: () => removeSelectedAssets({asset_name: assetName, unit}),
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
                        <Button
                            backgroundColor={"#F338C2"}
                            onPress={() => sendTransaction()}
                            disabled={outputs.some(out => !out.valid) || new BigNumber(mergedOutputs.lovelace || 0).dividedBy(1000000).toString() === '0'}
                        >
                            <Text style={{color: 'white', padding:4, fontSize: 16,  fontFamily: 'AvenirNextCyr-Medium'}}>
                                <Text style={{color: 'white', padding:4, textAlign: 'center', fontSize: 20, fontWeight: 'bold'}}>
                                    Send{'\n'}
                                </Text>
                                <Text style={{color: 'white', padding:4, fontSize: 16,  fontFamily: 'AvenirNextCyr-Medium'}}>
                                    Ada{' '}{new BigNumber(mergedOutputs.lovelace || 0).dividedBy(1000000).toString()}{' | '}
                                </Text>
                                {
                                    Object.keys(mergedOutputs).length-1 > 0 ?
                                        <Text style={{color: 'white', padding:4, fontSize: 16,  fontFamily: 'AvenirNextCyr-Medium'}}>
                                            Assets{' ('}{Object.keys(mergedOutputs).length-1}{') | '}
                                        </Text>
                                    : null
                                }
                                <Text style={{color: 'white', padding:4, fontSize: 16, fontFamily: 'AvenirNextCyr-Medium'}}>
                                    Fee 0.17
                                </Text>

                            </Text>
                        </Button>
                    </View>
                    <View
                        style={{height: heightPercentageToDP(4)}}
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

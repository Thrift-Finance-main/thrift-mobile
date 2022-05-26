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
import pasteIcon from "../assets/paste.png";
import {buildTransaction, mergeAssetsFromOutputs, mergeAssetsFromUtxos} from "../lib/transactions";
import {fetchBlockfrost, getProtocolParams, getTxUTxOsByAddress} from "../api/Blockfrost";
import {validateAddress} from "../lib/account";
import {isDictEmpty} from "../utils";

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
    const [selectedTags, setSelectedTags] = useState(currentAccount.selectedAddress.tags);
    const [selectAll, setSelectAll] = useState(false);

    const [outputs, setOutputs] = useState([
        {
            toAddress: 'addr_test1qpwj2v4q7w5y9cqp4v8yvn8n0ly872aulxslq2vzckt7jdyg6rs5upesk5wzeg55yx69rn5ygh899q6lxku9h7435g0qu8ly5u',
            validAddress: true,
            assets: {lovelace: ''},
            label: '1'
        }
    ]);
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

    let currentTabData = outputs.filter(output => output.label === activeTab);
    currentTabData = currentTabData[0];

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

        let tags = new Set();
        const updatedUtxos = currentAccount.utxos.map(utxo => {
            const data = getAddrData(utxo.address, [...currentAccount.externalPubAddress, ...currentAccount.internalPubAddress]);
            const len = utxo.utxos.length;
            if (data){
                data.tags.map(tag => {
                    if (len){
                        tags.add(tag)
                    }
                });
                utxo = {...utxo, ...data};
                return utxo;
            }
        }).filter(r => r !== undefined);
        setUtxos(updatedUtxos);

        const mergedAssetsFromUtxos = mergeAssetsFromUtxos(updatedUtxos);

        setMergedUtxos(currentUtxos => ({...currentUtxos, ...mergedAssetsFromUtxos}));

        setAvailableTags(Array.from(tags));

        const fetchData = async () => {
            console.log('fetchData');
            let endpoint = "accounts/" + currentAccount.rewardAddress;
            let accountState = await fetchBlockfrost(endpoint);
            setAccountState(accountState);
            endpoint = endpoint + "/addresses";
            const relatedAddresses = await fetchBlockfrost(endpoint);
            console.log('relatedAddresses');
            console.log(relatedAddresses.length);
            console.log(relatedAddresses);
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

            let tags = new Set();
            const updatedUtxos = utxos.map(utxo => {
                const data = getAddrData(utxo.address, [...currentAccount.externalPubAddress, ...currentAccount.internalPubAddress]);
                const len = utxo.utxos.length;
                if (data){
                    data.tags.map(tag => {
                        if (len){
                            tags.add(tag)
                        }
                    });
                    utxo = {...utxo, ...data};
                    return utxo;
                }
            }).filter(r => r !== undefined || r.utxos.length);
            setUtxos(updatedUtxos);
            console.log('\n\nupdatedUtxos');
            console.log(updatedUtxos.length);
            console.log(updatedUtxos[0]);
            console.log(updatedUtxos[1]);
            console.log(updatedUtxos[2]);
            console.log(updatedUtxos[3]);

            const mergedAssetsFromUtxos = mergeAssetsFromUtxos(updatedUtxos);

            setMergedUtxos(currentUtxos => ({...currentUtxos, mergedAssetsFromUtxos}));

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

    const mergeAssets = () => {

        // Just utxos without tags
        if (selectAll && !selectedTags.length){
            const filterUtxos = utxos.filter((utxo) => !utxo.tags.length);
            const mergedAssetsFromUtxos = mergeAssetsFromUtxos(filterUtxos);
            setMergedUtxos(mergedAssetsFromUtxos);
            setAvailableAda(BigInt(mergedAssetsFromUtxos.lovelace).over(1000000).toString())
        }
        else if (!selectedTags.length){
            setMergedUtxos({});
            setAvailableAda('0');
        } else if (selectAll && selectedTags.length === availableTags.length) {
            const mergedAssetsFromUtxos = mergeAssetsFromUtxos(utxos);
            setMergedUtxos(mergedAssetsFromUtxos);
            setAvailableAda(BigInt(mergedAssetsFromUtxos.lovelace).over(1000000).toString())
        }
        else if (selectAll && selectedTags.length !== availableTags.length){
            const filterUtxos = utxos.filter((utxo) => !utxo.tags.length || utxo.tags.some(t => selectedTags.includes(t)));
            const mergedAssetsFromUtxos = mergeAssetsFromUtxos(filterUtxos);
            setMergedUtxos(mergedAssetsFromUtxos);
            setAvailableAda(BigInt(mergedAssetsFromUtxos.lovelace).over(1000000).toString())
        }
        else {
            const filterUtxos = utxos.filter((utxo) => utxo.tags.some(t => selectedTags.includes(t)));
            const mergedAssetsFromUtxos = mergeAssetsFromUtxos(filterUtxos);
            setMergedUtxos(mergedAssetsFromUtxos);
            setAvailableAda(BigInt(mergedAssetsFromUtxos.lovelace).over(1000000).toString())
        }

        const filterOutputs = outputs.map(output => {
            output.assets = Object.entries(output.assets).reduce((acc, [k, v]) => v ? {...acc, [k]:v} : acc , {})
            return output;
        }).filter(output => !isDictEmpty(output.assets));
        const mergedAssetsFromOutputs = mergeAssetsFromOutputs(filterOutputs);
        setMergedOutputs(mergedAssetsFromOutputs);

    }
    const sendTransaction = async () => {
        const protocolParameters =  await getProtocolParams();
        // filter utxos
        let filterUtxos = utxos;
        if (!selectAll){
            filterUtxos = utxos.filter((utxo) =>{
                return utxo.tags.some(tag => {
                    return selectedTags.includes(tag)
                });
            });
        }

        // Remove empty assets and filter outputs with no assets
        const filterOutputs = outputs.map(output => {
            output.assets = Object.entries(output.assets).reduce((acc, [k, v]) => v ? {...acc, [k]:v} : acc , {})
            return output;
        }).filter(output => !isDictEmpty(output.assets));

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
    }, [selectedTags.length, selectAll, outputs.length]);

    const onSelectTag = (tag) => {
        if (selectedTags.includes(tag)){
            const updatedTags = selectedTags.filter(t => t !== tag);
            setSelectedTags(updatedTags);
        } else {
            setSelectedTags([...selectedTags, tag])
        }
    };
    const onSelectAllTags = () => {
        if (selectAll){
            setSelectedTags([]);
            setSelectAll(false);
        } else {
            setSelectedTags(availableTags);
            setSelectAll(true);
        }
    };
    const onAddRecipient = () => {
        if (outputs.length < 12){
            let newLabel = outputs[outputs.length-1];
            // setTabs(tabs);
            const obj = {
                label: (parseInt(newLabel.label)+1).toString(),
                validAddress: true,
                assets: {lovelace: ''},
                toAddress: ''
            };

            setOutputs(prevTabs => ([...prevTabs, ...[
                obj
            ]]));
            setActiveTab((parseInt(newLabel.label)+1).toString());
        }
    };
    const onRemoveRecipient = () => {
        let currentTab = activeTab;
        if (currentTab !== '1' || outputs.length > 1){
            let updatedOutputs = outputs.filter(tab => tab.label !== currentTab);
            for(let i=0; i < updatedOutputs.length; i++){
                updatedOutputs[i].label = (i+1).toString();
            }
            setOutputs(updatedOutputs);
            let nextTab = parseInt(currentTab)-1;
            nextTab = nextTab <= 0 ? '1' : nextTab.toString();
            setActiveTab(nextTab);
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

        console.log('\n\nsetInputAmount');
        const validAmount = !isNaN(amount);
        if (!validAmount && amount !== ''){
            setAmountError(true);
        } else {
            setAmountError(false);
            let outputAux = outputs.filter(output => output.label === activeTab);
            outputAux = outputAux[0];
            outputAux.assets.lovelace = BigInt(amount).multiply(1000000).toString();
            outputs.map(output => {
                if (output.label === activeTab){
                    output = outputAux;
                }
                return output;
            });
            // setOutputs(prevTabs => ([...prevTabs, ...[{label: (parseInt(newLabel.label)+1).toString()}]]));
            setOutputs(outputs);
            mergeAssets();
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
                    <Text style={{...styles.addressList, ...styles.addressListTitle}}>
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

    const mergedLovelace = BigInt(mergedUtxos.lovelace).divmod(1000000);
    const mergedLovelaceLeft = mergedLovelace.quotient;
    const mergedLovelaceRight = mergedLovelace.remainder;

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
                            onPress={() => setAmount(mergedLovelaceLeft+'.'+mergedLovelaceRight)}
                        >From {currentAccount.accountName} {mergedLovelaceLeft+'.'+mergedLovelaceRight} Ada</Text>
                        <View
                            style={{flexDirection:'row', flexWrap:'wrap', marginTop: 8, marginLeft: 12}}
                        >
                            <Chip
                                key={'all'}
                                label={'All'}
                                onPress={onSelectAllTags}
                                containerStyle={{
                                    marginRight: 4,
                                    borderWidth:  selectAll ? 2 : 1,
                                    borderColor: selectAll ? '#603EDA' : 'gray',
                                }}
                                badgeProps={{
                                    label: totalUtxos,
                                    backgroundColor: '#603EDA'
                                }}
                            />
                            {
                                availableTags.map((tag,index) => {
                                   return <Chip
                                       key={tag+index}
                                       label={tag}
                                       onPress={() => onSelectTag(tag)}
                                       containerStyle={{
                                           marginRight: 4,
                                           borderWidth: selectedTags.includes(tag) ? 2 : 1,
                                           borderColor: selectedTags.includes(tag) ? '#F338C2' : 'black'
                                       }}
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
                                    onLongPress={() => onRemoveRecipient()}
                                    onPress={() => setActiveTab(tab.label)}>
                                    <Text
                                        style={{...
                                                activeTab === tab.label
                                                    ? styles._active_tab_text
                                                    : styles._tab_text,
                                            fontSize: 14
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
                        style={{textAlign: 'center', marginLeft: 20, fontSize: 10}}
                        value={currentTabData && currentTabData.toAddress || null}
                        placeholder={"Address"}
                        onChangeText={(text) =>{setToAddr(text).then(r => {})}}
                        useBottomErrors
                        validate={[(text) => currentTabData && currentTabData.validAddress]}
                        errorMessage={"Invalid address"}
                        selectTextOnFocus={true}
                        rightButtonProps={{
                            iconSource: pasteIcon,
                            onPress: () => fetchCopiedText(),
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
                        style={{textAlign: 'center', fontSize: 28}}
                        value={currentTabData
                            && currentTabData.assets
                            && currentTabData.assets.lovelace
                            && BigInt(currentTabData.assets.lovelace).over(1000000).toString()
                            || null
                        }

                        placeholder={'$Ada'}
                        onChangeText={(text) => setInputAmount(text)}
                        useBottomErrors
                        validate={['required', (text) => !isNaN(text)]}
                        errorMessage={"Invalid amount"}
                    />
                    <Text
                        style={{
                            ...styles.filedHeader, color: props.isBlackTheme ? Colors.white :
                                Colors.black,
                        }}                    >Assets</Text>
                    <View
                        style={{marginBottom: 1, marginLeft: 12}}
                    >
                        <Picker
                            placeholder={'Add Asset'}
                            onChange={item => {
                                updateSelectedAssets(item).then(r => {})
                            }}
                            mode={Picker.modes.SINGLE}
                            rightIconSource={swapIcon}
                            renderCustomModal={renderDialog}
                            style={{color: 'black', fontSize: 14, textAlign: 'center', marginLeft: 28}}
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
                                                }}>

                                                    {Buffer.from(assetName, 'hex').toString()}
                                                </Text>
                                                <Text style={{
                                                    ...styles.addressListTags,
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
                                            containerStyle={{width: 330, marginHorizontal: 6}}
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

                        >
                            <Text style={{color: 'white', padding:4, fontSize: 16}}>
                                <Text style={{color: 'white', padding:4, textAlign: 'center', fontSize: 20, fontWeight: 'bold'}}>
                                    Send{'\n'}
                                </Text>
                                <Text style={{color: 'white', padding:4, fontSize: 16}}>
                                    Ada{' '}{BigInt(mergedOutputs.lovelace).over(1000000).toString()}{' | '}
                                </Text>
                                {
                                    Object.keys(mergedOutputs).length-1 > 0 ?
                                        <Text style={{color: 'white', padding:4, fontSize: 16}}>
                                            Assets{' ('}{Object.keys(mergedOutputs).length-1}{') | '}
                                        </Text>
                                    : null
                                }
                                <Text style={{color: 'white', padding:4, fontSize: 16}}>
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
        paddingHorizontal: widthPercentageToDP(2.5)
    },
    filedHeader: {
        fontSize: 14,
        letterSpacing: 1,
        paddingHorizontal: widthPercentageToDP(2.5),
        paddingVertical: heightPercentageToDP(1.5),
        fontWeight: "bold"
    },
    fromAccount: {
        fontSize: 14,
        marginTop: heightPercentageToDP(2.5),
        letterSpacing: 1,
        paddingHorizontal: widthPercentageToDP(2.5),
        fontWeight: "bold"
    },
    hintStyle: {
        color: Colors.hintsColor,
        fontSize: 10,
        paddingHorizontal: widthPercentageToDP(2),
        marginTop: heightPercentageToDP(2)
    },
    addressList: {
        textAlign: 'center',
        fontSize: 12,
        marginTop: heightPercentageToDP(1),
        fontStyle: "italic",
    },
    addressListTags: {
        textAlign: 'center',
        opacity: 0.8,
        marginBottom: heightPercentageToDP(2)
    },
    addressListTitle: {
        fontWeight: 'bold',
        marginBottom: heightPercentageToDP(1)
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
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 12,
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
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 12,
    }
})
export default Send;

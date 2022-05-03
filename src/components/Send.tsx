import React, {FC, useEffect, useRef, useState} from 'react'
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {SafeAreaView} from 'react-native-safe-area-context';
import {heightPercentageToDP, widthPercentageToDP} from '../utils/dimensions'
import Button from './Common/Button'
import Back from '../assets/back.svg'
import DarkBack from '../assets//DarkBack.svg'
import {useSelector} from "react-redux";
import {Chip, Colors, Dialog, PanningProvider, Picker, PickerProps, TextField} from "react-native-ui-lib";
import swapIcon from "../assets/plus.png";
import removeIcon from "../assets/remove.png";
import pasteIcon from "../assets/paste.png";
import {buildTransaction} from "../lib/transactions";
import {fetchBlockfrost, getProtocolParams, getTxUTxOsByAddress} from "../api/Blockfrost";
import {validateAddress} from "../lib/account";

interface CreateTokenProps {
    // onContinuePress: () => void
    onBackIconPress: () => void
    // fromScreen: any
    isBlackTheme: any
    address?: string
}

const Send: FC<CreateTokenProps> = (props) => {
    const currentAccount = useSelector((state) => state.Reducers.currentAccount);
    const [assets, setAssets] = useState(currentAccount.assets || []);
    const [selectedAssets, setSelectedAssets] = useState([]);
    const [accountState, setAccountState] = useState({});
    const [utxos, setUtxos] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState(currentAccount.selectedAddress.tags);
    const [selectAll, setSelectAll] = useState(false);

    const [outputs, setOutputs] = useState([
        {
            toAddress: 'addr_test1qpwj2v4q7w5y9cqp4v8yvn8n0ly872aulxslq2vzckt7jdyg6rs5upesk5wzeg55yx69rn5ygh899q6lxku9h7435g0qu8ly5u',
            assets: {lovelace: '7'},
            label: '1'
        }
    ]);

    const [toAddress, setToAddress] = useState('addr_test1qpwj2v4q7w5y9cqp4v8yvn8n0ly872aulxslq2vzckt7jdyg6rs5upesk5wzeg55yx69rn5ygh899q6lxku9h7435g0qu8ly5u');
    const [toAddressError, setToAddressError] = useState(false);
    const [amount, setAmount] = useState('6');
    const [amountError, setAmountError] = useState(false);
    const [activeTab, setActiveTab] = useState('1');
    const [tabs, setTabs] = useState([{label: '1'}]);

    let totalUtxos = 0
    utxos.map(utxo => {
        if (utxo.utxos && utxo.utxos.length){
            totalUtxos++;
        }
    })

    let currentTabData = outputs.filter(output => output.label === activeTab);
    currentTabData = currentTabData[0];

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

        const fetchData = async () => {
            console.log('fetchData');
            let endpoint = "accounts/" + currentAccount.rewardAddress;
            let accountState = await fetchBlockfrost(endpoint);
            console.log('accountState');
            console.log(accountState);
            setAccountState(accountState);
            endpoint = endpoint + "/addresses";
            const relatedAddresses = await fetchBlockfrost(endpoint);
            console.log('relatedAddresses');
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
                if (data){
                    data.tags.map(tag => tags.add(tag));
                    utxo = {...utxo, ...data};
                    return utxo;
                }
            }).filter(r => r !== undefined);
            setUtxos(updatedUtxos);
            setAvailableTags(Array.from(tags));

            // Get/show tags based on addresses in utxos array
            // Select tags from where get the ada and assets,
            // verify in enough amount in selected utxos, alert
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

        const tx = await buildTransaction(currentAccount, accountState, filterUtxos, outputs, protocolParameters);
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

        // setOutputs(prevOuts => ([...prevOuts, ...updatedOutputs]));

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
            console.log()
            if (output.label === activeTab){
                output = outputAux;
            }
            return output;
        });
        // setOutputs(prevTabs => ([...prevTabs, ...[{label: (parseInt(newLabel.label)+1).toString()}]]));
        setOutputs(outputs);
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
    const onSelectTag = (tag) => {
        if (selectedTags.includes(tag)){
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag])
        }
    };
    const onSelectAllTags = () => {
        // select all
        const nAvailableTags = availableTags.length;
        if (selectedTags.length < nAvailableTags){
            setSelectedTags(availableTags);
            setSelectAll(true);
        } else {
            setSelectedTags([]);
            setSelectAll(false);
        }
    };
    const onAddRecipient = () => {
        if (tabs.length < 12){
            let newLabel = tabs[tabs.length-1];
            // setTabs(tabs);
            const obj = {
                label: (parseInt(newLabel.label)+1).toString(),
                assets: {lovelace: ''},
                toAddress: ''
            };
            setTabs(prevTabs => ([...prevTabs, ...[
                obj
            ]]));
            setOutputs(prevTabs => ([...prevTabs, ...[
                obj
            ]]));
            setActiveTab((parseInt(newLabel.label)+1).toString());
        }
    };
    const setToAddr = async (address) => {

        // add new tx template to tx list
        //  '1st 2nd 3rd 4th'.
        const validAddress = await validateAddress(address);
        if (!validAddress){
            setToAddressError(true);
        } else {
            setToAddressError(false);
            let outputAux = outputs.filter(output => output.label === activeTab);
            outputAux = outputAux[0];
            outputAux.toAddress = address;
            outputs.map(output => {
                console.log()
                if (output.label === activeTab){
                    output = outputAux;
                }
                return output;
            });
            setOutputs(outputs);
        }
        setToAddress(address);
    };
    const setInputAmount= (amount) => {

        const validAmount = !isNaN(amount);
        if (!validAmount){
            setAmountError(true);
        } else {
            setAmountError(false);
            console.log('activeTab');
            console.log(activeTab);
            console.log('outputs');
            console.log(outputs);
            let outputAux = outputs.filter(output => output.label === activeTab);
            outputAux = outputAux[0];
            console.log('outputAux');
            console.log(outputAux);
            outputAux.assets.lovelace = amount;

            outputs.map(output => {
                console.log()
                if (output.label === activeTab){
                    output = outputAux;
                }
                return output;
            });
            // setOutputs(prevTabs => ([...prevTabs, ...[{label: (parseInt(newLabel.label)+1).toString()}]]));
            setOutputs(outputs);
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
                            onPress={() => setAmount((currentAccount.balance/1000000).toString())}
                        >From {currentAccount.accountName} {currentAccount.balance ? currentAccount.balance/1000000 : 0} Ada</Text>
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
                                    borderColor: 'gray'
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
                            tabs.map(tab =>{
                                return <TouchableOpacity
                                    style={
                                        activeTab === tab.label ? styles._active_tab : styles._tab
                                    }
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
                            tabs.length < 12 ?
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
                                        ✚{tabs.length < 8 ? 'New' : '' }
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
                        validate={['required', (text) => !toAddressError]}
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
                            || null
                        }
                        placeholder={'Amount'}
                        onChangeText={(text) => setInputAmount(text)}
                        useBottomErrors
                        validate={['required', (text) => !amountError]}
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
                            {assets && assets.length ? assets.map((asset,index) => (
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
                                console.log('currentTabData_____');
                                console.log(keyValuePair);
                                const assetName =  keyValuePair[0].includes('.') ? keyValuePair[0].split('.')[1] : keyValuePair[0];
                                const unit = keyValuePair[0].includes('.') ? keyValuePair[0].split('.')[0] : keyValuePair[0];
                                console.log('unit');
                                console.log(unit);
                                console.log('assetName');
                                console.log(assetName);
                                console.log('hey1111');
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
                        style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: widthPercentageToDP(3), paddingVertical: heightPercentageToDP(2) }}
                    >
                        <Text
                            style={{ color: props.isBlackTheme ? Colors.white : Colors.black }}
                        >Balance:0.005 Dana</Text>
                        <Text
                            style={{ color: props.isBlackTheme ? Colors.white : Colors.black }}
                        >Free:0</Text>

                    </View>
                    <View
                        style={{ height: heightPercentageToDP(4)}}
                    />
                        <Button
                            backgroundColor={"#F338C2"}
                            buttonTitle={"Transfer"}
                            onPress={() => sendTransaction()}
                            titleTextColor={props.isBlackTheme ? Colors.black : Colors.white}

                        />
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

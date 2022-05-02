import React, {FC, useEffect, useRef, useState} from 'react'
import {ScrollView, StyleSheet, Text, View} from 'react-native';
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
    const [toAddress, setToAddress] = useState('addr_test1qpwj2v4q7w5y9cqp4v8yvn8n0ly872aulxslq2vzckt7jdyg6rs5upesk5wzeg55yx69rn5ygh899q6lxku9h7435g0qu8ly5u');
    const [amount, setAmount] = useState('0');

    const totalTags = availableTags.length || '0';

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
                const data = getAddrData(utxo.address, currentAccount.externalPubAddress);
                if (data){
                    data.tags.map(tag => tags.add(tag));
                    utxo.address = data;
                    return utxo;
                }
            }).filter(r => r !== undefined);
            setUtxos(updatedUtxos);
            console.log('AvailableTags');
            console.log(tags);
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
        const filterUtxos = utxos.filter((utxo) =>{
            return utxo.address.tags.some(tag => {
                return selectedTags.includes(tag)
            });
        });

        const outputs = [{
            address: toAddress,
            amount,
            assets: selectedAssets
        }];
        await buildTransaction(currentAccount, accountState, filterUtxos, outputs, protocolParameters);
    };

    const updateSelectedAssets = async asset => {
        let updatedAssets = assets.filter(a => a.asset_name !== asset.asset_name);
        setAssets(updatedAssets);
        let selecAssets = selectedAssets;
        selecAssets.push(asset);
    };

    const removeSelectedAssets = async asset => {
        let updatedSelectedAssets = selectedAssets.filter(a => a.asset_name !== asset.asset_name);
        setSelectedAssets(updatedSelectedAssets);
        let aa = assets;
        aa.push(asset);
        setAssets(aa);
    };

    const fetchCopiedText = async () => {
        const text = await Clipboard.getString();
        setToAddress(text);
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
        } else {
            setSelectedTags([]);
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
                props.isBlackTheme ? Colors.blackTheme :
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
                                    borderWidth: 1,
                                    borderColor: 'gray'
                                }}
                                badgeProps={{
                                    label: availableTags.length,
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
                        value={toAddress || null}
                        placeholder={"Address"}
                        onChangeText={(text) =>{setToAddress(text)}}
                        useBottomErrors
                        validate={['required', (n) => { return n > 0 }]}
                        errorMessage={"Not enough funds"}
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
                        value={amount || null}
                        placeholder={'Amount'}
                        onChangeText={(text) =>{setAmount(text)}}
                        useBottomErrors
                        validate={['required', (n) => { return n > 0 }]}
                        errorMessage={"Not enough funds"}
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
                                        console.log('a');
                                        console.log(a);
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
                    {
                        selectedAssets.length ?
                            selectedAssets.map(asset => {
                                return <View
                                        style={{ flexDirection: "row", paddingHorizontal: widthPercentageToDP(3)}}
                                        >
                                            <TextField
                                                containerStyle={{width: 128}}
                                                floatingPlaceholder
                                                placeholder={Buffer.from(asset.asset_name, 'hex').toString()}
                                                onChangeText={(text) => console.log(text)}
                                                helperText="this is an helper text"
                                                rightButtonProps={{
                                                    iconSource: removeIcon,
                                                    onPress: () => removeSelectedAssets(asset),
                                                    accessibilityLabel: 'TextField Info',
                                                    iconColor: Colors.red10
                                                }}
                                            />

                                    </View>
                            })
                            : null
                    }
                    <View
                        style={{ height: heightPercentageToDP(7) }}
                    />
                    <Button
                        backgroundColor={"#F338C2"}
                        buttonTitle={"Transfer"}
                        onPress={() => sendTransaction()}
                        titleTextColor={props.isBlackTheme ? Colors.black : Colors.white}

                    />
                </View>
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
        paddingVertical: heightPercentageToDP(2.5),
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
    }
})
export default Send;

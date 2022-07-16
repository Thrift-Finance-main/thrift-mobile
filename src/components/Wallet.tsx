import React, {FC, useEffect, useRef, useState} from 'react'
import {View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '../constants/CustomColors'
import { heightPercentageToDP, widthPercentageToDP } from '../utils/dimensions'
import Moon from '../assets/Moon.svg'
import Scanner from '../assets/Scanner.svg'
import Send from '../assets/Send.svg'
import Receive from '../assets/Receive.svg'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import TransactionDetailsModal from './PopUps/TransactionDetailsModal'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import ReceiveTokenModal from './PopUps/ReceiveTokenModal'
import DarkTheme from '../assets/darkTheme.svg'
import DarkScanner from '../assets/DarkScanner.svg'
import {useDispatch, useSelector} from "react-redux";
import WalletIcon from "../assets/wallet.svg";
import {fetchBlockfrost, getBlockInfo, getTxInfo, getTxUTxOs, getTxUTxOsByAddress} from "../api/Blockfrost";
import {apiDb} from "../db/LiteDb";
import {setCurrentAccount, setCurrentPrice} from "../store/Action";
import {classifyTx, RECEIVE_TX, SELF_TX, SEND_TX} from "../lib/transactions";
import Ada from '../assets/Ada.svg'
import moment from "moment";
import {addressSlice, capitalizeFirstLetter} from "../utils";
import {
    Icon,
    Dialog,
    Picker,
    Avatar,
    Assets,
    PanningProvider,
    Typography,
    PickerProps,
    PickerModes,
    DialogProps,
    Button
} from 'react-native-ui-lib';
import {getPrices} from "../api";
import BigNumber from "bignumber.js";
import Toast from "react-native-toast-message";
import {WALLET_ROUTE_ASSETS, WALLET_ROUTE_TRANSACTIONS} from "../store/ActionTypes";

interface WalletProps {
    onSavingsPress: () => void
    onBackIconPress: () => void
    onCreateTargetPress: () => void
    onTabOptionPress: (route:string) => void
    isBlackTheme: any,
    walletRoute: string
}
const Wallet: FC<WalletProps> = (props) => {
    const dispatch = useDispatch();

    const [scanner, setScanner] = useState(false);
    const [currPrice, setCurrPrice] = useState(false);
    const currentAccount = useSelector((state) => state.Reducers.currentAccount);
    const walletRoute = useSelector((state) => state.Reducers.walletRoute);
    const [selectedTx, setSelectedTx] = useState(undefined);
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',

        // https://www.iban.com/currency-codes
        // https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry
        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

    let pendingTxs = currentAccount.pendingTxs.filter(pendTx => {
        return !(currentAccount.history.some(h => h.txHash === pendTx.txHash))
    });
    const txList = [...pendingTxs, ...currentAccount.history];

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

    useEffect(() => {
        const interval = setInterval(() => {
            fetchData2().then(()=>{});
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() =>{

        const fetchData = async () => {
            await fetchData2();
        }

        if (isMounted.current) {
            // call the function
            fetchData()
                // make sure to catch any error
                .catch(console.error);
        }

    }, [currentAccount.accountName]);

    const fetchData2 = async () => {
        console.log('fetchData');
        const saddress = currentAccount && currentAccount.rewardAddress;
        if (saddress) {
            let endpoint = "accounts/" + saddress;
            const accountState = await fetchBlockfrost(endpoint);
            if (accountState.error){
                return;
            }
            endpoint =  "accounts/" + saddress + "/addresses";
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

            let tags = new Set();
            const updatedUtxos = utxos.map(utxo => {
                const data = getAddrData(utxo.address, [...currentAccount.externalPubAddress, ...currentAccount.internalPubAddress]);
                if (data){
                    data.tags.map(tag => tags.add(tag));
                    utxo = {...utxo, ...data};
                    return utxo;
                }
            }).filter(r => r !== undefined);

            let currentAccountInLocal = await apiDb.getAccount(currentAccount.accountName);
            currentAccountInLocal.utxos = updatedUtxos;
            currentAccountInLocal.balance = accountState.controlled_amount;
            currentAccountInLocal.delegated = accountState.active;
            currentAccountInLocal.activeEpoch = accountState.active_epoch;
            currentAccountInLocal.poolId = accountState.pool_id;
            currentAccountInLocal.rewardsSum = accountState.rewards_sum;
            currentAccountInLocal.withdrawableAmount = accountState.withdrawable_amount;

            const assetResponse = await fetchBlockfrost(endpoint+'/assets');
            if (assetResponse.error){
                return;
            }

            const assetsWithDetails = await Promise.all(
                assetResponse.map(async(a) => {
                    let asset = await fetchBlockfrost(`assets/${a.unit}`);
                    asset.quantity = a.quantity;
                    asset.unit = a.unit;
                    if (!asset.error){
                        return asset;
                    }
                })
            );

            currentAccountInLocal.assets = assetsWithDetails;
            await apiDb.updateAccount(currentAccountInLocal);

            dispatch(setCurrentAccount(currentAccountInLocal));

            let prices = await getPrices('usd');
            setCurrPrice(prices.cardano);
            dispatch(setCurrentPrice(prices.cardano));

            let addressTxsList = await Promise.all(
                relatedAddresses.map(async addr =>{
                    const response = await fetchBlockfrost(`addresses/${addr.address}/transactions`);
                    if (!response.error){
                        addr.txs = response;
                        return addr;
                    }
                })
            );

            let joinedTxsList:
                {
                    address: string,
                    block_height: number,
                    block_time: number,
                    tx_hash: string,
                    tx_index: number,
                    status: string,

                }[] = [];
            addressTxsList.map(addr => {
                addr.txs.map(tx => {
                    tx.block_time = tx.block_time*1000; // TODO: hot fix, from Moment unix
                    joinedTxsList.push({...tx, address: addr.address});
                })
            });

            let uniqueArrayTxsList = joinedTxsList.filter((v,i,a)=>a.findIndex(v2=>(v2.tx_hash===v.tx_hash))===i)

            let currentTxs = await apiDb.getAccountHistory(currentAccount.accountName);

            const allTxHashes:string[] = [];

            if (currentTxs){
                currentTxs.map(tx => {
                    if (tx){
                        allTxHashes.push(tx.txHash);
                    }
                });

                uniqueArrayTxsList = uniqueArrayTxsList.map(txAddr => {
                    const r = !allTxHashes.includes(txAddr.tx_hash);
                    if (r){
                        return txAddr;
                    }
                }).filter(e => e != undefined);
            }

            if (uniqueArrayTxsList && uniqueArrayTxsList.length){
                let addrsWithTxsList = [];
                addrsWithTxsList = await Promise.all(
                    uniqueArrayTxsList.map(async tx => {
                        const txInfo = await getTxInfo(tx.tx_hash);
                        const utxos = await getTxUTxOs(tx.tx_hash);

                        if (!utxos.error){
                            tx.utxos = utxos;
                            tx.fees = txInfo.fees;
                            tx.size = txInfo.size;
                            tx.asset_mint_or_burn_count = txInfo.asset_mint_or_burn_count;
                            return tx;
                        }
                    })
                );

                const allAddresses = [...currentAccount.externalPubAddress, ...currentAccount.internalPubAddress];
                const allTransactionsByAddr = [];

                await Promise.all(
                    addrsWithTxsList.map(async addrObj => {
                        let cTxs = await classifyTx(addrObj, allAddresses);
                        allTransactionsByAddr.push({address: addrObj.address, history: cTxs });
                    })
                );

                console.log("allTransactionsByAddr");
                console.log(allTransactionsByAddr);

                let mergedHistory = []; // All addresses
                allTransactionsByAddr.map(async addr => {
                    mergedHistory.push(addr.history);
                });


                let accHistory = [];
                accHistory = await apiDb.getAccountHistory(currentAccount.accountName);

                if (accHistory){
                    accHistory = [...accHistory, ...mergedHistory];
                } else {
                    accHistory = mergedHistory
                }

                let pendingTxs = currentAccount.pendingTxs.filter(pendTx => {
                    return !(accHistory.some(h => h.txHash === pendTx.txHash))
                });

                accHistory = accHistory.sort((a, b) => (a.blockTime < b.blockTime) ? 1 : -1);

                // TODO: store everything
                if (mergedHistory.length) {
                    //await apiDb.setAccountTransactionsHashes(currentAccount.accountName, currentTxs);
                    await apiDb.setAccountHistory(currentAccount.accountName, accHistory);
                    Toast.show({
                        type: 'success',
                        text1: 'New transaction added'
                    });
                }
                if (pendingTxs.length) {
                    await apiDb.setAccountPendingTxs(currentAccount.accountName, pendingTxs);

                    if (currentAccount.pendingTxs.length !== pendingTxs.length){
                        Toast.show({
                            type: 'success',
                            text1: 'Transaction confirmed'
                        });
                    }
                }

                const account = await apiDb.getAccount(currentAccount.accountName);
                dispatch(setCurrentAccount(account));
            }


        } else {
            console.log("Not current account in store");
        }

    }

    const getAddrData = (address, addresses) => {
        for (let i = 0; i < addresses.length; i++) {
            if (address === addresses[i].address){
                return addresses[i];
            }
        }
    }

    const renderAssetsList = ({item, index}) => {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: props.isBlackTheme
                        ? Colors.darkInput
                        : 'transparent',
                    marginTop: heightPercentageToDP(1),
                    borderRadius: 12,
                    height: heightPercentageToDP(6),
                    //   paddingHorizontal: widthPercentageToDP(3),
                }}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        // height: heightPercentageToDP(10)
                    }}>
                    <View
                        style={{
                            width: widthPercentageToDP(12),
                            marginLeft: widthPercentageToDP(3),
                        }}>
                        {item.metadata && item.metadata.logo ?
                            <Image
                                source={{uri: `data:image/png;base64,${item.metadata.logo}`}}
                                style={{width: 32, height: 32}}
                            />
                            : <Ada />}
                    </View>

                    <View style={{paddingHorizontal: widthPercentageToDP(5)}}>
                        <Text
                            style={{
                                color: props.isBlackTheme ? Colors.white : Colors.black,
                                fontSize: 14,
                                fontFamily: 'AvenirNextCyr-Medium'
                            }}>
                            {item && item.metadata && item.metadata.name}
                            {/*Buffer.from(item.asset_name,"hex").toString()*/}
                        </Text>
                        <View style={{flexDirection: 'row'}} >
                            <Text
                                style={{
                                    color: props.isBlackTheme ? Colors.lightWhite : Colors.black,
                                    fontSize: 11,
                                    fontFamily: 'AvenirNextCyr-Medium'
                                }}>
                                $5, 625.01
                            </Text>
                            <Text
                                style={{
                                    color: 'green',
                                    fontSize: 11,
                                    fontFamily: 'AvenirNextCyr-Medium',
                                    marginLeft: widthPercentageToDP(5)
                                }}>
                                0%
                            </Text>
                        </View>
                    </View>
                </View>
                <Text
                    style={{
                        color: props.isBlackTheme ? Colors.white : Colors.black,
                        fontSize: 16,
                        fontFamily: 'AvenirNextCyr-Medium',
                        paddingHorizontal: props.isBlackTheme
                            ? widthPercentageToDP(3.4)
                            : widthPercentageToDP(3.4),
                    }}>
                    {/*item.metadata && item.metadata.decimals ? item.quantity/(Math.pow( 10,item.metadata.decimals))  : item.quantity*/}
                    {formatter.format(item && item.quantity).substring(1)}{' '}{item && item.metadata && item.metadata.ticker}
                </Text>
            </View>
        );
    };
    const getIconTxType = (type:string) => {
        switch (type) {
            case RECEIVE_TX:
                return <AntDesignIcon name="arrowdown" color="green" size={22} />
            case SEND_TX:
                return <AntDesignIcon name="arrowup" color="red" size={22} />
            case SELF_TX:
                return <AntDesignIcon name="retweet" color="blue" size={22} />
            default:
                return <AntDesignIcon name="arrowdown" color="green" size={22} />
        }
    }

    const renderContentTab = () => {
        switch (walletRoute) {
            case WALLET_ROUTE_ASSETS:
                return  <FlatList
                    style={{marginTop: heightPercentageToDP(1)}}
                    data={currentAccount && currentAccount.assets || []}
                    renderItem={renderAssetsList}
                    keyExtractor={(item, index) => index.toString()}
                />
            case WALLET_ROUTE_TRANSACTIONS:
                return  <FlatList
                    style={{marginTop: heightPercentageToDP(1)}}
                    data={txList}
                    renderItem={renderItemTransaction}
                    keyExtractor={(item, index) => index.toString()}
                />
            default:
                //
        }
    }
    const getSymbolFromTxType = (type:string) => {
        switch (type) {
            case RECEIVE_TX:
                return '+'
            case SEND_TX:
                return '-'
            default:
                return '-'
        }
    }
    const renderItemTransaction = ({item, index}) => {

        if(item){
            const fee = item.fees;
            let amount = '0';

            const inputOtherAddresses = item.inputs && item.inputs.otherAddresses || [];
            const outputOwnAddresses = item.inputs && item.outputs.usedAddresses || [];
            const outputOtherAddresses = item.outputs && item.outputs.otherAddresses || [];
            let showAddr = '';
            if (item.type === SEND_TX){
                showAddr = outputOtherAddresses && outputOtherAddresses.length ? outputOtherAddresses[0].address : 'none';
                amount = new BigNumber(item.amount.lovelace).plus(new BigNumber(fee)).dividedBy('1000000').toNumber();
            } else if (item.type === RECEIVE_TX) {
                showAddr = inputOtherAddresses && inputOtherAddresses.length ? inputOtherAddresses[0].address : 'none';
                amount = new BigNumber(item.amount.lovelace).dividedBy('1000000').toNumber();
            } else {
                showAddr = outputOwnAddresses && outputOwnAddresses.length ? outputOwnAddresses[0].address : 'none';
                amount = new BigNumber(fee).dividedBy('1000000').toString();
            }

            amount = item.amount && formatter.format(amount).substring(1);


            return (
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: props.isBlackTheme
                            ? Colors.darkInput
                            : 'transparent',
                        height: heightPercentageToDP(6),
                        marginTop: heightPercentageToDP(1),
                        borderRadius: 12,
                    }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View
                            style={{
                                width: widthPercentageToDP(12),
                                opacity: (item.status === "pending" ? 0.5 : 1),
                                marginLeft: props.isBlackTheme ? widthPercentageToDP(3) : 0,
                            }}>
                            {getIconTxType(item.type)}
                        </View>

                        <View style={{paddingHorizontal: widthPercentageToDP(2)}}>
                            <Text
                                style={{
                                    color: props.isBlackTheme ? Colors.white : Colors.black,
                                    fontSize: 11,
                                    fontFamily: 'AvenirNextCyr-Medium'
                                }}>
                                {addressSlice(showAddr,13)}
                            </Text>
                            <Text
                                style={{
                                    color: props.isBlackTheme ? Colors.white : Colors.black,
                                    fontSize: 10,
                                    fontFamily: 'AvenirNextCyr-Medium'
                                }}>
                                {moment(item.blockTime).format("DD-MM-YYYY hh:mm")}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={props.hideShowTransactionDetailsModal} onPressOut={() => setSelectedTx(item)}>
                        <View
                            style={{
                                flexDirection: 'row',
                                width: props.isBlackTheme ? '90%' : '100%',
                            }}>
                            <View>
                                <Text
                                    style={{
                                        textAlign: 'right',
                                        fontSize: 16,
                                        fontFamily: 'AvenirNextCyr-Medium',
                                        color: props.isBlackTheme ? Colors.white : Colors.black,
                                    }}>
                                    {getSymbolFromTxType(item.type)}{amount}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 8,
                                        textAlign: 'center',
                                        fontFamily: 'AvenirNextCyr-Medium',
                                        fontWeight: item.status && item.status === "pending" ? "bold" : "normal",
                                        color: item.status && item.status === "pending" ? "gray" : "green"
                                    }}>
                                    {item.status ? capitalizeFirstLetter(item.status) : item.status}
                                </Text>
                            </View>
                            <EntypoIcon
                                name="chevron-right"
                                size={24}
                                color={props.isBlackTheme ? Colors.white : Colors.black}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return;
        }
    };

    return (
        <SafeAreaView
            style={{
                ...styles.mainContainer,
                backgroundColor: props.isBlackTheme ? Colors.blackTheme : Colors.white,
            }}>
            <View style={styles.topContainer}>
                <Text
                    style={{
                        ...styles.topTitle,
                        color: props.isBlackTheme ? Colors.white : Colors.black,
                    }}>
                    <WalletIcon
                        onPress={() => props.onContinuePress("ManageAccount")}
                        style={{
                            width: widthPercentageToDP(10), height: heightPercentageToDP(6),
                            marginTop: heightPercentageToDP(2)
                        }}
                    />
                </Text>
                <View style={styles.topContainer2}>
                    <TouchableOpacity onPress={props.onDarkThemePresss}>
                        {props.isBlackTheme ? (
                            <DarkTheme style={{paddingHorizontal: widthPercentageToDP(10)}} />
                        ) : (
                            <Moon style={{paddingHorizontal: widthPercentageToDP(10)}} />
                        )}
                    </TouchableOpacity>
                    {props.isBlackTheme ? (
                        <DarkScanner
                            onPress={() => {
                                setScanner(true);
                                props.hideShowReceiveTokenModal();
                            }}
                        />
                    ) : (
                        <Scanner
                            onPress={() => {
                                setScanner(true);
                                props.hideShowReceiveTokenModal();
                            }}
                        />
                    )}
                </View>
            </View>
            <View style={styles.walletContainer}>
                <View style={styles.walletInnerContainer}>
                    <Text style={styles.delegated}>{currentAccount.delegated ? 'Delegated' : 'Undelegated'}</Text>
                </View>
                <Text style={{...styles.adaText}}>{currentAccount.balance ? currentAccount.balance/1000000 : 0} Ada</Text>
                <Text style={styles.price}>${currentAccount.balance && currPrice.usd ? ((currentAccount.balance/1000000)*currPrice.usd).toFixed(2) : 0.00}</Text>
                <View style={styles.sendReceiveContainer}>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity
                            onPress={props.showCreateTokenScreen}
                            style={{
                                height: heightPercentageToDP(4),
                                width: heightPercentageToDP(4),
                                borderRadius: heightPercentageToDP(4) / 2,
                                backgroundColor: '#213EC2',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Send
                                style={{
                                    paddingHorizontal: widthPercentageToDP(10),
                                    // marginTop: -heightPercentageToDP(4.8)
                                }}
                            />
                        </TouchableOpacity>
                        <Text
                            style={{
                                ...styles.normalText,
                                marginTop: heightPercentageToDP(0.5),
                            }}>
                            Send
                        </Text>
                    </View>
                    <View style={{width: widthPercentageToDP(15)}} />
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity
                            onPress={() => {
                                setScanner(false);
                                props.hideShowReceiveTokenModal();
                            }}
                            style={{
                                height: heightPercentageToDP(4),
                                width: heightPercentageToDP(4),
                                borderRadius: heightPercentageToDP(4) / 2,
                                backgroundColor: '#213EC2',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Receive />
                        </TouchableOpacity>
                        <Text
                            style={{
                                ...styles.normalText,
                                marginTop: heightPercentageToDP(0.2),
                            }}>
                            Receive
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.listHeader}>
                <TouchableOpacity onPress={() => props.onTabOptionPress(WALLET_ROUTE_ASSETS)}>
                    <Text
                        style={{
                            ...styles.topTitle,
                            color: walletRoute === WALLET_ROUTE_ASSETS
                                ? props.isBlackTheme
                                    ? Colors.white
                                    : Colors.black
                                : Colors.hintsColor,
                        }}>
                        Assets
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => props.onTabOptionPress(WALLET_ROUTE_TRANSACTIONS)}>
                    <Text
                        style={{
                            marginRight: 2,
                            ...styles.topTitle,
                            color: walletRoute === WALLET_ROUTE_TRANSACTIONS
                                ? props.isBlackTheme
                                    ? Colors.white
                                    : Colors.black
                                : Colors.hintsColor,
                        }}>
                        Activity
                        <AntDesignIcon onPress={() => fetchData2()} name="sync" color={walletRoute === WALLET_ROUTE_TRANSACTIONS
                            ? props.isBlackTheme
                            ? Colors.white
                            : Colors.black
                            : Colors.hintsColor} size={14} />
                    </Text>
                </TouchableOpacity>
            </View>
            {renderContentTab()}
            <TransactionDetailsModal
                visible={props.transactionDetailsModal}
                hideModal={props.hideShowTransactionDetailsModal}
                isBlackTheme={props.isBlackTheme}
                data={selectedTx}
            />
            <ReceiveTokenModal
                visible={props.receiveTokenModal}
                hideModal={props.hideShowReceiveTokenModal}
                isBlackTheme={props.isBlackTheme}
                QRScanner={scanner}
            />
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingHorizontal: widthPercentageToDP(5),
    },
    secondaryContainer: {
        paddingHorizontal: widthPercentageToDP(6),
    },
    topTitle: {
        fontSize: 15,
        fontFamily: 'AvenirNextCyr-Demi',
        letterSpacing: 1
    },
    topContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: heightPercentageToDP(6),
    },
    topContainer2: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    walletContainer: {
        backgroundColor: Colors.walletBackground,
        borderRadius: 10,
        minHeight: heightPercentageToDP(20),
        paddingHorizontal: widthPercentageToDP(7),
    },
    normalText: {
        textAlign: 'center',
        color: Colors.white,
        fontSize: 12,
        fontFamily: 'AvenirNextCyr-Medium'
    },
    delegated: {
        textAlign: 'center',
        color: Colors.white,
        fontSize: 9,
        fontFamily: 'AvenirNextCyr-Medium'
    },
    walletInnerContainer: {
        backgroundColor: '#213EC2',
        width: widthPercentageToDP(16.5),
        marginTop: heightPercentageToDP(2),
        alignItems: 'center',
        justifyContent: 'center',
        height: heightPercentageToDP(4),
        borderRadius: 8,
    },
    adaText: {
        fontSize: 18,
        letterSpacing: 1,
        color: Colors.white,
        textAlign: 'center',
        marginTop: heightPercentageToDP(3),
        fontFamily: 'AvenirNextCyr-Medium'
    },
    accountName: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
        color: Colors.white,
        textAlign: 'center',
        marginTop: heightPercentageToDP(1),
        fontFamily: 'AvenirNextCyr-Medium'
    },
    sendReceiveContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: heightPercentageToDP(1.5),
        paddingVertical: heightPercentageToDP(2.5),
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: widthPercentageToDP(2),
        paddingVertical: heightPercentageToDP(2),
    },
    listContainer: {
       maxHeight: 300
    },
    price: {
        opacity: 0.8,
        textAlign: 'center',
        color: Colors.white,
        fontSize: 10,
        fontFamily: 'AvenirNextCyr-Medium'
    },
});
export default Wallet;

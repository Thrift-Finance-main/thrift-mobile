import React, {FC, useEffect, useRef, useState} from 'react'
import {View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Button, Dimensions} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '../constants/CustomColors'
import { heightPercentageToDP, widthPercentageToDP } from '../utils/dimensions'
import Moon from '../assets/Moon.svg'
import Scanner from '../assets/Scanner.svg'
import Send from '../assets/Send.svg'
import Receive from '../assets/Receive.svg'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import CopySendBox from '../assets/CopySendBox.svg'
import TransactionDetailsModal from './PopUps/TransactionDetailsModal'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import ReceiveTokenModal from './PopUps/ReceiveTokenModal'
import DarkTheme from '../assets/darkTheme.svg'
import DarkScanner from '../assets/DarkScanner.svg'
import {useDispatch, useSelector} from "react-redux";
import ThriftLogoWhite from "../assets/ThriftFinancelogo.svg";
import ThriftLogo from "../assets/ThriftLogo.svg";
import WalletIcon from "../assets/wallet.svg";
import {fetchBlockfrost, getBlockInfo, getTxInfo, getTxUTxOs} from "../api/Blockfrost";
import {apiDb} from "../db/LiteDb";
import {setCurrentAccount} from "../store/Action";
import {classifyTxs, RECEIVE_TX, SEND_TX} from "../lib/transactions";
import Ada from '../assets/Ada.svg'
import moment from "moment";

interface WalletProps {
    List: any
    receiveTokenModal: boolean
    onContinuePress: (route: string, payload?:any) => void
    hideShowReceiveTokenModal: () => void
    transactionDetailsModal: boolean
    hideShowTransactionDetailsModal: () => void
    showCreateTokenScreen: () => void
    transactionList: any
    showAssets: boolean
    showTransaction: boolean
    onAssetsPress: () => void
    onTransactionPress: () => void
    onDarkThemePresss: () => void
    isBlackTheme: any
}
const Wallet: FC<WalletProps> = (props) => {
    const dispatch = useDispatch();

    const [scanner, setScanner] = useState(false);
    const currentAccount = useSelector((state) => state.Reducers.currentAccount);
    const [currentTxs, setCurrentTxs] = useState([]);
    const [selectedTx, setSelectedTx] = useState(undefined);


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
            console.log('currentAccount');
            console.log(currentAccount);

            const currTxs = await apiDb.getTransactions(currentAccount.accountName, currentAccount.history);
            setCurrentTxs(currTxs);
            console.log('currTxs history');
            console.log(currTxs);
            const saddress = currentAccount && currentAccount.rewardAddress;
            if (saddress) {
                let endpoint = "accounts/" + saddress;
                const accountState = await fetchBlockfrost(endpoint);
                console.log('accountState');
                console.log(accountState);
                endpoint =  "accounts/" + saddress + "/addresses";
                const relatedAddresses = await fetchBlockfrost(endpoint);

                /*
                const accountHistory = await Promise.all(
                    relatedAddresses.map(async (a:any) => {
                        const response = await fetchBlockfrost(`addresses/${a.address}/total`);
                        if (!response.error){
                            return response;
                        }
                    })
                );
                 */


                let currentAccountInLocal = await apiDb.getAccount(currentAccount.accountName);
                currentAccountInLocal.balance = accountState.controlled_amount;
                currentAccountInLocal.delegated = accountState.active;
                currentAccountInLocal.activeEpoch = accountState.active_epoch;
                currentAccountInLocal.poolId = accountState.pool_id;
                currentAccountInLocal.rewardsSum = accountState.rewards_sum;
                currentAccountInLocal.withdrawableAmount = accountState.withdrawable_amount;

                const assetResponse = await fetchBlockfrost(endpoint+'/assets');

                const assetsWithDetails = await Promise.all(
                    assetResponse.map(async(a) => {
                        const response = await fetchBlockfrost(`assets/${a.unit}`);
                        if (!response.error){
                            return response;
                        }
                    })
                );

                currentAccountInLocal.assets = assetsWithDetails;
                await apiDb.updateAccount(currentAccountInLocal);

                dispatch(setCurrentAccount(currentAccountInLocal));

                let addressTxsList = await Promise.all(
                    relatedAddresses.map(async addr =>{
                        const response = await fetchBlockfrost(`addresses/${addr.address}/transactions`);
                        if (!response.error){
                            addr.txs = response;
                            return addr;
                        }
                    })
                );

                let currentTxs = await apiDb.getAccountTransactionsHashes(currentAccount.accountName);

                addressTxsList = addressTxsList.map(txAddr => {
                    txAddr.txs = txAddr.txs.filter(tx => !currentTxs.includes(tx.tx_hash));
                    if (txAddr.txs.length){
                        return txAddr;
                    }
                }).filter(e => e != undefined);

                if (addressTxsList && addressTxsList.length){

                    let addrsWithTxsList = [];
                    for (let addr in addressTxsList) {
                        if (addressTxsList[addr] && addressTxsList[addr].txs && addressTxsList[addr].txs.length){
                            const r = await Promise.all(
                                addressTxsList[addr].txs.map(async tx => {
                                    console.log('tx');
                                    console.log(tx);
                                    // TODO: chek if tx already in local db, NOT query
                                    const txInfo = await getTxInfo(tx.tx_hash);
                                    console.log('txInfo');
                                    console.log(txInfo);
                                    const utxos = await getTxUTxOs(tx.tx_hash);
                                    const blockInfo = await getBlockInfo(tx.tx_hash);
                                    if (!utxos.error){
                                        tx.utxos = utxos;
                                        tx.fees = txInfo.fees;
                                        tx.size = txInfo.size;
                                        tx.asset_mint_or_burn_count = txInfo.asset_mint_or_burn_count;
                                        tx.fromAddress = addressTxsList[addr].address;
                                        return tx;
                                    }
                                })
                            );
                            addrsWithTxsList.push(r)
                        }
                    }

                    const allAddresses = [...currentAccount.externalPubAddress, ...currentAccount.externalPubAddress];
                    const allTransactionsByAddr = [];
                    addrsWithTxsList.map(addrObj => {
                        let cTxs = classifyTxs(addrObj, allAddresses);
                        allTransactionsByAddr.push({address: addrObj[0].fromAddress, history: cTxs });
                    });
                    console.log('allTransactions');
                    console.log(allTransactionsByAddr);

                    allTransactionsByAddr.map(async addr =>{

                        addr.history.map(tx => {
                            if (!currentTxs.includes(tx.txHash)){
                                console.log(tx.txHash)
                                currentTxs.push(tx.txHash);
                            }
                        })
                    });
                    // set hash references in account
                    console.log('currentTxs');
                    console.log(currentTxs);
                    await apiDb.setAccountTransactionsHashes(currentAccount.accountName, currentTxs);

                    // Save transactions
                    await Promise.all(
                        allTransactionsByAddr.map(async addr => {
                            console.log('tx2');
                            console.log(addr);
                            addr.history.map(tx => {
                                apiDb.setAccountTransaction(currentAccount.accountName, tx).then(r=>{});
                            })

                        })
                    );
                    const account = await apiDb.getAccount(currentAccount.accountName);
                    dispatch(setCurrentAccount(account));
                }


            } else {
                console.log("Not current account in store");
            }

        }

        if (isMounted.current) {
            // call the function
            fetchData()
                // make sure to catch any error
                .catch(console.error);
        }

    }, [currentAccount.accountName]);

    const renderItemMenuList = ({item, index}) => {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: props.isBlackTheme
                        ? Colors.darkInput
                        : 'transparent',
                    marginTop: heightPercentageToDP(2),
                    borderRadius: 12,
                    height: heightPercentageToDP(9),
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
                            }}>
                            {Buffer.from(item.asset_name,"hex").toString()}
                        </Text>
                        <View style={{flexDirection: 'row'}} >
                            <Text
                                style={{
                                    color: props.isBlackTheme ? Colors.lightWhite : Colors.black,
                                    fontSize: 11,
                                }}>
                                $5, 625.01
                            </Text>
                            <Text
                                style={{
                                    color: 'green',
                                    fontSize: 11,
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
                        fontSize: 11,
                        paddingHorizontal: props.isBlackTheme
                            ? widthPercentageToDP(3.4)
                            : widthPercentageToDP(3.4),
                    }}>
                    {item.metadata && item.metadata.decimals ? item.quantity/(Math.pow( 10,item.metadata.decimals))  : item.quantity}
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
            default:
                return <AntDesignIcon name="arrowdown" color="green" size={22} />
        }
    }
    const getSymbolFromTxType = (type:string) => {
        switch (type) {
            case RECEIVE_TX:
                return '+'
            case SEND_TX:
                return '-'
            default:
                return ''
        }
    }
    const getAddressToShow = (item:string) => {
        switch (item.type) {
            case RECEIVE_TX:
                return;
            case SEND_TX:
                return <AntDesignIcon name="arrowup" color="red" size={22} />
            default:
                return <AntDesignIcon name="arrowdown" color="green" size={22} />
        }
    }
    const renderItemTransaction = ({item, index}) => {

        if (item){
            return (
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: props.isBlackTheme
                            ? Colors.darkInput
                            : 'transparent',
                        height: heightPercentageToDP(9),
                        marginTop: heightPercentageToDP(2),
                        borderRadius: 12,
                    }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View
                            style={{
                                width: widthPercentageToDP(12),

                                marginLeft: props.isBlackTheme ? widthPercentageToDP(3) : 0,
                            }}>
                            {getIconTxType(item.type)}
                        </View>

                        <View style={{paddingHorizontal: widthPercentageToDP(2)}}>
                            <Text
                                style={{
                                    color: props.isBlackTheme ? Colors.white : Colors.black,
                                    fontSize: 13,
                                }}>
                                addrlq95e.....addrlq95ead..
                            </Text>
                            <Text
                                style={{
                                    color: props.isBlackTheme ? Colors.white : Colors.black,
                                    fontSize: 10,
                                }}>
                                {moment.utc(item.blockTime).format("DD-MM-YYYY hh:mm")}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={props.hideShowTransactionDetailsModal} onPressOut={() => setSelectedTx(item)}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: props.isBlackTheme ? '90%' : '100%',
                            }}>
                            <View>
                                <Text
                                    style={{
                                        textAlign: 'right',
                                        color: props.isBlackTheme ? Colors.white : Colors.black,
                                    }}>
                                    {getSymbolFromTxType(item.type)}{item.amount.lovelace/1000000}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 8,
                                        textAlign: 'center',
                                        color: props.isBlackTheme ? Colors.white : Colors.black,
                                    }}>
                                    Confirmed
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
                <Text style={styles.adaText}>{currentAccount.balance ? currentAccount.balance/1000000 : 0} Ada</Text>
                <Text style={styles.accountName}>{currentAccount.accountName}</Text>
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
                <TouchableOpacity onPress={props.onAssetsPress}>
                    <Text
                        style={{
                            ...styles.topTitle,
                            color: props.showAssets
                                ? props.isBlackTheme
                                    ? Colors.white
                                    : Colors.black
                                : Colors.hintsColor,
                        }}>
                        Assets
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={props.onTransactionPress}>
                    <Text
                        style={{
                            ...styles.topTitle,
                            color: props.showTransaction
                                ? props.isBlackTheme
                                    ? Colors.white
                                    : Colors.black
                                : Colors.hintsColor,
                        }}>
                        History
                    </Text>
                </TouchableOpacity>
            </View>
            {props.showAssets ? (
                <FlatList
                    style={{marginTop: heightPercentageToDP(1)}}
                    data={currentAccount.assets}
                    renderItem={renderItemMenuList}
                    keyExtractor={(item, index) => index.toString()}
                />
            ) : (
                <FlatList
                    style={{marginTop: heightPercentageToDP(1)}}
                    data={currentTxs}
                    renderItem={renderItemTransaction}
                    keyExtractor={(item, index) => index.toString()}
                />
            )}
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
        fontWeight: 'bold',
        letterSpacing: 1,
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
    },
    delegated: {
        textAlign: 'center',
        color: Colors.white,
        fontSize: 9,
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
        fontWeight: 'bold',
        letterSpacing: 1,
        color: Colors.white,
        textAlign: 'center',
        marginTop: heightPercentageToDP(3),
    },
    accountName: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
        color: Colors.white,
        textAlign: 'center',
        marginTop: heightPercentageToDP(1),
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
    }
});
export default Wallet;

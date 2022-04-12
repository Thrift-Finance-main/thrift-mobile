import React, { FC, useState } from 'react'
import {View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, Button} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '../constants/CustomColors'
import { heightPercentageToDP, widthPercentageToDP } from '../utils/dimensions'
import Moon from '../assets/Moon.svg'
import Scanner from '../assets/Scanner.svg'
import Send from '../assets/Send.svg'
import Receive from '../assets/Receive.svg'
import CopySendBox from '../assets/CopySendBox.svg'
import TransactionDetailsModal from './PopUps/TransactionDetailsModal'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import ReceiveTokenModal from './PopUps/ReceiveTokenModal'
import DarkTheme from '../assets/darkTheme.svg'
import DarkScanner from '../assets/DarkScanner.svg'
import {useSelector} from "react-redux";
import ThriftLogoWhite from "../assets/ThriftFinancelogo.svg";
import ThriftLogo from "../assets/ThriftLogo.svg";
import WalletIcon from "../assets/wallet.svg";

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
    const [scanner, setScanner] = useState(false);
    const currentAccount = useSelector((state) => state.Reducers.currentAccount);

    const renderItemMenuList = ({ item, index }) => {
        return (
            <View
                style={{
                    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
                    backgroundColor: props.isBlackTheme ? Colors.darkInput : "transparent",
                    marginTop: heightPercentageToDP(2),
                    borderRadius: 12,
                    height: heightPercentageToDP(9),


                }}
            >

                <View
                    style={{
                        flexDirection: "row", alignItems: "center",
                        // height: heightPercentageToDP(10)
                    }}
                >
                    <View
                        style={{
                            width: widthPercentageToDP(12),
                            marginLeft: props.isBlackTheme ? widthPercentageToDP(3) : 0

                        }}
                    >
                        {item.icon}

                    </View>

                    <View
                        style={{ paddingHorizontal: widthPercentageToDP(5) }}
                    >
                        <Text
                            style={{ color: props.isBlackTheme ? Colors.white : Colors.black, fontSize: 14 }}
                        >{item.title}</Text>
                        <Text
                            style={{ color: props.isBlackTheme ? Colors.lightWhite : Colors.black, fontSize: 11 }}
                        >$5, 625.01</Text>
                    </View>
                </View>
                <Text
                    style={{
                        color: props.isBlackTheme ? Colors.white : Colors.black, fontSize: 11,
                        paddingHorizontal: props.isBlackTheme ? widthPercentageToDP(3.4) : 0

                    }}
                >5 ETH</Text>
            </View>

        )
    }




    const renderItemTransaction = ({ item, index }) => {
        return (

            <View
                style={{
                    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
                    backgroundColor: props.isBlackTheme ? Colors.darkInput : "transparent",
                    height: heightPercentageToDP(9),
                    marginTop: heightPercentageToDP(2),
                    borderRadius: 12,
                }}
            >

                <View
                    style={{ flexDirection: "row", alignItems: "center", }}
                >
                    <View
                        style={{
                            width: widthPercentageToDP(12),

                            marginLeft: props.isBlackTheme ? widthPercentageToDP(3) : 0
                        }}
                    >
                        {item.icon}

                    </View>

                    <View
                        style={{ paddingHorizontal: widthPercentageToDP(2) }}
                    >
                        <Text
                            style={{
                                color:
                                    props.isBlackTheme ? Colors.white :
                                        Colors.black, fontSize: 13
                            }}
                        >{item.title}</Text>
                        <Text
                            style={{
                                color:
                                    props.isBlackTheme ? Colors.white :
                                        Colors.black,
                            }}
                        >23-11-2021</Text>
                    </View>

                </View>
                <TouchableOpacity
                    onPress={props.hideShowTransactionDetailsModal}

                >
                    <View
                        style={{
                            flexDirection: "row", alignItems: "center", justifyContent: "center",
                            width: props.isBlackTheme ? "80%" : "90%"
                        }}
                    >
                        <View>
                            <Text
                                style={{
                                    color:
                                        props.isBlackTheme ? Colors.white :
                                            Colors.black,
                                }}
                            >-1.500 Ada</Text>
                            <Text
                                style={{
                                    fontSize: 12, textAlign: "center", color:
                                        props.isBlackTheme ? Colors.white :
                                            Colors.black,
                                }}
                            >Confirmed</Text>
                        </View>
                        <EntypoIcon
                            name="chevron-right"
                            size={24}
                            color={props.isBlackTheme ? Colors.white : Colors.black}
                        />

                    </View>
                </TouchableOpacity>
            </View>
        )
    }








    return (
        <SafeAreaView style={{
            ...styles.mainContainer, backgroundColor: props.isBlackTheme ? Colors.blackTheme :
                Colors.white,
        }}>
                <View style={styles.secondaryContainer}>
                    <View
                        style={styles.topContainer}
                    >
                        <WalletIcon
                            onPress={() => props.onContinuePress("ManageAccount")}
                            style={{
                                width: widthPercentageToDP(10), height: heightPercentageToDP(6),
                                marginTop: heightPercentageToDP(2)
                            }}
                        />
                        <View
                            style={styles.topContainer2}
                        >
                            <TouchableOpacity
                                onPress={props.onDarkThemePresss}
                            >
                                {
                                    props.isBlackTheme ? <DarkTheme
                                        style={{ paddingHorizontal: widthPercentageToDP(10) }}
                                    /> : <Moon
                                        style={{ paddingHorizontal: widthPercentageToDP(10) }}
                                    />

                                }

                            </TouchableOpacity>
                            {
                                props.isBlackTheme ? <DarkScanner
                                    onPress={() =>  {setScanner(true);props.hideShowReceiveTokenModal()}}

                                />
                                    : <Scanner
                                    onPress={() =>  {setScanner(true);props.hideShowReceiveTokenModal()}}
                                    />
                            }

                        </View>

                    </View>
                    <View
                        style={styles.walletContainer}>
                        <View style={{padding:5}}>
                            <Text
                                style={{ ...styles.topTitle, color: props.isBlackTheme ? Colors.white : Colors.white }}
                            >{currentAccount.accountName}
                            </Text>


                        </View>
                        <Text
                            style={styles.adaText}
                        >{currentAccount.balance/1000000} Ada</Text>
                        <View style={styles.sendReceiveContainer}>
                            <View
                                style={{ justifyContent: "center", alignItems: "center" }}
                            >
                                <TouchableOpacity onPress={props.showCreateTokenScreen} style={{ height: heightPercentageToDP(4), width: heightPercentageToDP(4), borderRadius: heightPercentageToDP(4) / 2, backgroundColor: '#213EC2', justifyContent: 'center', alignItems: 'center' }} >

                                    <Send
                                        style={{
                                            paddingHorizontal: widthPercentageToDP(10),
                                            // marginTop: -heightPercentageToDP(4.8)
                                        }}
                                    />
                                </TouchableOpacity>
                                <Text
                                    style={{ ...styles.normalText, marginTop: heightPercentageToDP(.5) }}
                                >Send</Text>
                            </View>
                            <View style={{ width: widthPercentageToDP(15) }} />
                            <View
                                style={{ justifyContent: "center", alignItems: "center" }}
                            >
                                <TouchableOpacity onPress={() =>  {setScanner(false);props.hideShowReceiveTokenModal()}} style={{ height: heightPercentageToDP(4), width: heightPercentageToDP(4), borderRadius: heightPercentageToDP(4) / 2, backgroundColor: '#213EC2', justifyContent: 'center', alignItems: 'center' }} >
                                    <Receive />
                                </TouchableOpacity>
                                <Text
                                    style={{ ...styles.normalText, marginTop: heightPercentageToDP(0.2) }}
                                >Receive</Text>
                            </View>

                        </View>
                    </View>
                    <View
                        style={styles.listHeader}
                    >
                        <TouchableOpacity
                            onPress={props.onAssetsPress}
                        >

                            <Text
                                style={{
                                    ...styles.topTitle, color:
                                        props.showAssets ?
                                            props.isBlackTheme ?
                                                Colors.white : Colors.black : Colors.hintsColor
                                }}
                            >Assets</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={props.onTransactionPress}
                        >
                            <Text
                                style={{
                                    ...styles.topTitle, color: props.showTransaction ?
                                        props.isBlackTheme ?
                                            Colors.white : Colors.black : Colors.hintsColor
                                }}
                            >Transactions</Text>
                        </TouchableOpacity>


                    </View>
                    <View

                    >
                        {props.showAssets ? <FlatList
                            style={{ marginTop: heightPercentageToDP(1), }}
                            data={props.List}
                            renderItem={renderItemMenuList}
                            keyExtractor={(item, index) => index.toString()}
                        /> : <FlatList
                            style={{ marginTop: heightPercentageToDP(1), }}
                            data={props.transactionList}
                            renderItem={renderItemTransaction}
                            keyExtractor={(item, index) => index.toString()}
                        />}
                    </View>
                    <TransactionDetailsModal
                        visible={props.transactionDetailsModal}
                        hideModal={props.hideShowTransactionDetailsModal}
                        isBlackTheme={props.isBlackTheme}

                    />
                    <ReceiveTokenModal
                        visible={props.receiveTokenModal}
                        hideModal={props.hideShowReceiveTokenModal}
                        isBlackTheme={props.isBlackTheme}
                        QRScanner={scanner}
                        onReadQr={(data:string) => props.onContinuePress("CreateToken", data)}
                    />
                    <View
                        style={{ height: heightPercentageToDP(4) }}
                    />
                </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    secondaryContainer: {
        paddingHorizontal: widthPercentageToDP(6)
    },
    topTitle: {
        fontSize: 18,
        fontWeight: "bold",
        letterSpacing: 1,
        paddingVertical: 14
    },
    topContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: heightPercentageToDP(6)
    },
    topContainer2: {
        flexDirection: "row",
        alignItems: "center",
    },
    walletContainer: {
        backgroundColor: Colors.walletBackground,
        borderRadius: 10, minHeight: heightPercentageToDP(20),
        paddingHorizontal: widthPercentageToDP(7)
    },
    normalText: {
        textAlign: "center",
        color: Colors.white,
        fontSize: 12
    },
    walletInnerContainer: {
        backgroundColor: "#213EC2",
        width: widthPercentageToDP(16.5),
        marginTop: heightPercentageToDP(2)
        , alignItems: "center", justifyContent: "center",
        height: heightPercentageToDP(4),
        borderRadius: 8
    },
    adaText: {
        fontSize: 18,
        fontWeight: "bold",
        letterSpacing: 1
        , color: Colors.white,
        textAlign: "center",
        marginTop: heightPercentageToDP(3)
    },
    sendReceiveContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: heightPercentageToDP(1.5),
        paddingVertical: heightPercentageToDP(2.5)
    },
    listHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: widthPercentageToDP(2),
        paddingVertical: heightPercentageToDP(2)
    }
})
export default Wallet;

import React, { FC, useState } from 'react'
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import OTPTextView from 'react-native-otp-textinput'
import Colors from '../constants/Colors'
import { heightPercentageToDP, widthPercentageToDP } from '../utils/dimensions'
import Button from './Common/Button'
import Back from '../assets/back.svg'
import DarkBack from '../assets//DarkBack.svg'
import CustomModal from './PopUps/CustomModal'
import ThriftLogo from '../assets/ThriftLogo.svg'
import ThriftLogoWhite from '../assets/ThriftFinancelogo.svg'
import Icon from 'react-native-vector-icons/Ionicons'
import FingerPrint from '../assets/FingerPrint.svg'
interface ThumbPrintProps {
    onConfirmPress: () => void
    onBackIconPress: () => void
    visible: boolean,
    hideModal: () => void,
    isBlackTheme: any,
    navigation: any
}
const ThumbPrint: FC<ThumbPrintProps> = (props : ThumbPrintProps) => {
    const [otp, setOtp] = useState(0);
    const firstThreeButtons = [
        {
            value : '1',
        },
        {
            value : '2'
        },
        {
            value : '3'
        }
    ];
    const secondThreeButtons = [
        {
            value: '4',
        },
        {
            value: '5',
        },
        {
            value: '6',
        }
    ];
    const thirdThreeButtons = [
        {
            value: '7',
        },
        {
            value: '8',
        },
        {
            value: '9'
        }
    ];
    const onChangeText = text => {
        setOtp(text)
    }
    return (
        <SafeAreaView style={{
            ...styles.mainContainer, backgroundColor:
                props.isBlackTheme ? Colors.blackTheme :
                    Colors.background,
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
                    <View
                        style={{ alignItems: "center" }}
                    >
                        {
                            props.isBlackTheme ?
                            <ThriftLogoWhite
                                style={{
                                    width: widthPercentageToDP(10), height: heightPercentageToDP(10),
                                    marginTop: heightPercentageToDP(7)
                                }}
                            />
                            :
                            <ThriftLogo
                                style={{
                                    width: widthPercentageToDP(10), height: heightPercentageToDP(10),
                                    marginTop: heightPercentageToDP(7)
                                }}
                            />
                        }
                        <Text
                            style={{
                                ...styles.topTitle, color:
                                    props.isBlackTheme ? Colors.white :
                                        Colors.black,
                            }}
                        >Enter Your Pin</Text>

                        <View
                            style={{ paddingHorizontal: widthPercentageToDP(2.5) }}
                        >
                            <OTPTextView
                                autoFocusOnLoad={true}
                                autoFocus={false}
                                value={otp}
                                disable
                                textInputStyle={{
                                    ...styles.roundedTextInput, backgroundColor: props.isBlackTheme ? Colors.darkInput :
                                        Colors.otpBackground,
                                        color: props.isBlackTheme ? Colors.white : Colors.black
                                }} inputCount={4}
                                onChangeText={onChangeText}
                                tintColor={"transparent"}
                                offTintColor={"transparent"}
                                secureTextEntry={true}

                            />
                        </View>

                    </View>

                    <View
                        style={{ height: heightPercentageToDP(5) }}
                    />
                    <View style={{flexDirection : 'row', justifyContent : 'space-between', paddingHorizontal : widthPercentageToDP(2.5)}} >
                        {
                            firstThreeButtons.map ((item, index) => {
                                return <TouchableOpacity key={index} style={{
                                    ...styles.buttonStyle, backgroundColor: props.isBlackTheme ? Colors.darkInput :
                                        Colors.white,
                                }}  onPress={() => console.log({})}>
                                    <Text style={{fontSize : widthPercentageToDP(5), fontWeight : 'bold', color: props.isBlackTheme ? Colors.white : Colors.black }} >{item.value}</Text>
                                </TouchableOpacity>
                            })
                        }
                    </View>
                    <View style={{flexDirection : 'row', justifyContent : 'space-between', paddingHorizontal : widthPercentageToDP(2.5), marginTop: heightPercentageToDP(2)}} >
                        {
                            secondThreeButtons.map ((item, index) => {
                                return <TouchableOpacity key={index} style={{
                                    ...styles.buttonStyle, backgroundColor: props.isBlackTheme ? Colors.darkInput :
                                        Colors.white,
                                }}  onPress={() => console.log({})} >
                                    <Text style={{fontSize : widthPercentageToDP(5), fontWeight : 'bold', color: props.isBlackTheme ? Colors.white : Colors.black }} >{item.value}</Text>
                                </TouchableOpacity>
                            })
                        }
                    </View>
                    <View style={{flexDirection : 'row', justifyContent : 'space-between', paddingHorizontal : widthPercentageToDP(2.5), marginTop: heightPercentageToDP(2)}} >
                        {
                            thirdThreeButtons.map ((item, index) => {
                                return <TouchableOpacity key={index} style={{
                                    ...styles.buttonStyle, backgroundColor: props.isBlackTheme ? Colors.darkInput :
                                        Colors.white,
                                }}  onPress={() => console.log({})} >
                                    <Text style={{fontSize : widthPercentageToDP(5), fontWeight : 'bold', color: props.isBlackTheme ? Colors.white : Colors.black }} >{item.value}</Text>
                                </TouchableOpacity>
                            })
                        }
                    </View>
                    <View style={{flexDirection : 'row', justifyContent : 'space-between', paddingHorizontal : widthPercentageToDP(2.5), marginTop: heightPercentageToDP(2)}} >
                        {
                            thirdThreeButtons.map ((item, index) => {
                                return <TouchableOpacity key={index} style={{
                                    ...styles.buttonStyle, backgroundColor: props.isBlackTheme ? Colors.darkInput :
                                        Colors.white,
                                }}  onPress={() => 
                                {
                                    if (index === 0) props.onConfirmPress()
                                    else console.log({})
                                }} >
                                    {
                                        index === 0 ?
                                        <FingerPrint
                                        />
                                        :
                                        index ===1 ?
                                        <Text style={{fontSize : widthPercentageToDP(5), fontWeight : 'bold', color: props.isBlackTheme ? Colors.white : Colors.black }} >{'0'}</Text>
                                        :
                                        <Icon name={'backspace-outline'} size={20} color={props.isBlackTheme ? Colors.white : Colors.black} />
                                    }
                                </TouchableOpacity>
                            })
                        }
                    </View>
                    <View
                        style={{ height: heightPercentageToDP(2) }}
                    />
                </View>
            </ScrollView>
            <CustomModal
                isBlackTheme={props.isBlackTheme}
                visible={props.visible}
                hideModal={props.hideModal}
                modalText='Unlocked'
            />
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        width: "100%",
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
        fontSize: widthPercentageToDP(4.4),
        fontWeight: "bold",
        marginTop: heightPercentageToDP(8),
        letterSpacing: 1,
        paddingHorizontal: widthPercentageToDP(4),
        paddingVertical: heightPercentageToDP(2)
    },
    filedHeader: {
        fontSize: 14,
        color: Colors.black,
        marginTop: heightPercentageToDP(2.5),
        letterSpacing: 1,
        paddingHorizontal: widthPercentageToDP(4),
        paddingVertical: heightPercentageToDP(2.5),
        fontWeight: "bold"
    },
    hintStyle: {
        color: Colors.hintsColor,
        fontSize: 10,
        paddingHorizontal: widthPercentageToDP(4),
        marginTop: heightPercentageToDP(1)
    },
    roundedTextInput: {
        borderRadius: 8,
        borderWidth: 2,
        borderBottomWidth: 2,
        // borderColor: "#EBEBEB",
        width: widthPercentageToDP(15),
        height: heightPercentageToDP(8),

    },
    buttonStyle: {
        borderRadius: 8,
        width: widthPercentageToDP(25),
        height: heightPercentageToDP(8),
        justifyContent : 'center',
        alignItems: 'center'
    },
    imageStyle: {
        width: widthPercentageToDP(20),
        height: heightPercentageToDP(6),
        alignSelf: "center",
      },
})
export default ThumbPrint;

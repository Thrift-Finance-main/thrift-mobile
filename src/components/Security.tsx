import React, { FC, useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '../constants/CustomColors'
import { heightPercentageToDP, widthPercentageToDP } from '../utils/dimensions'
import Forward from '../assets/Forward.svg'
import Back from '../assets/back.svg'
import Toggle from '../assets/Toggle.svg'
import CustomModal from './PopUps/CustomModal'
import DarkBack from '../assets//DarkBack.svg'
import DarkForward from '../assets/DarkForward.svg'
import ToggleSwitch from 'toggle-switch-react-native'

interface SecurityProps {
    MenuList: any
    onBackIconPress: () => void
    onChangePasswordPress: () => void
    unlockCodePress: () => void
    visible: boolean,
    hideModal: () => void,
    onFingerPrintPress: () => void
    isBlackTheme: any
}
const Security: FC<SecurityProps> = (props) => {
    const [toggle, setToggle] = useState(false)

    const onToggle = val => {
        setToggle(val)
        if (val) {
            props.onFingerPrintPress()
        }
    }

    const renderItemMenuList = ({ item, index }) => {
        return (
            <>
                <TouchableOpacity
                    style={styles.renderTopContainer}

                    activeOpacity={1}
                    onPress={index == 1 ? props.onChangePasswordPress : index == 0 ? props.unlockCodePress : () => console.log()
                    }
                >
                    <View
                        style={styles.renderIconContainer}
                    >
                        <View
                            style={styles.renderIcon}>
                            {item.icon}

                        </View>
                        <Text
                            style={{
                                ...styles.renderTitle, color:
                                    props.isBlackTheme ? Colors.white :
                                        Colors.black,
                            }}
                        >{item.title}</Text>
                    </View>
                    {
                        index === 2 ?
                        <ToggleSwitch
                        isOn={toggle}
                        onColor={props.isBlackTheme ? Colors.white : Colors.black}
                        offColor="grey"
                        size="small"
                        thumbOnStyle={{backgroundColor: props.isBlackTheme ? Colors.black : Colors.white}}
                        onToggle={isOn => onToggle(isOn)}
                      />


                            :
                            props.isBlackTheme ? <DarkForward
                                style={{ paddingHorizontal: widthPercentageToDP(5) }}

                            /> :
                                <Forward
                                    style={{ paddingHorizontal: widthPercentageToDP(5) }}
                                />
                    }



                </TouchableOpacity>
                {
                    index == 3 ? <View
                        style={{ height: heightPercentageToDP(4) }}
                    /> : null
                }
            </>

        )
    }
    return (
        <SafeAreaView style={{
            ...styles.mainContainer, backgroundColor:
                props.isBlackTheme ? Colors.blackTheme :
                    Colors.white,
        }}>
            <View style={styles.secondaryContainer}>
                <View
                    style={{ flexDirection: "row", alignItems: "center" }}
                >
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
                    <Text
                        style={{
                            ...styles.topTitle, color:
                                props.isBlackTheme ? Colors.white :
                                    Colors.black,
                        }}
                    >Security</Text>
                </View>
                <View>
                    <FlatList
                        style={{ marginTop: heightPercentageToDP(6), }}
                        scrollEnabled={true}
                        data={props.MenuList}
                        renderItem={renderItemMenuList}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
                <View
                    style={{ height: heightPercentageToDP(13) }}
                />
            </View>
            <CustomModal
                isBlackTheme={props.isBlackTheme}
                visible={props.visible}
                hideModal={props.hideModal}
                modalText='Finger print lock is activated successfully'
                security={true}
            />
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
        fontFamily: 'AvenirNextCyr-Demi',
        // textAlign: "center",
        letterSpacing: 1,
        marginTop: heightPercentageToDP(3),
        paddingHorizontal: widthPercentageToDP(20),
        textAlign: "center"
    },
    renderTopContainer: {
        paddingVertical: heightPercentageToDP(2),
        flexDirection: "row",
        justifyContent: "space-between", alignItems: "center",
    },
    renderIconContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: widthPercentageToDP(2)
    },
    renderIcon: {
        backgroundColor: Colors.settingsContainerBack,
        width: widthPercentageToDP(12)
        , height: heightPercentageToDP(6),
        borderRadius: 10,
        justifyContent: "center", alignItems: "center",
    },
    renderTitle: {
        fontSize: 15,
        fontWeight: "500",
        paddingHorizontal: widthPercentageToDP(3),
        textAlign: "center",
        fontFamily: 'AvenirNextCyr-Medium',
    },
    renderSubTitle: {
        paddingHorizontal: widthPercentageToDP(4),
        color: Colors.black, fontSize: 12
    }
})
export default Security;

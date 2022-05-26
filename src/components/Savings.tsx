import React, { FC } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '../constants/CustomColors'
import { heightPercentageToDP, widthPercentageToDP } from '../utils/dimensions'
import DarkBack from '../assets//DarkBack.svg'
import Back from '../assets/back.svg'
import InputField from './Common/InputField'
import PickerModal from './PopUps/PickerModal'
import DropDownMenu from './Common/DropDownMenu'
import DropDownMenu1 from './Common/DropDownMenu'
import PickerModal1 from './PopUps/PickerModal'
import AddImage from '../assets/AddImage.svg'
import Button from './Common/Button'
import SavingTop from '../assets/SavingTop.svg'

import Calendar from '../assets/WhiteCalendar.svg'


import * as Progress from 'react-native-progress';

interface SavingsProps {
    //   onContinuePress: () => void
    isBlackTheme: any
    onBackIconPress: () => void
    dropDownVisible: boolean
    pickerModal: boolean
    hideShowLanguageModal: () => void
    proceed: (AGR1: any) => void
    hideDropDownMenu: () => void
    showDropDownMenu: () => void
    updateDropDownText: (AGR1: any, ARG2: any) => void
    languageList: any
    dropDownText: any


    dropDownVisible1: boolean
    pickerModal1: boolean
    dropDownText1: any
    hideDropDownMenu1: () => void
    showDropDownMenu1: () => void
    updateDropDownText1: (AGR1: any, ARG2: any) => void
    hideShowLanguageModal1: () => void
    proceed1: () => void

}
const Savings: FC<SavingsProps> = (props) => {
    const widthAndHeight = 220
    const series = [123, 321, 123, 789, 537]
    const sliceColor = ['#F44336', '#2196F3', '#FFEB3B', '#4CAF50', '#FF9800']
    return (
        <SafeAreaView style={{
            ...styles.mainContainer, backgroundColor:
                props.isBlackTheme ? Colors.blackTheme :
                    Colors.white,
        }}>
            <View style={styles.secondaryContainer}>
                <View
                    style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
                >
                    <View
                        style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}
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
                        >Savings</Text>
                    </View>
                    <SavingTop
                        style={{ marginTop: heightPercentageToDP(3), marginLeft: widthPercentageToDP(3) }}

                    />
                </View>

                <View
                    style={{ paddingVertical: heightPercentageToDP(3) }}
                >

                    <View
                        style={styles.container2}
                    >

                        <Text
                            style={styles.container2Title}
                        >Phone Budget</Text>
                        <View
                            style={styles.row1}
                        >
                            <Text
                                style={styles.container2Sub}
                            >Balance</Text>
                            <Text
                                style={styles.container2Sub}
                            >Target</Text>

                        </View>
                        <View
                            style={styles.row2}
                        >
                            <Text
                                style={styles.subBold}
                            >N5,000</Text>
                            <Text
                                style={styles.subBold}
                            >N200,000</Text>

                        </View>
                        <View
                            style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: heightPercentageToDP(3.5) }}
                        >
                            <Calendar />
                            <View>
                                <View
                                    style={{ flexDirection: "row", alignItems: "center" }}
                                >
                                    <Text
                                        style={styles.container2Sub}
                                    >Start: </Text>
                                    <Text
                                        style={styles.subBold}
                                    >20th January 2022</Text>
                                </View>
                                <View
                                    style={{ flexDirection: "row", alignItems: "center" }}
                                >
                                    <Text
                                        style={styles.container2Sub}
                                    >End: </Text>
                                    <Text
                                        style={styles.subBold}
                                    >25th January 2022</Text>
                                </View>
                            </View>
                            <Progress.Bar progress={0.3} width={100}
                                style={{ marginLeft: widthPercentageToDP(2) }}
                                color="green"
                                unfilledColor={Colors.white}
                            />

                        </View>
                    </View>





















                    <View
                        style={{ ...styles.container2, marginTop: heightPercentageToDP(4) }}
                    >

                        <Text
                            style={styles.container2Title}
                        >Lappy Budget</Text>
                        <View
                            style={styles.row1}
                        >
                            <Text
                                style={styles.container2Sub}
                            >Balance</Text>
                            <Text
                                style={styles.container2Sub}
                            >Target</Text>

                        </View>
                        <View
                            style={styles.row2}
                        >
                            <Text
                                style={styles.subBold}
                            >N10,000</Text>
                            <Text
                                style={styles.subBold}
                            >N300,000</Text>

                        </View>
                        <View
                            style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: heightPercentageToDP(3.5) }}
                        >
                            <Calendar />
                            <View>
                                <View
                                    style={{ flexDirection: "row", alignItems: "center" }}
                                >
                                    <Text
                                        style={styles.container2Sub}
                                    >Start: </Text>
                                    <Text
                                        style={styles.subBold}
                                    >20th January 2022</Text>
                                </View>
                                <View
                                    style={{ flexDirection: "row", alignItems: "center" }}
                                >
                                    <Text
                                        style={styles.container2Sub}
                                    >End: </Text>
                                    <Text
                                        style={styles.subBold}
                                    >25th January 2022</Text>
                                </View>
                            </View>
                            <Progress.Bar progress={0.1} width={100}
                                style={{ marginLeft: widthPercentageToDP(2) }}
                                color="green"
                                unfilledColor={Colors.white}
                            />

                        </View>
                    </View>

                </View>
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
        fontFamily: 'AvenirNextCyr-Demi',
        // textAlign: "center",
        letterSpacing: 1,
        marginTop: heightPercentageToDP(3),
        paddingHorizontal: widthPercentageToDP(5),
        textAlign: "center"
    },
    container2: {
        backgroundColor: Colors.color3,
        height: heightPercentageToDP(25),
        borderRadius: 10,
        width: "100%",
        alignSelf: "center",
        paddingHorizontal: widthPercentageToDP(5)
    },
    container2Title: {
        color: Colors.white,
        fontSize: 15,
        fontFamily: 'AvenirNextCyr-Demi',
        marginTop: heightPercentageToDP(1.7)
    },
    container2Sub: { color: Colors.white, fontSize: 12, fontFamily: 'AvenirNextCyr-Medium', },
    row1: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: heightPercentageToDP(1.7)
    },
    subBold: { color: Colors.white, fontSize: 13, fontFamily: 'AvenirNextCyr-Demi' },
    row2: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: heightPercentageToDP(1) }
})
export default Savings;

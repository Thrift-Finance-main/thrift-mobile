import React, { FC, useState } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, ScrollView, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '../constants/Colors'
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
import DateTimePicker from '@react-native-community/datetimepicker';
import Calendar from '../assets/Calendar.svg'
import LanguageModal from './PopUps/LanguageModal'



interface CreateTargetProps {
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
    onPressedCameraIcon: () => void
    imageUrl: any
    onSetTargetPress: () => void

}
const CreateTarget: FC<CreateTargetProps> = (props) => {
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [dateTo, setDateTo] = useState(new Date());
    const [from, setFrom] = useState(false);
    const [calLabel, setCalLabel] = useState("Set Target Duration *")
    // const widthAndHeight = 220
    // const series = [123, 321, 123, 789, 537]
    // const sliceColor = ['#F44336', '#2196F3', '#FFEB3B', '#4CAF50', '#FF9800']
    return (
        <SafeAreaView style={{
            ...styles.mainContainer, backgroundColor:
                props.isBlackTheme ? Colors.blackTheme :
                    Colors.white,
        }}>
            <ScrollView>
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
                        >Create Target</Text>
                    </View>
                    <View
                        style={{ paddingVertical: heightPercentageToDP(5) }}
                    >
                        <InputField
                            backgroundColor={props.isBlackTheme ? Colors.darkInput : Colors.white}
                            placeHolder="Title *"
                            placeholderTextColor={props.isBlackTheme ? Colors.white : Colors.black}

                        />
                        <View
                            style={{ marginTop: heightPercentageToDP(3), width: "98%", alignSelf: "center" }}
                        >
                            <DropDownMenu
                                dropDownVisible={props.dropDownVisible}
                                hideDropDownMenu={props.hideDropDownMenu}
                                showDropDownMenu={props.hideShowLanguageModal}
                                languageList={props.languageList}
                                dropDownText={props.dropDownText}
                                updateDropDownText={props.updateDropDownText}
                                isBlackTheme={props.isBlackTheme}
                                borderColor={Colors.inputFieldBorder}
                            />
                        </View>
                        <View style={{
                                ...styles.inputBox, backgroundColor: props.isBlackTheme ? Colors.blackTheme : Colors.white,
                                color: props.isBlackTheme ? Colors.white : Colors.authTitle

                            }} >
                        <TextInput
                            multiline={true}
                            placeholder="Plan Purpose eg:  Saving  for my house rent. *"
                        />
                        </View>
                    </View>
                    <View
                        style={{ marginTop: -heightPercentageToDP(1.5), width: "98%", alignSelf: "center" }}
                    >
                        <DropDownMenu1
                            dropDownVisible={props.dropDownVisible1}
                            hideDropDownMenu={props.hideDropDownMenu1}
                            showDropDownMenu={props.hideShowLanguageModal1}
                            languageList={props.languageList}
                            dropDownText={props.dropDownText1}
                            updateDropDownText={props.updateDropDownText1}
                            isBlackTheme={props.isBlackTheme}
                            borderColor={Colors.inputFieldBorder}
                        />
                    </View>

                    <TouchableOpacity
                        style={{
                            ...styles.inputBox, backgroundColor: props.isBlackTheme ? Colors.blackTheme : Colors.white,
                        }}
                        onPress={props.onPressedCameraIcon}
                    >
                        {
                            props.imageUrl == null ? <>
                                <AddImage
                                    style={{ alignSelf: "center" }}

                                />

                                <Text
                                    style={{
                                        textAlign: "center",
                                        color: props.isBlackTheme ? Colors.white : Colors.authTitle
                                    }}
                                >Add an image for your target</Text></>
                                : <Image
                                    source={{
                                        uri: props.imageUrl,
                                    }}
                                    style={{
                                        width: "100%",
                                        height: heightPercentageToDP(12),
                                        borderRadius: 5
                                    }}
                                    resizeMode="contain"
                                />
                        }
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.calBtn}
                        onPress={() => setShow(true)}
                    >

                        <Text
                            style={{
                                textAlign: "center", color: props.isBlackTheme ? Colors.white : Colors.authTitle
                            }}


                        >

                            {
                                calLabel == "" ?
                                    dateTo.toDateString() : calLabel}
                        </Text>
                        <Calendar />

                    </TouchableOpacity>

                    {show && (
                        <DateTimePicker
                            isVisible={false}
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            is24Hour={true}
                            minimumDate={new Date()}
                            onChange={(event, selectedDate) => {
                                const currentDate = selectedDate || date;
                                setShow(Platform.OS === 'ios');
                                from ? setDate(currentDate) : setDateTo(currentDate);
                                setCalLabel("")
                            }}
                        />
                    )}

<View
                        style={[styles.calBtn, {height : heightPercentageToDP(7)}]}
                    >

                        <TextInput
                            style={{
                                textAlign: "center", color: props.isBlackTheme ? Colors.white : Colors.authTitle
                            }}
                            placeholder={'Set periodic amount*'}
                        ></TextInput>
                    </View>

                    <View
                        style={[styles.calBtn, {height : heightPercentageToDP(7)}]}
                    >

                        <TextInput
                            style={{
                                textAlign: "center", color: props.isBlackTheme ? Colors.white : Colors.authTitle
                            }}
                            placeholder={'Set target amount*'}
                        ></TextInput>
                    </View>


                    <View
                        style={{ marginTop: heightPercentageToDP(3.3), marginBottom: heightPercentageToDP(3) }}
                    >
                        <Button
                            backgroundColor={Colors.primaryButton}
                            buttonTitle='Set Target'
                            onPress={props.onSetTargetPress}
                            titleTextColor={props.isBlackTheme ? Colors.black : Colors.white}
                        />
                    </View>
                </View>
                <PickerModal
                    visible={props.pickerModal}
                    hideModal={props.hideShowLanguageModal}
                    proceed={props.proceed}
                    isBlackTheme={props.isBlackTheme}
                    Data={[{
                        title: "Liquid Finance",
                        subTitle: "10% APR"
                    },
                    {
                        title: "Indigo Protocol",
                        subTitle: "8% APR"

                    },
                    {
                        title: "Ardana",
                        subTitle: "9% APR"

                    },
                    {
                        title: "Vy Finance",
                        subTitle: "12% APR"

                    },

                    ]}
                />
                {/* <PickerModal1
                    visible={props.pickerModal1}

                    hideModal={props.hideShowLanguageModal1}
                    proceed={props.proceed1}
                    isBlackTheme={props.isBlackTheme}
                    Data={[{
                        title: "By Weekly",
                        subTitle: ""
                    },
                    {
                        title: "By Monthly",
                        subTitle: ""

                    },
                    {
                        title: "By Yearly",
                        subTitle: ""

                    },
                    ]}
                /> */}


                <LanguageModal
                    visible={props.pickerModal1}
                    hideModal={props.hideShowLanguageModal1}
                    proceed={props.proceed1}
                    isBlackTheme={props.isBlackTheme}
                    Data={[{
                        title: "Bi-weekly",
                        subTitle: ""
                    },
                    {
                        title: "Weekly",
                        subTitle: ""

                    },
                    {
                        title: "Monthly",
                        subTitle: ""

                    },
                    {
                        title: "Yearly",
                        subTitle: ""

                    }
                    ]}
                />
            </ScrollView>
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
        // textAlign: "center",
        letterSpacing: 1,
        marginTop: heightPercentageToDP(3),
        paddingHorizontal: widthPercentageToDP(20),
        textAlign: "center"
    },
    inputBox: {
        marginTop: heightPercentageToDP(3),
        width: "98%",
        borderColor: Colors.inputFieldBorder,
        paddingVertical : heightPercentageToDP(4),
        borderWidth: 1,
        borderRadius: 5,
        alignSelf: "center",
        justifyContent: "center",
        paddingHorizontal: widthPercentageToDP(8),
    },
    calBtn: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 10,
        height: heightPercentageToDP(10),
        borderColor: Colors.dropDownBorderColor,
        borderWidth: 1,
        width: "98%",
        alignSelf: "center",
        paddingHorizontal: widthPercentageToDP(5),
        marginTop: heightPercentageToDP(3)
    }
})
export default CreateTarget;

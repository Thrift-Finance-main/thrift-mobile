import React, { FC } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '../constants/CustomColors'
import { heightPercentageToDP, widthPercentageToDP } from '../utils/dimensions'
import Button from './Common/Button'
import DropDownMenu from './Common/DropDownMenu'
import LanguageModal from './PopUps/LanguageModal'
interface LanguageProps {
    dropDownVisible: boolean,
    hideDropDownMenu: () => void,
    showDropDownMenu: () => void,
    languageList: any,
    dropDownText: string,
    updateDropDownText: (ARG1: any, ARG2?: any) => void,
    onContinuePress: () => void
    languageModal: boolean
    hideShowLanguageModal: () => void
    proceed: (ARG1: any) => void,
    isBlackTheme: any
}
const Language: FC<LanguageProps> = (props) => {
    return (
        <SafeAreaView style={{
            ...styles.mainContainer, backgroundColor:
                props.isBlackTheme ? Colors.blackTheme :
                    Colors.background,
        }}>
            <View style={styles.secondaryContainer}>
                <Text
                    style={{
                        ...styles.topTitle, color:
                            props.isBlackTheme ? Colors.white :
                                Colors.black,
                    }}
                >Select Language</Text>
                <DropDownMenu
                    dropDownVisible={false}
                    hideDropDownMenu={props.hideDropDownMenu}
                    showDropDownMenu={props.hideShowLanguageModal}
                    languageList={props.languageList}
                    dropDownText={props.dropDownText}
                    updateDropDownText={props.updateDropDownText}
                    isBlackTheme={props.isBlackTheme}
                />
                <View
                    style={{ height: heightPercentageToDP(40) }}
                />
                <Button
                    backgroundColor={Colors.primaryButton}
                    buttonTitle='Continue'
                    onPress={props.onContinuePress}
                    titleTextColor={props.isBlackTheme ? Colors.black : Colors.white}

                />
                <View
                    style={{ height: heightPercentageToDP(10) }}
                />
            </View>
            <LanguageModal
                visible={props.languageModal}
                hideModal={props.hideShowLanguageModal}
                proceed={props.proceed}
                isBlackTheme={props.isBlackTheme}
            />
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        width: "100%"
    },
    secondaryContainer: {
        paddingHorizontal: widthPercentageToDP(6)
    },
    topTitle: {
        paddingHorizontal: widthPercentageToDP(5),
        fontSize: 18,
        fontWeight: "bold",
        paddingVertical: heightPercentageToDP(15)
    }
})
export default Language;

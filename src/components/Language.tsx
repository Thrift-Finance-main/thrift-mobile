import React, { FC } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '../constants/CustomColors'
import { heightPercentageToDP, widthPercentageToDP } from '../utils/dimensions'
import Button from './Common/Button'
import DropDownMenu from './Common/DropDownMenu'
import LanguageModal from './PopUps/LanguageModal'
import {withTranslation} from "react-i18next";
import {translate} from "../i18n";
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
    isBlackTheme: any,
    currentAccount: any,
}
const Language: FC<LanguageProps> = (props) => {
    console.log('props.currentAccount');
    console.log(props.currentAccount);
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
                >{translate('LanguageScreen.selectLanguage')}</Text>
                <Text
                    style={{
                        color:
                            props.isBlackTheme ? Colors.white :
                                Colors.black,
                    }}
                >{props.currentAccount}</Text>
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
                    backgroundColor="#603EDA"
                    buttonTitle={translate('Common.Continue')}
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
        fontFamily: 'AvenirNextCyr-Demi',
        paddingVertical: heightPercentageToDP(15)
    }
})
export default  withTranslation()(Language);

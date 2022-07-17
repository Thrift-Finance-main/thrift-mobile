import React, { FC } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '../constants/CustomColors'
import { heightPercentageToDP, widthPercentageToDP } from '../utils/dimensions'
import Button from './Common/Button'
import {translate} from "../i18n";
interface WelcomeProps {
    onContinuePress: () => void
    isBlackTheme: any
}
const Welcome: FC<WelcomeProps> = (props) => {
    return (
        <SafeAreaView style={{
            ...styles.mainContainer, backgroundColor:
                props.isBlackTheme ? Colors.blackTheme :
                    Colors.white,
        }}>
            <View style={styles.secondaryContainer}>
                <View style={{ paddingVertical: heightPercentageToDP(13) }}>
                    <Image
                        source={require("../assets/welcome.png")}
                        resizeMode='contain'
                        style={styles.imageStyle}
                    />
                    <Text
                        style={{ ...styles.topTitle, color: props.isBlackTheme ? Colors.white : Colors.black, marginTop: heightPercentageToDP(3) }}
                    >{translate("Welcome.Welcome")}</Text>
                    <Text
                        style={{
                            ...styles.normalText, color:
                                props.isBlackTheme ? Colors.white :
                                    Colors.black,
                        }}
                    >{translate("Welcome.Tip0")}</Text>
                    <View
                        style={{ height: heightPercentageToDP(7) }}
                    />
                    <Button
                        backgroundColor={Colors.primaryButton}
                        buttonTitle={translate("Common.Continue")}
                        onPress={props.onContinuePress}
                        titleTextColor={props.isBlackTheme ? Colors.black : Colors.white}
                    />
                </View>
            </View>
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
        fontFamily: 'AvenirNextCyr-Demi',
        textAlign: "center",
        letterSpacing: 1
    },
    normalText: {
        fontSize: 15,
        textAlign: "center",
        paddingHorizontal: widthPercentageToDP(10),
        marginTop: heightPercentageToDP(15),
        lineHeight: 20,
        fontFamily: 'AvenirNextCyr-Medium',
    }
})
export default Welcome;

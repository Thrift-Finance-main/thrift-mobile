import React, { FC } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '../constants/CustomColors'
import { heightPercentageToDP, widthPercentageToDP } from '../utils/dimensions'
import Button from './Common/Button'
import LanguageModal from './PopUps/LanguageModal'
interface AuthenticationProps {
    onCreateAccountPress: () => void,
    onRestoreAccountPress: () => void
    isBlackTheme: any
}
const Authentication: FC<AuthenticationProps> = (props) => {
    return (
        <SafeAreaView style={{
            ...styles.mainContainer, backgroundColor: props.isBlackTheme ? Colors.blackTheme : Colors.white,
        }}>
            <View style={styles.secondaryContainer}>
                <View
                    style={{ paddingVertical: heightPercentageToDP(18) }}
                >
                    <Image
                        source={require("../assets/security.gif")}
                        resizeMode='contain'
                        style={styles.imageStyle}
                    />
                    <View
                        style={styles.rowContainer}
                    >
                        <Text
                            style={{ ...styles.topTitle, color: Colors.authTitle }}
                        >Save and Secure</Text><Text
                            style={{
                                ...styles.topTitle, color:
                                    props.isBlackTheme ? Colors.primaryButton :
                                        Colors.primaryButtonColor2
                            }}
                        > Wallet</Text>
                    </View>

                </View>

                <Button
                    backgroundColor="#F338C2"
                    buttonTitle='Create Account'
                    onPress={props.onCreateAccountPress}
                    titleTextColor={props.isBlackTheme ? Colors.black : Colors.white}

                />
                <View
                    style={{ height: heightPercentageToDP(2) }}
                />
                <Button
                    backgroundColor={"#603EDA"}
                    buttonTitle='Restore Account'
                    onPress={props.onRestoreAccountPress}

                />

            </View>

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
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center"
    },
    imageStyle: {
        width: widthPercentageToDP(100),
        height: heightPercentageToDP(30),
        alignSelf: "center"
    },
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "center",
        marginTop: heightPercentageToDP(2)
    }
})
export default Authentication;

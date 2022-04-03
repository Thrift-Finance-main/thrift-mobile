import React, {FC, useMemo, useState} from 'react'
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '../../src/constants/CustomColors';
import { heightPercentageToDP, widthPercentageToDP } from '../utils/dimensions'
import Button from './Common/Button'
import Back from '../../src/assets/back.svg';
import DarkBack from '../../src/assets/DarkBack.svg';
import Key from "../assets/Key.svg";
import Bulb from "../assets/Bulb.svg";
import Caution from "../assets/Caution.svg";

interface CreateAccountProps {
    onBackIconPress: () => void
    onCreateAccountPress: () => void
    onRestoreAccountPress: () => void
    fromScreen: any
    isBlackTheme: boolean
}
const ManageAccount: FC<CreateAccountProps> = (props) => {
    const [name, setName] = useState('');
    const [passwd, setPasswd] = useState('');
    const [confirmPasswd, setConfirmPassd] = useState('');

    return (
        <SafeAreaView
            style={{
                ...styles.mainContainer,
                backgroundColor: props.isBlackTheme
                    ? Colors.blackTheme
                    : Colors.inputFieldBackground,
            }}>
            <ScrollView>
                <View style={styles.secondaryContainer}>
                    {props.isBlackTheme ? (
                        <DarkBack
                            style={{marginTop: heightPercentageToDP(3)}}
                            onPress={props.onBackIconPress}
                        />
                    ) : (
                        <Back
                            style={{marginTop: heightPercentageToDP(3)}}
                            onPress={props.onBackIconPress}
                        />
                    )}
                    <View
                        style={{
                            paddingVertical: heightPercentageToDP(12),
                            marginTop: heightPercentageToDP(2),
                        }}>
                        <Image
                            source={require('../assets/Warning.png')}
                            resizeMode="contain"
                            style={styles.imageStyle}
                        />
                    </View>
                    <View style={styles.termsContainer}>
                        <Key />
                        <Text style={styles.termsText}>
                            The recovery phrase serves as the {'\n'}only access to your
                            account.
                        </Text>
                    </View>
                    <View
                        style={{
                            ...styles.termsContainer,
                            marginTop: heightPercentageToDP(3.5),
                        }}>
                        <Bulb />
                        <Text style={styles.termsText}>
                            Thrift finance team will never ask you {'\n'}for your recovery
                            phrase.
                        </Text>
                    </View>
                    <View
                        style={{
                            ...styles.termsContainer,
                            marginTop: heightPercentageToDP(3.5),
                        }}>
                        <Caution />
                        <Text style={styles.termsText}>
                            If you lose your reovery phrase even {'\n'}Thrift finance can’t
                            get it back.
                        </Text>
                    </View>
                    <View style={{height: heightPercentageToDP(12)}} />
                    <Button
                        backgroundColor={Colors.primaryButton}
                        buttonTitle='Create Account'
                        onPress={props.onCreateAccountPress}
                        titleTextColor={props.isBlackTheme ? Colors.black : Colors.white}

                    />
                    <View
                        style={{ height: heightPercentageToDP(2) }}
                    />
                    <Button
                        backgroundColor={Colors.primaryButtonColor2}
                        buttonTitle='Restore Account'
                        onPress={props.onRestoreAccountPress}

                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        width: '100%',
    },
    secondaryContainer: {
        paddingHorizontal: widthPercentageToDP(6),
    },
    imageStyle: {
        width: widthPercentageToDP(100),
        height: heightPercentageToDP(10),
        alignSelf: 'center',
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: widthPercentageToDP(3),
    },
    termsText: {
        color: Colors.hintsColor,
        fontSize: 14,
        paddingHorizontal: widthPercentageToDP(8),
        lineHeight: 20,
    },
    buttonStyle: {
        width: widthPercentageToDP(80),
        height: heightPercentageToDP(8),
        borderRadius: 9,
        justifyContent: "center",
        alignSelf: "center",
        marginTop: 20
    },
    buttonTitleStyle: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 12
    }
});
export default ManageAccount;

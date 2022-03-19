import React, { FC } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '../constants/CustomColors'
import { heightPercentageToDP, widthPercentageToDP } from '../utils/dimensions'
import OK from '../assets/OK.svg'
import OKDark from '../assets/OKDark.svg'

import QrImage from '../assets/QRImage.svg'
interface ShowQRCodeProps {
    onBackIconPress: () => void
    isBlackTheme: any
}
const ShowQRCode: FC<ShowQRCodeProps> = (props) => {

    const onSuccess = e => {
        Linking.openURL(e.data).catch(err =>
            console.log('An error occured', err)
        );
    };
    return (
        <SafeAreaView style={{
            ...styles.mainContainer, backgroundColor:
                props.isBlackTheme ? Colors.blackTheme :
                    Colors.white,
        }}>
            <QrImage
                style={{ alignSelf: "center", marginTop: heightPercentageToDP(22) }}
            />
            {/* <QRCodeScanner
                cameraStyle={styles.camerStyle}
                onRead={onSuccess}
                flashMode={RNCamera.Constants.FlashMode.off}
                showMarker={true}
                topViewStyle={{ marginTop: -heightPercentageToDP(4) }}
                bottomViewStyle={{ marginTop: heightPercentageToDP(6) }}
                bottomContent={ */}
            <View
                style={styles.bottomContent}
            >
                <Text style={{
                    ...styles.buttonText, color:
                        props.isBlackTheme ? Colors.white :
                            Colors.black,
                }}>Scan QR code for your seed phrase</Text>
                <View
                    style={styles.topContainer}
                >
                    <Text
                        style={{
                            ...styles.filedHeader, color:
                                props.isBlackTheme ? Colors.white :
                                    Colors.black,
                        }}
                    >Don’t ever share your recovery phrase with{"\n"}any one or third party.</Text>
                </View>
                <TouchableOpacity
                    onPress={props.onBackIconPress}
                    style={{ alignSelf: "center", marginTop: heightPercentageToDP(5) }}
                >
                    {
                        props.isBlackTheme ? <OKDark /> : <OK />

                    }

                </TouchableOpacity>
                <View
                    style={{ height: heightPercentageToDP(5) }}
                />
            </View>
            {/* } */}
            {/* /> */}

        </SafeAreaView >
    )
}
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        width: "100%"
    },
    filedHeader: {
        fontSize: 12,
    },
    buttonText: {
        fontSize: 14,
        textAlign: "center"
    },
    topContainer: {
        backgroundColor: Colors.copyPhrase,
        paddingHorizontal: widthPercentageToDP(3),
        borderRadius: 6,
        alignSelf: "center",
        marginTop: heightPercentageToDP(3.5),
        paddingVertical: heightPercentageToDP(2)
    },
    camerStyle: {
        width: widthPercentageToDP(70),
        alignSelf: "center",
        height: heightPercentageToDP(25)
    },
    bottomContent: {
        paddingHorizontal: widthPercentageToDP(2),
        marginTop: heightPercentageToDP(10)
    }
})
export default ShowQRCode;

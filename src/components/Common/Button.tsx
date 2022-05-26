import React, { FC } from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import Colors from '../../constants/CustomColors'
import { heightPercentageToDP, widthPercentageToDP } from '../../utils/dimensions'
interface ButtonProps {
    backgroundColor: any,
    buttonTitle: string,
    titleTextColor?: any;
    onPress?: () => void,
    valid?: string
}
const Button: FC<ButtonProps> = (props) => {
    return (
        <TouchableOpacity
            style={{ ...styles.buttonStyle, backgroundColor: props.backgroundColor }}
            onPress={props.onPress}
            activeOpacity={0.8}>
            <Text
                style={{
                    ...styles.buttonTitleStyle, color: props.titleTextColor ? props.titleTextColor : Colors.white,
                }}
            >{props.buttonTitle}</Text>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    buttonStyle: {
        width: widthPercentageToDP(80),
        height: heightPercentageToDP(8),
        borderRadius: 9,
        justifyContent: "center",
        alignSelf: "center",
    },
    buttonTitleStyle: {
        textAlign: "center",
        fontFamily: 'AvenirNextCyr-Demi',
        fontSize: 14
    }
})

export default Button

import React, { FC } from 'react'
import { StyleSheet, TextInput } from 'react-native'
import Colors from '../../constants/CustomColors'
import { heightPercentageToDP, widthPercentageToDP } from '../../utils/dimensions'
interface InputFieldProps {
    // onChange: () => void,
    secureText: boolean,
    placeHolder: string
    backgroundColor: any
    // value: string
    placeholderTextColor: any
}
const InputField: FC<InputFieldProps> = (props) => {
    return (
        <TextInput
            secureTextEntry={props.secureText}
            style={{
                ...styles.mainCOntainer, backgroundColor:
                    props.backgroundColor ? props.backgroundColor :
                        Colors.inputFieldBackground,
                color: props.placeholderTextColor
            }}
            placeholder={props.placeHolder}
            placeholderTextColor={props.placeholderTextColor}
        />

    )
}
const styles = StyleSheet.create({
    mainCOntainer: {
        borderRadius: 5,
        height: heightPercentageToDP(7.5),
        borderWidth: 1,
        borderColor: Colors.inputFieldBorder,
        paddingHorizontal: widthPercentageToDP(3),
        width: widthPercentageToDP(86),
        alignSelf: "center"
    },

})

export default InputField
import React, {FC, useState} from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Colors from '../../constants/CustomColors';
import { heightPercentageToDP, widthPercentageToDP } from '../../utils/dimensions';
import Button from '../Common/Button';
import Modal from 'react-native-modal'
import {TextField} from "react-native-ui-lib";
import InputField from "../Common/InputField";
import removeIcon from "../../assets/remove.png";
interface CustomModalProps {
  visible: boolean,
  hideModal: () => void,
  handleInputText: (text:string) => void,
  modalText: string,
  security: string,
  placeholder: string,
  error?: string,
  inputText: boolean,
  isBlackTheme: boolean
}
const CustomModal: FC<CustomModalProps> = (props) => {

  const [inputText, setInputText] = useState('');
  const getGraphic = () => {
    switch (props.security) {
      case 'fingerprint':
        return require("../../assets/fingerPrint.gif");
      case 'success':
        return require("../../assets/success.gif");
      default:
        return require("../../assets/success.gif");
    }
  }
  //const hiddenText = inputText.replace(/./g, '*');

  return (
    <Modal
      style={styles.mainContainer}
      onRequestClose={props.hideModal}
      visible={props.visible}
      transparent={true}
      onBackButtonPress={props.hideModal}
      animationType="fadeIn"
    >

      <View style={styles.mainContainerBox}>

        <View style={{
          ...styles.bottomContainer, backgroundColor:
            props.isBlackTheme ? Colors.blackTheme :
              Colors.white,
        }}>
          <Image
            source={getGraphic()}
            resizeMode='contain'
            style={styles.imageStyle}
          />
          <Text style={{
            ...styles.InfoText, color:
              props.isBlackTheme ? Colors.white :
                Colors.black,
          }}>{props.modalText}</Text>
          <View
            style={{ height: heightPercentageToDP(3) }}
          />
          {
            props.inputText ?
                <View >
                  <TextField
                      containerStyle={{width: 330, marginHorizontal: 12,  fontFamily: 'AvenirNextCyr-Medium'}}
                      floatingPlaceholder
                      placeholder={props.placeholder}
                      onChangeText={(value:string) => props.handleInputText(value)}
                      useBottomErrors
                      validate={['required']}
                      errorMessage={"Invalid amount"}
                      type="password"
                  />
                </View>
            : null
          }
          <View
              style={{ height: heightPercentageToDP(3) }}
          />
          <Button
            backgroundColor={Colors.primaryButton}
            buttonTitle='OK'
            onPress={props.hideModal}
            titleTextColor={props.isBlackTheme ? Colors.black : Colors.white}
          />
          <Text style={{
            ...styles.InfoText, color:
                props.isBlackTheme ? Colors.white :
                    Colors.black,
          }}>{props.error && props.error.length ? props.error : ''}</Text>
          <View
              style={{ height: heightPercentageToDP(3) }}
          />
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  imageStyle: {
    width: widthPercentageToDP(100),
    height: heightPercentageToDP(25),
    alignSelf: "center",
  },
  mainContainer:
  {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    margin: -1,
    justifyContent: 'center',
  },
  mainContainerBox: {
    alignSelf: 'center',
    width: '90%',
  },
  InfoText: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: widthPercentageToDP(10)
  },
  bottomContainer: {
    borderRadius: 12,
    paddingVertical: heightPercentageToDP(5),
    minHeight: heightPercentageToDP(25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputText :{
    paddingHorizontal: 12
  }


});

export default CustomModal;

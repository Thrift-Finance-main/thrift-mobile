import React, {FC, useState} from 'react';
import {View, Text, StyleSheet, Image, TextInput} from 'react-native';
import Colors from '../../constants/CustomColors';
import { heightPercentageToDP, widthPercentageToDP } from '../../utils/dimensions';
import Modal from 'react-native-modal'
import {Button, TextField} from "react-native-ui-lib";
import BigNumber from "bignumber.js";
interface CustomModalProps {
  visible: boolean,
  hideModal: () => void,
  justHideModal: () => void,
  handleInputText: (text:string) => void,
  modalText: string,
  security: string,
  placeholder: string,
  error?: string,
  inputText: boolean,
  buttonDisabled?: boolean,
  typePassword: boolean,
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
      case 'password':
        return require("../../assets/passlock.png");
      case 'remove':
        return require("../../assets/removeUser.png");
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
                  <TextInput
                      style={{width: 330, marginHorizontal: 12, paddingHorizontal: 64,  fontFamily: 'AvenirNextCyr-Medium'}}
                      placeholder={props.placeholder}
                      onChangeText={(value:string) => props.handleInputText(value)}
                      secureTextEntry={props.typePassword}

                  />
                </View>
            : null
          }

          <Button
              backgroundColor={"#F338C2"}
              disabled={props.buttonDisabled}
              onPress={props.hideModal}
              style={{width: 200, marginTop:20}}
          >
            <Text style={{color: props.isBlackTheme ? Colors.black : Colors.white, padding:4, fontSize: 16,  fontFamily: 'AvenirNextCyr-Medium'}}>
              Confirm
            </Text>
          </Button>
          <Button
              backgroundColor={"#603EDA"}
              onPress={props.justHideModal}
              style={{width: 200, marginTop:20}}
          >
            <Text style={{color: props.isBlackTheme ? Colors.black : Colors.white, padding:4, fontSize: 16,  fontFamily: 'AvenirNextCyr-Medium'}}>
              Cancel
            </Text>
          </Button>
          <Text style={{
            ...styles.InfoText, color:
                props.isBlackTheme ? Colors.white :
                    Colors.black,
          }}>{props.error && props.error.length ? props.error : ''}</Text>

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
    marginLeft: 18
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

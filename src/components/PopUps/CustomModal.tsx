import React, { FC } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Colors from '../../constants/CustomColors';
import { heightPercentageToDP, widthPercentageToDP } from '../../utils/dimensions';
import Button from '../Common/Button';
import Modal from 'react-native-modal'
interface CustomModalProps {
  visible: boolean,
  hideModal: () => void,
  modalText: string
  security: boolean
  isBlackTheme: boolean
}
const CustomModal: FC<CustomModalProps> = (props) => {
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
            source={
              props.security ? require("../../assets/fingerPrint.gif") :
                require("../../assets/success.gif")}
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
          <Button
            backgroundColor={Colors.primaryButton}
            buttonTitle='OK'
            onPress={props.hideModal}
            titleTextColor={props.isBlackTheme ? Colors.black : Colors.white}
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



});

export default CustomModal;

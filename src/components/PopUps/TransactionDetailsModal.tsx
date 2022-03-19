import React, { FC } from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import Colors from '../../constants/CustomColors';
import { heightPercentageToDP, widthPercentageToDP } from '../../utils/dimensions';
import Button from '../Common/Button';
import Modal from 'react-native-modal'
interface TransactionDetailsModalProps {
  visible: boolean,
  hideModal: () => void,
  modalText: string
  isBlackTheme: any
}
const TransactionDetailsModal: FC<TransactionDetailsModalProps> = (props) => {

  return (
    <Modal
      style={styles.mainContainer}
      onRequestClose={props.hideModal}
      visible={props.visible}
      transparent={true}
      onBackButtonPress={props.hideModal}
      onBackdropPress={props.hideModal}
      animationType="fadeIn"
    >

      <View style={styles.mainContainerBox}>
        <View style={{
          ...styles.bottomContainer, backgroundColor:
            props.isBlackTheme ? Colors.blackTheme :
              Colors.white,
        }}>
          <Text
            style={{
              ...styles.topTitle, color:
                props.isBlackTheme ? Colors.white :
                  Colors.black,
            }}
          >Transaction Details</Text>

          <View
            style={{ paddingHorizontal: widthPercentageToDP(10), width: "100%", paddingVertical: heightPercentageToDP(1) }}
          >
            <Text
              style={{ color: Colors.authTitle }}

            >Amount</Text>
            <Text
              style={{ marginTop: heightPercentageToDP(0.5), color: props.isBlackTheme ? Colors.white : Colors.black }}
            >-1.50000 Ada</Text>
          </View>
          <View
            style={{ paddingHorizontal: widthPercentageToDP(10), width: "100%", paddingVertical: heightPercentageToDP(1) }}
          >
            <Text
              style={{ color: Colors.authTitle }}

            >From</Text>
            <Text
              style={{ marginTop: heightPercentageToDP(0.5), color: props.isBlackTheme ? Colors.white : Colors.black }}

            >addrlq95e.....addrlq95eaddrlq95eaddrlq95e</Text>
          </View>
          <View
            style={{ paddingHorizontal: widthPercentageToDP(10), width: "100%", paddingVertical: heightPercentageToDP(1) }}
          >
            <Text
              style={{ color: Colors.authTitle }}

            >To</Text>
            <Text
              style={{ marginTop: heightPercentageToDP(0.5), color: props.isBlackTheme ? Colors.white : Colors.black }}

            >addrlq95e.....addrlq95eaddrlq95eaddrlq95e</Text>
          </View>
          <View
            style={{ paddingHorizontal: widthPercentageToDP(10), width: "100%", paddingVertical: heightPercentageToDP(1) }}
          >
            <Text
              style={{ color: Colors.authTitle }}

            >Date</Text>
            <Text
              style={{ marginTop: heightPercentageToDP(0.5), color: props.isBlackTheme ? Colors.white : Colors.black }}

            >23-11-2021</Text>
          </View>
          <View
            style={{ paddingHorizontal: widthPercentageToDP(10), width: "100%", paddingVertical: heightPercentageToDP(1) }}
          >
            <Text
              style={{ color: Colors.authTitle }}

            >Transaction Hash</Text>
            <Text
              style={{ marginTop: heightPercentageToDP(0.5), color: props.isBlackTheme ? Colors.white : Colors.black }}

            >addrlq95e.....addrlq95eaddrlq95eaddrlq95eeaddrlq95eeaddrlq95e</Text>
          </View>
          <View
            style={{ height: heightPercentageToDP(3) }}
          />

        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  mainContainer:
  {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    margin: -1,
    justifyContent: 'flex-end',
  },
  mainContainerBox: {
    alignSelf: 'center',
    width: '100%',
  },

  bottomContainer: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,

    paddingVertical: heightPercentageToDP(4),
    minHeight: heightPercentageToDP(25),
    justifyContent: 'center',
    alignItems: 'center',
  },

  topTitle: {
    fontSize: 18,
    fontWeight: "bold",
    width: "100%",
    marginBottom: heightPercentageToDP(2.5),
    textAlign: "center"

  }

});

export default TransactionDetailsModal;

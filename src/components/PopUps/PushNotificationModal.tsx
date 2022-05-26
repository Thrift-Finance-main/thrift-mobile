import React, { FC, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import Colors from '../../constants/CustomColors';
import { heightPercentageToDP, widthPercentageToDP } from '../../utils/dimensions';
import Modal from 'react-native-modal'
import Icon from 'react-native-vector-icons/MaterialIcons'
import ToggleSwitch from 'toggle-switch-react-native'

interface LanguageModalProps {
  visible: boolean,
  hideModal: () => void,
  modalText: string
  isBlackTheme: any
}
const PushNotificationModal: FC<LanguageModalProps> = (props) => {
  const [toggle, setToggle] = useState(false)
  const [toggle1, setToggle1] = useState(false)


  const onToggle = val => {
    setToggle(val)
    // if (val) {
    //     props.onFingerPrintPress()
    // }
  }
  const onToggle1 = val => {
    setToggle1(val)
    // if (val) {
    //     props.onFingerPrintPress()
    // }
  }
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
          <View
            style={{
              ...styles.row, marginTop: -heightPercentageToDP(5),
              marginBottom: heightPercentageToDP(3)
            }}    >
            <Text
              style={{
                ...styles.topTitle, color:
                  props.isBlackTheme ? Colors.white :
                    Colors.black,
              }}
            >Push Notifications</Text>
            <TouchableOpacity
              style={{
                position: 'absolute',
                bottom: heightPercentageToDP(1), left: widthPercentageToDP(74),
                height : 30,
                width : 30,
                borderRadius: 30/2,
                backgroundColor : Colors.white,
                justifyContent : 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 1,
                elevation: 1,
              }}
              onPress={props.hideModal}
            >
              <Icon name={'close'} size={15} color={Colors.dropDownTextColor} />
            </TouchableOpacity>
          </View>
          <View
            style={styles.row}
          >

            <Text
              style={{ color: props.isBlackTheme ? Colors.white : Colors.authTitle, fontFamily: 'AvenirNextCyr-Medium', }}
            >Allow Push Nofications</Text>
            <ToggleSwitch
              isOn={toggle}
              onColor={props.isBlackTheme ? Colors.white : Colors.black}
              offColor="grey"
              size="small"
              thumbOnStyle={{ backgroundColor: props.isBlackTheme ? Colors.black : Colors.white }}
              onToggle={isOn => onToggle(isOn)}
            />
          </View>
          <View
            style={{ ...styles.row, marginTop: heightPercentageToDP(4) }}
          >

            <Text
              style={{ color: props.isBlackTheme ? Colors.white : Colors.authTitle, fontFamily: 'AvenirNextCyr-Medium' }}
            >Send and Recieve</Text>
            <ToggleSwitch
              isOn={toggle1}
              onColor={props.isBlackTheme ? Colors.white : Colors.black}
              offColor="grey"
              size="small"
              thumbOnStyle={{ backgroundColor: props.isBlackTheme ? Colors.black : Colors.white }}
              onToggle={isOn => onToggle1(isOn)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  mainContainer:
  {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    margin: -1,
    justifyContent: 'center',

  },
  mainContainerBox: {
    alignSelf: 'center',
    width: '85%',
  },

  bottomContainer: {
    // borderTopRightRadius: 20,
    // borderTopLeftRadius: 20,
    borderRadius: 10,

    // paddingVertical: heightPercentageToDP(4),
    minHeight: heightPercentageToDP(27),
    justifyContent: 'center',
    alignItems: 'center',

  },

  topTitle: {
    // paddingHorizontal: widthPercentageToDP(12),
    fontSize: 18,
      fontFamily: 'AvenirNextCyr-Demi',
    // width: "100%",

  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: widthPercentageToDP(10)
  }

});

export default PushNotificationModal;

import React, { FC } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import Colors from '../../constants/CustomColors';
import { heightPercentageToDP, widthPercentageToDP } from '../../utils/dimensions';
import Button from '../Common/Button';
import Modal from 'react-native-modal'
interface LanguageModalProps {
  visible: boolean,
  hideModal: () => void,
  modalText: string
  proceed: (ARG1: any) => void,
  isBlackTheme: any
  Data: any

}
const PickerModal: FC<LanguageModalProps> = (props) => {
  const _renderItemLanguage = ({ item, index }) => {
    return (
      <>
        <TouchableOpacity
          onPress={() => props.proceed(item.title)}
          style={{
            // backgroundColor:
            //   props.isBlackTheme ? Colors.darkInput :
            //     Colors.inputFieldBackground,
            // // borderRadius: 5,
            height: heightPercentageToDP(8.5),
            // borderColor: Colors.inputFieldBorder,
            // paddingHorizontal: widthPercentageToDP(5),
            // justifyContent: "center",
            // marginTop: heightPercentageToDP(3.5),
            justifyContent: "center", alignItems: "center"

          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between", }}
          >

            <Text
              style={{ color: props.isBlackTheme ? Colors.white : Colors.black, width: "50%" }}
            >{item.title}</Text>
            <Text
              style={{ color: props.isBlackTheme ? Colors.white : "green", width: "30%" }}
            >{item.subTitle}</Text>

          </View>

        </TouchableOpacity >
        {props.Data.length - 1 == index ?
          null
          : <View
            style={{ width: widthPercentageToDP(100), height: heightPercentageToDP(.15), backgroundColor: Colors.dropDownBorderColor }}
          />}

      </>
    )
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
          {/* <Text
            style={{
              ...styles.topTitle, color:
                props.isBlackTheme ? Colors.white :
                  Colors.black,
            }}
          >Select Language</Text> */}
          <FlatList

            data={props.Data}

            keyExtractor={(item, index) => index.toString()}
            renderItem={_renderItemLanguage}
          />
          {/* <View
            style={{ height: heightPercentageToDP(3) }}
          /> */}

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

    // paddingVertical: heightPercentageToDP(4),
    minHeight: heightPercentageToDP(25),
    justifyContent: 'center',
    alignItems: 'center',
  },

  topTitle: {
    paddingHorizontal: widthPercentageToDP(12),
    fontSize: 18,
    fontWeight: "bold",
    width: "100%",
    marginBottom: heightPercentageToDP(1.5)

  }

});

export default PickerModal;

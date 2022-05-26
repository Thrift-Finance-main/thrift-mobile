import React, { FC, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import Colors from '../../constants/CustomColors';
import { heightPercentageToDP, widthPercentageToDP } from '../../utils/dimensions';
import Button from '../Common/Button';
import Modal from 'react-native-modal'
import DropDownMenu from '../Common/DropDownMenu';
import Close from '../../assets/Close.svg'
import Icon from 'react-native-vector-icons/MaterialIcons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'

interface LanguageModalProps {
  visible: boolean,
  hideModal: () => void,
  modalText: string
  proceed: (ARG1: any) => void,
  isBlackTheme: any

}
const CurrencyConvertorModal: FC<LanguageModalProps> = (props) => {

  const [dropDownText, setDropDownText] = useState("USD")
  const [showList, setShowList] = useState(true)


  const updateDropDownText = (title: any) => {
    setShowList(!showList)
    setDropDownText(title);
  }
  const _renderItemLanguage = ({ item, index }) => {
    return (

      <TouchableOpacity
        onPress={() => updateDropDownText(item.title)}
        style={{
          backgroundColor:
            props.isBlackTheme ? Colors.darkInput :
              Colors.inputFieldBackground,
          borderRadius: 6,
          height: heightPercentageToDP(8),
          borderColor: Colors.inputFieldBorder,
          paddingHorizontal: widthPercentageToDP(5),
          width: widthPercentageToDP(65),
          alignSelf: "center",
          justifyContent: "center",
          marginTop: index == 0 ? 0 : heightPercentageToDP(3),


        }}
      >
        <Text
          style={{ color: props.isBlackTheme ? Colors.white : Colors.black, fontFamily: 'AvenirNextCyr-Medium' }}
        >{item.title}</Text>
      </TouchableOpacity >

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
          <View
            style={{ width: "85%" }}
          >
            <TouchableOpacity
              style={{
                // position: 'absolute',
                marginBottom : heightPercentageToDP(3),
                alignSelf : 'flex-end',
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
              <TouchableOpacity onPress={() => setShowList(!showList)} style={{borderWidth: 1, borderColor: Colors.inputFieldBorder, borderRadius: 8, paddingVertical : heightPercentageToDP(2), paddingHorizontal : widthPercentageToDP(5), flexDirection : 'row', justifyContent : 'space-between', alignItems : 'center'}} >
                <Text style={{
                            color: props.isBlackTheme ? Colors.white : Colors.dropDownTextColor, fontFamily: 'AvenirNextCyr-Demi',
                        }} >{dropDownText}</Text>
{
                        showList ?
                            <FontAwesomeIcon
                                name="angle-up"
                                size={20}
                            /> : <FontAwesomeIcon
                                name="angle-down"
                                size={20}
                                color={Colors.dropDownTextColor}
                            />
                    }
              </TouchableOpacity>
          </View>
          {showList ? <FlatList

            data={[{
              title: "USD"
            },
            {
              title: "EUR"
            },
            {
              title: "NGN"
            },
            {
              title: "BTC"
            },
            {
              title: "ADA"
            },



            ]}
            style={{
              borderWidth: 1, borderColor: Colors.inputFieldBorder, borderRadius: 8, width: "85%",
              maxHeight: heightPercentageToDP(70),
              paddingVertical: heightPercentageToDP(2.8),
              marginTop: heightPercentageToDP(2)
            }}
            keyExtractor={(item, index) => index.toString()}
            renderItem={_renderItemLanguage}
            showsVerticalScrollIndicator={false}
          /> : null}

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
    backgroundColor: 'rgba(0,0,0,0.8)',
    margin: -1,
    justifyContent: 'center',
  },
  mainContainerBox: {
    alignSelf: 'center',
    width: '85%',
  },

  bottomContainer: {

    borderRadius: 12,
    paddingVertical: heightPercentageToDP(2),
    minHeight: heightPercentageToDP(25),
    justifyContent: 'center',
    alignItems: 'center',
  },

  topTitle: {
    paddingHorizontal: widthPercentageToDP(12),
    fontSize: 18,
      fontFamily: 'AvenirNextCyr-Demi',
    width: "100%",
    marginBottom: heightPercentageToDP(1.5)

  }

});

export default CurrencyConvertorModal;

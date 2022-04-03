import React, { FC } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Linking, TouchableOpacity } from 'react-native';
import Colors from '../../constants/CustomColors';
import { heightPercentageToDP, widthPercentageToDP } from '../../utils/dimensions';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera'; import Modal from 'react-native-modal'
import ThriftLogo from '../../assets/ThriftLogo.svg'
import ThriftLogoWhite from '../../assets/ThriftFinancelogo.svg'
import QRImage from '../../assets/QRImage.svg';
import Icon from 'react-native-vector-icons/MaterialIcons'
import {useSelector} from "react-redux";
import {addressSlice} from "../../utils";
import Clipboard from '@react-native-community/clipboard';
import Scan from "../QrCodeCamera";

interface ReceiveTokenModalProps {
  visible: boolean,
  hideModal: () => void,
  onReadQr: (data:string) => void,
  modalText: string,
  isBlackTheme: any,
  QRScanner : boolean
}
const ReceiveTokenModal: FC<ReceiveTokenModalProps> = (props) => {
  const currentAccount = useSelector((state) => state.Reducers.currentAccount);

  const firstAddress = currentAccount
      && currentAccount.externalPubAddress
      && currentAccount.externalPubAddress.length
      && currentAccount.externalPubAddress[0].address || 'addr_empty';
  const onSuccess = e => {
    const addr = e.data;
    props.onReadQr(addr);
  };
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
          <View style={props.QRScanner && {marginTop : heightPercentageToDP(3)}} >
          {
                            props.isBlackTheme ?
                            <ThriftLogoWhite
                                style={{
                                    width: widthPercentageToDP(7), height: heightPercentageToDP(8),
                                    marginTop: heightPercentageToDP(2)
                                }}
                            />
                            :
                            <ThriftLogo
                                style={{
                                    width: widthPercentageToDP(8), height: heightPercentageToDP(8),
                                    marginTop: heightPercentageToDP(2)
                                }}
                            />
                        }
                        </View>
                      {!props.QRScanner ?
                      <View style={{marginTop : heightPercentageToDP(3)}} >
                      <QRImage/>
                      </View>
                      :
                      <View style={{}} >
                        <Scan/>
                        {/*}
          <QRCodeScanner
            cameraStyle={[styles.camerStyle]}
            onRead={onSuccess}
            flashMode={RNCamera.Constants.FlashMode.off}
            showMarker={true}
            // topViewStyle={{ marginTop: -heightPercentageToDP(2) }}
            // bottomViewStyle={{ marginTop: heightPercentageToDP(6) }}
            bottomContent={
              <View
                style={[styles.bottomContent]}
              >
                <Text style={{
                  ...styles.buttonText, color: props.isBlackTheme ? Colors.white : Colors.black,
                }}>Scan QR code to make transactions</Text>



                <Text
                  style={{
                    marginTop: heightPercentageToDP(1.5), textAlign: "center", paddingHorizontal: widthPercentageToDP(10),
                    color: props.isBlackTheme ? Colors.white : Colors.black,
                  }}

                >
                  addrlq95e.....addrlq95eaddrlq95eaddrlq95eeaddrlq95eeaddrlq95e
                </Text>
                <TouchableOpacity
                  //  onPress={props.onBackIconPress}
                  style={{
                    alignSelf: "center", marginTop: heightPercentageToDP(1),
                    height: heightPercentageToDP(4.5),
                    width: widthPercentageToDP(15),
                    borderRadius: 5,
                    backgroundColor: "blue",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{ textAlign: "center", color: Colors.white }}
                  >Copy</Text>

                </TouchableOpacity>
              </View>
            }
          />
                        */}
          </View>
                      }
                      {
                        !props.QRScanner &&
<View
                style={styles.bottomContent}
              ><Text
                  style={{
                    marginTop: heightPercentageToDP(1.5), textAlign: "center", paddingHorizontal: widthPercentageToDP(10),
                    color: props.isBlackTheme ? Colors.white : Colors.black,
                  }}

                >{addressSlice(firstAddress, 18) || ''}</Text>
                <View style={{backgroundColor : Colors.white, elevation : 5, shadowColor : Colors.black, shadowOpacity : .1, shadowRadius : 5, shadowOffset : {height : .5, width : .5}, paddingVertical : heightPercentageToDP(2), flexDirection: 'row', marginHorizontal : widthPercentageToDP(5), paddingHorizontal : widthPercentageToDP(5), justifyContent: 'space-between', borderRadius : 5, marginVertical : heightPercentageToDP(3)}} >
                <TouchableOpacity
                  //  onPress={props.onBackIconPress}
                  style={{
                    alignSelf: "center",
                    paddingVertical : heightPercentageToDP(1),
                    paddingHorizontal : widthPercentageToDP(2),
                    borderRadius: 5,
                    backgroundColor: Colors.color2,
                    justifyContent: "center",
                    flexDirection : 'row',
                    alignItems: 'center'
                  }}
                >
                  <Text
                    style={{ textAlign: "center", color: Colors.white }}
                  >House rent</Text>
                  <Icon name={'close'} size={15} color={Colors.white} style={{marginLeft: widthPercentageToDP(3)}} />
                </TouchableOpacity>
                <TouchableOpacity
                  //  onPress={props.onBackIconPress}
                  style={{
                    alignSelf: "center",
                    paddingVertical : heightPercentageToDP(1),
                    paddingHorizontal : widthPercentageToDP(2),
                    borderRadius: 5,
                    backgroundColor: Colors.color2,
                    justifyContent: "center",
                    flexDirection : 'row',
                    alignItems: 'center'
                  }}
                >
                  <Text
                    style={{ textAlign: "center", color: Colors.white }}
                  >Tution</Text>
                  <Icon name={'close'} size={15} color={Colors.white} style={{marginLeft: widthPercentageToDP(3)}} />
                </TouchableOpacity>
                <TouchableOpacity
                  //  onPress={props.onBackIconPress}
                  style={{
                    alignSelf: "center",
                    paddingVertical : heightPercentageToDP(1),
                    paddingHorizontal : widthPercentageToDP(2),
                    borderRadius: 5,
                    backgroundColor: Colors.color2,
                    justifyContent: "center",
                    flexDirection : 'row',
                    alignItems: 'center'
                  }}
                >
                  <Text
                    style={{ textAlign: "center", color: Colors.white }}
                  >Tag</Text>
                  <Icon name={'close'} size={15} color={Colors.white} style={{marginLeft: widthPercentageToDP(3)}} />
                </TouchableOpacity>
                </View>
                <View style={{flexDirection : 'row', paddingHorizontal : widthPercentageToDP(20), justifyContent : 'center'}} >
                <TouchableOpacity
                  //  onPress={props.onBackIconPress}
                  style={{
                    alignSelf: "center", marginTop: heightPercentageToDP(1),
                    height: heightPercentageToDP(4.5),
                    width: widthPercentageToDP(15),
                    borderRadius: 5,
                    backgroundColor: Colors.color2,
                    justifyContent: "center",
                    marginBottom: heightPercentageToDP(2)
                  }}
                >
                  <Text
                      onPress={() => Clipboard.setString(firstAddress)}
                    style={{ textAlign: "center", color: Colors.white }}
                  >Copy</Text>

                </TouchableOpacity>
                <View style={{width : widthPercentageToDP(10)}} />
                <TouchableOpacity
                  //  onPress={props.onBackIconPress}
                  style={{
                    alignSelf: "center", marginTop: heightPercentageToDP(1),
                    height: heightPercentageToDP(4.5),
                    width: widthPercentageToDP(15),
                    borderRadius: 5,
                    backgroundColor: Colors.color7,
                    justifyContent: "center",
                    marginBottom: heightPercentageToDP(2),
                    borderColor: Colors.color5,
                    borderWidth: 1
                  }}
                >
                  <Text
                    style={{ textAlign: "center", color: Colors.color5 }}
                  >Share</Text>

                </TouchableOpacity>
                </View>
                <View
                  style={{ height: heightPercentageToDP(2) }}
                />
              </View>
                      }


























          {/* <Text
            style={{ marginTop: heightPercentageToDP(0.5) }}

          >addrlq95e.....addrlq95eaddrlq95eaddrlq95eeaddrlq95eeaddrlq95e</Text> */}
        </View>


      </View>

    </Modal>
  );
};
const styles = StyleSheet.create({
  mainContainer:
  {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    margin: -1,
    justifyContent: 'flex-end',
  },
  mainContainerBox: {
    alignSelf: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },

  bottomContainer: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingVertical: heightPercentageToDP(3),
    maxHeight: heightPercentageToDP(80),
    justifyContent: 'center',
    alignItems: 'center',
  },

  topTitle: {
    fontSize: 18,
    fontWeight: "bold",
    width: "100%",
    textAlign: "center"
  },
  filedHeader: {
    fontSize: 12,
    color: Colors.black,
  },
  buttonText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: -heightPercentageToDP(1)
  },
  camerStyle: {
    flex : 1
  },
  bottomContent: {
    paddingHorizontal: widthPercentageToDP(2),
    marginTop: heightPercentageToDP(3)
  }

});

export default ReceiveTokenModal;

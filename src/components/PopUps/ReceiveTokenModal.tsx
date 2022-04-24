import React, {FC, useState} from 'react';
import {View, Text, StyleSheet, Image, FlatList, Linking, TouchableOpacity, Alert, ScrollView} from 'react-native';
import Colors from '../../constants/CustomColors';
import { heightPercentageToDP, widthPercentageToDP } from '../../utils/dimensions';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera'; import Modal from 'react-native-modal'
import ThriftLogo from '../../assets/ThriftLogo.svg'
import ThriftLogoWhite from '../../assets/ThriftFinancelogo.svg'
import QRImage from '../../assets/QRImage.svg';
import Icon from 'react-native-vector-icons/MaterialIcons'
import {useDispatch, useSelector} from "react-redux";
import {addressSlice} from "../../utils";
import Clipboard from '@react-native-community/clipboard';
import Scan from "../QrCodeCamera";
import CameraQr from "../CameraQr";
import {Dialog, DialogProps, PanningProvider, Picker, PickerProps} from "react-native-ui-lib";
import WalletIcon from "../../assets/wallet.svg";
import {apiDb} from "../../db/LiteDb";
import {setCurrentAccount} from "../../store/Action";

interface ReceiveTokenModalProps {
  visible: boolean,
  hideModal: () => void,
  onReadQr: (data:string) => void,
  modalText: string,
  isBlackTheme: any,
  QRScanner : boolean
}
const ReceiveTokenModal: FC<ReceiveTokenModalProps> = (props) => {
  const dispatch = useDispatch();
  const currentAccount = useSelector((state) => state.Reducers.currentAccount);
  const [scanText, setScanText] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(undefined);

  const firstAddress = currentAccount.selectedAddress;

  const updateSelectedAddress = async addr => {
    if (addr && addr.address) {
      console.log('addr');
      console.log(addr);
      await apiDb.setAccountSelectedAddress(currentAccount.accountName, addr.address);
      const acc = await apiDb.getAccount(currentAccount.accountName);
      dispatch(setCurrentAccount(acc));
    }
  };
  const dialogHeader: DialogProps['renderPannableHeader'] = props => {
    const {title} = props;
    return (
        <Text margin-15>
          {title}
        </Text>
    );
  };

  const renderDialog: PickerProps['renderCustomModal'] = modalProps => {
    const {visible, children, toggleModal, onDone} = modalProps;

    return (
        <Dialog
            visible={visible}
            onDismiss={() => {
              onDone();
              toggleModal(false);
            }}
            width="100%"
            height="45%"
            bottom
            useSafeArea
            containerStyle={{backgroundColor: props.isBlackTheme ? Colors.black : Colors.white }}
            renderPannableHeader={dialogHeader}
            panDirection={PanningProvider.Directions.DOWN}
            pannableHeaderProps={{}}
        >
          <ScrollView>
            <Text style={{...styles.addressList, ...styles.addressListTitle}}>
              Select Address
            </Text>
            <View
                style={{
                  borderBottomColor: 'grey',
                  borderBottomWidth: 1,
                }}
            />
            {children}
          </ScrollView>
        </Dialog>
    );
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

                      <QRCodeScanner
                        cameraStyle={[styles.camerStyle]}
                        onRead={(text) => {setScanText(text)}}
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
                                marginTop: heightPercentageToDP(1.1), textAlign: "center", paddingHorizontal: widthPercentageToDP(10),
                                color: props.isBlackTheme ? Colors.white : Colors.black,
                              }}

                            >
                              result: {scanText}
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
                                onPress={() => Clipboard.setString('mail@mail.com')}
                                style={{ textAlign: "center", color: Colors.white }}
                              >Copy</Text>

                            </TouchableOpacity>
                          </View>
                        }
                      />

          </View>
                      }
                      {
                        !props.QRScanner &&
            <View
                style={styles.bottomContent}
              >
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
                    onPress={() => Clipboard.setString(firstAddress)}
                >
                  <Text

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

              <View style={{flexDirection : 'row', paddingHorizontal : widthPercentageToDP(20), justifyContent : 'center'}} >

              </View>
              <Picker
                    placeholder={addressSlice(firstAddress, 18) || ''}
                    onChange={item => {
                      updateSelectedAddress(item)
                    }}
                    mode={Picker.modes.SINGLE}
                    rightIconSource={WalletIcon}
                    renderCustomModal={renderDialog}
                    style={{color: 'black', fontSize: 14, textAlign: 'center'}}
                >
                  {currentAccount.externalPubAddress.map((addr,index) => (
                      <Picker.Item
                          key={addr+index}
                          value={addr}
                          label={''}
                          labelStyle={styles.addressList}
                          renderItem={(a, props) => {
                            const address = a.address;
                            return (
                                <View
                                    style={{
                                      flex: 1,
                                      height: 46
                                    }}
                                >
                                  <View>
                                    <Text style={
                                      styles.addressList
                                    }>
                                      {index}.{' '}{addressSlice(address, 20)}
                                    </Text>
                                  </View>
                                </View>
                            );
                          }}
                      />
                  ))}
                </Picker>
              <Text>Hello</Text>

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
  },
  addressList: {
    textAlign: 'center',
    marginTop: heightPercentageToDP(1.5)
  },
  addressListTitle: {
    fontWeight: 'bold',
    marginBottom: heightPercentageToDP(1.5)
  }

});

export default ReceiveTokenModal;

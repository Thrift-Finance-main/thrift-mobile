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
import {ChipsInput, Dialog, DialogProps, PanningProvider, Picker, PickerProps, Typography} from "react-native-ui-lib";
import WalletIcon from "../../assets/wallet.svg";
import swapIcon from "../../assets/swapIcon.png";
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
  // @ts-ignore
  const customChipsInput = React.createRef<ChipsInput>();

  const selectedAddress = currentAccount.selectedAddress;
  let addrs = currentAccount.externalPubAddress.filter(addr => addr.address === selectedAddress);
  console.log('addrs');
  console.log(addrs);
  let relatedTags = addrs[0].tags;
  relatedTags = relatedTags.map(tag => {
    return {label: tag}
  })
  console.log('relatedTags');
  console.log(relatedTags);

  const updateSelectedAddress = async addr => {
    if (addr && addr.address) {
      console.log('addr');
      console.log(addr);
      await apiDb.setAccountSelectedAddress(currentAccount.accountName, addr.address);
      const acc = await apiDb.getAccount(currentAccount.accountName);
      dispatch(setCurrentAccount(acc));
    }
  };
  const onCreateTag = (value: string) => {
    console.log('\n\ngg');
    console.log(value);
    apiDb.getAccountTagsByAddress(currentAccount.accountName, selectedAddress).then(tags => {
      let updatedTags = [];
      if (tags && tags.length){
        updatedTags.push(value)
      } else {
        updatedTags = [value];
      }
      console.log('updatedTags');
      console.log(updatedTags);
      apiDb.setAccountTagsByAddress(currentAccount.accountName, selectedAddress, updatedTags).then(r=>{
        apiDb.getAccount(currentAccount.accountName).then(acc => {
          console.log('account from local');

          let addrs = acc.externalPubAddress.filter(addr => {

            return addr.address === selectedAddress
          });
          console.log('addr2222');
          console.log(addrs);

          dispatch(setCurrentAccount(acc));
        });
      });
    })
    return {label: value};
  }
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
                    onPress={() => Clipboard.setString(selectedAddress)}
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
                    placeholder={addressSlice(selectedAddress, 18) || ''}
                    onChange={item => {
                      updateSelectedAddress(item).then(r => {})
                    }}
                    mode={Picker.modes.SINGLE}
                    rightIconSource={swapIcon}
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
                                    <Text style={{
                                      ...styles.addressList,
                                      fontWeight: (address === selectedAddress ? 'bold' : '')
                                    }}>
                                      {index}.{' '}{addressSlice(address, 20)}
                                    </Text>
                                  </View>
                                </View>
                            );
                          }}
                      />
                  ))}
                </Picker>
                <ChipsInput
                    ref={customChipsInput}
                    containerStyle={{}}
                    placeholder="Enter Tags"
                    chips={relatedTags.length ? relatedTags : [{label: 'house'}] }
                    inputStyle={styles.customInput}
                    onCreateTag={(w) => onCreateTag(w)}
                />


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
  },
  customInput: {
    ...Typography.text60,
    color: Colors.blue30
  },

});

export default ReceiveTokenModal;

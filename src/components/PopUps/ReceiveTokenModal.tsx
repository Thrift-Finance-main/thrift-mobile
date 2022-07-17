import React, {FC, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Linking,
  TouchableOpacity,
  Alert,
  ScrollView,
  Share
} from 'react-native';
import Colors from '../../constants/CustomColors';
import { heightPercentageToDP, widthPercentageToDP } from '../../utils/dimensions';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera'; import Modal from 'react-native-modal'
import ThriftLogo from '../../assets/ThriftLogo.svg';
import ThriftLogo1 from '../../assets/brand/logo-thrift.svg';
import ThriftLogoWhite from '../../assets/ThriftFinancelogo.svg'
import QRImage from '../../assets/QRImage.svg';
import Icon from 'react-native-vector-icons/MaterialIcons'
import {useDispatch, useSelector} from "react-redux";
import {addressSlice} from "../../utils";
//import Clipboard from '@react-native-community/clipboard';
import Scan from "../QrCodeCamera";
import Clipboard from '@react-native-clipboard/clipboard';
import {
  Chip,
  ChipsInput,
  Dialog,
  DialogProps,
  PanningProvider,
  Picker,
  PickerProps,
  Typography
} from "react-native-ui-lib";
import WalletIcon from "../../assets/wallet.svg";
import swapIcon from "../../assets/swapIcon.png";
import {apiDb} from "../../db/LiteDb";
import {setCurrentAccount} from "../../store/Action";
import QRCode from 'react-native-qrcode-generator';
import {translate} from "../../i18n";

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
  let addrs = currentAccount.externalPubAddress.filter(addr => addr.address === selectedAddress.address);
  let relatedTags = addrs[0].tags;


  relatedTags = relatedTags.map(tag => {
    return {label: tag}
  })

  const copyToClipboard = async (text:string) => {
    await Clipboard.setString(text);
  };
  const updateSelectedAddress = async addr => {
    if (addr && addr.address) {
      await apiDb.setAccountSelectedAddress(currentAccount.accountName, addr);
      const acc = await apiDb.getAccount(currentAccount.accountName);
      dispatch(setCurrentAccount(acc));
    }
  };
  const onCreateTag = (value: string) => {
    apiDb.getAccountTagsByAddress(currentAccount.accountName, selectedAddress.address).then((tags:string[]) => {

        let updatedTags = [...tags, value];
        apiDb.setAccountTagsByAddress(currentAccount.accountName, selectedAddress.address, updatedTags).then(r=>{
          apiDb.getAccount(currentAccount.accountName).then(acc => {
            dispatch(setCurrentAccount(acc));
          });
        });
    });
    return {label: value};
  }
  const onTagPress = (tagIndex: number, markedTagIndex: number) => {
    if (markedTagIndex !== undefined){
      apiDb.getAccountTagsByAddress(currentAccount.accountName, selectedAddress.address).then(tags => {
        let updatedTags = tags.filter((tag, index)=> index !== markedTagIndex );
        apiDb.setAccountTagsByAddress(currentAccount.accountName, selectedAddress.address, updatedTags).then(r=>{
          apiDb.getAccount(currentAccount.accountName).then(acc => {
            dispatch(setCurrentAccount(acc));
          });
        });
      })
    }

    customChipsInput.current?.markTagIndex(tagIndex === markedTagIndex ? undefined : tagIndex);
  };
  const onShare = async () => {
    console.log('onShare')
    try {
      /*
      const result = await Share.share({
        title: 'App link',
        message: 'Please install this app and stay safe , AppLink :https://play.google.com/store/apps/details?id=nic.goi.aarogyasetu&hl=en',
        url: 'https://play.google.com/store/apps/details?id=nic.goi.aarogyasetu&hl=en'
      });*/
      const result = await Share.share({
        message: 'Public Address:   '+selectedAddress.address,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
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
                            <ThriftLogo1
                                style={{
                                }}
                            />
                            :
                            <ThriftLogo1
                                style={{
                                }}
                            />
                        }
                        </View>
                      {!props.QRScanner ?
                      <View style={{
                        marginTop : heightPercentageToDP(3),
                        padding: 14,
                        backgroundColor: 'white',
                        borderRadius: 10,
                        minHeight: 240
                      }} >
                        <QRCode
                            value={selectedAddress.address}
                            size={200}
                            bgColor='black'
                            fgColor='white'/>
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
                              onPress={() => copyToClipboard(selectedAddress.address)}
                              style={{
                                alignSelf: "center", marginTop: heightPercentageToDP(1),
                                height: heightPercentageToDP(4.5),
                                width: widthPercentageToDP(15),
                                borderRadius: 5,
                                backgroundColor: "#F338C2",
                                justifyContent: "center",
                              }}
                            >
                              <Text
                                style={{ textAlign: "center", color: Colors.white, fontFamily: 'AvenirNextCyr-Medium', }}
                              >{translate("Receive.Copy")}</Text>

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
                      backgroundColor: '#F338C2',
                      justifyContent: "center",
                      marginBottom: heightPercentageToDP(2)
                    }}
                    onPress={() => copyToClipboard(selectedAddress.address)}
                >
                  <Text

                      style={{ textAlign: "center", color: Colors.white, fontFamily: 'AvenirNextCyr-Medium', }}
                  >{translate("Receive.Copy")}</Text>

                </TouchableOpacity>
                <View style={{width : widthPercentageToDP(10)}} />
                <TouchableOpacity
                    //  onPress={props.onBackIconPress}
                    onPress={()=> onShare()}
                    style={{
                      alignSelf: "center", marginTop: heightPercentageToDP(1),
                      height: heightPercentageToDP(4.5),
                      width: widthPercentageToDP(20),
                      borderRadius: 5,
                      backgroundColor: Colors.color7,
                      justifyContent: "center",
                      marginBottom: heightPercentageToDP(2),
                      borderColor: '#F338C2',
                      borderWidth: 1
                    }}
                >
                  <Text

                      style={{ textAlign: "center", color: '#F338C2', fontFamily: 'AvenirNextCyr-Medium', }}
                  >{translate("Receive.Share")}</Text>

                </TouchableOpacity>
              </View>

              <View style={{flexDirection : 'row', paddingHorizontal : widthPercentageToDP(20), justifyContent : 'center'}} >

              </View>
              <Picker
                    placeholder={addressSlice(selectedAddress.address, 18) || ''}
                    onChange={item => {
                      updateSelectedAddress(item).then(r => {})
                    }}
                    mode={Picker.modes.SINGLE}
                    rightIconSource={swapIcon}
                    renderCustomModal={renderDialog}
                    style={{color: 'black', fontSize: 14, textAlign: 'center', fontFamily: 'AvenirNextCyr-Medium'}}
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
                                  <View style={{
                                    flex: 1,
                                    height: 46
                                  }}>

                                    <Text style={{
                                      ...styles.addressList,
                                      fontWeight: (address === selectedAddress.address ? 'bold' : '')
                                    }}>

                                      {addressSlice(address, 20)}
                                    </Text>
                                    <Text style={{
                                      ...styles.addressListTags,
                                      fontWeight: (address === selectedAddress.address ? 'bold' : '')
                                    }}>
                                      {a.tags.map(tag => {
                                        return '#'+tag+' '
                                      })}
                                    </Text>
                                  </View>
                            );
                          }}
                      />
                  ))}
                </Picker>
                <ChipsInput
                    ref={customChipsInput}
                    containerStyle={{}}
                    placeholder="Enter #Tag"
                    chips={relatedTags}
                    inputStyle={styles.customInput}
                    onCreateTag={(w) => onCreateTag(w)}
                    onTagPress={onTagPress}
                    disableTagAdding={selectedAddress.index === 0 || relatedTags.length > 0}
                    disableTagRemoval={selectedAddress.index === 0 || relatedTags.length === 0}
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
    fontFamily: 'AvenirNextCyr-Demi',
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
    fontFamily: 'AvenirNextCyr-Medium',
    marginBottom: -heightPercentageToDP(1)
  },
  camerStyle: {
    flex : 1
  },
  bottomContent: {
    paddingHorizontal: widthPercentageToDP(2),
    marginTop: heightPercentageToDP(1)
  },
  addressList: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: heightPercentageToDP(1),
    fontFamily: 'AvenirNextCyr-Medium',
  },
  addressListTags: {
    textAlign: 'center',
    opacity: 0.8,
    fontFamily: 'AvenirNextCyr-Medium',
    marginBottom: heightPercentageToDP(2)
  },
  addressListTitle: {
    fontFamily: 'AvenirNextCyr-Demi',
    marginBottom: heightPercentageToDP(1)
  },
  customInput: {
    color: Colors.blue30,
    fontFamily: 'AvenirNextCyr-Medium',
  },

});

export default ReceiveTokenModal;

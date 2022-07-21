import React, {FC, useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Image, FlatList, Linking} from 'react-native';
import Colors from '../../constants/CustomColors';
import { heightPercentageToDP, widthPercentageToDP } from '../../utils/dimensions';
import Button from '../Common/Button';
import Modal from 'react-native-modal'
import {RECEIVE_TX, SELF_TX, SEND_TX} from "../../lib/transactions";
import {addressSlice} from "../../utils";
import {EXPLORER_TX_URL_MAINNET, EXPLORER_TX_URL_TESTNET} from "../../constants/explorer";
import moment from "moment";
import BigNumber from "bignumber.js";
import {translate} from "../../i18n";
import {useSelector} from "react-redux";
import {Chip} from "react-native-ui-lib";
interface TransactionDetailsModalProps {
  visible: boolean,
  hideModal: () => void,
  modalText: string,
  isBlackTheme: any,
  data: any
}
const TransactionDetailsModal: FC<TransactionDetailsModalProps> = (props) => {
  const currentAccount = useSelector((state) => state.Reducers.currentAccount);

  const [outToShow, setOutToShow] = useState([]);
  const [inToShow, setInToShow] = useState([]);
  const [notTagIn, setNotTagIn] = useState(0);
  const [notTagOut, setNotTagOut] = useState(0);
  const [extOutputs, setExtOutputs] = useState(0);
  const [extInputs, setExtInputs] = useState(0);

  const useIsMounted = () => {
    const isMounted = useRef(false);
    // @ts-ignore
    useEffect(() => {
      isMounted.current = true;
      return () => (isMounted.current = false);
    }, []);
    return isMounted;
  };

  const isMounted = useIsMounted();

  useEffect(() => {

    console.log('props.data');
    console.log(props.data);
    if (props.data && props.data.type){

      const item = props.data;
      console.log('item');
      console.log(item);

      const inputOwnAddresses = item && item.inputs && item.inputs.usedAddresses || [];
      const inputOtherAddresses = item && item.inputs && item.inputs.otherAddresses || [];
      const outputOwnAddresses = item && item.inputs && item.outputs.usedAddresses || [];
      const outputOtherAddresses = item && item.outputs && item.outputs.otherAddresses || [];

      let chipsInput: any[] = [];
      let notTaggedChipsInput = [];
      let chipsOutput = [];
      let notTaggedChipsOutput = [];

      const allAddresses = [...currentAccount.externalPubAddress, ...currentAccount.internalPubAddress]

      inputOwnAddresses.map(input => {
        const address = allAddresses.filter(addr => addr.address === input.address)[0]
        console.log('address');
        console.log(address);
        const tags = address && address.tags || [];
        if (tags.length){
          chipsInput = [...chipsInput, ...tags]
        } else {
          notTaggedChipsInput.push(address)
        }
      });

      outputOwnAddresses.map(input => {
        const address = allAddresses.filter(addr => addr.address === input.address)[0]
        const tags = address && address.tags || [];
        if (tags.length){
          chipsOutput = [...chipsInput, ...tags]
        } else {
          notTaggedChipsOutput.push(address)
        }
      });

      let outputToShow = [];
      let inputToShow = [];
      let notTaggedInputs = 0;
      let notTaggedOutputs = 0;
      let externalOutputs = 0;
      let externalInputs = 0;

      if (item.type === SEND_TX){

        // Output External
        outputToShow.push("External")
        externalOutputs = outputOtherAddresses.length;

        // Input Own
        inputToShow = chipsInput;
        if (notTaggedChipsInput.length){
          inputToShow.push("NotTagged")
          notTaggedInputs = notTaggedChipsInput.length;
        }

      }  else if (item.type === RECEIVE_TX){

        // External Input
        inputToShow.push("External");
        externalInputs = inputOtherAddresses.length;

        // Own Output
        outputToShow = chipsOutput;
        if (notTaggedChipsOutput.length){
          outputToShow.push("NotTagged")
          notTaggedOutputs = notTaggedChipsInput.length;
        }

      }  else if (item.type === SELF_TX){

        // Input Own
        inputToShow = chipsInput;
        if (notTaggedChipsInput.length){
          inputToShow.push("NotTagged")
          notTaggedInputs = notTaggedChipsInput.length;
        }

        // Own Output
        outputToShow = chipsOutput;
        if (notTaggedChipsOutput.length){
          outputToShow.push("NotTagged")
          notTaggedOutputs = notTaggedChipsInput.length;
        }

      }


      console.log('outputToShow');
      console.log(outputToShow);
      setOutToShow(outputToShow);
      console.log('inputToShow');
      console.log(inputToShow);
      setInToShow(inputToShow);
      console.log('notTaggedInputs');
      console.log(notTaggedInputs);
      setNotTagIn(notTaggedInputs);
      console.log('notTaggedOutputs');
      console.log(notTaggedOutputs);
      setNotTagOut(notTaggedOutputs)
      console.log('externalOutputs');
      console.log(externalOutputs);
      setExtOutputs(externalOutputs);
      console.log('externalInputs');
      console.log(externalInputs);
      setExtInputs(externalInputs);
    }

    const fetchData = async () => {



    }

    if (isMounted.current) {
      // call the function
      fetchData()
          // make sure to catch any error
          .catch(console.error);
    }



  }, []);

  const getSymbolFromTxType = (type:string) => {
    switch (type) {
      case RECEIVE_TX:
        return '+'
      case SEND_TX:
        return '-'
      default:
        return ''
    }
  }
  const getAmount = () => {
    return props.data && props.data.type === SELF_TX ? '0' : props.data && props.data.amount && props.data.amount.lovelace/1000000;
  }

  let inAddress = null;
  let outAddress = null;

  // TODO: REFACTOR
  if (props.data && props.data.type){

    const item = props.data;

    const inputOwnAddresses = item && item.inputs && item.inputs.usedAddresses || [];
    const inputOtherAddresses = item && item.inputs && item.inputs.otherAddresses || [];
    const outputOwnAddresses = item && item.inputs && item.outputs.usedAddresses || [];
    const outputOtherAddresses = item && item.outputs && item.outputs.otherAddresses || [];

    let chipsInput: any[] = [];
    let notTaggedChipsInput = [];
    let chipsOutput = [];
    let notTaggedChipsOutput = [];

    const allAddresses = [...currentAccount.externalPubAddress, ...currentAccount.internalPubAddress]

    inputOwnAddresses.map(input => {
      const address = (allAddresses.filter(addr => addr.address === input.address))[0]
      console.log('address in input');
      console.log(address);
      const tags = address && address.tags || [];
      if (tags.length){
        chipsInput = [...chipsInput, ...tags]
        chipsInput = [...new Set(chipsInput)];
      } else {
        notTaggedChipsInput.push(address)
      }
    });

    outputOwnAddresses.map(input => {
      const address = (allAddresses.filter(addr => addr.address === input.address))[0]
      console.log('address in output');
      console.log(address);
      const tags = address && address.tags || [];
      console.log(tags);
      if (tags.length){
        chipsOutput = [...chipsOutput, ...tags]
        chipsOutput = [...new Set(chipsOutput)];
      } else {
        notTaggedChipsOutput.push(address)
      }
    });

    let outputToShow = [];
    let inputToShow = [];
    let notTaggedInputs = 0;
    let notTaggedOutputs = 0;
    let externalOutputs = 0;
    let externalInputs = 0;

    if (item.type === SEND_TX){
      //console.log('SEND_TX');

      // Output External
      outputToShow.push("External")
      externalOutputs = outputOtherAddresses.length;

      // Input Own
      inputToShow = chipsInput;
      if (notTaggedChipsInput.length){
        inputToShow.push("NotTagged")
        notTaggedInputs = notTaggedChipsInput.length;
      }

    }  else if (item.type === RECEIVE_TX){
      //console.log('RECEIVE_TX');
      // External Input
      inputToShow.push("External");
      externalInputs = inputOtherAddresses.length;

      // Own Output
      outputToShow = chipsOutput;
      if (notTaggedChipsOutput.length){
        outputToShow.push("NotTagged")
        notTaggedOutputs = notTaggedChipsOutput.length;
      }

    }  else if (item.type === SELF_TX){

      // Input Own
      inputToShow = chipsInput;
      if (notTaggedChipsInput.length){
        inputToShow.push("NotTagged")
        notTaggedInputs = notTaggedChipsInput.length;
      }
      console.log("chipsInput");

      // Own Output
      outputToShow = chipsOutput;
      if (notTaggedChipsOutput.length){
        outputToShow.push("NotTagged")
        notTaggedOutputs = notTaggedChipsOutput.length;
      }

    }

    inAddress = inputToShow.map(inp => {
      if (inp !== "NotTagged" && inp !== "External"){
        return <Chip
            key={inp}
            label={inp}
            containerStyle={{
              marginVertical: 2,
              marginRight: 4,
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: 'gray',
            }}
            labelStyle={{fontFamily: 'AvenirNextCyr-Medium', fontSize: 14}}
        />
      } else  {
        return <Chip
            key={inp}
            label={translate("Send."+inp)}
            containerStyle={{
              marginRight: 4,
              marginVertical: 2,
              backgroundColor: 'white',
              borderWidth:  1,
              borderColor: 'gray',
            }}
            badgeProps={{
              label: inp === "NotTagged" ? notTaggedInputs.toString() : externalInputs.toString(),
              backgroundColor: '#603EDA',
            }}
            labelStyle={{fontFamily: 'AvenirNextCyr-Medium', fontSize: 14}}
        />
      }
    });

    outAddress = outputToShow.map(out => {
      if (out !== "NotTagged" && out !== "External"){
        return <Chip
            key={out}
            label={out}
            containerStyle={{
              marginVertical: 2,
              marginRight: 4,
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: 'gray',
            }}
            labelStyle={{fontFamily: 'AvenirNextCyr-Medium', fontSize: 14}}
        />
      } else  {
        return <Chip
            key={out}
            label={translate("Send."+out)}
            containerStyle={{
              marginRight: 4,
              marginVertical: 2,
              backgroundColor: 'white',
              borderWidth:  1,
              borderColor: 'gray',
            }}
            badgeProps={{
              label: out === "NotTagged" ? notTaggedOutputs.toString() : externalOutputs.toString(),
              backgroundColor: '#603EDA',
            }}
            labelStyle={{fontFamily: 'AvenirNextCyr-Medium', fontSize: 14}}
        />
      }
    });


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
          <Text
            style={{
              ...styles.topTitle, color:
                props.isBlackTheme ? Colors.white :
                  Colors.black,
            }}
          >{translate("TransactionDetails.TransactionDetails")}</Text>

          <View
            style={{ paddingHorizontal: widthPercentageToDP(10), width: "100%", paddingVertical: heightPercentageToDP(1) }}
          >
            <Text
              style={{ color: Colors.authTitle }}

            >{translate("TransactionDetails.Amount")}</Text>
            <Text
              style={{ marginTop: heightPercentageToDP(0.5), color: props.isBlackTheme ? Colors.white : Colors.black }}
            >{props.data && props.data.type && getSymbolFromTxType(props.data.type)}{getAmount()}</Text>
          </View>
          <View
            style={{ paddingHorizontal: widthPercentageToDP(10), width: "100%", paddingVertical: heightPercentageToDP(1) }}
          >
            <Text
              style={{ color: Colors.authTitle }}

            >{translate("TransactionDetails.Fee")}</Text>
            <Text
              style={{ marginTop: heightPercentageToDP(0.5), color: props.isBlackTheme ? Colors.white : Colors.black }}
            >{props.data && props.data.amount && props.data.fees/1000000}</Text>
          </View>
          <View
            style={{ paddingHorizontal: widthPercentageToDP(10), width: "100%", paddingVertical: heightPercentageToDP(1) }}
          >
            <Text
              style={{ color: Colors.authTitle }}

            >{translate("TransactionDetails.From")}</Text>
            <View
                style={{flexDirection:'row', flexWrap:'wrap', marginTop: 8, marginLeft: 12}}
            >{inAddress}</View>
          </View>
          <View
            style={{ paddingHorizontal: widthPercentageToDP(10), width: "100%", paddingVertical: heightPercentageToDP(1) }}
          >
            <Text
              style={{ color: Colors.authTitle }}

            >{translate("TransactionDetails.To")}</Text>
            <View
                style={{flexDirection:'row', flexWrap:'wrap', marginTop: 8, marginLeft: 12}}

            >{outAddress}</View>

          </View>
          <View
            style={{ paddingHorizontal: widthPercentageToDP(10), width: "100%", paddingVertical: heightPercentageToDP(1) }}
          >
            <Text
              style={{ color: Colors.authTitle }}

            >{translate("TransactionDetails.Date")}</Text>
            <Text
              style={{ marginTop: heightPercentageToDP(0.5), color: props.isBlackTheme ? Colors.white : Colors.black }}

            >{props.data && props.data.blockTime ? moment(props.data.blockTime).format("DD-MM-YYYY hh:mm") : ''}</Text>
          </View>
          <View
            style={{ paddingHorizontal: widthPercentageToDP(10), width: "100%", paddingVertical: heightPercentageToDP(1) }}
          >
            <Text
              style={{ color: Colors.authTitle }}

            >{translate("TransactionDetails.Hash")}</Text>
            <Text
                onPress={()=>{ Linking.openURL(props.data && props.data.txHash && EXPLORER_TX_URL_TESTNET+props.data.txHash)}}
              style={{ marginTop: heightPercentageToDP(0.5), color: props.isBlackTheme ? Colors.white : Colors.black }}

            >{addressSlice(props.data && props.data.txHash ? props.data.txHash : '', 20)}</Text>
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

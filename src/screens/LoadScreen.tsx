import React, {FC} from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import Colors from '../constants/CustomColors';
import {heightPercentageToDP, widthPercentageToDP} from '../utils/dimensions';
import Back from '../assets/back.svg';
import DarkBack from '../assets/DarkBack.svg';
import Bulb from '../assets/Bulb.svg';
import Key from '../assets/Key.svg';
import Caution from '../assets/Caution.svg';
import CustomColors from "../constants/CustomColors";
import { Button } from 'react-native-ui-lib';

const LoadScreen = ({navigation, route}) => {
  const isBlackTheme = useSelector(state => state.Reducers.isBlackTheme);

  const onBackIconPress = () => {
    navigation.goBack();
  };
  const onContinuePress = () => {
    navigation.navigate('CopyPhrase', route.params);
  };
  return (
    <SafeAreaView
      style={{
        ...styles.mainContainer,
        backgroundColor: isBlackTheme
          ? Colors.blackTheme
          : Colors.inputFieldBackground,
      }}>
      <View style={styles.accountsContainer}>
        <Key />
        <Text style={styles.termsText}>
         Loading
        </Text>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: '100%',
  },
  secondaryContainer: {
    paddingHorizontal: widthPercentageToDP(6),
  },
  imageStyle: {
    width: widthPercentageToDP(100),
    height: heightPercentageToDP(10),
    alignSelf: 'center',
  },
  accountsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: widthPercentageToDP(3),
  },
  termsText: {
    color: Colors.hintsColor,
    fontSize: 14,
    paddingHorizontal: widthPercentageToDP(8),
    lineHeight: 20,
  },
  buttonStyle: {
    width: widthPercentageToDP(80),
    height: heightPercentageToDP(8),
    borderRadius: 9,
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20
  },
  buttonTitleStyle: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 12
  }
});
export default LoadScreen;

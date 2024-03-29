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
import {translate} from "../i18n";

const TermsScreen = ({navigation, route}) => {
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
      <ScrollView>
        <View style={styles.secondaryContainer}>
          {isBlackTheme ? (
            <DarkBack
              style={{marginTop: heightPercentageToDP(3)}}
              onPress={onBackIconPress}
            />
          ) : (
            <Back
              style={{marginTop: heightPercentageToDP(3)}}
              onPress={onBackIconPress}
            />
          )}
          <View
            style={{
              paddingVertical: heightPercentageToDP(12),
              marginTop: heightPercentageToDP(2),
            }}>
            <Image
              source={require('../assets/Warning.png')}
              resizeMode="contain"
              style={styles.imageStyle}
            />
          </View>
          <View style={styles.accountsContainer}>
            <Key />
            <Text style={styles.termsText}>
              {translate("Tips.Tip0")}
            </Text>
          </View>
          <View
            style={{
              ...styles.accountsContainer,
              marginTop: heightPercentageToDP(3.5),
            }}>
            <Bulb />
            <Text style={styles.termsText}>
              {translate("Tips.Tip1")}
            </Text>
          </View>
          <View
            style={{
              ...styles.accountsContainer,
              marginTop: heightPercentageToDP(3.5),
            }}>
            <Caution />
            <Text style={styles.termsText}>
              {translate("Tips.Tip2")}
            </Text>
          </View>
          <View style={{height: heightPercentageToDP(6)}} />
          <Button
              label={translate("Common.IUnderstand")}
              borderRadius={5}
              size={Button.sizes.large}
              text60
              labelStyle={{fontSize: 14, fontFamily: 'AvenirNextCyr-Demi', letterSpacing: 2, textAlign: "center"}}
              style={styles.buttonStyle}
              backgroundColor={CustomColors.primaryButton}
              disabled={false}
              enableShadow
              animateLayout
              onPress={() => onContinuePress()}
          />
        </View>
      </ScrollView>
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
    fontFamily: 'AvenirNextCyr-Medium',
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
    fontFamily: 'AvenirNextCyr-Demi',
    fontSize: 12
  }
});
export default TermsScreen;

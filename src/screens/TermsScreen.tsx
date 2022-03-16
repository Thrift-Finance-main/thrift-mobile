import React, {FC} from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import Colors from '../constants/Colors';
import {heightPercentageToDP, widthPercentageToDP} from '../utils/dimensions';
import Button from '../components/Common/Button';
import Back from '../assets/back.svg';
import DarkBack from '../assets/DarkBack.svg';
import Bulb from '../assets/Bulb.svg';
import Key from '../assets/Key.svg';
import Caution from '../assets/Caution.svg';

const TermsScreen = ({navigation}) => {
  const isBlackTheme = useSelector(state => state.Reducers.isBlackTheme);

  const onBackIconPress = () => {
    navigation.goBack();
  };
  const onUnderstandPress = () => {
    navigation.navigate('CopyPhrase');
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
          <View style={styles.termsContainer}>
            <Key />
            <Text style={styles.termsText}>
              The recovery phrase serves as the {'\n'}only access to your
              account.
            </Text>
          </View>
          <View
            style={{
              ...styles.termsContainer,
              marginTop: heightPercentageToDP(3.5),
            }}>
            <Bulb />
            <Text style={styles.termsText}>
              Thrift finance team will never ask you {'\n'}for your recovery
              phrase.
            </Text>
          </View>
          <View
            style={{
              ...styles.termsContainer,
              marginTop: heightPercentageToDP(3.5),
            }}>
            <Caution />
            <Text style={styles.termsText}>
              If you lose your reovery phrase even {'\n'}Thrift finance can’t
              get it back.
            </Text>
          </View>
          <View style={{height: heightPercentageToDP(12)}} />
          <Button
            backgroundColor={Colors.primaryButton}
            buttonTitle="I Understand"
            onPress={onUnderstandPress}
            titleTextColor={isBlackTheme ? Colors.black : Colors.white}
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
  termsContainer: {
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
});
export default TermsScreen;

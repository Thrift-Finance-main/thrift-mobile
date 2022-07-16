import React, {FC} from 'react';
import {View, Text, StyleSheet, Image, ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import Colors from '../constants/CustomColors';
import {heightPercentageToDP, widthPercentageToDP} from '../utils/dimensions';

const LoadScreen = ({navigation, route}) => {
  const isBlackTheme = useSelector(state => state.Reducers.isBlackTheme);
  const currentAccount = useSelector((state) => state.Reducers.currentAccount);

  const onBackIconPress = () => {
    navigation.goBack();
  };
  const onContinuePress = () => {
    if (currentAccount.accountName && currentAccount.accountName.length){
      navigation.navigate('DashboardTab', route.params);
    }

  };
  return (
    <SafeAreaView
      style={{
        ...styles.mainContainer,
        backgroundColor: isBlackTheme
          ? Colors.blackTheme
          : Colors.inputFieldBackground,
      }}>
      <TouchableOpacity onPress={onContinuePress} style={styles.loadingContainer}>
        <Image

            source={require("../assets/logo-thrift.png")}
            resizeMode='contain'
            style={styles.imageStyle}
        />
        <View style={{height: 32}}/>
        <Image

            source={require("../assets/ariob.png")}
            resizeMode='contain'
            style={styles.imageStyle}
        />
      </TouchableOpacity>
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
  loadingContainer: {
    alignItems: 'center',
    paddingTop: '50%',
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

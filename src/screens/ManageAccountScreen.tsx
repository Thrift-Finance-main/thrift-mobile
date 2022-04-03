import React from 'react';
import { StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Colors from '../constants/CustomColors';
import {heightPercentageToDP, widthPercentageToDP} from '../utils/dimensions';
import ManageAccount from "../components/ManageAccount";

const ManageAccountScreen = ({navigation, route}) => {
  const isBlackTheme = useSelector(state => state.Reducers.isBlackTheme);

  const onBackIconPress = () => {
    navigation.goBack();
  };

  const onContinuePress = () => {
    //hideShowLanguageModal();
    console.log('onContinuePress in ManageAccountScreen')
    navigation.navigate("Language")
  }
  const onCreateAccountPress = () => {
    //hideShowLanguageModal();
    console.log('onCreateAccountPress');
    console.log(route.params);
    navigation.navigate("CreateAccount", {fromScreen: 'CreateAccount'})
  }
  const onRestoreAccountPress = () => {
    navigation.navigate("CreateAccount", {
      fromScreen: "RestoreAccount"
    });
  }
  return (
    <ManageAccount
        fromScreen={"DashboardTab"}
        isBlackTheme={isBlackTheme}
        onBackIconPress={onBackIconPress}
        onContinuePress={() => onContinuePress}
        onCreateAccountPress={onCreateAccountPress}
        onRestoreAccountPress={onRestoreAccountPress}
        navigation={navigation}
    >


    </ManageAccount>
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
export default ManageAccountScreen;

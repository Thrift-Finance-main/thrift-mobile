import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {useDispatch, useSelector} from 'react-redux';
import {setTheme} from './../../store/Action';
import {Colors} from "react-native-ui-lib/core";

let Header = ({backHandler, headerTitle}, props: any) => {
  const isBlackTheme = useSelector(state => state.Reducers.isBlackTheme);
  const dispatch = useDispatch();
  useEffect(() => {
    SplashScreen.hide();
    checkTheme();
  }, []);
  const checkTheme = async () => {
    let isBlackTheme = await AsyncStorage.getItem('isBlackTheme');
    console.log('shhshs', isBlackTheme);

    if (isBlackTheme == null) {
      dispatch(setTheme(false));
    } else {
      dispatch(setTheme(isBlackTheme == '0' ? true : false));
    }
  };
  return (
    <View style={styles._header_main}>
      <TouchableOpacity style={styles._header_back} onPress={backHandler}>
        <Ionicons
          name="chevron-back"
          size={30}
          color={props.isBlackTheme ? Colors.white : Colors.black}
        />
      </TouchableOpacity>
      <Text
        style={[
          styles._header_title,
          {color: props.isBlackTheme ? Colors.white : Colors.black},
        ]}>
        {headerTitle}
      </Text>
      <View style={styles._header_back} />
    </View>
  );
};
let styles = StyleSheet.create({
  _header_main: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  _header_back: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  _header_title: {
    color: '#000',
    fontSize: 18,
    fontFamily: 'AvenirNextCyr-Demi',
  },
});
export default Header;

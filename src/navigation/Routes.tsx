import React from 'react';
import {View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector} from 'react-redux';
import Colors from '../constants/CustomColors';
import LanguageScreen from '../screens/LanguageScreen';
import AuthenticationScreen from '../screens/AuthenticationScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import TermsScreen from '../screens/TermsScreen';
import CopyPhraseScreen from '../screens/CopyPhraseScreen';

import WalletScreen from '../screens/WalletScreen';
import SmartFiScreen from '../screens/SmartFiScreen';
import SettingsScreen from '../screens/SettingsScreen';
import VerifyPhraseScreen from '../screens/VerifyPhraseScreen';
import CreatePinScreen from '../screens/CreatePinScreen';
import RestoreWalletScreen from '../screens/RestoreWalletScreen';
import ShowQRCodeScreen from '../screens/ShowQRCodeScreen';
import BottomTabBar from './BottomTabBar';
import SecurityScreen from '../screens/SecurityScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import CreateTokenScreen from '../screens/CreateTokenScreen';
import ThumbPrintScreen from '../screens/ThumbPrintScreen';
import CreateTargetScreen from '../screens/CreateTargetScreen';
import SavingsScreen from '../screens/SavingsScreen';
import {ENTRY_WITCH_ROUTE} from "../db/tables";
import MainScreen from "../screens/MainScreen";
import ManageAccountScreen from "../screens/ManageAccountScreen";
import LoadScreen from "../screens/LoadScreen";

const AuthenticationStack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const DashboardTab = () => {
  const isBlackTheme = useSelector(state => state.Reducers.isBlackTheme);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isBlackTheme ? Colors.blackTheme : Colors.white,
      }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false
        }}
        tabBar={props => <BottomTabBar {...props} />}>
        <Tab.Screen name="Wallet" component={WalletScreen} />
        <Tab.Screen name="SmartFi" component={SmartFiScreen} />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{tabBarStyle: {display: 'none'}}}
        />
      </Tab.Navigator>
    </View>
  );
};

export const AuthenticationStackNavigation = () => {
    const entryRoute = useSelector(state => state.Reducers.entryRoute);
  return (
    <AuthenticationStack.Navigator screenOptions={{headerShown: false}}>

      <AuthenticationStack.Screen name="/" component={MainScreen} />
      <AuthenticationStack.Screen name="Language" component={LanguageScreen} />
      <AuthenticationStack.Screen
        name="Authentication"
        component={AuthenticationScreen}
      />
      <AuthenticationStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthenticationStack.Screen
        name="CreateAccount"
        component={CreateAccountScreen}
      />
      <AuthenticationStack.Screen name="ManageAccount" component={ManageAccountScreen} />
      <AuthenticationStack.Screen name="Terms" component={TermsScreen} />
      <AuthenticationStack.Screen
        name="CopyPhrase"
        component={CopyPhraseScreen}
      />
      <AuthenticationStack.Screen
        name="VerifyPhrase"
        component={VerifyPhraseScreen}
      />
      <AuthenticationStack.Screen
        name="CreatePin"
        component={CreatePinScreen}
      />
      <AuthenticationStack.Screen
        name="RestoreWallet"
        component={RestoreWalletScreen}
      />
      <AuthenticationStack.Screen
        name="ShowQRCode"
        component={ShowQRCodeScreen}
      />
      <AuthenticationStack.Screen
        name="DashboardTab"
        component={DashboardTab}
      />
      <AuthenticationStack.Screen name="Security" component={SecurityScreen} />
      <AuthenticationStack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
      />
      <AuthenticationStack.Screen
        name="CreateToken"
        component={CreateTokenScreen}
      />
      <AuthenticationStack.Screen
        name="ThumbPrint"
        component={ThumbPrintScreen}
      />
      <AuthenticationStack.Screen
        name="CreateTarget"
        component={CreateTargetScreen}
      />
      <AuthenticationStack.Screen name="Savings" component={SavingsScreen} />
      <AuthenticationStack.Screen name="Load" component={LoadScreen} />
    </AuthenticationStack.Navigator>
  );
};

import {ISBLACKTHEME, SET_CURRENT_ACCOUNT, SET_CURRENT_PRICE, SET_ENTRY_ROUTE, SET_WALLET_ROUTE} from './ActionTypes';

export const setTheme = (isBlackTheme: any) => {
  return {
    type: ISBLACKTHEME,
    isBlackTheme,
  };
};

export const setCurrentAccount = (currentAccount: any) => {
  return {
    type: SET_CURRENT_ACCOUNT,
    currentAccount,
  };
};

export const setEntryRoute = (entryRoute: any) => {
  return {
    type: SET_ENTRY_ROUTE,
    entryRoute,
  };
};

export const setCurrentPrice= (currentPrice: any) => {
  return {
    type: SET_CURRENT_PRICE,
    currentPrice,
  };
};

export const setWalletRoute = (route: any) => {
  return {
    type: SET_WALLET_ROUTE,
    walletRoute: route,
  };
};

import {ISBLACKTHEME, SET_CURRENT_ACCOUNT} from './ActionTypes';

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

import {ISBLACKTHEME, SET_CURRENT_ACCOUNT, SET_ENTRY_ROUTE} from './ActionTypes';

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

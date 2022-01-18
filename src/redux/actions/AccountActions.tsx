// eslint-disable-next-line import/extensions,import/no-unresolved
import {ACCOUNT_REDUCER} from '../reducers/account/AccountReducer';

// eslint-disable-next-line import/prefer-default-export
export const setCurrentAccount = (currentAccount: any) => {
  return {
    type: ACCOUNT_REDUCER.SET_CURRENT_ACCOUNT,
    payload: currentAccount,
  };
};

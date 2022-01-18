// eslint-disable-next-line import/extensions,import/no-unresolved
import {ACCOUNT_REDUCER} from '../reducers/account/AccountReducer';

// eslint-disable-next-line import/prefer-default-export
export const setCurrentAccount = (currentAccountName: string) => {
  console.log('setCurrentAccount');
  console.log(currentAccountName);
  return {
    type: ACCOUNT_REDUCER.SET_CURRENT_ACCOUNT,
    payload: currentAccountName,
  };
};

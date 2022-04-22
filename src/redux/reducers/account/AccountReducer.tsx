const INITIAL_STATE = {
  currentAccountName: '',
};

export const ACCOUNT_REDUCER = {
  SET_CURRENT_ACCOUNT: 'SET_CURRENT_ACCOUNT',
};

const AccountReducer = (
  state = INITIAL_STATE,
  action: {type: any; payload: any},
) => {
  console.log('AccountReducer');
  console.log(state);
  console.log(action);
  switch (action.type) {
    case ACCOUNT_REDUCER.SET_CURRENT_ACCOUNT:
      return {...state, ...{currentAccountName: action.payload}};
    default:
      return state;
  }
};

export default AccountReducer;

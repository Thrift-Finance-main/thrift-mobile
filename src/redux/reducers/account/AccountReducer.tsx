const INITIAL_STATE = {
  currentAccountName: 0,
};

export const ACCOUNT_REDUCER = {
  SET_CURRENT_ACCOUNT: 'SET_CURRENT_ACCOUNT',
};

const AccountReducer = (state = INITIAL_STATE, action: {type: any}) => {
  switch (action.type) {
    case ACCOUNT_REDUCER.SET_CURRENT_ACCOUNT:
      return {...state, ...{currentAccountName: state.currentAccountName}};
    default:
      return state;
  }
};

export default AccountReducer;

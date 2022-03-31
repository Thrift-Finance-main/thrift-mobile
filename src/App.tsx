import React from 'react';
import {Provider} from 'react-redux';
// eslint-disable-next-line import/extensions,import/no-unresolved
import AppWrapper from './AppWrapper';
// eslint-disable-next-line import/extensions,import/no-unresolved
import configureStore from './redux/reducers/configureStore';
// eslint-disable-next-line import/extensions,import/no-unresolved
import {setCurrentAccount} from './redux/actions/AccountActions';
// eslint-disable-next-line import/extensions,import/no-unresolved

const initApp = () => {
  console.log('\n\n\ninitApp');
  const store = configureStore();
  /*
  realmDb.getCurrentAccount().then(accountName => {
    console.log('accountName in InitApp');
    console.log(accountName);
    store.dispatch(setCurrentAccount(accountName));
    console.log('store');
    console.log(store);
  });

   */

  return store;
};

const store = initApp();
export default function App() {
  return (
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  );
}

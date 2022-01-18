import React from 'react';
import {Provider} from 'react-redux';
import AppWrapper from './src/AppWrapper';
import configureStore from './src/redux/reducers/configureStore';

import './src/i18n';

const store = configureStore();

export default function App() {
  return (
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  );
}

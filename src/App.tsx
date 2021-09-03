import React from 'react';
import AppWrapper from './AppWrapper';
import configureStore from './redux/reducers/configureStore';
import {Provider} from 'react-redux';

const store = configureStore();

export default function App() {
  return (
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  );
}

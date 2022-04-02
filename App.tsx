import React from 'react';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import Reducers from './src/store/Reducers';
import AppWrapper from "./src/AppWrapper";
import { RealmProvider } from './src/db/models/Project';

const rootReducer = combineReducers({
  Reducers,
});

const initApp = () => {
    console.log('\n\n\ninitApp');
    const store = createStore(rootReducer, applyMiddleware(thunk));
    return store;
};
const store = initApp();
const App = () => {
    if (!RealmProvider) {
        return null;
    }
  return (
    <Provider store={store}>
        <RealmProvider>
            <AppWrapper />
        </RealmProvider>
    </Provider>
  );
};
export default App;

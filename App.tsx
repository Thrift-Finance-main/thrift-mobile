import React, {useEffect} from 'react';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider, useDispatch} from 'react-redux';
import thunk from 'redux-thunk';
import Reducers from './src/store/Reducers';
import AppWrapper from "./src/AppWrapper";
import { RealmProvider } from './src/db/models/Project';
import {apiDb} from "./src/db/LocalDb";
import {DEFAULT_CONFIG} from "./src/config/default";
import {setCurrentAccount} from "./src/store/Action";

const rootReducer = combineReducers({
  Reducers,
});
const setConfig = (store) => {
    apiDb.getCurrentConfig().then(currentConfig => {
        console.log('currentConfig');
        console.log(currentConfig);
        if (!currentConfig){
            console.log('Not config currentConfig');
            apiDb.setConfig(DEFAULT_CONFIG).then(r => {});
        } else {
            console.log('Already config currentConfig');
            apiDb.getCurrentAccount(currentConfig.currentAccountName).then(ca => {
                console.log('ca');
                console.log(ca);
                store.dispatch(setCurrentAccount(ca));
                console.log('dispatch currentConfig');
            });
        }
    });
}
const initApp = () => {
    const store = createStore(rootReducer, applyMiddleware(thunk));
    setConfig(store);
    console.log('\n\n\ninitApp');
    return store;
};
const store = initApp();
const App = () => {
    return (
        <Provider store={store}>
            <AppWrapper />
        </Provider>
    );
};
export default App;

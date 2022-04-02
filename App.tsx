import React, {useEffect} from 'react';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider, useDispatch} from 'react-redux';
import thunk from 'redux-thunk';
import Reducers from './src/store/Reducers';
import AppWrapper from "./src/AppWrapper";
import { RealmProvider } from './src/db/models/Project';
import {apiDb} from "./src/db/LocalDb";
import {DEFAULT_CONFIG} from "./src/config/default";
import {setCurrentAccount, setEntryRoute} from "./src/store/Action";
import {ENTRY_WITCH_ROUTE} from "./src/config/routes";

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
            store.dispatch(setEntryRoute(ENTRY_WITCH_ROUTE.LANGUAGE));
        } else {
            console.log('Already config currentConfig');
            console.log('currentAccountName');
            console.log(currentConfig.currentAccountName);
            apiDb.getCurrentAccount(currentConfig.currentAccountName).then(ca => {
                console.log('ca');
                console.log(ca);
                if(!ca){
                    console.log('No accounts');
                    store.dispatch(setEntryRoute(ENTRY_WITCH_ROUTE.LANGUAGE));
                } else {
                    console.log('There are accounts, going to Homeº');
                    store.dispatch(setCurrentAccount(ca));
                    store.dispatch(setEntryRoute(ENTRY_WITCH_ROUTE.HOME_PAGE));
                }
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

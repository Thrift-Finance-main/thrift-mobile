import React, {useEffect} from 'react';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import Reducers from './src/store/Reducers';
import AppWrapper from "./src/AppWrapper";
import {apiDb} from "./src/db/LiteDb";
import {DEFAULT_CONFIG} from "./src/config/default";
import {setCurrentAccount, setEntryRoute} from "./src/store/Action";
import {ENTRY_WITCH_ROUTE} from "./src/config/routes";

const rootReducer = combineReducers({
  Reducers,
});
const setConfig = (store) => {

    //apiDb.removeDb().then(r=>{});

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
            if (!currentConfig.currentAccountName.length){
                console.log('No accounts in config');
                store.dispatch(setEntryRoute(ENTRY_WITCH_ROUTE.LANGUAGE));
            } else {
                apiDb.getCurrentAccount(currentConfig.currentAccountName).then(ca => {
                    console.log('ca');
                    console.log(ca);
                    console.log('There are accounts, going to Homeº');
                    store.dispatch(setCurrentAccount(ca));
                    store.dispatch(setEntryRoute(ENTRY_WITCH_ROUTE.HOME_PAGE));
                });
            }
        }
    });
}
const initApp = () => {
    // clearAll().then(r => {})
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

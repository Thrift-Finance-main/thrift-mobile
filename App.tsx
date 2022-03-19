import React from 'react';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import Reducers from './src/store/Reducers';
import Routes from './src/navigation/Routes';
import configureStore from "./src/redux/reducers/configureStore";
import realmDb from "./src/db/RealmConfig";
import {setCurrentAccount} from "./src/redux/actions/AccountActions";




const rootReducer = combineReducers({
  Reducers,
});

const initApp = () => {
    console.log('\n\n\ninitApp');
    const store = createStore(rootReducer, applyMiddleware(thunk));
    realmDb.getCurrentAccount().then(accountName => {
        console.log('accountName in InitApp');
        console.log(accountName);
    });

    return store;
};
const store = initApp();
const App = () => {
  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
};
export default App;

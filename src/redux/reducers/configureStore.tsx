import {applyMiddleware, createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import reducers from './index';
import thunk from "redux-thunk";
import realmDb from "../../db/RealmConfig";

const INITIAL_STATE = {};
const middleware = [thunk];

function configureStore() {
  return createStore(
    reducers,
    INITIAL_STATE,
    composeWithDevTools(applyMiddleware(...middleware)),
  );
}

export default configureStore;
